"""One HTTP client for the local model. No SDK, no framework.

The thesis fixes the swap seam: three configurations "varying only the
generation stage", with guardrails, retrieval and corpus identical across all
three, "so any measured difference is attributable to the generation stage
alone". That is only true if every backend sits behind one interface, which is
what `Backend` is. The thesis design section 6.2.

Ollama's HTTP API is small enough that a dependency would add a version to pin
and nothing else. `httpx` is already a FastAPI dependency.
"""

from __future__ import annotations

import json
import time
from typing import Any, Protocol

import httpx

from companion.config import settings


class Completion:
    """A model reply plus what it cost, so a turn can be logged honestly."""

    def __init__(self, text: str, model: str, latency_ms: int, raw: dict[str, Any]):
        self.text = text
        self.model = model
        self.latency_ms = latency_ms
        self.raw = raw

    def as_json(self) -> dict[str, Any]:
        """Parse the reply as JSON. Raises if the model did not return JSON.

        Callers pass `json_mode=True` and still have to handle failure: a local
        model asked for JSON returns JSON most of the time, not always.

        **Markdown fences are stripped first.** Measured 24.09.2026:
        `gemma4:31b` returns ```json ... ``` even when the request sets
        `format: json`, while every other backend returns bare JSON. Counting
        that as a parse failure would score a model on its packaging rather
        than its answer, and the comparison is supposed to vary the generation
        stage rather than the tolerance of the parser.

        The normalisation is applied to every backend equally, and it is a
        no-op for the ones that already comply.
        """
        text = self.text.strip()
        if text.startswith("```"):
            text = text.split("\n", 1)[-1] if "\n" in text else text
            text = text.rsplit("```", 1)[0]
        return dict(json.loads(text.strip()))


class Backend(Protocol):
    """The seam. Every configuration under test implements exactly this."""

    name: str

    def complete(self, system: str, user: str, *, json_mode: bool = False) -> Completion: ...


class OllamaBackend:
    """The locally hosted open-weights configuration."""

    def __init__(self, model: str | None = None, host: str = "http://localhost:11434"):
        self.model = model or settings.llm_model
        self.name = f"ollama/{self.model}"
        self._host = host

    def complete(self, system: str, user: str, *, json_mode: bool = False) -> Completion:
        body: dict[str, Any] = {
            "model": self.model,
            "stream": False,
            # Temperature 0 for every call. Not determinism: the studienarbeit
            # measured a judge returning two verdicts on one item at
            # temperature 0 in a single run. It removes one source of variance,
            # which is all it claims to do.
            "options": {"temperature": 0},
            "messages": [
                {"role": "system", "content": system},
                {"role": "user", "content": user},
            ],
        }
        if json_mode:
            body["format"] = "json"

        started = time.perf_counter()
        response = httpx.post(f"{self._host}/api/chat", json=body, timeout=180.0)
        response.raise_for_status()
        payload = response.json()
        latency_ms = int((time.perf_counter() - started) * 1000)
        return Completion(
            text=payload["message"]["content"].strip(),
            model=self.model,
            latency_ms=latency_ms,
            raw=payload,
        )


class StubBackend:
    """Deterministic backend for tests. Returns whatever it was given.

    Every guard that calls a model takes its backend as an argument so the
    tests never reach the network. A test suite that needs Ollama running is a
    test suite that goes red on a train.
    """

    def __init__(self, replies: list[str] | None = None, name: str = "stub"):
        self.name = name
        self._replies = list(replies or [])
        self.calls: list[tuple[str, str]] = []

    def complete(self, system: str, user: str, *, json_mode: bool = False) -> Completion:
        self.calls.append((system, user))
        text = self._replies.pop(0) if self._replies else "{}"
        return Completion(text=text, model=self.name, latency_ms=0, raw={})
