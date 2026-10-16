# Data model

Lifted out of `architecture/technical-architecture.drawio` page 4 on 21.09.2026 and
corrected where the code has since decided otherwise. That file's pages 1 to 3 are stale:
they are built around the situation router deleted on 11.09. **Page 4 was the best spec in
the repo**, which is why it is here as text instead of only as a drawing.

PostgreSQL. **Every table a request can reach carries `tenant_id`**, and a row-level security
policy binds it to the caller. That is the whole white-label promise, expressed as a column
rather than as a convention.

## Tables

| Table | Columns | Note |
|---|---|---|
| `tenants` | `id` PK · `name` · `brand_assets` · `default_locale` · `dpa_signed_at` | the provider |
| `seats` | `id` PK · `tenant_id` FK · `kind` family\|hire · `enrolled_at` · `journey_template` · `review_date` | one relocating family |
| `people` | `id` PK · `seat_id` FK · `tenant_id` FK · `role` partner\|employee\|child\|manager · `language` | **the only table with real PII** |
| `messages` | `id` PK · `seat_id` FK · `tenant_id` FK · `direction` in\|out · `channel` · `body_redacted` · `created_at` | redacted **before** insert |
| `cards` | `id` PK · `tenant_id` NULL = the global corpus · `corridor` · `role` · `window_position` · `body` · `version` · `author` | |
| `card_chunks` | `id` PK · `card_id` FK · `tenant_id` FK · `chunk_text` · `embedding vector(1024)` | `tenant_id` denormalised on purpose |
| `flags` | `id` PK · `seat_id` FK · `tenant_id` FK · `kind` · `raised_at` · `claimed_by` · `claimed_at` | the SLA lives in the claim columns |
| `dispatches` | `id` PK · `seat_id` FK · `card_id` FK · `tenant_id` FK · `channel` · `sent_at` · `grounded` bool · `trigger` | scheduler and check-in sends |

## Three corrections the code has already forced

**1. `situations` is dropped.** The drawing has `situations(label, confidence, model_version)`
tying a prediction to an MLflow run. That table existed for the situation router, which was
deleted on 11.09.2026. The situation is now read off the top retrieved chunk's own
`situation` field, so there is no prediction to store and no model version to tie it to.
Decided 21.09.2026.

**2. `flags.kind` loses `risk`.** The enum was `crisis | no_match | risk`. `01-thesis/expose.md`
states the system "holds no record of how a family is coping; crisis detection decides in the
moment whether to hand over and **stores no attribute**". A `risk` flag is an attribute about
a person wearing an event's clothes, and it is the G5 line: the crisis guard decides when to
hand a family back to a human, and it never monitors, scores or records how anyone is coping.

The enum should follow the handover reasons the code already produces, in
`src/companion/agent/tools.py`: `crisis | asked_for_human | individual_case | unspecified`.
`asked_for_human` is the one the drawing never had, and `card_020` is explicit that using the
path "is not an escalation or an admission of anything", so recording an ordinary request as
`crisis` would write a judgement nobody made.

**3. `messages.body_redacted` is the only body column, and that is load-bearing.** It is why
`src/companion/guardrails/pii.py` runs before every other guard: the redacted text is what
the classifier reads, what the prompt is built from, and what is stored. A guard placed after
any of those has already failed.

## Why `tenant_id` is denormalised onto `card_chunks`

Quoted from the drawing, because the reasoning is the point:

> A similarity search is the one query that does not naturally join back to a tenant. If
> `tenant_id` lives only on `cards`, then a vector query has to remember to join, and the day
> someone forgets, one provider's material surfaces inside another provider's family
> conversation. Carrying the column on the chunk row makes the filter unforgettable and makes
> the guarantee testable: **insert two tenants, embed both, query as tenant A, assert zero
> rows from tenant B.**

`Chunk` in `src/companion/retrieval/chunking.py` already denormalises `situation`, `strand`,
`audience` and `journey_months` off the card for the same reason. `tenant_id` joins them when
the store is real.

## Status

**`card_chunks` is built and running**, 21.09.2026, on Postgres 16 with pgvector in local
Docker. 62 rows, ingest idempotent, and the isolation test is in `tests/test_store_pgvector.py`:
insert two tenants, query as A, assert zero rows from B. It skips when no database is
reachable, so the suite still runs without one.

**`vector(768)` was corrected to `vector(1024)`** when the embedding model was chosen. 768
matched `multilingual-e5-base`, which this repo named in two files and argued for in none.
The pinned model is now `bge-m3`. See `docs/retrieval.md`.

The other eight tables are not built. They arrive with the channels and the scheduler.
