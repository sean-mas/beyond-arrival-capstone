# Scope

What ships, where it runs, and what is deliberately not built. Carved out of the capstone
README on 21.09.2026; the decision behind it is `00-context/decision-log.md`, 15.09.2026.

Decided 11.09.2026: build the working product, not the classifier carve-out. That supersedes
the situation-router spec, which survives only as a drawing in `../architecture/archive/`.

## What ships at the end of week 4

Split into two iterations on 22.09.2026. The original list promised seven things; four of
them had no code on day 2 of 20, and a scope that promises what it has not started is a
scope that gets discovered rather than managed.

**Iteration 1, committed. This is what the deck is built on.**

| # | Thing | State on 28.09 |
|---|---|---|
| 1 | An LLM agent a relocating family can discuss intercultural topics with | **done.** prompt v3, router sees the material, tiers 1 to 4 run in full |
| 2 | A RAG system a provider can load their own material into | **done.** pgvector, `ingest.py`, tenant-scoped |
| 3 | Guardrails in | **done and measured.** handoff recall 0.865 (fitted), refusal 1.000, PII 8/8 |
| 4 | Guardrails out | **done in code.** Judged groundedness unverified: the judge failed calibration, kappa 0.13 |
| 5 | A measured comparison against a baseline | baseline 0 and tiers 1 to 4 run; quality scores wait on a calibrated judge |
| 6 | A browser chat window, for demonstration only | **done**, local and live on Render |

**Iteration 2, parked and named.** Reconsidered on merit, not deleted by a date.

| # | Thing | Why it is parked |
|---|---|---|
| 7 | Telegram integration | drags a webhook and a bot token behind it, and no eval scores it |
| 8 | A scheduler that nudges without being asked | the product's real differentiator, and the thing no metric in this project measures. Parked reluctantly |
| 9 | Live public deployment | consumes the days generation and the judge need, and nothing grades hosting |
| 10 | Chat UI redesign | added 28.09 by Sean: the demo page does the job and looks it. A presentation surface, and the one thing every coach and classmate sees |
| 11 | Family checklist | added 28.09 by Sean: to-dos and deadlines the family tracks, many of them already written into the cards (register within two weeks, a foreign licence is valid six months). Admin facts, never an attribute about how anyone is coping. The scheduler's reminders will read from it |
| 12 | Intercultural wiki over MCP · **optional** | added 29.09 by Sean: the wiki in `content/Knowledge layer/` (21 files: frameworks, activity cards, scenarios, rubrics, its own gold Q&A) served over MCP as a tool the model chooses to call, a second way to bring knowledge in, tested against RAG on the same cases. Optional, so it never blocks memory or the scheduler. Two cautions before building: the wiki is written for intercultural trainers (global teams, remote collaboration), not for a family in month four, so it needs adapting; and its 7 test items are too few to compare MCP with RAG, so the comparison runs on the 115 cases |

> **Item 9 un-parked 24.09.2026** by Sean: Render, with a hosted embedder and a hosted guard, both measured first. `render.yaml`, and `docs/decisions.md` 24.09.

Item 8 is the honest casualty. Without it this is a companion that answers rather than one
that reaches out, which is a smaller product than the landing page describes. It is parked
because four weeks is four weeks, not because the argument for it got weaker.

Infrastructure is deliberately basic. Capstone 2 makes it production grade.

## Deployment, the easy way

One container, one external database, everything hosted on free tiers. Settled 25.09.2026
in a grilling, and drawn on page 3 of `architecture/mvp-agent-architecture.drawio`.

```
Render free, Frankfurt (one Docker image, render.yaml)
  /chat        the static demo page, served by the same FastAPI app, behind DEMO_PASSCODE
  /api/chat    one turn; in-app rate limit, 20 per visitor per hour, 150 a day
  /healthz
        |                     |                         |
  Neon free Postgres     hosted models, free tiers     Langfuse Cloud EU, Hobby
  + pgvector             answers: Ollama Cloud          live traces only; the evals
                         crisis check: Groq qwen        stay on the laptop's Langfuse
                         search: Hugging Face bge-m3
```

| Decision | Why |
|---|---|
| **Free plans only**, EUR 0 a month | the audience is coaches and classmates, behind the passcode |
| **Sleeps after 15 minutes idle, about a minute to wake** | accepted: open the link before presenting. Pay for Starter the day it goes to a provider |
| **Neon, not Render's Postgres** | Render's free database expires after 30 days and is deleted 14 days later |
| **One container, no CORS** | the code serves `/chat` from FastAPI. The frontend/backend split waits for Capstone 2 |
| **No Redis** | nothing is worth caching at 10 visits a week, and a cached answer must never skip the crisis check. The rate limit is the one thing Redis would have done here |
| **A weaker crisis check than the measured one** | qwen3.8-27b on Groq, recall 0.622 against 0.865 locally, because llama3.1:8b is gone from Groq's free tier. Accepted for this audience, disclosed in the deck, improved later |
| **A quota runs out: the page shows the error** | no hidden fallback, so the demo never behaves differently from what was measured |
| **Live traces to Langfuse Cloud EU** | only when `LANGFUSE_ALLOW_CLOUD` is set, which only `render.yaml` sets. Only the redacted message leaves |

Order of work:

1. Neon: create a free project in Frankfurt, copy its connection string
2. `RENDER_DATABASE_URL=<Neon URL>` in `.env`, then `make ingest-render` loads and checks the cards
3. Render: apply the Blueprint, fill the secrets it asks for (`DATABASE_URL` is the Neon URL)
4. Langfuse Cloud: an EU project for the live site, its two keys into Render
5. Open `/chat`, send one message, find its trace in Langfuse Cloud

Explicitly deferred to Capstone 2: Prefect, MLflow, DVC, Prometheus, Grafana, Evidently, a
separate worker container, GHCR.


## Still thin, stated plainly

- **The corpus is the risk, not the code.** Twenty cards in a voice a family in month four will
  read is the hard part, and it is week 1 or the whole thing is a shell.
- **No provider yet.** Sean is working his network and will otherwise write the content himself.
  Accepted, logged, not re-litigated.
- **Solo, and the repo is published by export.** Decided 21.09.2026, replacing the group-work
  assumption of 15.09, and confirmed as permitted by the coaches the same day. Removes the
  shared-IP risk and leaves a capacity one that is now the live risk: every P5 ticket in
  `timeline.md` sits on the same person as every P1 ticket, with no one to hand the deck to
  while the corpus is still being written. The 02.10 freeze is what protects against it.
- **Chat contradicts the fork-one finding.** The month-four family does not open apps. The chat
  window is a demo surface; the scheduler is the real mechanism. Say that in the presentation
  before a coach says it for you.
