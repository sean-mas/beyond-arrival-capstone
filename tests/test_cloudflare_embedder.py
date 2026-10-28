"""The Workers AI bge-m3 transport, with the network stubbed."""

from __future__ import annotations

import httpx
import pytest

from companion.retrieval import embed


class Reply:
    def __init__(self, payload: dict):
        self.payload = payload

    def raise_for_status(self) -> None:
        return None

    def json(self) -> dict:
        return self.payload


def test_vectors_come_back_normalised(monkeypatch) -> None:
    seen: dict = {}

    def post(url, headers, json, timeout):
        seen.update(url=url, body=json)
        return Reply({"result": {"shape": [2, 2], "data": [[3.0, 4.0], [0.0, 2.0]]}})

    monkeypatch.setattr(httpx, "post", post)
    vectors = embed.CloudflareEmbedder(token="t", account="acc")._embed(["a", "b"])
    assert vectors == [[0.6, 0.8], [0.0, 1.0]]
    assert "/accounts/acc/ai/run/@cf/baai/bge-m3" in seen["url"]
    assert seen["body"] == {"text": ["a", "b"]}


def test_a_short_payload_is_an_error_not_a_guess(monkeypatch) -> None:
    monkeypatch.setattr(httpx, "post", lambda *a, **k: Reply({"result": {"data": [[1.0]]}}))
    with pytest.raises(embed.EmbeddingError):
        embed.CloudflareEmbedder(token="t", account="acc")._embed(["a", "b"])


def test_missing_credentials_refuse_to_start(monkeypatch) -> None:
    monkeypatch.setattr(embed.settings, "cloudflare_api_token", "")
    with pytest.raises(ValueError, match="CLOUDFLARE_API_TOKEN"):
        embed.CloudflareEmbedder(account="acc")
