# Who is speaking about whom: test cases, first draft

30.09.2026. Sean: "the system has to be aware who is speaking of whom to make
the answer relevant. This we have to nail and it needs more precise testing
and thinking." The cases are in `evals/personalisation.jsonl`, 20 of them,
constructed, publishable.

## Why a separate set

The 115 development cases are single messages with no family attached, so
they cannot tell a right answer from a wrong one when the right answer depends
on who wrote it. Rows 9, 12, 29 and 30 of the 29.09 sheet all failed this way,
and no prompt rule fixed them in E4.

**The design rule: the same message from different families, with different
correct answers**, plus the same message with no profile, where the correct
move is usually to ask.

| Group | Message | What changes the right answer |
|---|---|---|
| G1 | "her German is basic… a regular class" | a daughter of 10 (school) or a wife (language course), or no profile (ask who) |
| G2 | "do we need to find a Kita place?" | a child of 2 (yes), of 7 (school instead), or unknown (ask the age) |
| G3 | "will my son go into a Willkommensklasse?" | 6 (straight into primary) or 11 (the district decides) |
| G4 | "the move has been hard…", "winter here is going to be hard" | no children (no school advice), nothing about a career (no card_011 line) |
| G5 | "my wife / my husband is miserable here" | the answer is about the other person, not addressed to the writer as the unhappy one |
| G6 | "my wife hasn't left the flat for a week" | nothing: a handover with or without a profile |
| G7 | "our daughter may stay in our home country until her final exams" | covered by card_018's new section |
| G8 | "can my husband and son be covered on my insurance?" | statutory (yes, usually free) or private (each needs a policy) |
| G9 | "everyone at school already has friends" | the writer is a teenager, not a parent |

## How a case is scored

Deterministic checks, no judge needed, so a run costs nothing but the answer
model:

- `expect_route`: `answer`, `clarify`, `handover` or `any`
- `must_cite`: the card that should be among the retrieved chunks
- `must_mention`: each entry is a regex; at least one alternative must appear
- `must_not_mention`: none of these may appear
- `about`: who the answer should be about, for reading, not yet scored

Keyword checks are crude and say so: they catch "school advice to a couple with
no children" reliably, and they cannot tell a good answer from a merely correct
one. That second question is what Sean's labels and, once calibrated, the judge
are for.

## What has to exist before this can run

Found while writing the cases: **the chat never sends the family profile to
the model.** `CompanionState.profile` exists and the prompt has a `FAMILY:`
line, but the API passes nothing, and the onboarding keeps the family on the
device. So today every one of these cases would run as if it had no profile.

1. **A profile shape with the household in it.** `SeatProfile` has
   `journey_month`, `corridor`, `language` and `role`, and nothing about who
   else is in the family. The cases use `writer` and `household` (relation,
   role, age), which is roughly `seats` plus `people` in `docs/data-model.md`.
2. **The profile reaches the prompt**: the router, the answer and the
   clarifying question all see the `FAMILY:` line.
3. **A runner** (`evals/run_personalisation.py`) that passes each case's
   profile and applies the checks above.
4. **The demo sends the onboarding profile with each message**, which is a
   privacy decision as much as a feature: names stay on the device, only
   relation, role and age travel.

## Groq cost

20 cases, one crisis check each, about 6,000 tokens on the first run and none
after that for answer changes (`evals/guard_cache.py`).

## Open questions for Sean

- Which fields may leave the device: relation, role and age only, or first
  names too, so the companion can say "Mia" rather than "your daughter"?
- Should the companion ask once and remember ("who is 'she'?"), which needs
  the conversation history too, or rely on the onboarding profile alone?
