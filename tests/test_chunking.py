"""Chunking decides what baseline 0 can return, so it is tested on the real corpus."""

import pathlib

from companion.retrieval.cards import load_corpus
from companion.retrieval.chunking import chunk_card, chunk_corpus

CORPUS = pathlib.Path(__file__).resolve().parents[1] / "content" / "cards"


def test_every_card_produces_at_least_one_chunk() -> None:
    cards = load_corpus(CORPUS)
    for card in cards:
        assert chunk_card(card), f"{card.id} produced no chunks"


def test_chunk_ids_are_unique_and_traceable() -> None:
    """chunk_ids lands in TurnRecord and is how a groundedness score points at
    the text it was measured against. A collision makes that pointer a lie."""
    chunks = chunk_corpus(load_corpus(CORPUS))
    ids = [c.id for c in chunks]
    assert len(ids) == len(set(ids))
    assert all(c.id.startswith(c.card_id + "#") for c in chunks)


def test_no_text_is_lost_in_the_split() -> None:
    """Every non-heading line of a card body appears in some chunk. A silent
    drop here removes an answer the corpus was written to give."""
    for card in load_corpus(CORPUS):
        joined = "\n".join(c.text for c in chunk_card(card))
        for line in card.body.splitlines():
            if line.strip() and not line.startswith("## "):
                assert line.strip() in joined, f"{card.id} lost: {line[:60]}"


def test_a_chunk_reads_on_its_own() -> None:
    """Baseline 0 returns the top chunk verbatim, so a section chunk keeps its
    heading: the instructions read as coming from nowhere without it."""
    for chunk in chunk_corpus(load_corpus(CORPUS)):
        if chunk.heading is not None:
            assert chunk.text.startswith(f"## {chunk.heading}")


def test_chunks_carry_the_metadata_the_guardrails_need() -> None:
    for chunk in chunk_corpus(load_corpus(CORPUS)):
        assert chunk.situation and chunk.strand and chunk.audience
        lo, hi = chunk.journey_months
        assert lo <= hi


def test_the_size_distribution_is_sane_for_retrieval() -> None:
    """Not a style check. A chunk far larger than the rest dominates similarity
    search, and one far smaller never wins. This is the recall@k curve's input,
    and it fails loudly if the corpus shape changes under it."""
    words = [c.word_count for c in chunk_corpus(load_corpus(CORPUS))]
    assert min(words) >= 15, f"a chunk of {min(words)} words is too small to retrieve on"
    assert max(words) <= 400, f"a chunk of {max(words)} words needs splitting"


def test_a_card_with_no_headings_still_chunks() -> None:
    cards = load_corpus(CORPUS)
    card = cards[0].model_copy(update={"body": "One paragraph and nothing else."})
    chunks = chunk_card(card)
    assert len(chunks) == 1
    assert chunks[0].heading is None
    assert chunks[0].ordinal == 0
