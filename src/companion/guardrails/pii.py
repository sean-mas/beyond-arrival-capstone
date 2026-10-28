"""Redact personal data before anything else reads the message.

This guard **never halts a turn**. `expect_refusal` is false on all eight PII
cases in `evals/adversarial.jsonl`, and that is not an oversight: redaction is
not refusal. The message is cleaned and then answered normally. See
`docs/product/refusal-definition.md`.

It runs first for a reason that is easy to lose. The redacted text is what the
crisis classifier sees, what the prompt is built from, and what the `messages`
table stores (`body_redacted`, redacted BEFORE insert). A guard placed after
any of those has already failed.

The eight entity types come from the cases rather than from a generic PII list,
because the cases are the specification:

    person name · street + postcode · phone · employer + site · Steuer-ID
    child name + school · IBAN · residence permit number

**Over-redaction is a real failure, not a safe default.** A guard that eats
"live at" along with the address hands the model a broken sentence to answer,
and the damage is invisible because the turn still looks redacted. Every
pattern here is anchored on a capital letter and the tests assert the exact
output string rather than that something was removed.

Names and employers are not solvable by pattern in general. They are solvable
here because the message announces them: "my name is", "my daughter", "works
at". That is a stated limit, and the eval set measures it.
"""

from __future__ import annotations

import re

from companion.guardrails.types import GuardName, Verdict

# Capitalised word, possibly hyphenated or multi-part. Never used with
# IGNORECASE: the capital is the whole point of the anchor.
_CAP = r"[A-ZÄÖÜ][\wäöüß'’]*"
_CAP_SEQ = rf"{_CAP}(?:[- ]{_CAP})*"

# A German street name is a compound ending in a street word ("Kantstrasse")
# or a hyphenated one whose last part is the street word ("Otto-Hahn-Ring").
_STREET_SUFFIX = r"(?i:stra(?:ss|ß)e|str\.|weg|allee|platz|gasse|ring|damm|ufer|chaussee)"
_STREET = rf"{_CAP}(?:-{_CAP})*?(?:-)?{_STREET_SUFFIX}"

PATTERNS: list[tuple[str, re.Pattern[str]]] = [
    ("IBAN", re.compile(r"\b[A-Z]{2}\d{2}(?:[ ]?[A-Z0-9]{4}){2,7}(?:[ ]?[A-Z0-9]{1,4})?\b")),
    ("PERMIT_NUMBER", re.compile(r"\b[A-Z]{1,3}\d{6,9}[A-Z]?\b")),
    ("TAX_ID", re.compile(r"\b\d{2} \d{3} \d{3} \d{3}\b|\b\d{11}\b")),
    ("PHONE", re.compile(r"\+?\d[\d\s/()-]{7,}\d")),
    # Street plus house number, optionally followed by postcode and city.
    ("ADDRESS", re.compile(rf"\b{_STREET}\s+\d+[a-z]?(?:\s*,?\s*\d{{5}}\s+{_CAP_SEQ})?")),
    ("POSTCODE_CITY", re.compile(rf"\b\d{{5}}\s+{_CAP_SEQ}")),
    (
        "SCHOOL",
        re.compile(
            rf"\b(?:Grundschule|Gesamtschule|Gymnasium|Realschule|Kita|Schule)"
            rf"(?:\s+(?:am|an\s+der|im|in\s+der|der|des))?\s+{_CAP_SEQ}"
        ),
    ),
    # A street name with no house number: an employer's site, as in a003.
    ("SITE", re.compile(rf"\b{_STREET}\b")),
    ("EMPLOYER", re.compile(rf"\b(?:works?|arbeitet)\s+(?:at|for|bei)\s+({_CAP_SEQ})")),
    (
        "PERSON_NAME",
        re.compile(
            rf"\b(?:my\s+(?:name\s+is|son|daughter|wife|husband|partner|child)|"
            rf"ich\s+hei(?:ss|ß)e|mein\s+(?:Sohn|Mann|Name\s+ist))\s+({_CAP_SEQ})"
        ),
    ),
]

_PLACEHOLDER = "[{}_REDACTED]"

# Capitalised words that follow a trigger phrase without being the entity.
# "my husband works at Siemens": without this, "Works" would be taken as the
# husband's name on a capitalised sentence start.
_NOT_A_NAME = {"Works", "Work", "Is", "Was", "Has", "And", "The", "A", "I"}


def redact(text: str) -> tuple[str, list[str]]:
    """Return the redacted text and the entity types found, in order."""
    spans: list[tuple[int, int, str]] = []

    for label, pattern in PATTERNS:
        for m in pattern.finditer(text):
            # Group 1 where the pattern needs context to locate the entity
            # ("works at Siemens" -> "Siemens"); the whole match otherwise.
            start, end = m.span(1) if m.groups() else m.span()
            if m.groups() and m.group(1).split()[0] in _NOT_A_NAME:
                continue
            if any(s < end and start < e for s, e, _ in spans):
                continue  # already covered by an earlier, more specific pattern
            spans.append((start, end, label))

    if not spans:
        return text, []

    spans.sort()
    out: list[str] = []
    found: list[str] = []
    cursor = 0
    for start, end, label in spans:
        out.append(text[cursor:start])
        out.append(_PLACEHOLDER.format(label))
        found.append(label)
        cursor = end
    out.append(text[cursor:])
    return "".join(out), found


def check(text: str) -> tuple[str, Verdict]:
    """Redact, and report what was found. Always CONTINUE.

    The verdict names the entity types and never the values: a guard that logs
    what it redacted has not redacted it.
    """
    redacted, found = redact(text)
    if not found:
        return redacted, Verdict.clean(GuardName.PII)
    return redacted, Verdict(
        guard=GuardName.PII,
        reason=f"redacted {len(found)} item(s): {', '.join(sorted(set(found)))}",
        detail={"entity_types": sorted(set(found)), "count": len(found)},
    )


# What the family is told when an identifier is removed, and where it belongs
# instead. Only identifiers someone could misuse: a school, a street name or an
# employer is context a family gives naturally, and a warning every time they
# mention one would teach them to ignore the warning. Added 29.09.2026, after
# the model answered a redacted IBAN with "Thanks for sharing your IBAN" (Sean's
# calibration row 22). A fixed sentence, because safety is decided in code: no
# prompt can forget to say it.
NOTICE_FOR = {
    "IBAN": ("your bank details", "the Kita or office will ask for them on its own form"),
    "TAX_ID": ("your tax ID", "only the office that asks for it needs it"),
    "PERMIT_NUMBER": ("your permit number", "only the office that issued it needs it"),
    "PHONE": ("your phone number", "I cannot call or text, but you can ask for a person here"),
    "ADDRESS": ("your address", "the office or provider that needs it will ask on its own form"),
}


def notice(verdict: Verdict) -> str | None:
    """One or two sentences for the start of the reply, or None."""
    found = verdict.detail.get("entity_types")
    kinds = [str(k) for k in found if k in NOTICE_FOR] if isinstance(found, list) else []
    if not kinds:
        return None
    what = [NOTICE_FOR[k][0] for k in kinds]
    listed = what[0] if len(what) == 1 else ", ".join(what[:-1]) + " and " + what[-1]
    return (
        f"I have removed {listed} from your message so it is not stored. "
        f"Please do not share it here: {NOTICE_FOR[kinds[0]][1]}."
    )
