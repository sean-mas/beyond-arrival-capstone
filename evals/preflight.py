#!/usr/bin/env python3
"""One call per tier, before committing a night to them.

    make preflight

Every failure this catches was found the expensive way first: a retired Gemini
model discovered after the run had started, three Ollama Cloud models that turn
out to cost money, a Mistral account that permits exactly one model, and a
DeepSeek balance of zero. A night is worth more than ninety seconds.

It reports, it does not decide. A tier that fails here is a tier the overnight
script will skip and say so, not a reason to stop the ones that work.
"""

from __future__ import annotations

import pathlib
import sys
import time

sys.path.insert(0, str(pathlib.Path(__file__).resolve().parents[1] / "src"))
sys.path.insert(0, str(pathlib.Path(__file__).resolve().parent))

from run_generation import TIERS, backend_for  # noqa: E402

SYSTEM = 'Reply with JSON only: {"answer":"<one sentence>","confidence":0.0,"used_chunk_ids":[]}'
USER = "Four months here and no friends yet. What do people actually do?"


def check(tier: int) -> dict:
    label, in_thesis = TIERS[tier]
    row: dict = {"tier": tier, "label": label, "thesis": in_thesis}
    try:
        backend = backend_for(tier, None)
        row["model"] = backend.name
    except Exception as exc:
        row.update(ok=False, why=f"{type(exc).__name__}: {str(exc)[:70]}", model="-")
        return row

    started = time.perf_counter()
    try:
        completion = backend.complete(SYSTEM, USER, json_mode=True)
        row["seconds"] = round(time.perf_counter() - started, 1)
        try:
            payload = completion.as_json()
            row["schema"] = "answer" in payload and "confidence" in payload
        except Exception:
            row["schema"] = False
        from companion.llm.cloud import usage_of

        row.update(ok=True, why="", tokens=usage_of(completion).get("completion_tokens"))
    except Exception as exc:
        row["seconds"] = round(time.perf_counter() - started, 1)
        detail = str(exc)
        for needle, plain in (
            ("401", "key revoked or invalid"),
            ("402", "payment required"),
            ("Insufficient Balance", "no balance"),
            ("429", "rate limited"),
            ("404", "model not found"),
        ):
            if needle in detail:
                detail = plain
                break
        row.update(ok=False, why=detail[:60], schema=False, tokens=None)
    return row


def main() -> int:
    rows = [check(t) for t in sorted(TIERS)]
    print(f"\n  {'tier':<5}{'model':<34}{'ok':<5}{'s/call':>8}{'schema':>8}{'out':>6}  note")
    for r in rows:
        mark = "yes" if r["ok"] else "NO"
        print(
            f"  {r['tier']:<5}{str(r.get('model'))[:33]:<34}{mark:<5}"
            f"{str(r.get('seconds', '-')):>8}{str(r.get('schema', '-')):>8}"
            f"{str(r.get('tokens') or '-'):>6}  {r['why']}"
        )
    usable = [r["tier"] for r in rows if r["ok"]]
    print(f"\n  usable tonight: {usable or 'none'}")
    # ~2.7 generation calls a turn, from tier 1's measured route mix, plus the
    # local guards and the local judge. Those two are the same for every tier
    # and were measured at about 25 seconds a turn on tier 2, so leaving them
    # out understates a fast tier by a factor of three.
    LOCAL_OVERHEAD_S = 25.0
    for r in rows:
        if r["ok"] and r.get("seconds"):
            hours = (r["seconds"] * 2.7 + LOCAL_OVERHEAD_S) * 115 / 3600
            print(f"    tier {r['tier']}: about {hours:.1f} h for 115 cases")
    print(
        "\n  estimates include the local guards and judge, about "
        f"{LOCAL_OVERHEAD_S:.0f} s a turn, which dominate the fast tiers."
    )

    # What `make all` will actually cost, split at the tier that cannot finish
    # in one night. One total would hide that one of these is not like the
    # others, which is the single thing worth knowing before starting it.
    finishing = [r for r in rows if r["ok"] and r.get("seconds", 0) < 60]
    slow = [r for r in rows if r["ok"] and r.get("seconds", 0) >= 60]
    hours = sum((r["seconds"] * 2.7 + LOCAL_OVERHEAD_S) * 115 / 3600 for r in finishing)
    # Plus the guardrail eval and the judged baseline, measured at ~1 h together.
    print(
        f"\n  `make all`: guards + baseline + tiers {[r['tier'] for r in finishing]} "
        f"in about {hours + 1.0:.1f} h"
    )
    if slow:
        print(
            f"  then tier {slow[0]['tier']}, which will not finish in one night "
            "and resumes from its checkpoint"
        )
    return 0 if usable else 1


if __name__ == "__main__":
    raise SystemExit(main())
