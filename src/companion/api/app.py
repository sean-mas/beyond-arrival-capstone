"""One FastAPI process. Everything lives in it.

    /chat               the companion: onboarding, journey map, checklist, chat
    /static/*           its scripts, styles and icon
    /manifest.webmanifest  so a phone can add it to the home screen
    /api/chat           one turn through the graph, as JSON
    /healthz            liveness
    /telegram/webhook   iteration 2, parked in docs/scope.md
    APScheduler         iteration 2, parked

No separate frontend deploy, no CORS, no second pipeline, and no build step:
plain modules the browser loads as they are. Redesigned 28.09.2026 from one
demo page into the family-facing companion, `design/brand-and-ui-plan.md`.

**The demo runs tier 2 by default, tier 1 as the fallback.** Tier 2
(`gpt-oss:120b`, hosted) scored best of the finished tiers; tier 1 is the local
model, for a presentation room without working Wi-Fi. The guard backend is the
same pinned local model in both, exactly as in the evals, so what the demo
shows about safety is what the evals measured. **Except on the Render
deploy**, which has no local model: there the crisis check is qwen3.8-27b on
Groq, a weaker guard measured separately (docs/decisions.md, 25.09.2026).
"""

from __future__ import annotations

import collections
import functools
import hmac
import logging
import pathlib
import threading
import time
import uuid
from typing import Any, Literal

from fastapi import FastAPI, Header, HTTPException, Request
from fastapi.responses import HTMLResponse, JSONResponse, RedirectResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel, Field
from starlette.middleware.gzip import GZipMiddleware

from companion import __version__
from companion.config import settings
from companion.obs import tracing

app = FastAPI(title="Beyond Arrival companion", version=__version__)
log = logging.getLogger("companion.api")

STATIC = pathlib.Path(__file__).resolve().parent / "static"
app.mount("/static", StaticFiles(directory=STATIC), name="static")
# The free server is small: scripts and pages go compressed (the intro bundle is
# 640 KB raw, 170 KB gzipped).
app.add_middleware(GZipMiddleware, minimum_size=1024)


@app.middleware("http")
async def revalidate_static(request: Request, call_next: Any) -> Any:
    """Make the browser ask before reusing a cached script or page.

    The page is plain modules that import each other. Found 28.09.2026: after a
    change, a cached `data.js` next to a new `app.js` is an import error, and an
    import error is a blank page. `no-cache` means revalidate, not re-download:
    an unchanged file costs a 304.
    """
    response = await call_next(request)
    if request.url.path.startswith("/static/") or request.url.path in ("/chat", "/"):
        response.headers["Cache-Control"] = "no-cache"
    return response


def _cards_dir() -> pathlib.Path:
    """The repo's corpus when running from a checkout, `./content/cards` in the
    image, where the package is installed into site-packages and the repo path
    above it does not exist."""
    repo = pathlib.Path(__file__).resolve().parents[3] / "content" / "cards"
    return repo if repo.is_dir() else pathlib.Path.cwd() / "content" / "cards"


Tier = Literal["tier2", "tier1"]


class ChatIn(BaseModel):
    message: str = Field(min_length=1, max_length=2000)
    model: Tier = "tier2"
    session_id: str | None = None


@app.get("/healthz")
def healthz() -> dict[str, str]:
    """Liveness. The deploy platform polls this, and so does the CI smoke test."""
    return {"status": "ok", "version": __version__}


TIER_LABELS = {
    "tier2": "tier 2 · gpt-oss:120b (hosted)",
    "tier1": "tier 1 · llama3.1:8b (local, offline)",
}


def _available_tiers() -> list[str]:
    """Tier 1 needs the local Ollama, which only the laptop has. On the hosted
    deploy it is not offered at all, rather than offered and refused. Sean,
    25.09.2026: the live page should not show a choice that cannot work."""
    return ["tier2", "tier1"] if settings.guard_provider == "ollama" else ["tier2"]


def _provider() -> dict[str, str]:
    return {
        "name": settings.provider_name,
        "short": settings.provider_short,
        "colour": settings.provider_colour,
    }


@app.get("/api/config")
def config() -> dict[str, Any]:
    return {
        "models": [{"value": t, "label": TIER_LABELS[t]} for t in _available_tiers()],
        "provider": _provider(),
    }


@app.get("/manifest.webmanifest", include_in_schema=False)
def manifest() -> JSONResponse:
    """What "Add to Home Screen" reads: the provider's name, colour and icon, so
    the family's phone shows their provider, not ours."""
    p = _provider()
    return JSONResponse(
        {
            "name": f"{p['short']} companion",
            "short_name": p["short"],
            "start_url": "/chat",
            "display": "standalone",
            "background_color": "#F6F3EC",
            "theme_color": p["colour"],
            "icons": [{"src": "/static/icon.svg", "sizes": "any", "type": "image/svg+xml"}],
        },
        media_type="application/manifest+json",
    )


@app.get("/", include_in_schema=False)
def root() -> RedirectResponse:
    """The bare URL is what people type. 25.09.2026 it answered 404."""
    return RedirectResponse("/chat")


@app.get("/chat", response_class=HTMLResponse)
def chat_page() -> str:
    return (STATIC / "app.html").read_text(encoding="utf-8")


def _gen_backend(tier: Tier) -> Any:
    if tier == "tier1":
        from companion.llm.ollama import OllamaBackend

        return OllamaBackend(settings.llm_model)
    from companion.llm.cloud import OllamaCloudBackend

    return OllamaCloudBackend(settings.tier2_model)


@functools.cache
def _graph(tier: Tier) -> Any:
    """Built once per tier, on first use, so the page loads without Postgres."""
    from companion.agent.graph import build
    from companion.llm.guard import guard_backend
    from companion.obs.sink import default_sink, set_sink
    from companion.retrieval.cards import load_corpus
    from companion.retrieval.embed import runtime_embedder
    from companion.retrieval.store import PgVectorStore
    from companion.retrieval.types import Retriever

    # Without this, `act` drops every record: the module default is NullSink.
    set_sink(default_sink())
    embedder = runtime_embedder()
    retriever = Retriever(embedder=embedder, store=PgVectorStore(), name=embedder.name)
    guard = guard_backend()
    return build(retriever, load_corpus(_cards_dir()), guard, _gen_backend(tier))


def _card_ids(chunks: list[Any]) -> list[str]:
    seen: list[str] = []
    for c in chunks:
        card = c.id.split("#")[0]
        if card not in seen:
            seen.append(card)
    return seen


class RateLimit:
    """20 messages per visitor per hour, 150 a day for the whole site.

    Decided 25.09.2026 instead of Redis: at 10 visits a week there is nothing
    worth caching, and the one real risk is a leaked link spending the free
    model quotas. In memory, so a restart resets it, which on a free tier is
    every wake-up. That makes it a fuse, not an accounting system.
    """

    def __init__(self) -> None:
        self.lock = threading.Lock()
        self.visitors: dict[str, collections.deque[float]] = collections.defaultdict(
            collections.deque
        )
        self.site: collections.deque[float] = collections.deque()

    def check(self, visitor: str, now: float | None = None) -> str | None:
        """None if the turn may run, otherwise the reason it may not."""
        now = time.time() if now is None else now
        with self.lock:
            mine = self.visitors[visitor]
            while mine and now - mine[0] > 3600:
                mine.popleft()
            while self.site and now - self.site[0] > 86400:
                self.site.popleft()
            if len(self.site) >= settings.rate_site_day:
                return f"the demo has answered its {settings.rate_site_day} messages for today"
            if len(mine) >= settings.rate_per_visitor_hour:
                n = settings.rate_per_visitor_hour
                return f"{n} messages an hour per visitor; try again later"
            mine.append(now)
            self.site.append(now)
            return None


limits = RateLimit()


def _visitor(request: Request) -> str:
    """Render's proxy puts the caller first in X-Forwarded-For."""
    forwarded = request.headers.get("x-forwarded-for", "")
    return forwarded.split(",")[0].strip() or (request.client.host if request.client else "?")


@app.post("/api/chat")
def chat(
    body: ChatIn, request: Request, x_demo_passcode: str = Header(default="")
) -> dict[str, Any]:
    if settings.demo_passcode and not hmac.compare_digest(
        x_demo_passcode.encode(), settings.demo_passcode.encode()
    ):
        raise HTTPException(401, "passcode required")
    # After the passcode, so a wrong guess never uses up someone's allowance.
    if (reason := limits.check(_visitor(request))) is not None:
        raise HTTPException(429, reason)
    if body.model not in _available_tiers():
        # The hosted deploy has no local Ollama, so the offline tier cannot run.
        raise HTTPException(400, "tier 1 runs on the laptop only; this deployment has tier 2")
    session = body.session_id or str(uuid.uuid4())
    try:
        graph = _graph(body.model)
    except Exception as exc:  # noqa: BLE001 - the page shows why, not a stack trace
        raise HTTPException(503, f"the {body.model} backend is not ready: {exc}") from None

    started = time.perf_counter()
    trace_url = None
    with tracing.turn(
        session_id=session,
        tags=["chat", body.model],
        metadata={"model": body.model, "prompt_version": _prompt_version()},
    ) as root:
        try:
            out = graph.invoke(
                {
                    "tenant_id": "demo",
                    "message": body.message,
                    "verdicts": [],
                    "run_id": "chat",
                    "model": body.model,
                }
            )
        except Exception as exc:  # noqa: BLE001 - see below
            # The first live failure on Render, 25.09.2026, reached the page as
            # "Internal Server Error", which says nothing. The full traceback
            # goes to the log; the page gets the kind of failure and where,
            # never a key, since no backend puts one in an exception message.
            log.exception("turn failed")
            raise HTTPException(502, f"{type(exc).__name__}: {str(exc)[:240]}") from None
        tracing.set_turn_io(root, input=out.get("redacted"), output=out.get("answer"))
        trace_url = _trace_url()
    tracing.flush()

    trace = out.get("trace") or {}
    return {
        "session_id": session,
        "answer": out.get("answer", ""),
        "action": trace.get("action", "send"),
        "guard": trace.get("guard"),
        "handover": (trace.get("handover") or {}).get("reason"),
        "route": out.get("route"),
        "escalated": bool(out.get("escalated")),
        "refused": bool(out.get("refused")),
        "grounded": out.get("grounded"),
        "redacted": out.get("redacted"),
        "cards": _card_ids(out.get("chunks") or []),
        "verdicts": tracing.summarise({"verdicts": out.get("verdicts") or []})["verdicts"],
        "latency_ms": round((time.perf_counter() - started) * 1000),
        "model": body.model,
        "trace_url": trace_url,
    }


def _prompt_version() -> str:
    from companion.agent import prompts

    return prompts.VERSION


def _trace_url() -> str | None:
    lf = tracing.client()
    if lf is None:
        return None
    try:
        return str(lf.get_trace_url())
    except Exception:  # noqa: BLE001 - a missing link is not a failed turn
        return None
