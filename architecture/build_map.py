"""The 3D build map: what exists, what is partial, what comes later.

    make map      ->  architecture/build-map.html

Reads architecture/status.json and the newest measurements in evals/history.jsonl,
refuses to build if any node's evidence path does not exist, and writes a single
page. The page holds component names, file paths and aggregate metrics only, so it
is safe to publish; it contains no case text and no answers.
"""

from __future__ import annotations

import json
import pathlib
import subprocess
import sys

HERE = pathlib.Path(__file__).resolve().parent
ROOT = HERE.parent
STATUS = HERE / "status.json"
TEMPLATE = HERE / "build_map_template.html"
OUT = HERE / "build-map.html"
# One row per day the map was built: which status each node had. The replay slider
# reads it; for days before the first row it falls back to git (see first_commit).
SNAPSHOTS = HERE / "status-history.jsonl"
STATUSES = {"built", "partial", "planned", "actor"}


def latest(rows: list[dict], suite: str) -> dict:
    hits = [r for r in rows if r.get("suite") == suite]
    return hits[-1] if hits else {}


def first_commit(path: str) -> str | None:
    """The day a file first entered git, as YYYY-MM-DD. None while it is uncommitted."""
    out = subprocess.run(
        ["git", "log", "--diff-filter=A", "--follow", "--format=%as", "--", path],
        cwd=ROOT,
        capture_output=True,
        text=True,
        check=False,
    ).stdout.split()
    return out[-1] if out else None


def snapshot(status: dict) -> list[dict]:
    """Record today's statuses, replacing an earlier row from the same day."""
    rows = []
    if SNAPSHOTS.exists():
        rows = [json.loads(x) for x in SNAPSHOTS.read_text(encoding="utf-8").splitlines() if x]
    today = {"date": status["updated"], "status": {n["id"]: n["status"] for n in status["nodes"]}}
    rows = [r for r in rows if r["date"] != today["date"]] + [today]
    rows.sort(key=lambda r: r["date"])
    SNAPSHOTS.write_text("".join(json.dumps(r) + "\n" for r in rows), encoding="utf-8")
    return rows


def main() -> int:
    status = json.loads(STATUS.read_text(encoding="utf-8"))
    ids = {n["id"] for n in status["nodes"]}
    problems = []
    for n in status["nodes"]:
        if n["status"] not in STATUSES:
            problems.append(f"{n['id']}: unknown status {n['status']!r}")
        if n["layer"] not in status["layers"]:
            problems.append(f"{n['id']}: unknown layer {n['layer']!r}")
        if n.get("evidence") and not (ROOT / n["evidence"]).exists():
            problems.append(f"{n['id']}: evidence {n['evidence']} does not exist")
        if n["status"] in ("built", "partial") and not n.get("evidence"):
            problems.append(f"{n['id']}: marked {n['status']} with no evidence path")
    for e in status["edges"]:
        for end in ("source", "target"):
            if e[end] not in ids:
                problems.append(f"edge {e['source']} -> {e['target']}: no node {e[end]!r}")
    if problems:
        print("build map NOT written:\n  " + "\n  ".join(problems), file=sys.stderr)
        return 1

    history = ROOT / "evals" / "history.jsonl"
    rows = [json.loads(x) for x in history.read_text(encoding="utf-8").splitlines() if x.strip()]
    guards, base = latest(rows, "guardrails"), latest(rows, "baseline-0")
    metrics = {
        "escalation_recall": guards.get("escalation_recall"),
        "escalation_precision": guards.get("escalation_precision"),
        "refusal_correctness": guards.get("refusal_correctness"),
        "pii_redacted": guards.get("pii_redacted"),
        "baseline_hit_at_1": base.get("answer_hit_at_1"),
        "measured": (guards.get("run_at") or "")[:10],
    }
    for n in status["nodes"]:
        # When the evidence first landed. Uncommitted work counts from today.
        n["since"] = (
            (first_commit(n["evidence"]) or status["updated"]) if n.get("evidence") else None
        )
    keep = (
        "run_at",
        "suite",
        "escalation_recall",
        "escalation_precision",
        "refusal_correctness",
        "pii_redacted",
        "answer_hit_at_1",
    )
    suites = ("guardrails", "baseline-0", "guardrails-guard-groq")
    series = [{k: r.get(k) for k in keep} for r in rows if r.get("suite") in suites]
    payload = {
        "status": status,
        "metrics": metrics,
        "series": series,
        "snapshots": snapshot(status),
    }
    blob = json.dumps(payload, ensure_ascii=False).replace("</", "<\\/")
    OUT.write_text(TEMPLATE.read_text(encoding="utf-8").replace("__DATA__", blob), encoding="utf-8")
    kinds = ("built", "partial", "planned")
    counts = {k: sum(n["status"] == k for n in status["nodes"]) for k in kinds}
    n_nodes, n_edges = len(status["nodes"]), len(status["edges"])
    print(f"{n_nodes} nodes ({counts}), {n_edges} edges -> {OUT.relative_to(ROOT)}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
