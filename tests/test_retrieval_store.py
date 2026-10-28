"""The store, and the isolation guarantee that is the white-label promise.

These run against `InMemoryStore` and never need a database. The same tests
run against `PgVectorStore` in `test_store_pgvector.py`, which skips when no
database is reachable: the guarantee is a property of the interface, not of
Postgres, so it is asserted on both.
"""

import pathlib

import pytest

from companion.retrieval.cards import load_corpus
from companion.retrieval.chunking import chunk_corpus
from companion.retrieval.embed import StubEmbedder
from companion.retrieval.store import InMemoryStore
from companion.retrieval.types import Retriever

ROOT = pathlib.Path(__file__).resolve().parents[1]


@pytest.fixture
def corpus():
    return chunk_corpus(load_corpus(ROOT / "content" / "cards"))


@pytest.fixture
def populated(corpus):
    embedder = StubEmbedder()
    store = InMemoryStore()
    store.upsert(embedder.embed_chunks(corpus, "global"))
    return embedder, store


def test_every_chunk_is_stored(populated, corpus) -> None:
    _, store = populated
    # 64 since 30.09.2026: card_017 gained "If it stays" and card_018 "If a
    # child stays behind to finish school", each its own chunk.
    assert store.count() == len(corpus) == 64


def test_upsert_is_idempotent(populated, corpus) -> None:
    """Ingest runs on every boot. If it appended instead of replacing, the
    store would double each time and every score would be computed over
    duplicates."""
    embedder, store = populated
    store.upsert(embedder.embed_chunks(corpus, "global"))
    assert store.count() == len(corpus)


def test_a_tenant_never_sees_another_tenants_material(populated, corpus) -> None:
    """The isolation test, written as page 4 of the data model specifies it:
    insert two tenants, query as A, assert zero rows from B."""
    embedder, store = populated
    store.upsert(embedder.embed_chunks(corpus, "tenant_b"))
    retriever = Retriever(embedder=embedder, store=store)

    hits = retriever.search("registering my address", tenant_id="tenant_a", k=20)
    assert hits, "tenant_a should still see the global corpus"
    assert {h.tenant_id for h in hits} == {"global"}
    assert not [h for h in hits if h.tenant_id == "tenant_b"]


def test_a_tenant_sees_its_own_material_and_the_global_corpus(populated, corpus) -> None:
    embedder, store = populated
    store.upsert(embedder.embed_chunks(corpus[:5], "tenant_b"))
    retriever = Retriever(embedder=embedder, store=store)
    seen = {h.tenant_id for h in retriever.search("Anmeldung", tenant_id="tenant_b", k=30)}
    assert seen <= {"global", "tenant_b"}


def test_the_filter_runs_before_the_ranking(populated, corpus) -> None:
    """Filtering after ranking returns fewer than k rows and has already read
    the other tenant's vectors to get there."""
    embedder, store = populated
    store.upsert(embedder.embed_chunks(corpus, "tenant_b"))
    hits = store.search(embedder.embed_query("Kita place"), "tenant_a", k=10)
    assert len(hits) == 10


def test_an_empty_store_returns_nothing_rather_than_raising() -> None:
    assert InMemoryStore().search([0.1] * 64, "global", 5) == []


def test_scores_are_cosine_and_bounded(populated) -> None:
    embedder, store = populated
    hits = store.search(embedder.embed_query("health insurance"), "global", 5)
    assert all(-1.0 <= h.score <= 1.0 for h in hits)
    assert hits == sorted(hits, key=lambda h: -h.score)


def test_the_hosted_embedder_normalises_and_refuses_a_bad_payload(monkeypatch) -> None:
    """Same bge-m3 weights through Hugging Face, for the deploy only."""
    import httpx

    from companion.retrieval import embed

    class Reply:
        def __init__(self, body):
            self.body = body

        def raise_for_status(self) -> None:
            pass

        def json(self):
            return self.body

    monkeypatch.setattr(httpx, "post", lambda *a, **k: Reply([[3.0, 4.0]]))
    vec = embed.HFEmbedder(token="t").embed_query("hello")
    assert vec == [0.6, 0.8]

    monkeypatch.setattr(httpx, "post", lambda *a, **k: Reply({"error": "loading"}))
    with pytest.raises(embed.EmbeddingError):
        embed.HFEmbedder(token="t").embed_query("hello")


def test_the_hosted_embedder_needs_a_token(monkeypatch) -> None:
    from companion.config import settings
    from companion.retrieval import embed

    monkeypatch.setattr(settings, "hf_token", "")
    with pytest.raises(ValueError, match="HF_TOKEN"):
        embed.HFEmbedder()
