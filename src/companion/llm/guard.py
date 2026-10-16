"""The one place the crisis classifier's backend is chosen.

Local `llama3.1:8b` everywhere the evals run, because the guard is pinned
across every configuration under test (`expose.md` 6.2). The hosted option is
for the Render deploy, which has no local model: see `settings.guard_provider`.
"""

from __future__ import annotations

from companion.config import settings
from companion.llm.ollama import Backend, OllamaBackend


def guard_backend() -> Backend:
    if settings.guard_provider == "ollama":
        return OllamaBackend(settings.guard_model)
    if settings.guard_provider == "ollama-cloud":
        from companion.llm.cloud import OllamaCloudBackend

        return OllamaCloudBackend(settings.guard_model)
    if settings.guard_provider == "groq":
        from companion.llm.cloud import GroqBackend

        return GroqBackend(settings.guard_model)
    raise ValueError(
        f"GUARD_PROVIDER={settings.guard_provider!r}: expected 'ollama', 'ollama-cloud' or 'groq'"
    )
