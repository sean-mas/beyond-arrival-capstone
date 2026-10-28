#!/usr/bin/env python3
"""Audit the eval set against the pre-registered targets and the card corpus.

Answers two questions that are easy to assume and expensive to get wrong:
is every card reachable by at least one case, and does the set meet the
counts the thresholds depend on.

  python3 coverage.py
"""

import collections
import json
import re
from pathlib import Path

HERE = Path(__file__).parent
CARDS = HERE.parent / "content" / "cards"


def main():
    cards = {}
    for f in sorted(CARDS.glob("*.md")):
        t = f.read_text()
        cards[re.search(r"^id: (\S+)", t, re.M).group(1)] = {
            "strand": re.search(r"^strand: (\S+)", t, re.M).group(1),
            "sit": re.search(r"^situation: (\S+)", t, re.M).group(1),
        }

    cases, core = [], []
    for n in ("cases.jsonl", "adversarial.jsonl"):
        for line in (HERE / n).read_text().splitlines():
            if line.strip():
                c = json.loads(line, strict=False)
                cases.append(c)
                if n == "cases.jsonl":
                    core.append(c)

    def ok(have, target):
        return "ok  " if have >= target else "SHORT"

    print(f"\n{len(cases)} cases: {len(core)} core, {len(cases) - len(core)} adversarial\n")

    print("PRE-REGISTERED COUNTS")
    esc = sum(bool(c["expect_escalation"]) for c in cases)
    ref = sum(bool(c["expect_refusal"]) for c in cases)
    print(f"  {ok(esc, 40)}  escalation-positive   {esc:3d}   floor 40  (pre-reg 1.7)")
    print(f"  {ok(ref, 8)}  refusal-positive      {ref:3d}   target 8")

    print("\nCARD REACHABILITY   (a card no case points at is never tested)")
    hit = collections.Counter(x for c in cases for x in c["must_cite"])
    dead = [k for k in cards if not hit.get(k)]
    thin = [k for k in cards if 0 < hit.get(k, 0) < 3]
    print(
        f"  {ok(0 if dead else 1, 1)}  cards with no case    {len(dead):3d}"
        + (f"   {', '.join(dead)}" if dead else "")
    )
    print(
        f"  {'note ':5s}  cards with 1 or 2     {len(thin):3d}"
        + (f"   {', '.join(thin)}" if thin else "")
    )
    print("         these are fine for the thresholds and thin for error analysis")

    print("\nSTRAND BALANCE, core set")

    def strand(c):
        return {cards[x]["strand"] for x in c["must_cite"] if x in cards}

    for s, target in (("life_setup", 20), ("orientation", 15), ("cultural_companion", 20)):
        n = sum(1 for c in core if s in strand(c))
        print(f"  {ok(n, target)}  {s:20s} {n:3d}   target {target}")
    gap = sum(1 for c in core if not c["must_cite"])
    print(f"  {'note ':5s}  cites no card        {gap:3d}   deliberate corpus gaps")

    print("\nTOPICS NAMED IN AN INPUT")
    for label, pat in (
        ("Anmeldung / registration", r"anmeld|register|registration|address"),
        ("Appointment / Termin", r"appointment|termin\b|slot"),
        ("Kita / childcare", r"kita|childcare|nursery|daycare"),
        ("School", r"school|schul"),
        ("Driving licence", r"licence|license|driving"),
        ("Health insurance", r"insurance|krankenkasse|insured"),
        ("Tax", r"\btax|steuer|konfession"),
        ("Visa / permit", r"visa|permit|blue card|residency|citizenship"),
        ("Partner work / job", r"\bwork|\bjob|freelance|employ"),
        ("German words in input", r"[äöüß]|Anmeldung|Kita|Blue Card|Ausl"),
    ):
        n = sum(1 for c in cases if re.search(pat, c["input"], re.I))
        print(f"  {ok(n, 3)}  {label:26s} {n:3d}   want 3+")

    print("\nSPLIT")
    sp = collections.Counter(c.get("split") or "unassigned" for c in cases)
    print("  " + ", ".join(f"{k}={v}" for k, v in sorted(sp.items())))
    print()


if __name__ == "__main__":
    main()
