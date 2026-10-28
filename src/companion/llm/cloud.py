"""The hosted backends, behind the same `Backend` seam as the local one.

Tier 2 and tier 3 of the comparison `docs/requirements.md` specifies. Both
implement exactly `complete(system, user, json_mode) -> Completion`, because
The thesis design §6.2 requires the three configurations to differ in the
generation stage and in nothing else. A backend that returned a different shape
would make the difference partly about the plumbing.

**Neither is constructed unless its key is set.** `run_generation.py` refuses a
tier with no key rather than falling back to the local model, which would
publish a hosted number that `llama3.1:8b` produced.

**Cost is read from the response, never estimated.** A guessed cost per turn in
a table next to measured latency is a number that looks measured and is not.
Where a provider reports token counts, `Completion.raw` carries them and the
runner converts; where it does not, cost stays null.
"""

from __future__ import annotations

import json
import os
import pathlib
import time
from typing import Any

import httpx

from companion.config import settings
from companion.llm.ollama import Completion

RETRYABLE = {429, 500, 502, 503, 504}
"""Statuses worth trying again.

429 is quota and 503 is capacity, and a free tier meets both. Measured
23.09.2026: `gemini-3.5-flash` answered a 503 "experiencing high demand" on a
first call. An overnight comparison makes roughly 300 calls per tier, so
treating a transient failure as fatal means a two hour run ending at case 12
with nothing written.

4xx other than 429 is not retried. A wrong model name or a dead key fails the
same way five times and only wastes the backoff.
"""


class DailyQuotaExhausted(RuntimeError):
    """A provider's daily budget is spent. Retrying cannot help until it refills.

    30.09.2026: Groq answered "tokens per day (TPD): Limit 200000, Used 199754"
    and every call still waited 4 + 8 + 16 seconds before failing, then was
    counted as a handover. Raised at once instead, and `quota_exhausted` stays
    set so an eval runner can stop cleanly rather than score a run of errors.
    """


quota_exhausted: set[str] = set()
"""Providers whose daily budget ran out in this process."""


def _is_daily_limit(response: httpx.Response) -> bool:
    if response.status_code != 429:
        return False
    try:
        body = response.text.lower()
    except Exception:  # noqa: BLE001
        return False
    return "per day" in body or "tpd" in body or "rpd" in body


def _request_with_retry(send, *, label: str) -> httpx.Response:
    """Send, backing off on quota and capacity. Raises the last error.

    Exponential with a fixed base, no jitter: one process makes these calls in
    sequence, so there is no thundering herd to spread out, and a predictable
    schedule is easier to read in a log at 3am.
    """
    last: Exception | None = None
    for attempt in range(settings.hosted_max_retries):
        try:
            response = send()
        except (httpx.TimeoutException, httpx.TransportError) as exc:
            last = exc
        else:
            if response.status_code not in RETRYABLE:
                response.raise_for_status()
                return response
            if _is_daily_limit(response):
                quota_exhausted.add(label.split("/", 1)[0])
                raise DailyQuotaExhausted(f"{label}: daily limit reached. {response.text[:160]}")
            last = httpx.HTTPStatusError(
                f"{label}: HTTP {response.status_code}",
                request=response.request,
                response=response,
            )
        wait = settings.hosted_backoff_seconds * (2**attempt)
        print(f"    {label}: retry {attempt + 1}/{settings.hosted_max_retries} in {wait:.0f}s")
        time.sleep(wait)
    raise last if last else RuntimeError(f"{label}: exhausted retries")


_last_call: dict[str, float] = {}


def _pace(key: str) -> None:
    """Keep a minimum gap between calls to one provider.

    Pacing beats retrying: a 429 costs the backoff *and* the call that earned
    it, so staying under the limit is cheaper than recovering from crossing it.
    """
    gap = settings.hosted_min_interval_seconds
    if gap <= 0:
        return
    elapsed = time.monotonic() - _last_call.get(key, 0.0)
    if elapsed < gap:
        time.sleep(gap - elapsed)
    _last_call[key] = time.monotonic()


class OllamaCloudBackend:
    """Tier 2. Ollama's hosted models, same API as the local daemon.

    The wire format is identical to `OllamaBackend`, so this is that class with
    a different host and an Authorization header. Keeping them separate anyway:
    one is free and local and one bills per token, and a single class with an
    optional key is one typo away from sending an eval to a paid endpoint.
    """

    def __init__(self, model: str | None = None, api_key: str | None = None):
        self.model = model or settings.ollama_cloud_model
        self.name = f"ollama-cloud/{self.model}"
        self._host = settings.ollama_cloud_host.rstrip("/")
        self._key = api_key or settings.ollama_cloud_api_key
        if not self._key:
            raise ValueError("OLLAMA_CLOUD_API_KEY is not set. Put it in .env; see .env.example.")

    def complete(self, system: str, user: str, *, json_mode: bool = False) -> Completion:
        body: dict[str, Any] = {
            "model": self.model,
            "stream": False,
            "options": {"temperature": 0},
            "messages": [
                {"role": "system", "content": system},
                {"role": "user", "content": user},
            ],
        }
        if json_mode:
            body["format"] = "json"
        _pace("ollama-cloud")
        started = time.perf_counter()
        response = _request_with_retry(
            lambda: httpx.post(
                f"{self._host}/api/chat",
                json=body,
                headers={"Authorization": f"Bearer {self._key}"},
                timeout=180.0,
            ),
            label=self.name,
        )
        raw = response.json()
        return Completion(
            text=raw.get("message", {}).get("content", ""),
            model=self.name,
            latency_ms=int((time.perf_counter() - started) * 1000),
            raw=raw,
        )


class GeminiBackend:
    """Tier 3. Google Gemini over the REST API, no SDK.

    One HTTP call and one response shape, the same reason `OllamaBackend` has
    no SDK: an SDK here would add a version to pin and nothing else.

    Gemini's `systemInstruction` is a separate field rather than a message with
    a role, so the system prompt does not become a user turn. That matters more
    than it sounds: the guard prompts are instructions and a model that reads
    them as user text is a different configuration.
    """

    def __init__(self, model: str | None = None, api_key: str | None = None):
        self.model = model or settings.gemini_model
        self.name = f"gemini/{self.model}"
        self._host = settings.gemini_host.rstrip("/")
        self._key = api_key or settings.gemini_api_key
        if not self._key:
            raise ValueError("GEMINI_API_KEY is not set. Put it in .env; see .env.example.")

    def complete(self, system: str, user: str, *, json_mode: bool = False) -> Completion:
        body: dict[str, Any] = {
            "systemInstruction": {"parts": [{"text": system}]},
            "contents": [{"role": "user", "parts": [{"text": user}]}],
            # Temperature 0 everywhere, for the reason in OllamaBackend: it
            # removes one source of variance, which is all it claims to do.
            "generationConfig": {"temperature": 0},
        }
        if json_mode:
            body["generationConfig"]["responseMimeType"] = "application/json"
        _pace("gemini")
        started = time.perf_counter()
        url = f"{self._host}/{settings.gemini_api_version}/models/{self.model}:generateContent"
        response = _request_with_retry(
            lambda: httpx.post(
                url,
                json=body,
                headers={"x-goog-api-key": self._key, "Content-Type": "application/json"},
                timeout=180.0,
            ),
            label=self.name,
        )
        raw = response.json()
        try:
            text = raw["candidates"][0]["content"]["parts"][0]["text"]
        except (KeyError, IndexError):
            # A blocked or empty candidate is a real outcome, not a crash. The
            # eval counts it as an unparsed turn and says so.
            text = ""
        return Completion(
            text=text,
            model=self.name,
            latency_ms=int((time.perf_counter() - started) * 1000),
            raw=raw,
        )


def usage_of(completion: Completion) -> dict[str, int]:
    """Token counts, where the provider reports them. Empty where it does not."""
    raw = completion.raw
    meta = raw.get("usageMetadata") or {}
    if meta:
        return {
            "prompt_tokens": int(meta.get("promptTokenCount", 0)),
            "completion_tokens": int(meta.get("candidatesTokenCount", 0)),
        }
    usage = raw.get("usage") or {}
    if usage:
        return {
            "prompt_tokens": int(usage.get("prompt_tokens", 0)),
            "completion_tokens": int(usage.get("completion_tokens", 0)),
        }
    if "prompt_eval_count" in raw or "eval_count" in raw:
        return {
            "prompt_tokens": int(raw.get("prompt_eval_count", 0)),
            "completion_tokens": int(raw.get("eval_count", 0)),
        }
    return {}


USAGE_LOG = pathlib.Path(__file__).resolve().parents[3] / "private" / "usage" / "hosted.jsonl"
"""Every hosted call's token count, on this machine, so a run can see the
day's spend before it starts (`evals/budget.py`). Tokens only, never text."""


def _record_usage(model: str, usage: dict[str, Any] | None) -> None:
    if not usage or os.environ.get("PYTEST_CURRENT_TEST"):
        return
    try:
        USAGE_LOG.parent.mkdir(parents=True, exist_ok=True)
        with USAGE_LOG.open("a", encoding="utf-8") as fh:
            fh.write(
                json.dumps(
                    {
                        "at": time.time(),
                        "model": model,
                        "tokens": int(usage.get("total_tokens") or 0),
                    }
                )
                + "\n"
            )
    except OSError:
        pass  # accounting must never cost a turn


class OpenAICompatBackend:
    """Any provider that speaks OpenAI's `/v1/chat/completions`.

    Mistral and DeepSeek both do, and writing the same forty lines twice is how
    two backends drift apart and a difference between tiers turns out to be a
    difference between their HTTP clients. Subclasses supply four things and
    nothing else.
    """

    prefix: str = "openai-compat"
    timeout: float = 180.0

    def __init__(self, model: str | None = None, api_key: str | None = None):
        self.model = model or self._default_model()
        self.name = f"{self.prefix}/{self.model}"
        self._host = self._host_url().rstrip("/")
        self._key = api_key or self._default_key()
        if not self._key:
            raise ValueError(
                f"{self.prefix.upper().replace('-', '_')}_API_KEY is not set. "
                "Put it in .env; see .env.example."
            )

    def _default_model(self) -> str:  # pragma: no cover - overridden
        raise NotImplementedError

    def _default_key(self) -> str:  # pragma: no cover - overridden
        raise NotImplementedError

    def _host_url(self) -> str:  # pragma: no cover - overridden
        raise NotImplementedError

    def complete(self, system: str, user: str, *, json_mode: bool = False) -> Completion:
        body: dict[str, Any] = {
            "model": self.model,
            "temperature": 0,
            "messages": [
                {"role": "system", "content": system},
                {"role": "user", "content": user},
            ],
        }
        if json_mode:
            body["response_format"] = {"type": "json_object"}
        _pace(self.prefix)
        started = time.perf_counter()
        response = _request_with_retry(
            lambda: httpx.post(
                f"{self._host}/v1/chat/completions",
                json=body,
                headers={
                    "Authorization": f"Bearer {self._key}",
                    "Content-Type": "application/json",
                },
                timeout=self.timeout,
            ),
            label=self.name,
        )
        raw = response.json()
        _record_usage(self.name, raw.get("usage"))
        try:
            text = raw["choices"][0]["message"]["content"]
        except (KeyError, IndexError):
            # A filtered or empty choice is an outcome the eval should count,
            # not an exception that ends a ten hour run.
            text = ""
        return Completion(
            text=text,
            model=self.name,
            latency_ms=int((time.perf_counter() - started) * 1000),
            raw=raw,
        )


class MistralBackend(OpenAICompatBackend):
    """Tier 5. The only vendor in the ladder that is neither local nor Ollama
    Cloud, which is why it earns a place despite being the slowest.

    Measured 24.09.2026 on a free key: about **150 seconds per call whatever
    the model**, which is an account-level throttle rather than model latency,
    and only `ministral-14b-latest` is permitted. `mistral-medium`,
    `magistral-medium`, `mistral-small` and `magistral-small` all return 429.
    One full turn is ~306 seconds, so 115 cases is roughly ten hours and this
    tier is resumed across nights.
    """

    prefix = "mistral"
    # Longer than the others: the free tier's own queue is ~150s, so a 180s
    # ceiling would time out on a request that was going to succeed.
    timeout = 300.0

    def _default_model(self) -> str:
        return settings.mistral_model

    def _default_key(self) -> str:
        return settings.mistral_api_key

    def _host_url(self) -> str:
        return settings.mistral_host


class DeepSeekBackend(OpenAICompatBackend):
    """Tier 6. A genuine frontier model, and the cheapest way to get one here.

    **Not free.** Checked 24.09.2026 on this key: `granted_balance` 0.00,
    `is_available` false, and both models return 402 Insufficient Balance. The
    5-million-token signup grant that the documentation describes did not land
    on this account.

    It is wired anyway because the cost is small enough to be noise: a full
    115-case run is roughly 450k tokens, which at V4-Pro's published rates is
    about twenty cents. A two dollar top-up covers the whole capstone.
    """

    prefix = "deepseek"

    def _default_model(self) -> str:
        return settings.deepseek_model

    def _default_key(self) -> str:
        return settings.deepseek_api_key

    def _host_url(self) -> str:
        return settings.deepseek_host


class GroqBackend(OpenAICompatBackend):
    """Groq, for the crisis classifier on the Render deploy only.

    Added 25.09.2026. Groq retired `llama3.1:8b` from free accounts on
    16.08.2026, and Cloudflare retired it on 30.05, so the pinned eval guard
    has no free hosted twin; whatever runs here is a different guard and is
    measured as one. Measured on first contact: 0.2 to 0.4 seconds a call,
    against about 18 for `gpt-oss:20b` on Ollama Cloud, which matters for a
    check that runs before every answer. Free tier: 1,000 requests a day.
    """

    prefix = "groq"
    timeout = 60.0

    def _default_model(self) -> str:
        return settings.groq_model

    def _default_key(self) -> str:
        return settings.groq_api_key

    def _host_url(self) -> str:
        return settings.groq_host
