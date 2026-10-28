"""What retrieval returns, and the two seams it sits behind.

Two Protocols rather than two classes, for the reason the thesis design 6.2
gives: three configurations "varying only the generation stage", with
"guardrails, retrieval and the corpus identical across all three". Retrieval is
on the invariant side of that sentence, so it has to be swappable without being
variable: the same interface, pinned, whichever model is being measured.
"""

from __future__ import annotations

from typing import Protocol

from pydantic import BaseModel, Field

from companion.retrieval.chunking import Chunk


class EmbeddedChunk(BaseModel):
    """A chunk and its vector, ready to store."""

    chunk: Chunk
    vector: list[float]
    tenant_id: str = "global"
    """`global` is the authored corpus, which every tenant can see. A provider's
    own material carries their id. `cards.tenant_id NULL = your global corpus`
    in `docs/data-model.md`, flattened onto the chunk row so a similarity query
    can filter without a join."""


class Hit(BaseModel):
    """One retrieved chunk and how close it was."""

    chunk: Chunk
    score: float
    """Cosine similarity, 0 to 1. Feeds `TurnRecord.retrieval_top_score`."""

    tenant_id: str = "global"


class Embedder(Protocol):
    """Turns text into vectors. **Pinned, never varied.**

    Changing the embedding model invalidates every stored vector and every
    `retrieval_top_score` ever logged, so it is not a knob: it is a migration.
    The same argument `docs/constraints.md` §1 makes for the seven logging
    fields applies here and harder.
    """

    name: str
    dim: int

    def embed_documents(self, texts: list[str]) -> list[list[float]]: ...
    def embed_query(self, text: str) -> list[float]: ...


class VectorStore(Protocol):
    """Where vectors live. In memory for tests, pgvector for real."""

    def upsert(self, embedded: list[EmbeddedChunk]) -> None: ...
    def search(self, vector: list[float], tenant_id: str, k: int) -> list[Hit]: ...
    def count(self, tenant_id: str | None = None) -> int: ...


class Retriever(BaseModel):
    """What the graph actually calls. Wraps an embedder and a store.

    Exists so `nodes.retrieve` depends on one thing rather than two, and so the
    lexical baseline can implement the same shape without owning an embedder.
    """

    model_config = {"arbitrary_types_allowed": True}

    embedder: object
    store: object
    name: str = "dense"

    def search(self, query: str, tenant_id: str = "global", k: int = 5) -> list[Hit]:
        embedder: Embedder = self.embedder  # type: ignore[assignment]
        store: VectorStore = self.store  # type: ignore[assignment]
        return store.search(embedder.embed_query(query), tenant_id, k)


class ScoredChunk(BaseModel):
    """Used by the EDA, which needs every score rather than the top k."""

    chunk_id: str
    card_id: str
    score: float = Field(ge=-1.0, le=1.0)
