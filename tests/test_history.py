"""`evals/history.jsonl` is the only place a number survives the next run.

The tests that matter here are the two that would let it lie: a row without the
commit and corpus it came from is uncomparable, and a row that swallowed a
recall curve into the tracked file would bury the diff the file exists to keep
readable.
"""

from __future__ import annotations

import json
import pathlib
import sys

import pytest

sys.path.insert(0, str(pathlib.Path(__file__).resolve().parents[1] / "evals"))

import history  # noqa: E402


@pytest.fixture
def isolated(tmp_path, monkeypatch):
    monkeypatch.setattr(history, "HISTORY", tmp_path / "history.jsonl")
    monkeypatch.setattr(history, "RESULTS", tmp_path / "results")
    return tmp_path


def test_row_carries_the_code_and_the_corpus_that_produced_it(isolated):
    history.append("guardrails", {"escalation_recall": 0.66})
    row = history.read()[0]
    assert row["git_sha"] and row["git_sha"] != "unknown"
    assert len(row["corpus_digest"]) == 12


def test_curves_stay_out_of_the_tracked_file(isolated):
    payload = {"recall_at_k": {"6": {"any": 0.9}}, "chunks": 62, "ids": ["c001", "c002"]}
    history.append("retrieval", payload)
    row = history.read()[0]
    assert row["chunks"] == 62
    assert "ids" not in row
    assert not [k for k in row if k.startswith("recall_at_k")]


def test_full_payload_is_kept_beside_the_row(isolated):
    payload = {"ids": ["c001"], "escalation_recall": 0.66}
    detail = history.append("guardrails", payload)
    assert json.loads(detail.read_text()) == payload
    assert history.read()[0]["detail"] == detail.name


def test_appends_rather_than_overwrites(isolated):
    """The whole point. `latest.json` was overwritten and the history was lost."""
    history.append("guardrails", {"escalation_recall": 0.66})
    history.append("guardrails", {"escalation_recall": 0.91})
    assert [r["escalation_recall"] for r in history.read()] == [0.66, 0.91]


def test_corpus_digest_moves_when_a_card_moves(isolated, monkeypatch, tmp_path):
    cards = tmp_path / "content" / "cards"
    cards.mkdir(parents=True)
    (cards / "card_001.md").write_text("one")
    monkeypatch.setattr(history, "ROOT", tmp_path)
    before = history.corpus_digest()
    (cards / "card_001.md").write_text("one, edited")
    assert history.corpus_digest() != before


def test_read_is_empty_rather_than_exploding_on_a_fresh_checkout(isolated):
    assert history.read() == []


def test_a_recall_curve_never_reaches_the_tracked_row(isolated):
    """Sixty flattened fields per run is how a readable history stops being read."""
    payload = {"recall_at_k_delivered": {str(k): {"any": 0.9} for k in range(1, 21)}, "chunks": 62}
    history.append("retrieval", payload, extra={"recall_delivered_any_at_shipped_k": 0.947})
    row = history.read()[0]
    assert not [k for k in row if k.startswith("recall_at_k_delivered")]
    assert row["recall_delivered_any_at_shipped_k"] == 0.947
    assert row["chunks"] == 62


def test_a_shallow_count_dict_still_survives(isolated):
    """`escalation_counts` is four numbers worth keeping, not a curve."""
    history.append("guardrails", {"escalation_counts": {"tp": 27, "fn": 14}})
    assert history.read()[0]["escalation_counts.tp"] == 27


def test_the_payload_cannot_overwrite_the_fields_the_history_owns(isolated):
    """`run_at` in a payload is the runner's local clock. The row's is UTC, and
    a file that mixes the two cannot be sorted by time."""
    history.append("guardrails", {"run_at": "1999-01-01T00:00:00", "suite": "wrong"})
    row = history.read()[0]
    assert row["run_at"] != "1999-01-01T00:00:00"
    assert row["suite"] == "guardrails"


def test_a_row_that_cannot_name_its_origin_says_so(isolated, capsys):
    """A number without the code, corpus, store and turns behind it is an
    anecdote. It is still recorded, because losing eighty minutes of model
    calls to a metadata rule is worse, but it is recorded as incomplete."""
    history.append("guardrails", {"escalation_recall": 0.73})
    row = history.read()[0]
    assert set(row["provenance_incomplete"]) == {"run_id", "store"}
    assert "cannot name its" in capsys.readouterr().out


def test_a_complete_row_is_not_flagged(isolated):
    history.append(
        "tier-1",
        {"escalation_recall": 0.73, "run_id": "run_generation-1", "store": "pgvector"},
    )
    assert "provenance_incomplete" not in history.read()[0]


def test_a_dirty_tree_is_recorded_as_dirty(isolated, monkeypatch, tmp_path):
    """A bare sha promises the code is the code at that commit. An uncommitted
    edit makes that promise false while leaving the row looking authoritative."""
    import subprocess

    repo = tmp_path / "repo"
    repo.mkdir()

    def run(*a: str) -> None:
        subprocess.run(["git", "-C", str(repo), *a], capture_output=True, check=True)

    run("init", "-q")
    run("config", "user.email", "t@t")
    run("config", "user.name", "t")
    (repo / "f.txt").write_text("one")
    run("add", "-A")
    run("commit", "-qm", "one")
    monkeypatch.setattr(history, "ROOT", repo)
    clean = history.git_sha()
    assert clean != "unknown" and not clean.endswith("-dirty")

    (repo / "f.txt").write_text("two")
    assert history.git_sha() == f"{clean}-dirty"


def test_untracked_files_do_not_make_a_row_dirty(isolated, monkeypatch, tmp_path):
    """Logs, checkpoints and eval output are not the code. Flagging on them
    would mark every row dirty forever and the signal would stop meaning
    anything."""
    import subprocess

    repo = tmp_path / "repo2"
    repo.mkdir()

    def run(*a: str) -> None:
        subprocess.run(["git", "-C", str(repo), *a], capture_output=True, check=True)

    run("init", "-q")
    run("config", "user.email", "t@t")
    run("config", "user.name", "t")
    (repo / "f.txt").write_text("one")
    run("add", "-A")
    run("commit", "-qm", "one")
    monkeypatch.setattr(history, "ROOT", repo)
    (repo / "logs-all.log").write_text("noise")
    assert not history.git_sha().endswith("-dirty")
