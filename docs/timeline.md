# Capstone 1 — timeline

Mon 21.09 to Fri 16.10.2026. The Gantt view is page 4 of
`../architecture/mvp-agent-architecture.drawio`. This file is the
working version: the checkboxes are the tickets, same discipline as `campaigns/`.

Priority runs top to bottom inside each week. **P1 is the product. P5 is what the course asks for.**
If a week is going badly, the thing that slips is the lowest band, never P1.

## Milestones

| Date | What |
|---|---|
| Mon 21.09 | Start |
| Fri 25.09 | **Baseline 0 runs end to end, with no LLM in it** ✓ met 22.09 |
| Fri 02.10 | **Everything deployed and live.** Build phase closes |
| Mon 05.10 | Mid-term presentation, 7–10 min + Q&A |
| Thu 15.10 | **G4 closes on relocation-family-companion.** 1 commitment of 22, time or money |
| Fri 16.10 | Final presentation, 10 min |

Weeks 1 and 2 build. Weeks 3 and 4 measure and iterate. Nothing new gets built after 02.10.

---

## Week 1 · Mon 21.09 – Fri 25.09

**P1 · the core**
- [x] **20 situation cards, one corridor.** Done = 20 cards, each with situation, what is happening culturally, what to try, what not to do. Written prose, not bullet stubs. *This is the long pole. Start Monday morning.*
- [x] Agent skeleton: LangGraph state machine, one model, hardcoded prompt. Done = it answers one question end to end in a terminal. *Ticked 24.09 from `architecture/status.json`: `test_graph.py`, and 115-case runs in `private/runs/`.*
- [x] Guardrails IN: PII redaction, injection check, crisis classifier. Done = each has a test that fails without it.

**P2 · retrieval**
- [x] Ingest, chunk, embed. Done = cards are in pgvector, one query returns sensible chunks.
- [x] **Baseline 0: retrieval-only, top-1 chunk verbatim, no LLM.** Done = runs against the eval set and produces a score. *Everything later is measured against this.*

**P4 · evaluation**
- [x] Eval set started: **75** core cases drafted (60 planned).
- [x] **Write the 40 adversarial guardrail cases now, before the guardrails are finished.** Writing them after means writing cases your own code passes.
- [ ] Split dev/held-out 70/30 and commit the split. Do not touch held-out again until the mid-term. *Checked 24.09, still open: a separate 24-case `holdout-2026-09-24.jsonl` exists, but `split` is null in all 75 core cases, so `evals/split_cases.py` has not been run on them.*

**P5**
- [x] ~~Repo skeleton, ruff + pytest + pre-commit, one GitHub Action running lint and tests.~~
      Done 21.09. `make check` is the local lane; CI ships with the export.
- [x] ~~Confirm with the coaches that working alone is allowed.~~ Confirmed 21.09.2026. The
      group-work and PM-rotation requirements are waived; the five required deliverables are not.
- [x] **The seven logging fields go in with the agent skeleton**, not after it. `constraints.md` §1. *Ticked 24.09: `TurnRecord`, `test_trace_fields.py`.*
      Retrofitting any one of them re-runs every thesis measurement.

---

## Week 2 · Mon 28.09 – Fri 02.10

**P1 · the core**
- [x] Guardrails OUT: groundedness gate, refusal policy. Done = a non-grounded answer falls back to the card verbatim, and a visa question is refused every time. *Ticked 24.09: fallback in `agent/nodes.py`, `test_guardrails_groundedness.py`, refusal 1.000. Judged groundedness is still unmeasured: that is the week-3 calibration box, not this one.*

**P2 · retrieval**
- [x] Retrieval + tenant scoping. Done = `tenant_id` filters every query, and a cross-tenant query returns zero rows in a test. *Ticked 24.09: `test_a_tenant_never_sees_another_tenants_material`, in both stores.*

**P3 · surfaces**
- [ ] Telegram integration. Done = a message from a phone gets an answer back.
- [x] Browser demo page at `/chat`, served by the same FastAPI app. One static HTML file. *Done 24.09: each guard's verdict shown beside the answer; tier 2 by default, tier 1 as the laptop's offline fallback. Works, looks plain: a redesign is iteration 2, `scope.md` #10.*
- [x] **Deploy to Render free, with Neon.** Done = a message sent from a phone reaches the deployed service, not localhost, and its trace shows in Langfuse Cloud. *Live 25.09: https://beyond-arrival-deploy.onrender.com/chat, passcode-gated, Neon Frankfurt, Groq qwen3.8-27b as crisis check (recall 0.622 against 0.865 locally, disclosed). The Langfuse Cloud trace from Render is not yet confirmed by anyone looking at it.*

**P4 · evaluation**
- [x] Eval set finished: **75 core + 40 adversarial = 115**, all committed.
- [x] EDA: chunk length distribution, cosine score distribution, recall@k curve for k = 1..20. Done = the recall@k plot picks the k you ship.

**P5**
- [ ] Mid-term deck: business question, EDA, baseline numbers, method, next steps.

> **Gate on Fri 02.10.** Everything built by then is what the deck is planned around. Work is
> iterative rather than guillotined: an unfinished P3 item moves to iteration 2 in `scope.md`
> and is reconsidered on its own merits, not deleted because a date passed. Decided 22.09.2026.
> The constraint that stays real is capacity, not the rule: every P5 ticket sits on the same
> person as every P1.

---

## Week 3 · Mon 05.10 – Fri 09.10

- [ ] **Mon 05.10: mid-term presentation.**
- [ ] Scheduler, monthly nudge, in-process APScheduler.
- [ ] Judge calibration: *kappa recorded 25.09: local qwen3:14b **failed**, 0.13 grounded and 0.16 helpful against the 0.6 gate.* 60 hand labels exist (grounded and helpful), and they fit any judge. *Next: Groq qwen3.8-27b, about 10 minutes; Claude as a paid benchmark if it fails. Every judge-based number is reported with its kappa; the judge is optimised for kappa 0.6 or more.*
- [ ] Model comparison: *tiers 1 to 4 ran in full on prompt v3, 24 to 25.09; tier 5 has one case.* baseline 0, local Ollama, mid-tier hosted, frontier paid. Same eval set, one config field changed at a time. *Re-grade once a judge passes, on a clean committed tree.*
- [ ] Iteration begins: prompts, guardrail thresholds, k. Every run tagged with its prompt version in Langfuse. *Tracing live since 24.09: self-hosted Langfuse on the laptop, Cloud EU from Render only.*
- [ ] *Optional:* the intercultural wiki over MCP (`scope.md` #12). The model calls the wiki as a tool instead of RAG pulling from it; compare the two on the same 115 cases. Never ahead of memory or the scheduler.

---

## Week 4 · Mon 12.10 – Fri 16.10

> **Re-planned Mon 12.10** after a week without work. Nothing new gets built before the final;
> what exists becomes a measured comparison, a working demo and a 10-minute deck.
>
> - **Mon 12.10 · model comparison.** Baseline 0, tier 2 and tier 3 on the current code and the
>   live setup, judged by `gemma4:31b` on Ollama Cloud (no Groq), every judged score shown with
>   its kappa. Claude runs it; the table lands in `delivery/final-2026-10-16/`.
> - **Wed 14.10 · presentation prep (Sean).** The GitHub repo for submission and the deck:
>   business question, EDA, the model comparison against baseline 0, the experiment story
>   ("code beats prompts"), the handoff check 0.42 to 0.92 with its "fitted" caveat, limits,
>   next steps (personalisation cases, fresh held-out set, memory). First rehearsal.
> - **Thu 15.10 · second rehearsal, buffer.**
> - **Fri 16.10 · final presentation, 10 min.**
>
> Cut, and said on stage instead: personalisation build (next step), fresh held-out set
> (limitation), judge calibration past kappa 0.38 (the calibration story), memory, scheduler,
> Telegram (iteration 2).

- [ ] Error analysis: confusion between situations, and every missed escalation read individually.
- [ ] Eval gate in CI: escalation recall floor, groundedness non-regression, refusal correctness at 1.0.
- [ ] Held-out set run, second and final look.
- [ ] Final deck: four exhibits only — comparison table, recall@k curve, cost vs groundedness scatter, escalation confusion matrix.
- [ ] Rehearse. Twice.
- [ ] Buffer. It will be used.

> **Thu 15.10: G4 closes.** Your final is the next morning. Wave 1 went out 15.09, so replies
> and any calls land in weeks 1 and 2 rather than in rehearsal week. Wave 2, the remaining 14
> of 22, is still unsent and is a side-project task, not a capstone one.

---

## What to say before someone asks

- The chat window is a demo surface. **The scheduler is the mechanism.** The person in month four does not open apps, which is the finding from the trigger analysis.
- The eval set was written by the person who built the system. The adversarial cases were written first to reduce that, and it is still a limitation.
- 100 cases is small. Differences of a point or two between models are not distinguishable at this n.
