#!/usr/bin/env python3
"""Score a filled blind relabelling sheet against the committed labels.

Reports, per field, raw agreement and Cohen's kappa, then lists every
disagreement in full so each one can be resolved by the written rule rather
than by whoever feels strongest.

Kappa is the number that goes in the thesis. Raw agreement on a set where one
answer dominates looks high for no reason, which is the whole point of chance
correction.

  python3 review_score.py --rater sean
"""

import argparse
import json
from pathlib import Path

HERE = Path(__file__).parent
FIELDS = {"escalate": "expect_escalation", "refuse": "expect_refusal"}


def load_cases():
    out = {}
    for name in ("cases.jsonl", "adversarial.jsonl"):
        for line in (HERE / name).read_text().splitlines():
            if line.strip():
                c = json.loads(line, strict=False)
                out[c["id"]] = c
    return out


def parse_sheet(path):
    """Read `### rNNN` blocks and their `- field: value` lines."""
    marks, rid = {}, None
    for line in path.read_text().splitlines():
        s = line.strip()
        if s.startswith("### "):
            rid = s[4:].strip()
            marks[rid] = {}
        elif rid and s.startswith("- ") and ":" in s:
            k, _, v = s[2:].partition(":")
            marks[rid][k.strip()] = v.strip()
    return marks


def kappa(pairs):
    """Cohen's kappa for two raters on a binary label."""
    n = len(pairs)
    if not n:
        return None
    po = sum(a == b for a, b in pairs) / n
    pa1 = sum(a for a, _ in pairs) / n
    pb1 = sum(b for _, b in pairs) / n
    pe = pa1 * pb1 + (1 - pa1) * (1 - pb1)
    if pe == 1:
        return None  # both raters gave one answer to everything, kappa undefined
    return (po - pe) / (1 - pe)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--rater", default="sean")
    ap.add_argument(
        "--agreed",
        action="store_true",
        help="show what the two labellers agreed on instead of what they did not",
    )
    args = ap.parse_args()

    cases = load_cases()
    kf = HERE / f"review-key-{args.rater}.json"
    if not kf.exists():
        kf = HERE / "review-key-sean.json"  # every sheet shares one r-id ordering
        print(f"no key for {args.rater}, using the shared ordering in {kf.name}\n")
    key = json.loads(kf.read_text())
    marks = parse_sheet(HERE / f"review-blind-{args.rater}.md")

    blank = [r for r in key if not any(marks.get(r, {}).get(f) for f in FIELDS)]
    if blank:
        print(
            f"!! {len(blank)} of {len(key)} cases unlabelled, "
            f"first is {sorted(blank)[0]}. Finish the sheet before scoring.\n"
        )

    disagreements, notes, agreed = [], [], {}
    for field, col in FIELDS.items():
        pairs, unreadable = [], []
        for rid, cid in key.items():
            raw = marks.get(rid, {}).get(field, "").lower()
            if raw in ("yes", "y", "true"):
                mine = 1
            elif raw in ("no", "n", "false"):
                mine = 0
            else:
                if raw:
                    unreadable.append((rid, raw))
                continue
            theirs = 1 if cases[cid].get(col) else 0
            pairs.append((mine, theirs))
            if mine != theirs:
                disagreements.append((field, rid, cid, mine, theirs))
            elif mine == 1:
                agreed.setdefault(field, []).append((rid, cid))

        k = kappa(pairs)
        agree = sum(a == b for a, b in pairs) / len(pairs) if pairs else 0
        ks = f"{k:.3f}" if k is not None else "undefined (no label variance)"
        print(f"{field:9s} n={len(pairs):3d}  raw agreement={agree:.3f}  kappa={ks}")
        for rid, raw in unreadable:
            print(f"           ?? {rid}: could not read {raw!r}, expected yes or no")

    for rid, cid in key.items():
        note = marks.get(rid, {}).get("note", "")
        if note:
            notes.append((rid, cid, note))

    if args.agreed:
        for field, label in (("escalate", "needs a person"), ("refuse", "individual legal case")):
            rows = agreed.get(field, [])
            print(f'\nBoth of us said YES to "{label}": {len(rows)} case(s)\n')
            for rid, cid in rows:
                print(f"  {rid} = {cid}")
                print(f"      {cases[cid]['input']}")
        both = {r for r, _ in agreed.get("escalate", [])} & {r for r, _ in agreed.get("refuse", [])}
        print(
            f"\nAgreed on both at once: {len(both)}"
            + (f"  ({', '.join(sorted(both))})" if both else "")
        )
        return

    if disagreements:
        print(f"\n{len(disagreements)} disagreement(s), each needs a written resolution:\n")
        for field, rid, cid, mine, theirs in disagreements:
            c = cases[cid]
            print(
                f"  {rid} = {cid}  [{field}] you={'yes' if mine else 'no':3s} "
                f"committed={'yes' if theirs else 'no'}"
            )
            print(f"      {c['input']}")
            print(f"      committed rationale: {c.get('notes', '(none)')}\n")

    if notes:
        print(f"{len(notes)} case(s) you flagged as unsure. These are the borderline set:\n")
        for rid, cid, note in notes:
            print(f"  {rid} = {cid}: {note}")

    if not disagreements and not blank:
        print("\nNo disagreements. Report the kappa and move on.")


if __name__ == "__main__":
    main()
