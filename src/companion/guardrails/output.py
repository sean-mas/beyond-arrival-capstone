"""Check what the model wrote before anyone reads it.

Two kinds of rule, and only the second is deterministic today.

**Per-card.** Every card carries `must_not_say`, and the point of putting it on
the content rather than in a prompt is that it can be checked. `content/README.md`:
"Every card carries `must_not_say` and `escalate_if` so the boundary sits on the
content rather than only in a prompt."

**Global**, from the same file, and both are bans this repo has already had to
enforce once:

    no failure-rate percentage   folklore, traced by Harzing to misquotation
    no dip at a named month      the U-curve is not supported by the literature

`must_not_say` lines are written for a human reader ("anything that names,
describes or assesses a mental health condition"), so they cannot be matched
literally. Each is mapped to a checkable pattern here, and the mapping is the
part to distrust: it is a lossy reading of a sentence, and the eval set is what
says whether the reading was good enough.

The groundedness gate is **not** here yet. It needs retrieval and a judge, so it
arrives with RAG at the end of the week. Its fallback is already decided and
drawn: send the retrieved card verbatim rather than an ungrounded paraphrase.
"""

from __future__ import annotations

import re

from companion.guardrails.types import Action, GuardName, Verdict
from companion.retrieval.cards import Card

# The two global bans. These apply to every answer regardless of which card
# was cited.
GLOBAL_BANS: list[tuple[str, str, re.Pattern[str]]] = [
    (
        "failure_rate",
        "printed a failure-rate percentage, which this repo killed as folklore on 29.08.2026",
        re.compile(
            r"\b\d{1,3}\s?(?:%|percent|per\s?cent)\b[^.?!]{0,60}"
            r"\b(fail|failure|leave|leaving|return|quit|abandon|break\s?down)\w*",
            re.I,
        ),
    ),
    (
        "u_curve",
        "promised a dip or recovery at a named month, which the literature does not support",
        re.compile(
            r"\b(month|week)\s+(three|four|five|six|seven|eight|nine|ten|\d{1,2})\b[^.?!]{0,50}"
            r"\b(dip|low|lowest|worst|crisis|bottom|turn|improve|better|recover|lift)\w*"
            r"|\bby\s+month\s+\w+\b[^.?!]{0,30}\b(better|easier|improve|settle)\w*",
            re.I,
        ),
    ),
]

# `must_not_say` is prose. Each recurring line is mapped to something checkable.
# The mapping is the weak part and is stated as such: it reads a sentence and
# guesses at its surface forms.
MUST_NOT_SAY_PATTERNS: list[tuple[re.Pattern[str], re.Pattern[str]]] = [
    (
        re.compile(r"mental health condition", re.I),
        re.compile(
            r"\b(depress\w+|anxiet\w+|anxious|burnout|burn-out|PTSD|trauma\w*|"
            r"diagnos\w+|disorder|mental\s+(health\s+)?(issue|condition|illness))\b",
            re.I,
        ),
    ),
    (
        re.compile(r"therapy or treatment|framed as therapy|counselling, therapy", re.I),
        re.compile(r"\b(therapy|therapist|counsell?ing|treatment|cure|heal(ing)?)\b", re.I),
    ),
    (
        re.compile(r"phase which will pass by a particular month|dip at month", re.I),
        # Covered by the u_curve global ban; kept so the card's own line maps to
        # something rather than silently matching nothing.
        re.compile(r"\b(month|week)\s+\w+\b[^.?!]{0,40}\b(pass|over|better|easier)\b", re.I),
    ),
    (
        re.compile(r"promise about response times", re.I),
        re.compile(
            r"\bwithin\s+\d+\s+(hours?|days?|minutes?)\b|\bwill\s+call\s+you\s+back\b", re.I
        ),
    ),
]

FALLBACK_REASON = "output guard blocked the draft; sending the card verbatim"


def check(answer: str, cards: list[Card] | None = None) -> Verdict:
    """Screen a draft answer. BLOCK means fall back to the card verbatim.

    Blocking is never a dead end here. The fallback is already the design:
    `companion-workflow-sketch.drawio` draws the edge as "grounded, or the card
    verbatim", so a blocked draft becomes the provider's own paragraph rather
    than silence.
    """
    for rule, reason, pattern in GLOBAL_BANS:
        if match := pattern.search(answer):
            return Verdict(
                guard=GuardName.OUTPUT,
                action=Action.BLOCK,
                reason=reason,
                detail={"rule": rule, "matched": match.group(0)[:60], "fallback": True},
            )

    for card in cards or []:
        for line in card.must_not_say:
            for line_pattern, answer_pattern in MUST_NOT_SAY_PATTERNS:
                if line_pattern.search(line) and (hit := answer_pattern.search(answer)):
                    return Verdict(
                        guard=GuardName.OUTPUT,
                        action=Action.BLOCK,
                        reason=f"{card.id} must_not_say: {line[:60]}",
                        detail={
                            "rule": "must_not_say",
                            "card_id": card.id,
                            "matched": hit.group(0)[:60],
                            "fallback": True,
                        },
                    )

    return Verdict.clean(GuardName.OUTPUT)
