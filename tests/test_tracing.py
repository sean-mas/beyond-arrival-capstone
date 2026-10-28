"""Langfuse tracing: local only, never the raw message, never a failed turn."""

from __future__ import annotations

import pytest

from companion.config import settings
from companion.guardrails.types import Action, GuardName, Verdict
from companion.obs import tracing


@pytest.fixture(autouse=True)
def fresh(monkeypatch: pytest.MonkeyPatch):
    monkeypatch.setattr(tracing, "_resolved", False)
    monkeypatch.setattr(tracing, "_client", None)
    yield
    tracing._resolved, tracing._client = False, None


def keys(monkeypatch: pytest.MonkeyPatch, host: str) -> None:
    monkeypatch.setattr(settings, "langfuse_public_key", "pk-lf-test")
    monkeypatch.setattr(settings, "langfuse_secret_key", "sk-lf-test")
    monkeypatch.setattr(settings, "langfuse_host", host)
    monkeypatch.setattr(settings, "langfuse_base_url", "")


@pytest.mark.parametrize(
    "host", ["https://cloud.langfuse.com", "https://us.cloud.langfuse.com", "http://10.0.0.5:3000"]
)
def test_a_host_off_this_machine_turns_tracing_off(monkeypatch, host: str) -> None:
    """Sean's decision, 24.09.2026: traces stay on his machine. .env still held
    cloud keys that day, so a remote host must switch tracing off, not send."""
    keys(monkeypatch, host)
    assert tracing.client() is None


def test_the_eu_cloud_needs_the_deploy_to_opt_in(monkeypatch) -> None:
    """25.09.2026: live traces may go to Langfuse Cloud EU, and only when the
    deploy says so. Stale cloud keys on the laptop must still send nothing."""
    keys(monkeypatch, "https://cloud.langfuse.com")
    monkeypatch.setattr(settings, "langfuse_allow_cloud", False)
    assert not tracing.allowed("cloud.langfuse.com")
    monkeypatch.setattr(settings, "langfuse_allow_cloud", True)
    assert tracing.allowed("cloud.langfuse.com")


@pytest.mark.parametrize("host", ["us.cloud.langfuse.com", "10.0.0.5", "evil.example"])
def test_opting_in_opens_the_eu_cloud_and_nothing_else(monkeypatch, host: str) -> None:
    monkeypatch.setattr(settings, "langfuse_allow_cloud", True)
    assert not tracing.allowed(host)


def test_no_keys_means_no_tracing(monkeypatch) -> None:
    monkeypatch.setattr(settings, "langfuse_public_key", "")
    assert not tracing.enabled()


def test_off_means_the_graph_runs_untouched(monkeypatch) -> None:
    monkeypatch.setattr(settings, "langfuse_public_key", "")

    def node(state: dict) -> dict:
        return {"answer": state["redacted"]}

    assert tracing.node("n", "span", node)({"redacted": "x"}) == {"answer": "x"}
    backend = object()
    assert tracing.traced(backend, "llm call") is backend


def test_a_summary_never_carries_the_raw_message() -> None:
    """guard_in redacts. The tool that inspects a turn must not undo that."""
    update = {
        "message": "call me on +49 176 2233445",
        "redacted": "call me on [PHONE_REDACTED]",
        "verdicts": [Verdict(guard=GuardName.PII, action=Action.CONTINUE, reason="phone")],
    }
    out = tracing.summarise(update)
    assert "message" not in out
    assert "2233445" not in str(out)
    assert out["verdicts"] == [{"guard": "pii", "action": "continue", "reason": "phone"}]


def test_base_url_wins_over_an_older_host(monkeypatch) -> None:
    """Langfuse's own snippet says LANGFUSE_BASE_URL. Pasted below a cloud
    LANGFUSE_HOST, the local one must be the one used, and a cloud BASE_URL
    must still be refused."""
    keys(monkeypatch, "https://cloud.langfuse.com")
    monkeypatch.setattr(settings, "langfuse_base_url", "http://localhost:3100")
    assert settings.langfuse_url == "http://localhost:3100"
    monkeypatch.setattr(settings, "langfuse_base_url", "https://cloud.langfuse.com")
    assert tracing.client() is None


def test_a_generation_carries_its_token_counts():
    """Every model in the Langfuse dashboard showed 0 tokens and $0.00 on
    25.09.2026. The generation had a model, a prompt and a reply, and never the
    one field that makes a cost panel mean anything."""
    from companion.llm.ollama import Completion
    from companion.obs.tracing import _usage_details

    local = Completion("x", "m", 1, {"prompt_eval_count": 812, "eval_count": 96})
    assert _usage_details(local) == {"usage_details": {"input": 812, "output": 96, "total": 908}}


@pytest.mark.parametrize(
    "raw,expected_input",
    [
        ({"prompt_eval_count": 10, "eval_count": 2}, 10),  # ollama, local and cloud
        ({"usage": {"prompt_tokens": 7, "completion_tokens": 1}}, 7),  # mistral, groq, deepseek
        ({"usageMetadata": {"promptTokenCount": 5, "candidatesTokenCount": 1}}, 5),  # gemini
    ],
)
def test_every_provider_shape_is_read(raw, expected_input):
    """Four providers, three keys. A dashboard built on one of them reports
    zero for the others, which reads as 'this model is free'."""
    from companion.llm.ollama import Completion
    from companion.obs.tracing import _usage_details

    assert _usage_details(Completion("x", "m", 1, raw))["usage_details"]["input"] == expected_input


@pytest.mark.parametrize("raw", [{}, {"usage": {"prompt_tokens": 0, "completion_tokens": 0}}])
def test_an_absent_count_is_omitted_rather_than_sent_as_zero(raw):
    """A zero says the call used no tokens, which is never true, and in the
    dashboard it is indistinguishable from a provider that does not report."""
    from companion.llm.ollama import Completion
    from companion.obs.tracing import _usage_details

    assert _usage_details(Completion("x", "m", 1, raw)) == {}


def test_usage_extraction_never_raises():
    """Tracing is instrumentation. A malformed usage block must not end a turn
    that was otherwise answered correctly."""
    from companion.obs.tracing import _usage_details

    class Broken:
        raw = property(lambda self: (_ for _ in ()).throw(RuntimeError("boom")))

    assert _usage_details(Broken()) == {}
