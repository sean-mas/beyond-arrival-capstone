# Eval cases

The case set is the specification. Read `../../../01-thesis/pre-registration.md` section 1
before adding anything, because two of its rules constrain who may write what.

## The authorship problem, stated rather than hidden

Pre-registration 1.1: **no test case may be written by reading a situation card.** A case
written from the corpus tests whether the system finds what was deliberately put there,
which is nearly always true and measures nothing.

The cards were written on 16.09.2026 with AI assistance. If the same author now writes
the cases, that rule is broken in substance even if the letter is observed, because the
corpus is already in the author's head.

So the set is split by provenance, and every case records which it is:

| `provenance` | Meaning | Who may write it |
|---|---|---|
| `harvested` | The input is real text a real person wrote, quoted or lightly edited, with a source URL | anyone, because the input was not invented |
| `elicited` | The input came from a person Sean asked, who has actually relocated | anyone, source recorded as the person's role |
| `constructed` | The input was written for the test | **adversarial cases only** |

**Core cases may not be `constructed`.** If the set cannot be filled with harvested and
elicited cases, the set is smaller, and that is reported rather than padded.

Labelling is different from authoring and is allowed. Deciding which card *should* answer
a real question, and whether a real message needs a human, is a judgement recorded per
case. Writing the question is what is forbidden.

## Files

| File | Contents | Status |
|---|---|---|
| `cases.jsonl` | core cases, real questions | **75**, all harvested with source URLs. 28 escalation-positive, 14 refusal-positive |
| `adversarial.jsonl` | attack cases, one per guard | 40, complete |
| `harvest.md` | sampling frame, and the coverage still thin on `life_setup` | open |
| `review_build.py` | builds a blind relabelling sheet, labels hidden, order shuffled | ready |
| `review_ask.py` | fills that sheet one case at a time from the terminal, resumable | ready |
| `review_score.py` | scores a filled sheet, reports Cohen's kappa, lists disagreements | ready |
| `split_cases.py` | assigns the 70/30 split once, prints the hashes, refuses to rerun | ready |

## Schema

```json
{"id": "c001",
 "input": "the message as a person would send it",
 "provenance": "harvested",
 "source": "https://...",
 "expect_situation": "partner_work_rights",
 "expect_escalation": false,
 "expect_refusal": false,
 "must_cite": ["card_003"],
 "split": "dev",
 "notes": "why this case exists and what makes it hard"}
```

`must_cite` is the retrieval ground truth. `expect_escalation` and `expect_refusal` are
the safety ground truth. `split` is assigned once by `split_cases.py` and never by hand.

## What each field is measured against

| Field | Metric | Needs a model? |
|---|---|---|
| `must_cite` | retrieval hit rate | no |
| `expect_refusal` | refusal correctness | no |
| `expect_escalation` | escalation recall and precision | no |
| the answer text | groundedness, relevance, tone | yes, a calibrated judge |

Three of the four are free and exact. Spend the judge only on the fourth.

## Adversarial set, and its known blind spot

Written 17.09.2026, before any guardrail exists, per pre-registration 1.2. Attacks written
after defences are attacks the defences already stop.

Attack classes follow the OWASP agentic-application categories plus the product's own
reserved topics: goal hijacking and prompt injection, personal data, crisis language, and
the four reserved advice topics.

**The blind spot, stated plainly.** These were written by the same author who wrote the
`must_not_say` and `escalate_if` fields on the cards. They therefore test the failure
modes that author thought of, and cannot test the ones they did not. The only real fix is
a second person writing attacks, and that is worth one hour of somebody else's time
before the eval gate is trusted.

## The performance history

`evals/history.jsonl` is append-only and **tracked in git**. One row per eval run, carrying
the scalar metrics plus the `git_sha` and `corpus_digest` that produced them. Read it with:

    python3 evals/history.py

`evals/results/` holds the full payload of each run and is **gitignored**: curves,
per-case detail, anything large enough to bury a diff. Regenerable from the code at that
commit; the history row is the durable artefact.

The two are separate for one reason. A number without the code and the corpus behind it
cannot be compared to anything, and on 22.09.2026 four cards were rewritten and every
retrieval number moved for a reason that had nothing to do with the retriever. The
`corpus_digest` is what makes that visible in the file rather than only in hindsight.

**Turn records are not here.** `TurnRecord` carries the family's own question and answer, so
`obs/sink.py` writes to `private/runs/`, which `.gitignore` excludes. Aggregate metrics carry
no user text and are tracked deliberately. That split is the anonymisation rule in code.
