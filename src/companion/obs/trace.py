"""The record written for every turn.

These fields are not telemetry. They are the measurement the master thesis
takes between 17.10 and 31.12, and the thesis pre-registration section 1.5
fixes them in advance. **Retrofitting any one of them means re-running every
measurement**, so they ship with the agent skeleton in week 1 rather than after
it.

`retrieval_top_score` and `retrieval_margin` are already computed by the
retrieval step today and thrown away. `answer_confidence` is one more key in
the structured generation output.
"""

from __future__ import annotations

from datetime import UTC, datetime

from pydantic import BaseModel, Field


class TurnRecord(BaseModel):
    """One turn, in and out. Serialised to Langfuse and to Postgres."""

    # --- the seven pre-registered fields ----------------------------------
    prompt_version: str
    """Which prompt produced this answer. Set from PROMPT_VERSION."""

    chunk_ids: list[str]
    """Exactly which chunks were retrieved, in rank order."""

    run_index: int = 0
    """Which repeat of the same case this is. 0 for live traffic."""

    condition_label: str = "clean"
    """`clean`, or the name of the perturbation operator that was applied."""

    parent_case_id: str | None = None
    """The case a perturbed variant was derived from. None for live traffic."""

    retrieval_top_score: float | None = None
    """Similarity of the top chunk."""

    retrieval_margin: float | None = None
    """Top score minus second score. Reported with the top score, never alone:
    a high top score with no margin is a different situation from a high top
    score that is clearly ahead."""

    answer_confidence: float | None = None
    """The model's own self-report, from the structured output."""

    # --- everything else --------------------------------------------------
    turn_id: str
    run_id: str | None = None
    """Which eval run produced this turn. Null for live traffic.

    Added 22.09.2026: one day's turn log held a baseline-0 run, a smoke run and
    a full tier-1 run in one file with no way to separate them, and the judge
    calibration sampler would have drawn from all three. `prompt_version`
    happened to separate two of them, by luck rather than design."""
    route: str | None = None
    """`answer`, `clarify` or `retrieve_more`. Null on a halted turn, which
    never reaches the routing decision."""
    tenant_id: str
    case_id: str | None = None
    question: str
    answer: str | None = None
    escalated: bool = False
    refused: bool = False
    refusal_reason: str | None = None
    latency_ms: int | None = None
    cost_eur: float | None = None
    model: str | None = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(UTC))

    def missing_preregistered(self) -> list[str]:
        """Which of the seven are unset.

        Called by the test that refuses to let a turn ship without them. An
        instrument that can fail silently must be tested against a known-bad
        input before its silence is treated as a pass.
        """
        required = {
            "prompt_version": self.prompt_version,
            "chunk_ids": self.chunk_ids,
            "run_index": self.run_index,
            "condition_label": self.condition_label,
            "retrieval_top_score": self.retrieval_top_score,
            "retrieval_margin": self.retrieval_margin,
            "answer_confidence": self.answer_confidence,
        }
        # parent_case_id is legitimately None on a clean run, so it is checked
        # by condition_label instead: a perturbed turn must name its parent.
        missing = [k for k, v in required.items() if v is None or v == []]
        if self.condition_label != "clean" and self.parent_case_id is None:
            missing.append("parent_case_id")
        return missing
