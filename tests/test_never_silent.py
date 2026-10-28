"""No route may end a turn with nothing in it.

Found 22.09.2026 on the first full tier-1 run: `clarify` was a conditional edge
straight to `act`, nothing set `answer`, and 25 of 115 turns delivered an empty
string while the trace recorded `action: send`. Twenty-two percent of turns,
counted as delivered by the eval and experienced as silence by the family.

`act`'s own docstring had warned about exactly this for halting verdicts, and
the guarded paths were fine. The unguarded one was not, because no test
asserted over every route.

So this file enumerates the routes rather than sampling them. A new route with
no reply fails here on the day it is added.
"""

from __future__ import annotations

import pytest

from companion.agent.graph import build
from companion.llm.ollama import StubBackend

ROUTES = ["answer", "clarify", "retrieve_more"]


def run(chunks, cards, route: str, gen_replies: list[str] | None = None):
    from companion.retrieval.lexical import TfidfRetriever

    replies = [f'{{"route": "{route}", "why": "test"}}'] * 4
    replies += gen_replies or ['{"answer": "Here is a reply.", "confidence": 0.8}'] * 4
    app = build(
        TfidfRetriever(chunks),
        cards,
        StubBackend(['{"needs_human": false}']),
        StubBackend(replies),
    )
    return app.invoke(
        {"tenant_id": "global", "message": "how do I register my address", "verdicts": []}
    )


@pytest.mark.parametrize("route", ROUTES)
def test_no_route_delivers_an_empty_answer(chunks, cards, route: str) -> None:
    out = run(chunks, cards, route)
    answer = out.get("answer")
    assert answer is not None, f"route {route!r} delivered None"
    assert answer.strip(), f"route {route!r} delivered an empty string"


@pytest.mark.parametrize("route", ROUTES)
def test_no_route_reports_send_without_sending(chunks, cards, route: str) -> None:
    """The part that made it invisible: the trace said the turn was sent."""
    out = run(chunks, cards, route)
    trace = out.get("trace") or {}
    if trace.get("action") == "send":
        assert (out.get("answer") or "").strip(), (
            f"route {route!r} recorded action=send with nothing to send"
        )


def test_clarify_falls_back_to_a_real_sentence_when_the_model_fails(chunks, cards) -> None:
    """A model that does not return JSON must not turn into silence."""
    out = run(chunks, cards, "clarify", gen_replies=["this is not json"] * 4)
    assert len((out.get("answer") or "").split()) > 4


def test_a_halted_turn_still_carries_the_guard_s_own_wording(chunks, cards) -> None:
    """The path that was always correct, asserted so it stays that way."""
    from companion.retrieval.lexical import TfidfRetriever

    app = build(TfidfRetriever(chunks), cards, StubBackend(['{"needs_human": true}']), None)
    out = app.invoke({"tenant_id": "global", "message": "I want to end things", "verdicts": []})
    assert (out.get("answer") or "").strip(), "a halted turn delivered silence"
