"""Where vectors live. Two implementations, one interface.

`InMemoryStore` is what the tests use, always. A suite that needs a database
goes red on a train and then gets skipped, and a skipped test is a test that
does not exist.

`PgVectorStore` is the real one. Its whole reason for existing is the sentence
on page 4 of `technical-architecture.drawio`:

> A similarity search is the one query that does not naturally join back to a
> tenant. If tenant_id lives only on cards, then a vector query has to remember
> to join, and the day someone forgets, one provider's material surfaces inside
> another provider's family conversation.

So `tenant_id` sits on the chunk row, denormalised on purpose, and **every
search filters on it before the distance operator runs**. Both stores are
tested against the same isolation test for that reason: the guarantee is a
property of the interface, not of Postgres.
"""

from __future__ import annotations

import numpy as np

from companion.retrieval.types import EmbeddedChunk, Hit


class InMemoryStore:
    """numpy. Exact search, which is correct at 62 chunks and honest at any size."""

    def __init__(self) -> None:
        self._rows: list[EmbeddedChunk] = []
        self._matrix: np.ndarray | None = None
        # Same question both stores must answer: which corpus is this index
        # built from. In memory it is a dict; in Postgres it is `store_meta`.
        self._meta: dict[tuple[str, str], str] = {}

    def upsert(self, embedded: list[EmbeddedChunk]) -> None:
        by_key = {(r.tenant_id, r.chunk.id): r for r in self._rows}
        for row in embedded:
            by_key[(row.tenant_id, row.chunk.id)] = row
        self._rows = list(by_key.values())
        self._matrix = None

    def _vectors(self) -> np.ndarray:
        if self._matrix is None:
            raw = np.array([r.vector for r in self._rows], dtype=np.float32)
            norms = np.linalg.norm(raw, axis=1, keepdims=True)
            self._matrix = raw / np.where(norms == 0, 1, norms)
        return self._matrix

    def search(self, vector: list[float], tenant_id: str, k: int) -> list[Hit]:
        if not self._rows:
            return []
        query = np.array(vector, dtype=np.float32)
        query = query / (np.linalg.norm(query) or 1.0)
        scores = self._vectors() @ query

        # The filter runs before the ranking, not after. Filtering afterwards
        # returns fewer than k rows for the caller and, worse, has already read
        # another tenant's vectors to get there.
        allowed = [i for i, r in enumerate(self._rows) if r.tenant_id in (tenant_id, "global")]
        if not allowed:
            return []
        ranked = sorted(allowed, key=lambda i: -scores[i])[:k]
        return [
            Hit(
                chunk=self._rows[i].chunk, score=float(scores[i]), tenant_id=self._rows[i].tenant_id
            )
            for i in ranked
        ]

    def set_meta(self, tenant_id: str, key: str, value: str) -> None:
        self._meta[(tenant_id, key)] = value

    def get_meta(self, tenant_id: str, key: str) -> str | None:
        return self._meta.get((tenant_id, key))

    def count(self, tenant_id: str | None = None) -> int:
        if tenant_id is None:
            return len(self._rows)
        return sum(1 for r in self._rows if r.tenant_id == tenant_id)


class PgVectorStore:
    """Postgres with pgvector. The real store.

    Cosine distance via `<=>`, converted to similarity so both stores return
    the same number for the same pair. A store whose scores mean something
    different from the other store's makes `retrieval_top_score` incomparable
    across runs, which is the one field the thesis reads it for.
    """

    def __init__(self, url: str | None = None, create: bool = True):
        from sqlalchemy import create_engine, text

        from companion.config import settings as _settings
        from companion.retrieval.schema import Base

        self._engine = create_engine(url or _settings.database_url, future=True)
        if create:
            with self._engine.begin() as conn:
                conn.execute(text("CREATE EXTENSION IF NOT EXISTS vector"))
            Base.metadata.create_all(self._engine)

    def upsert(self, embedded: list[EmbeddedChunk]) -> None:
        from sqlalchemy.dialects.postgresql import insert

        from companion.retrieval.schema import CardChunk

        if not embedded:
            return
        rows = [
            {
                "chunk_id": e.chunk.id,
                "card_id": e.chunk.card_id,
                "tenant_id": e.tenant_id,
                "ordinal": e.chunk.ordinal,
                "heading": e.chunk.heading,
                "chunk_text": e.chunk.text,
                "situation": e.chunk.situation,
                "strand": e.chunk.strand,
                "audience": e.chunk.audience,
                "journey_from": e.chunk.journey_months[0],
                "journey_to": e.chunk.journey_months[1],
                "embedding": e.vector,
            }
            for e in embedded
        ]
        statement = insert(CardChunk).values(rows)
        statement = statement.on_conflict_do_update(
            constraint="uq_card_chunks_tenant_chunk",
            set_={
                "chunk_text": statement.excluded.chunk_text,
                "embedding": statement.excluded.embedding,
                "heading": statement.excluded.heading,
            },
        )
        with self._engine.begin() as conn:
            conn.execute(statement)

    def search(self, vector: list[float], tenant_id: str, k: int) -> list[Hit]:
        from sqlalchemy import select

        from companion.retrieval.chunking import Chunk
        from companion.retrieval.schema import CardChunk

        # The tenant filter is in the WHERE clause, so it is applied before the
        # ordering rather than after it. This is the whole white-label promise
        # expressed as one predicate.
        distance = CardChunk.embedding.cosine_distance(vector)
        query = (
            select(
                CardChunk.chunk_id,
                CardChunk.card_id,
                CardChunk.ordinal,
                CardChunk.heading,
                CardChunk.chunk_text,
                CardChunk.situation,
                CardChunk.strand,
                CardChunk.audience,
                CardChunk.journey_from,
                CardChunk.journey_to,
                CardChunk.tenant_id,
                distance.label("distance"),
            )
            .where(CardChunk.tenant_id.in_([tenant_id, "global"]))
            .order_by(distance)
            .limit(k)
        )
        with self._engine.connect() as conn:
            rows = conn.execute(query).all()

        return [
            Hit(
                chunk=Chunk(
                    id=r.chunk_id,
                    card_id=r.card_id,
                    ordinal=r.ordinal,
                    heading=r.heading,
                    text=r.chunk_text,
                    situation=r.situation,
                    strand=r.strand,
                    audience=r.audience,
                    journey_months=(r.journey_from, r.journey_to),
                ),
                # pgvector returns cosine DISTANCE; InMemoryStore returns cosine
                # SIMILARITY. They are converted here so the same pair scores the
                # same number in both, which is what makes retrieval_top_score
                # comparable across runs and across stores.
                score=1.0 - float(r.distance),
                tenant_id=r.tenant_id,
            )
            for r in rows
        ]

    def set_meta(self, tenant_id: str, key: str, value: str) -> None:
        """Record a fact about this tenant's index. Upsert, so ingest is still
        idempotent."""
        from sqlalchemy.dialects.postgresql import insert

        from companion.retrieval.schema import StoreMeta

        statement = insert(StoreMeta).values(tenant_id=tenant_id, key=key, value=value)
        statement = statement.on_conflict_do_update(
            index_elements=["tenant_id", "key"], set_={"value": statement.excluded.value}
        )
        with self._engine.begin() as conn:
            conn.execute(statement)

    def get_meta(self, tenant_id: str, key: str) -> str | None:
        from sqlalchemy import select

        from companion.retrieval.schema import StoreMeta

        query = select(StoreMeta.value).where(
            StoreMeta.tenant_id == tenant_id, StoreMeta.key == key
        )
        with self._engine.connect() as conn:
            row = conn.execute(query).scalar_one_or_none()
        return str(row) if row is not None else None

    def count(self, tenant_id: str | None = None) -> int:
        from sqlalchemy import func, select

        from companion.retrieval.schema import CardChunk

        query = select(func.count()).select_from(CardChunk)
        if tenant_id is not None:
            query = query.where(CardChunk.tenant_id == tenant_id)
        with self._engine.connect() as conn:
            return int(conn.execute(query).scalar_one())
