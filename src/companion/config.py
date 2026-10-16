"""Settings, read from the environment. See .env.example."""

from __future__ import annotations

from pydantic import field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    database_url: str = "postgresql+psycopg://companion:companion@localhost:5432/companion"

    @field_validator("database_url")
    @classmethod
    def _psycopg_driver(cls, url: str) -> str:
        """Render hands out `postgresql://`, which SQLAlchemy reads as psycopg2,
        a driver this project does not install. Same database, named driver."""
        for prefix in ("postgres://", "postgresql://"):
            if url.startswith(prefix):
                return "postgresql+psycopg://" + url[len(prefix) :]
        return url

    # Empty locally. On the Render deploy it is required: a public page that
    # calls a hosted model on Sean's key, and takes what anyone types, needs a
    # door. The page asks for it once and keeps it for the browser session.
    demo_passcode: str = ""

    # The provider whose name and colour the family sees: white-label by config.
    # "Relocation Provider GmbH" is a placeholder, chosen 28.09.2026 so the demo
    # reads like a provider without naming a real one.
    provider_name: str = "Relocation Provider GmbH"
    provider_short: str = "Relocation Provider"
    provider_colour: str = "#2E5E4E"

    llm_provider: str = "ollama"
    llm_model: str = "llama3.1:8b"
    llm_api_key: str = ""

    # The judge must differ from the model under test, or the score measures
    # self-agreement. docs/evals.md, layer 3.
    #
    # Groq qwen3.8-27b from 29.09.2026, when Sean moved every model off the
    # laptop and retired Claude from the project. Qwen is the only free hosted
    # family outside both compared tiers (OpenAI gpt-oss, NVIDIA nemotron);
    # Ollama Cloud serves no Qwen at all. It becomes the judge of record only
    # by passing calibration: private/calibration/kappa-groq_qwen_qwen3.8-27b.json.
    judge_provider: str = "groq"
    judge_model: str = "qwen/qwen3.8-27b"

    # Pinned across every configuration under test. The guards must not vary
    # with the model being measured, or a difference in escalation recall
    # cannot be attributed to the generation stage. expose.md section 6.2.
    guard_model: str = "llama3.1:8b"
    # "ollama" (local, the pinned eval configuration) or "ollama-cloud". The
    # cloud option exists for the Render deploy only, decided 24.09.2026:
    # Ollama Cloud does not serve llama3.1:8b, and a guard that cannot reach
    # its model hands every message to a human by design. A hosted guard is a
    # different guard, so its numbers are measured and reported separately.
    guard_provider: str = "ollama"

    # PINNED, and this is a migration rather than a setting. Changing it
    # invalidates every vector in the store and every retrieval_top_score ever
    # logged, so the store has to be rebuilt and every earlier measurement is
    # no longer comparable. companion-workflow-sketch.drawio says it in four
    # words: "pin it, or the store has to be rebuilt".
    #
    # bge-m3, chosen 21.09.2026 over multilingual-e5-base (which was named in
    # this file but never argued for, needs torch and a second runtime, and
    # silently degrades without its query:/passage: prefixes) and over
    # nomic-embed-text (768-dim and English-only, which fails a025, a German
    # escalation-positive case that carries must_cite).
    embedding_model: str = "bge-m3"
    embedding_dim: int = 1024
    # "ollama" everywhere the evals run. "huggingface" serves the same bge-m3
    # weights for the Render deploy, which has no local Ollama. 24.09.2026.
    embedding_provider: str = "ollama"
    hf_token: str = ""
    # "cloudflare": the same bge-m3 on Workers AI's free tier, 15.10.2026,
    # after Hugging Face's free credits ran out.
    cloudflare_api_token: str = ""
    cloudflare_account_id: str = ""

    # Shipped k, chosen by the recall@k curve on 21.09.2026 and not by
    # preference. On the 38 cases where retrieval actually decides the answer:
    # k=5 gives 0.921, k=6 gives 0.947, and k=8, 10 and 12 all give 0.947 too.
    # The knee is at 6 and the next six chunks buy nothing. docs/retrieval.md.
    retrieval_k: int = 6

    # --- the hosted tiers -------------------------------------------------
    #
    # Tier 2 and tier 3 of the four-system comparison. Both are off unless a
    # key is present, and `run_generation.py` refuses a tier whose key is
    # missing rather than silently falling back to the local model, which
    # would report a hosted number produced by llama3.1:8b.
    #
    # Model names are settings rather than constants because a provider's
    # catalogue changes faster than this repository does. Set them to whatever
    # your account actually lists.

    # Tier 2, mid-tier hosted: Ollama Cloud. Same wire protocol as the local
    # daemon, so the backend is the local one with a host and a bearer token.
    ollama_cloud_api_key: str = ""
    ollama_cloud_host: str = "https://ollama.com"

    # Three hosted tiers, all on Ollama Cloud, because the free tier grants six
    # models and the interesting ones elsewhere cost money. Measured
    # 24.09.2026: kimi-k3, deepseek-v4-pro, glm-5.x, minimax, qwen3.5:397b and
    # mistral-large-3 all return 402 Payment Required on this key. Free:
    # gpt-oss:120b, gpt-oss:20b, nemotron-3-ultra, nemotron-3-super,
    # nemotron-3-nano:30b, gemma4:31b.
    #
    # Chosen for family spread rather than a size ladder of one family, so the
    # comparison says something about models and not only about parameters:
    # Llama (tier 1), GPT-OSS (tier 2), Nemotron (tier 3), Gemma (tier 4).
    #
    # **Single vendor, and that is a limitation to declare.** Tiers 2 to 4 all
    # run on one provider's infrastructure, so a latency or availability effect
    # common to that provider is not separable from a model effect.
    tier2_model: str = "gpt-oss:120b"
    tier3_model: str = "nemotron-3-ultra"
    tier4_model: str = "gemma4:31b"

    @property
    def ollama_cloud_model(self) -> str:
        """Back-compat for callers that predate the per-tier settings."""
        return self.tier2_model

    # Tier 3, frontier paid: Google Gemini.
    gemini_api_key: str = ""
    gemini_host: str = "https://generativelanguage.googleapis.com"
    # v1, not v1beta. Measured 23.09.2026: `gemini-3.5-flash` returns a bare
    # 404 on v1beta while ListModels on the same key reports it as supporting
    # generateContent. It answers on v1 and v1alpha. The 2.x models answer on
    # v1beta with a descriptive "no longer available to new users" 404, which
    # is how the two failures tell themselves apart.
    gemini_api_version: str = "v1"
    # Flash-class. gemini-2.5-pro is retired for new keys and the Pro tier sits
    # behind billing since May 2026; Flash stays free-tier eligible.
    # flash-LITE, not flash. Measured 23.09.2026 on this key: both answer on
    # v1 at about 65 seconds a call, but flash spent 515 tokens on "say hello"
    # because it reasons first, against 19 for flash-lite. Over ~300 calls that
    # is the difference between comfortably inside a free tier's token budget
    # and nowhere near it.
    gemini_model: str = "gemini-3.5-flash-lite"

    # Hosted tiers hit 429 (quota) and 503 (capacity) on a free tier, and an
    # overnight run of ~300 calls will meet both. Retrying is not optional
    # here: without it one transient 503 ends a two hour run at case 12.
    # Three, not five. Backoff doubles, so five attempts is 124 seconds of
    # waiting per call on top of a call that already takes 65, and a stalled
    # tier would eat the night rather than fail and let the next one start.
    hosted_max_retries: int = 3
    hosted_backoff_seconds: float = 4.0
    # Zero, because the measured call latency already paces us. Gemini free
    # tier is documented around 10 requests a minute and a 65 second call is
    # under one a minute; adding a sleep would only lengthen a run that is
    # already the longest thing in the schedule. Raise it if 429s appear.
    hosted_min_interval_seconds: float = 0.0

    # Tier 5, Mistral. The one genuinely different vendor in the ladder, which
    # is why it is worth having despite being the slowest.
    #
    # Two measurements, a day apart, and the second one overturned the first.
    #
    # 24.09.2026: every call took about 150 seconds whatever the model, which
    # looked like an account-level throttle because a 3B and a medium queued
    # identically. The estimate for 115 cases was thirteen hours.
    #
    # 25.09.2026, same key, same prompt: **1 second a call**, and four
    # concurrent calls also complete in one second. So the 150s was a
    # transient queue on Mistral's side, not a property of the account, and
    # tier 5 is an hour rather than a night.
    #
    # The lesson is about the measurement rather than the vendor: three
    # consistent readings of 150s over two hours looked like a stable property
    # and were a stable outage. A latency figure needs a date on it.
    #
    # Still true: only `ministral-14b-latest` is permitted. mistral-medium,
    # magistral-medium, mistral-small and magistral-small return 429.
    mistral_api_key: str = ""
    mistral_host: str = "https://api.mistral.ai"
    mistral_model: str = "ministral-14b-latest"

    # Tier 6, DeepSeek. Not free: checked 24.09.2026 on this key,
    # granted_balance 0.00 and both models return 402 Insufficient Balance, so
    # the signup token grant the docs describe did not apply. Wired because the
    # cost is noise: ~450k tokens for a full run, about twenty cents at
    # V4-Pro's rates, and a two dollar top-up covers the capstone.
    deepseek_api_key: str = ""
    deepseek_host: str = "https://api.deepseek.com"
    deepseek_model: str = "deepseek-v4-pro"

    # Groq, the crisis classifier's host on the Render deploy. 25.09.2026.
    groq_api_key: str = ""
    groq_host: str = "https://api.groq.com/openai"
    groq_model: str = "qwen/qwen3.8-27b"

    langfuse_public_key: str = ""
    langfuse_secret_key: str = ""
    # Self-hosted on this machine since 24.09.2026, `make langfuse-up`. Traces
    # carry the eval questions and, from /chat, a family's own words; the
    # tracer refuses any host that is not this machine. See obs/tracing.py.
    langfuse_host: str = "http://localhost:3100"
    # The name Langfuse's own UI snippet uses since v3. When both are set, this
    # one wins: it is what Sean pasted on 24.09.2026 below an older cloud HOST.
    langfuse_base_url: str = ""

    # Off everywhere but the Render deploy, where render.yaml turns it on so
    # live turns reach Langfuse Cloud's EU region. Decided 25.09.2026. Only the
    # redacted message is ever sent; see obs/tracing.py.
    langfuse_allow_cloud: bool = False

    # The demo's door, per visitor and for the whole site. In process, so a
    # restart (every free-tier wake-up) resets it; that is fine at this size.
    # Far above 10 visits a week, far below the free quotas. 25.09.2026.
    rate_per_visitor_hour: int = 20
    rate_site_day: int = 150

    @property
    def langfuse_url(self) -> str:
        return self.langfuse_base_url or self.langfuse_host

    telegram_bot_token: str = ""
    prompt_version: str = "v0"


settings = Settings()
