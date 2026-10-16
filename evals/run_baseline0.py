#!/usr/bin/env python3
"""Baseline 0: the five-stage turn with the generation stage removed.

    python3 evals/run_baseline0.py            # rules only, fast
    python3 evals/run_baseline0.py --crisis   # with the measured crisis classifier

`docs/requirements.md`: "The groundedness gate's fallback path, send the
retrieved card verbatim, is a complete system with no LLM in it. That is
baseline 0. It is not a strawman: for a factual question about a visa
appointment, returning the provider's own paragraph may well beat a paraphrase."

It runs the real nodes in the documented order rather than the compiled graph,
because the graph's `decide` edge is a model call and baseline 0 has no model
in that stage. Everything else is the production path: the same guards, the
same retriever, the same output guard, the same `TurnRecord`.

**What this number is, and what it is not.**

Groundedness is **1.000 by construction, not by measurement**. The answer is a
retrieved chunk, copied. It cannot contain an unsupported claim because it
contains nothing that was not in the corpus. So baseline 0 is the *ceiling* on
groundedness, not a floor generation can be asked to clear, and
`GROUNDEDNESS_BASELINE` in the quality gate cannot be set from this run. That
figure has to come from the first measured generation run with a judge.

What baseline 0 does set, and what every later configuration owes an
improvement against:

* **answer hit**: is the copied chunk from a card the case says must be cited
* **latency and cost per turn**, with no generation in the path
* the safety numbers are *inherited*, not earned: the guards are identical, so
  a later configuration that moves them has moved something it should not have
"""

from __future__ import annotations

import argparse
import json
import pathlib
import statistics
import sys
import time

sys.path.insert(0, str(pathlib.Path(__file__).resolve().parents[1] / "src"))
sys.path.insert(0, str(pathlib.Path(__file__).resolve().parent))

import history  # noqa: E402
import store_arg  # noqa: E402

from companion.agent import nodes  # noqa: E402
from companion.config import settings  # noqa: E402
from companion.llm.ollama import OllamaBackend  # noqa: E402
from companion.obs.sink import default_sink, set_sink  # noqa: E402
from companion.retrieval.cards import load_corpus  # noqa: E402
from companion.retrieval.chunking import chunk_corpus  # noqa: E402

HERE = pathlib.Path(__file__).resolve().parent
ROOT = HERE.parent


def load_cases() -> list[dict]:
    rows = []
    for name in ("cases.jsonl", "adversarial.jsonl"):
        rows += [json.loads(x) for x in (HERE / name).read_text().splitlines() if x.strip()]
    if not rows:
        raise SystemExit("no cases: refusing to report a score over nothing")
    return rows


def mean(values: list) -> float | None:
    real = [v for v in values if v is not None]
    return round(statistics.mean(real), 4) if real else None


def turn(state: dict, retriever: object, cards: list, guard_backend: object | None) -> dict:
    """One baseline-0 turn: guard_in, retrieve, copy, guard_out, act."""
    state.update(nodes.guard_in(state, guard_backend))  # type: ignore[arg-type]
    if any(v.halts for v in state.get("verdicts", [])):
        state.update(nodes.act(state))  # type: ignore[arg-type]
        return state

    state.update(nodes.retrieve(state, retriever))
    chunks = state.get("chunks") or []
    # The whole of baseline 0, in one line.
    state["draft"] = chunks[0].text if chunks else ""
    state.update(nodes.guard_out(state, cards))  # type: ignore[arg-type]
    state.update(nodes.act(state))  # type: ignore[arg-type]
    return state


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--crisis", action="store_true", help="call the local crisis classifier")
    ap.add_argument(
        "--judge",
        action="store_true",
        help="score the copied chunks with the same judge the tiers use",
    )
    ap.add_argument("--judge-model", default=None)
    ap.add_argument(*store_arg.STORE_FLAG_ARGS, **store_arg.STORE_FLAG_KWARGS)
    args = ap.parse_args()

    cards = load_corpus(ROOT / "content" / "cards")
    chunks = chunk_corpus(cards)

    retriever, store_label = store_arg.build_retriever(args.store, chunks)
    guard_backend = OllamaBackend(settings.guard_model) if args.crisis else None

    # Without this, `emit` in `act` drops every record: the module default
    # is NullSink. Wiring the call and never installing a sink is how the
    # seven fields were lost the first time.
    run_id = f"{pathlib.Path(__file__).stem}-{int(time.time())}"
    set_sink(default_sink())

    judge = None
    if args.judge:
        from judge import Judge

        from companion.llm.ollama import OllamaBackend as _OB

        judge = Judge(_OB(args.judge_model) if args.judge_model else None)
        print(f"  judge: {judge.name}")

    cases = load_cases()
    delivered = [
        c
        for c in cases
        if c.get("must_cite") and not c["expect_escalation"] and not c["expect_refusal"]
    ]
    delivered_ids = {c["id"] for c in delivered}

    hits = answered = empty = 0
    judged: list = []
    latencies: list[float] = []
    answer_words: list[int] = []
    started = time.perf_counter()

    for case in cases:
        t0 = time.perf_counter()
        out = turn(
            {
                "tenant_id": "eval",
                "message": case["input"],
                "verdicts": [],
                "run_id": run_id,
                "case_id": case["id"],
                "model": "baseline-0",
            },
            retriever,
            cards,
            guard_backend,
        )
        latencies.append((time.perf_counter() - t0) * 1000)
        answer = out.get("answer") or ""
        halted = bool(out.get("escalated")) or bool(out.get("refused"))

        if case["id"] in delivered_ids:
            answered += 1
            if judge is not None:
                material = "\n\n".join(c.text for c in (out.get("chunks") or []))
                s = judge.score(case["input"], material, answer)
                judged.append(s)
            if not answer.strip():
                empty += 1
            answer_words.append(len(answer.split()))
            top = (out.get("chunks") or [None])[0]
            if top is not None and top.card_id in set(case["must_cite"]):
                hits += 1
        elif not halted and not answer.strip():
            empty += 1

    elapsed = time.perf_counter() - started
    results = {
        "run_id": run_id,
        "system": "baseline-0",
        "description": "retrieval only, top-1 chunk verbatim, no generation model",
        "retriever": retriever.name,
        "store": store_label,
        "guard_backend": f"ollama/{settings.guard_model}" if args.crisis else "rules-only",
        "n_cases": len(cases),
        "n_delivered": answered,
        # The headline. Everything later has to beat this to justify a model.
        "answer_hit_at_1": round(hits / answered, 4) if answered else None,
        "empty_answers": empty,
        "answer_words_median": statistics.median(answer_words) if answer_words else None,
        "latency_ms_median": round(statistics.median(latencies), 1),
        "latency_ms_p90": round(sorted(latencies)[int(len(latencies) * 0.9)], 1),
        "cost_eur_per_turn": 0.0,
        # Two different things, kept apart on purpose.
        #
        # `groundedness_by_construction` is 1.0 because the answer is a copy of
        # the corpus. It is a ceiling, never a gate floor.
        #
        # `groundedness` is what the judge says when it reads the same copied
        # text, and it is the number that belongs on an axis with the tiers.
        # They are not the same claim and they will not be the same number: the
        # judge grades a verbatim chunk as an answer to a question, and a chunk
        # that answers a different question is not grounded in any useful sense.
        "groundedness_by_construction": 1.0,
        # The judge's error on the easiest input that exists.
        #
        # Baseline 0's answer is a verbatim substring of the material it is
        # graded against, so the correct groundedness is exactly 1.0 and any
        # shortfall is the judge being wrong. Measured 23.09.2026: 0.924, so
        # this judge under-scores a literal copy by about 8 points.
        #
        # That number is not a curiosity. Every tier's groundedness is measured
        # on the same instrument, so a tier scoring 0.737 is 0.737 on a scale
        # whose demonstrated ceiling is 0.924, and comparing it against 1.0
        # overstates the gap. It is also a calibration signal that costs no
        # human labels, and it should be recomputed whenever the judge changes.
        "judge_ceiling_on_verbatim": (mean([s.groundedness for s in judged]) if judged else None),
        "groundedness": mean([s.groundedness for s in judged]) if judged else None,
        "answer_relevance": mean([s.relevance for s in judged]) if judged else None,
        "tone": mean([s.tone for s in judged]) if judged else None,
        "judge": judge.name if judge else None,
        "judge_parse_rate": (
            round(sum(1 for s in judged if s.parsed) / len(judged), 4) if judged else None
        ),
        "groundedness_measured": bool(judged),
        "seconds": round(elapsed, 1),
    }

    history.append("baseline-0", results, note="top-1 chunk verbatim, no generation")

    print(f"\nbaseline 0 · {len(cases)} cases · {elapsed:.1f}s\n")
    print(f"  answer hit @1        {results['answer_hit_at_1']}   ({hits}/{answered} delivered)")
    print(f"  empty answers        {empty}")
    print(f"  answer length        {results['answer_words_median']} words (median)")
    print(
        f"  latency              {results['latency_ms_median']} ms median, "
        f"{results['latency_ms_p90']} ms p90"
    )
    print("  cost per turn        0.00 EUR")
    print("  groundedness         1.000 by construction. Not a gate floor.")
    if judged:
        print(f"  judged groundedness  {results['groundedness']}")
        print(f"  judged relevance     {results['answer_relevance']}")
        print(f"  judged tone          {results['tone']}")
        print("\n  those three share an axis with the generation tiers. The rest do not.")
    print("\n  every later configuration is measured against this row in evals/history.jsonl")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
