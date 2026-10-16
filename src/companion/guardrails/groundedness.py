"""Does this answer make a checkable claim that nothing supports?

**Not "did retrieval return something".** That was the obvious gate and it is
the wrong one. Sean's position, 22.09.2026: the system should prefer its
retrieved material but is not confined to it, and an answer that passes every
other gate is fine even with nothing retrieved. Blocking on an empty retrieval
would refuse "how do I make friends here", which the model answers perfectly
well unaided and which is not a claim anyone can be harmed by.

The risk is not uniform, so the gate keys on **claim type**:

    "it takes time to build friendships here"   ungrounded, harmless, allowed
    "the Anmeldung deadline is 14 days"         ungrounded, checkable, blocked

A date, a deadline, a euro amount, a percentage, a named authority or a
reserved legal term is a claim a family will act on. Getting one wrong is the
RDG exposure the whole product is built around, and `card_002`'s own deadlines
are exactly the sort of number a model will confabulate fluently.

Two tiers, and only the first runs live:

* **rule tier, here.** Deterministic, no model, ~1 ms. Extracts checkable
  claims from the answer and asks whether the retrieved text contains them.
* **judge tier, `evals/judge.py`.** Scores groundedness 0 to 1 for the metric.
  Offline, because a second model call per turn doubles latency and cost.

A block here is **not a refusal**. `docs/product/refusal-definition.md`: a
refusal is declining because answering would assess this person's individual
case. This is the system declining to state a fact it cannot support, which is
a different act with a different reply.
"""

from __future__ import annotations

import re

from companion.guardrails.types import Action, GuardName, Verdict

# A number attached to a unit of time, money or proportion. Bare integers are
# excluded deliberately: "two to four sentences" and "one of you" are not
# claims, and matching them would block every answer that counts anything.
CHECKABLE = [
    (
        # Units run from minutes to years. The first version stopped at days,
        # and the first answer through it claimed "a break of at least 30
        # minutes" about German working time and shipped unchallenged. A family
        # acts on a break entitlement as readily as on a visa deadline; the
        # unit does not decide how expensive being wrong is. `[-\s]?` catches
        # "an 8-hour shift", where the number and the unit are hyphenated.
        #
        # Plurals are optional (`minutes?`) rather than alternated
        # (`minute|minutes`), because `minute` followed by `\b` never matches
        # "minutes". A measuring script written the alternated way reported
        # zero affected cases on 23.09.2026. That is how the shape of this bug
        # hides: the same mistake in the instrument and in the thing measured.
        "deadline",
        re.compile(
            r"\b\d{1,3}\s*[-\s]?\s*"
            r"(?:minutes?|minuten|hours?|stunden?|days?|weeks?|months?|years?"
            r"|Tage?|Wochen|Monate?|Jahre?)\b",
            re.I,
        ),
    ),
    # `euros?`: until E2 (29.09.2026) the plural escaped the check entirely,
    # so "about 1,900 euros a month" was never compared with anything.
    ("money", re.compile(r"(?:€|EUR\s?)\s?\d[\d.,]*k?|\b\d[\d.,]*\s?k?\s?(?:euros?|EUR)\b", re.I)),
    ("percentage", re.compile(r"\b\d{1,3}([.,]\d+)?\s?(?:%|percent|Prozent)\b", re.I)),
    ("date", re.compile(r"\b(?:within|by|before|after|until)\s+(?:the\s+)?\d{1,2}\w{0,2}\b", re.I)),
    (
        "legal_term",
        re.compile(
            r"\b(?:entitled to|entitlement|legally required|must by law|obliged to|"
            r"gesetzlich|Anspruch auf)\b",
            re.I,
        ),
    ),
    (
        "authority",
        re.compile(
            r"\b(?:Ausl(?:ä|ae)nderbeh(?:ö|oe)rde|B(?:ü|ue)rgeramt|Jugendamt|Finanzamt|"
            r"Familienkasse|Einwohnermeldeamt|Krankenkasse)\b"
        ),
    ),
]

# E2b, Sean's decision 30.09.2026. The authority pattern was built to stop a
# model telling a family that an office decides, pays or requires something
# the material does not say. It also stopped the next step Sean asked for in
# his review (lesson 3: name the one office to ask): "contact the local
# Ausländerbehörde" was removed from a permit answer, and that is the right
# office. So an office named as the place to go is allowed; an office named as
# the subject of a claim is still checked against the material.
_REFERRAL = re.compile(
    r"\b(?:contact|ask|call|visit|write to|write (?:an email|a letter) to|email|check with|"
    r"go to|book (?:an )?appointment at)"
    r"\s+(?:(?:the|your|a|an|local|nearest|responsible)\s+){0,3}"
    r"(Ausl(?:ä|ae)nderbeh(?:ö|oe)rde|B(?:ü|ue)rgeramt|Jugendamt|Finanzamt|"
    r"Familienkasse|Einwohnermeldeamt|Krankenkasse)\b",
    re.I,
)


REPLY = (
    "I would rather not give you a number I cannot stand behind. I do not have "
    "material covering that here, and the deadlines and amounts are the part "
    "worth getting from the office itself or from your contact at the provider."
)


def _normalise(text: str) -> str:
    """One spelling per number, so a claim is compared by value, not by format.

    E2, 29.09.2026. The card writes 77.400 euros (German thousands), the model
    writes 77,400 euros, and substring containment called that unsupported.
    Thousands separators go, a decimal comma becomes a point, `51k` becomes
    51000, and every spelling of the currency and of percent becomes one.
    """
    t = re.sub(r"[\s\u00a0]+", " ", text.lower())
    t = re.sub(r"(?<=\d)[.,\u202f ](?=\d{3}\b)", "", t)
    t = re.sub(r"(?<=\d)[.,\u202f ](?=\d{3}\b)", "", t)
    t = re.sub(r"(?<=\d),(?=\d{1,2}\b)", ".", t)
    t = re.sub(r"\b(\d+)\s?k\b", r"\g<1>000", t)
    t = re.sub(r"€\s?(\d[\d.]*)", r"\1 euro", t)
    t = re.sub(r"\b(?:euros|eur)\b", "euro", t)
    t = re.sub(r"\s?(?:percent|prozent)\b", "%", t)
    t = re.sub(r"(\d)\s%", r"\1%", t)
    return t


def claims(answer: str) -> list[tuple[str, str]]:
    """Every checkable assertion in the answer, as `(kind, matched text)`."""
    found: list[tuple[str, str]] = []
    for kind, pattern in CHECKABLE:
        for m in pattern.finditer(answer):
            found.append((kind, m.group(0).strip()))
    return found


def unsupported(answer: str, chunks_text: str, question: str = "") -> list[tuple[str, str]]:
    """Claims the retrieved material does not contain.

    Substring containment rather than entailment. It is crude and it is honest
    about being crude: the judge tier does the semantic version offline. What
    this catches is the case that matters, a number that appears in the answer
    and nowhere in the source.
    """
    # The person's own message counts as a source. "Is 51k enough?" answered
    # with "51,000 euros" repeats their number; blocking it was E1's one block.
    haystack = _normalise(chunks_text + "\n" + question)
    missing = [
        (kind, text)
        for kind, text in claims(answer)
        if kind != "authority" and not _supported(kind, text, haystack)
    ]
    # Offices one mention at a time: "contact the Ausländerbehörde" is allowed,
    # "which the Ausländerbehörde would decide" in the same answer is not.
    referral_spans = [m.span(1) for m in _REFERRAL.finditer(answer)]
    for m in CHECKABLE[-1][1].finditer(answer):
        if m.span() in referral_spans or _supported("authority", m.group(0), haystack):
            continue
        missing.append(("authority", m.group(0)))
    return missing


def _supported(kind: str, text: str, haystack: str) -> bool:
    """Money and percentages are compared by value alone: the unit is fixed by
    the kind, and "51000 euro" against the person's "51k a year" is the same
    figure. Everything else keeps its unit, because 14 days and 14 weeks are
    different claims."""
    claim = _normalise(text)
    if kind in ("money", "percentage"):
        number = re.search(r"\d+(?:\.\d+)?", claim)
        if number is None:
            return False
        value = re.escape(number.group(0))
        return re.search(rf"(?<![\d.]){value}(?![\d])", haystack) is not None
    return claim in haystack


def check(answer: str, chunks_text: str, question: str = "") -> Verdict:
    """CONTINUE when every checkable claim is supported, BLOCK otherwise."""
    missing = unsupported(answer, chunks_text, question)
    if not missing:
        return Verdict(
            guard=GuardName.OUTPUT,
            action=Action.CONTINUE,
            detail={"grounded": True, "claims": len(claims(answer))},
        )
    return Verdict(
        guard=GuardName.OUTPUT,
        action=Action.BLOCK,
        detail={
            "grounded": False,
            "reply": REPLY,
            "trigger": "ungrounded_claim",
            "unsupported": [f"{kind}:{text}" for kind, text in missing],
        },
    )
