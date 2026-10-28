"""The fingerprint has to move when a prompt moves, and not otherwise.

Written after 24.09.2026, when `make all` started on a clean tree at c13972c
and another session committed a prompt rewrite while it ran. Tier 1 finished on
v2 sixteen minutes before the commit; tier 2 ran on v3. `prompt_version` caught
it, but only because someone remembered to bump it. This hashes the bytes.
"""

from __future__ import annotations

import pathlib
import sys

import pytest

sys.path.insert(0, str(pathlib.Path(__file__).resolve().parents[1] / "evals"))

import codeprint  # noqa: E402


def test_editing_a_prompt_moves_the_fingerprint(tmp_path, monkeypatch):
    root = tmp_path / "repo"
    (root / "src" / "companion" / "agent").mkdir(parents=True)
    prompts = root / "src" / "companion" / "agent" / "prompts.py"
    prompts.write_text('ANSWER = "be warm"')
    monkeypatch.setattr(codeprint, "ROOT", root)
    monkeypatch.setattr(codeprint, "MEASUREMENT_PATHS", ("src/companion/agent",))

    before = codeprint.code_digest()
    prompts.write_text('ANSWER = "be warm, and end with a next step"')
    assert codeprint.code_digest() != before, "a rewritten prompt did not move the digest"


def test_a_readme_does_not_move_the_fingerprint(tmp_path, monkeypatch):
    """A list that trips on documentation is a list people learn to ignore."""
    root = tmp_path / "repo2"
    (root / "src" / "companion" / "agent").mkdir(parents=True)
    (root / "src" / "companion" / "agent" / "prompts.py").write_text("ANSWER = 1")
    (root / "README.md").write_text("hello")
    monkeypatch.setattr(codeprint, "ROOT", root)
    monkeypatch.setattr(codeprint, "MEASUREMENT_PATHS", ("src/companion/agent",))

    before = codeprint.code_digest()
    (root / "README.md").write_text("hello, revised at length")
    assert codeprint.code_digest() == before


def test_the_digest_is_stable_across_calls(tmp_path, monkeypatch):
    """It goes in a history row. A digest that drifts on its own would make
    every row look like a different codebase."""
    root = tmp_path / "repo3"
    (root / "src" / "companion" / "agent").mkdir(parents=True)
    (root / "src" / "companion" / "agent" / "prompts.py").write_text("ANSWER = 1")
    monkeypatch.setattr(codeprint, "ROOT", root)
    monkeypatch.setattr(codeprint, "MEASUREMENT_PATHS", ("src/companion/agent",))
    assert codeprint.code_digest() == codeprint.code_digest()


def test_pycache_is_excluded(tmp_path, monkeypatch):
    """Compiled bytecode appears and disappears on its own."""
    root = tmp_path / "repo4"
    agent = root / "src" / "companion" / "agent"
    (agent / "__pycache__").mkdir(parents=True)
    (agent / "prompts.py").write_text("ANSWER = 1")
    monkeypatch.setattr(codeprint, "ROOT", root)
    monkeypatch.setattr(codeprint, "MEASUREMENT_PATHS", ("src/companion/agent",))

    before = codeprint.code_digest()
    (agent / "__pycache__" / "prompts.cpython-314.pyc").write_bytes(b"\x00\x01")
    assert codeprint.code_digest() == before


@pytest.mark.parametrize(
    "path", ["src/companion/agent", "src/companion/guardrails", "evals/run_generation.py"]
)
def test_the_things_that_can_move_a_number_are_all_watched(path: str):
    assert path in codeprint.MEASUREMENT_PATHS


def test_the_real_tree_produces_a_digest():
    assert len(codeprint.code_digest()) == 12
