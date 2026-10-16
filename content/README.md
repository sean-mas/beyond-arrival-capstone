# Situation cards

Twenty cards, written 16.09.2026, for the Capstone 1 companion. This is the corpus.
`README.md` one level up says it plainly: the corpus is the risk, not the code.

**Corridor for v1: any non-EU country to Germany.** The legal content depends on the
sponsor's permit type rather than on the origin country, so it holds across origins.
The social content is written origin-neutral. If a specific corridor is chosen later,
cards 14, 15 and 20 are the ones that need origin-specific detail added.

---

## Read this before editing a single card

### The product premise is not supported by the adjustment literature, and the cards are written around that

Beyond Arrival's pitch says the hard part is "months three to twelve". The U-curve
model behind that idea, honeymoon then crisis then recovery, **does not survive
testing**:

- Ward, Okura, Kennedy & Kojima (1998) measured sojourners at arrival, 4, 6 and 12
  months. Distress was **highest at entry** and declined. No U appeared in either
  psychological or sociocultural measures. https://doi.org/10.1016/S0147-1767(98)00008-X
- Bhaskar-Shrinivas, Harrison, Shaffer & Luk (2005) tested it meta-analytically
  across 66 studies and 8,474 expatriates. Not supported.
  https://doi.org/10.5465/amj.2005.16928400
- Church (1982) had already concluded the support was weak.
  https://doi.org/10.1037/0033-2909.91.3.540
- Hippler, Brewster & Haslberger (2015) argue the field has systematically neglected
  time, which is why no defensible timeline exists.
  https://doi.org/10.1080/09585192.2015.1041762

**No card promises a dip at month six or a recovery at month nine.** Where timing
appears, it is described as what people report, sourced to forums, not asserted as a
curve.

**What is supported, and what the cards are built on instead:**

| Claim | Source |
|---|---|
| Adjustment separates into work, interaction and general living, and these move at different rates | Black, Mendenhall & Oddou (1991), https://doi.org/10.5465/amr.1991.4278938 |
| The partner's adjustment and the employee's are linked, including intent to stay | Black & Stephens (1989), https://doi.org/10.1177/014920638901500403 |
| Accompanying-partner adjustment has its own tested model | Shaffer & Harrison (2001), https://doi.org/10.1037/0021-9010.86.2.238 |
| Problem-focused coping improved every type of spouse adjustment; emotion-focused coping worsened it. 191 couples, 37 countries | Chen & Shaffer (2018), https://doi.org/10.1108/JGM-07-2016-0032 |
| Accompanying partners commonly experience identity threat, distinct from logistics | Collins & Bertone (2017), https://doi.org/10.1108/JGM-01-2017-0003 |
| Partners report inadequate organisational support | McNulty (2012), https://doi.org/10.1080/13678868.2012.721985 |
| Wanting to leave early is driven by satisfaction, not by adjustment scores directly | Goede (2020), https://doi.org/10.1108/JGM-02-2020-0009 |
| For children: peer acceptance, school quality and parental support are the levers | de Sivatte et al. (2019), https://doi.org/10.1108/JGM-11-2018-0058 |
| For children: age, school success and attitude toward the move predict adjustment. 324 children | Warinowski & Laakkonen (2020), https://doi.org/10.18357/ijcyfs111202019471 |

### Never print a failure-rate percentage

Figures like "40% of assignments fail" are folklore. Harzing (1995, 2002) traced them
through the citation network and found they rest on misquotation rather than data.
Harzing & Christensen (2004) argue the concept is too ill-defined to measure at all.
https://doi.org/10.1080/09585199500000028 · https://doi.org/10.1002/job.125

This repo has already killed one fabricated statistic of exactly this shape on
29.08.2026. Do not reintroduce the genus.

### Every euro figure and threshold is dated and will go stale

Blue Card thresholds, the Beitragsbemessungsgrenze, the JAEG and the integration
course hourly rate all change on 1 January. Cards state the **legal mechanism** as the
durable fact and the euro figure as a dated instance. `review_by` in each card's
frontmatter is when that card must be re-checked.

One official page is already wrong: the Auswärtiges Amt English Blue Card FAQ still
prints superseded thresholds and a superseded 33-month settlement figure. Official is
not the same as current.

### The legal boundary, per G5 and the product guardrail

Cards give **information and preparation**. They never give advice on an individual
case, which German law reserves for licensed providers, and they never diagnose,
prevent, monitor or treat a health condition. Every card carries `must_not_say` and
`escalate_if` so the boundary sits on the content rather than only in a prompt.

---

## Card schema

```yaml
id: card_007                 # stable, never reused
situation: partner_work_rights
strand: life_setup           # orientation | life_setup | cultural_companion
journey_months: [0, 12]      # when this is usually relevant, NOT a claim about a curve
audience: partner            # employee | partner | child | family
corridor: "*-DE"
title: ...
review_by: 2027-01-31        # figures inside change annually
sources: [...]               # every factual claim traceable to one of these
must_not_say: [...]
escalate_if: [...]
related: [card_009]
```

Body is 150 to 250 words, second person, plain, written to be read by someone tired.
No bullet lists in the body, no cheerfulness, no exclamation marks.

## Register

Taken from what people actually write. They say numb, aimless, boring, caged. They do
not say "struggling with cross-cultural adjustment". Match the first register, never
the second.

## The twenty

| # | id | Audience | Strand |
|---|---|---|---|
| 1 | card_001_anmeldung_chain | family | life_setup |
| 2 | card_002_appointment_that_does_not_exist | family | life_setup |
| 3 | card_003_partner_work_rights | partner | life_setup |
| 4 | card_004_health_insurance_choice | family | life_setup |
| 5 | card_005_driving_licence_deadline | family | life_setup |
| 6 | card_006_kita_place | family | life_setup |
| 7 | card_007_tax_class_one_earner | family | life_setup |
| 8 | card_008_anerkennung | partner | life_setup |
| 9 | card_009_job_search_length | partner | orientation |
| 10 | card_010_days_without_shape | partner | cultural_companion |
| 11 | card_011_not_allowed_to_be_unhappy | partner | cultural_companion |
| 12 | card_012_one_thriving_one_not | family | cultural_companion |
| 13 | card_013_what_helps_what_does_not | partner | cultural_companion |
| 14 | card_014_freund_und_bekannte | family | cultural_companion |
| 15 | card_015_work_is_not_social | employee | cultural_companion |
| 16 | card_016_integration_course | family | orientation |
| 17 | card_017_first_friends_leave | family | cultural_companion |
| 18 | card_018_school_without_the_language | child | orientation |
| 19 | card_019_how_children_actually_do | family | cultural_companion |
| 20 | card_020_talking_to_a_person | family | orientation |
