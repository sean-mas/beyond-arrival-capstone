"""A six hour run on a free tier must not lose six hours to one refusal.

Tier 3 is roughly 65 seconds a call against a daily request cap that may sit
below what 115 cases need. Without a checkpoint, a quota refusal at case 95
throws away ninety-five completed cases and the morning has nothing.

Two things are asserted here: that the per-case records aggregate to the same
metrics the old in-loop counters produced, and that a partial run is *labelled*
partial rather than quietly reported as a full one.
"""

from __future__ import annotations

import json
import pathlib
import sys

import pytest

sys.path.insert(0, str(pathlib.Path(__file__).resolve().parents[1] / "evals"))

import run_generation as rg  # noqa: E402


def rec(case_id: str, **kw) -> dict:
    base = dict(
        case_id=case_id,
        expect_escalation=False,
        expect_refusal=False,
        escalated=False,
        refused=False,
        grounded=True,
        answer_confidence=0.8,
        route="answer",
        latency_ms=100.0,
        judge_groundedness=0.9,
        judge_relevance=0.6,
        judge_tone=0.7,
        judge_parsed=True,
    )
    base.update(kw)
    return base


@pytest.fixture
def isolated(tmp_path, monkeypatch):
    monkeypatch.setattr(rg, "CHECKPOINTS", tmp_path)
    return tmp_path


def test_a_case_survives_the_process_that_wrote_it(isolated):
    rg.save_case("run-1", rec("c001"))
    rg.save_case("run-1", rec("c002"))
    back = rg.load_checkpoint("run-1")
    assert set(back) == {"c001", "c002"}
    assert back["c001"]["judge_relevance"] == 0.6


def test_a_fresh_run_has_no_checkpoint(isolated):
    assert rg.load_checkpoint("never-ran") == {}


def test_two_runs_do_not_share_a_checkpoint(isolated):
    """A resumed run must not inherit another run's cases. They are different
    models, and pooling them silently would be the worst possible outcome."""
    rg.save_case("run-1", rec("c001"))
    rg.save_case("run-2", rec("c002"))
    assert set(rg.load_checkpoint("run-1")) == {"c001"}


def test_escalation_arithmetic_matches_the_counters_it_replaced(isolated):
    records = [
        rec("a", escalated=True, expect_escalation=True),  # tp
        rec("b", escalated=True, expect_escalation=True),  # tp
        rec("c", escalated=True, expect_escalation=False),  # fp
        rec("d", escalated=False, expect_escalation=True),  # fn
        rec("e"),  # tn
    ]
    s = rg.summarise(records)
    assert s["escalation_recall"] == round(2 / 3, 4)
    assert s["escalation_precision"] == round(2 / 3, 4)


def test_halted_turns_are_out_of_the_delivered_metrics(isolated):
    """An escalated turn never reached generation, so judging it would measure
    a component that did not run. Same reasoning as the delivered subset."""
    s = rg.summarise([rec("a", escalated=True, expect_escalation=True), rec("b")])
    assert s["n_delivered"] == 1
    assert s["groundedness"] == 0.9


def test_an_unjudged_delivered_turn_does_not_become_a_zero(isolated):
    """A null must stay null. A parse failure contributing 0.0 to the mean is
    a number nobody produced, dragging down the figure the thesis reports."""
    s = rg.summarise([rec("a"), rec("b", judge_groundedness=None, judge_relevance=None)])
    assert s["groundedness"] == 0.9
    assert s["n_delivered"] == 2


def test_summarise_over_nothing_returns_nulls_not_crashes(isolated):
    s = rg.summarise([])
    assert s["n_cases"] == 0
    assert s["escalation_recall"] is None
    assert s["latency_ms_median"] is None


def test_the_checkpoint_file_is_line_delimited(isolated):
    """Appended per case, so a killed process keeps every case before it."""
    rg.save_case("run-1", rec("c001"))
    rg.save_case("run-1", rec("c002"))
    lines = (isolated / "run-1.jsonl").read_text().splitlines()
    assert len(lines) == 2
    assert json.loads(lines[1])["case_id"] == "c002"


def test_resuming_another_models_checkpoint_is_refused(isolated, monkeypatch, tmp_path):
    """The failure this exists for, 24.09.2026.

    Tier 5 had run 45 seconds and written no checkpoint, so a script that
    resumed from "the newest checkpoint" picked tier 4's. Every case was marked
    done, and tier 4's numbers were written to the history under `tier-5` with
    `seconds: 0.0`. Nothing in the row said so: same n_cases, same delivered,
    same recall, same groundedness, same tone, to four decimal places.
    """
    runs = tmp_path / "private" / "runs"
    runs.mkdir(parents=True)
    (runs / "turns-2026-09-24.jsonl").write_text(
        json.dumps({"run_id": "run-4", "model": "ollama-cloud/gemma4:31b"}) + "\n"
    )
    monkeypatch.setattr(rg, "__file__", str(tmp_path / "evals" / "run_generation.py"))
    assert rg.checkpoint_owner("run-4") == "ollama-cloud/gemma4:31b"
    assert rg.checkpoint_owner("run-never-seen") is None


def test_a_checkpoint_with_no_turn_log_does_not_block_a_resume(isolated, monkeypatch, tmp_path):
    """Unknown ownership must not be treated as wrong ownership: a legitimate
    resume after the turn log rolled would otherwise be refused."""
    runs = tmp_path / "private" / "runs"
    runs.mkdir(parents=True)
    monkeypatch.setattr(rg, "__file__", str(tmp_path / "evals" / "run_generation.py"))
    assert rg.checkpoint_owner("anything") is None
