"""A reply the model wrapped in broken JSON still reaches the family as words."""

from __future__ import annotations


def test_broken_json_never_reaches_the_family() -> None:
    """Case c075 under prompt v4: `"confidence": 0. nine` broke the parse."""
    from companion.agent.nodes import _salvage

    raw = '{"answer":"Ask the district school office early.", "confidence":0. nine}'
    assert _salvage(raw) == "Ask the district school office early."
    assert _salvage("Plain prose stays as it is.") == "Plain prose stays as it is."
