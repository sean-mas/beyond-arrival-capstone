"""The parser is a guardrail, so it is tested against bad cards as well as good ones."""

import pathlib

import pytest

from companion.retrieval.cards import Card, CardError, load_corpus, parse_card

CORPUS = pathlib.Path(__file__).resolve().parents[1] / "content" / "cards"

GOOD = """---
id: card_999
situation: test_situation
strand: cultural_companion
audience: partner
title: "A card for testing"
journey_months: [2, 12]
corridor: "*-DE"
sources:
  - "Some traceable source: https://example.org/a"
must_not_say:
  - anything that names a mental health condition
escalate_if:
  - the person says they cannot see a reason to get up
related: [card_011]
---
Lead paragraph. <!-- REVIEW: too formal here --> Still the lead.

## What people actually do

Do the thing.

## What does not work

Waiting.
"""


def write(tmp_path: pathlib.Path, text: str, name: str = "card_999_test.md") -> pathlib.Path:
    p = tmp_path / name
    p.write_text(text, encoding="utf-8")
    return p


def test_parses_the_real_corpus() -> None:
    cards = load_corpus(CORPUS)
    assert len(cards) == 20
    assert all(isinstance(c, Card) for c in cards)
    assert {c.strand for c in cards} <= {"orientation", "life_setup", "cultural_companion"}


def test_review_comments_never_survive_parsing() -> None:
    """The one contract content/validate_cards.py names explicitly: these are
    working notes to Sean and must not reach a family. Every downstream path
    goes through this parser, so this is the only place it can be enforced."""
    for card in load_corpus(CORPUS):
        assert "<!--" not in card.body, f"{card.id} still carries a review comment"


def test_review_comments_are_stripped_from_a_card_that_has_one(tmp_path: pathlib.Path) -> None:
    """The known-bad input. Without it the test above passes on a corpus that
    simply has no comments today, and would keep passing if stripping broke."""
    card = parse_card(write(tmp_path, GOOD))
    assert "<!--" not in card.body
    assert "too formal here" not in card.body
    assert card.body.startswith("Lead paragraph.")
    assert "Still the lead." in card.body


def test_a_card_with_no_sources_is_refused(tmp_path: pathlib.Path) -> None:
    bad = GOOD.replace(
        'sources:\n  - "Some traceable source: https://example.org/a"', "sources: []"
    )
    with pytest.raises(CardError, match="no sources"):
        parse_card(write(tmp_path, bad))


def test_an_unknown_strand_is_refused(tmp_path: pathlib.Path) -> None:
    with pytest.raises(CardError, match="strand"):
        parse_card(write(tmp_path, GOOD.replace("strand: cultural_companion", "strand: vibes")))


def test_missing_frontmatter_is_refused(tmp_path: pathlib.Path) -> None:
    with pytest.raises(CardError, match="frontmatter"):
        parse_card(write(tmp_path, "Just a body, no frontmatter.\n"))


def test_an_empty_corpus_is_refused_rather_than_returned(tmp_path: pathlib.Path) -> None:
    """A retrieval layer with nothing in it answers every question with
    silence, which looks exactly like one that is working. Same failure shape
    as validate_cards.py printing "0 cards checked" and exiting clean."""
    with pytest.raises(CardError, match="refusing to build an empty corpus"):
        load_corpus(tmp_path)


def test_duplicate_ids_are_refused(tmp_path: pathlib.Path) -> None:
    write(tmp_path, GOOD, "card_999_a.md")
    write(tmp_path, GOOD, "card_999_b.md")
    with pytest.raises(CardError, match="duplicate card id"):
        load_corpus(tmp_path)


def test_escalate_if_survives_parsing() -> None:
    """An unparsed escalate_if is a guard that never fires, which is the
    quietest way this product could fail."""
    cards = load_corpus(CORPUS)
    assert all(c.escalate_if for c in cards if c.strand == "cultural_companion")
