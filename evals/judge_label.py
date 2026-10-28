#!/usr/bin/env python3
"""Fill the judge calibration sheet one answer at a time, from the terminal.

    python3 evals/judge_label.py               # pass 1, grounded, with the material
    python3 evals/judge_label.py --relevance   # pass 2, relevant + next step, same 30
    python3 evals/judge_label.py --status

The sheet only carried chunk ids, so labelling it meant looking up six chunks by
hand for every row. Pass 1 shows the question, the answer and the same MATERIAL
the judge is given, in the same order. Writes after every answer, so it can be
stopped at any point.

**Two passes because they are two different claims.** Sean found on row 5 of
pass 1 an answer that was grounded and wrong: faithful to the cards and still
not what the person needed. Groundedness cannot see that, and relevance is the
judge's other score that nobody had checked. Pass 2 shows no material, because
relevance is about the question and the answer, and seeing the cards invites
grading groundedness twice. It refuses to start until pass 1 is finished, so
the two never write the sheet at the same time.

Nothing here shows a judge verdict: the judge has not run yet, and `--score`
refuses a sheet that carries one. Labelling first is the point.

Keys: y, n, u unsure (best guess plus a note), b back, q stop.
"""

from __future__ import annotations

import argparse
import json
import sys

from calibrate_judge import SHEET, material_for

PASSES = {
    "grounded": {
        "questions": [("human", "note", "grounded?")],
        "material": True,
        "rule": (
            "grounded = every factual claim in the ANSWER is supported by the MATERIAL.\n"
            "  No facts at all (a question, sympathy, encouragement) is y: usefulness is pass 2.\n"
            "  True in real life but not in the MATERIAL is n: the promise is the provider's\n"
            "  material. One unsupported number, name or rule is enough for n."
        ),
    },
    # Two labels per answer since 29.09.2026. The first sheet had one
    # "helpful" label folding both halves together, and Sean called 14 answers
    # helpful that had no next step: the judge could not be compared against a
    # label that meant two things. Now each label matches one judge score.
    "relevance": {
        "questions": [
            ("human_relevant", "note_relevant", "relevant: answers what was asked?"),
            ("human_actionable", "note_actionable", "next step: one concrete thing to do?"),
        ],
        "material": False,
        "rule": (
            "relevant = the ANSWER addresses the QUESTION this person actually asked, not a\n"
            "  nearby one. Ignore where facts came from, and ignore whether there is a next step.\n"
            "next step = it leaves them one concrete thing: something to try, someone to ask,\n"
            "  a place to look. A question back or sympathy alone is n."
        ),
    },
}


def load() -> list[dict]:
    if not SHEET.exists():
        raise SystemExit("no sheet yet: run `make judge-sheet` first")
    return [json.loads(x) for x in SHEET.read_text().splitlines() if x.strip()]


def save(rows: list[dict]) -> None:
    SHEET.write_text("".join(json.dumps(r, ensure_ascii=False) + "\n" for r in rows))


def next_step(rows: list[dict]) -> str:
    if any(r.get("human") is None for r in rows):
        return "resume: make judge-label"
    if any(r.get(f) is None for r in rows for f, _, _ in PASSES["relevance"]["questions"]):
        return "next: make judge-relevance"
    return "next: make judge-score"


def _done(row: dict, spec: dict) -> bool:
    return all(row.get(field) is not None for field, _, _ in spec["questions"])


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--relevance", action="store_true", help="pass 2: relevance")
    ap.add_argument("--status", action="store_true")
    args = ap.parse_args()
    p = PASSES["relevance" if args.relevance else "grounded"]

    rows = load()
    if args.status:
        for name, spec in PASSES.items():
            done = sum(1 for r in rows if _done(r, spec))
            print(f"  {name:<10} {done} of {len(rows)} labelled")
        print(f"  {next_step(rows)}")
        return 0
    if args.relevance and any(r.get("human") is None for r in rows):
        raise SystemExit("finish pass 1 first: make judge-label")

    todo = [i for i, r in enumerate(rows) if not _done(r, p)]
    if not todo:
        print(f"\n  all {len(rows)} labelled for this pass\n  {next_step(rows)}")
        return 0

    done = len(rows) - len(todo)
    print(f"\n  {len(rows)} answers, {done} labelled, {len(todo)} to go.\n  {p['rule']}\n")
    pos = 0
    while pos < len(todo):
        r = rows[todo[pos]]
        print("=" * 78)
        print(f"[{pos + 1}/{len(todo)}]  QUESTION\n  {r['question']}\n")
        print(f"ANSWER\n{r['answer']}\n")
        if p["material"]:
            print("MATERIAL")
            for cid in r["chunk_ids"]:
                print(f"--- {cid}\n{material_for([cid])}\n")
        answers: dict = {}
        step = 0
        while step < len(p["questions"]):
            field, note, prompt = p["questions"][step]
            v = input(f"  {prompt} (y/n/u/b/q): ").strip().lower()[:1]
            if v in ("q", "b"):
                break
            if v == "u":
                v = "y" if input("  best guess (y/n): ").strip().lower().startswith("y") else "n"
                answers[note] = input("  why unsure: ").strip()
            if v not in ("y", "n"):
                print("  y, n, u, b or q")
                continue
            answers[field] = v == "y"
            step += 1
        if v == "q":
            break
        if v == "b":
            pos = max(0, pos - 1)
            continue
        r.update(answers)
        save(rows)
        pos += 1

    print(f"\n  saved.\n  {next_step(rows)}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
