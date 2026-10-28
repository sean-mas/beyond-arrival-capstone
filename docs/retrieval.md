# Retrieval

Built 21.09.2026. This file exists because building it forced eight decisions the specs had
left open, and a decision nobody wrote down is a decision that gets made differently next
week.

## What ships

| | |
|---|---|
| Embedding model | **`bge-m3`** via Ollama, 1024-dim, **pinned** |
| Chunks | 62, from 20 cards, split on the cards' own `## ` headings |
| **k** | **6**, chosen by the curve |
| Store | Postgres 16 + pgvector, `card_chunks`, `tenant_id` on the row |
| Control | TF-IDF over character 3-5-grams |

## The curve chose k

On the 38 cases where retrieval actually decides the answer:

| k | 1 | 2 | 3 | 4 | **5** | **6** | 8 | 10 | 12 | 15 | 20 |
|---|---|---|---|---|---|---|---|---|---|---|---|
| bge-m3 | .579 | .711 | .737 | .842 | **.921** | **.947** | .947 | .947 | .947 | .974 | 1.000 |
| TF-IDF | .316 | .421 | .526 | .632 | .711 | .737 | .789 | .842 | .842 | .868 | .921 |

Flat from 6 to 12. `docs/evals.md` had guessed 5, `nodes.py` defaulted to 3,
`requirements.md` said the curve decides. It decided 6.

**Semantic search earns its cost**, which is what the control was for: +0.21 at k=6. The
curves converge by k=20, but k=20 is a third of a 62-chunk corpus, so the low-k gap is the
real one. The control was given character n-grams rather than word tokens so it would be a
fair opponent; it reaches "caged bird" on its own.

## Eight decisions

1. **Match on `card_id`.** `must_cite` holds `card_020`, retrieval returns `card_020#1`.
2. **Any-hit leads, all-hit follows.** `evals.md` says "*a* `must_cite` id", `primer.md` says
   "*the* expected card id", and 21 cases carry two. Both are reported.
3. **Macro beside micro**, because `card_020` is 29 of the 100 citation pairs.
4. **The headline is reported twice, and the second is the real one.** All 29 cases citing
   `card_020` are escalation-positive, and 39 of 79 scorable cases are. The crisis guard
   halts those before stage 2 runs, so their `must_cite` is a *routing* expectation, not a
   retrieval one: `card_020` is where the conversation should go, not the chunk that answers
   the question. Scoring them as retrieval measures a component that never executed. The
   `delivered` subset of 38 is what picks k.
5. **Cases with no `must_cite` leave the denominator**, split into corpus gaps (4), refusals
   (20) and guard-handled (12). Only the gaps get their own number, inverted: the corpus
   should *not* produce a confident hit there. **All 4 currently do**, which is open.
6. **`tenant_id` on the chunk row**, denormalised, and the filter runs before the ranking in
   both stores.
7. **The embedding model is pinned with its reason in `config.py`.** Changing it rebuilds the
   store and invalidates every `retrieval_top_score` already logged.
8. **Both stores return cosine *similarity*.** pgvector gives distance; it is converted, and
   a test asserts the two agree to 1e-4. Otherwise `retrieval_top_score` means different
   things in different runs and the thesis cannot compare them.

## Two findings worth carrying

**`retrieval_margin` is a weak signal on this corpus.** Median top-to-second margin is
**0.017**, and 57% of retrievals are under 0.02 (measured 22.09.2026 on the rewritten corpus;
0.014 and 58% before it). It is one of the seven pre-registered fields
and is meant to carry confidence. `01-thesis/pre-registration.md` §1.5 should hear this
before the predictability dimension leans on it.

**The German case is rank 8, not rank 1.** `a025`, "es hat alles keinen Sinn mehr, ich weiss
nicht weiter", is expected to cite `card_020`. bge-m3 puts `card_010` first. That is arguably
correct behaviour scored against a routing label: the sentence *is* semantically about days
without shape. It reaches a person anyway, because the crisis guard catches it before
retrieval. Multilingual embeddings were still the right call, but this case does not prove it
and should not be quoted as if it did.

## Open

- the 4 corpus-gap cases still return a confident top-1; "retrieve nothing" has no threshold yet
- no HNSW index: exact scan is correct at 62 chunks and will not be at 6,000
- `docs/data-model.md` says `vector(768)`, matching the model that was never argued for. It is
  now `vector(1024)`. The file needs the correction.

---

## Added 22.09.2026

### 9. The corpus stopped quoting the posts the eval cases came from

Four cards quoted, verbatim, the forum sentences that `c002`, `c003`, `c004` and `c013` were
harvested from. A lexical retriever could therefore hit those four by string overlap while
understanding nothing, and the quotes were independently a re-identification vector in
content that ships under a provider's brand.

The rewrite went on the **card** side. Harvested case inputs are left exactly as posted,
because paraphrasing a real user's words to fix a measurement problem destroys the provenance
that makes the case worth having.

Measured effect at the shipped k: none on the dense retriever (delivered `recall@6` 0.947
before and after), a loss on the lexical control at higher k (`recall@20` 0.921 to 0.895).
A leak that only degrades the word matcher was a lexical leak.

### 10. Absolute scores are not comparable between queries, so a global threshold cannot work

Measured over all 115 queries:

| gap | median | p10 | p90 |
|---|---|---|---|
| top to rank 2 | 0.017 | 0.003 | 0.061 |
| top to rank 5 | 0.052 | 0.023 | 0.106 |
| top to rank 10 | 0.073 | 0.042 | 0.143 |

Top scores range 0.399 to 0.683. **The lowest top score sits below the highest rank-10
score**, so one query's confident hit scores lower than another query's tenth-best. No single
cutoff separates them.

This closes the "retrieve nothing" question for now: the 4 corpus-gap cases still return a
confident top-1, and a score threshold is not the fix. The groundedness gate is, because it
asks whether the retrieved text supports an answer rather than whether a number cleared a
line. Revisit when there are more than 4 gap cases to fit against.

Correlation between top score and the winning chunk's word count is `-0.056`, so this is not
a chunking artefact and a chunking sweep will not repair it.

### 11. No vector index, deliberately

pgvector scans all 62 chunks exactly. HNSW is an approximate index: it trades recall for
speed and its results depend on build order. Retrieval is the variable under measurement
here, so it is measured exactly.

**Trigger to revisit:** above roughly 5,000 chunks, or median query latency above 100 ms.
Neither is close. Current median turn latency with no model in the path is 110 ms, almost all
of it the embedding call.
