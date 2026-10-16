"""The hosted tiers must not be able to run as the local model.

A tier with a missing key that quietly fell back to `llama3.1:8b` would publish
a hosted number produced locally, and nothing downstream could tell: the row
would say `tier-2`, the latency would look plausible, and the deck would carry
it. So the refusal is asserted rather than assumed.
"""

from __future__ import annotations

import pytest

from companion.llm.cloud import (
    GeminiBackend,
    MistralBackend,
    OllamaCloudBackend,
    usage_of,
)
from companion.llm.ollama import Completion


@pytest.mark.parametrize("cls", [OllamaCloudBackend, GeminiBackend, MistralBackend])
def test_no_key_raises_rather_than_falling_back(cls, monkeypatch) -> None:
    from companion.config import settings

    monkeypatch.setattr(settings, "ollama_cloud_api_key", "")
    monkeypatch.setattr(settings, "gemini_api_key", "")
    monkeypatch.setattr(settings, "mistral_api_key", "")
    with pytest.raises(ValueError, match="not set"):
        cls()


@pytest.mark.parametrize(
    "cls,expected",
    [
        (OllamaCloudBackend, "ollama-cloud/"),
        (GeminiBackend, "gemini/"),
        (MistralBackend, "mistral/"),
    ],
)
def test_the_name_says_which_service_produced_the_answer(cls, expected, monkeypatch) -> None:
    """`generation_backend` lands in every history row, so the prefix is how a
    reader tells a hosted number from a local one."""
    from companion.config import settings

    monkeypatch.setattr(settings, "ollama_cloud_api_key", "k")
    monkeypatch.setattr(settings, "gemini_api_key", "k")
    monkeypatch.setattr(settings, "mistral_api_key", "k")
    assert cls().name.startswith(expected)


def test_the_tier_map_refuses_a_missing_key(monkeypatch) -> None:
    import pathlib
    import sys

    sys.path.insert(0, str(pathlib.Path(__file__).resolve().parents[1] / "evals"))
    from run_generation import backend_for

    from companion.config import settings

    # Tiers 2 to 4 are all Ollama Cloud since 24.09.2026, so one missing key
    # takes out three tiers, and each must still refuse rather than fall back.
    monkeypatch.setattr(settings, "ollama_cloud_api_key", "")
    for tier in (2, 3, 4):
        with pytest.raises(ValueError):
            backend_for(tier, None)


def test_usage_is_read_not_estimated() -> None:
    """Token counts come from the provider or not at all. An estimated cost
    beside a measured latency reads as measured."""
    gemini = Completion("x", "gemini/g", 1, {"usageMetadata": {"promptTokenCount": 10}})
    assert usage_of(gemini)["prompt_tokens"] == 10

    ollama = Completion("x", "ollama-cloud/m", 1, {"prompt_eval_count": 7, "eval_count": 3})
    assert usage_of(ollama) == {"prompt_tokens": 7, "completion_tokens": 3}

    assert usage_of(Completion("x", "m", 1, {})) == {}


def test_a_blocked_gemini_candidate_is_an_empty_answer_not_a_crash(monkeypatch) -> None:
    """Safety filters return a candidate with no parts. That is a real outcome
    the eval should count, not an exception that ends a two hour run."""
    from companion.config import settings

    monkeypatch.setattr(settings, "gemini_api_key", "k")
    backend = GeminiBackend()

    class FakeResponse:
        status_code = 200

        def raise_for_status(self) -> None:
            return None

        def json(self) -> dict:
            return {"candidates": [{"finishReason": "SAFETY"}]}

    monkeypatch.setattr("httpx.post", lambda *a, **k: FakeResponse())
    assert backend.complete("s", "u").text == ""


def test_markdown_fences_do_not_count_as_a_parse_failure() -> None:
    """`gemma4:31b` returns ```json ... ``` even when the request sets
    `format: json`, and every other backend returns bare JSON. Scoring that as
    a failure would rank a model on its packaging rather than its answer, in a
    comparison whose whole point is to vary the generation stage alone."""
    fenced = Completion('```json\n{"answer":"hi","confidence":0.8}\n```', "m", 1, {})
    assert fenced.as_json()["confidence"] == 0.8
    assert Completion('```\n{"a":1}\n```', "m", 1, {}).as_json() == {"a": 1}


def test_the_normalisation_is_a_no_op_for_compliant_models() -> None:
    """Applied to every backend equally, so it must not change the ones that
    already comply."""
    assert Completion('{"a":1}', "m", 1, {}).as_json() == {"a": 1}
    assert Completion('  {"a": 1}  ', "m", 1, {}).as_json() == {"a": 1}


def test_prose_is_still_a_parse_failure() -> None:
    """Stripping fences must not become tolerating anything."""
    import json

    with pytest.raises(json.JSONDecodeError):
        Completion("Here is your answer, friend.", "m", 1, {}).as_json()


def test_every_tier_maps_to_a_distinct_model(monkeypatch) -> None:
    """Four tiers on one provider is a real risk of two tiers silently being
    the same model, which would report a difference that is only noise."""
    import pathlib
    import sys

    sys.path.insert(0, str(pathlib.Path(__file__).resolve().parents[1] / "evals"))
    from run_generation import TIERS, backend_for

    from companion.config import settings

    monkeypatch.setattr(settings, "ollama_cloud_api_key", "k")
    monkeypatch.setattr(settings, "mistral_api_key", "k")
    # A key-free checkout (CI, the published repository) has no .env.
    monkeypatch.setattr(settings, "deepseek_api_key", "k")
    monkeypatch.setattr(settings, "gemini_api_key", "k")
    monkeypatch.setattr(settings, "groq_api_key", "k")
    names = [backend_for(t, None).name for t in TIERS]
    assert len(set(names)) == len(names), f"two tiers share a model: {names}"


def test_exactly_three_configurations_are_marked_for_the_thesis() -> None:
    """`01-thesis/expose.md` §6.2 fixes three configurations varying only the
    generation stage. Four tiers are built; the count must not drift."""
    import pathlib
    import sys

    sys.path.insert(0, str(pathlib.Path(__file__).resolve().parents[1] / "evals"))
    from run_generation import TIERS

    in_thesis = [t for t, (_, flag) in TIERS.items() if flag]
    assert len(in_thesis) == 2, (
        f"tiers in the thesis analysis: {in_thesis}. With baseline 0 that makes three. "
        "Changing this changes what the pre-registration describes."
    )


def test_mistral_usage_is_read_from_the_openai_shape() -> None:
    """Three providers, three usage shapes. A cost table built on one of them
    silently reports null for the other two."""
    m = Completion("x", "mistral/m", 1, {"usage": {"prompt_tokens": 40, "completion_tokens": 9}})
    assert usage_of(m) == {"prompt_tokens": 40, "completion_tokens": 9}


def test_more_than_one_vendor_is_represented() -> None:
    """Tiers 2 to 4 share a provider, so a provider-wide latency or outage
    effect is not separable from a model effect. Tier 5 is the control, and
    losing it silently would leave the comparison single-vendor without
    anything saying so."""
    import pathlib
    import sys

    sys.path.insert(0, str(pathlib.Path(__file__).resolve().parents[1] / "evals"))
    from run_generation import TIERS

    assert 5 in TIERS, "the only non-Ollama hosted tier was removed"


def test_groq_is_a_guard_provider(monkeypatch) -> None:
    from companion.config import settings
    from companion.llm.guard import guard_backend

    monkeypatch.setattr(settings, "guard_provider", "groq")
    monkeypatch.setattr(settings, "guard_model", "qwen/qwen3.8-27b")
    monkeypatch.setattr(settings, "groq_api_key", "gsk-test")
    assert guard_backend().name == "groq/qwen/qwen3.8-27b"
