#!/usr/bin/env python3
"""A fingerprint of the code that can change a measurement.

    python3 evals/codeprint.py          # print it, and say whether the tree is clean

`git_sha` answers "which commit", and on 24.09.2026 that turned out not to be
enough. `make all` started at c13972c on a clean tree, and while it ran another
session committed 9cec543, which rewrote ANSWER, ROUTE and CLARIFY and bumped
the prompt v2 to v3. Tier 1 finished at 14:06 on v2; the commit landed at 14:22;
tier 2 ran on v3. Two tiers in one "single run", measured on two different
prompts, and the only reason it was visible at all is that the rows carry
`prompt_version` and the dirty suffix.

`prompt_version` is a number a human remembers to bump. This is a hash of the
bytes, so it moves whether or not anyone remembered.

**What counts as measurement code**, and the list is deliberately narrow: a
change to a diagram, a dashboard or a README cannot move a number, and a
fingerprint that trips on those is one people learn to ignore.
"""

from __future__ import annotations

import hashlib
import pathlib
import subprocess

ROOT = pathlib.Path(__file__).resolve().parents[1]

MEASUREMENT_PATHS = (
    "src/companion/agent",
    "src/companion/guardrails",
    "src/companion/retrieval",
    "src/companion/llm",
    "src/companion/config.py",
    "evals/run_generation.py",
    "evals/run_baseline0.py",
    "evals/run_guardrails.py",
    "evals/judge.py",
    "evals/rejudge.py",
    "evals/calibrate_judge.py",
    "evals/store_arg.py",
    "evals/guard_cache.py",
)


def _files() -> list[pathlib.Path]:
    out: list[pathlib.Path] = []
    for rel in MEASUREMENT_PATHS:
        path = ROOT / rel
        if path.is_dir():
            out.extend(sorted(p for p in path.rglob("*.py") if "__pycache__" not in p.parts))
        elif path.is_file():
            out.append(path)
    return sorted(out)


def code_digest() -> str:
    """Twelve hex characters over every file that can move a number.

    Same shape as `history.corpus_digest`, deliberately: one number that means
    "this code", wherever it appears.
    """
    h = hashlib.sha256()
    for path in _files():
        h.update(str(path.relative_to(ROOT)).encode())
        h.update(path.read_bytes())
    return h.hexdigest()[:12]


def dirty_files() -> list[str]:
    """Tracked files that differ from HEAD. Untracked output does not count."""
    try:
        out = subprocess.run(
            ["git", "-C", str(ROOT), "status", "--porcelain", "--untracked-files=no"],
            capture_output=True,
            text=True,
            timeout=5,
            check=False,
        )
    except Exception:  # noqa: BLE001
        return []
    return [line[3:].strip() for line in out.stdout.splitlines() if line.strip()]


def measurement_dirty() -> list[str]:
    """The subset of dirty files that could actually move a number."""
    dirty = dirty_files()
    hits = []
    for name in dirty:
        rel = name.split("/")[-1] if "/" not in name else name
        for path in MEASUREMENT_PATHS:
            if path in name or name.endswith(rel) and path.endswith(rel):
                hits.append(name)
                break
    return sorted(set(hits))


def main() -> int:
    print(f"  code_digest   {code_digest()}")
    hits = measurement_dirty()
    other = [f for f in dirty_files() if f not in hits]
    if hits:
        print("\n  UNCOMMITTED MEASUREMENT CODE:")
        for f in hits:
            print(f"      {f}")
        print("\n  A run started now cannot be reproduced from any commit.")
    else:
        print("  measurement code: clean")
    if other:
        print(f"\n  other uncommitted files ({len(other)}), which cannot move a number:")
        for f in other[:5]:
            print(f"      {f}")
    return 1 if hits else 0


if __name__ == "__main__":
    raise SystemExit(main())
