"""The calibration step must grade against the material the run retrieved.

Until 24.09.2026 `score` passed an empty string as MATERIAL, so the judge would
have been asked whether an answer is grounded in nothing, and the kappa would
have measured nothing. These pin the rebuild.
"""

from __future__ import annotations

import pathlib
import sys

import pytest

sys.path.insert(0, str(pathlib.Path(__file__).resolve().parents[1] / "evals"))

from calibrate_judge import material_for  # noqa: E402

from companion.retrieval.cards import load_corpus  # noqa: E402
from companion.retrieval.chunking import chunk_corpus  # noqa: E402

CARDS = pathlib.Path(__file__).resolve().parents[1] / "content" / "cards"


def test_material_is_the_chunks_in_retrieval_order() -> None:
    chunks = chunk_corpus(load_corpus(CARDS))
    first, second = chunks[3], chunks[0]
    assert material_for([first.id, second.id]) == f"{first.text}\n\n{second.text}"


def test_material_is_never_empty_for_a_retrieved_turn() -> None:
    chunk = chunk_corpus(load_corpus(CARDS))[0]
    assert material_for([chunk.id]).strip()


def test_an_id_the_corpus_no_longer_has_refuses_to_score() -> None:
    with pytest.raises(SystemExit, match="Redraw"):
        material_for(["card_999#0"])


def test_agreement_reports_kappa_and_the_positive_rate() -> None:
    from calibrate_judge import agreement

    result = agreement([True, True, False, False], [True, False, False, False])
    assert result["n"] == 4
    assert result["raw_agreement"] == 0.75
    assert result["kappa"] == 0.5
    assert result["human_positive_rate"] == 0.5


@pytest.mark.parametrize(
    ("score", "expected"),
    [
        (0.9, True),
        (0.7, True),  # the cut is inclusive, as the judge prompt's grounded is
        (0.2, False),
        (None, None),  # a missing score is no verdict, never a guess
    ],
)
def test_each_score_is_cut_once_at_the_declared_point(score, expected) -> None:
    from calibrate_judge import verdict_at

    assert verdict_at(score) is expected


def test_every_label_maps_to_exactly_one_judge_score() -> None:
    from calibrate_judge import LABELS

    fields = [f for f, _, _ in LABELS]
    scores = [k for _, k, _ in LABELS]
    assert len(set(fields)) == len(fields) == len(set(scores))


def test_the_judge_reads_actionable_and_never_invents_it() -> None:
    from judge import Judge

    from companion.llm.ollama import StubBackend

    full = '{"groundedness": 1, "relevance": 1, "tone": 1, "actionable": 0.4, "grounded": true}'
    assert Judge(StubBackend([full])).score("q", "m", "a").actionable == 0.4
    old = '{"groundedness": 1, "relevance": 1, "tone": 1, "grounded": true}'
    assert Judge(StubBackend([old])).score("q", "m", "a").actionable is None


def test_a_column_with_no_failures_measures_nothing() -> None:
    """29.09.2026: all 30 answers grounded, both judges agreed, kappa read 1.0."""
    from calibrate_judge import agreement

    result = agreement([True] * 30, [True] * 30)
    assert result["raw_agreement"] == 1.0
    assert result["kappa"] is None
