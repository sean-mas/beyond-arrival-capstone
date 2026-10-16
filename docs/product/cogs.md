# Cost of delivery

First COGS estimate for this idea, 21.09.2026. Prices are September 2026 and **move**: re-check
every one before quoting a provider. Nothing here is a fetched-and-cited figure of the kind
`evidence.jsonl` requires; treat the whole file as a working estimate, not as evidence.

## Why this matters

The partners page argues that software changes what delivery costs, so a twelve-month aftercare
tier becomes sellable at a margin. That argument has never had a number behind it. This is the
number.

---

## Stage 1 · Capstone demo

One deployment, no customer, roughly 10 visits a week. Telegram and WhatsApp both deferred.

| Item | Monthly | Note |
|---|---|---|
| Frontend | **EUR 0** | none separate: `/chat` is served by the app. Settled 25.09.2026 |
| Backend | **EUR 0** | Render free, Frankfurt. Sleeps after 15 min, about a minute to wake |
| Postgres | **EUR 0** | Neon free tier. Not Render's: that one expires after 30 days, then is deleted 14 days later |
| LLM | **EUR 0** | Ollama Cloud (answers), Groq (crisis check), Hugging Face bge-m3 (search, $0.10 of credit a month) |
| Langfuse | **EUR 0** | Langfuse Cloud EU, Hobby: 50k units a month, 30 days kept. Live traces only |
| Redis | **none** | declined 25.09.2026: nothing to cache at this size. An in-app rate limit guards the quotas |
| **Total** | **EUR 0** | genuinely zero. Nothing is paid until the always-on decision below |

**On the free backend.** Render's free web service sleeps after ~15 minutes idle and takes ~50s
to wake. Because the frontend is on a CDN, the page still loads instantly; only the first message
is slow. Acceptable while building. **Not acceptable once the link goes to a relocation provider
you are pitching**, which is the audience the whole campaign exists to reach.

### Backend hosting, the options

| Option | Cost | Always on? | The catch |
|---|---|---|---|
| **Render free** | EUR 0 | no | sleeps after ~15 min, ~50s to wake |
| **Oracle Cloud Always Free** | EUR 0 | **yes** | a real ARM VM, 4 OCPU / 24 GB. You own OS patching, Docker, TLS and backups, and ARM capacity is reportedly hard to get provisioned |
| **Fly.io** | ~EUR 5 | yes | managed, one config change from Render |
| **Railway** | EUR 5 + usage | yes | Hobby includes EUR 5 of credit; always-on burns vCPU-seconds on top |
| Render Starter | ~EUR 7 | yes | egress capped at 5 GB, EUR 0.15/GB over |

**Two corrections, checked 21.09.2026.** Fly.io **no longer has a free tier at all**, though it
did historically. Koyeb's free compute tier is also gone; their free offering is now a Postgres
database with 5 hours a month. The free-and-always-on list really is just Oracle.

**Recommendation: Render free now, Fly.io later.** Oracle is the only way to get free *and*
always-on, but it trades a few hours of sysadmin for EUR 5 a month, and during a four-week
capstone where the content is the long pole that is the wrong thing to spend hours on. Revisit it
if this outlives the capstone and EUR 5 still matters.

**The trigger for paying is a moment, not a date:** when the link goes to a provider you are
pitching. Until then the 50-second wake costs nothing that matters.

---

## Stage 2 · First customer

One provider, ~50 families on twelve-month journeys, always up, Telegram and WhatsApp live.
Assume ~8 message-turns per family per month, so ~400 turns.

| Item | Monthly | Note |
|---|---|---|
| Backend, always-on | EUR 5 – 10 | Fly.io |
| Postgres | EUR 0 | Neon free still covers this |
| Frontend | EUR 0 | CDN |
| Telegram | EUR 0 | free, no per-message cost, ever |
| **WhatsApp — Meta** | **EUR 20 – 30** | Germany utility ~USD 0.055 per message |
| **WhatsApp — BSP** | **UNVERIFIED** | 360dialog / Twilio platform fee on top. **Get a written quote before promising a price** |
| LLM tokens | EUR 1 – 5 | ~1.3M in / 120k out per month |
| Langfuse | EUR 0 | free tier |
| **Total** | **~EUR 30 – 100** | |

### Against the price

`idea.json` models EUR 479 per 50-seat account per month. At EUR 30 – 100 of delivery cost that
is a **79 – 94 percent gross margin**, which is the first concrete support the margin argument on
the partners page has ever had. It is also the number a provider will ask for on a call.

---

## Three findings

**1. LLM tokens are not the cost. WhatsApp is.**
One to five euros of tokens against twenty to thirty of messaging, before the BSP fee. Every
instinct to optimise the model spend is optimising the wrong line.

**2. Self-hosting an open-weight model to save token costs is economically backwards.**
A GPU VPS runs EUR 50 – 200 a month to avoid EUR 1 – 5 of tokens. Twenty times the cost to save
one. The only defensible reasons to self-host here are data residency and vendor independence,
never price. Free hosted tiers serving open weights (Mistral, Groq, Google AI Studio) give the
open-weight benefits at zero.

**3. WhatsApp got more expensive on 01.10.2026, and it hits exactly this product.**
Meta replaced conversation-based pricing with per-message pricing, and from that date charges for
service replies and utility messages **inside the 24-hour window** too. This product is scheduled
nudges plus conversation, which is precisely the traffic that stopped being free. Any WhatsApp
quote modelled on the old rules is wrong.

## Postgres, because it is a common confusion

PostgreSQL the software is free and open source. What costs money is somebody else running it:
server, storage, backups, uptime. Three routes:

- **Neon free tier** — EUR 0 up to 0.5 GB, scales compute to zero but stays reachable
- **A container on your own host** — no extra fee, but backups and the volume are yours to own
- **Managed paid** — EUR 19+ once you outgrow a free tier

At this data volume, free lasts a long time. Twenty situation cards chunked is a few hundred KB;
fifty families of message log over a year is a few MB. Half a gigabyte is years away, and
**Supabase free is still the wrong choice** because it pauses a project after seven idle days.

## To verify before any of this is quoted

- [ ] BSP platform fee, written quote from 360dialog and from Twilio
- [ ] Meta's post-01.10.2026 per-message rates for Germany, from Meta's own page
- [ ] Mistral free-tier rate limits, from Mistral's own docs
- [ ] Groq free-tier limits for qwen3.8-27b, and whether 150 turns a day fits the Hugging Face $0.10 monthly credit
- [ ] Fly.io minimum always-on machine cost, from Fly's pricing page
- [ ] Whether Oracle Always Free ARM capacity is actually obtainable in the EU region, before relying on it
