"""What one turn carries through the graph.

The thesis design stage 3 names five things assembled into the prompt:
retrieved chunks, a versioned system prompt, the situation, the conversation
history and a profile of the family. All five live here, so the code and the
thesis documentation describe the same object.
"""

from __future__ import annotations

from typing import Annotated, Any, TypedDict

from companion.guardrails.types import Verdict
from companion.retrieval.chunking import Chunk


class SeatProfile(TypedDict, total=False):
    """The family, as the prompt needs them. `seats` + `people` in the data model."""

    journey_month: int
    corridor: str
    language: str
    role: str


class CompanionState(TypedDict, total=False):
    """One turn. LangGraph merges partial updates returned by each node."""

    # Input
    tenant_id: str
    run_id: str
    """Set by an eval runner so its turns can be told apart from another run's."""
    case_id: str
    model: str
    run_index: int
    condition_label: str
    message: str
    """The message as received. Never used after guard_in."""
    redacted: str
    """What every later stage reads. PII redaction runs before anything else."""
    history: list[dict[str, str]]
    profile: SeatProfile

    # Guard verdicts, accumulated
    verdicts: Annotated[list[Verdict], lambda a, b: (a or []) + (b or [])]

    # Retrieval
    chunks: list[Chunk]
    retrievals: int
    """How many times `retrieve` has run this turn. Counted explicitly because
    the obvious proxy is wrong: the retriever returns a fixed k, so "have we
    retrieved enough yet" cannot be read off the number of chunks."""
    situation: str | None
    """Read off the top retrieved chunk. The situation router that used to
    produce this was deleted on 11.09.2026 and nothing replaced it; every Chunk
    already carries the field, so it costs nothing and cannot drift from what
    was retrieved."""
    retrieval_top_score: float | None
    retrieval_margin: float | None

    # The model's routing decision, on the safe path only
    route: str
    """`answer`, `retrieve_more` or `clarify`. Chosen by the model."""

    # Output
    clarified: bool
    """The turn asked a question back instead of answering one."""
    grounded: bool
    """Whether every checkable claim in the answer appeared in the retrieved
    material. False only when the gate blocked; absent on a halted turn."""
    draft: str
    blocked_by: list[str]
    """What the output checks objected to, when they did: the matched text,
    never the whole draft. Read by the eval runner, never by a family."""
    answer: str
    escalated: bool
    refused: bool
    refusal_reason: str | None
    answer_confidence: float | None
    used_chunk_ids: list[str]
    """Which chunks the model says it used. Not the same as what was retrieved,
    and the difference is what the groundedness gate reads."""
    trace: dict[str, Any]
