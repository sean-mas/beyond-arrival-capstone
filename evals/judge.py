#!/usr/bin/env python3
"""The LLM judge, for the three qualities no rule can check.

    from judge import Judge
    judge = Judge()                      # settings.judge_*, Groq qwen3.8-27b
    scores = judge.score(question, chunks_text, answer)

`docs/primer.md`: "Using a second model to grade the first model's answers,
because some qualities cannot be checked by rule. You use it only for
groundedness, answer relevance and tone."

**The judge is never the model under test**, and that is enforced rather than
remembered: `Judge.__init__` raises if the two names match. A model grading its
own output measures its self-consistency and reports it as quality.

**Hosted from 29.09.2026.** The local `qwen3:14b` (Sean's pick of 22.09) failed
calibration on 25.09 at kappa 0.13, and on 29.09 Sean moved every model off the
laptop. The default is now `settings.judge_provider:judge_model`, Groq
`qwen3.8-27b`. A `--judge provider:model` changes it and the name lands in
every result, so runs graded by different judges are never silently pooled.

**An uncalibrated judge is an assumption wearing a number.** Nothing here is
trustworthy until `calibrate_judge.py` has compared it against Sean on 30 hand
labels and reported Cohen's kappa. `Judge.score` works regardless; the quality
gate is what refuses to accept the output of an uncalibrated one.

The rule-tier groundedness gate in `src/companion/guardrails/groundedness.py`
is a different thing and stays in the live path: deterministic, no model, and
it catches the case that harms someone. This is the measurement.
"""

from __future__ import annotations

import pathlib
import sys
from dataclasses import dataclass

sys.path.insert(0, str(pathlib.Path(__file__).resolve().parents[1] / "src"))

from companion.llm.ollama import Backend, OllamaBackend  # noqa: E402

DEFAULT_JUDGE_MODEL = "qwen3:14b"

RUBRIC_VERSION = "r2"
"""Which scoring rules produced a number, recorded beside it.

r1 until 29.09.2026. r2 adds the two sentences Sean's first labelling pass
exposed as ambiguous: a claim true in the world but absent from the MATERIAL
is unsupported, and relevance is scored without the next step, which is
`actionable`'s job. A kappa earned under one version says nothing about the
other, so neither calibration nor re-judging pools across it."""

SYSTEM = """You grade one reply from a support companion for a family that has moved to \
Germany. You are not the companion and you never write a better reply.

Four scores, each 0.0 to 1.0:

- "groundedness": does every factual claim in the REPLY appear in the MATERIAL? A reply \
that states no facts at all is 1.0. A reply with one unsupported number is at most 0.3. \
Warmth, opinion and general encouragement are not factual claims. A claim that may well \
be true but is not in the MATERIAL is unsupported.
- "relevance": does the REPLY answer the QUESTION that was asked, rather than a nearby one? \
Score this alone: whether it offers a next step is "actionable", not relevance.
- "tone": plain, warm, written for someone tired. Cheerfulness, exclamation marks, bullet \
lists and clinical language all lower this.
- "actionable": does the REPLY leave the person with one concrete next step they could \
take, such as something to try, someone to ask, or a place to look? Sympathy or a question \
alone is 0.0.

Also return "grounded": true or false, which is groundedness >= 0.7, and "why", at most \
twelve words.

Reply with JSON only:
{"groundedness": 0.0, "relevance": 0.0, "tone": 0.0, "actionable": 0.0, "grounded": true, \
"why": ""}"""

TEMPLATE = """QUESTION:
{question}

MATERIAL:
{material}

REPLY:
{answer}"""


@dataclass
class Scores:
    groundedness: float | None
    relevance: float | None
    tone: float | None
    grounded: bool | None
    why: str = ""
    parsed: bool = True
    actionable: float | None = None
    """Added 24.09.2026, because Sean's labelling found answers on topic that
    moved nobody forward, and relevance as defined cannot see that. Last and
    defaulted so every existing positional construction still means what it
    did."""

    def as_dict(self) -> dict:
        return {
            "groundedness": self.groundedness,
            "relevance": self.relevance,
            "tone": self.tone,
            "actionable": self.actionable,
            "grounded": self.grounded,
            "why": self.why,
            "parsed": self.parsed,
        }


class Judge:
    def __init__(self, backend: Backend | None = None, under_test: str | None = None):
        if backend is None:
            from companion.config import settings

            backend = backend_from_spec(f"{settings.judge_provider}:{settings.judge_model}")
        self.backend = backend or OllamaBackend(DEFAULT_JUDGE_MODEL)
        self.name = self.backend.name
        if under_test and self.name == under_test:
            raise ValueError(
                f"the judge and the model under test are both {under_test}. "
                "A model grading itself measures self-consistency, not quality."
            )

    def score(self, question: str, material: str, answer: str) -> Scores:
        """Grade one reply. A parse failure returns nulls, never a default.

        A judge that returns 0.5 when it could not be parsed contributes a
        number to the mean that nobody produced, and the mean is what the
        thesis reports.
        """
        user = TEMPLATE.format(question=question, material=material or "none", answer=answer)
        try:
            payload = self.backend.complete(SYSTEM, user, json_mode=True).as_json()
        except Exception:  # noqa: BLE001 - see docstring
            return Scores(None, None, None, None, why="unparsed", parsed=False)

        def num(key: str) -> float | None:
            value = payload.get(key)
            return float(value) if isinstance(value, (int, float)) else None

        grounded = payload.get("grounded")
        return Scores(
            groundedness=num("groundedness"),
            relevance=num("relevance"),
            tone=num("tone"),
            actionable=num("actionable"),
            grounded=bool(grounded) if isinstance(grounded, bool) else None,
            why=str(payload.get("why") or "")[:80],
        )


def backend_from_spec(spec: str | None) -> Backend | None:
    """`provider:model`, split on the first colon, since local model names
    carry one of their own (`ollama:qwen3:14b`). None keeps the default.

    One parser for calibration, tier runs and re-judging, so a judge
    calibrated under one spelling is the judge that grades. Moved here from
    `calibrate_judge.py` 29.09.2026, when the tier runs needed it too.
    """
    if not spec:
        return None
    provider, _, model = spec.partition(":")
    if provider == "ollama":
        return OllamaBackend(model)
    if provider == "ollama-cloud":
        from companion.llm.cloud import OllamaCloudBackend

        return OllamaCloudBackend(model)
    if provider == "groq":
        from companion.llm.cloud import GroqBackend

        return GroqBackend(model)
    raise SystemExit(f"--judge {spec!r}: expected ollama:, ollama-cloud: or groq:<model>")


def cohens_kappa(a: list[bool], b: list[bool]) -> float:
    """Agreement corrected for luck.

    `docs/primer.md`: "If failures are rare, two labellers who both say pass
    every time agree 95 percent of the time and have learned nothing."
    """
    if len(a) != len(b) or not a:
        raise ValueError("kappa needs two equal, non-empty label lists")
    n = len(a)
    observed = sum(1 for x, y in zip(a, b, strict=True) if x == y) / n
    pa_true, pb_true = sum(a) / n, sum(b) / n
    expected = pa_true * pb_true + (1 - pa_true) * (1 - pb_true)
    if expected == 1.0:
        return 1.0 if observed == 1.0 else 0.0
    return (observed - expected) / (1 - expected)


def main() -> int:
    """Smoke test: three replies with known verdicts, one call each."""
    judge = Judge()
    material = "You must register your address at the Buergeramt within 14 days of moving in."
    fixtures = [
        ("when do I have to register?", "You have 14 days from moving in.", True),
        ("when do I have to register?", "You have 90 days from moving in.", False),
        ("how do I make friends?", "It takes longer here than most people expect.", True),
    ]
    print(f"  judge: {judge.name}\n")
    for question, answer, expected in fixtures:
        s = judge.score(question, material, answer)
        mark = "ok " if s.grounded == expected else "MISS"
        print(
            f"  {mark} grounded={s.grounded} g={s.groundedness} r={s.relevance} "
            f"t={s.tone}  {answer[:44]}"
        )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())


def ceiling_check(judge: Judge, material: str) -> float | None:
    """Score a verbatim copy of the material as if it were an answer.

    The correct groundedness is exactly 1.0, so whatever comes back is the
    judge's error on the easiest input that exists. Measured 23.09.2026 over
    42 baseline-0 answers: **0.924**, an eight point shortfall on a literal
    copy.

    Worth having as a one-call check rather than only as a side effect of a
    fifty minute baseline run, because it is the cheapest calibration signal
    available and it needs no human labels. It does not replace Cohen's kappa:
    this measures whether the judge recognises grounding it cannot miss, kappa
    measures whether it agrees with Sean on the cases where it could.
    """
    first = material.split("\n\n")[0]
    if not first.strip():
        return None
    return judge.score("what should I know about this?", material, first).groundedness
