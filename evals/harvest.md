# Harvest task: 44 missing core cases

`cases.jsonl` holds 16 harvested cases. The target is 60. The missing 44 may not be
invented, per pre-registration 1.1, so they have to come from somewhere real.

**Do this before Monday, or at the latest in week 1.** It expires: after a week inside
the corpus you will no longer be able to imagine how a stranger phrases a question, and
every case you write from then on will be a case the system happens to answer.

## Where to get them, cheapest first

**1. Reddit, about two hours, yields 25 to 30.** r/germany, r/expats, r/berlin,
r/Munich, r/AskAGerman. Could not be reached from this machine but works from a browser.
Sort by top of the year, read real posts, copy the **title or first sentence verbatim**.
Search terms that worked elsewhere: partner cannot find job, feel isolated, Anmeldung
problem, Auslaenderbehoerde appointment, Kita waiting list, want to go home.

**2. Toytown Germany archive.** The live site refused connections on 17.09.2026, but old
threads are indexed. Try a search engine cache or the Wayback Machine.

**3. The people you already have, about 30 minutes, yields 10 to 15 and they are the
best ones.** Anyone in your network who has relocated. One question, asked exactly like
this and not paraphrased:

> "What did you type into Google in your first year here, in the words you actually
> used at the time?"

Do not ask what they struggled with. You will get a tidy retrospective summary, and
tidy is the thing that makes a case worthless. Record `provenance: elicited` and the
person's role.

**4. Your own Wave 1 replies.** If any provider answers with what families ask them,
those are the highest-value inputs in the whole set, because they come from the buyer.

## Rules while harvesting

Copy the wording, including the typos, the lowercase, the missing question mark and the
rambling. **Tidy input is the thing that makes an eval set lie**, because tidy input is
exactly what the system handles.

Do not read a card and then write a question for it. Read a real post and then decide
which card should answer it. Those are different actions and only the second is allowed.

Take the boring ones too. A set made only of dramatic cases overstates the escalation
rate and understates everything else.

## Coverage, and why it is not what was first planned

**Revised 17.09.2026.** The original targets were set before any harvesting and assumed
a mix close to what a relocating family experiences. The set that came back does not look
like that, and the targets have been moved to the observed distribution rather than the
assumed one.

| Cut | Have | Was the target | Now |
|---|---|---|---|
| escalate = true | **41** | about 12 | floor of 40, met |
| refuse = true | **24** | about 8 | met, and then some |
| cultural and emotional | **32** | about 25 | met |
| orientation | **24** | about 25 | met |
| life_setup, everyday administration | **10** | about 20 | **10, matched to what exists** |
| about a child | 7 | about 8 | close enough |
| German in the input | 11 | about 5 | met |

**What actually happened.** Two sources are reachable and they pull in opposite
directions. Expatriates Stack Exchange is an immigration-law site, so it produced
refusal cases far beyond target. Mumsnet Living Overseas is emotional and social, so it
produced the escalation cases. Neither carries the everyday administrative question, and
Reddit and Toytown, where that material does live, are blocked.

**The honest statement of the limitation, which belongs in the thesis and not only here.**
The case mix reflects the distribution of relocation questions **in public forum text**.
That is not the distribution of questions a family has. Nobody posts "the appointment
portal shows no slots for six weeks" to a forum, because the answer is in every guide and
because the question goes to a consultant or a group chat instead. Public text
over-represents the problems people take to strangers and under-represents routine
administration people look up. The set is therefore weighted toward the hard cases, and
that is stated as a property of the sampling frame rather than presented as a population
distribution.

**Why this is acceptable.** No pre-registered threshold depends on the administrative
count. Escalation recall, escalation consistency, refusal correctness and groundedness
are all supported at 115 cases with 41 escalation-positive. What the thin strand costs is
per-card error analysis and the recall@k curve, both of which are reported with the
limitation attached.

**If it is ever closed**, it will be by asking people directly rather than by harvesting,
because those questions are asked of humans and not of the internet. The question to use
is in section 3 above.

## When it is done

Two steps, in this order, and the order matters.

**First, blind relabelling.** The sheet already exists for you. Run
`python3 review_ask.py --rater sean`, which prompts one case at a time and saves as it
goes, then `python3 review_score.py --rater sean`. For a second labeller, generate their
own sheet first with `python3 review_build.py --rater <name>`. This happens
**before** the split, per pre-registration 1.6, because a second opinion collected after
the results exist is a negotiation rather than a measurement.

**Then the split.** Run `python3 split_cases.py`, which assigns the 70/30 split once,
stratified by `expect_escalation`, and prints the hash for
`../../../01-thesis/pre-registration.md` section 6. After that the set is frozen and the
held-out half may be read exactly twice.
