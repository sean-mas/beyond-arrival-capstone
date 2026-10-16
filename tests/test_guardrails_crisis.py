"""The crisis guard.

The model half is measured by `evals/run_guardrails.py --crisis`, not here: a
unit test that needs Ollama running is a unit test that goes red on a train.
What is tested here is everything that must work when the model does not.
"""

import pytest

from companion.guardrails.crisis import check
from companion.guardrails.types import Action, GuardName
from companion.llm.ollama import StubBackend


class ExplodingBackend:
    name = "exploding"

    def complete(self, system: str, user: str, *, json_mode: bool = False):
        raise ConnectionError("ollama is not running")


@pytest.mark.parametrize(
    "text",
    [
        "can I speak to a human please",
        "I want to talk to a real person",
        "could I speak to someone",
        "put me through to someone",
        "I need a consultant",
    ],
)
def test_asking_for_a_human_never_needs_a_model(text: str) -> None:
    """card_020: 'the person asks for a human at any point, for any reason or
    none'. A person asking for a person must not depend on a call succeeding."""
    verdict = check(text, backend=None)
    assert verdict.action is Action.HANDOVER
    assert verdict.detail["trigger"] == "explicit_request"


def test_a_down_classifier_fails_toward_the_human() -> None:
    """The asymmetry, encoded. A classifier that is down must not become a
    system that answers crisis messages with a content card."""
    verdict = check("I don't really see the point of any of this any more", ExplodingBackend())
    assert verdict.action is Action.HANDOVER
    assert verdict.detail["trigger"] == "classifier_error"


def test_the_classifier_decides_when_it_answers() -> None:
    yes = check("everything feels pointless", StubBackend(['{"needs_human": true, "signal": "x"}']))
    no = check("how do I register", StubBackend(['{"needs_human": false, "signal": ""}']))
    assert yes.action is Action.HANDOVER
    assert no.action is Action.CONTINUE
    assert yes.guard is GuardName.CRISIS


def test_malformed_json_from_the_model_fails_toward_the_human() -> None:
    verdict = check("everything feels pointless", StubBackend(["not json at all"]))
    assert verdict.action is Action.HANDOVER


def test_an_idiom_with_a_violent_word_is_not_a_keyword_hit() -> None:
    """a030. There is no keyword list in this guard, and this asserts it stays
    that way: 'murder' must not fire anything on its own."""
    assert check("I could murder a decent cup of tea", backend=None).action is Action.CONTINUE


def test_no_attribute_about_the_person_is_returned() -> None:
    """expose.md: the system 'holds no record of how a family is coping'. The
    verdict may say what fired; it may not carry a score or a label."""
    verdict = check("I want to speak to a human", backend=None)
    assert set(verdict.detail) <= {"trigger", "reply", "signal", "error"}
    assert "score" not in verdict.detail and "risk" not in verdict.detail


@pytest.mark.parametrize(
    "text",
    [
        "honestly I think we should move back next year",
        "we keep going round in circles about whether to move back",
        "my life back home was easier, I miss it",
        "we might go home for good next summer",
    ],
)
def test_a_decision_to_leave_never_needs_a_model(text: str) -> None:
    """card_020: 'something expensive and hard to reverse'. c069's note: if
    this is ever missed, the guard is broken. So it cannot depend on a model."""
    verdict = check(text, backend=None)
    assert verdict.action is Action.HANDOVER
    assert verdict.detail["trigger"] == "return_intention"


@pytest.mark.parametrize(
    "text",
    [
        "I'm going back home for Christmas",
        "does a licence I get here still count back home once I leave",
        "we move back into the flat after the renovation",
    ],
)
def test_visiting_home_is_not_leaving(text: str) -> None:
    assert check(text, backend=None).action is not Action.HANDOVER


def test_an_expiring_passport_is_not_an_expiring_permit() -> None:
    """c030 was a false handover: the passport was expiring, not the permit."""
    text = "will I be able to renew my Blue Card when my passport expires around then"
    assert check(text, backend=None).action is not Action.HANDOVER


def test_an_expiring_permit_still_hands_over() -> None:
    verdict = check("my blue card expires next month and there are no appointments")
    assert verdict.detail["trigger"] == "expiring_permit"
