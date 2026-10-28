#!/usr/bin/env python3
"""Label the held-out handoff set blind, one message at a time.

    python3 evals/holdout_label.py            # resume at the first unlabelled case
    python3 evals/holdout_label.py --status

`holdout-2026-09-24.jsonl` was harvested by a separate agent after the guard
fix `541211f` was committed, with every label left null. This fills
`expect_escalation` and `expect_refusal` in place, saving after each case.
Only the message is shown: not the source, not what the guards do with it,
because either would anchor the label.

Keys: y / n, b back, q stop.
"""

from __future__ import annotations

import argparse
import json
import pathlib
import sys

FILE = pathlib.Path(__file__).resolve().parent / "holdout-2026-09-24.jsonl"

QUESTIONS = (
    ("expect_escalation", "needs a human rather than an answer from the cards?"),
    ("expect_refusal", "asks for advice on this person's own legal, visa, tax or medical case?"),
)


def load() -> list[dict]:
    return [json.loads(x) for x in FILE.read_text().splitlines() if x.strip()]


def save(rows: list[dict]) -> None:
    FILE.write_text("".join(json.dumps(r, ensure_ascii=False) + "\n" for r in rows))


def ask(prompt: str) -> str:
    while True:
        v = input(prompt).strip().lower()[:1]
        if v in ("y", "n", "b", "q"):
            return v
        print("      y, n, b to go back, q to stop")


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--status", action="store_true")
    args = ap.parse_args()

    rows = load()
    todo = [i for i, r in enumerate(rows) if any(r[k] is None for k, _ in QUESTIONS)]
    if args.status or not todo:
        print(f"\n  {len(rows) - len(todo)} of {len(rows)} labelled")
        print("  next: make holdout" if not todo else "  resume: make holdout-label")
        return 0

    print(f"\n  {len(rows)} messages, {len(todo)} to label. Answers save as you go.\n")
    pos = 0
    while pos < len(todo):
        r = rows[todo[pos]]
        print(f"[{pos + 1}/{len(todo)}]  {r['id']}\n  {r['input']}\n")
        answers = {}
        for key, question in QUESTIONS:
            v = ask(f"  {question} (y/n/b/q): ")
            if v in ("b", "q"):
                break
            answers[key] = v == "y"
        if v == "q":
            break
        if v == "b":
            pos = max(0, pos - 1)
            print()
            continue
        r.update(answers)
        save(rows)
        pos += 1
        print()

    left = sum(1 for r in rows if any(r[k] is None for k, _ in QUESTIONS))
    print(f"  saved. {len(rows) - left} of {len(rows)} labelled.")
    print("  next: make holdout" if not left else "  resume: make holdout-label")
    return 0


if __name__ == "__main__":
    sys.exit(main())
