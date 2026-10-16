"""Langfuse tracing, self-hosted, and off unless it can only reach this machine.

One trace per turn. Inside it, one observation per graph node, typed the way
Langfuse types them: the input and output guards as `guardrail`, retrieval as
`retriever`, the routing and answering nodes as `chain`, and every model call
inside them as a `generation` with its prompt and its reply. That is the
five-stage turn from `01-thesis/expose.md`, drawn by the tool rather than by us.

**Three rules, each one a way this could hurt someone if broken.**

* **Local, or the one cloud the deploy opted into.** The traces carry the
  eval questions, 75 of them harvested forum posts, and from `/chat` a
  family's own words. `.env` still held cloud keys when this was written. So a
  host that is not localhost disables tracing rather than sending, and says so
  once. Sean decided on 24.09.2026 that Langfuse runs on his machine.
  Amended 25.09.2026: the Render deploy may send to Langfuse Cloud's **EU**
  region, and only when `LANGFUSE_ALLOW_CLOUD=true` is set, which only
  `render.yaml` sets. A laptop with stale cloud keys in `.env` still sends
  nothing, so the eval questions never leave this machine.
* **Never the raw message.** `guard_in` is where PII is redacted. Every
  observation is given `redacted`, never `message`, so a phone number the PII
  guard caught is not re-exposed by the tool meant to inspect it.
* **Never a failed turn.** Tracing is instrumentation. If Langfuse is down,
  missing or misconfigured, the turn runs exactly as it would without it, and
  the unit tests, which configure no keys, never import the SDK at all.
"""

from __future__ import annotations

import contextlib
import functools
import logging
from collections.abc import Callable, Iterator
from typing import Any
from urllib.parse import urlparse

from companion.config import settings

log = logging.getLogger(__name__)

LOCAL_HOSTS = {"localhost", "127.0.0.1", "::1"}
# The EU region only. The US region, and any other host, stays refused.
CLOUD_HOSTS = {"cloud.langfuse.com"}


def allowed(host: str) -> bool:
    return host in LOCAL_HOSTS or (settings.langfuse_allow_cloud and host in CLOUD_HOSTS)


_client: Any = None
_resolved = False


def client() -> Any:
    """The Langfuse client, or None. Resolved once per process."""
    global _client, _resolved
    if _resolved:
        return _client
    _resolved = True
    if not (settings.langfuse_public_key and settings.langfuse_secret_key):
        return None
    host = urlparse(settings.langfuse_url).hostname or ""
    if not allowed(host):
        log.warning(
            "tracing off: LANGFUSE_HOST is %s; traces go to this machine, or to the"
            " EU cloud when LANGFUSE_ALLOW_CLOUD is set",
            settings.langfuse_url,
        )
        return None
    try:
        from langfuse import Langfuse

        _client = Langfuse(
            public_key=settings.langfuse_public_key,
            secret_key=settings.langfuse_secret_key,
            host=settings.langfuse_url,
        )
    except Exception as exc:  # noqa: BLE001 - tracing must never stop a turn
        log.warning("tracing off: %s", exc)
        _client = None
    return _client


def enabled() -> bool:
    return client() is not None


def flush() -> None:
    if enabled():
        with contextlib.suppress(Exception):
            client().flush()


@contextlib.contextmanager
def turn(*, session_id: str | None, tags: list[str], metadata: dict[str, Any]) -> Iterator[Any]:
    """One trace for one turn. Yields the root observation, or None when off."""
    lf = client()
    if lf is None:
        yield None
        return
    from langfuse import propagate_attributes

    with (
        propagate_attributes(
            session_id=session_id,
            tags=tags,
            metadata={k: str(v) for k, v in metadata.items()},
            trace_name="turn",
        ),
        lf.start_as_current_observation(name="turn", as_type="agent") as root,
    ):
        yield root


def set_turn_io(root: Any, *, input: Any, output: Any) -> None:  # noqa: A002 - Langfuse's names
    """What the family said, redacted, and what they were sent. On the root
    observation, because trace-level input and output are deprecated in v4."""
    if root is not None:
        with contextlib.suppress(Exception):
            root.update(input=input, output=output)


def _verdicts(values: list[Any]) -> list[dict[str, str]]:
    return [
        {"guard": v.guard.value, "action": v.action.value, "reason": v.reason}
        for v in values
        if hasattr(v, "guard")
    ]


def summarise(update: dict[str, Any]) -> dict[str, Any]:
    """What a node changed, in a form a person reads. Never `message`."""
    out: dict[str, Any] = {}
    for key, value in update.items():
        if key == "message":
            continue
        if key == "verdicts":
            out[key] = _verdicts(value)
        elif key == "chunks":
            out[key] = [c.id for c in value]
        elif key == "trace":
            out["action"] = value.get("action")
            if value.get("handover"):
                out["handover"] = value["handover"]
        else:
            out[key] = value
    return out


def node(name: str, as_type: str, fn: Callable[[Any], Any]) -> Any:
    """Wrap one graph node in an observation. Identity when tracing is off."""

    @functools.wraps(fn)
    def wrapped(state: Any) -> Any:
        lf = client()
        if lf is None:
            return fn(state)
        with lf.start_as_current_observation(
            name=name, as_type=as_type, input={"redacted": state.get("redacted")}
        ) as obs:
            result = fn(state)
            with contextlib.suppress(Exception):
                obs.update(output=summarise(result or {}))
            return result

    return wrapped


def _usage_details(completion: Any) -> dict[str, Any]:
    """Token counts in the shape Langfuse v4 wants, or nothing at all.

    Without this, every model in the Langfuse dashboard showed 0 tokens and
    $0.00: the generation carried a model name, a prompt and a reply, and the
    one field that makes a cost panel mean anything was never sent.

    Four providers report usage under three different keys, so the reading is
    delegated to `usage_of`, which already knows all of them. Imported inside
    the function: tracing is instrumentation and must not pull the backends in
    at import time.

    **An absent count is omitted rather than sent as zero.** A zero is a
    measurement saying the call used no tokens, which is never true, and it is
    indistinguishable in the dashboard from a provider that does not report.
    """
    try:
        from companion.llm.cloud import usage_of

        usage = usage_of(completion)
    except Exception:  # noqa: BLE001 - tracing must never stop a turn
        return {}
    prompt = usage.get("prompt_tokens") or 0
    output = usage.get("completion_tokens") or 0
    if not (prompt or output):
        return {}
    return {"usage_details": {"input": prompt, "output": output, "total": prompt + output}}


class TracedBackend:
    """A backend whose every call is a Langfuse generation.

    Same `complete` contract as every other backend, so the graph cannot tell
    the difference. Wrapping happens only when tracing is on.
    """

    def __init__(self, inner: Any, role: str):
        self.inner = inner
        self.name = inner.name
        self.role = role

    def complete(self, system: str, user: str, *, json_mode: bool = False) -> Any:
        lf = client()
        with lf.start_as_current_observation(
            name=self.role,
            as_type="generation",
            model=self.name,
            input=[{"role": "system", "content": system}, {"role": "user", "content": user}],
        ) as gen:
            completion = self.inner.complete(system, user, json_mode=json_mode)
            with contextlib.suppress(Exception):
                gen.update(
                    output=completion.text,
                    metadata={"latency_ms": completion.latency_ms},
                    **_usage_details(completion),
                )
            return completion


def traced(backend: Any, role: str) -> Any:
    """`backend`, wrapped when tracing is on and returned as is when it is not."""
    return TracedBackend(backend, role) if backend is not None and enabled() else backend
