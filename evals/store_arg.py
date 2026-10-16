"""One place that decides which store an eval run measures.

    ap.add_argument(*STORE_FLAG_ARGS, **STORE_FLAG_KWARGS)
    retriever, label = build_retriever(args.store, chunks)

Two stores exist and they must return the same scores, so it is tempting to let
a runner fall back from Postgres to memory when the database is down. That is
exactly the wrong behaviour: a silent fallback publishes a number attributed to
the store that did not produce it. The corpus digest problem of 22.09.2026 in a
different costume.

So the choice is explicit, it is printed, and it lands in the history row. A
failure to reach Postgres stops the run and says how to start it.
"""

from __future__ import annotations

import sys

STORE_FLAG_ARGS = ("--store",)
STORE_FLAG_KWARGS = {
    "choices": ["pg", "memory"],
    "default": "pg",
    "help": "which vector store to measure. pg is the shipped one",
}

START_DOCKER = "  docker compose up -d db && PYTHONPATH=src python -m companion.retrieval.ingest"


def build_retriever(store_choice: str, chunks: list, embedder: object | None = None) -> tuple:
    """Returns `(retriever, label)`. The label goes in the history row."""
    from companion.retrieval.embed import runtime_embedder
    from companion.retrieval.types import Retriever

    # The query embedder follows EMBEDDING_PROVIDER, as the app's does, so a
    # run can measure the deployed configuration. Its name reaches the history
    # row through `Retriever.name`. The stored vectors are Ollama's either way:
    # the same bge-m3 weights, checked equal by `make embed-parity`.
    embedder = embedder or runtime_embedder()

    if store_choice == "memory":
        from companion.retrieval.store import InMemoryStore

        store: object = InMemoryStore()
        store.upsert(embedder.embed_chunks(chunks))  # type: ignore[attr-defined]
        return Retriever(embedder=embedder, store=store, name=embedder.name), "memory"  # type: ignore[arg-type]

    from companion.retrieval.ingest import corpus_digest
    from companion.retrieval.store import PgVectorStore

    try:
        store = PgVectorStore()
    except Exception as exc:  # noqa: BLE001 - the message is the point
        print(f"\n  cannot reach Postgres: {exc}\n\n  start it and ingest:\n{START_DOCKER}\n")
        print("  or measure the in-memory store explicitly with --store memory\n")
        raise SystemExit(1) from None

    stored = store.get_meta("global", "corpus_digest")  # type: ignore[attr-defined]
    current = corpus_digest()
    if stored != current:
        # The failure this whole mechanism exists for. Serving vectors built
        # from a corpus that has since changed produces numbers that look fine.
        print(f"\n  index is stale: stored {stored or 'none'}, corpus {current}\n")
        print(f"  re-ingest:\n{START_DOCKER}\n")
        raise SystemExit(1)

    rows = store.count("global")  # type: ignore[attr-defined]
    print(f"  store: pgvector, {rows} rows, corpus {current}")
    return Retriever(embedder=embedder, store=store, name=embedder.name), "pgvector"  # type: ignore[arg-type]


def note(label: str) -> str:
    return f"store={label}"


if __name__ == "__main__":
    sys.exit(0)
