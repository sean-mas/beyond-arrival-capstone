"""The same guarantees, against the real store.

Skips when no database is reachable, so the suite still runs on a train. That
is also why these assertions are duplicated from `test_retrieval_store.py`
rather than shared: the isolation guarantee is a property of the interface, and
a property asserted on only one implementation is a property of that
implementation.

    docker compose up -d db
"""

import pathlib

import pytest

from companion.retrieval.cards import load_corpus
from companion.retrieval.chunking import chunk_corpus
from companion.retrieval.embed import StubEmbedder
from companion.retrieval.store import InMemoryStore

ROOT = pathlib.Path(__file__).resolve().parents[1]
URL = "postgresql+psycopg://companion:companion@localhost:5432/companion"


@pytest.fixture(scope="module")
def pg():
    """A store against a scratch table, or a skip."""
    pytest.importorskip("pgvector")
    from sqlalchemy.exc import OperationalError

    from companion.retrieval.store import PgVectorStore

    try:
        store = PgVectorStore(URL)
        store.count()
    except (OperationalError, Exception) as exc:  # noqa: BLE001
        pytest.skip(f"no database reachable: {type(exc).__name__}")
    return store


@pytest.fixture(scope="module")
def corpus():
    return chunk_corpus(load_corpus(ROOT / "content" / "cards"))


@pytest.fixture(scope="module")
def loaded(pg, corpus):
    embedder = StubEmbedder(dim=1024)
    pg.upsert(embedder.embed_chunks(corpus, "test_global"))
    pg.upsert(embedder.embed_chunks(corpus[:6], "test_tenant_b"))
    return embedder


def test_ingest_is_idempotent(pg, loaded, corpus) -> None:
    before = pg.count("test_global")
    pg.upsert(loaded.embed_chunks(corpus, "test_global"))
    assert pg.count("test_global") == before == len(corpus)


def test_a_tenant_never_sees_another_tenants_material(pg, loaded) -> None:
    """Insert two tenants, query as A, assert zero rows from B. Written exactly
    as page 4 of the data model specifies it, and it belongs in CI."""
    hits = pg.search(loaded.embed_query("registering my address"), "test_tenant_a", 60)
    assert hits, "tenant_a should still see the global corpus"
    assert not [h for h in hits if h.tenant_id == "test_tenant_b"]


def test_both_stores_return_the_same_scores(pg, loaded, corpus) -> None:
    """pgvector returns cosine distance and the in-memory store returns cosine
    similarity. If the conversion were wrong, `retrieval_top_score` would mean
    different things in different runs and the thesis could not compare them."""
    memory = InMemoryStore()
    memory.upsert(loaded.embed_chunks(corpus, "test_global"))
    query = loaded.embed_query("health insurance choice")

    from_pg = pg.search(query, "test_global", 5)
    from_memory = memory.search(query, "test_global", 5)

    assert [h.chunk.id for h in from_pg] == [h.chunk.id for h in from_memory]
    for a, b in zip(from_pg, from_memory, strict=True):
        assert a.score == pytest.approx(b.score, abs=1e-4)


def test_the_embedding_dimension_matches_the_pinned_model(pg, loaded) -> None:
    """A configured dimension that disagrees with the model is a column that
    rejects every insert, and the error arrives far from the cause."""
    from companion.config import settings

    assert loaded.dim == settings.embedding_dim == 1024
