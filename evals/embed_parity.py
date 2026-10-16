#!/usr/bin/env python3
"""Do Hugging Face's bge-m3 and the local Ollama bge-m3 give the same vectors?

    make embed-parity        # needs HF_TOKEN in .env and Ollama running

The Render deploy stores vectors made by Ollama and embeds queries through
Hugging Face. That is only sound if the two produce the same vectors for the
same text. Same weights says they should; this measures it on all 62 chunks
and on every eval question, and fails below 0.99 cosine rather than letting a
deploy retrieve against a subtly different space.
"""

from __future__ import annotations

import json
import os
import pathlib
import statistics
import sys

sys.path.insert(0, str(pathlib.Path(__file__).resolve().parents[1] / "src"))

from companion.retrieval.cards import load_corpus  # noqa: E402
from companion.retrieval.chunking import chunk_corpus  # noqa: E402
from companion.retrieval.embed import CloudflareEmbedder, HFEmbedder, OllamaEmbedder  # noqa: E402

HERE = pathlib.Path(__file__).resolve().parent
FLOOR = 0.99


def cosine(a: list[float], b: list[float]) -> float:
    dot = sum(x * y for x, y in zip(a, b, strict=True))
    return dot / ((sum(x * x for x in a) ** 0.5) * (sum(y * y for y in b) ** 0.5))


def main() -> int:
    chunks = [c.text for c in chunk_corpus(load_corpus(HERE.parent / "content" / "cards"))]
    questions = [
        json.loads(line)["input"]
        for name in ("cases.jsonl", "adversarial.jsonl")
        for line in (HERE / name).read_text().splitlines()
        if line.strip()
    ]
    texts = chunks + questions
    # `make embed-parity PROVIDER=cloudflare` checks Workers AI instead.
    hosted = CloudflareEmbedder() if os.environ.get("PROVIDER") == "cloudflare" else HFEmbedder()
    local = OllamaEmbedder()
    sims = [
        cosine(a, b)
        for a, b in zip(local.embed_documents(texts), hosted.embed_documents(texts), strict=True)
    ]
    worst = min(sims)
    print(f"\n  {len(texts)} texts ({len(chunks)} chunks, {len(questions)} questions)")
    median = statistics.median(sims)
    verdict = "PASS" if worst >= FLOOR else "FAIL, do not deploy on this embedder"
    print(f"  cosine, local vs hosted bge-m3: median {median:.5f}, min {worst:.5f}")
    print(f"  floor {FLOOR}: {verdict}\n")
    return 0 if worst >= FLOOR else 1


if __name__ == "__main__":
    raise SystemExit(main())
