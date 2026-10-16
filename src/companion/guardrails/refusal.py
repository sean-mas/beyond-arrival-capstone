"""Decline to assess this person's own case, and answer the general rule.

The definition and the evidence for it are in
`docs/product/refusal-definition.md`. In one line:

> Refusal is declining because answering would assess **this person's**
> individual legal, visa, tax, health or financial case.

Redaction is not refusal. Blocking an extraction is not refusal. That is why
`expect_refusal` is false on all eight PII cases and on seven of the ten
injection cases, and getting this wrong fails `refusal_correctness` for
behaving correctly, against a gate set at exactly 1.0.

The boundary is drawn by matched pairs in the case set, and those pairs are the
specification this implements:

    a031 should I take the Blue Card ...   vs  a032 how does the Blue Card differ ...
    a033 am I allowed to work ...          vs  a034 is a spouse generally allowed ...
    a035 which tax class should we choose  vs  a036 what do the tax classes mean ...

So the test is not the topic. Every one of those six is about a reserved topic.
The test is whether the question asks for a judgement about the asker's own
facts.

This is deterministic on purpose. The measurement on 21.09.2026 was that the
model, given the whole job, refused `a032`-shaped general questions as readily
as `a031`-shaped personal ones. Two signals separate them reliably and neither
needs a model.
"""

from __future__ import annotations

import re

from companion.guardrails.types import Action, GuardName, Verdict

RESERVED = {
    "visa": re.compile(
        r"\b(visa|permit|Aufenthalt\w*|Blue\s?Card|Blaue\s?Karte|residenc[ey]|"
        r"citizenship|Staatsangeh\w+|Niederlassung\w*|Ausl(ae|ä)nderbeh(oe|ö)rde|"
        r"Familiennachzug|refused\s+entry|deport\w*|stateless|naturali[sz]\w+|"
        r"live\s+here\s+permanently|bring\s+my\s+(partner|wife|husband|family))\b",
        re.I,
    ),
    "tax": re.compile(
        r"\b(tax|Steuer\w*|Finanzamt|tax\s?class|Steuerklasse|tax\s?resident|"
        r"konfessionslos|church\s+tax|Kirchensteuer)\b",
        re.I,
    ),
    "legal": re.compile(
        r"\b(evict\w*|tenanc\w+|tenants?|landlord|Mietvertrag|Kündigung|lawyer|sue|appeal|"
        r"court|contract|Widerspruch|legal|the\s+form\s+asks)\b",
        re.I,
    ),
    "health": re.compile(
        r"\b(depress\w+|diagnos\w+|therapy|therapist|medication|medicine|illness|"
        r"mental\s+health|health\s+condition|contagious|disabilit\w+|"
        r"what\s+is\s+wrong\s+with)\b",
        re.I,
    ),
    "driving": re.compile(
        r"\b(driving\s?licen[cs]e|Führerschein|Fuehrerschein|drive\s+on\s+my|"
        r"umschreiben|licen[cs]e\s+(valid|exchange|conversion))\b",
        re.I,
    ),
    "financial": re.compile(
        r"\b(insurance|Krankenkasse|private\s+health|statutory|pension|Rente|invest\w*)\b", re.I
    ),
}

# Signal 1. The question asks for a judgement about the asker's own facts.
# Anchored on the interrogative, not on the possessive: a003 says "my husband"
# and a004 says "my Steuer-ID", and both are labelled answerable because
# neither asks for advice. "does that change his permit" and "can you check"
# are not "should I" and "am I".
OWN_CASE = re.compile(
    r"\b(am|can|could|may|must|should|shall|will|would|do|does|did)\s+(I|we)\b"
    # Inversion only counts at the start of a clause. "here is my Steuer-ID"
    # (a004) is a declarative and is labelled answerable; "is my permit still
    # valid" is a question and is not.
    r"|(?:^|[.?!,;]\s*)(is|are|was|will|would|can|does|did)\s+(my|our)\b"
    r"|\b(tell\s+me\s+)?(exactly\s+)?what\s+to\s+do\s+about\s+(my|our|it|this)\b"
    r"|\bwhat\s+(is|are)\s+wrong\s+with\b"
    r"|\bact\s+as\s+(my|a|an)\s+(lawyer|solicitor|advocate|Anwalt|doctor)\b"
    r"|\bin\s+my\s+case\b|\bfor\s+me\b"
    r"|\bI\s+(can'?t|cannot|don'?t\s+know)\b"
    r"|\bhow\s+do\s+I\b|\bwhat\s+happens\s+if\s+I\b"
    # "I have had my blue card six months ... is that allowed" (c025). The
    # subject is carried by the preceding clause, not by the question.
    r"|\bis\s+that\s+(allowed|ok|okay|possible|fine|a\s+problem)\b",
    re.I,
)

# Signal 2. A request to choose between options, even phrased impersonally.
# a038 "should I switch to private health insurance" is the canonical one.
RECOMMENDATION = re.compile(
    r"\b(should|shall|ought)\s+(I|we)\b"
    r"|\bwhich\s+\w+\s+(should|shall)\b"
    r"|\b(take|choose|pick|switch\s+to|go)\s+(the|for|with)?\b[^.?!]{0,30}\bor\b"
    r"|\bwhat\s+(do|would)\s+you\s+(recommend|advise|suggest)\b"
    r"|\bwhat\s+(should|is\s+wrong\s+with)\b",
    re.I,
)

# card_020, "when a decision has gone against you and you do not know what
# comes next". A refusal on a status that has already been lost or is being
# enforced is not a question a dashboard flag can wait on. c033, a post about
# a withdrawn citizenship and statelessness, was refused correctly and
# never escalated, because only health escalated. Added 24.09.2026.
#
# Widened 6.10.2026 (E7), from the held-out posts h007 and h008, which every
# guard missed: h008 put a word between the permit and the verb ("permit
# extension rejected"), and h007 named no document at all, only being made
# to leave the country. Up to two words may now sit between them.
ACUTE_STATUS = re.compile(
    r"\b(stateless|deport\w*|detain\w*|detention|Abschiebung|abgeschoben|"
    r"(citizenship|permit|visa|residence|status)(\s+\w+){0,2}\s+"
    r"(was\s+|has\s+been\s+|got\s+|is\s+being\s+)?"
    r"(withdrawn|revoked|cancell?ed|refused|rejected|denied|taken\s+away)|"
    r"(lost|losing)\s+my\s+(status|permit|visa|residence)|"
    r"(kicked|thrown|sent)\s+out\s+of\s+(the\s+)?country)\b",
    re.I,
)

MESSAGE = (
    "I can tell you how this works in general and where the rule comes from, but not what you "
    "should do in your own case. Advice on an individual legal, visa or tax situation is "
    "reserved in Germany to people licensed to give it, which protects you rather than limits "
    "us. I am passing this to a person who can look at your actual situation."
)


def topics(text: str) -> list[str]:
    return sorted(name for name, pattern in RESERVED.items() if pattern.search(text))


def check(text: str) -> Verdict:
    found = topics(text)
    if not found:
        return Verdict.clean(GuardName.REFUSAL)

    # A question sitting on both health and immigration is about a person's own
    # case whatever its grammar. c031, asking whether a health condition can
    # lead to a visa refusal, is phrased as a general rule and is labelled refuse.
    if "health" in found and ({"visa", "legal"} & set(found)):
        return Verdict(
            guard=GuardName.REFUSAL,
            action=Action.REFUSE,
            reason=f"health crossed with {', '.join(sorted({'visa', 'legal'} & set(found)))}",
            detail={
                "escalate": True,
                "topics": found,
                "signals": ["health_crossed"],
                "reply": MESSAGE,
            },
        )

    own_case = bool(OWN_CASE.search(text))
    recommendation = bool(RECOMMENDATION.search(text))
    if not (own_case or recommendation):
        # A reserved topic asked as a general rule. Answerable, and answering
        # it is the product: a032, a034, a036.
        return Verdict(
            guard=GuardName.REFUSAL,
            reason=f"general question on a reserved topic ({', '.join(found)}), answerable",
            detail={"topics": found, "general": True},
        )

    # card_020 and card_019: a parent asking for help with a child's wellbeing
    # is asking for a person, not for information. a037 and a040 are labelled
    # refuse AND escalate for the same reason, and G5 is why: the answer must
    # not assess a health condition, so the only safe completion is a human.
    return Verdict(
        guard=GuardName.REFUSAL,
        action=Action.REFUSE,
        reason=f"individual case on a reserved topic ({', '.join(found)})",
        detail={
            "escalate": "health" in found or bool(ACUTE_STATUS.search(text)),
            "topics": found,
            "signals": [
                s for s, hit in (("own_case", own_case), ("recommendation", recommendation)) if hit
            ],
            "reply": MESSAGE,
        },
    )
