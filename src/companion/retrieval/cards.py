"""Parse a situation card into a typed object.

A card is YAML frontmatter plus a markdown body. The frontmatter carries the
things the guardrails need (`must_not_say`, `escalate_if`) alongside the things
retrieval filters on, so parsing is not a formatting concern: an unparsed
`escalate_if` is a guard that never fires.

**Review comments are stripped here and nowhere else.** `content/validate_cards.py`
documents the contract: `<!-- REVIEW: ... -->`, `<!-- FACT: ... -->` and
`<!-- TONE: ... -->` are working notes to Sean that must never reach a family.
They are removed before the body is ever chunked, embedded or shown, because
every downstream path goes through this module.
"""

from __future__ import annotations

import pathlib
import re

import yaml
from pydantic import BaseModel, Field

FRONTMATTER = re.compile(r"\A---\n(.*?)\n---\n(.*)\Z", re.S)
REVIEW_COMMENT = re.compile(r"<!--.*?-->", re.S)

STRANDS = {"orientation", "life_setup", "cultural_companion"}
AUDIENCES = {"employee", "partner", "child", "family"}


class CardError(ValueError):
    """A card that cannot be trusted. Never downgraded to a warning: a card
    missing `sources` is a card whose claims cannot be traced, and
    groundedness measured against it means nothing."""


class Card(BaseModel):
    id: str
    situation: str
    strand: str
    audience: str
    title: str
    journey_months: tuple[int, int]
    corridor: str
    sources: list[str]
    must_not_say: list[str] = Field(default_factory=list)
    escalate_if: list[str] = Field(default_factory=list)
    related: list[str] = Field(default_factory=list)
    body: str

    @property
    def covers_month(self) -> range:
        """The window this card is for, inclusive at both ends."""
        lo, hi = self.journey_months
        return range(lo, hi + 1)


def parse_card(path: pathlib.Path) -> Card:
    text = path.read_text(encoding="utf-8")
    m = FRONTMATTER.match(text)
    if not m:
        raise CardError(f"{path.name}: no YAML frontmatter")

    try:
        meta = yaml.safe_load(m.group(1)) or {}
    except yaml.YAMLError as exc:
        raise CardError(f"{path.name}: frontmatter is not valid YAML: {exc}") from exc

    body = REVIEW_COMMENT.sub("", m.group(2)).strip()
    if not body:
        raise CardError(f"{path.name}: body is empty once review comments are stripped")

    months = meta.get("journey_months")
    if not (isinstance(months, list) and len(months) == 2):
        raise CardError(f"{path.name}: journey_months must be a two-element list")

    if meta.get("strand") not in STRANDS:
        raise CardError(f"{path.name}: strand {meta.get('strand')!r} not in {sorted(STRANDS)}")
    if meta.get("audience") not in AUDIENCES:
        raise CardError(
            f"{path.name}: audience {meta.get('audience')!r} not in {sorted(AUDIENCES)}"
        )
    if not meta.get("sources"):
        raise CardError(f"{path.name}: no sources. An untraceable card cannot be a ground truth")

    return Card(
        id=str(meta["id"]),
        situation=str(meta["situation"]),
        strand=str(meta["strand"]),
        audience=str(meta["audience"]),
        title=str(meta["title"]),
        journey_months=(int(months[0]), int(months[1])),
        corridor=str(meta.get("corridor", "*-DE")),
        sources=[str(s) for s in meta["sources"]],
        must_not_say=[str(s) for s in meta.get("must_not_say", [])],
        escalate_if=[str(s) for s in meta.get("escalate_if", [])],
        related=[str(s) for s in meta.get("related", [])],
        body=body,
    )


def load_corpus(directory: pathlib.Path) -> list[Card]:
    """Every card in a directory, sorted by id.

    Refuses an empty directory rather than returning an empty corpus. A
    retrieval layer with nothing in it answers every question with silence,
    which is indistinguishable from a retrieval layer that is working.
    """
    paths = sorted(directory.glob("card_*.md"))
    if not paths:
        raise CardError(f"no cards in {directory}: refusing to build an empty corpus")

    cards = [parse_card(p) for p in paths]
    seen: dict[str, str] = {}
    for card, path in zip(cards, paths, strict=True):
        if card.id in seen:
            raise CardError(f"duplicate card id {card.id}: {path.name} and {seen[card.id]}")
        seen[card.id] = path.name
    return cards
