"""Turn text into vectors, through the Ollama that is already running.

**The model is pinned, and that is not a style preference.** Changing it
invalidates every vector in the store and every `retrieval_top_score` ever
logged, so it is a migration rather than a setting. `companion-workflow-sketch.drawio`
says it in four words: "pin it, or the store has to be rebuilt". The same
argument `docs/constraints.md` §1 makes for the seven logging fields applies
here and harder, because those can at least be recomputed from a trace.

None of the seven generation models installed on this machine can embed. Tested
on 21.09.2026: all of them return "This server does not support embeddings".
Ollama enables the embedding path only for models built for it, so this needs
its own pull and cannot be switched on with a flag.
"""

from __future__ import annotations

import httpx

from companion.config import settings
from companion.retrieval.chunking import Chunk
from companion.retrieval.types import EmbeddedChunk

BATCH = 32


class EmbeddingError(RuntimeError):
    """Raised rather than returning zeros.

    A zero vector scores 0 against everything, so a silent failure here looks
    exactly like a corpus that matches nothing. That is the same shape as
    `validate_cards.py` printing "0 cards checked" and exiting clean.
    """


class OllamaEmbedder:
    """The pinned embedder. Documents and queries go through the same model."""

    def __init__(self, model: str | None = None, host: str = "http://localhost:11434"):
        self.model = model or settings.embedding_model
        self.name = f"ollama/{self.model}"
        self._host = host
        self._dim: int | None = None

    @property
    def dim(self) -> int:
        """Discovered once, from the model itself, rather than configured.

        A configured dimension that disagrees with the model is a column that
        rejects every insert, and the error arrives far from the cause.
        """
        if self._dim is None:
            self._dim = len(self.embed_query("dimension probe"))
        return self._dim

    def _embed(self, texts: list[str]) -> list[list[float]]:
        if not texts:
            return []
        try:
            response = httpx.post(
                f"{self._host}/api/embed",
                json={"model": self.model, "input": texts},
                timeout=300.0,
            )
            response.raise_for_status()
            payload = response.json()
        except httpx.HTTPError as exc:
            raise EmbeddingError(f"{self.name} unreachable: {exc}") from exc

        if "error" in payload:
            raise EmbeddingError(f"{self.name}: {payload['error']}")
        vectors = payload.get("embeddings")
        if not vectors or len(vectors) != len(texts):
            raise EmbeddingError(
                f"{self.name} returned {len(vectors or [])} vectors for {len(texts)} inputs"
            )
        return [[float(x) for x in v] for v in vectors]

    def embed_documents(self, texts: list[str]) -> list[list[float]]:
        out: list[list[float]] = []
        for start in range(0, len(texts), BATCH):
            out.extend(self._embed(texts[start : start + BATCH]))
        return out

    def embed_query(self, text: str) -> list[float]:
        return self._embed([text])[0]

    def embed_chunks(self, chunks: list[Chunk], tenant_id: str = "global") -> list[EmbeddedChunk]:
        vectors = self.embed_documents([c.text for c in chunks])
        return [
            EmbeddedChunk(chunk=c, vector=v, tenant_id=tenant_id)
            for c, v in zip(chunks, vectors, strict=True)
        ]


HF_URL = "https://router.huggingface.co/hf-inference/models/{model}/pipeline/feature-extraction"


class HFEmbedder:
    """The same pinned model, `BAAI/bge-m3`, served by Hugging Face.

    For the Render deploy only, decided 24.09.2026: Render has no local
    Ollama, and Ollama Cloud refused `/api/embed` when probed that day. Same
    weights, so vectors stored by `OllamaEmbedder` and queries embedded here
    should agree to within rounding; `make embed-parity` measures that on all
    62 chunks before anything is deployed, rather than assuming it. Every eval
    stays on `OllamaEmbedder`.
    """

    def __init__(self, model: str = "BAAI/bge-m3", token: str | None = None):
        self.model = model
        self.name = f"hf/{model}"
        self._token = token or settings.hf_token
        if not self._token:
            raise ValueError("HF_TOKEN is not set. Needed only for EMBEDDING_PROVIDER=huggingface.")
        self._dim: int | None = None

    @property
    def dim(self) -> int:
        if self._dim is None:
            self._dim = len(self.embed_query("dimension probe"))
        return self._dim

    def _embed(self, texts: list[str]) -> list[list[float]]:
        if not texts:
            return []
        try:
            response = httpx.post(
                HF_URL.format(model=self.model),
                headers={"Authorization": f"Bearer {self._token}"},
                json={"inputs": texts},
                timeout=120.0,
            )
            response.raise_for_status()
            vectors = response.json()
        except httpx.HTTPError as exc:
            raise EmbeddingError(f"{self.name} unreachable: {exc}") from exc
        if not isinstance(vectors, list) or len(vectors) != len(texts):
            raise EmbeddingError(f"{self.name} returned an unexpected payload for {len(texts)}")
        out = []
        for v in vectors:
            norm = sum(float(x) * float(x) for x in v) ** 0.5
            if not norm:
                raise EmbeddingError(f"{self.name} returned a zero vector")
            # L2-normalised, as Ollama's /api/embed returns them.
            out.append([float(x) / norm for x in v])
        return out

    def embed_documents(self, texts: list[str]) -> list[list[float]]:
        out: list[list[float]] = []
        for start in range(0, len(texts), BATCH):
            out.extend(self._embed(texts[start : start + BATCH]))
        return out

    def embed_query(self, text: str) -> list[float]:
        return self._embed([text])[0]

    def embed_chunks(self, chunks: list[Chunk], tenant_id: str = "global") -> list[EmbeddedChunk]:
        vectors = self.embed_documents([c.text for c in chunks])
        return [
            EmbeddedChunk(chunk=c, vector=v, tenant_id=tenant_id)
            for c, v in zip(chunks, vectors, strict=True)
        ]


CF_URL = "https://api.cloudflare.com/client/v4/accounts/{account}/ai/run/@cf/baai/bge-m3"


class CloudflareEmbedder(HFEmbedder):
    """The same pinned bge-m3, served by Cloudflare Workers AI on its free tier.

    15.10.2026: Hugging Face's free credits ran out (402) the week of the final
    presentation, and neither Ollama Cloud nor Groq serves an embedding model.
    Same weights again, so `make embed-parity PROVIDER=cloudflare` must pass
    before the deploy switches. Only the transport differs from `HFEmbedder`.
    """

    def __init__(self, token: str | None = None, account: str | None = None):
        self.model = "BAAI/bge-m3"
        self.name = "cloudflare/bge-m3"
        self._token = token or settings.cloudflare_api_token
        self._account = account or settings.cloudflare_account_id
        if not (self._token and self._account):
            raise ValueError(
                "CLOUDFLARE_API_TOKEN and CLOUDFLARE_ACCOUNT_ID are needed for "
                "EMBEDDING_PROVIDER=cloudflare."
            )
        self._dim = None

    def _embed(self, texts: list[str]) -> list[list[float]]:
        if not texts:
            return []
        try:
            response = httpx.post(
                CF_URL.format(account=self._account),
                headers={"Authorization": f"Bearer {self._token}"},
                json={"text": texts},
                timeout=120.0,
            )
            response.raise_for_status()
            vectors = (response.json().get("result") or {}).get("data")
        except (httpx.HTTPError, ValueError) as exc:
            raise EmbeddingError(f"{self.name} unreachable: {exc}") from exc
        if not isinstance(vectors, list) or len(vectors) != len(texts):
            raise EmbeddingError(f"{self.name} returned an unexpected payload for {len(texts)}")
        out = []
        for v in vectors:
            norm = sum(float(x) * float(x) for x in v) ** 0.5
            if not norm:
                raise EmbeddingError(f"{self.name} returned a zero vector")
            out.append([float(x) / norm for x in v])
        return out


def runtime_embedder() -> OllamaEmbedder | HFEmbedder:
    """The query embedder the app uses. Local Ollama unless the deploy says so."""
    if settings.embedding_provider == "huggingface":
        return HFEmbedder()
    if settings.embedding_provider == "cloudflare":
        return CloudflareEmbedder()
    if settings.embedding_provider == "ollama":
        return OllamaEmbedder()
    raise ValueError(
        f"EMBEDDING_PROVIDER={settings.embedding_provider!r}: "
        "expected 'ollama', 'huggingface' or 'cloudflare'"
    )


class StubEmbedder:
    """Deterministic vectors for tests, so the suite never needs Ollama.

    Hashes character trigrams into a fixed-width vector. It is a bad retriever
    and a completely reproducible one, which is what a test needs: the point of
    these tests is the store and the plumbing, not the semantics.
    """

    name = "stub"

    def __init__(self, dim: int = 64):
        self.dim = dim

    def _vector(self, text: str) -> list[float]:
        vec = [0.0] * self.dim
        lowered = text.lower()
        for i in range(max(len(lowered) - 2, 1)):
            vec[hash(lowered[i : i + 3]) % self.dim] += 1.0
        norm = sum(x * x for x in vec) ** 0.5 or 1.0
        return [x / norm for x in vec]

    def embed_documents(self, texts: list[str]) -> list[list[float]]:
        return [self._vector(t) for t in texts]

    def embed_query(self, text: str) -> list[float]:
        return self._vector(text)

    def embed_chunks(self, chunks: list[Chunk], tenant_id: str = "global") -> list[EmbeddedChunk]:
        return [
            EmbeddedChunk(chunk=c, vector=self._vector(c.text), tenant_id=tenant_id) for c in chunks
        ]
