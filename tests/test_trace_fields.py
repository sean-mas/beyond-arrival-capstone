"""The seven pre-registered logging fields must be present on every turn.

This test exists because retrofitting any one of them means re-running every
thesis measurement, and because a field that is silently absent looks exactly
like a field that is present and empty.

The thesis pre-registration section 1.5.
"""

from companion.obs.trace import TurnRecord

PREREGISTERED = {
    "prompt_version",
    "chunk_ids",
    "run_index",
    "condition_label",
    "parent_case_id",
    "retrieval_top_score",
    "answer_confidence",
}


def _full(**overrides: object) -> TurnRecord:
    base: dict[str, object] = {
        "turn_id": "t1",
        "tenant_id": "tenant_a",
        "question": "Wann muss ich meinen Aufenthaltstitel verlaengern?",
        "prompt_version": "v0",
        "chunk_ids": ["card_001#0"],
        "retrieval_top_score": 0.81,
        "retrieval_margin": 0.12,
        "answer_confidence": 0.7,
    }
    base.update(overrides)
    return TurnRecord(**base)  # type: ignore[arg-type]


def test_schema_still_carries_all_seven() -> None:
    """Renaming or dropping a field fails here rather than in November."""
    assert set(TurnRecord.model_fields) >= PREREGISTERED


def test_a_complete_turn_reports_nothing_missing() -> None:
    assert _full().missing_preregistered() == []


def test_an_incomplete_turn_is_caught() -> None:
    """The known-bad input. Without this the check above proves nothing."""
    assert "retrieval_top_score" in _full(retrieval_top_score=None).missing_preregistered()
    assert "chunk_ids" in _full(chunk_ids=[]).missing_preregistered()


def test_a_perturbed_turn_must_name_its_parent() -> None:
    """parent_case_id is legitimately None on a clean run and never on a
    perturbed one, so it is checked against condition_label rather than
    against None."""
    assert _full(condition_label="clean").missing_preregistered() == []
    assert "parent_case_id" in _full(condition_label="typo_v1").missing_preregistered()
