# Sources

Every file in this folder that came from somewhere else, where it came from, and what
deliberately stayed behind. Written 21.09.2026, when the project was consolidated out of four
folders into this one.

This file exists so the next scatter does not happen quietly.

## Moved in

| Now | Was | Why it belongs to the build |
|---|---|---|
| `architecture/*.drawio` (5) | `04-side-project/campaigns/architecture/` | always about this product. No script reads them |
| `architecture/archive/companion-runtime.drawio` | `04-side-project/archive/diagrams/` | superseded runtime, kept for its escalation path |
| `docs/product/problem-and-audience.md` | `ideas/relocation-family-companion/focus.md` §1, §3, §4, §5 | the business question and the three buyers. Slides 1 to 3 of both decks |
| `docs/product/market-and-pricing.md` | same `focus.md` §2, plus the arithmetic from `decision-memo.md` | eleven accounts of 1,659, and what the evidence does not support |
| `docs/product/compliance.md` | `ideas/relocation-family-companion/ai-act-and-data.md` | the RDG and GDPR lines are guardrail specs, not marketing |
| `docs/product/cogs.md` | `ideas/relocation-family-companion/cogs.md` | picks the deployment platform and carries the margin argument |
| `private/market-test/campaign.md` | `04-side-project/campaigns/beyond-arrival.md` | the live tracker, quarantined |
| `private/market-test/*` | `ideas/relocation-family-companion/` the prospect list, replies, interviews, wave emails, smoke tests, mom-test review | one place to look, behind a wall. It names companies and one person |

Moved with `git mv`, so `git log --follow` still works on all of it.

## Written here, from material that was scattered

| File | Assembled from |
|---|---|
| `README.md` | rewritten front door |
| `docs/scope.md` | the old README: what ships, deployment, what is still thin |
| `docs/requirements.md` | the old README: the honest certificate mapping |
| `docs/constraints.md` | `01-thesis/pre-registration.md` §1.5 and §1.6, `04-side-project/gates.md` G5, the RDG guardrail, the killed claims, the eval gate thresholds |
| `docs/product/positioning.md` | `ideas/.../summary.md` five messages + the live partners page |
| `docs/product/voice-of-customer.md` | the one reply, the campaign counters, the interview script. Deliberately unnamed: this file is published |
| `docs/product/README.md` | the two contradictions this project carries on purpose |
| `architecture/README.md` | which diagram is canonical, and what each page shows |
| `private/README.md` | the three gates that keep it unpublished |

The old README's eval section was dropped rather than moved. `docs/evals.md` is the fuller
version of the same design and keeping both is how the two drift apart.

## Stayed behind, and why

All in `04-side-project/ideas/relocation-family-companion/`. Each one breaks something
concrete if it moves, so each is named rather than silently skipped.

| Stayed | Breaks |
|---|---|
| `idea.json`, `evidence.jsonl` | `validate.py` and `report.py` read exactly these two paths per idea. The leaderboard row disappears |
| `landing/` incl. `.netlify/state.json` | `check_instrument.py` finds the site id by rglob under `ideas/<slug>/`. Gate G4a, on a site under test until 15.10 |
| `deck/index.html` | read by `validate.py --deck`; generated, never hand-edited |
| `summary.md` | `AGENTS.md` requires one for every idea at T4 |
| `decision-memo.md` | the documented postcondition of the `deep-dive` skill, and the record that G0 to G3 passed |
| `design/`, `retired/b2c-landing/` | historical. `design/canvas/uploads/` is the near-miss of 09.09.2026 |

That folder now carries a `README.md` pointing here.

## Also changed elsewhere, on the same day

- `03-capstones/capstone-1-companion-mvp/` → `capstone-1-relocation-ai-companion/` and
  `Archieve/` → `Archive/`, recorded as renames so history follows the files
- dead paths repointed in `01-thesis/README.md`, `expose.md`, `pre-registration.md`,
  `literature/2026-08-01-tielke-talk.md` and `00-context/citation-queue.md`
- `beyond-the-workshop.md` and `beyond-first-weeks.md` archived; both ideas parked with
  `experiment.outcome` left at `pending`, because neither test was ever run and an unrun
  test logged as missed is a false negative in the funnel
- `04-side-project/campaigns/README.md` rewritten: the layer is dormant

## Corrections made while moving

| Was | Is |
|---|---|
| `docs/timeline.md`: G4 is "4 replies of 20" | 1 commitment of 22, time or money. Re-registered 14.09.2026 |
| `summary.md` header: same stale threshold | same fix |
| old README: `capstone-1-dance/` "dropped pending Sean's confirmation" | deleted in commit `523fd63` |
| old README: "the assignment fails month 4" as the business question | replaced. Unsourced causal claim, killed from the landing page 11.09.2026 |
| old README: "Group work, public repo, shared IP" | solo, published by export |
| `evals/README.md`: 16 of 60 cases | 115: 75 core, 40 adversarial |
