"""A family that posts an identifier is told, in code, not to.

Sean's calibration row 22, 29.09.2026: the guard removed an IBAN and the model
replied "Thanks for sharing your IBAN". Redaction protected the number; the
reply taught the family the opposite of what it should.
"""

from __future__ import annotations

from companion.agent.graph import build
from companion.guardrails import pii
from companion.llm.ollama import StubBackend


def run(chunks, cards, message: str):
    from companion.retrieval.lexical import TfidfRetriever

    # The stub answers in call order: the router first, then the answer.
    replies = [
        '{"route": "answer", "why": "test"}',
        '{"answer": "Register early with the Kita portal.", "confidence": 0.8}',
    ]
    app = build(
        TfidfRetriever(chunks),
        cards,
        StubBackend(['{"needs_human": false}']),
        StubBackend(replies),
    )
    return app.invoke({"tenant_id": "global", "message": message, "verdicts": []})


def test_an_iban_gets_the_notice_before_the_answer(chunks, cards) -> None:
    out = run(chunks, cards, "my IBAN is DE89 3704 0044 0532 0130 00 for the Kita fees")
    assert out["answer"].startswith("I have removed your bank details")
    assert "Register early" in out["answer"]
    # The log holds what the family saw, not the draft before the notice.
    assert out["trace"]["record"]["answer"] == out["answer"]


def test_context_a_family_gives_naturally_gets_no_warning() -> None:
    _, verdict = pii.check("my husband works at Siemens")
    assert pii.notice(verdict) is None


def test_two_kinds_are_named_together() -> None:
    _, verdict = pii.check("call +49 170 1234567, IBAN DE89 3704 0044 0532 0130 00")
    text = pii.notice(verdict) or ""
    assert "bank details" in text and "phone number" in text


def test_a_clean_message_is_untouched(chunks, cards) -> None:
    out = run(chunks, cards, "how do I find a Kita place")
    assert out["answer"].startswith("Register early")
