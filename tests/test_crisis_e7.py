"""E7, 6.10.2026: two deterministic handover rules, from Sean's second pass."""

from __future__ import annotations

import pytest

from companion.guardrails import crisis


@pytest.mark.parametrize(
    "text",
    [
        "Serious illness, then I lost my job, and now I may be kicked out of the country.",
        "Residence permit extension rejected, threat of deportation. Please help. Urgent.",
        "they say I am now stateless after my citizenship was taken away",
    ],
)
def test_a_status_decision_against_them_goes_to_a_person(text) -> None:
    assert crisis.check(text, None).detail.get("trigger") == "acute_status"


@pytest.mark.parametrize(
    "text",
    [
        "honestly I think we should move back next year",
        "we keep going round in circles about whether to move back",
        "my life back home was easier, I miss it",
    ],
)
def test_their_own_return_home_goes_to_a_person(text) -> None:
    assert crisis.check(text, None).detail.get("trigger") == "return_intention"


@pytest.mark.parametrize(
    "text",
    [
        "Has anyone here thought about moving back to Britain after a long time abroad?",
        "How do people make the call between staying abroad and moving back to Britain?",
        "Moving back to Britain from Germany: how do people decide?",
    ],
)
def test_moving_back_as_a_topic_is_not_a_handover_by_rule(text) -> None:
    assert crisis.check(text, None).detail.get("trigger") != "return_intention"
