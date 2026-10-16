"""A blocked answer loses the sentence that was blocked, not the whole answer.

E1, 29.09.2026. The old fallback pasted the top retrieved card verbatim, so a
question about living on 51k in Berlin got the health insurance card with its
markdown heading, because the salary figure matched it best.
"""

from __future__ import annotations

from companion.agent.nodes import _containing, _left_out, _plain, _without
from companion.guardrails import groundedness


def test_only_the_blocked_sentence_goes() -> None:
    draft = (
        "Rents in Berlin vary a lot by district. A family flat costs about 1,900 euros a "
        "month. It is worth asking your provider which districts other families chose."
    )
    out = _without(draft, _containing(["1,900 euros"]), note="A figure was left out.")
    assert "1,900" not in out
    assert out.startswith("Rents in Berlin vary") and out.endswith("A figure was left out.")


def test_too_little_left_sends_the_gates_sentence_never_a_card() -> None:
    assert (
        _without("It costs 1,900 euros.", _containing(["1,900 euros"]), note=None)
        == groundedness.REPLY
    )


def test_no_markdown_heading_reaches_a_family() -> None:
    assert _plain("## Why this is not a normal decision\n\nGoing back is hard.") == (
        "Going back is hard."
    )


def test_the_family_gets_the_fallback_the_log_records(chunks, cards) -> None:
    """The bug E1's first run found: `act` replaced the fallback with the
    gate's sentence, while the log kept the fallback."""
    from companion.agent.graph import build
    from companion.llm.ollama import StubBackend
    from companion.retrieval.lexical import TfidfRetriever

    draft = (
        "Many families find the first months expensive. A family flat costs about €1,937 "
        "a month in most districts. It is worth asking your provider which districts "
        "other families chose."
    )
    app = build(
        TfidfRetriever(chunks),
        cards,
        StubBackend(['{"needs_human": false}']),
        StubBackend(['{"route": "answer", "why": "t"}', f'{{"answer": "{draft}"}}']),
    )
    out = app.invoke({"tenant_id": "global", "message": "is Berlin expensive", "verdicts": []})
    assert "1,937" not in out["answer"]
    assert out["answer"].startswith("Many families find the first months expensive.")
    assert out["trace"]["record"]["answer"] == out["answer"]


def test_the_note_names_what_was_removed() -> None:
    assert "what an office decides" in _left_out(["authority:Ausländerbehörde"])
    assert "an amount" in _left_out(["money:€1,900"])


def test_a_sentence_ending_in_a_quote_is_its_own_sentence() -> None:
    draft = (
        'The Amt decides which form you need. You could ask them, "Which form should I '
        'fill out for my residence permit?" Then email the Amt for the form.'
    )
    out = _without(draft, _containing(["Amt"]), note="Left out an office.")
    assert out.startswith("You could ask them")


def test_a_referral_survives_next_to_a_claim_about_the_same_office() -> None:
    from companion.guardrails import groundedness as g

    draft = (
        "His permit is linked to its type, not to one employer, in most cases here. "
        "If it is employer-specific, the Ausländerbehörde would decide on a new one. "
        "Check his residence card, then contact the Ausländerbehörde to confirm."
    )
    out = _without(draft, lambda s: bool(g.unsupported(s, "")), note="Left out an office.")
    assert "would decide" not in out
    assert "contact the Ausländerbehörde" in out
