# Next session · handover from 25.09.2026

Written at the end of the 24.09 to 25.09 sessions, before a two-day break.
Build freeze is **Fri 02.10**, mid-term **Mon 05.10**. Read this first, then
`docs/decisions.md` from 24.09 onward for the reasons.

## Where things stand

| Part | State |
|---|---|
| Handoff check (local `llama3.1:8b`) | recall **0.865**, precision 0.941 on the 115 development cases (fitted, `541211f`) |
| Refusals, PII | refusal 1.0 on the 115; PII 8/8. Two real refusal misses on the held-out posts (h007, h008) |
| Retrieval | right card in the top 6: 0.952 |
| Prompt | v3: router sees the material, every answer ends in a next step |
| Judge (local `qwen3:14b`) | **failed calibration**: kappa 0.13 grounded, 0.16 helpful (gate 0.6). Every judge-based quality number is unverified |
| Overnight tiers (24.09) | tier 2 `gpt-oss:120b` looks best, but on judge scores, so unconfirmed |
| `/chat` demo | works locally (`make run`, http://localhost:8000/chat) |
| Langfuse | self-hosted, stopped. `make langfuse-up`, then http://localhost:3100 |
| Render | **live**: https://beyond-arrival-deploy.onrender.com/chat, passcode-gated, free plan (sleeps when idle, 30 to 60 s to wake) |
| Render's crisis check | Groq `qwen3.8-27b`, recall 0.622. Weaker than local; the deck must say so |
| Database for Render | Neon, Frankfurt, cards loaded (62 chunks) |

## Step by step, in order

**1. Start the machine side** (2 min)

    make db             # pgvector, if it is not already up
    make langfuse-up    # only if you want traces

**2. Test a hosted judge** (10 min, runs by itself)

The local judge failed. Your 60 labels work for any judge, so a candidate is one run:

    HOSTED_MIN_INTERVAL_SECONDS=20 make judge-score ARGS='--judge groq:qwen/qwen3.8-27b'

Qwen is the only free model outside every tier's model family, which matters
because a judge grades its own family too kindly. Kappa 0.6 or more: it becomes
the judge. Below: try a Claude judge as a paid benchmark (`JUDGE_PROVIDER=anthropic`
is already in the config; check the price first). This was started on 25.09 and
stopped unfinished; nothing was written.

**3. Decide the handoff definition** (15 min, yours)

Open `private/labelling/holdout-decisions.html` in a browser (local only, never
exported). Eleven fresh forum posts you labelled "no human" were handed over by
the system. Decide per post: no human, flag, or person now. The scores update as
you click. Then tell Claude the result, or decide in Claude's browser pane so it
can read the choices directly. The groups:

- grief (3 posts): your development label for the same kind of case was **flag** (c063)
- whether to return home (4): development labels **flag** (c062, c068) and **person now** (c069)
- permit expired or fear of deportation (2)
- strong homesickness or loneliness (2)

Your blind pass is committed (`6863de0`) and stays as it was: this is a dated second pass.

**4. Re-grade the tiers with the new judge** (overnight)

Once a judge passes step 2, rerun on a committed, clean tree so no row is
stamped "dirty":

    make all

**5. Fix the two refusal misses** (2 h)

"Any advice?" and "Please help" on a legal or permit topic are not read as asking
about the person's own case (h007, h008). The held-out set is then used up as a
refusal test; say so in `docs/thesis-carryover.md`.

**6. Useful fallback when the output check blocks an answer** (half a day)

Today a blocked answer becomes "I would rather not give you a number". Better:
the card passage plus a next step. Seen on the private-or-statutory insurance question.

**7. Mid-term deck** (05.10)

Depends on step 4 for any quality claim. Safe to present today: handoff, refusal,
PII and retrieval numbers, the live demo, and the local-vs-live guard gap.

## Open decisions for Sean

1. The handoff definition (step 3)
2. Neon's tools inside Claude Code: set aside on 25.09, to be raised again. It
   changes Claude Code's own configuration, so it is its own decision
3. Whether to pay for a Claude judge if no free judge reaches 0.6

## Redeploying Render after a change

    make check           # tests
    make deploy-check    # builds the image, imports every module inside it
    bash publish/export-deploy.sh
    cd ~/Documents/beyond-arrival-deploy && git push --force origin main

The deploy repo is a script export: never edit it by hand, never add `evals/` or
`content/Knowledge layer/` to it. Render rebuilds on push, about 5 minutes.

## Things that are easy to trip over

- `.env` holds `RENDER_DATABASE_URL` and `RENDER_DEMO_PASSCODE` with a `RENDER_`
  prefix on purpose, so the laptop keeps its own database and no passcode.
- A run with an uncommitted tree is stamped `-dirty` in `evals/history.jsonl`.
- Groq free tier: 1,000 requests and about 200k tokens a day, 8k tokens a minute.
  Pace hosted runs with `HOSTED_MIN_INTERVAL_SECONDS`.
- Tracing only ever goes to localhost, and tests never trace (autouse fixture).
- The partial Groq judge run left no result file.
