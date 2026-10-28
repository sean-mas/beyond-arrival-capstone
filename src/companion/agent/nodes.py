"""The five stages, as functions. `graph.py` wires them.

Stage order is the thesis design section 6.2 and does not move: the thesis
treats this system as a black box and documents these five stages, so a sixth
one here would make the documentation wrong.
"""

from __future__ import annotations

import uuid
from collections.abc import Callable

from companion.agent import prompts
from companion.agent.state import CompanionState
from companion.agent.tools import Handover, HandoverReason, hand_to_human
from companion.guardrails import crisis, groundedness, injection, output, pii, refusal
from companion.guardrails.types import Action, GuardName, InputVerdicts, Verdict
from companion.llm.ollama import Backend
from companion.obs.sink import emit
from companion.obs.trace import TurnRecord

# Keyed on the trigger, not on the guard. The crisis guard has two triggers and
# they are not the same event: someone who asks to speak to a person has made an
# ordinary request, and recording that as `crisis` writes a judgement about how
# they are coping onto a turn where nobody judged anything. That is the G5 line
# in miniature, and card_020 is explicit that using the handover path "is not an
# escalation or an admission of anything".
_REASON_FOR_TRIGGER = {
    "explicit_request": HandoverReason.ASKED_FOR_HUMAN,
    "classifier": HandoverReason.CRISIS,
    "classifier_error": HandoverReason.UNSPECIFIED,
    "expiring_permit": HandoverReason.INDIVIDUAL_CASE,
    "acute_status": HandoverReason.INDIVIDUAL_CASE,
}


def guard_in(state: CompanionState, backend: Backend | None = None) -> CompanionState:
    """Stage 1. Redact, then three checks any of which can halt the turn.

    Order is fixed and each position is load-bearing. PII first, because the
    redacted text is what every later stage reads, including the classifier and
    the log. Injection second, because it is deterministic and free. Crisis
    third, because it is the expensive call and the only miss that cannot be
    recovered. Refusal last, because a refusal is still an answer.
    """
    redacted, pii_verdict = pii.check(state["message"])
    injection_verdict = injection.check(redacted)
    crisis_verdict = crisis.check(redacted, backend)
    refusal_verdict = refusal.check(redacted)

    # a010 and a011 are injections wrapped around a reserved-topic question and
    # are labelled `expect_refusal: true`. Blocking them as injection would mean
    # the refusal label could never be produced, so the refusal wins: it is the
    # more informative outcome and it is the one the case set asks for.
    if injection_verdict.halts and refusal_verdict.action is Action.REFUSE:
        injection_verdict = Verdict(
            guard=GuardName.INJECTION,
            reason=f"{injection_verdict.reason}; superseded by the refusal on the same turn",
            detail=injection_verdict.detail,
        )

    verdicts = InputVerdicts(
        pii=pii_verdict,
        injection=injection_verdict,
        crisis=crisis_verdict,
        refusal=refusal_verdict,
    )
    return {
        "redacted": redacted,
        "verdicts": verdicts.ordered,
        "escalated": verdicts.escalated,
        "refused": verdicts.refused,
        "refusal_reason": verdicts.decision.reason if verdicts.decision.halts else None,
    }


def retrieve(state: CompanionState, retriever: object, k: int | None = None) -> CompanionState:
    """Stage 2. Top-k similarity search, scoped by tenant.

    k defaults to `settings.retrieval_k`, which the recall@k curve chose on
    21.09.2026 rather than preference: on the cases where retrieval actually
    decides the answer, k=6 reaches 0.947 and k=8, 10 and 12 reach no further.

    `situation` is read off the top chunk. The situation router that used to
    produce it was deleted on 11.09.2026 and nothing replaced it; every Chunk
    carries the field already, so this costs nothing and cannot disagree with
    what was actually retrieved.
    """
    from companion.config import settings

    width = k or settings.retrieval_k
    attempt = state.get("retrievals", 0)
    # A second pass widens k rather than repeating the first. Retrieving the
    # same chunks again and calling it "more" is how a retry becomes a spend.
    hits = retriever.search(  # type: ignore[attr-defined]
        state["redacted"],
        tenant_id=state.get("tenant_id") or "global",
        k=width * (attempt + 1),
    )
    top = [h.chunk for h in hits]
    return {
        "chunks": top,
        "retrievals": attempt + 1,
        "situation": top[0].situation if top else None,
        "retrieval_top_score": hits[0].score if hits else None,
        "retrieval_margin": (hits[0].score - hits[1].score) if len(hits) > 1 else None,
    }


def _context(state: CompanionState) -> str:
    """The context block every model call on the answer path sees.

    One builder for `decide`, `clarify` and `generate`, because until
    24.09.2026 only `generate` got one. `decide` was asked whether "the material
    below" covered the question with no material below it, and routed blind:
    on tier 2, 36 of 65 delivered turns sent a question back instead of an
    answer, the private-or-statutory insurance question among them with
    `card_004` retrieved at ranks 1 to 3.
    """
    chunks_text = "\n\n---\n\n".join(c.text for c in state.get("chunks", []))
    profile = ", ".join(f"{k}: {v}" for k, v in (state.get("profile") or {}).items())
    return prompts.context_block(chunks_text, state.get("situation"), profile)


def decide(state: CompanionState, backend: Backend | None = None) -> CompanionState:
    """The model's one routing decision, on the safe path only.

    Everything that could hurt someone was settled in `guard_in`. What is left
    is whether the retrieved material answers the question, and a wrong choice
    here costs a mediocre answer rather than a missed escalation.
    """
    if backend is None:
        return {"route": "answer"}
    try:
        system = prompts.ROUTE.format(context=_context(state))
        result = backend.complete(system, state["redacted"], json_mode=True).as_json()
    except Exception:  # noqa: BLE001 - a routing failure is not a safety failure
        return {"route": "answer"}
    route = str(result.get("route", "answer"))
    return {"route": route if route in {"answer", "retrieve_more", "clarify"} else "answer"}


DEFAULT_CLARIFICATION = (
    "Tell me a little more about what is going on and I will see what I have that helps."
)


def clarify(state: CompanionState, backend: Backend | None = None) -> CompanionState:
    """The route that used to end in silence.

    Measured 22.09.2026 on the first full tier-1 run: 25 of 115 turns routed to
    `clarify`, and `clarify` was an edge straight to `act` with nothing setting
    `answer`. The family got an empty string and the trace recorded
    `action: send`. Twenty-two percent of turns, reported as delivered.

    The fallback is a real sentence rather than an empty one, for the reason
    `act` already states about halting verdicts: a turn that returns nothing is
    a bug the family experiences as silence.
    """
    if backend is None:
        return {"answer": DEFAULT_CLARIFICATION, "clarified": True}
    try:
        # No cards, E3 of 29.09.2026. With material in front of it the
        # clarifying reply borrowed a card's situation: card_011's "you may
        # have given up more than anyone acknowledged" landed on a remark about
        # winter. A question about their situation needs their words, not ours.
        profile = ", ".join(f"{k}: {v}" for k, v in (state.get("profile") or {}).items())
        system = prompts.CLARIFY.format(context=f"FAMILY: {profile}" if profile else "")
        result = backend.complete(system, state["redacted"], json_mode=True).as_json()
        question = str(result.get("reply") or result.get("question") or "").strip()
    except Exception:  # noqa: BLE001 - a clarification failure is not a safety failure
        question = ""
    return {"answer": question or DEFAULT_CLARIFICATION, "clarified": True}


def generate(state: CompanionState, backend: Backend | None = None) -> CompanionState:
    """Stage 3. Assemble the five documented inputs and call the model.

    Structured output since prompt v1, because `answer_confidence` is one of
    the seven pre-registered fields and a bare string cannot carry it.

    **A model that returns prose is not a failure.** Local models asked for
    JSON comply most of the time, not always, so the prose falls through as the
    answer with a null confidence, and the null is what the eval counts. A
    parser that invented 0.5 on a parse failure would make the field
    unmeasurable in exactly the runs where it matters.
    """
    chunks_text = "\n\n---\n\n".join(c.text for c in state.get("chunks", []))
    system = prompts.ANSWER.format(context=_context(state))
    if backend is None:
        # Baseline 0's path: no model, the top chunk verbatim.
        # The first paragraph that is not a markdown heading: later chunks open
        # with their `## ` line, and a heading alone is not an answer.
        paragraphs = [p for p in chunks_text.split("\n\n") if p.strip()]
        body = [p for p in paragraphs if not p.lstrip().startswith("#")]
        return {"draft": (body or paragraphs or [""])[0]}

    completion = backend.complete(system, state["redacted"], json_mode=True)
    try:
        payload = completion.as_json()
    except Exception:  # noqa: BLE001 - see docstring
        return {"draft": _salvage(completion.text), "answer_confidence": None, "used_chunk_ids": []}

    confidence = payload.get("confidence")
    return {
        "draft": str(payload.get("answer") or completion.text),
        "answer_confidence": float(confidence) if isinstance(confidence, (int, float)) else None,
        "used_chunk_ids": [str(x) for x in (payload.get("used_chunk_ids") or [])],
    }


def _salvage(text: str) -> str:
    """The reply out of JSON that does not parse, or the text as it came.

    29.09.2026, prompt v4, case c075: gpt-oss:120b wrote `"confidence": 0.
    nine`, the parse failed, and the family would have been shown the raw
    object, braces and all. Prose that was never JSON passes through
    unchanged, as the docstring above promises.
    """
    import json
    import re

    if '"answer"' not in text:
        return text
    m = re.search(r'"answer"\s*:\s*"((?:[^"\\]|\\.)*)"', text, re.S)
    if not m:
        return text
    try:
        return str(json.loads(f'"{m.group(1)}"'))
    except ValueError:
        return m.group(1)


def guard_out(state: CompanionState, cards: list | None = None) -> CompanionState:
    """Stage 4. Two checks, then a fallback that is never silence.

    **Bans first, groundedness second, and the order matters.** A banned claim
    is wrong whether or not the corpus contains it; an ungrounded claim is only
    wrong because nothing supports it. Running groundedness first would let a
    forbidden failure-rate statistic through on the grounds that a card
    happened to mention the number.

    The fallback removes the blocked sentence and keeps the rest of the draft
    (`_without`, E1 of 29.09.2026). Until then it was baseline 0's behaviour,
    the top retrieved chunk verbatim, which answered a salary question with the
    health insurance card. When too little is left, the gate's own sentence.
    """
    draft = state.get("draft", "")
    chunks = state.get("chunks") or []
    chunks_text = "\n\n".join(c.text for c in chunks)

    verdict = output.check(draft, cards)
    if verdict.halts:
        matched = str(verdict.detail.get("matched", ""))
        fallback = _without(draft, _containing([matched]), note=None)
        # `act` sends a halting verdict's own `reply`, so the fallback has to
        # travel on the verdict. Setting only `answer` here was overridden in
        # `act`: until 29.09.2026 the log stored one text and the family got
        # another, and E1's first run measured nothing.
        verdict = verdict.model_copy(update={"detail": {**verdict.detail, "reply": fallback}})
        return {
            "answer": fallback,
            "verdicts": [verdict],
            "blocked_by": [f"output:{matched}"],
            "trace": {"output_fallback": True},
        }

    grounding = groundedness.check(draft, chunks_text, state.get("redacted", ""))
    if grounding.halts:
        found = grounding.detail.get("unsupported")
        unsupported = [str(u) for u in found] if isinstance(found, list) else []
        kinds = {u.split(":", 1)[0] for u in unsupported}
        fallback = _without(
            draft,
            lambda sentence: bool(
                groundedness.unsupported(sentence, chunks_text, state.get("redacted", ""))
            ),
            note=_left_out(unsupported),
            # The gate's own sentence is about numbers. An office or a legal
            # statement gets a sentence that is about what was removed.
            nothing_left=groundedness.REPLY if kinds & _NUMERIC else _NOTHING_LEFT,
        )
        grounding = grounding.model_copy(update={"detail": {**grounding.detail, "reply": fallback}})
        return {
            "answer": fallback,
            "verdicts": [verdict, grounding],
            "grounded": False,
            "blocked_by": unsupported,
            "trace": {"output_fallback": True, "ungrounded": unsupported},
        }

    return {
        "answer": _plain(draft),
        "verdicts": [verdict, grounding],
        # Logged rather than gated: an answer with no checkable claim and no
        # retrieved material is allowed, and the rate at which that happens is
        # a number worth watching instead of a behaviour worth forbidding.
        "grounded": True,
    }


_WHAT = {
    "deadline": "a time or deadline",
    "date": "a date",
    "money": "an amount",
    "percentage": "a percentage",
    "legal_term": "a statement about what the law requires",
    "authority": "a statement about what an office decides",
}


def _left_out(unsupported: list[str]) -> str:
    """Say what kind of thing was removed. E1's first run told a family a
    "figure" was left out when the removed sentence named an office."""
    kinds = {u.split(":", 1)[0] for u in unsupported}
    what = next((_WHAT[k] for k in _WHAT if k in kinds), "a detail")
    return (
        f"I have left out {what} I could not check against your provider's material; "
        "your contact at the provider can confirm it."
    )


_NUMERIC = {"deadline", "date", "money", "percentage"}

_NOTHING_LEFT = (
    "I would rather not state that without material to back it up. Your contact at the "
    "provider can tell you who handles it."
)


def _plain(text: str) -> str:
    """No markdown headings in front of a family. The cards are written in
    markdown and a card pasted by the old fallback arrived with its `##`."""
    import re

    return re.sub(r"(?m)^\s*#{1,6}\s+.*\n?", "", text).strip()


def _containing(needles: list[str]) -> Callable[[str], bool]:
    """A sentence test: does it contain any of these, ignoring case."""
    wanted = [n.lower() for n in needles if n.strip()]
    return lambda sentence: any(n in sentence.lower() for n in wanted)


def _without(
    draft: str,
    blocked: Callable[[str], bool],
    note: str | None,
    nothing_left: str = groundedness.REPLY,
) -> str:
    """The draft minus every sentence holding a blocked claim. E1, 29.09.2026.

    Until then a blocked draft was replaced by the top retrieved chunk,
    verbatim: a cost-of-living question got the health insurance card, heading
    and all, because the salary figure matched it best. The model's draft was
    on topic; one sentence in it was not checkable. So only that sentence
    goes, and the family is told a figure was left out. If nothing worth
    sending is left, the gate's own sentence is sent instead, never a card.
    """
    import re

    # A sentence can end inside a quote: `...residence permit?" A concrete step`.
    sentences = re.split(r"(?<=[.!?][\"\u201d\u2019)])\s+|(?<=[.!?])\s+", _plain(draft))
    # `blocked` is asked about each sentence on its own, so a sentence that only
    # names an office as the place to ask survives next to one that makes a
    # claim about it (a003, E3 run, 30.09.2026).
    kept = [s for s in sentences if not blocked(s)]
    if len(" ".join(kept).split()) < 8:
        return nothing_left
    return " ".join(kept + ([note] if note else []))


def act(state: CompanionState) -> CompanionState:
    """Stage 5. Send, raise a flag, or log a check-in.

    A halted turn reaches here directly. The reply is the guard's own wording,
    which is why every halting verdict carries one: a blocked turn that returns
    an empty string is a bug the family experiences as silence.
    """
    verdicts = [v for v in state.get("verdicts", []) if v.halts]
    answer = state.get("answer") or ""
    if verdicts:
        # The log holds what the family saw. A handed-over turn used to log an
        # empty answer, because the guard's wording was only chosen below.
        answer = str(verdicts[0].detail.get("reply", "")) or answer
    if not verdicts and answer:
        # On a delivered answer only. A turn handed to a person or refused
        # already has its own careful wording, and a data notice in front of a
        # crisis handover would be the wrong first sentence.
        pii_verdict = next((v for v in state.get("verdicts", []) if v.guard is GuardName.PII), None)
        prefix = pii.notice(pii_verdict) if pii_verdict else None
        if prefix:
            answer = f"{prefix} {answer}"
    record = TurnRecord(
        turn_id=str(uuid.uuid4()),
        run_id=state.get("run_id"),
        route=state.get("route"),
        case_id=state.get("case_id"),
        model=state.get("model"),
        run_index=state.get("run_index", 0),
        condition_label=state.get("condition_label", "clean"),
        tenant_id=state.get("tenant_id", ""),
        question=state.get("redacted", ""),
        answer=answer,
        prompt_version=prompts.VERSION,
        chunk_ids=[c.id for c in state.get("chunks", [])],
        retrieval_top_score=state.get("retrieval_top_score"),
        retrieval_margin=state.get("retrieval_margin"),
        answer_confidence=state.get("answer_confidence"),
        escalated=bool(state.get("escalated")),
        refused=bool(state.get("refused")),
        refusal_reason=state.get("refusal_reason"),
    )

    emit(record)

    if not verdicts:
        return {
            "answer": answer,
            "trace": {"record": record.model_dump(mode="json"), "action": "send"},
        }

    halting = verdicts[0]
    reply = str(halting.detail.get("reply", ""))
    handover = None
    if halting.action is Action.HANDOVER:
        handover = hand_to_human(
            Handover(
                reason=_REASON_FOR_TRIGGER.get(
                    str(halting.detail.get("trigger", "")),
                    HandoverReason.INDIVIDUAL_CASE
                    if halting.guard is GuardName.REFUSAL
                    else HandoverReason.UNSPECIFIED,
                ),
                tenant_id=state.get("tenant_id", ""),
                note=halting.reason,
            )
        )
    return {
        "answer": reply or state.get("answer", ""),
        "trace": {
            "record": record.model_dump(mode="json"),
            "action": halting.action.value,
            "guard": halting.guard.value,
            "handover": handover,
        },
    }
