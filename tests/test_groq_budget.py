"""Groq's daily budget is the bottleneck, so evals spend as little of it as they can."""

from __future__ import annotations

import pathlib
import sys

import httpx
import pytest

sys.path.insert(0, str(pathlib.Path(__file__).resolve().parents[1] / "evals"))

from guard_cache import CachedBackend  # noqa: E402

from companion.llm import cloud  # noqa: E402
from companion.llm.ollama import StubBackend  # noqa: E402


def test_the_same_question_to_the_same_check_is_asked_once(tmp_path) -> None:
    inner = StubBackend(['{"needs_human": false}'])
    cached = CachedBackend(inner, tmp_path / "c.jsonl")
    first = cached.complete("POLICY", "how do I register", json_mode=True)
    again = CachedBackend(StubBackend([]), tmp_path / "c.jsonl").complete(
        "POLICY", "how do I register", json_mode=True
    )
    assert first.text == again.text == '{"needs_human": false}'
    assert len(inner.calls) == 1


def test_a_changed_policy_asks_again(tmp_path) -> None:
    inner = StubBackend(['{"needs_human": false}', '{"needs_human": true}'])
    cached = CachedBackend(inner, tmp_path / "c.jsonl")
    cached.complete("POLICY v1", "I feel numb")
    assert cached.complete("POLICY v2", "I feel numb").text == '{"needs_human": true}'


def test_an_error_is_never_remembered_as_a_verdict(tmp_path) -> None:
    class Failing(StubBackend):
        def complete(self, system, user, *, json_mode=False):
            raise RuntimeError("429")

    cached = CachedBackend(Failing(), tmp_path / "c.jsonl")
    with pytest.raises(RuntimeError):
        cached.complete("POLICY", "I feel numb")
    assert not (tmp_path / "c.jsonl").exists()


def test_a_spent_daily_budget_fails_at_once_without_retrying() -> None:
    calls = []
    body = '{"error":{"message":"Rate limit reached on tokens per day (TPD): Limit 200000"}}'

    def send():
        calls.append(1)
        return httpx.Response(429, text=body, request=httpx.Request("POST", "https://x"))

    with pytest.raises(cloud.DailyQuotaExhausted):
        cloud._request_with_retry(send, label="groq/qwen")
    assert len(calls) == 1
    assert "groq" in cloud.quota_exhausted
    cloud.quota_exhausted.discard("groq")
