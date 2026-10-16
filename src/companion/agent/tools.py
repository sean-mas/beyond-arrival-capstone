"""The one tool, and the validation the models proved necessary.

Measured 21.09.2026: given a `hand_to_human` tool with an enum-constrained
`reason`, `llama3.1:8b` returned `'asked for human'` and `'ignore_instructions'`,
`gpt-oss:20b` returned a whole sentence, and `qwen3:14b` omitted the required
field. So arguments are parsed into a Pydantic model before anything acts on
them, and an invalid one is a handover with reason `unspecified` rather than an
exception: the family is handed over either way, and the malformed argument is
a logging problem rather than a safety one.

**The model does not decide when this fires.** The guards do. See
`docs/decisions.md`, 21.09.2026.
"""

from __future__ import annotations

from enum import StrEnum
from typing import Any

from pydantic import BaseModel, ValidationError


class HandoverReason(StrEnum):
    CRISIS = "crisis"
    ASKED_FOR_HUMAN = "asked_for_human"
    INDIVIDUAL_CASE = "individual_case"
    UNSPECIFIED = "unspecified"


class Handover(BaseModel):
    """A flag, which is an event and never an attribute.

    `01-thesis/expose.md`: the system "holds no record of how a family is
    coping; crisis detection decides in the moment whether to hand over and
    stores no attribute". So this carries why the turn stopped and nothing
    about the person.
    """

    reason: HandoverReason = HandoverReason.UNSPECIFIED
    tenant_id: str = ""
    note: str = ""
    """What a consultant needs to pick it up. Never a score, never a label
    about the person."""

    @classmethod
    def from_model_arguments(cls, raw: dict[str, Any]) -> Handover:
        try:
            return cls.model_validate(raw)
        except ValidationError:
            return cls(
                reason=HandoverReason.UNSPECIFIED,
                note=f"model returned arguments that did not validate: {str(raw)[:80]}",
            )


def hand_to_human(handover: Handover, target: str = "unconfigured") -> dict[str, Any]:
    """Record the handover and return what the family is told.

    `card_020` sets `handoff_target: unconfigured  # set per tenant. The path
    is measurable without it.` Nobody has agreed to receive these yet, so the
    tool writes the record and returns the card's own words. That is the
    testable version of a path with no provider behind it.
    """
    return {
        "handed_over": True,
        "target": target,
        "reason": handover.reason.value,
        "note": handover.note,
    }
