#!/usr/bin/env python3
"""How much of today's hosted budget this machine has spent.

    make budget

Groq's free tier allows 200,000 tokens a day per model, counted over a rolling
24 hours, and the day it ran out (30.09.2026) nothing warned beforehand. This
reads the token log every hosted call writes (`private/usage/hosted.jsonl`,
numbers only) and prints the rolling total per model.

It sees this machine only. The Render deploy, if it shares the key, spends from
the same budget and is not in this log, so treat the remainder as an upper
bound.
"""

from __future__ import annotations

import json
import pathlib
import sys
import time
from collections import defaultdict

sys.path.insert(0, str(pathlib.Path(__file__).resolve().parents[1] / "src"))

from companion.llm.cloud import USAGE_LOG  # noqa: E402

DAILY = {"groq": 200_000}
PER_RUN = 35_000
"""A live run with a fresh crisis check: 115 calls of about 300 tokens."""


def spent(window_s: float = 86_400) -> dict[str, int]:
    totals: dict[str, int] = defaultdict(int)
    if not USAGE_LOG.exists():
        return totals
    cutoff = time.time() - window_s
    for line in USAGE_LOG.read_text().splitlines():
        if line.strip():
            row = json.loads(line)
            if row["at"] >= cutoff:
                totals[row["model"]] += int(row["tokens"])
    return totals


def main() -> int:
    totals = spent()
    if not totals:
        print("  no hosted calls logged in the last 24 hours")
    for model, used in sorted(totals.items()):
        limit = DAILY.get(model.split("/", 1)[0])
        if limit:
            left = limit - used
            print(
                f"  {model:<32} {used:>8,} of {limit:,} used · {left:>8,} left"
                f" · about {max(left, 0) // PER_RUN} fresh-check run(s)"
            )
        else:
            print(f"  {model:<32} {used:>8,} used, no daily limit known")
    print("  this machine only: a deploy on the same key spends from the same budget")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
