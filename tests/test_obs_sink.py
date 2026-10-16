"""The sink exists because the seven fields were being assembled and dropped.

So these tests assert the record actually lands on disk with those fields
intact, not merely that `write` was called. An instrument that reports success
without producing the artefact is the failure mode this project keeps hitting.
"""

from __future__ import annotations

import json
import pathlib
from datetime import UTC, datetime

import pytest

from companion.obs.sink import JsonlSink, NullSink, emit, set_sink
from companion.obs.trace import TurnRecord


def record(**kw) -> TurnRecord:
    base = dict(
        turn_id="t1",
        tenant_id="acme",
        question="wie melde ich mich an",
        prompt_version="v3",
        chunk_ids=["card_002#0"],
        run_index=0,
        condition_label="clean",
        retrieval_top_score=0.55,
        retrieval_margin=0.01,
        answer_confidence=0.7,
    )
    base.update(kw)
    return TurnRecord(**base)  # type: ignore[arg-type]


def test_jsonl_sink_writes_one_line_per_record(tmp_path):
    sink = JsonlSink(tmp_path)
    sink.write(record(turn_id="a"))
    sink.write(record(turn_id="b"))
    path = sink.path_for()
    lines = path.read_text().splitlines()
    assert len(lines) == 2
    assert [json.loads(x)["turn_id"] for x in lines] == ["a", "b"]


def test_written_record_keeps_every_preregistered_field(tmp_path):
    sink = JsonlSink(tmp_path)
    sink.write(record())
    written = json.loads(sink.path_for().read_text().splitlines()[0])
    restored = TurnRecord(**written)
    assert restored.missing_preregistered() == []


def test_file_is_named_for_the_record_not_for_now(tmp_path):
    """A turn from yesterday belongs in yesterday's file, or a replay of an
    archived run silently rewrites today's history."""
    sink = JsonlSink(tmp_path)
    old = record(created_at=datetime(2026, 9, 1, 12, 0, tzinfo=UTC))
    sink.write(old)
    assert (tmp_path / "turns-2026-09-01.jsonl").exists()


def test_default_sink_writes_nothing(tmp_path):
    previous = set_sink(NullSink())
    try:
        emit(record())
        assert list(tmp_path.iterdir()) == []
    finally:
        set_sink(previous)


def test_emit_survives_a_broken_sink():
    """A logging failure must not fail a turn that was answered correctly."""

    class Broken:
        def write(self, record: TurnRecord) -> None:
            raise OSError("disk full")

    previous = set_sink(Broken())
    try:
        emit(record())  # must not raise
    finally:
        set_sink(previous)


def test_set_sink_returns_the_previous_one(tmp_path):
    first = JsonlSink(tmp_path)
    previous = set_sink(first)
    try:
        assert set_sink(previous) is first
    finally:
        set_sink(previous)


@pytest.mark.parametrize("text", ["Straße 4", "私", "emoji 🙂"])
def test_non_ascii_survives_the_round_trip(tmp_path, text):
    sink = JsonlSink(tmp_path)
    sink.write(record(question=text))
    assert json.loads(sink.path_for().read_text().splitlines()[0])["question"] == text


def test_the_default_path_is_the_ignored_one():
    """The docstring says turn records land under `private/`. This asserts it,
    because a privacy rule that lives only in a comment is not a rule."""
    from companion.obs.sink import DEFAULT_DIR, default_sink

    root = pathlib.Path(__file__).resolve().parents[1]
    assert root / "private" / "runs" == DEFAULT_DIR
    assert "private/" in (root / ".gitignore").read_text()
    assert default_sink().directory == DEFAULT_DIR


def test_a_real_turn_reaches_a_real_file(tmp_path, chunks, cards):
    """The test the last round was missing.

    `emit` was wired into `act` and no caller ever installed a sink, so every
    record was dropped by the module default while the code, the docs and the
    decision log all said records were persisted. Asserting that `emit` exists
    is not asserting that anything is written. This drives the compiled graph
    and then looks on disk.
    """
    from companion.agent.graph import build
    from companion.llm.ollama import StubBackend
    from companion.obs.sink import JsonlSink, set_sink
    from companion.retrieval.lexical import TfidfRetriever

    sink = JsonlSink(tmp_path)
    previous = set_sink(sink)
    try:
        app = build(
            TfidfRetriever(chunks),
            cards,
            StubBackend(['{"needs_human": false}']),
            StubBackend(['{"route": "answer", "why": "fine"}', "Here is the answer."]),
        )
        app.invoke(
            {"tenant_id": "global", "message": "how do I register my address", "verdicts": []}
        )
    finally:
        set_sink(previous)

    written = list(tmp_path.glob("turns-*.jsonl"))
    assert written, "the turn ran and nothing was written"
    row = json.loads(written[0].read_text().splitlines()[0])
    assert row["tenant_id"] == "global"
    assert row["chunk_ids"], "a delivered turn logged no chunk ids"
