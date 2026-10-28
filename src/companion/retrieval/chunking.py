"""Split a card into the units retrieval actually returns.

Cards are split on their `## ` headings rather than on a token count. The
corpus was written to a shape, documented in `content/README.md`: a lead that
says what is happening, then "What people actually do", then "What does not
work". Those are three different answers to three different questions, and a
sliding window would cut across them mid-sentence and retrieve half of each.

The size distribution this produces is the first EDA plot in
`docs/requirements.md`, so it is measured rather than assumed. If sections turn
out to be too long for the k that `recall@k` picks, split them then, with the
curve as the reason.

Baseline 0 returns the top chunk **verbatim**, so a chunk has to be readable on
its own. That is why the heading is kept in the text: "Look for your local
Volkshochschule" reads as an instruction out of nowhere without "What people
actually do" above it.
"""

from __future__ import annotations

import re

from pydantic import BaseModel

from companion.retrieval.cards import Card

SECTION = re.compile(r"^## +(.+?)\s*$", re.M)


class Chunk(BaseModel):
    """One retrievable unit. `id` is what lands in `TurnRecord.chunk_ids`."""

    id: str
    card_id: str
    ordinal: int
    heading: str | None
    text: str

    # Denormalised from the card so a retrieved chunk can be filtered and
    # rendered without a second lookup. The guardrails need `escalate_if` at
    # the moment the chunk is retrieved, not after another query.
    situation: str
    strand: str
    audience: str
    journey_months: tuple[int, int]

    @property
    def word_count(self) -> int:
        return len(self.text.split())


def chunk_card(card: Card) -> list[Chunk]:
    """Split one card. Always returns at least one chunk."""
    bounds = [(m.start(), m.end(), m.group(1)) for m in SECTION.finditer(card.body)]

    pieces: list[tuple[str | None, str]] = []
    lead = card.body[: bounds[0][0]] if bounds else card.body
    if lead.strip():
        pieces.append((None, lead.strip()))

    for i, (_, end, heading) in enumerate(bounds):
        stop = bounds[i + 1][0] if i + 1 < len(bounds) else len(card.body)
        body = card.body[end:stop].strip()
        if body:
            pieces.append((heading, f"## {heading}\n\n{body}"))

    if not pieces:  # pragma: no cover - load_corpus rejects an empty body first
        pieces = [(None, card.body.strip())]

    return [
        Chunk(
            id=f"{card.id}#{n}",
            card_id=card.id,
            ordinal=n,
            heading=heading,
            text=text,
            situation=card.situation,
            strand=card.strand,
            audience=card.audience,
            journey_months=card.journey_months,
        )
        for n, (heading, text) in enumerate(pieces)
    ]


def chunk_corpus(cards: list[Card]) -> list[Chunk]:
    return [chunk for card in cards for chunk in chunk_card(card)]
