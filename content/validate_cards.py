#!/usr/bin/env python3
"""Check every card has the fields the ingest and the eval set depend on.

Run before ingesting. A card missing `sources` is a card whose claims cannot be
traced, and groundedness measured against it means nothing.

Review comments use HTML comment syntax so they never reach a family:

    <!-- REVIEW: too formal, nobody says "accompanying partner" -->
    <!-- FACT: check this threshold against the 2027 ordinance -->
    <!-- TONE: this paragraph sounds like a brochure -->

The ingest MUST strip these before chunking. One regex: re.sub(r"<!--.*?-->", "", text, flags=re.S).
They are excluded from the word count here and listed at the end as a work queue.
"""

import collections
import pathlib
import re
import sys

REQUIRED = [
    "id",
    "situation",
    "strand",
    "journey_months",
    "audience",
    "corridor",
    "title",
    "review_by",
    "sources",
    "must_not_say",
    "escalate_if",
]
STRANDS = {"orientation", "life_setup", "cultural_companion"}
AUDIENCES = {"employee", "partner", "child", "family"}

errors, warnings, review = [], [], []
ids, urls = {}, collections.Counter()
# Anchored to this file rather than the working directory. Run from the repository
# root it used to glob nothing, print "0 cards checked" and exit clean, which is
# character-for-character what a passing run looks like.
cards = sorted((pathlib.Path(__file__).resolve().parent / "cards").glob("*.md"))
if not cards:
    sys.exit("no cards found next to this script: refusing to report a pass")

for p in cards:
    txt = p.read_text(encoding="utf-8")
    m = re.match(r"^---\n(.*?)\n---\n(.*)$", txt, re.S)
    if not m:
        errors.append(f"{p.name}: no YAML frontmatter")
        continue
    fm, body_raw = m.group(1), m.group(2)
    for tag, note in re.findall(r"<!--\s*(\w+)?:?\s*(.*?)\s*-->", body_raw, re.S):
        review.append((p.name, tag or "NOTE", " ".join(note.split())[:90]))
    body = re.sub(r"<!--.*?-->", "", body_raw, flags=re.S)

    for key in REQUIRED:
        if not re.search(rf"^{key}:", fm, re.M):
            errors.append(f"{p.name}: missing `{key}`")

    cid = re.search(r"^id:\s*(\S+)", fm, re.M)
    if cid:
        if cid.group(1) in ids:
            errors.append(f"{p.name}: duplicate id {cid.group(1)} (also {ids[cid.group(1)]})")
        ids[cid.group(1)] = p.name

    st = re.search(r"^strand:\s*(\S+)", fm, re.M)
    if st and st.group(1) not in STRANDS:
        errors.append(f"{p.name}: strand '{st.group(1)}' not in {STRANDS}")
    au = re.search(r"^audience:\s*(\S+)", fm, re.M)
    if au and au.group(1) not in AUDIENCES:
        errors.append(f"{p.name}: audience '{au.group(1)}' not in {AUDIENCES}")

    for u in re.findall(r"https?://\S+", fm):
        urls[u.rstrip('"')] += 1

    n = len(body.split())
    if n < 140:
        warnings.append(f"{p.name}: body only {n} words")
    if n > 360:
        warnings.append(f"{p.name}: body {n} words, over target")
    if "—" in txt:
        errors.append(f"{p.name}: contains an em-dash")
    if re.search(r"^\s*[-*]\s+\w", body, re.M):
        warnings.append(f"{p.name}: body contains a bullet list, spec says Fliesstext")
    if not re.search(r"^##\s", body, re.M):
        errors.append(
            f"{p.name}: no section headings, so nothing actionable to ground an answer in"
        )
    heads = re.findall(r"^##\s+(.*)$", body, re.M)
    if len(heads) < 2:
        warnings.append(
            f"{p.name}: only {len(heads)} section(s); a card needs what-to-do and what-does-not"
        )

print(f"{len(cards)} cards checked")
print(f"{len(urls)} distinct source URLs across the corpus")
cov = collections.Counter()
for p in cards:
    fm = re.match(r"^---\n(.*?)\n---", p.read_text(), re.S).group(1)
    cov[re.search(r"^audience:\s*(\S+)", fm, re.M).group(1)] += 1
    cov[re.search(r"^strand:\s*(\S+)", fm, re.M).group(1)] += 1
print("coverage:", dict(cov))
for e in errors:
    print("ERROR  ", e)
for w in warnings:
    print("warn   ", w)
if review:
    print(f"\n{len(review)} open review comment(s):")
    for f, tag, note in review:
        print(f"  {f:<45} {tag:<7} {note}")
else:
    print("\nno open review comments")
sys.exit(1 if errors else 0)
