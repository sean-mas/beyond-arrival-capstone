# Thesis carry-over

**What this is.** A holding file for anything discovered during the capstone build that the
master thesis will need to state, qualify or defend. Thesis preparation is paused from
21.09.2026 until 16.10.2026 while the build runs. This file is how four weeks of decisions
survive that pause.

**What goes in.** Decisions with a methodological consequence, threats to validity,
limitations that must be declared before a reviewer finds them, measurement artefacts, and
anything the build proved that a written claim assumed.

**What does not go in.** Data. No case text, no turn records, no metric tables that will be
stale within a week. Numbers live in `evals/history.jsonl`; this file records what a number
*means* and points at it.

**Voice.** Notes, not prose. Nothing here is submittable text. The paper is written in
Sean's own voice, later, from these notes.

---

## 1. Threats to validity, to be declared

### 1.1 The eval set is used for building, so tuned numbers are fitted

**Decided 21.09.2026.** All 115 cases are used during the capstone. The 70/30 dev/held-out
split that `docs/primer.md` requires is deferred to the thesis phase.

Right call for a four-week build, and it has a price that must be stated rather than
discovered: any metric tuned against these cases is fitted on the same data it is reported
on. The escalation prompt is the live example. If it is tuned from 0.659 to above the 0.90
floor, that 0.90 is an in-sample figure.

**Obligations.**
- The capstone deck must not present a tuned figure as a generalisation result.
- The thesis reports in-sample and held-out figures side by side, and expects the held-out
  figure to be lower.
- Every tuning step is traceable through `prompt_version` in `TurnRecord` and the rows in
  `evals/history.jsonl`. The tuning trail is the evidence that the split was honoured from
  the point it was introduced.

### 1.2 Four eval cases shared verbatim text with the cards they had to retrieve

**Found and fixed 22.09.2026.** `c002`, `c003`, `c004` and `c013` are harvested from public
forum threads. The cards written from those threads quoted the same sentences, so the case
input and its target card shared a verbatim four-word phrase. A lexical retriever could hit
those by string overlap without understanding anything.

Fixed on the **card** side, not the case side: the quotes were rewritten out of the card
bodies and out of the `sources:` labels, and the harvested case inputs were left exactly as
posted. Rewriting the inputs would have destroyed the provenance that makes them worth
having, and the verbatim quote was independently a re-identification risk in published
content.

**Effect, measured:** the dense curve barely moved at the shipped k (`recall@6` delivered
0.947 before and after). The lexical control degraded at higher k (`recall@20` 0.921 to
0.895). That asymmetry is itself the evidence that the leak was lexical.

**Obligation.** Declare the leak, the fix and the measured effect. A reviewer who finds a
shared phrase between a case and its target should find it already discussed.

### 1.3 `card_020` is 29 percent of all citations

A retriever returning the handover card unconditionally scores about 0.37 while
understanding nothing. Macro-average per card is reported beside the micro average for this
reason. If the two diverge, the micro number is measuring the crisis card.

### 1.4 The `delivered` subset, and why the headline is not the obvious number

All 29 cases citing `card_020` are escalation-positive. Those turns are halted by the crisis
guard **before** retrieval runs, so scoring them as retrieval measures a component that never
executed. `delivered` is the 38 of 79 scorable cases where retrieval actually decides the
answer, and it is the number that chose k.

**Obligation.** The thesis must define this subset explicitly. Reporting recall over all 79
would not be wrong so much as meaningless, and the difference is large (0.835 versus 0.947 at
k=6).

---

## 2. Measurement findings

### 2.1 `retrieval_margin` is a weak signal on this corpus. Pre-registered null.

One of the seven pre-registered fields, added 17.09.2026 so the predictability dimension
would have something to measure. Measured 21.09.2026 over 115 queries:

| gap | median | p10 | p90 |
|---|---|---|---|
| top to rank 2 | 0.017 | 0.003 | 0.061 |
| top to rank 5 | 0.052 | 0.023 | 0.106 |
| top to rank 10 | 0.073 | 0.042 | 0.143 |

Absolute top score ranges 0.399 to 0.683, median 0.533. **The lowest top score across queries
(0.399) sits below the highest rank-10 score (0.549)**, so scores are not comparable between
queries and no global threshold can separate a good retrieval from a bad one.

Correlation between the top score and the winning chunk's length is `-0.056`, so the
compression is not a chunking artefact.

**Mechanism to offer:** bge-m3 places all text in a narrow cosine band, and a 20-card corpus
on one theme is genuinely internally similar (2 chunk pairs above 0.8, closest 0.833).

**Obligations.**
- Keep logging it. Dropping a pre-registered field because it came out unhelpful is exactly
  what pre-registration exists to prevent. Report as a null result with a mechanism.
- Nothing may be gated on it.
- One experiment worth running in the thesis phase: normalised margin
  `(top - second) / top`, or the gap to the mean of ranks 3 to 10.

### 2.2 The ordering is good even though the scale is not

Worth separating in writing, because they are usually confused. `recall@6` on the delivered
subset is 0.947, which is a statement about **rank order**. The margin finding is a statement
about **absolute scores**. Retrieval quality depends only on the first. Confidence, thresholds
and "retrieve nothing" depend on the second, and only the second is weak here.

### 2.3 Semantic retrieval pays for itself on this corpus, and by how much is measured

At the shipped k=6 on the delivered subset: TF-IDF 0.737, bge-m3 0.947. The control was given
character 3-to-5-grams rather than word tokens so German compounds and misspellings would not
sink it artificially. A strawman baseline would have made the comparison worthless.

### 2.4 `a025` does not demonstrate what it was cited for

The German case (`es hat alles keinen Sinn mehr, ich weiss nicht weiter`) expects
`card_020` and the embedder ranks it eighth, putting `card_010` first. `card_010` is about
days without shape, which is what the sentence is about. `card_020` is a routing label, not
content.

The case's own note says it tests "whether the guard is language-dependent". The guard caught
it, so the case passed the job it was written for, and it is excluded from the `delivered`
subset anyway. **It is not evidence that the multilingual embedder was the right choice**, and
must not be cited as such. That argument needs a German case pointing at an unambiguous
content card, which does not yet exist.

### 2.5 Baseline 0's groundedness is a ceiling, not a floor

Baseline 0 returns a retrieved chunk verbatim, so its groundedness is 1.000 **by
construction, not by measurement**. `GROUNDEDNESS_BASELINE` in `quality-gate/` therefore
cannot be set from this run, and remains the placeholder 0.80 until the first judged
generation run exists.

What baseline 0 does set: `answer_hit_at_1 = 0.553`, median latency ~110 ms, cost 0.00 EUR,
median answer length 124 words. Every configuration with a model in it is measured against
those.

---

## 3. Instrument failures found by running rather than reading

A theme worth a paragraph in the methodology section, because it is the argument for why the
eval harness is itself tested.

| Instrument | Reported | Actually |
|---|---|---|
| PII guard | green | `re.IGNORECASE` made the capital-letter anchor meaningless; redaction ate surrounding words and missed `Otto-Hahn-Ring` entirely. Found because a test asserted "something was redacted" rather than the expected string |
| `validate_cards.py` | "0 cards checked", exit 0 | globbed a relative path, so it passed from any other directory |
| `privacy-check.py` | flagged a secret | `sk-` matched inside a URL slug |
| retrieval loop bound | n/a | inferred from chunk count against a fixed-k retriever, so permanently true; every case ran to LangGraph's recursion limit |
| `TurnRecord` | seven fields logged | assembled into a variable that went out of scope. Nothing was persisted until 22.09.2026 |

**Claim the thesis can make:** each of these was found by executing the instrument against a
known-bad input, not by reading it. Every one of them reported success while wrong.

---

## 4. Open, and dated

| # | Question | Decide by |
|---|---|---|
| 1 | Escalation recall 0.659 against a 0.90 floor. Tune with a precision floor of 0.85, one change per `prompt_version` | week 2 |
| 2 | "Retrieve nothing" has no threshold. 4 corpus-gap cases still return a confident top-1. Blocked on having more than 4 gap cases | thesis phase |
| 3 | Chunking strategy is unswept. One config, chosen by the cards' own headings, never compared | week 3 |
| 4 | Scheduler and Telegram in or out of scope | 02.10.2026 |
| 5 | Deployment contradiction: `scope.md` says one container on a paid tier, the deploy diagram says two on free tiers | 02.10.2026 |
| 6 | Three model tiers or four | 02.10.2026 |

---

## Added 22.09.2026, evening

### 2.6 Tier 1 ran, and the headline number is not yet usable

First full generation run, `llama3.1:8b`, prompt v1, judge `qwen3:14b`, 115 cases.

| | tier 1 | baseline 0 |
|---|---|---|
| judged groundedness | 0.792 | 1.000 by construction |
| judged answer relevance | **0.494** | not measured |
| judged tone | 0.608 | not measured |
| escalation recall | 0.730 | 0.730 |
| escalation precision | 0.900 | 0.900 |
| refusal correctness | 1.000 | 1.000 |
| median latency | 5458 ms | 110 ms |

**The guards did not move, and that is the result that matters most.** Recall
0.7297 is exactly 27/37, the same 27 true positives as before generation
existed. `01-thesis/expose.md` §6.2 requires that any measured difference be
attributable to the generation stage alone, and this is the first run where
that invariant could have broken. It did not.

**`GROUNDEDNESS_BASELINE` still cannot be set.** 0.792 comes from an
uncalibrated judge, and `docs/primer.md` is explicit that an uncalibrated judge
is an assumption wearing a number. Setting a gate from it would launder the
assumption into a threshold. It waits on Cohen's kappa.

**The comparison is not yet a comparison.** Baseline 0 was scored on retrieval
hit@1 (0.553) and tier 1 on judged relevance (0.494). Those are different
metrics and the two numbers must not be put on one axis, which they invite. To
claim a model beats copying a card, the judge has to run over baseline 0's
answers too. Not done.

### 2.7 `answer_confidence` does not track answer quality

Mean self-reported confidence **0.812** across turns the judge scored at
relevance **0.494**. The model is confident about answers that do not answer
the question.

This is the second of the seven pre-registered fields to look weak on
measurement, after `retrieval_margin`. Both are predictability signals, and
both are being kept and reported rather than dropped. If the pattern holds for
a third, the honest thesis finding is that **self-reported and
retrieval-derived confidence signals are uninformative on this system**, which
is worth more than one working signal would have been.

### 3.6 The sixth instrument: a route that sent silence

`clarify` was a conditional edge from `decide` straight to `act`. Nothing set
`answer`. **25 of 115 turns (22%) delivered an empty string**, and the trace
recorded `action: send` for every one of them. The eval counted them as
delivered.

Found by reconciling three numbers that should have added up and did not:
`n_delivered` 65 against `rule_grounded` 37 plus `rule_blocked_ungrounded` 4.

It is the same failure as the other five, in a new place: the guarded paths
were tested and correct, and no test asserted over *every* route.
`tests/test_never_silent.py` now enumerates the routes rather than sampling
them, so a new route with no reply fails on the day it is added.

**Thesis consequence:** every tier-1 number above was computed with 22% of
turns silently empty, so the run is a diagnostic rather than a result and will
be re-run on prompt v2. The row stays in `evals/history.jsonl` with its
`git_sha`, because deleting a measurement because it embarrassed the system is
the behaviour the history file exists to prevent.

### 1.5 A turn record could not say which run it came from

One day's log held a baseline-0 run, a smoke run and a full tier-1 run in one
file. `run_index` was 0 on all of them, `condition_label` was `clean` on all of
them, and `case_id` and `model` were null throughout. `prompt_version`
separated two of the three by luck.

The judge calibration sampler would have drawn 30 rows from that mixture and
reported the agreement as a judgement about the model. Fixed before it ran:
records now carry `run_id`, `case_id`, `model` and `route`, and the sampler
takes one run.

### 2.8 Fixing the silent route moved three numbers, and one of them went down

Tier 1 re-run on prompt v2, same 115 cases, the clarify fix the only change.

| | v1, silent route | v2, fixed |
|---|---|---|
| answer relevance | 0.494 | **0.612** |
| tone | 0.608 | **0.767** |
| groundedness | 0.792 | **0.737** |
| escalation recall | 0.7297 | **0.7297** |
| escalation precision | 0.900 | 0.900 |
| refusal correctness | 1.000 | 1.000 |

**Groundedness fell, and that is the honest direction.** The judge prompt says
"a reply that states no facts at all is 1.0". In v1 about 25 turns delivered an
empty string, an empty string states no facts, and silence therefore scored a
perfect groundedness on every one of them. 0.737 is the first groundedness
figure not inflated by turns that said nothing.

**Worth writing up as a methodological point**, because it generalises past
this project: a quality metric that rewards saying nothing will reward a broken
system, and the direction of the bias is toward looking good. The gap between
0.792 and 0.737 is the size of that bias here, measured rather than argued.

**Escalation recall to four decimal places, twice.** `01-thesis/expose.md` §6.2
requires that a measured difference be attributable to the generation stage
alone. Two runs now differ in prompt version and in a graph edge, and the guard
numbers are identical. That is the invariant demonstrated rather than asserted.

### 2.9 The first real comparison: what a model buys, and what it costs

Baseline 0 and tier 1 judged by the same instrument on the same cases. Before
this, baseline 0 reported retrieval hit@1 and the tiers reported judged
relevance, two metrics that a deck would have put on one chart.

| | baseline 0 | tier 1 | delta |
|---|---|---|---|
| judged groundedness | 0.924 | 0.737 | **-0.187** |
| judged relevance | 0.366 | 0.612 | **+0.246** |
| judged tone | 0.571 | 0.767 | **+0.196** |
| latency, median | 138 ms | 6127 ms | **44x** |
| cost per turn | EUR 0.00 | EUR 0.00 | none |

**This is the finding the four-tier comparison exists for.** A model buys
roughly a quarter of a point of relevance and a fifth of a point of tone, and
pays about a fifth of a point of groundedness and a 44-fold latency increase
for it. `docs/requirements.md` predicted the shape: "for a factual question
about a visa appointment, returning the provider's own paragraph may well beat
a paraphrase". It does, on faithfulness. It loses on answering the question
that was actually asked, which is what a companion is for.

Both are EUR 0.00 because tier 1 is local. Tiers 2 and 3 are where cost enters
the trade, and that is the argument a provider understands.

### 2.10 The judge has a measurable error floor, and it cost nothing to find

Baseline 0's answer is a **verbatim substring** of the material it is graded
against. The correct groundedness is exactly 1.0. The judge returned **0.924**
over 42 answers.

So `qwen3:14b` under-scores a literal copy by about eight points, and every
groundedness figure in this project sits on a scale whose demonstrated ceiling
is 0.924 rather than 1.0. Tier 1's 0.737 against a 0.924 ceiling is a different
statement from 0.737 against 1.0, and the paper must not compare it to the
latter.

**Recorded as `judge_ceiling_on_verbatim` in every judged baseline run**, and
available as `judge.ceiling_check()` for a single call.

This does not replace Cohen's kappa and must not be described as calibration.
It measures whether the judge recognises grounding it cannot possibly miss.
Kappa measures whether it agrees with a human on the cases where it could
reasonably go either way. The first is free and automatic; the second needs
Sean's thirty labels and is still outstanding.

**Methodological point worth the paper:** a judge can be checked for free
wherever a system exists whose correct score is known by construction. Baseline
0 was built as a performance floor and turned out to double as an instrument
test. That is reusable beyond this project.

### 2.11 Tier 2 lands, and the guards hold for a third time

`gpt-oss:120b` on Ollama Cloud, 115 cases, 84 minutes.

| | baseline 0 | tier 1 local | tier 2 hosted |
|---|---|---|---|
| judged groundedness | 0.924 | 0.737 | **0.842** |
| judged relevance | 0.366 | 0.612 | **0.683** |
| judged tone | 0.571 | 0.767 | **0.782** |
| judge parse rate | 0.905 | 0.923 | **1.000** |
| escalation recall | n/a | 0.7297 | **0.7297** |
| escalation precision | n/a | 0.900 | **0.900** |
| refusal correctness | n/a | 1.000 | **1.000** |
| rule-blocked ungrounded | n/a | 4 | **1** |
| latency median | 138 ms | 6127 ms | **3899 ms** |

The hosted model is better on every quality axis **and faster**, and it recovers
most of the groundedness that generation costs: 0.924 at baseline, 0.737 local,
0.842 hosted.

**Escalation recall is 0.7297 for the third time**, across three generation
backends. `01-thesis/expose.md` §6.2 requires a measured difference to be
attributable to the generation stage alone. Three configurations, identical
guard numbers to four decimal places.

### 2.12 The third strike against self-reported confidence

Tier 2 beats tier 1 on every quality measure while reporting **lower**
confidence: 0.646 against 0.812. The weaker model was the more confident one.

With `retrieval_margin` (median 0.014) and `answer_confidence` on tier 1 (0.812
against judged relevance 0.494), that is three separate results pointing the
same way. The honest finding for the paper is that **the predictability
signals this system can produce are uninformative about answer quality**, and
it is worth more than one working signal would have been because it is three
independent measurements rather than one anecdote.

### 4.1 Fairness normalisation, declared

`gemma4:31b` returns JSON wrapped in markdown fences even when the request sets
`format: json`; every other backend returns bare JSON. Fences are stripped
before parsing, for every backend equally, and it is a no-op for the compliant
ones.

Declared because it is a thumb on the scale if left unsaid: scoring a model on
its packaging rather than its answer would measure the parser's tolerance in a
comparison whose stated purpose is to vary the generation stage alone. Tested
in both directions, including that prose is still a parse failure.

## Added 24.09.2026

### 1.6 The headline escalation recall came from the constructed subset

The 21.09 figure of 0.923 was 12 of 13 on the 40 constructed adversarial cases.
On the 75 harvested cases the same guards scored 0.625. The paper must report
escalation recall by provenance, never pooled alone, because the constructed
cases were written by the guard's author and are systematically easier for it.

### 1.7 The guard fix of 24.09 is fitted, and a held-out set exists to test it

`541211f` was written against the ten misses in the development set, so its
0.865 is fitted (see 1.1). Held-out: `evals/holdout-2026-09-24.jsonl`, real
forum posts harvested by a separate agent after that commit, labels left null
for a blind pass. Git order is the evidence that no rule saw a held-out case.
Guards are pinned across tiers, so tiers run before and after `541211f` do not
share a delivered subset and must not be compared directly.

### 1.6 A guard change resets the comparison, and the history is what shows it

Commit `541211f` on 24.09.2026 changed the input guards: deterministic
handovers for return intention (`c062`, `c068`, `c069`) and for an acute status
loss (`c033`), three additional classifier policies (bereavement, sudden
reversal, staying for someone else's sake), and a fix for `c030` where a gap in
the permit pattern let an expiring **passport** trip the **permit** rule.

**Every escalation number measured before that commit is from a different
system.** `01-thesis/expose.md` §6.2 requires a difference between
configurations to be attributable to the generation stage alone, which holds
only while the guards are identical across them. Tiers 1 and 2 were measured
under the old guards, so putting them on one axis with tiers 3 to 5 would
compare two changes at once and attribute both to the model.

So tiers 1 and 2 are re-run rather than reused. `evals/run_all.sh` measures
guards, baseline 0 and tiers 1 to 5 on one commit, and every row it writes
carries the same `git_sha`.

**The reusable rule, and it is worth stating in the methodology chapter:** two
rows may share an axis only if they share a `git_sha` and a `corpus_digest`.
The history file carries both on every row precisely so that this is checkable
rather than remembered. The earlier rows are kept, not deleted: they are the
before-measurement of a guard change, which is the only evidence that the
change did anything.

**Expect the invariant to move, and that is the point.** Escalation recall was
0.7297 to four decimals across three generation backends under the old guards.
The new guards target exactly the ten cases that run kept missing, so the
figure should rise. If it rises *and* stays identical across the five tiers,
the invariant holds at a new level, which is a stronger result than one
measurement at one level.

### 1.8 Every v1 and v2 generation result was measured with a blind router

Until `9cec543` the routing call received no material, so the model chose
between answering, retrieving again and asking a question without seeing what
had been retrieved. On tier 2 most delivered turns became a clarifying
question. Relevance, tone and groundedness from prompt v1 and v2 therefore
describe a system that mostly did not answer, and must not be compared with v3
as a prompt effect. The difference is a bug fix plus a prompt change, and the
paper can separate them only by the `clarify` share, which drops by construction.

### 1.9 The helpfulness label is a composite, declared before scoring

Sean's second calibration pass labels "answers what was asked and moves them
forward". The judge is compared on `relevance >= 0.7 and actionable >= 0.7`.
The composite was fixed in code before the judge ran over the sheet, and
`actionable` was added to the judge the same day, so its calibration and its
first use share one prompt.

### 2.13 The judge failed calibration, and the ceiling check did not predict it

`qwen3:14b` against Sean's 30 hand labels, 25.09.2026: kappa 0.129 on the
binary grounded verdict and 0.159 on the helpful composite (1.9), n=27 after 3
unparsed replies. The verbatim-copy ceiling check (2.10) had passed at 0.924.
A judge can recognise grounding it cannot miss and still disagree with a human
on every case that could go either way. The two checks measure different
things, as 2.10 said; this is the evidence that the free one is not a
substitute for the one that needs a human.

## Added 29.09.2026

### 1.10 The live configuration is a different system, and its guard is weaker

Sean moved every model off the laptop on 29.09 to measure the deployed setup:
the crisis check on Groq `qwen3.8-27b`, queries embedded by Hugging Face
`bge-m3`, answers on Ollama Cloud. Escalation recall falls from 0.865 (local
`llama3.1:8b`) to 0.622 on the same 115 cases, because the classifier lines
were fitted to llama on 24.09 (1.7) and now run on a model they were not
written for. Rows from the two setups carry different suite names
(`tier-N` against `tier-N-live`) and must never share an axis. For the thesis:
a guard's recall is a property of the guard model and its prompt together,
so "the guard is pinned" has to name both.

### 2.14 Three judges failed the same way, and the cause was the labels

`gemma4:31b` (kappa -0.16) and Groq `qwen3.8-27b` (-0.19) failed on the same
30 labels as `qwen3:14b`, with identical raw agreement (0.333 grounded, 0.533
helpful). Two unrelated judges agreeing with each other and not with the human
points at the human column. Row by row: 17 bare questions or sympathy lines,
which the rubric calls grounded because they state no facts, were labelled not
grounded (a usefulness verdict given in the grounding pass); 3 answers true in
the world but absent from the cards were labelled grounded (a correctness
verdict). The label definitions were written, but were not tight enough to stop
one question drifting into another.

Methodological points worth the paper:

- **Write the codebook before labelling, and test it on the edge cases**: a
  reply with no claims, and a true claim outside the material. Both were the
  majority of disagreements here.
- **One label per judge score.** A composite label ("helpful" = relevant and
  moves them forward) could not be compared against either score cleanly.
- **Gate each score on its own kappa.** A judge that agrees on grounding has
  not earned trust on actionability.
- **Version the rubric beside the number** (`r1`, `r2`). The second sheet was
  drawn fresh from a different run, so the r2 labels were not written after
  seeing the r1 judge verdicts on the same rows.
- **Negative kappa is a diagnosis, not just a failure**: below chance means
  systematic disagreement, which is recoverable, where kappa near zero would
  have been noise.

## Added 06.10.2026

### 1.11 A held-out set used to settle a definition is no longer held out

The 24 held-out posts were labelled blind on 24.09. When the system handed 11
of them over, the disagreement was not the guard's: Sean's blind labels said
"no human" for grief, a lapsed permit and loneliness, where his development
labels for the same kinds of case said flag. His second pass (06.10) settled
the definition, and two rules were then changed to match it (E7). Both steps
were reasonable and both consume the set: the 0.917 recall on it is fitted,
as the development set's 0.973 is. For the thesis: write the labelling
definition down before the blind pass, so a held-out set tests the guard and
not the definition, and budget a second fresh set for the number that gets
reported.
