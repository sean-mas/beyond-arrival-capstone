# Architecture

Moved here 21.09.2026 from `04-side-project/campaigns/architecture/`. The diagrams were
always about this product; they sat in the side project because that is where the campaign
layer lived. Open them with draw.io.

## Canonical

**`mvp-agent-architecture.drawio`** is the one to read first and the one to keep current.
Four pages:

| Page | What it shows |
|---|---|
| 1 · MVP architecture | the shipping system: channels, guardrails in, agent, retrieval, guardrails out |
| 2 · Scope options | what was considered and what was cut |
| 3 · Capstone 1 deploy | one FastAPI container on Render free, Neon free Postgres, hosted models, live traces to Langfuse Cloud EU. Updated 25.09.2026. Telegram and WhatsApp are marked as step two |
| **4 · Timeline** | the Gantt. `../docs/timeline.md` is the working version with the tickets; this page is the view |

## Supporting

| File | Pages | What it is for |
|---|---|---|
| `technical-architecture.drawio` | FTI architecture · deployment topology · CI/CD and MLOps loop · data model and tenant isolation | the engineering detail behind page 1. The data-model page is where `tenant_id` scoping is specified |
| `companion-workflow-sketch.drawio` | Companion workflow | the conversation path through one turn |
| `high-level-architecture.drawio` | High level | provider, companion, family. The picture for a non-technical audience, so it is the one for the deck |
| `aftercare-engine.drawio` | Aftercare engine | labelled "SHARED ENGINE, the same code for both ideas" when the second idea was `probation-culture-coach`. That campaign was parked on 21.09.2026, so it is now single-purpose. The label is left as written rather than edited, because it records why the abstraction is where it is |

## Archive

`archive/companion-runtime.drawio` is the superseded runtime: channels, ingress guardrails,
situation router, journey spine, per-tenant vector store, presenter, groundedness gate,
escalation. The situation-router design was dropped on 11.09.2026 when Capstone 1 became the
working product rather than the classifier carve-out. Kept because the escalation path in it
is still the clearest drawing of that mechanism.

## Keeping them honest

A diagram that disagrees with the code is worse than no diagram. When page 1 or page 3 of
the canonical file stops matching `../src/companion/`, fix the file or delete the page. The
deployment page is the one most likely to drift, because it carries platform names and those
are a week-2 decision.
