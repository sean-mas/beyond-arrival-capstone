"""Shared fixtures. The case set is the specification, so the tests read it."""

import json
import pathlib

import pytest

ROOT = pathlib.Path(__file__).resolve().parents[1]
EVALS = ROOT / "evals"


def _load(name: str) -> list[dict]:
    lines = (EVALS / name).read_text().splitlines()
    return [json.loads(line) for line in lines if line.strip()]


def adversarial(attack_class: str | None = None) -> list[dict]:
    rows = _load("adversarial.jsonl")
    return [r for r in rows if attack_class is None or r["attack_class"] == attack_class]


def core() -> list[dict]:
    # The 75 core cases are harvested forum posts and never leave this
    # repository (21.09.2026). In the published copy the file is absent, and
    # an empty list makes pytest skip the cases rather than fail to collect.
    if not (EVALS / "cases.jsonl").exists():
        return []
    return _load("cases.jsonl")


@pytest.fixture(autouse=True)
def no_tracing(monkeypatch: pytest.MonkeyPatch) -> None:
    """No test ever traces. Found 24.09.2026: once `.env` held local Langfuse
    keys, the API tests sent their stub turns into Sean's Langfuse. A test run
    that writes into the instrument it is meant to be separate from is a test
    run that pollutes the thing being inspected. test_tracing.py re-enables the
    client resolution it needs, explicitly."""
    from companion.obs import tracing

    monkeypatch.setattr(tracing, "_resolved", True)
    monkeypatch.setattr(tracing, "_client", None)


@pytest.fixture(scope="session")
def cards():
    from companion.retrieval.cards import load_corpus

    return load_corpus(ROOT / "content" / "cards")


@pytest.fixture(scope="session")
def chunks(cards):
    from companion.retrieval.chunking import chunk_corpus

    return chunk_corpus(cards)


def _retriever(chunks):
    """A retriever backed by the stub embedder, so tests never need Ollama."""
    from companion.retrieval.embed import StubEmbedder
    from companion.retrieval.store import InMemoryStore
    from companion.retrieval.types import Retriever

    embedder = StubEmbedder()
    store = InMemoryStore()
    store.upsert(embedder.embed_chunks(chunks))
    return Retriever(embedder=embedder, store=store)
