# Prompt v4: ideas collected while labelling

Collected, not decided. Each becomes one change in prompt v4, measured one at a
time against v3 (change one setting per run).

## 1. Emotional messages: guide with a question before advising

Sean, 29.09.2026, labelling row 11 of the tier-2-live sheet (a message about
feeling that a whole life had been boxed up and discarded). The answer named the feeling,
cited the research, and ended with "try joining a meetup". Concrete, but it
jumps to a fix.

What Sean would rather see: one or two guiding questions that move the person
somewhere positive, for example "is there anything you already see for
yourself here?" or "what hobbies did you have before the move?"

Tension to resolve: v3 requires every answer to end in a concrete next step,
because Sean's first labelling pass (24.09) found bare clarifying questions
that moved nobody forward ("What are you worried about?"). The difference is
the kind of question: a bare question asks for information, a guiding
question points somewhere. A possible rule: on an emotional message with no
practical question in it, acknowledge the feeling, ask one guiding question,
and offer a small step as an option rather than an instruction.

Labelling is unaffected: under the declared rule, "join a meetup" is a next
step, so the row is labelled y. The preference is about the answer's
approach, not about whether a step is there.

## 2. Personal data in a message: say so, in code, not in the prompt

Sean, 29.09.2026, row 22 ("my IBAN is [IBAN_REDACTED] if you need it for the
Kita fees"). The PII guard worked: the model never saw the number. But the
reply opened "Thanks for sharing your IBAN", which teaches the family that
posting bank details here is fine.

What Sean wants: tell them not to share such data here, then point to the
proper route (the Kita or the office takes bank details on its own form).

Belongs in the guard, not the prompt. The PII verdict already knows what was
removed and of which kind, so a fixed, deterministic notice can go in front
of the answer ("I have removed your IBAN from this conversation. Please do not
share bank details here: the Kita will ask for them on its own form.") and no
model can forget to say it. Same principle as the rest of the system: safety
is decided in code. It also stops the model thanking anyone for the
placeholder, since the notice already addresses it.

Labelling is unaffected: the reply answers the Kita-fees question and gives
a step, so the row is y, y.

## 3. Understand the person before advising (extends idea 1)

Sean, 29.09.2026, row 24 (a message saying
language learning was going slowly). The answer works, but it is general advice: a 600-hour course to B1.
Better to learn first where the person is and what their goal is (a job, the
children's school, friends, the citizenship test), because the right advice
differs for each.

**Blocker found while checking: the companion has no memory between
messages.** `CompanionState` declares `history`, but no node reads it and the
API does not send it. So a guiding question today is answered into a void:
the reply arrives as a new, context-free message. Asking first only works
once the previous turns reach the model.

Three layers, in order:

1. **Memory.** Pass the last few turns into the context block, next to the
   family profile the onboarding already collects.
2. **Router.** `clarify` is "rare" in v3. Widen it: clarify when the right
   advice depends on something unknown (goal, level, timing) and the profile
   and history do not say.
3. **Prompt.** The clarifying reply asks one guiding question and still
   offers a small step as an option, so a family that does not reply is not
   left with nothing.

**The eval set cannot see this yet.** Every case is one message. A guiding
question scores as "no next step" on a single turn, and the value only shows
in the second one. Testing it needs a small set of two-turn cases: message,
the companion's question, a scripted reply, then the tailored answer is
judged.

## 4. Do not project a card's situation onto the person

Sean, 29.09.2026, row 29 (a message about
wanting more out of life). The reply borrowed `card_011`'s framing, a partner who gave up
a career for the move ("you may have given up more than anyone
acknowledged"), when the message said nothing of the sort. Grounded in the
card, but the card's situation is not this person's. With this little
context Sean would rather the companion ask more before applying any card.

Rule candidate: a card's situation may be used only when the message or the
profile says the person is in it; otherwise ask. Pairs with idea 3 (the
router asks when the right advice depends on something unknown). Also a
candidate judge dimension later: "assumes facts about the person that they
did not state".

Labelling note: the reply ends in a question with no step, so under the
declared rule "next step" is n, even though a question is closer to what
Sean wants here. The rule measures whether a step is there; whether asking
was the better move is ideas 1 and 3, tested with two-turn cases.

## 5. Sean's review of the v3/v4 page, 29.09.2026 evening

- **A guiding question is correct behaviour where context is missing** (Sean's
  decision). "Next step" becomes "moves them forward": a concrete step, or one
  guiding question when the message lacks what is needed to advise (who it is
  about, their goal, their situation). Rows 29 and 30 relabelled y. Needs
  rubric r3 before the next judge test.
- **Unclear who the message is about: ask** (row 9, a message about
  "her" basic German answered as if she were the partner). Concrete instruction for
  the router and CLARIFY; memory and the family profile resolve most of these
  later.
- **Emotional messages end in an offer or a question that points somewhere**
  ("do you want me to help you find something nearby?", "what did you enjoy
  doing before the move?"), not only a step (row 11).
- **A conclusion the card does not draw is not grounded**, even when every word
  comes from the card (row 2: a rule for children living here applied to a
  daughter staying abroad). Rubric r3 and the grounded label rule.
- **Answer the detail the person gave, not the card's generic version** (row
  28: "never went away" after two years, answered with the card's 18 to 24
  month onset).
- **Referral to the provider only when the provider plausibly handles it**
  (row 1: airline and animal entry rules are not what a relocation provider
  decides). v4's "name the one office that decides" already moves this way.
- **Never raw code or raw markdown in front of a family**: broken JSON is now
  salvaged (`7f55ada`); the blocked-answer fallback still pastes a card with
  its `##` heading (rows 5, 10).
- Rows 23 (next step n) and 25 (relevant n) relabelled.
