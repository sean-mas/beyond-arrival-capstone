"""The corpus graph: which case reached which card, in one run, in 3D.

    make graph    ->  evals/results/corpus-graph.html     local, full text
                  ->  architecture/corpus-graph.html      publishable, ids only

Cards are the big nodes, each eval case is a small one. A line runs from a case to
the card it was expected to reach and, coloured by outcome, to where it actually
went: the top retrieved card, or the "handed to a human" or "refused" hub.

Joins exactly what report.py joins, and colours by report.verdict, so the graph
and the Eval Explorer can never disagree about a case.

The public copy carries case ids, sets, expectations and outcomes only. Before it
is written, every case question is searched for in it, and the build stops if one
turns up.
"""

from __future__ import annotations

import datetime as dt
import json
import pathlib
import sys

sys.path.insert(0, str(pathlib.Path(__file__).resolve().parent))
import report  # noqa: E402  (a sibling script, not a package)

ROOT = report.ROOT
TEMPLATE = pathlib.Path(__file__).resolve().parent / "corpus_graph_template.html"
OUT_LOCAL = report.EVALS / "results" / "corpus-graph.html"
OUT_PUBLIC = ROOT / "architecture" / "corpus-graph.html"
MIN_RUN = 20  # smoke tests run 1 to 8 cases; they only confuse the picture


def build(full_text: bool) -> dict:
    cases, cards = report.load_cases(), report.load_cards()
    runs, results = report.load_runs()
    by_situation = {c["situation"]: cid for cid, c in cards.items()}
    by_id = {c["id"]: c for c in cases}

    out_cases = []
    for c in cases:
        want = c["must_cite"][0] if c["must_cite"] else by_situation.get(c["expect_situation"])
        row = {
            "id": c["id"],
            "set": c["set"],
            "attack": c["attack_class"],
            "want_card": want if want in cards else None,
            "want_human": bool(c["expect_escalation"]),
            "want_refusal": bool(c["expect_refusal"]),
        }
        if full_text:
            row["input"] = c["input"]
            row["notes"] = c["notes"]
        out_cases.append(row)

    out_runs, out_results = [], {}
    for r in runs:
        if r["n"] < MIN_RUN:
            continue
        keep = ("id", "kind", "model", "prompt", "created", "n", "judged")
        out_runs.append({k: r[k] for k in keep})
        per = {}
        for case_id, t in results[r["id"]].items():
            if case_id not in by_id:
                continue
            v = report.verdict(by_id[case_id], t, cards)
            row = {
                "top": [report.card_of(ch) for ch in t["chunks"][:3]],
                "escalated": bool(t["escalated"]),
                "refused": bool(t["refused"]),
                "outcome": v["outcome"],
                "hit_rank": v.get("hit_rank"),
            }
            if full_text:
                row["answer"] = t["answer"]
            per[case_id] = row
        out_results[r["id"]] = per
    out_runs.sort(key=lambda r: r["created"], reverse=True)

    return {
        "generated": dt.datetime.now().strftime("%d.%m.%Y %H:%M"),
        "public": not full_text,
        "cards": {
            k: {"title": c["title"], "situation": c["situation"], "strand": c["strand"]}
            for k, c in cards.items()
        },
        "cases": out_cases,
        "runs": out_runs,
        "results": out_results,
    }


def render(data: dict) -> str:
    blob = json.dumps(data, ensure_ascii=False).replace("</", "<\\/")
    return TEMPLATE.read_text(encoding="utf-8").replace("__DATA__", blob)


def leaks(html: str) -> list[str]:
    """Case ids whose question text appears in the page. Must be empty to publish."""
    return [
        c["id"] for c in report.load_cases() if len(c["input"]) >= 12 and c["input"][:60] in html
    ]


def main() -> int:
    local = build(full_text=True)
    if not local["runs"]:
        print("no run with 20+ cases in private/runs/: run `make evals` first", file=sys.stderr)
        return 1
    OUT_LOCAL.parent.mkdir(parents=True, exist_ok=True)
    OUT_LOCAL.write_text(render(local), encoding="utf-8")

    public_html = render(build(full_text=False))
    found = leaks(public_html)
    if found:
        print(f"public corpus graph NOT written: text of {found[:5]} is in it", file=sys.stderr)
        return 1
    OUT_PUBLIC.write_text(public_html, encoding="utf-8")
    print(
        f"{len(local['runs'])} runs, {len(local['cases'])} cases, {len(local['cards'])} cards -> "
        f"{OUT_LOCAL.relative_to(ROOT)} (local) + {OUT_PUBLIC.relative_to(ROOT)} (ids only)"
    )
    return 0


if __name__ == "__main__":
    sys.exit(main())
