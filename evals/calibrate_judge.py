#!/usr/bin/env python3
"""Check the judge against Sean. Two steps, days apart if you like.

    python3 evals/calibrate_judge.py --sheet      # 1. write 30 to hand-label
    # ... fill in the `human` column in private/calibration/sheet.jsonl ...
    python3 evals/calibrate_judge.py --score      # 2. judge the same 30, report kappa

`docs/primer.md`: "Without this the judge is an assumption wearing a number."

**Why this cannot be automated.** Calibration measures agreement between the
judge and *you*. A second model filling in the human column measures agreement
between two models and reports it as human agreement, which is worse than not
measuring at all because it produces a number that looks like evidence.

**Why the sheet is written before the judge runs.** Labelling after seeing the
judge's verdict is anchoring, and the kappa comes out high for a reason that
has nothing to do with the judge. The sheet carries no judge output, and
`--score` refuses to run if the file already contains one.

**Where it lives.** `private/calibration/`, gitignored, because the sheet
contains the eval questions verbatim and 75 of those are harvested forum posts.
Only the kappa is published.

Cohen's kappa on the binary `grounded` verdict. `docs/evals.md` wants 0.6.
"""

from __future__ import annotations

import argparse
import json
import pathlib
import random
import sys

sys.path.insert(0, str(pathlib.Path(__file__).resolve().parents[1] / "src"))
sys.path.insert(0, str(pathlib.Path(__file__).resolve().parent))

from judge import RUBRIC_VERSION, Judge, backend_from_spec, cohens_kappa  # noqa: E402

from companion.obs.sink import DEFAULT_DIR  # noqa: E402
from companion.retrieval.cards import load_corpus  # noqa: E402
from companion.retrieval.chunking import chunk_corpus  # noqa: E402

HERE = pathlib.Path(__file__).resolve().parent
CARDS = HERE.parent / "content" / "cards"
OUT = DEFAULT_DIR.parent / "calibration"
SHEET = OUT / "sheet.jsonl"
N = 30
SEED = 20260922


CONSTANT_MODELS = {"baseline-0"}
"""Systems whose answers are grounded by construction.

Baseline 0 copies a retrieved chunk, so a human labelling its answers writes
`true` thirty times and Cohen's kappa over a constant column is undefined. The
code warned about that *after* the labelling, which is the wrong end: the whole
cost of calibration is the forty-five minutes, and a guard that fires once they
are spent has saved nothing.
"""


def finished_runs(rows: list[dict]) -> list[tuple[str, str, int]]:
    """`(run_id, model, answered turns)` for every completed run in the log."""
    import history

    done = {r.get("run_id") for r in history.read() if r.get("run_id")}
    seen: dict[str, list[str, str, int]] = {}
    for row in rows:
        rid = row.get("run_id")
        if rid not in done or not rid:
            continue
        entry = seen.setdefault(rid, [rid, str(row.get("model")), 0])
        entry[2] += 1
    return [tuple(v) for v in seen.values()]  # type: ignore[misc]


def pick_run(rows: list[dict], wanted: str | None) -> str:
    """Which run to calibrate against. Never guessed silently."""
    runs = finished_runs(rows)
    if wanted:
        match = [r for r in runs if r[0] == wanted]
        if not match:
            raise SystemExit(f"no finished run {wanted}.\n{_table(runs)}")
        return match[0][0]

    usable = [r for r in runs if r[1] not in CONSTANT_MODELS]
    if not usable:
        raise SystemExit(
            "the only finished runs are systems whose answers are grounded by "
            "construction, so every label would be the same and kappa would be "
            f"undefined.\n{_table(runs)}\n  run a generation tier first: make tier1-bg\n"
        )
    return usable[-1][0]


def _table(runs: list[tuple[str, str, int]]) -> str:
    lines = ["\n  finished runs in this log:"]
    for rid, model, n in runs:
        mark = "  (grounded by construction, unusable)" if model in CONSTANT_MODELS else ""
        lines.append(f"    {rid}  {model}  {n} answers{mark}")
    lines.append("\n  choose one with --run <run_id>")
    return "\n".join(lines)


def latest_turns(wanted: str | None = None) -> list[dict]:
    """The most recent turn log. Real answers, not fixtures: a judge calibrated
    on invented text is calibrated on the wrong distribution."""
    files = sorted(DEFAULT_DIR.glob("turns-*.jsonl"))
    if not files:
        raise SystemExit(
            "no turn records yet.\n\n  run a generation tier first:\n"
            "    python3 evals/run_generation.py --tier 1\n"
        )
    # Every file, not the newest. The turn log rolls daily, so a run that
    # finished at 20:45 yesterday is in yesterday's file and invisible to a
    # sampler that reads `files[-1]`. Found 23.09.2026, when the only finished
    # run in today's file was a baseline.
    rows = [json.loads(x) for f in files for x in f.read_text().splitlines() if x.strip()]
    answered = [
        r for r in rows if r.get("answer") and not r.get("escalated") and not r.get("refused")
    ]
    # One run only. The log is one file per day and on 22.09.2026 a single file
    # held a baseline-0 run, a smoke run and a full tier-1 run; sampling across
    # them would calibrate the judge on a mixture of card text and model text
    # and report the result as a judgement about the model.
    runs = [r.get("run_id") for r in answered if r.get("run_id")]
    if runs:
        newest = pick_run(answered, wanted)
        answered = [r for r in answered if r.get("run_id") == newest]

        # A run writes its history row when it finishes, so a run_id absent
        # from the history is a run still in flight. Sampling one gives
        # whatever the first N cases happened to be, which is the eval set in
        # file order rather than a sample of the run.
        import history

        finished = {row.get("run_id") for row in history.read()}
        if newest not in finished:
            raise SystemExit(
                f"run {newest} has not finished: {len(answered)} turns so far, "
                "and no history row.\n\n"
                "  wait for `make tier1` to print its numbers, then sheet from it.\n"
            )
        print(f"  sampling run {newest}")
        return answered

    # No run_id at all means every record predates the field, so there is
    # nothing to filter on and the sample would span whatever ran that day.
    # Measured 22.09.2026: the first sheet drawn this way was 20 baseline-0
    # rows and 10 tier-1 rows. Two thirds of it was card text copied verbatim,
    # which is grounded by construction, so the human column would have been
    # almost all true and the kappa would have described the corpus rather than
    # the judge.
    versions = {r.get("prompt_version") for r in answered}
    raise SystemExit(
        "these turn records carry no run_id, so a sample would mix runs.\n\n"
        f"  prompt versions present: {sorted(v for v in versions if v)}\n\n"
        "  run one tier first, then sheet from it:\n"
        "    make tier1\n"
        "    make judge-sheet\n"
    )


def write_sheet(wanted: str | None = None) -> int:
    # Hand labels are the one input here that costs Sean an hour. Overwriting
    # a labelled sheet by drawing a new one would destroy them silently.
    if SHEET.exists() and any(
        json.loads(x).get("human") is not None for x in SHEET.read_text().splitlines() if x.strip()
    ):
        raise SystemExit(f"{SHEET} carries labels: move it into an archive folder first")
    rows = latest_turns(wanted)
    versions = {r.get("prompt_version") for r in rows}
    if len(versions) > 1:
        raise SystemExit(
            f"this run spans prompt versions {sorted(v for v in versions if v)}.\n"
            "  A sheet drawn across them calibrates the judge on two systems at once."
        )
    if len(rows) < N:
        print(f"  only {len(rows)} answered turns available; writing all of them")
    random.Random(SEED).shuffle(rows)
    OUT.mkdir(parents=True, exist_ok=True)
    with SHEET.open("w", encoding="utf-8") as fh:
        for row in rows[:N]:
            fh.write(
                json.dumps(
                    {
                        "turn_id": row["turn_id"],
                        "question": row["question"],
                        "answer": row["answer"],
                        "chunk_ids": row.get("chunk_ids", []),
                        # Your column. true = every factual claim in the answer
                        # is supported by the material. An answer stating no
                        # facts is true.
                        "human": None,
                    },
                    ensure_ascii=False,
                )
                + "\n"
            )
    print(f"  {min(N, len(rows))} rows in {SHEET}\n")
    print('  Set "human" to true or false on every row, then run --score.')
    print("  true  = every factual claim is supported by the retrieved material")
    print("  false = at least one claim is not")
    return 0


def material_for(chunk_ids: list[str], cards: pathlib.Path = CARDS) -> str:
    """The MATERIAL the judge saw in the run, rebuilt from the turn's chunk ids.

    Built exactly as `run_generation.py` builds it: the retrieved chunks in
    retrieval order, joined by a blank line. **Until 24.09.2026 `score` passed
    an empty string here**, so the judge would have graded groundedness against
    no material at all and the kappa would have measured nothing. An id that no
    longer resolves means the corpus changed since the run, and the sheet must
    be redrawn rather than scored against different text.
    """
    by_id = {c.id: c.text for c in chunk_corpus(load_corpus(cards))}
    missing = [i for i in chunk_ids if i not in by_id]
    if missing:
        raise SystemExit(f"chunk ids not in the current corpus: {missing}. Redraw the sheet.")
    return "\n\n".join(by_id[i] for i in chunk_ids)


RELEVANT_AT = 0.7
GATE = 0.6
"""The judge's scores are numbers, Sean's pass 2 is a yes or no. Cut at the
same 0.7 the judge prompt already uses for `grounded`, so no verdict gets a
threshold of its own chosen after seeing the data."""


def verdict_at(score: float | None) -> bool | None:
    """A judge score as a yes or no, at the one declared cut. None stays None."""
    return None if score is None else score >= RELEVANT_AT


LABELS = (
    # (label field, judge score, report name). One judge score per label since
    # 29.09.2026: the first sheet's single "helpful" label was compared against
    # relevance AND actionable, and Sean's pass showed the label meant less than
    # that rule did. Each score now earns or fails its own kappa.
    ("human", "groundedness", "grounded"),
    ("human_relevant", "relevance", "relevant"),
    ("human_actionable", "actionable", "actionable"),
)


def agreement(human: list[bool], machine: list[bool]) -> dict:
    # Kappa over a column where the human said the same thing every time is
    # 0/0: nobody tried to catch a failure, so nothing was measured. It was
    # reported as 1.0 on 29.09.2026, when all 30 answers were grounded and both
    # judges agreed, and would have passed the gate. It is None instead, and a
    # None never counts as usable.
    if len(set(human)) < 2:
        return {
            "n": len(human),
            "raw_agreement": round(
                sum(1 for a, b in zip(human, machine, strict=True) if a == b) / len(human), 4
            ),
            "kappa": None,
            "human_positive_rate": round(sum(human) / len(human), 4),
        }
    return {
        "n": len(human),
        "raw_agreement": round(
            sum(1 for a, b in zip(human, machine, strict=True) if a == b) / len(human), 4
        ),
        "kappa": round(cohens_kappa(human, machine), 4),
        "human_positive_rate": round(sum(human) / len(human), 4),
    }


def report(name: str, result: dict) -> None:
    print(f"\n  {name}, n={result['n']}")
    print(f"    raw agreement  {result['raw_agreement']:.3f}")
    if result["kappa"] is None:
        print(f"    Cohen's kappa  not measurable: every label is the same (gate: {GATE})")
    else:
        print(f"    Cohen's kappa  {result['kappa']:.3f}   (gate: {GATE})")
    if result["human_positive_rate"] in (0.0, 1.0):
        print("    every human label is the same, so kappa cannot mean anything here.")


def judge_backend(spec: str | None):
    """Kept as a name for existing callers; the parser lives in `judge.py`."""
    return backend_from_spec(spec)


def score(judge_spec: str | None = None) -> int:
    if not SHEET.exists():
        raise SystemExit("no sheet yet: run --sheet first")
    rows = [json.loads(x) for x in SHEET.read_text().splitlines() if x.strip()]
    if any("judge" in r for r in rows):
        raise SystemExit("this sheet already carries judge output; label a fresh one")
    unlabelled = [r["turn_id"] for r in rows if r["human"] is None]
    if unlabelled:
        raise SystemExit(f"{len(unlabelled)} rows still unlabelled, starting {unlabelled[0]}")
    # Pass 2 is optional: groundedness can be reported without it, the other
    # two cannot be reported from a half-labelled column.
    labelled = [f for f, _, _ in LABELS if all(r.get(f) is not None for r in rows)]

    judge = Judge(judge_backend(judge_spec))
    pairs: dict[str, tuple[list[bool], list[bool]]] = {f: ([], []) for f in labelled}
    # Every verdict beside Sean's labels, so a failed kappa can be read row by
    # row. Added 29.09.2026 after gemma4:31b scored -0.16: below chance says
    # the judge and Sean disagree systematically, and only the rows say how.
    verdicts: list[dict] = []
    for row in rows:
        s = judge.score(row["question"], material_for(row["chunk_ids"]), row["answer"])
        scores = s.as_dict()
        verdicts.append(
            {"turn_id": row["turn_id"], **{f: row.get(f) for f, _, _ in LABELS}, **scores}
        )
        if not s.parsed:
            print(f"  unparsed, dropped: {row['turn_id']}")
            continue
        for field, key, _ in LABELS:
            machine = s.grounded if key == "groundedness" else verdict_at(scores[key])
            if field in pairs and machine is not None:
                pairs[field][0].append(bool(row[field]))
                pairs[field][1].append(machine)

    result: dict = {"judge": judge.name, "rubric": RUBRIC_VERSION, "cut": RELEVANT_AT}
    for field, key, name in LABELS:
        if field in pairs and pairs[field][0]:
            result[name] = {**agreement(*pairs[field]), "judge_score": key}
    # Kept at the top level too: `judge_kappa` is the name every history row uses.
    result["judge_kappa"] = result["grounded"]["kappa"]
    # A score is usable only where its own kappa passes. One gate for all
    # three would let a judge good at grounding vouch for its tone of voice.
    result["usable_scores"] = [
        key
        for _, key, name in LABELS
        if name in result and result[name]["kappa"] is not None and result[name]["kappa"] >= GATE
    ]
    (OUT / "kappa.json").write_text(json.dumps(result, indent=2) + "\n")
    # One file per judge as well, so candidates can be compared side by side.
    slug = judge.name.replace("/", "_").replace(":", "_")
    (OUT / f"kappa-{slug}.json").write_text(json.dumps(result, indent=2) + "\n")
    (OUT / f"verdicts-{slug}.jsonl").write_text(
        "".join(json.dumps(v, ensure_ascii=False) + "\n" for v in verdicts)
    )

    print(f"\n  judge {judge.name} against Sean · rubric {RUBRIC_VERSION}")
    for _, _, name in LABELS:
        if name in result:
            report(name, result[name])
        else:
            print(f"\n  {name} not scored: make judge-relevance labels it")
    print(f"\n  usable scores: {result['usable_scores'] or 'none'}")
    return 0


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--sheet", action="store_true")
    ap.add_argument("--run", default=None, help="calibrate against this run_id")
    ap.add_argument("--score", action="store_true")
    ap.add_argument("--judge", default=None, help="provider:model, e.g. groq:qwen/qwen3.8-27b")
    args = ap.parse_args()
    if args.sheet:
        return write_sheet(args.run)
    if args.score:
        return score(args.judge)
    ap.print_help()
    return 1


if __name__ == "__main__":
    raise SystemExit(main())
