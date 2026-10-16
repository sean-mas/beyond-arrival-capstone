#!/usr/bin/env bash
# Tiers 2 and 3 in the deployed configuration: no local model anywhere.
#
#   make live            detached; watch with  tail -f logs-live.log
#
# Sean, 29.09.2026: "we are now entering a stage where I want to model a live
# deployed environment. no local models anymore." So the crisis check runs on
# Groq qwen3.8-27b (as on Render), the query embedder is Hugging Face bge-m3
# (the same weights, `make embed-parity`), and only the answer model changes
# between the two runs, both on Ollama Cloud.
#
# Answers only. Judging is `make rejudge`, later, because the judge lives on
# Groq's 200k tokens a day and must pass calibration before its numbers count.
# One after the other, because Ollama Cloud's free plan takes one request at a
# time and two tiers in parallel would queue behind each other anyway.
set -uo pipefail
cd "$(dirname "$0")/.."

PY=$([ -x .venv/bin/python ] && echo .venv/bin/python || echo python3)
export DATABASE_URL=${DATABASE_URL:-postgresql+psycopg://companion:companion@localhost:5432/companion}
export PYTHONPATH=src
export GUARD_PROVIDER=groq GUARD_MODEL=qwen/qwen3.8-27b EMBEDDING_PROVIDER=${EMBEDDING_PROVIDER:-huggingface}

if ! "$PY" evals/codeprint.py >/dev/null && [ "${ALLOW_DIRTY:-0}" != 1 ]; then
  echo "  measurement code is uncommitted: commit first (ALLOW_DIRTY=1 overrides)"
  exit 1
fi
"$PY" evals/budget.py
START=$("$PY" -c 'import sys; sys.path.insert(0,"evals"); import codeprint; print(codeprint.code_digest())')

for tier in ${TIERS:-2 3}; do
  NOW=$("$PY" -c 'import sys; sys.path.insert(0,"evals"); import codeprint; print(codeprint.code_digest())')
  if [ "$NOW" != "$START" ]; then
    echo "  measurement code changed mid-run: stopping before tier $tier"
    exit 2
  fi
  echo "=== tier $tier live · $(date '+%H:%M')"
  "$PY" -u evals/run_generation.py --tier "$tier" --no-judge
done
echo "=== done · $(date '+%H:%M')"
