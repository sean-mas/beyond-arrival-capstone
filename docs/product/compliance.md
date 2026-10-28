# EU AI Act and data protection: what a family companion actually triggers

Researched 11.09.2026, sources at the bottom, every date checked against the current state of
the law rather than the version most articles still describe.

**One correction already sits inside this file**, made the same day and left visible rather than
edited away: section 3's reading of the emotion recognition prohibition was wrong at first, and
section 5 was downgraded because of it. The prohibition is biometric-only, so text chat is
outside it.

**I am not a lawyer and this is not legal advice.** It is a map of which rules are in play so
that the expensive hour with a Fachanwalt für IT-Recht is spent on the two real questions
instead of the eight that turn out not to apply. Read the last section before any launch.

---

## The short answer

1. **Beyond Arrival, as currently scoped, is almost certainly not a high-risk AI system.**
   The obvious candidate, Annex III area 7 on migration and asylum, is restricted to competent
   public authorities. A private companion telling a family what the Ausländerbehörde itself
   publishes does not fall in it.
2. **Three transparency and conduct rules do apply, today, regardless of risk class**, and one
   of them (Article 50) only became applicable on 2 August 2026.
3. **The sharp constraint is not the AI Act. It is the GDPR**, and specifically the moment a
   child writes about being bullied and the product then tells a commercial company that the
   family is struggling. That single feature is the riskiest thing on the current landing page.
4. **The cultural companion does not change that**, and the reason is worth internalising: the
   AI Act classifies by **use case**, not by how sensitive the data is. Sensitivity is the
   GDPR's axis. Section 5b walks that strand specifically, including the one regulation that
   could catch it, which is the medical device rules rather than the AI Act.

---

## 1 · What is actually in force, as of today

The dates in most published guides are wrong now. The **Digital Omnibus on AI** was published
in the Official Journal on 24 July 2026 and entered into force on 27 July 2026, days before
the original high-risk deadline.

| Rule | Status on 11.09.2026 |
|---|---|
| Article 5 prohibitions | **Applies** since 2 February 2025 |
| Article 4 AI literacy | **Applies** since 2 February 2025, softened by the omnibus to "support the development of AI literacy among staff" |
| General-purpose AI model obligations (Art 51 to 56) | **Applies** since 2 August 2025 |
| **Article 50 transparency** | **Applies** since 2 August 2026, not delayed |
| Annex III standalone high-risk obligations | **Deferred to 2 December 2027** |
| Annex I embedded high-risk obligations | **Deferred to 2 August 2028** |
| Watermarking under Art 50(2), systems already deployed | grace period to 2 December 2026 |

The deferral is worth reading correctly. It buys time on the heavy conformity-assessment
machinery. It changes nothing about the prohibitions or the transparency duties, and it
changes nothing at all about the GDPR.

---

## 2 · Is it high-risk? Walking Annex III honestly

Four of the eight areas are worth checking, and three of them come back negative **only
because of how the product is scoped**. Those scope lines are now load-bearing.

| Annex III area | Verdict | The line that keeps it there |
|---|---|---|
| **7 · Migration, asylum, border control** | Not in scope | The area is restricted to **competent public authorities** and bodies acting for them. Telling a family which deadline applies and what the authority publishes is not a use by an authority. |
| **3 · Education and vocational training** | Not in scope, **narrowly** | The listed uses are admission decisions, evaluating learning outcomes, monitoring prohibited behaviour in tests, and **"assessing the appropriate level of education"**. Helping a child who is struggling socially is none of those. **Recommending which school track a child should be placed in would be.** |
| **5 · Essential private and public services** | Not in scope, **narrowly** | This area covers **creditworthiness evaluation**, and it does apply to private actors. Explaining what a Schufa score is and how to get one is information. **Scoring or predicting whether a family will be accepted by a landlord would not be.** |
| **4 · Employment and workers' management** | Not in scope **here** | Recruitment filtering, candidate evaluation, and decisions on work terms or performance monitoring are high-risk, for any employer, not just public ones. Helping the accompanying partner write applications is a tool used **by the candidate**, which is the right side of this line. |

**Three product rules follow directly, and they are cheap to hold now and expensive to retrofit
later.** No school-placement recommendations. No scoring of a family's chances with a landlord,
an authority or an employer. Nothing sold to an employer that evaluates the person.

---

## 3 · What applies anyway, high-risk or not

**Article 50(1), applicable since 2 August 2026.** The family must be informed that they are
interacting with an AI system, "in a clear and distinguishable manner at the latest at the time
of the first interaction", unless that is obvious to a reasonably well-informed person. In a
white-label product carrying a relocation provider's brand, obviousness is exactly what cannot
be assumed. **This is a first-run screen, not a line in the terms.**

**Article 50(2).** Synthetic output must be marked machine-readably as artificially generated.

**Article 4, AI literacy.** It falls on providers **and deployers**, so it is an obligation the
relocation provider inherits the moment they put this in front of a family. Worth saying out
loud in a sales conversation: buying a documented product with training materials discharges
something they would otherwise owe on their own build.

**Article 5(1)(b), exploitation of vulnerabilities.** Prohibited to exploit vulnerabilities
"due to their age, disability or **a specific social or economic situation**" with the object or
effect of materially distorting behaviour. A newly arrived family who cannot read the language
of the authority they are dealing with is squarely a specific social situation, and the children
are covered by age. This does not ban the product. It bans dark patterns, manufactured urgency,
and upsells timed to a moment of distress. Given that the commercial model is a provider selling
a tier, the pressure to do exactly that will exist, so it belongs in the design rules.

**Article 5(1)(f), emotion recognition. Corrected 11.09.2026, and the correction matters.**
The prohibition covers inferring emotions "in the areas of workplace and education
institutions". My first reading stopped there and was wrong, because the operative word is the
defined term. Article 3(39) defines an emotion recognition system as one that infers emotions
**"on the basis of their biometric data"**, and Recital 18 says outright that inferring emotion
from written text, including sentiment analysis, is not based on biometric data and therefore
**falls outside the prohibition**.

So the line is not "does it deal with feelings". It is **what the inference is computed from**:

| Input | Inside the prohibition? |
|---|---|
| Typed chat, free text, written check-ins | **No.** Plain text is not biometric data |
| Voice notes, with emotion inferred from how it was said | **Yes.** Recital 18 names characteristics of a person's voice such as a raised voice or whispering |
| Camera, facial expression | **Yes** |
| Self-reported mood, a slider or a picked option | **No.** It is a declaration, not an inference |

**Two design rules follow.** Keep the emotional layer text-based and self-reported. If voice
input is ever added, emotion must not be inferred from the audio, and in a workplace context
that is a prohibition with no deferral and no conformity assessment that cures it.

---

## 4 · The GDPR is the real constraint, and it lands on one feature

A child typing about being bullied at school produces, in one message, several things at once.

**It is very likely special category data under Article 9.** Data concerning health covers
mental as well as physical health. Distress described by a child, sustained over weeks, is not
ordinary contact data. Special category data is prohibited by default and needs a specific
Article 9(2) condition on top of an Article 6 legal basis. In this setting that realistically
means **explicit consent**, which has to be freely given, which is awkward when the relocation
provider's corporate client is paying.

**The child is a vulnerable data subject, and in Germany the consent age is 16.** Germany did
not use the opening clause to lower the Article 8 threshold to 13, so for information society
services the age is 16. Under that, parental authorisation is required and must be verifiable.
**This is a product decision that cannot be deferred:** either the child-facing surface does not
exist and everything runs through the parent, or there is a real parental-consent flow. The
first is much cheaper and probably right for version one.

**A DPIA is effectively mandatory.** The WP248 criteria endorsed by the EDPB treat two matches
as the trigger, and this hits at least four: sensitive or highly personal data, vulnerable data
subjects including children, innovative use of new technology, and systematic monitoring if the
signal-back feature exists. Large-scale processing of special category data is in any case one
of the always-mandatory cases.

**The white-label structure decides who is responsible.** The relocation provider determines
purposes and means towards their client, so they are most likely the **controller** and Sean the
**processor**, which requires an Auftragsverarbeitungsvertrag under Article 28 before a single
family is onboarded. This is a genuine selling point, since it is work the provider does not
have to do if they buy rather than build, and it is a real cost on this side.

### The feature that has to change

> "When a family goes quiet, or circles the same problem for three weeks, you see it."

That sentence is live on the page right now. Read against the above, it describes **disclosing
inferences drawn from a child's account of being bullied to a commercial third party.** That is
the single highest-risk thing in the design, and it is riskier under the GDPR than anything the
AI Act says about it.

There is a version that survives and it is not much weaker commercially:

- The provider sees **usage**, not content. Whether the companion is being used, whether an
  offered human check-in was declined, and which **category** of topic is active. Never text,
  never quotes, never an inferred emotional state.
- The family can ask for a human, and that request is the event the provider sees. The signal
  is then **consented, per event, by the person it concerns**, which is a far stronger footing
  than any inference.
- Anything a child writes stays on the family surface and is never an input to a provider-facing
  signal at all.

That still delivers the commercial argument, which was "software detects, the human bills". It
just moves the detection from inference to an action the family took on purpose.

---

## 5 · Cross-campaign flag, not acted on here

**Downgraded on 11.09.2026 after the Article 3(39) correction above.** My first version of this
section said Article 5(1)(f) bites Beyond the Workshop and Beyond First Weeks. On the biometric
definition it does not, as long as both stay text-based, which they currently are.

What survives, and it is narrower but harder:

- **Both** must stay away from voice or video emotion inference. In a workplace context that is
  a prohibition in force since 2 February 2025, not a compliance exercise.
- **Beyond First Weeks is the exposed one, and not for emotional reasons.** Annex III area 4
  covers systems making decisions on work terms and performance monitoring, for any employer.
  Anything that informs a probation decision is a decision on work terms. That is high-risk
  from **2 December 2027**, and the page currently sells a manager-facing signal into exactly
  that moment.
- **Beyond the Workshop** sits further out, since a trainer's follow-up is not itself an
  employment decision. It moves in the moment a report about a named participant reaches
  their employer.

Neither is resolved here and neither should be resolved inside this idea folder. Both need the
same walk through Annex III that section 2 gave Beyond Arrival, before their pages promise
something the product cannot legally keep.

## 5b · The cultural companion specifically, since that is the half that worries you

The end-to-end product is three strands: visa and administrative information, the practical
search for a flat, and the cultural companion that recalls what the client learned in their
preparation training and helps them through culture shock around month four. The third strand
holds the most sensitive material, so the question is fair. The answer is not the one intuition
suggests.

**The AI Act does not have a sensitivity trigger.** It classifies by **use case and by who
uses it**, never by how personal the data is. Annex III has no entry for emotional support,
wellbeing, coaching or counselling. Sensitivity of data is the **GDPR's** axis, and that is
where this strand lands hard, exactly as section 4 sets out. So "this is sensitive, therefore
the AI Act covers it" is the wrong mapping, and getting it right is what stops a month of
compliance work aimed at the wrong regulation.

**Three things do reach the cultural strand, and none of them make it high-risk:**

1. **Article 50(1).** The client must be told they are talking to an AI, at the first
   interaction. This matters most precisely here: an emotional-support surface is where the
   illusion of a human relationship is most likely to form, and most damaging when it breaks.
2. **Article 5(1)(b).** A person in culture shock is in "a specific social situation" and is
   vulnerable within the meaning of the prohibition. Nothing in this strand may be designed to
   materially distort their behaviour: no manufactured urgency, no upsell timed to a low point,
   no engagement mechanics that reward staying in distress. This is a real constraint on a
   product whose commercial partner is paid per renewal.
3. **Article 5(1)(f)**, only if voice or video is used, per the corrected table above.

**The regulation that could actually catch this strand is not the AI Act at all.** If the
product is positioned as diagnosing, preventing, monitoring or treating a mental health
condition, it becomes **medical device software under the MDR**, and intended purpose is judged
from the manufacturer's own words: labelling, instructions, promotional and sales material. Two
products with identical code sit on opposite sides of that line based on their marketing copy.

**Where the line runs, in the words you would actually write:**

| Safe | Reclassifies you |
|---|---|
| "recalls what you learned in your training" | "treats adjustment disorder" |
| "helps you make sense of what is happening" | "reduces depression and anxiety" |
| "the normal course of culture shock, and what people find helps" | "clinically proven to improve mental health" |
| "if this is more than culture shock, here is where to get real help" | staying silent and letting the user believe this is care |

Note the last row. A referral path out is not only the safe option, it is the **honest** one,
and the absence of one is what turns a coaching product into something pretending to be care.
Given that the users include children, this is the single design decision I would not defer.

**One thing that is not law here but is coming.** Through 2026 a wave of rules aimed at AI
companions and minors has been passing in the United States, at state and federal level:
disclosure of non-human status, crisis protocols, breaks, and in some proposals age
verification. **None of it binds a German product.** It is worth knowing only because it tells
you which features regulators reach for first, and because a corporate client with a US parent
may ask.

## 6 · What I would propose putting on the website

Sean's decision, presented as options rather than written into the page.

1. **One line inside the existing "Where it stops" card.** "The family is told at the first
   message that they are talking to an AI, because the law requires it and because pretending
   otherwise would be the fastest way to lose their trust." Cheap, true, and it turns a
   compliance duty into a character statement.
2. **Replace the signal-back card's promise** with the consented version above. This is the one
   I would do regardless of what goes on the page, because the page is currently describing a
   feature I would advise against building.
3. **A short "Datenschutz" paragraph aimed at the provider, not the family.** A German provider
   will be asked about this by their corporate client, and having an answer is a differentiator
   against building it themselves. Three facts: processor not controller, AVV ready, DPIA done.
   **Do not write this until it is true.**

What I would **not** put on the page: an AI Act badge, a compliance section, or anything that
reads as reassurance. This audience has no idea yet whether they want the product. Compliance
copy before interest reads as a company with something to apologise for.

---

## 7 · Not verified, and worth an hour of a real lawyer

- The omnibus dates come from law-firm summaries, not from a reading of the Official Journal
  text. Verify before quoting them to a customer.
- Whether a sustained account of a child's distress is "data concerning health" under Article 9
  is a judgement call. I have assumed the conservative answer. A lawyer may say otherwise and
  that would materially simplify the design.
- The controller and processor allocation depends on the actual contract with the provider and
  with their corporate client. Three-party mobility arrangements are frequently joint
  controllership, which changes the paperwork.
- Whether parental authorisation can be obtained through the relocation provider rather than
  directly, and what counts as verifiable, is unresolved and is the question I would ask first.

## Sources

- Digital Omnibus on AI, deferral dates and what was not delayed: Gibson Dunn, https://www.gibsondunn.com/eu-ai-act-omnibus-agreement-postponed-high-risk-deadlines-and-other-key-changes/
- Annex III, the eight high-risk areas and their scope limits: https://artificialintelligenceact.eu/annex/3/
- Article 5, prohibited practices, points (b) and (f) quoted: https://artificialintelligenceact.eu/article/5/
- Article 50, transparency obligations and the timing rule in paragraph 5: https://artificialintelligenceact.eu/article/50/
- Article 25(1)(a), rebranding a high-risk system makes you its provider: https://artificialintelligenceact.eu/article/25/
- Article 8 GDPR, child consent in information society services: https://gdpr-info.eu/art-8-gdpr/
- WP248 rev.01 DPIA criteria, endorsed by the EDPB: https://www.mccannfitzgerald.com/knowledge/privacy/data-protection-impact-assessment-guidelines
- Article 3(39) and 3(34), the definitions that make the emotion prohibition biometric-only: https://artificialintelligenceact.eu/article/3/
- Recital 18, which states that inferring emotion from written text is not based on biometric data: https://ai-act-law.eu/recital/18/
- Emotion recognition and sentiment analysis, practitioner reading of the same point: https://www.williamfry.com/knowledge/the-time-to-ai-act-is-now-a-practical-guide-to-emotion-recognition-systems-under-the-ai-act/
- Medical device software and why marketing copy decides classification: https://www.lexology.com/library/detail.aspx?g=993d6af9-bb18-4aa5-aa5a-fffa6545f404
