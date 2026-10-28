#!/usr/bin/env python3
"""Grade a finished run's answers, later, with any judge.

    python3 evals/rejudge.py --run run_generation-1790258811 --judge groq:qwen/qwen3.8-27b
    python3 evals/rejudge.py --run <run_id> --judge <spec> --resume    # after a quota stop

Generation and judging were one loop until 29.09.2026. That coupled two
things with different limits: the answers need Ollama Cloud, the judge needs
Groq's 200k tokens a day, and a judge that has not passed calibration yet
should not hold up the answers it will later grade. So a tier runs with
`--no-judge`, and this grades the turn log afterwards.

**Same inputs as the in-run judge.** The MATERIAL is rebuilt from the turn's
chunk ids by `calibrate_judge.material_for`, the builder calibration uses, so
the judge that passed calibration sees what it saw there. The QUESTION is the
logged one, which is PII-redacted, again as in calibration.

Delivered means what `run_generation.summarise` means: neither escalated nor
refused. Each verdict is checkpointed as it lands, so a quota stop costs
nothing but the wait.
"""

from __future__ import annotations

import argparse
import json
import pathlib
import sys
import time

sys.path.insert(0, str(pathlib.Path(__file__).resolve().parents[1] / "src"))
sys.path.insert(0, str(pathlib.Path(__file__).resolve().parent))

import history  # noqa: E402
from calibrate_judge import material_for  # noqa: E402
from judge import RUBRIC_VERSION, Judge, backend_from_spec  # noqa: E402

from companion.obs.sink import DEFAULT_DIR  # noqa: E402

SCORES = ("groundedness", "relevance", "tone", "actionable")


def turns_of(run_id: str, logs: pathlib.Path = DEFAULT_DIR) -> dict[str, dict]:
    """The run's last turn per case. A resumed or retried case logs twice."""
    turns: dict[str, dict] = {}
    for path in sorted(logs.glob("turns-*.jsonl")):
        for line in path.read_text().splitlines():
            if line.strip():
                row = json.loads(line)
                if row.get("run_id") == run_id and row.get("case_id"):
                    turns[row["case_id"]] = row
    return turns


def checkpoint_path(run_id: str, judge_name: str) -> pathlib.Path:
    slug = judge_name.replace("/", "_").replace(":", "_")
    return DEFAULT_DIR / f"judged-{run_id}-{slug}.jsonl"


def mean(values: list) -> float | None:
    real = [v for v in values if isinstance(v, (int, float))]
    return round(sum(real) / len(real), 4) if real else None


def summarise(verdicts: list[dict]) -> dict:
    parsed = [v for v in verdicts if v.get("parsed")]
    out = {f"{k}": mean([v.get(k) for v in parsed]) for k in SCORES}
    out["answer_relevance"] = out.pop("relevance")
    out["n_judged"] = len(verdicts)
    out["judge_parse_rate"] = round(len(parsed) / len(verdicts), 4) if verdicts else None
    return out


def kappa_for(judge_name: str) -> float | None:
    """The judge's calibration, if it has one. Never guessed."""
    slug = judge_name.replace("/", "_").replace(":", "_")
    path = DEFAULT_DIR.parent / "calibration" / f"kappa-{slug}.json"
    if not path.exists():
        return None
    calibration = json.loads(path.read_text())
    # A kappa earned under other scoring rules does not vouch for these.
    if calibration.get("rubric") != RUBRIC_VERSION:
        return None
    return calibration.get("judge_kappa")


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--run", required=True, help="the run_id whose answers to grade")
    ap.add_argument("--judge", required=True, help="provider:model, e.g. groq:qwen/qwen3.8-27b")
    ap.add_argument("--suite", default=None, help="history suite; default <source suite>-judged")
    args = ap.parse_args()

    turns = turns_of(args.run)
    if not turns:
        raise SystemExit(f"no turns logged for {args.run}")
    under_test = next(iter(turns.values())).get("model")
    judge = Judge(backend_from_spec(args.judge), under_test=under_test)

    delivered = {
        cid: t
        for cid, t in turns.items()
        if not t.get("escalated") and not t.get("refused") and (t.get("answer") or "").strip()
    }
    if not delivered:
        # 12.10.2026: a comparison script whose generation step had failed
        # handed this a guard run, and it wrote three history rows grading
        # nothing. A grade over zero answers is not a number.
        raise SystemExit(f"{args.run} delivered no answers to grade: refusing to write a row")
    ckpt = checkpoint_path(args.run, judge.name)
    done: dict[str, dict] = {}
    if ckpt.exists():
        for line in ckpt.read_text().splitlines():
            if line.strip():
                v = json.loads(line)
                done[v["case_id"]] = v
    print(f"  {args.run} · {under_test} · {len(delivered)} delivered · {len(done)} already judged")
    print(f"  judge {judge.name}")

    started = time.perf_counter()
    failures = 0
    stopped: str | None = None
    with ckpt.open("a") as out:
        for cid, turn in sorted(delivered.items()):
            if cid in done:
                continue
            s = judge.score(turn["question"], material_for(turn["chunk_ids"]), turn["answer"])
            if not s.parsed:
                # `Judge.score` swallows the transport error into an unparsed
                # verdict. Three in a row is the quota, not three bad replies,
                # and checkpointing them would count the quota as the judge's
                # parse failures. Stop, keep what is real, resume later.
                failures += 1
                if failures >= 3:
                    stopped = "three unparsed in a row, likely a quota: resume later"
                    break
                continue
            failures = 0
            verdict = {"case_id": cid, "turn_id": turn.get("turn_id"), **s.as_dict()}
            done[cid] = verdict
            out.write(json.dumps(verdict, ensure_ascii=False) + "\n")
            out.flush()
            print(f"    {len(done):>3}/{len(delivered)} {cid} g={s.groundedness} r={s.relevance}")

    verdicts = list(done.values())
    complete = len(verdicts) >= len(delivered) and stopped is None
    # Named after the run it grades, so `tier-2-live` is graded as
    # `tier-2-live-judged` and the two rows sit side by side in the history.
    source = next((r["suite"] for r in history.read() if r.get("run_id") == args.run), "run")
    results = {
        "source_run_id": args.run,
        "generation_backend": under_test,
        "judge": judge.name,
        "rubric": RUBRIC_VERSION,
        "judge_kappa": kappa_for(judge.name),
        "n_delivered": len(delivered),
        "partial": not complete,
        "stopped_early": stopped,
        **summarise(verdicts),
        "seconds": round(time.perf_counter() - started, 1),
    }
    print(json.dumps(results, indent=2))
    if not complete:
        print(f"\n  {len(delivered) - len(verdicts)} left. Nothing written to history yet.")
        print(f"  resume: python3 evals/rejudge.py --run {args.run} --judge {args.judge}")
        return 1
    suite = args.suite or f"{source}-judged"
    history.append(suite, results, note=f"{under_test} judged by {judge.name}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
