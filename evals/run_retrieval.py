#!/usr/bin/env python3
"""Score retrieval on its own, before any generation touches it.

    python3 evals/run_retrieval.py --tfidf      # lexical control, no model needed
    python3 evals/run_retrieval.py              # dense, needs the embedding model

`docs/evals.md`: "Measure retrieval hit rate **on its own, first**. If the right
chunk is in top-k only 60% of the time, no prompt tuning fixes the answers, and
a week of prompt iteration goes to the wrong layer."

Four decisions this file makes, each of which the specs left open. They are
written down in `docs/retrieval.md` rather than buried here.

**1. Match on `card_id`.** `must_cite` holds `card_020`; retrieval returns
`card_020#1`. Every document says "card id", so a hit is any retrieved chunk
whose card is cited.

**2. Any-hit leads, all-hit follows.** `evals.md` says "is *a* `must_cite` id in
the top-k", `primer.md` says "is *the* expected card id". 21 cases carry two
ids, so the two readings differ and both are reported.

**3. Macro beside micro.** `card_020` is 29 of the 100 citation pairs. A
retriever that always returned the handover card scores about 0.37
understanding nothing, so a per-card macro average is reported next to the
per-case micro average. If they diverge, the micro number is measuring the
crisis card.

**4b. The headline is reported twice, and the second one is the real one.**
All 29 cases citing `card_020` are escalation-positive, and 39 of the 79
scorable cases are. Those turns are halted by the crisis guard *before*
retrieval runs, so their `must_cite` is a routing expectation rather than a
retrieval one: `card_020` is where the conversation should go, not the chunk
that best answers the question. Scoring them as retrieval measures a component
that never executed. **`delivered` is the subset where retrieval actually
decides the answer**, and it is the number that should pick k.

**4. Cases with no `must_cite` are out of the denominator**, because there is
nothing to recall. They are not all the same thing, so they are split:

    corpus gaps   4   no card covers this, and the note says "must not confabulate"
    refusals     20   the turn is refused; what was retrieved is irrelevant
    other        12   mostly PII and injection, handled before retrieval

Only the gaps get their own number, and it is the inverse: the corpus should
*not* produce a confident hit there.
"""

from __future__ import annotations

import argparse
import json
import pathlib
import sys
import time
from collections import defaultdict

sys.path.insert(0, str(pathlib.Path(__file__).resolve().parents[1] / "src"))
sys.path.insert(0, str(pathlib.Path(__file__).resolve().parent))


import history  # noqa: E402
import store_arg  # noqa: E402

from companion.config import settings  # noqa: E402
from companion.retrieval.cards import load_corpus  # noqa: E402
from companion.retrieval.chunking import chunk_corpus  # noqa: E402

HERE = pathlib.Path(__file__).resolve().parent
ROOT = HERE.parent
KS = [1, 2, 3, 4, 5, 6, 8, 10, 12, 15, 20]


def load_cases() -> list[dict]:
    rows = []
    for name in ("cases.jsonl", "adversarial.jsonl"):
        rows += [json.loads(x) for x in (HERE / name).read_text().splitlines() if x.strip()]
    if not rows:
        raise SystemExit("no cases: refusing to report a score over nothing")
    return rows


def classify(case: dict) -> str:
    if case.get("must_cite"):
        return "scorable"
    if "gap" in (case.get("notes") or "").lower():
        return "corpus_gap"
    if case.get("expect_refusal"):
        return "refusal"
    return "other"


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--tfidf", action="store_true", help="lexical control instead of dense")
    ap.add_argument("--model", default=None, help="embedding model; defaults to config")
    ap.add_argument("--json", default=None, help="write results here")
    ap.add_argument(*store_arg.STORE_FLAG_ARGS, **store_arg.STORE_FLAG_KWARGS)
    args = ap.parse_args()

    cards = load_corpus(ROOT / "content" / "cards")
    chunks = chunk_corpus(cards)

    if args.tfidf:
        from companion.retrieval.lexical import TfidfRetriever

        retriever: object = TfidfRetriever(chunks)
        name = "tfidf"
        store_label = "n/a"
    else:
        from companion.retrieval.embed import OllamaEmbedder

        embedder = OllamaEmbedder(args.model)
        retriever, store_label = store_arg.build_retriever(args.store, chunks, embedder)
        name = embedder.name

    cases = load_cases()
    buckets: dict[str, list[dict]] = defaultdict(list)
    for case in cases:
        buckets[classify(case)].append(case)
    scorable = buckets["scorable"]

    started = time.perf_counter()
    max_k = max(KS)
    retrieved: dict[str, list[str]] = {}
    for case in scorable + buckets["corpus_gap"]:
        hits = retriever.search(case["input"], k=max_k)  # type: ignore[attr-defined]
        retrieved[case["id"]] = [h.chunk.card_id for h in hits]
    elapsed = time.perf_counter() - started

    # Where retrieval actually decides the answer: the turn was not halted by a
    # guard before stage 2 ever ran.
    delivered = [c for c in scorable if not c["expect_escalation"] and not c["expect_refusal"]]

    def curve_over(cases: list[dict]) -> dict[int, dict[str, float]]:
        out: dict[int, dict[str, float]] = {}
        for k in KS:
            hit = sum(1 for c in cases if set(c["must_cite"]) & set(retrieved[c["id"]][:k]))
            whole = sum(1 for c in cases if set(c["must_cite"]) <= set(retrieved[c["id"]][:k]))
            per_card: dict[str, list[int]] = defaultdict(lambda: [0, 0])
            for case in cases:
                for card in case["must_cite"]:
                    per_card[card][1] += 1
                    if card in retrieved[case["id"]][:k]:
                        per_card[card][0] += 1
            macro = sum(h / n for h, n in per_card.values()) / len(per_card) if per_card else 0.0
            out[k] = {
                "any": round(hit / len(cases), 4),
                "all": round(whole / len(cases), 4),
                "macro": round(macro, 4),
            }
        return out

    curve = curve_over(scorable)
    curve_delivered = curve_over(delivered)

    results = {
        "run_at": time.strftime("%Y-%m-%dT%H:%M:%S"),
        "retriever": name,
        "chunks": len(chunks),
        "cases_total": len(cases),
        "cases_scorable": len(scorable),
        "cases_delivered": len(delivered),
        "excluded": {kind: len(rows) for kind, rows in buckets.items() if kind != "scorable"},
        "recall_at_k": curve,
        "recall_at_k_delivered": curve_delivered,
        "seconds": round(elapsed, 1),
    }

    header = f"{name} · {len(chunks)} chunks · {len(scorable)} scorable of {len(cases)}"
    print(f"\n{header} · {elapsed:.1f}s\n")
    print(
        f"  all {len(scorable)} scorable          "
        f"delivered only ({len(delivered)}: retrieval actually decides)"
    )
    print("   k   recall   all-ids   macro      recall   all-ids   macro")
    for k in KS:
        a, b = curve[k], curve_delivered[k]
        print(
            f"  {k:>2}    {a['any']:.3f}    {a['all']:.3f}   {a['macro']:.3f}"
            f"       {b['any']:.3f}    {b['all']:.3f}   {b['macro']:.3f}"
        )
    print(f"\n  excluded: {results['excluded']}")

    gaps = buckets["corpus_gap"]
    if gaps:
        confident = [g["id"] for g in gaps if retrieved[g["id"]][:1]]
        print(f"  corpus gaps: {len(gaps)}, of which {len(confident)} still returned a top-1 chunk")

    out = (
        pathlib.Path(args.json)
        if args.json
        else HERE / "results" / f"retrieval-{name.replace('/', '-')}.json"
    )
    out.parent.mkdir(exist_ok=True)
    out.write_text(json.dumps(results, indent=2) + "\n")
    shipped = settings.retrieval_k

    def at(curve: dict, k: int) -> dict:
        """The curve is keyed by int in memory and by str once it is JSON."""
        return curve.get(k) or curve[str(k)]

    curve = results["recall_at_k_delivered"]
    history.append(
        f"retrieval-{name.replace('/', '-')}",
        results,
        extra={
            "shipped_k": shipped,
            "recall_delivered_any_at_shipped_k": at(curve, shipped)["any"],
            "recall_delivered_all_at_shipped_k": at(curve, shipped)["all"],
            "recall_scorable_any_at_shipped_k": at(results["recall_at_k"], shipped)["any"],
            "store": store_label,
        },
    )
    print(f"\n  written to {out}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
