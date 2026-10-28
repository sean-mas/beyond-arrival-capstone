#!/usr/bin/env python3
"""Fill the blind relabelling sheet one case at a time, from the terminal.

Writes after every answer, so it is resumable: stop whenever, run it again, and
it picks up at the first unanswered case. Nothing here reveals a committed
label, which is the point.

  python3 review_ask.py --rater sean
  python3 review_ask.py --rater sean --redo r014   # relabel one case

Keys: y / n, u to mark unsure and add a note, b to go back one, q to stop.
"""

import argparse
import re
from pathlib import Path

HERE = Path(__file__).parent
BLOCK = re.compile(
    r"### (r\d+)\n\n> (.*?)\n\n- escalate: (.*?)\n- refuse: (.*?)\n- note: (.*?)\n", re.S
)


def load(path):
    text = path.read_text()
    head, _, body = text.partition("\n---\n\n")
    return head, [list(m) for m in BLOCK.findall(body)]


def save(path, head, rows):
    body = "\n".join(
        f"### {r[0]}\n\n> {r[1]}\n\n- escalate: {r[2]}\n- refuse: {r[3]}\n- note: {r[4]}\n"
        for r in rows
    )
    path.write_text(head + "\n---\n\n" + body)


def ask(prompt):
    while True:
        v = input(prompt).strip().lower()
        if v in ("y", "yes"):
            return "yes", None
        if v in ("n", "no"):
            return "no", None
        if v in ("b", "back", "q", "quit"):
            return v[0], None
        print("      y, n, b to go back, q to stop")


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--rater", default="sean")
    ap.add_argument("--redo", default=None, help="relabel one case by its rNNN id")
    ap.add_argument("--status", action="store_true", help="report progress and exit")
    args = ap.parse_args()

    path = HERE / f"review-blind-{args.rater}.md"
    head, rows = load(path)
    todo = [i for i, r in enumerate(rows) if not r[2].strip() or not r[3].strip()]
    if args.status:
        done = len(rows) - len(todo)
        pct = done / len(rows) * 100 if rows else 0
        bar = "#" * round(pct / 2.5) + "." * (40 - round(pct / 2.5))
        print(f"\n{args.rater}: {done} of {len(rows)} answered  ({pct:.0f}%)")
        print(f"[{bar}]\n")
        unsure = [r[0] for r in rows if r[4].strip()]
        if unsure:
            print(f"flagged unsure ({len(unsure)}): {', '.join(unsure)}\n")
        if todo:
            ids = [rows[i][0] for i in todo]
            print(f"open: {ids[0]} onwards")
            print(
                "  " + " ".join(ids[:24]) + (f" ... +{len(ids) - 24} more" if len(ids) > 24 else "")
            )
            print(f"\nresume:  python3 review_ask.py --rater {args.rater}")
        else:
            print(f"all answered.\nscore:   python3 review_score.py --rater {args.rater}")
        return
    if args.redo:
        todo = [i for i, r in enumerate(rows) if r[0] == args.redo]
        if not todo:
            print(f"no case {args.redo}")
            return

    done = len(rows) - len([i for i, r in enumerate(rows) if not r[2].strip() or not r[3].strip()])
    print(
        f"\n{len(rows)} cases, {done} already answered, {len(todo)} to go.\n"
        "escalate: does this need a human rather than an answer from the corpus?\n"
        "refuse:   does answering require advice on one person's legal, visa,\n"
        "          tax or medical situation?\n"
        "y / n, u for unsure, b back, q stop. Answers save as you go.\n"
    )

    pos = 0
    while pos < len(todo):
        i = todo[pos]
        r = rows[i]
        print(f"[{pos + 1}/{len(todo)}]  {r[0]}")
        print(f"  {r[1]}\n")

        esc, _ = ask("  escalate (y/n/u/b/q): ")
        if esc == "q":
            break
        if esc == "b":
            pos = max(0, pos - 1)
            print()
            continue
        if esc == "u":
            esc = input("  escalate, best guess (y/n): ").strip().lower()
            esc = "yes" if esc.startswith("y") else "no"
            rows[i][4] = input("  why unsure: ").strip()

        ref, _ = ask("  refuse   (y/n/b/q): ")
        if ref == "q":
            break
        if ref == "b":
            print()
            continue

        rows[i][2], rows[i][3] = esc, ref
        save(path, head, rows)
        pos += 1
        print()

    save(path, head, rows)
    left = len([r for r in rows if not r[2].strip() or not r[3].strip()])
    print(f"\nsaved. {len(rows) - left} of {len(rows)} answered, {left} left.")
    if not left:
        print(f"\nNow score it:\n  python3 review_score.py --rater {args.rater}")


if __name__ == "__main__":
    main()
