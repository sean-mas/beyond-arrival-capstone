"""The gate keys on claim type, not on whether retrieval returned anything.

Sean's decision, 22.09.2026: prefer the retrieved material, do not be confined
to it. So the tests come in matched pairs. The same ungrounded condition must
pass for a harmless sentence and block for a checkable one, or the gate is
really just an empty-retrieval check wearing a different name.
"""

from __future__ import annotations

import pytest

from companion.guardrails.groundedness import check, claims, unsupported

CARD = (
    "You must register your address at the Buergeramt within 14 days of moving in. "
    "The Kita entitlement runs from the first birthday. At March 2025 about 37,8 "
    "percent of under threes were in some form of care."
)

# Ungrounded and harmless: nothing here is a fact anyone can act on wrongly.
ALLOWED = [
    "It takes longer to make friends here than most people expect, and that is normal.",
    "Try one fixed thing a week rather than two. Two is a plan, and plans fail.",
    "A lot of people describe the second year as harder than the first.",
    "You are not the only person in your position, even though it can feel that way.",
]

# Ungrounded and checkable: a family would act on each of these.
BLOCKED = [
    ("deadline", "You have 30 days to register your address."),
    # Added 23.09.2026. The gate stopped at days, and the one tier-1 answer it
    # let through was a claim about German working time: a break entitlement is
    # acted on exactly as readily as a visa deadline.
    ("minutes", "Employers give you a break of at least 30 minutes."),
    ("hours", "You will wait about 2 hours at the office."),
    ("hyphenated", "An 8-hour shift includes your break."),
    ("german_minutes", "Sie haben 45 Minuten Zeit."),
    ("german_years", "Das gilt fuer 2 Jahre."),
    ("money", "The fee is about EUR 250."),
    ("percentage", "Around 80 percent of families get a place."),
    ("legal_term", "You are legally required to bring a birth certificate."),
    ("authority", "The Finanzamt handles this for you."),
]


@pytest.mark.parametrize("answer", ALLOWED)
def test_harmless_ungrounded_answers_pass_with_nothing_retrieved(answer: str) -> None:
    """The whole point. No material at all, and these still go out."""
    verdict = check(answer, "")
    assert not verdict.halts, f"blocked a harmless answer: {answer}"
    assert verdict.detail["grounded"] is True


@pytest.mark.parametrize("kind,answer", BLOCKED)
def test_checkable_claims_are_blocked_when_nothing_supports_them(kind: str, answer: str) -> None:
    verdict = check(answer, "")
    assert verdict.halts, f"let an unsupported {kind} through: {answer}"
    assert verdict.detail["trigger"] == "ungrounded_claim"
    assert verdict.detail["reply"], "a blocked turn must carry its own wording"


@pytest.mark.parametrize(
    "answer",
    [
        "You must register at the Buergeramt within 14 days of moving in.",
        "About 37,8 percent of under threes were in care.",
    ],
)
def test_the_same_claims_pass_when_the_card_contains_them(answer: str) -> None:
    """The gate is about support, not about numbers being scary."""
    assert not check(answer, CARD).halts


def test_the_case_that_motivated_the_gate() -> None:
    """Measured 22.09.2026: a turn retrieved zero chunks, generated 'The
    Anmeldung deadline is 14 days', and shipped it. Nothing objected."""
    verdict = check("The Anmeldung deadline is 14 days.", "")
    assert verdict.halts
    assert any("14 days" in u for u in verdict.detail["unsupported"])


def test_bare_counts_are_not_claims() -> None:
    """'two to four sentences' and 'one of you' must not trip the gate, or
    every answer that counts anything gets blocked."""
    assert claims("One of you walks into a ready made day. Pick one thing.") == []


def test_a_wrong_number_is_caught_even_when_the_right_one_is_present() -> None:
    """The dangerous shape: plausible, adjacent to real material, and wrong."""
    assert unsupported("You have 30 days to register.", CARD)


def test_german_units_are_matched_too() -> None:
    """The corpus is English prose full of German nouns, and so are the answers."""
    assert check("Sie haben 14 Tage Zeit.", "").halts


def test_a_block_is_not_a_refusal() -> None:
    """`docs/product/refusal-definition.md`: a refusal is declining because
    answering would assess this person's case. This is not that, and counting
    it as one would inflate the refusal rate with a different behaviour."""
    verdict = check("The fee is EUR 100.", "")
    assert verdict.detail.get("trigger") == "ungrounded_claim"
    assert "refus" not in str(verdict.detail).lower()


# Counting is not claiming. The pattern was widened on 23.09.2026 and these are
# the sentences the corpus is actually made of, so a false positive here blocks
# ordinary answers rather than dangerous ones.
NOT_CLAIMS = [
    "Two to four sentences, plain and warm.",
    "One of you walks into a ready made day.",
    "Pick one thing at a fixed time. Two is a plan.",
    "The second year is often harder than the first.",
    "I moved in 2024 and it still feels new.",
    "43 percent said locals were friendly",  # a percentage, caught by its own rule
]


@pytest.mark.parametrize("text", NOT_CLAIMS[:-1])
def test_counting_is_not_claiming(text: str) -> None:
    assert claims(text) == [], f"widened pattern now fires on ordinary prose: {text}"


def test_the_measuring_script_mistake_cannot_recur() -> None:
    """`minute` followed by a word boundary never matches "minutes".

    A script written that way reported zero affected cases on 23.09.2026 while
    the gate had a real hole, because the instrument and the thing it measured
    shared the mistake. Plurals are optional here, and this asserts it.
    """
    for unit in ("minute", "minutes", "hour", "hours", "day", "days", "week", "weeks"):
        assert claims(f"it takes 3 {unit}"), f"singular/plural gap on {unit!r}"


def test_a_number_is_compared_by_value_not_by_format() -> None:
    """E2, 29.09.2026: the card says 77.400 euros, the model 77,400 euros."""
    card = "You can only leave it if your income is above 77.400 euros."
    assert unsupported("The threshold is 77,400 euros.", card) == []
    assert unsupported("The threshold is €77,400.", card) == []
    assert unsupported("The threshold is 70,000 euros.", card) != []


def test_the_plural_is_checked_too() -> None:
    """Until E2, "euros" never matched the money pattern at all."""
    assert unsupported("A flat costs about 1,900 euros a month.", "Rents vary.") != []


def test_the_persons_own_number_is_not_an_invention() -> None:
    assert unsupported("Whether 51,000 euros is enough depends.", "", "is 51k enough") == []


def test_an_office_named_as_where_to_ask_is_allowed() -> None:
    """E2b, 30.09.2026: the right next step was being removed."""
    answer = "If a change is needed, contact the local Ausländerbehörde for clarification."
    assert unsupported(answer, "Nothing about offices here.") == []


def test_an_office_named_in_a_claim_is_still_checked() -> None:
    answer = "The Ausländerbehörde will extend your permit automatically."
    assert unsupported(answer, "Nothing about offices here.") != []


def test_each_mention_of_an_office_is_judged_on_its_own() -> None:
    answer = (
        "A change of employer could need a new permit, which the Ausländerbehörde would "
        "decide. Then contact the Ausländerbehörde to confirm."
    )
    assert unsupported(answer, "Nothing about offices here.") == [("authority", "Ausländerbehörde")]
