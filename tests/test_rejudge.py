"""Grading a run later must grade the same turns the run would have."""

from __future__ import annotations

import json
import pathlib
import sys

import pytest

sys.path.insert(0, str(pathlib.Path(__file__).resolve().parents[1] / "evals"))

import rejudge  # noqa: E402
from judge import backend_from_spec  # noqa: E402


def _log(tmp_path: pathlib.Path, rows: list[dict]) -> pathlib.Path:
    (tmp_path / "turns-2026-09-29.jsonl").write_text("".join(json.dumps(r) + "\n" for r in rows))
    return tmp_path


def test_last_turn_per_case_wins_and_other_runs_are_ignored(tmp_path):
    logs = _log(
        tmp_path,
        [
            {"run_id": "r1", "case_id": "c1", "answer": "first try"},
            {"run_id": "r2", "case_id": "c1", "answer": "another run"},
            {"run_id": "r1", "case_id": "c1", "answer": "resumed"},
        ],
    )
    turns = rejudge.turns_of("r1", logs)
    assert list(turns) == ["c1"]
    assert turns["c1"]["answer"] == "resumed"


def test_summary_averages_parsed_verdicts_only():
    verdicts = [
        {"parsed": True, "groundedness": 1.0, "relevance": 0.5, "tone": 1.0, "actionable": 0.0},
        {"parsed": True, "groundedness": 0.0, "relevance": 0.5, "tone": 0.0, "actionable": 1.0},
    ]
    s = rejudge.summarise(verdicts)
    assert s["groundedness"] == 0.5 and s["answer_relevance"] == 0.5
    assert s["n_judged"] == 2 and s["judge_parse_rate"] == 1.0


def test_judge_spec_splits_on_the_first_colon_only():
    backend = backend_from_spec("ollama:qwen3:14b")
    assert backend is not None and backend.name == "ollama/qwen3:14b"
    assert backend_from_spec(None) is None
    with pytest.raises(SystemExit):
        backend_from_spec("anthropic:claude-sonnet-5")
