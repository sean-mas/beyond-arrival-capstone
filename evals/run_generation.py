#!/usr/bin/env python3
"""One generation tier, scored end to end against baseline 0.

    python3 evals/run_generation.py --tier 1              # local, llama3.1:8b
    python3 evals/run_generation.py --tier 1 --judge-model gpt-oss:20b
    python3 evals/run_generation.py --tier 2 --model <hosted>   # when keys land

`docs/requirements.md` names four systems, and Sean confirmed four on
22.09.2026:

    0  retrieval only, top-1 chunk verbatim      evals/run_baseline0.py
    1  local model via Ollama                    can this run at zero marginal cost
    2  mid-tier hosted                           the likely production choice
    3  frontier paid                             the ceiling

**Build four, analyse three.** `01-thesis/expose.md` §6.2 fixes *three*
configurations varying only the generation stage. Tier 2 is capstone-only and
carries `thesis_analysis: false`, so the deck gets the fuller comparison and
the pre-registration is left alone.

**The guards do not move between tiers.** `guard_backend` stays pinned to
`settings.guard_model` whatever `--model` says, because the thesis needs any
measured difference attributable to the generation stage alone. If a tier
changes escalation recall, something leaked.

Reports per tier: groundedness, answer relevance, tone, refusal correctness,
escalation recall, latency, cost per turn. Cost is 0.0 for local tiers and is
not guessed for hosted ones: it comes from the backend or stays null.
"""

from __future__ import annotations

import argparse
import json
import os
import pathlib
import statistics
import sys
import time

sys.path.insert(0, str(pathlib.Path(__file__).resolve().parents[1] / "src"))
sys.path.insert(0, str(pathlib.Path(__file__).resolve().parent))

import history  # noqa: E402
import store_arg  # noqa: E402
from guard_cache import CachedBackend  # noqa: E402
from judge import Judge, backend_from_spec  # noqa: E402

from companion.agent.graph import build  # noqa: E402
from companion.config import settings  # noqa: E402
from companion.llm import guard as llm_guard  # noqa: E402
from companion.llm.cloud import quota_exhausted  # noqa: E402
from companion.llm.ollama import OllamaBackend  # noqa: E402
from companion.obs.sink import DEFAULT_DIR, default_sink, set_sink  # noqa: E402
from companion.retrieval.cards import load_corpus  # noqa: E402
from companion.retrieval.chunking import chunk_corpus  # noqa: E402

HERE = pathlib.Path(__file__).resolve().parent
ROOT = HERE.parent

# (label, default model, included in the thesis analysis)
#
# Four tiers are built and three are analysed. Sean chose four on 22.09.2026;
# `01-thesis/expose.md` §6.2 fixes three configurations varying only the
# generation stage. Tier 2 carries `thesis_analysis: False` so the deck gets
# the fuller comparison and the pre-registration is left alone.
TIERS = {
    1: ("local, llama3.1:8b", True),
    2: ("hosted, gpt-oss:120b", False),
    3: ("hosted, nemotron-3-ultra", True),
    4: ("hosted, gemma4:31b", False),
    5: ("hosted, mistral ministral-14b", False),
    6: ("hosted, deepseek-v4-pro", False),
}
"""(label, included in the thesis analysis).

Tier 5 is the only vendor in the ladder that is neither local nor Ollama Cloud,
which is why it is here despite being the slowest by an order of magnitude:
without it, tiers 2 to 4 share one provider and a model effect cannot be
separated from a provider effect at all.

Four generating tiers are built and **three** are analysed for the thesis,
because `01-thesis/expose.md` §6.2 fixes three configurations varying only the
generation stage. Tiers 1 and 3 carry the flag alongside baseline 0; tiers 2
and 4 are capstone-only and say so in every row they write.

Gemini was tier 3 until 24.09.2026 and is retired from the ladder: measured at
81 seconds a call on the free tier, 115 cases projects to about thirty hours.
Its 8 completed cases are kept as `tier-3-gemini-partial` rather than deleted.
"""


def backend_for(tier: int, override: str | None):
    """The one place a tier becomes a backend.

    Raises rather than falling back. A tier with no key that quietly ran on the
    local model would publish a hosted number that `llama3.1:8b` produced, and
    nothing downstream could tell.
    """
    from companion.llm.ollama import OllamaBackend

    if tier == 1:
        return OllamaBackend(override or settings.llm_model)

    from companion.llm.cloud import OllamaCloudBackend

    if tier == 5:
        from companion.llm.cloud import MistralBackend

        return MistralBackend(override)
    if tier == 6:
        from companion.llm.cloud import DeepSeekBackend

        return DeepSeekBackend(override)

    default = {2: settings.tier2_model, 3: settings.tier3_model, 4: settings.tier4_model}[tier]
    return OllamaCloudBackend(override or default)


CHECKPOINTS = HERE / "results" / "checkpoints"
"""One JSONL per run, appended as each case finishes.

Written because tier 3 is about six hours on a free tier with a daily request
cap that may sit below what the run needs. Without this, a quota refusal at
case 95 of 115 loses ninety-five completed cases and roughly five hours of
wall clock, and the morning has nothing. With it, the run writes a partial
row and `--resume` picks up where it stopped once the quota resets.

Not in git: `evals/results/` is ignored. The durable artefact is still the
history row, and a partial row says so in `partial` and `n_cases_attempted`.
"""


def checkpoint_path(run_id: str) -> pathlib.Path:
    return CHECKPOINTS / f"{run_id}.jsonl"


def load_checkpoint(run_id: str) -> dict[str, dict]:
    path = checkpoint_path(run_id)
    if not path.exists():
        return {}
    rows = [json.loads(x) for x in path.read_text().splitlines() if x.strip()]
    return {r["case_id"]: r for r in rows}


def save_case(run_id: str, record: dict) -> None:
    path = checkpoint_path(run_id)
    path.parent.mkdir(parents=True, exist_ok=True)
    with path.open("a", encoding="utf-8") as fh:
        fh.write(json.dumps(record, ensure_ascii=False) + "\n")


def checkpoint_owner(run_id: str) -> str | None:
    """Which generation backend wrote this checkpoint, from the turn log.

    The checkpoint itself records per-case outcomes rather than the model, so
    the owner is read off the turn records that share its run_id.
    """
    import json as _json

    directory = pathlib.Path(__file__).resolve().parents[1] / "private" / "runs"
    for path in sorted(directory.glob("turns-*.jsonl"), reverse=True):
        for line in path.read_text().splitlines():
            if not line.strip():
                continue
            row = _json.loads(line)
            if row.get("run_id") == run_id and row.get("model"):
                return str(row["model"])
    return None


def summarise(records: list[dict]) -> dict:
    """Every metric, computed from the per-case records rather than from
    counters accumulated in the loop.

    The counters were fine while a run either finished or produced nothing. A
    resumable run has to be able to aggregate a list it did not just build, so
    the arithmetic moved out of the loop.
    """
    tp = sum(1 for r in records if r["escalated"] and r["expect_escalation"])
    fp = sum(1 for r in records if r["escalated"] and not r["expect_escalation"])
    fn = sum(1 for r in records if not r["escalated"] and r["expect_escalation"])
    refusal = [r for r in records if r["expect_refusal"]]
    delivered = [r for r in records if not r["escalated"] and not r["refused"]]
    judged = [r for r in delivered if r.get("judge_groundedness") is not None]
    confidences = [r["answer_confidence"] for r in delivered if r["answer_confidence"] is not None]
    return {
        "n_cases": len(records),
        "n_delivered": len(delivered),
        "classifier_errors": sum(1 for r in records if r.get("classifier_error")),
        "escalation_recall": round(tp / (tp + fn), 4) if tp + fn else None,
        "escalation_precision": round(tp / (tp + fp), 4) if tp + fp else None,
        "refusal_correctness": (
            round(sum(1 for r in refusal if r["refused"]) / len(refusal), 4) if refusal else None
        ),
        "groundedness": mean([r["judge_groundedness"] for r in judged]),
        "answer_relevance": mean([r["judge_relevance"] for r in judged]),
        "tone": mean([r["judge_tone"] for r in judged]),
        "actionable": mean([r.get("judge_actionable") for r in judged]),
        "judge_parse_rate": (
            round(sum(1 for r in judged if r["judge_parsed"]) / len(judged), 4) if judged else None
        ),
        "judge_kappa": None,  # set by calibrate_judge.py, never guessed here
        "rule_grounded": sum(1 for r in delivered if r["grounded"] is True),
        "rule_blocked_ungrounded": sum(1 for r in delivered if r["grounded"] is False),
        "answer_confidence_mean": mean(confidences),
        "answer_confidence_logged": len(confidences),
        "latency_ms_median": (
            round(statistics.median([r["latency_ms"] for r in records]), 1) if records else None
        ),
    }


def load_cases() -> list[dict]:
    rows = []
    for name in ("cases.jsonl", "adversarial.jsonl"):
        rows += [json.loads(x) for x in (HERE / name).read_text().splitlines() if x.strip()]
    if not rows:
        raise SystemExit("no cases: refusing to report a score over nothing")
    return rows


def mean(values: list[float | None]) -> float | None:
    real = [v for v in values if v is not None]
    return round(statistics.mean(real), 4) if real else None


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--tier", type=int, choices=[1, 2, 3, 4, 5, 6], default=1)
    ap.add_argument("--model", default=None, help="override the tier's generation model")
    ap.add_argument("--judge-model", default=None, help="a local Ollama judge, by model name")
    ap.add_argument("--judge", default=None, help="provider:model, e.g. groq:qwen/qwen3.8-27b")
    ap.add_argument("--limit", type=int, default=None, help="first N cases, for a smoke run")
    ap.add_argument("--no-judge", action="store_true", help="generate without grading")
    ap.add_argument(
        "--fresh-guard", action="store_true", help="ask the crisis check again, no cached verdicts"
    )
    ap.add_argument("--resume", default=None, help="continue a run_id from its checkpoint")
    ap.add_argument(*store_arg.STORE_FLAG_ARGS, **store_arg.STORE_FLAG_KWARGS)
    args = ap.parse_args()

    label, in_thesis = TIERS[args.tier]
    try:
        gen_backend = backend_for(args.tier, args.model)
    except ValueError as exc:
        raise SystemExit(f"\n  tier {args.tier} ({label}): {exc}\n") from None

    cards = load_corpus(ROOT / "content" / "cards")
    chunks = chunk_corpus(cards)
    retriever, store_label = store_arg.build_retriever(args.store, chunks)

    # Pinned across tiers, whatever --model says: one guard for every tier in
    # a comparison. Which guard is GUARD_PROVIDER's choice, so a run can
    # measure the deployed one (29.09.2026: Groq qwen, no local models) and the
    # suite name says so, never pooling it with the local-guard rows.
    guard_backend = llm_guard.guard_backend()
    # Answer experiments reuse the check's earlier verdicts: same model, same
    # policy, same message, same verdict, and zero Groq tokens (`guard_cache.py`).
    # --fresh-guard asks again, which a run that measures the check must do.
    guard_cache = None if args.fresh_guard else CachedBackend(guard_backend)
    if guard_cache is not None:
        guard_backend = guard_cache  # type: ignore[assignment]
    app = build(retriever, cards, guard_backend, gen_backend)

    judge_backend = backend_from_spec(args.judge) or (
        OllamaBackend(args.judge_model) if args.judge_model else None
    )
    judge = None if args.no_judge else Judge(judge_backend, under_test=gen_backend.name)

    # The configuration the deploy runs: a hosted crisis check and hosted
    # answers. The query embedder may be local, because the hosted and local
    # bge-m3 return the same vectors (`make embed-parity`) and the stored
    # vectors are the local ones either way. Changed 12.10.2026, when Hugging
    # Face's free credits ran out mid-comparison.
    live = settings.guard_provider != "ollama"
    run_id = args.resume or f"{pathlib.Path(__file__).stem}-{int(time.time())}"
    set_sink(default_sink())
    cases = load_cases()
    if args.limit:
        cases = cases[: args.limit]

    done = load_checkpoint(run_id)
    if done and args.resume:
        # A checkpoint belongs to the backend that wrote it. Resuming tier 5
        # from tier 4's checkpoint on 24.09.2026 marked all 115 cases done and
        # filed tier 4's numbers under tier-5 in one second. Nothing in the row
        # said so: same n_cases, same recall, same groundedness, seconds 0.0.
        owner = checkpoint_owner(run_id)
        if owner and owner != gen_backend.name:
            raise SystemExit(
                f"\n  checkpoint {run_id} was written by {owner}, not "
                f"{gen_backend.name}.\n  Resuming it would file one model's "
                "answers under another's name.\n"
            )
        if len(done) >= len(load_cases()):
            print(f"  {run_id} is already complete: {len(done)} cases. Nothing to resume.")
    if done:
        print(f"  resuming {run_id}: {len(done)} cases already done")
    records: list[dict] = list(done.values())
    consecutive_failures = 0
    stopped_early: str | None = None
    started = time.perf_counter()

    for case in cases:
        if case["id"] in done:
            continue
        t0 = time.perf_counter()
        try:
            out = app.invoke(
                {
                    "tenant_id": "global",
                    "message": case["input"],
                    "verdicts": [],
                    "run_id": run_id,
                    "case_id": case["id"],
                    "model": gen_backend.name,
                }
            )
            record = {
                "case_id": case["id"],
                "expect_escalation": case["expect_escalation"],
                "expect_refusal": case["expect_refusal"],
                "escalated": bool(out.get("escalated")),
                "refused": bool(out.get("refused")),
                "grounded": out.get("grounded"),
                "answer_confidence": out.get("answer_confidence"),
                "route": out.get("route"),
                # The crisis check could not reach its model and handed over by
                # design. Safe for the family, but it is not a measurement of the
                # check: 29.09.2026, Groq's daily limit ran out mid-run and 15
                # adversarial cases were handed over, precision 0.60.
                "classifier_error": any(
                    v.detail.get("trigger") == "classifier_error"
                    for v in (out.get("verdicts") or [])
                ),
                "latency_ms": (time.perf_counter() - t0) * 1000,
                "judge_groundedness": None,
                "judge_relevance": None,
                "judge_tone": None,
                "judge_actionable": None,
                "judge_parsed": None,
            }
            if judge is not None and not record["escalated"] and not record["refused"]:
                material = "\n\n".join(c.text for c in (out.get("chunks") or []))
                s = judge.score(case["input"], material, out.get("answer") or "")
                record.update(
                    judge_groundedness=s.groundedness,
                    judge_relevance=s.relevance,
                    judge_tone=s.tone,
                    judge_actionable=s.actionable,
                    judge_parsed=s.parsed,
                )
        except KeyboardInterrupt:
            stopped_early = "interrupted"
            break
        except Exception as exc:  # noqa: BLE001 - the run must survive one bad case
            consecutive_failures += 1
            print(f"    {case['id']}: {type(exc).__name__}: {str(exc)[:110]}")
            # Three in a row is a quota or an outage, not a bad case, and every
            # further call will fail the same way while the clock runs.
            if consecutive_failures >= 3:
                stopped_early = f"{type(exc).__name__} three times in a row"
                break
            continue

        consecutive_failures = 0
        records.append(record)
        save_case(run_id, record)
        if quota_exhausted:
            # The check can no longer be asked, so every further case would be
            # a handover on an error. Stop, keep what is real, resume tomorrow.
            stopped_early = f"daily limit reached: {', '.join(sorted(quota_exhausted))}"
            break
        if out.get("blocked_by"):
            # The draft the family did not see, and what blocked it. Private,
            # because a draft can echo the family's words. Kept so a change to
            # the output checks can be replayed against real blocked drafts
            # without running a model again (E2, 29.09.2026).
            with (DEFAULT_DIR / "blocked-drafts.jsonl").open("a", encoding="utf-8") as fh:
                fh.write(
                    json.dumps(
                        {
                            "run_id": run_id,
                            "case_id": case["id"],
                            "draft": out.get("draft"),
                            "blocked_by": out.get("blocked_by"),
                            "answer": out.get("answer"),
                        },
                        ensure_ascii=False,
                    )
                    + "\n"
                )

    elapsed = time.perf_counter() - started
    results = {
        "run_id": run_id,
        "system": f"tier-{args.tier}",
        "tier_label": label,
        "generation_backend": gen_backend.name,
        "guard_backend": guard_backend.name,
        "embedder": retriever.name,
        "live_config": live,
        # Which rung of the experiment ladder this run is (E0 chance control,
        # E1 fallback, ...), 29.09.2026. Set by EXPERIMENT in the environment,
        # so the history can line the rungs up without reading commit messages.
        "experiment": os.environ.get("EXPERIMENT") or None,
        "guard_cache_hits": guard_cache.hits if guard_cache else None,
        "guard_cache_misses": guard_cache.misses if guard_cache else None,
        "judge": judge.name if judge else None,
        "thesis_analysis": in_thesis,
        "prompt_version": __import__("companion.agent.prompts", fromlist=["VERSION"]).VERSION,
        "store": store_label,
        # A partial run is reported as partial, in the row, where anyone
        # reading the history sees it. A number over 95 of 115 cases is not
        # wrong, but it is not the same number as one over 115.
        "partial": stopped_early is not None,
        # A run whose crisis check failed on any case does not measure the
        # check. The suite name says so, so it never pools with a clean run.
        "invalid_guard": any(r.get("classifier_error") for r in records),
        "stopped_early": stopped_early,
        "n_cases_planned": len(cases),
        **summarise(records),
        "cost_eur_per_turn": 0.0 if args.tier == 1 else None,
        "seconds": round(elapsed, 1),
    }
    # A truncated run must never pool with a full one. The suite name carries
    # it, because a row that only differs by n_cases is a row someone averages.
    suite = (
        f"tier-{args.tier}"
        + ("-live" if live else "")
        + ("-smoke" if args.limit else "")
        + ("-partial" if stopped_early else "")
        + ("-guard-errors" if any(r.get("classifier_error") for r in records) else "")
    )
    history.append(suite, results, note=f"{label} · {gen_backend.name}")

    print(f"\ntier {args.tier} · {label} · {gen_backend.name} · {elapsed:.0f}s\n")
    for key in (
        "groundedness",
        "answer_relevance",
        "tone",
        "actionable",
        "judge_parse_rate",
        "escalation_recall",
        "escalation_precision",
        "refusal_correctness",
        "answer_confidence_mean",
        "rule_blocked_ungrounded",
        "latency_ms_median",
    ):
        print(f"  {key:<26} {results[key]}")
    print("\n  baseline 0 answer hit@1 was 0.553 at 110 ms and EUR 0.00 a turn")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
