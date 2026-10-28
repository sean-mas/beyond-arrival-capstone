"""Cards to chunks to vectors to Postgres, idempotent, with a digest.

    python3 -m companion.retrieval.ingest              # global tenant
    python3 -m companion.retrieval.ingest --tenant acme
    python3 -m companion.retrieval.ingest --check      # is the store current?

The step that makes the store's contents a fact rather than a hope. Before it
existed, `card_chunks` held 62 rows embedded from a corpus that had since been
rewritten: on 22.09.2026 four cards lost verbatim quotes for an eval leak and a
re-identification risk, and the database still served the removed text. Nothing
detected it, because nothing compared the two.

So ingest writes a **corpus digest** alongside the rows, and `--check` compares
it to the cards on disk. The same twelve hex characters go into
`evals/history.jsonl`, so a stale index and a stale metric are the same
question asked in two places.

Idempotent by `(tenant_id, chunk_id)` upsert: running it twice changes nothing,
which is what lets it sit in front of every eval run without a guard.
"""

from __future__ import annotations

import argparse
import hashlib
import pathlib
import sys

from companion.retrieval.cards import load_corpus
from companion.retrieval.chunking import chunk_corpus

ROOT = pathlib.Path(__file__).resolve().parents[3]
CARDS = ROOT / "content" / "cards"


def corpus_digest(directory: pathlib.Path | None = None) -> str:
    """Twelve hex characters over the card files, sorted by name.

    Identical to `evals/history.corpus_digest`, deliberately: one number that
    means "this corpus" wherever it appears.
    """
    h = hashlib.sha256()
    for path in sorted((directory or CARDS).glob("*.md")):
        h.update(path.name.encode())
        h.update(path.read_bytes())
    return h.hexdigest()[:12]


def ingest(
    store: object,
    tenant_id: str = "global",
    directory: pathlib.Path | None = None,
    embedder: object | None = None,
) -> dict[str, object]:
    """Embed every chunk and upsert it. Returns what happened, for the caller
    to print or assert on."""
    from companion.retrieval.embed import OllamaEmbedder

    cards = load_corpus(directory or CARDS)
    chunks = chunk_corpus(cards)
    if not chunks:
        raise SystemExit("no chunks: refusing to ingest an empty corpus")

    embedder = embedder or OllamaEmbedder()
    embedded = embedder.embed_chunks(chunks, tenant_id=tenant_id)  # type: ignore[attr-defined]
    store.upsert(embedded)  # type: ignore[attr-defined]

    digest = corpus_digest(directory)
    if hasattr(store, "set_meta"):
        store.set_meta(tenant_id, "corpus_digest", digest)  # type: ignore[attr-defined]
    return {
        "tenant_id": tenant_id,
        "cards": len(cards),
        "chunks": len(chunks),
        "corpus_digest": digest,
        "model": getattr(embedder, "name", "unknown"),
    }


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--tenant", default="global")
    ap.add_argument("--url", default=None, help="database URL; defaults to config")
    ap.add_argument("--check", action="store_true", help="compare, do not write")
    args = ap.parse_args()

    from companion.retrieval.store import PgVectorStore

    store = PgVectorStore(args.url)

    if args.check:
        stored = store.get_meta(args.tenant, "corpus_digest")
        current = corpus_digest()
        rows = store.count(args.tenant)
        print(f"  tenant {args.tenant}: {rows} rows, stored digest {stored or 'none'}")
        print(f"  corpus on disk: {current}")
        if stored != current:
            print("\n  STALE. Run without --check to re-ingest.", file=sys.stderr)
            return 1
        print("\n  current")
        return 0

    result = ingest(store, args.tenant)
    print(
        f"  {result['chunks']} chunks from {result['cards']} cards "
        f"into tenant {result['tenant_id']} via {result['model']}"
    )
    print(f"  corpus digest {result['corpus_digest']}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
