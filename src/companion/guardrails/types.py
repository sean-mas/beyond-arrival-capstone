"""Verdicts. Every guard returns one of these, never a bare bool.

`TurnRecord.refusal_reason` exists because a blocked turn has to be explainable
after the fact, and a boolean explains nothing. A verdict also carries which
guard produced it, which is what makes the per-class table in
`evals/run_guardrails.py` possible.
"""

from __future__ import annotations

from enum import StrEnum

from pydantic import BaseModel, Field


class Action(StrEnum):
    """What the graph does next. `CONTINUE` is the only one that reaches generation."""

    CONTINUE = "continue"
    REFUSE = "refuse"
    HANDOVER = "handover"
    BLOCK = "block"


class GuardName(StrEnum):
    PII = "pii"
    INJECTION = "injection"
    CRISIS = "crisis"
    REFUSAL = "refusal"
    OUTPUT = "output"


class Verdict(BaseModel):
    """One guard's finding about one turn."""

    guard: GuardName
    action: Action = Action.CONTINUE
    reason: str = ""
    """Short, specific, and safe to log. Never quotes the message back."""

    detail: dict[str, object] = Field(default_factory=dict)
    """Structured evidence: which pattern matched, which policy line fired."""

    @property
    def halts(self) -> bool:
        return self.action is not Action.CONTINUE

    @classmethod
    def clean(cls, guard: GuardName) -> Verdict:
        return cls(guard=guard)


class InputVerdicts(BaseModel):
    """The four input guards, in the order the thesis fixes them.

    Ordered deliberately. PII redaction runs first and never halts, because a
    message has to be redacted before anything else reads it, including the
    logs and the crisis classifier. Injection is next and cheap. Crisis is
    third because it is the expensive call and the only one whose miss is
    unrecoverable. Refusal is last because a refusal is still an answer.
    """

    pii: Verdict
    injection: Verdict
    crisis: Verdict
    refusal: Verdict

    @property
    def ordered(self) -> list[Verdict]:
        return [self.pii, self.injection, self.crisis, self.refusal]

    @property
    def decision(self) -> Verdict:
        """The first halting verdict, or a clean CONTINUE.

        Crisis wins over refusal when both fire. `a037` and `a040` are labelled
        refuse AND escalate, and of the two the handover is the one a person
        needs: a refusal on its own leaves someone who asked for help holding
        nothing.
        """
        for verdict in self.ordered:
            if verdict.halts:
                return verdict
        return Verdict.clean(GuardName.PII)

    @property
    def escalated(self) -> bool:
        """Did this turn actually reach a human?

        Read off the decision, not off every verdict. The crisis classifier
        runs on messages that an earlier guard has already blocked, and
        counting its opinion as an escalation reports a handover that never
        happened (a013, a translation-shaped extraction attempt).

        The one addition is a refusal the refusal guard itself marks as needing
        a person: refusing a medical question and stopping there leaves someone
        who asked for help holding nothing (a037, a040).
        """
        return self.decision.action is Action.HANDOVER or bool(self.refusal.detail.get("escalate"))

    @property
    def refused(self) -> bool:
        """Narrow definition, per docs/product/refusal-definition.md.

        Only the refusal guard can set this. Redaction is not refusal and
        blocking an extraction is not refusal, which is why `expect_refusal` is
        false on all 8 PII cases and on 7 of the 10 injection cases.
        """
        return self.refusal.action is Action.REFUSE
