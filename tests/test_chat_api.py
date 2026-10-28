"""The demo endpoint and page, with the graph stubbed: no Postgres, no model."""

from __future__ import annotations

import pytest
from fastapi.testclient import TestClient

from companion.api import app as api
from companion.guardrails.types import Action, GuardName, Verdict


class FakeGraph:
    def __init__(self, out: dict):
        self.out = out
        self.seen: dict = {}

    def invoke(self, state: dict) -> dict:
        self.seen = state
        return self.out


def client_with(monkeypatch, out: dict) -> tuple[TestClient, FakeGraph]:
    graph = FakeGraph(out)
    monkeypatch.setattr(api, "_graph", lambda tier: graph)
    return TestClient(api.app), graph


def test_the_page_is_served() -> None:
    client = TestClient(api.app)
    r = client.get("/chat")
    assert r.status_code == 200
    assert "/static/app.js" in r.text
    js = client.get("/static/app.js")
    assert js.status_code == 200
    assert "/api/chat" in js.text


def test_every_module_the_page_imports_is_served() -> None:
    """A missing module is a blank page with no error a family would see."""
    import re

    client = TestClient(api.app)
    names = ["app.js", "riverscene.js", "faces.js", "family.js", "data.js", "icons.js", "app.css"]
    for name in [*names, "icon.svg"]:
        assert client.get(f"/static/{name}").status_code == 200, name
    for mod in re.findall(r'from "\./([a-z]+\.js)"', client.get("/static/app.js").text):
        assert client.get(f"/static/{mod}").status_code == 200, mod


def test_the_river_game_resolves_on_its_own() -> None:
    """The game, set aside in game/ (29.09.2026): every module it imports is there."""
    import pathlib
    import re

    game = pathlib.Path(__file__).resolve().parent.parent / "game"
    if not game.exists():
        pytest.skip("game/ is local-only and not in the published repository")
    seen, todo = set(), [game / "main.js"]
    while todo:
        path = todo.pop().resolve()
        if path in seen:
            continue
        seen.add(path)
        assert path.exists(), path
        for rel in re.findall(r'from "(\.\.?/[a-z/]+\.js)"', path.read_text()):
            todo.append(path.parent / rel)
    assert (game / "zones.js").resolve() in seen
    assert (game / "shared" / "family.js").resolve() in seen


def test_the_site_no_longer_serves_the_game() -> None:
    client = TestClient(api.app)
    assert client.get("/river").status_code == 404
    assert client.get("/static/river/main.js").status_code == 404


def test_the_deploy_export_cannot_copy_the_game() -> None:
    """Sean, 28.09.2026: the game is not to be deployed. game/ is off the allow-list."""
    import pathlib
    import re

    root = pathlib.Path(__file__).resolve().parent.parent
    if not (root / "publish").exists():
        pytest.skip("publish/ builds the exports and is not itself exported")
    script = (root / "publish" / "export-deploy.sh").read_text()
    allow = re.search(r"for item in ([^;]+); do", script)
    assert allow and "game" not in allow.group(1).split()
    assert 'echo "The river game must not ship."' in script


def test_the_react_pieces_and_their_pictures_are_served() -> None:
    """The river roadmap's bundle stays served for the river game, but the app no
    longer loads it: the journey is a drawn line since the redesign of 28.10.2026."""
    client = TestClient(api.app)
    intro = [
        "intro.js",
        "intro.css",
        "roadmap.json",
        "roadmap.webp",
        "roadmap-tall.json",
        "boat.webp",
    ]
    for name in intro:
        assert client.get(f"/static/intro/{name}").status_code == 200, name
    app_js = client.get("/static/app.js").text
    assert "/static/intro/intro.js" not in app_js
    assert 'from "./journeyline.js"' in app_js
    assert client.get("/static/journeyline.js").status_code == 200
    # the arrival is parked (30.09.2026): nothing of it is served
    assert client.get("/static/arrival/kaub.webp").status_code == 404


def test_the_demo_link_builds_a_family_and_cleans_its_address() -> None:
    """/chat?demo=1 (30.09.2026): a ready-made family for demonstrations."""
    js = TestClient(api.app).get("/static/app.js").text
    assert 'get("demo") === "1"' in js
    assert 'history.replaceState(null, "", location.pathname)' in js


def test_the_manifest_carries_the_provider_not_us() -> None:
    from companion.config import settings

    r = TestClient(api.app).get("/manifest.webmanifest")
    assert r.status_code == 200
    body = r.json()
    assert body["short_name"] == settings.provider_short
    assert body["start_url"] == "/chat"
    assert body["display"] == "standalone"


def test_config_names_the_provider() -> None:
    body = TestClient(api.app).get("/api/config").json()
    assert body["provider"]["name"] == "Relocation Provider GmbH"


def test_a_handover_says_why_and_never_echoes_the_raw_message(monkeypatch) -> None:
    out = {
        "answer": "passing this on",
        "redacted": "call me on [PHONE_REDACTED], I want to talk to a person",
        "escalated": True,
        "verdicts": [
            Verdict(guard=GuardName.CRISIS, action=Action.HANDOVER, reason="asked for a human")
        ],
        "trace": {
            "action": "handover",
            "guard": "crisis",
            "handover": {"reason": "asked_for_human"},
        },
    }
    client, graph = client_with(monkeypatch, out)
    r = client.post("/api/chat", json={"message": "call me on +49 176 2233445, a person please"})
    body = r.json()
    assert r.status_code == 200
    assert body["action"] == "handover" and body["handover"] == "asked_for_human"
    assert "2233445" not in r.text
    assert graph.seen["run_id"] == "chat"


def test_the_default_model_is_tier_two(monkeypatch) -> None:
    client, _ = client_with(monkeypatch, {"answer": "ok", "trace": {"action": "send"}})
    assert client.post("/api/chat", json={"message": "hi"}).json()["model"] == "tier2"


def test_an_unknown_model_is_rejected() -> None:
    r = TestClient(api.app).post("/api/chat", json={"message": "hi", "model": "tier9"})
    assert r.status_code == 422


def test_a_passcode_when_set_is_required(monkeypatch) -> None:
    from companion.config import settings

    client, _ = client_with(monkeypatch, {"answer": "ok", "trace": {"action": "send"}})
    monkeypatch.setattr(settings, "demo_passcode", "open-sesame")
    assert client.post("/api/chat", json={"message": "hi"}).status_code == 401
    ok = client.post(
        "/api/chat", json={"message": "hi"}, headers={"X-Demo-Passcode": "open-sesame"}
    )
    assert ok.status_code == 200


def test_the_hosted_deploy_refuses_the_laptop_tier(monkeypatch) -> None:
    from companion.config import settings

    client, _ = client_with(monkeypatch, {"answer": "ok", "trace": {"action": "send"}})
    monkeypatch.setattr(settings, "guard_provider", "ollama-cloud")
    assert client.post("/api/chat", json={"message": "hi", "model": "tier1"}).status_code == 400


def test_a_render_database_url_gets_the_installed_driver() -> None:
    from companion.config import Settings

    s = Settings(database_url="postgresql://u:p@host:5432/db")
    assert s.database_url == "postgresql+psycopg://u:p@host:5432/db"


def test_a_failing_turn_says_what_failed(monkeypatch) -> None:
    """Not 'Internal Server Error': the page must be able to say why."""

    class Broken:
        def invoke(self, state: dict) -> dict:
            raise TimeoutError("ollama-cloud/gpt-oss:120b did not answer in 180s")

    monkeypatch.setattr(api, "_graph", lambda tier: Broken())
    r = TestClient(api.app).post("/api/chat", json={"message": "hi"})
    assert r.status_code == 502
    assert r.json()["detail"].startswith("TimeoutError: ollama-cloud")


def test_the_hosted_deploy_offers_only_tier_two(monkeypatch) -> None:
    from companion.config import settings

    client = TestClient(api.app)
    assert [m["value"] for m in client.get("/api/config").json()["models"]] == ["tier2", "tier1"]
    monkeypatch.setattr(settings, "guard_provider", "groq")
    assert [m["value"] for m in client.get("/api/config").json()["models"]] == ["tier2"]


def test_the_rate_limit_stops_a_visitor_and_then_the_site(monkeypatch) -> None:
    """25.09.2026, instead of Redis: a fuse against a leaked link spending the
    free quotas. Per visitor per hour first, then the whole site per day."""
    monkeypatch.setattr(api.settings, "rate_per_visitor_hour", 2)
    monkeypatch.setattr(api.settings, "rate_site_day", 3)
    lim = api.RateLimit()
    assert lim.check("a", now=0) is None
    assert lim.check("a", now=1) is None
    assert "an hour" in (lim.check("a", now=2) or "")
    assert lim.check("a", now=3601.5) is None  # the hour has passed for "a"
    assert "for today" in (lim.check("b", now=3602) or "")


def test_a_limited_visitor_gets_429_not_a_turn(monkeypatch) -> None:
    client, graph = client_with(monkeypatch, {"answer": "hi", "verdicts": []})
    monkeypatch.setattr(api, "limits", api.RateLimit())
    monkeypatch.setattr(api.settings, "rate_per_visitor_hour", 1)
    assert client.post("/api/chat", json={"message": "hello"}).status_code == 200
    r = client.post("/api/chat", json={"message": "hello again"})
    assert r.status_code == 429


def test_the_bare_url_sends_you_to_the_demo() -> None:
    r = TestClient(api.app).get("/", follow_redirects=False)
    assert r.status_code in (302, 307) and r.headers["location"] == "/chat"


def test_the_page_and_its_modules_are_revalidated() -> None:
    """A stale cached module next to a fresh one is a blank page."""
    client = TestClient(api.app)
    for path in ["/chat", "/static/app.js", "/static/data.js"]:
        assert client.get(path).headers.get("cache-control") == "no-cache", path
