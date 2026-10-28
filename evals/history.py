#!/usr/bin/env python3
"""The performance history: one appended line per eval run, kept in git.

    from history import append
    append("guardrails", results)

Before this, `run_guardrails.py` wrote `evals/results/latest.json` and
`run_retrieval.py` wrote one file per retriever, both overwritten on every run,
inside a directory `.gitignore` excludes. The result was a project that could
report today's number and had no way to show last week's. "The escalation
prompt improved" is a claim about two measurements, and only one of them
existed.

The split is deliberate:

* **`evals/history.jsonl` is tracked.** Scalar metrics only, no user text, a few
  hundred bytes per run. This is the file that answers "what did this number do
  over four weeks", and it is the file the thesis reads.
* **`evals/results/` stays ignored.** Full curves, per-case detail, anything
  bulky enough to bury a diff. Regenerable from the code at that commit.

Every row carries `git_sha` and `corpus_digest`, because a metric without the
code and the corpus that produced it cannot be compared to anything. The
corpus digest earned its place on 22.09.2026, when four cards were rewritten to
remove verbatim quotes and every retrieval number moved for a reason that had
nothing to do with the retriever.
"""

from __future__ import annotations

import hashlib
import json
import pathlib
import subprocess
from datetime import UTC, datetime
from typing import Any

HERE = pathlib.Path(__file__).resolve().parent
ROOT = HERE.parent
HISTORY = HERE / "history.jsonl"
RESULTS = HERE / "results"


def git_sha() -> str:
    """Short HEAD, suffixed `-dirty` when the tree does not match it.

    A bare sha is a promise that the code producing this number is the code at
    that commit, and an uncommitted edit makes that promise false while leaving
    the row looking authoritative. The suffix is the difference between "this
    run is reproducible" and "this run was made from something close to that
    commit", which is exactly the distinction the thesis needs when two rows
    are put on one axis.

    Returns `unknown` outside a checkout. Never raises.
    """

    def _git(*args: str) -> str:
        out = subprocess.run(
            ["git", "-C", str(ROOT), *args],
            capture_output=True,
            text=True,
            timeout=5,
            check=False,
        )
        return out.stdout.strip()

    try:
        sha = _git("rev-parse", "--short", "HEAD")
        if not sha:
            return "unknown"
        # Only files git tracks. Untracked output, logs and checkpoints are not
        # the code, and flagging on those would make every row dirty forever.
        #
        # Scoped to this capstone and blind to the history itself, 29.09.2026:
        # tier 3 of `make live` was stamped dirty because tier 2 had just
        # appended its row here, and a note in `00-context/` elsewhere in the
        # repo would have done the same. Neither is code that moves a number.
        dirty = _git(
            "status", "--porcelain", "--untracked-files=no", "--", ".", ":!evals/history.jsonl"
        )
        return f"{sha}-dirty" if dirty else sha
    except Exception:  # noqa: BLE001
        return "unknown"


def corpus_digest() -> str:
    """Twelve hex characters over the card files, sorted by name.

    Changes when any card's bytes change, which is exactly when retrieval
    numbers stop being comparable to earlier ones.
    """
    h = hashlib.sha256()
    for path in sorted((ROOT / "content" / "cards").glob("*.md")):
        h.update(path.name.encode())
        h.update(path.read_bytes())
    return h.hexdigest()[:12]


def _is_curve(value: Any) -> bool:
    """A dict keyed by numbers is a curve: recall@1, @2, @3 and so on.

    Curves belong in the detail file. Flattened into the tracked row they add
    sixty-odd fields per run and bury the two numbers anyone reads, which is
    exactly the unreadable diff `evals/results/` is ignored to avoid.
    """
    return isinstance(value, dict) and bool(value) and all(str(k).isdigit() for k in value)


def _scalars(payload: dict[str, Any], prefix: str = "", depth: int = 0) -> dict[str, Any]:
    """Flatten to the values worth plotting. Curves and lists stay behind."""
    flat: dict[str, Any] = {}
    for key, value in payload.items():
        name = f"{prefix}{key}"
        if isinstance(value, dict):
            if _is_curve(value) or depth >= 1:
                continue
            flat.update(_scalars(value, f"{name}.", depth + 1))
        elif isinstance(value, (int, float, str, bool)) or value is None:
            flat[name] = value
    return flat


PROVENANCE = ("run_id", "git_sha", "corpus_digest", "store")
"""What a row must say about itself before it counts as a measurement.

Same idea as `TurnRecord.missing_preregistered()`, applied one level up. A
number that cannot name the code, the corpus, the store and the turns behind it
is an anecdote, and the file exists so that four weeks of them do not become
the thesis's evidence base.

Deliberately not `prompt_version`: a retrieval run has no prompt, and a
requirement that every suite could not meet would be turned off within a week.
"""


def missing_provenance(row: dict[str, Any]) -> list[str]:
    return [k for k in PROVENANCE if not row.get(k)]


def _code_digest() -> str | None:
    """The fingerprint of the code that can move a number, beside the sha.

    Added 30.09.2026: E4b's row names 6c760cd, a website commit made in
    another session while the run was going. The measured code was the same
    as at 186d3f7, and only this digest can say so.
    """
    try:
        import codeprint

        return str(codeprint.code_digest())
    except Exception:  # noqa: BLE001 - provenance must never cost a run its numbers
        return None


def append(
    suite: str,
    payload: dict[str, Any],
    note: str | None = None,
    extra: dict[str, Any] | None = None,
) -> pathlib.Path:
    """Write the full payload to `results/`, append the scalars to the history.

    Returns the detail path. The history row is the durable artefact; the
    detail file is a convenience that the next run may overwrite.
    """
    RESULTS.mkdir(parents=True, exist_ok=True)
    now = datetime.now(UTC)
    detail = RESULTS / f"{suite}-{now:%Y%m%dT%H%M%S}.json"
    detail.write_text(json.dumps(payload, indent=2) + "\n")

    row = {
        "run_at": now.isoformat(timespec="seconds"),
        "suite": suite,
        "git_sha": git_sha(),
        "corpus_digest": corpus_digest(),
        "code_digest": _code_digest(),
        "detail": detail.name,
    }
    if note:
        row["note"] = note
    row.update(_scalars(payload))
    # `extra` is how a runner names its own headline, which a generic
    # flattener cannot guess: recall@6 matters and recall@15 does not.
    row.update(extra or {})
    # Last word on the fields the history owns. A payload carrying its own
    # `run_at` in local time otherwise silently overwrites the UTC stamp, and
    # the file stops being sortable.
    row["run_at"] = now.isoformat(timespec="seconds")
    row["suite"] = suite
    missing = missing_provenance(row)
    if missing and not row.get("allow_incomplete"):
        # Loud, and not fatal. A run that has already spent eighty minutes of
        # model calls must not lose its numbers to a metadata rule, but nobody
        # should be able to read the file later and think the gap was intended.
        row["provenance_incomplete"] = missing
        print(f"  warning: this row cannot name its {', '.join(missing)}")

    with HISTORY.open("a", encoding="utf-8") as fh:
        fh.write(json.dumps(row, ensure_ascii=False) + "\n")
    return detail


def read() -> list[dict[str, Any]]:
    """Every run ever recorded, oldest first."""
    if not HISTORY.exists():
        return []
    return [json.loads(x) for x in HISTORY.read_text().splitlines() if x.strip()]


def main() -> int:
    rows = read()
    if not rows:
        print("no runs recorded yet")
        return 0
    for row in rows:
        metrics = {
            k: v
            for k, v in row.items()
            if k not in {"run_at", "suite", "git_sha", "corpus_digest", "detail", "note"}
            and isinstance(v, (int, float))
        }
        print(
            f"{row['run_at'][:16]}  {row['suite']:<12} {row['git_sha']:<8} {row['corpus_digest']}"
        )
        print("    " + "  ".join(f"{k}={v}" for k, v in metrics.items()))
    print(f"\n  {len(rows)} runs in {HISTORY}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
