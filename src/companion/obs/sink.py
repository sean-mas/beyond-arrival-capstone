"""Where a `TurnRecord` goes after the turn ends.

Without this the seven pre-registered fields are assembled and then dropped on
the floor: `act` built the record, put it in the graph state, and nothing ever
persisted it. A field that is logged into a variable that goes out of scope is
not logged.

Two rules the design follows.

**The default is a no-op.** A sink that writes by default turns every unit test
into a file-writing test, and a suite that writes files gets skipped the first
time it fails on someone else's machine. The runtime and the eval harness
opt in explicitly.

**Turn records are private by default.** A record carries `question` and
`answer`, which on real traffic are a family's own words. The default path is
under `private/`, which `.gitignore` excludes, because the alternative is one
`git add -A` away from publishing the thing the anonymisation rule exists to
prevent. Aggregate metrics, which carry no user text, go to `evals/history.jsonl`
instead and are tracked deliberately.
"""

from __future__ import annotations

import json
import pathlib
import threading
from datetime import UTC, datetime
from typing import Protocol

from companion.obs.trace import TurnRecord


class TurnSink(Protocol):
    def write(self, record: TurnRecord) -> None: ...


class NullSink:
    """Drops records. The default, so importing the agent writes nothing."""

    def write(self, record: TurnRecord) -> None:  # noqa: D102
        return None


class JsonlSink:
    """Appends one JSON object per turn, one file per day.

    Append-only and line-delimited so a crashed run keeps every turn before it,
    and so the history can be read with `wc -l` and `grep` rather than a parser.
    """

    def __init__(self, directory: pathlib.Path, prefix: str = "turns") -> None:
        self.directory = pathlib.Path(directory)
        self.prefix = prefix
        self._lock = threading.Lock()

    def path_for(self, when: datetime | None = None) -> pathlib.Path:
        stamp = (when or datetime.now(UTC)).strftime("%Y-%m-%d")
        return self.directory / f"{self.prefix}-{stamp}.jsonl"

    def write(self, record: TurnRecord) -> None:  # noqa: D102
        path = self.path_for(record.created_at)
        with self._lock:
            path.parent.mkdir(parents=True, exist_ok=True)
            with path.open("a", encoding="utf-8") as fh:
                fh.write(json.dumps(record.model_dump(mode="json"), ensure_ascii=False) + "\n")


DEFAULT_DIR = pathlib.Path(__file__).resolve().parents[3] / "private" / "runs"
"""Under `private/`, which `.gitignore` excludes. See the module docstring."""


def default_sink() -> JsonlSink:
    """The sink the runtime installs. Named so the path is asserted by a test
    rather than only described in prose above it."""
    return JsonlSink(DEFAULT_DIR)


_sink: TurnSink = NullSink()


def set_sink(sink: TurnSink) -> TurnSink:
    """Install a sink and return the previous one, so callers can restore it."""
    global _sink
    previous, _sink = _sink, sink
    return previous


def emit(record: TurnRecord) -> None:
    """Called once per turn by `agent.nodes.act`. Never raises.

    A logging failure must not take down a turn that was otherwise answered
    correctly. The record is lost and the family still gets their reply, which
    is the right way round.
    """
    try:
        _sink.write(record)
    except Exception:  # noqa: BLE001 - see docstring
        return None
