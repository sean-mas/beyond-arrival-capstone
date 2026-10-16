"""The state machine.

    guard_in ──halt──────────────────────────────────► act
       │ clean
       ▼
    retrieve ──► decide ──clarify──► clarify ──────────► act
       ▲            │ answer
       │            ▼
       └─retrieve_more─ generate ──► guard_out ────────► act

Two kinds of edge, and the difference is the whole design:

* **conditional on a guard verdict** — code decides, and these are the edges
  that can end a turn
* **conditional on the model's route** — the model decides, and these only
  choose how well the question gets answered

Measured 21.09.2026: `llama3.1:8b` holding a handover tool escalated on `c001`,
a post about never getting past small talk, the labelled boundary case
for over-escalation, and on "how long is a Blue Card usually valid for", which
must be answered. The same model asked one narrow question scored recall 0.75
and precision 1.00. So safety is never a tool choice. `docs/decisions.md`.

The graph is built with a plain `StateGraph` and no prebuilt agent, because a
prebuilt ReAct loop puts exactly the decision above back in the model's hands.
"""

from __future__ import annotations

from typing import Any

from langgraph.graph import END, StateGraph

from companion.agent import nodes
from companion.agent.state import CompanionState
from companion.llm.ollama import Backend
from companion.obs import tracing
from companion.retrieval.cards import Card

MAX_RETRIEVALS = 2
"""One retry. `retrieve_more` exists so a thin first retrieval can be widened,
not so the model can loop: an agent that can retrieve indefinitely is an agent
that can spend indefinitely.

The bound is counted in `state["retrievals"]` rather than inferred from the
number of chunks. The first version inferred it, the retriever returns a fixed
k, and the condition was therefore permanently true: every case looped until
LangGraph's recursion limit, at one model call per lap. A loop bound that
depends on the loop body's output is not a bound."""


def _after_guards(state: CompanionState) -> str:
    """Code decides. Any halting verdict ends the turn before generation."""
    return "act" if any(v.halts for v in state.get("verdicts", [])) else "retrieve"


def _after_decide(state: CompanionState) -> str:
    """The model decides, within a bound it does not control."""
    route = state.get("route", "answer")
    if route == "clarify":
        return "clarify"
    if route == "retrieve_more" and state.get("retrievals", 0) < MAX_RETRIEVALS:
        return "retrieve"
    return "generate"


def build(
    retriever: object,
    cards: list[Card] | None = None,
    guard_backend: Backend | None = None,
    gen_backend: Backend | None = None,
) -> Any:
    """Compile the graph. Backends are injected so tests never touch the network.

    **Two backends, and that separation is load-bearing.** `01-thesis/expose.md`
    fixes three configurations "varying only the generation stage", with
    "guardrails, retrieval and the corpus identical across all three, so any
    measured difference is attributable to the generation stage alone".

    One backend for both would quietly break that: swapping the model under test
    would also swap the crisis classifier, and a change in escalation recall
    could no longer be attributed to either. So `guard_backend` is pinned across
    every configuration and only `gen_backend` varies.
    """
    graph: StateGraph = StateGraph(CompanionState)

    # Langfuse, when it is on and local. Identity otherwise, so every test and
    # every eval without keys runs exactly the graph it ran before.
    guard_backend = tracing.traced(guard_backend, "crisis classifier")
    gen_backend = tracing.traced(gen_backend, "llm call")
    t = tracing.node

    graph.add_node(
        "guard_in", t("guard_in", "guardrail", lambda s: nodes.guard_in(s, guard_backend))
    )
    graph.add_node("retrieve", t("retrieve", "retriever", lambda s: nodes.retrieve(s, retriever)))
    graph.add_node("decide", t("decide", "chain", lambda s: nodes.decide(s, gen_backend)))
    graph.add_node("generate", t("generate", "chain", lambda s: nodes.generate(s, gen_backend)))
    graph.add_node("guard_out", t("guard_out", "guardrail", lambda s: nodes.guard_out(s, cards)))
    graph.add_node("clarify", t("clarify", "chain", lambda s: nodes.clarify(s, gen_backend)))
    graph.add_node("act", t("act", "span", nodes.act))

    graph.set_entry_point("guard_in")
    graph.add_conditional_edges("guard_in", _after_guards, {"act": "act", "retrieve": "retrieve"})
    graph.add_edge("retrieve", "decide")
    graph.add_conditional_edges(
        "decide",
        _after_decide,
        {"clarify": "clarify", "retrieve": "retrieve", "generate": "generate"},
    )
    graph.add_edge("clarify", "act")
    graph.add_edge("generate", "guard_out")
    graph.add_edge("guard_out", "act")
    graph.add_edge("act", END)
    return graph.compile()
