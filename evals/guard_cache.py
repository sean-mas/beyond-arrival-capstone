"""Remember the crisis check's verdicts across eval runs of an unchanged check.

    guard = CachedBackend(llm_guard.guard_backend())

Groq's free tier is 200,000 tokens a day, and the crisis check spends about
300 of them on each of 115 cases, every run. On 29 and 30.09.2026 six answer
experiments (E0 to E4b) changed nothing in the check and still asked it the
same 115 questions each time, and the day's budget ran out before the one
experiment that did change it (E5) could run.

So a verdict is kept, keyed on the model, the exact system prompt and the
exact redacted message. Change the policy by one character and the key
changes, so a guard experiment always asks afresh. Only a reply that arrived
is kept: an error is never cached, because it is not a verdict.

**Eval runs only.** A live turn always asks the check. And a cached run no
longer measures the check's run-to-run variation (E0: 0 of 115 flipped, E4a:
one did), which is right for answer experiments, where that variation is
noise, and wrong for guard experiments, which is why `run_guardrails.py`
never uses this.

Private, because the key holds the family's words: `private/cache/`.
"""

from __future__ import annotations

import hashlib
import json
import pathlib

from companion.llm.ollama import Backend, Completion

CACHE = pathlib.Path(__file__).resolve().parents[1] / "private" / "cache" / "guard-verdicts.jsonl"


class CachedBackend:
    def __init__(self, inner: Backend, path: pathlib.Path = CACHE):
        self.inner = inner
        self.name = inner.name
        self.path = path
        self.hits = 0
        self.misses = 0
        self._memo: dict[str, str] = {}
        if path.exists():
            for line in path.read_text().splitlines():
                if line.strip():
                    row = json.loads(line)
                    self._memo[row["key"]] = row["text"]

    def _key(self, system: str, user: str, json_mode: bool) -> str:
        raw = json.dumps([self.name, system, user, json_mode], ensure_ascii=False)
        return hashlib.sha256(raw.encode()).hexdigest()

    def complete(self, system: str, user: str, *, json_mode: bool = False) -> Completion:
        key = self._key(system, user, json_mode)
        if key in self._memo:
            self.hits += 1
            return Completion(
                text=self._memo[key], model=self.name, latency_ms=0, raw={"cached": True}
            )
        completion = self.inner.complete(system, user, json_mode=json_mode)
        self.misses += 1
        self._memo[key] = completion.text
        self.path.parent.mkdir(parents=True, exist_ok=True)
        with self.path.open("a", encoding="utf-8") as fh:
            fh.write(json.dumps({"key": key, "text": completion.text}) + "\n")
        return completion
