"""The `card_chunks` table, as `docs/data-model.md` specifies it.

One table for now. The rest of the data model (`tenants`, `seats`, `people`,
`messages`, `flags`, `dispatches`) arrives with the channels and the scheduler;
this is the one retrieval needs.

`tenant_id` is on the chunk row and **denormalised on purpose**. From page 4 of
`technical-architecture.drawio`:

> A similarity search is the one query that does not naturally join back to a
> tenant. If tenant_id lives only on cards, then a vector query has to remember
> to join, and the day someone forgets, one provider's material surfaces inside
> another provider's family conversation.
"""

from __future__ import annotations

from pgvector.sqlalchemy import Vector
from sqlalchemy import Index, Integer, String, Text, UniqueConstraint
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column

from companion.config import settings


class Base(DeclarativeBase):
    pass


class CardChunk(Base):
    __tablename__ = "card_chunks"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    chunk_id: Mapped[str] = mapped_column(String(64))
    card_id: Mapped[str] = mapped_column(String(32))
    tenant_id: Mapped[str] = mapped_column(String(64), index=True)
    ordinal: Mapped[int] = mapped_column(Integer)
    heading: Mapped[str | None] = mapped_column(String(200), nullable=True)
    chunk_text: Mapped[str] = mapped_column(Text)

    # Denormalised off the card so a retrieved chunk can be filtered and
    # rendered without a second query, the same reason `Chunk` carries them.
    situation: Mapped[str] = mapped_column(String(64))
    strand: Mapped[str] = mapped_column(String(32))
    audience: Mapped[str] = mapped_column(String(32))
    journey_from: Mapped[int] = mapped_column(Integer)
    journey_to: Mapped[int] = mapped_column(Integer)

    # Dimension comes from config, which is pinned. A model change is a
    # migration: the column width changes and every row is re-embedded.
    embedding: Mapped[list[float]] = mapped_column(Vector(settings.embedding_dim))

    __table_args__ = (
        # Ingest runs on every boot, so a chunk is identified by (tenant, chunk)
        # and upserted rather than appended. Without this the store doubles each
        # time and every score is computed over duplicates.
        UniqueConstraint("tenant_id", "chunk_id", name="uq_card_chunks_tenant_chunk"),
        # tenant_id leads the index because it is the first thing every query
        # filters on, before the distance operator runs.
        Index("ix_card_chunks_tenant_card", "tenant_id", "card_id"),
    )


class StoreMeta(Base):
    """Facts about what is in the store, per tenant.

    Exists because on 22.09.2026 `card_chunks` served text that had been
    removed from the corpus hours earlier and nothing could detect it. A row
    here records which corpus the vectors were built from, so
    `ingest --check` can answer "is this index current" without re-embedding
    62 chunks to find out.
    """

    __tablename__ = "store_meta"

    tenant_id: Mapped[str] = mapped_column(String(64), primary_key=True)
    key: Mapped[str] = mapped_column(String(64), primary_key=True)
    value: Mapped[str] = mapped_column(String(256))
