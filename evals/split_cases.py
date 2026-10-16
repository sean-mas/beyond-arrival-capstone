#!/usr/bin/env python3
"""Assign the 70/30 development and held-out split, once, and print the hashes.

Refuses to run twice. A split reassigned after anything has been measured is not a
split, and the held-out discipline in pre-registration section 5 depends on this file
having run exactly one time.

  python3 split_cases.py --check    # report the current state, change nothing
  python3 split_cases.py            # assign the split and rewrite both files
  python3 split_cases.py --force    # only with an amendment logged in the pre-registration
"""

import argparse
import hashlib
import json
import random
from collections import Counter
from pathlib import Path

HERE = Path(__file__).parent
FILES = ("cases.jsonl", "adversarial.jsonl")
SEED = 20260921
HELD_OUT = 0.30


def read(name):
    return [
        json.loads(line, strict=False)
        for line in (HERE / name).read_text().splitlines()
        if line.strip()
    ]


def write(name, rows):
    (HERE / name).write_text("\n".join(json.dumps(r, ensure_ascii=False) for r in rows) + "\n")


def sha(name):
    return hashlib.sha256((HERE / name).read_bytes()).hexdigest()


def stratum(c):
    """Strata that matter: does it escalate, and does it refuse."""
    return (bool(c.get("expect_escalation")), bool(c.get("expect_refusal")))


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--check", action="store_true")
    ap.add_argument("--force", action="store_true")
    args = ap.parse_args()

    data = {n: read(n) for n in FILES}
    allrows = [c for rows in data.values() for c in rows]
    assigned = [c for c in allrows if c.get("split")]

    if args.check or (assigned and not args.force):
        counts = Counter(c.get("split") or "unassigned" for c in allrows)
        print(f"{len(allrows)} cases: " + ", ".join(f"{k}={v}" for k, v in sorted(counts.items())))
        esc = sum(bool(c.get("expect_escalation")) for c in allrows)
        print(f"escalation-positive: {esc} (pre-registration 1.7 requires at least 40)")
        if assigned and not args.check:
            print(
                "\nSplit already assigned. Refusing to reassign, because a split redrawn\n"
                "after measurement is not a split. Use --force only with an amendment\n"
                "logged in 01-thesis/pre-registration.md section 7."
            )
        if args.check:
            for n in FILES:
                print(f"  {n}  sha256 {sha(n)}")
        return

    # Stratified assignment: shuffle within each stratum, take the first 30% as held-out.
    rng = random.Random(SEED)
    buckets = {}
    for c in allrows:
        buckets.setdefault(stratum(c), []).append(c)
    for key in sorted(buckets):
        rows = buckets[key]
        rng.shuffle(rows)
        n_held = round(len(rows) * HELD_OUT)
        for i, c in enumerate(rows):
            c["split"] = "held_out" if i < n_held else "dev"

    for n, rows in data.items():
        write(n, rows)

    counts = Counter(c["split"] for c in allrows)
    print(f"assigned: dev={counts['dev']} held_out={counts['held_out']}")
    for key in sorted(buckets):
        rows = buckets[key]
        h = sum(c["split"] == "held_out" for c in rows)
        print(f"  escalate={str(key[0]):5s} refuse={str(key[1]):5s} n={len(rows):3d} held_out={h}")
    print("\nPaste these into 01-thesis/pre-registration.md section 6:\n")
    for n in FILES:
        print(f"| `evals/{n}` | `{sha(n)}` | (today) |")
    print("\nThe held-out half may now be read exactly twice. Log each read in section 5.")


if __name__ == "__main__":
    main()
