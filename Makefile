# The local half of the three-layer gate. Only CI is a real gate; this is the
# fast feedback that keeps CI green. See docs/constraints.md and
# quality-gate/README.md.

# Every target runs through .venv and sets DATABASE_URL, because handing over a
# bare `python3 evals/...` on 22.09.2026 produced a ModuleNotFoundError on
# httpx: the venv was never on the path. A command that only works when you
# remember two invisible things is a command that gets typed wrong.
PY := $(if $(wildcard .venv/bin/python),.venv/bin/python,python3)
DB := postgresql+psycopg://companion:companion@localhost:5432/companion
E  := DATABASE_URL=$(DB) PYTHONPATH=src

.PHONY: help install check lint types test cards evals up down run export all \
        db ingest ingest-render ingest-check retrieval baseline baseline-judged live rejudge budget tier1 tier1-bg tier2 tier3 tier4 tier5 tier6 overnight preflight codeprint keys watch guardrails holdout-label holdout deploy-check embed-parity langfuse-up langfuse-down langfuse-logs eda \
        judge-sheet judge-label judge-relevance judge-score history game

help:
	@grep -E '^[a-z0-9-]+:.*?##' $(MAKEFILE_LIST) | sed 's/:.*##/\t/'

install:  ## editable install plus dev tools, then the git hooks
	pip install -e ".[dev,eval]"
	pre-commit install

check: lint types test cards  ## everything the fast lane runs

lint:  ## ruff
	$(PY) -m ruff check .
	$(PY) -m ruff format --check .

types:  ## mypy
	$(E) $(PY) -m mypy

test:  ## pytest
	$(E) $(PY) -m pytest --cov=companion --cov-report=term-missing

cards:  ## the corpus must be valid before anything ingests it
	$(PY) content/validate_cards.py

evals:  ## the paid lane. Calls models. Never run from a push hook
	$(E) $(PY) evals/coverage.py

# ---- the database ------------------------------------------------------

db:  ## just Postgres, which is all the evals need
	docker compose up -d db

ingest:  ## cards -> chunks -> vectors -> pgvector. Idempotent
	$(E) $(PY) -m companion.retrieval.ingest

ingest-render:  ## the cards into the Render database. Needs RENDER_DATABASE_URL in .env
	@url="$$(grep -E '^RENDER_DATABASE_URL=' .env | tail -1 | cut -d= -f2- | tr -d '"')"; \
	test -n "$$url" || { echo "  put RENDER_DATABASE_URL=<External Database URL> in .env first"; exit 1; }; \
	DATABASE_URL="$$url" PYTHONPATH=src $(PY) -m companion.retrieval.ingest && \
	DATABASE_URL="$$url" PYTHONPATH=src $(PY) -m companion.retrieval.ingest --check

ingest-check:  ## is the index built from the corpus on disk? exits 1 if not
	$(E) $(PY) -m companion.retrieval.ingest --check

# ---- measurement -------------------------------------------------------

retrieval:  ## recall@k for the shipped embedder and the lexical control
	$(E) $(PY) evals/run_retrieval.py
	$(E) $(PY) evals/run_retrieval.py --tfidf

baseline:  ## baseline 0: top-1 chunk verbatim, no generation model
	$(E) $(PY) evals/run_baseline0.py

baseline-judged:  ## baseline 0, graded by the same judge as the tiers. ~15 min
	$(E) $(PY) evals/run_baseline0.py --judge

guardrails:  ## the 115 cases through the guards. ~2 min, calls the local model
	$(E) $(PY) evals/run_guardrails.py --crisis --core

holdout-label:  ## label the 24 held-out messages blind. Resumable
	$(PY) evals/holdout_label.py

holdout:  ## the held-out set through the frozen guards. The escalation number to quote
	$(E) $(PY) evals/run_guardrails.py --crisis --holdout

tier1:  ## the local generation tier, judged. ~80 min, dies with your shell
	$(E) $(PY) evals/run_generation.py --tier 1 $(ARGS)

tier1-bg:  ## the same run, detached. Survives closing the terminal
	@nohup env $(E) $(PY) evals/run_generation.py --tier 1 > logs-tier1.log 2>&1 &
	@echo "  started. watch it with: make watch"

tier2:  ## hosted, gpt-oss:120b. ~85 min
	$(E) $(PY) evals/run_generation.py --tier 2 $(ARGS)

tier3:  ## hosted, nemotron-3-ultra. ~4 h
	$(E) $(PY) evals/run_generation.py --tier 3 $(ARGS)

tier4:  ## hosted, gemma4:31b. ~15 min
	$(E) $(PY) evals/run_generation.py --tier 4 $(ARGS)

tier5:  ## hosted, mistral ministral-14b. ~1 h when Mistral is responsive
	$(E) $(PY) evals/run_generation.py --tier 5 $(ARGS)

tier6:  ## hosted, deepseek-v4-pro. Needs a topped-up balance
	$(E) $(PY) evals/run_generation.py --tier 6 $(ARGS)

all:  ## EVERYTHING on one commit: guards, baseline, tiers 1-5. Detached
	@nohup bash evals/run_all.sh > logs-all.log 2>&1 &
	@echo "  started. watch it with: make watch  or  tail -f logs-all.log"

overnight:  ## tiers 3, 4 then 5 only. Use `make all` after a guard change
	@nohup bash evals/run_overnight.sh > logs-overnight.log 2>&1 &
	@echo "  started. watch it with: make watch  or  tail -f logs-overnight.log"

live:  ## tiers 2 and 3 as deployed (TIERS=2 for one): Groq qwen guard, HF embedder, no judge. Detached
	@nohup env TIERS="$(TIERS)" bash evals/run_live.sh > logs-live.log 2>&1 &
	@echo "  started. watch it with: tail -f logs-live.log"

rejudge:  ## grade a finished run later: make rejudge RUN=<run_id> [JUDGE=groq:qwen/qwen3.8-27b]
	HOSTED_MIN_INTERVAL_SECONDS=15 $(E) $(PY) -u evals/rejudge.py --run $(RUN) --judge $(or $(JUDGE),groq:qwen/qwen3.8-27b)

budget:  ## hosted tokens spent in the last 24 hours, per model, against Groq's daily limit
	@$(E) $(PY) evals/budget.py

codeprint:  ## fingerprint the code that can move a number; exits 1 if uncommitted
	@$(E) $(PY) evals/codeprint.py

preflight:  ## one call per tier, before committing a night to them
	$(E) $(PY) evals/preflight.py

keys:  ## which hosted tiers are configured
	@$(E) $(PY) -c "from companion.config import settings as s;\
	k = 'set' if s.ollama_cloud_api_key else 'MISSING';\
	print(f'  ollama cloud key: {k}');\
	print(f'    tier 2  {s.tier2_model}');\
	print(f'    tier 3  {s.tier3_model}');\
	print(f'    tier 4  {s.tier4_model}');\
	k2 = 'set' if s.mistral_api_key else 'MISSING';\
	print(f'  mistral key: {k2}');\
	print(f'    tier 5  {s.mistral_model}');\
	k3 = 'set' if s.deepseek_api_key else 'MISSING';\
	print(f'  deepseek key: {k3}');\
	print(f'    tier 6  {s.deepseek_model}')"

watch:  ## how far the newest run has got
	@tail -3 logs-tier1.log 2>/dev/null || true
	@$(E) $(PY) -c "import json,pathlib,datetime;\
	log=sorted(pathlib.Path('private/runs').glob('turns-*.jsonl'))[-1];\
	rows=[json.loads(x) for x in log.read_text().splitlines() if x.strip()];\
	live=[x for x in rows if x.get('run_id')];\
	rid=live[-1]['run_id'];\
	mine=[x for x in live if x['run_id']==rid];\
	last=max(datetime.datetime.fromisoformat(x['created_at']) for x in mine);\
	age=int((datetime.datetime.now(datetime.UTC)-last).total_seconds());\
	print(f'  {rid}: {len(mine)}/115 turns, last {age}s ago' + ('  STALLED OR FINISHED' if age > 180 else ''))"


eda:  ## the plots and the SQL half
	$(E) $(PY) evals/eda.py
	$(E) $(PY) evals/eda_sql.py

history:  ## every measurement this project has taken
	$(E) $(PY) evals/history.py

report:  ## the per-case eval view, in the browser. Local only: it holds answers
	$(PY) evals/report.py && open evals/results/report.html

graph:  ## which case reached which card, in 3D. Writes a local copy and an ids-only one
	$(PY) evals/corpus_graph.py && open evals/results/corpus-graph.html

map:  ## the 3D build map from architecture/status.json. Safe to publish
	$(PY) architecture/build_map.py && open architecture/build-map.html

# ---- the judge ---------------------------------------------------------

judge-sheet:  ## write 30 answers from the newest run for Sean to hand-label
	$(E) $(PY) evals/calibrate_judge.py --sheet

judge-label:  ## label the sheet one answer at a time, with the material shown. Resumable
	$(E) $(PY) evals/judge_label.py

judge-relevance:  ## pass 2 on the same 30: relevant? one concrete next step? Two labels per answer
	$(E) $(PY) evals/judge_label.py --relevance

judge-score:  ## judge the same 30 and report Cohen's kappa
	$(E) $(PY) evals/calibrate_judge.py --score $(ARGS)

up:  ## app plus pgvector, locally
	docker compose up --build

down:
	docker compose down

LF := docker compose -f docker-compose.langfuse.yml --env-file .env.langfuse

deploy-check:  ## build the Render image and import every module inside it. Run before pushing a deploy
	docker build -q -t companion:deploy-check .
	docker run --rm companion:deploy-check python -c "import importlib, pkgutil, companion; \
	mods = [m.name for m in pkgutil.walk_packages(companion.__path__, 'companion.')]; \
	[importlib.import_module(m) for m in mods]; print(f'  {len(mods)} modules import cleanly in the image')"

embed-parity:  ## hosted vs local bge-m3 on every chunk and question. Needs HF_TOKEN. Run before deploying
	$(E) $(PY) evals/embed_parity.py

langfuse-up:  ## self-hosted Langfuse on http://localhost:3100. First run generates .env.langfuse
	@test -f .env.langfuse || { \
	  for v in POSTGRES_PASSWORD CLICKHOUSE_PASSWORD MINIO_PASSWORD REDIS_PASSWORD SALT NEXTAUTH_SECRET; do \
	    echo "LF_$$v=$$(openssl rand -hex 24)"; done; \
	  echo "LF_ENCRYPTION_KEY=$$(openssl rand -hex 32)"; } > .env.langfuse
	$(LF) up -d
	@echo "  Langfuse is starting: http://localhost:3100 (first start takes a minute)"

langfuse-down:  ## stop Langfuse. Traces are kept in its volumes
	$(LF) down

langfuse-logs:  ## follow the Langfuse web container's log
	$(LF) logs -f langfuse-web

demo:  ## the presentation setup: Groq qwen crisis check, local bge-m3, tier 2. http://localhost:8000/chat?demo=fresh
	GUARD_PROVIDER=groq GUARD_MODEL=qwen/qwen3.8-27b EMBEDDING_PROVIDER=ollama $(E) $(PY) -m uvicorn companion.api.app:app --port 8000

run:  ## the app alone, against a database you already have. Demo: http://localhost:8000/chat
	$(E) $(PY) -m uvicorn companion.api.app:app --reload --port 8000

export:  ## build the publishable repository. Runs the privacy gates
	bash publish/export-capstone.sh

game:  ## the river game, set aside (29.09.2026): http://localhost:8001, stills to the site via ?render=1
	@echo "One River on http://localhost:8001  (render mode: http://localhost:8001/?render=1)"
	@$(PY) game/tools/render_capture.py & $(PY) -m http.server 8001 --bind 127.0.0.1 --directory game
