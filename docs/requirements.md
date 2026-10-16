# Requirements, and how they are met

The course requirements are quoted verbatim in `../../requirements/capstone-1-ds-requirements.md`.
This file is the mapping, and it is deliberately the honest version: two of the five
deliverables do not come free from the build.

> **Settled 21.09.2026: the coaches confirmed working alone is allowed.** The written
> requirement says group work, 2 to 5 members, with a weekly PM rotation. Both are waived.
> **What is not waived is the table below**: the five required deliverables still separate
> the full Data Scientist Certificate from a Certificate of Attendance, and they do not get
> easier with one person doing them.

Two required deliverables do not come free from the build. They come from one addition: an
**eval set**. Build it in week 1 and both are covered.

| Required | How it is met |
|---|---|
| Business question, background, impact | The aftercare gap. The provider's contract closes around week six, and the administrative events that decide the assignment fall in months three to twelve. **Not** "the assignment fails in month four": that is an unsourced causal claim, killed from the landing page on 11.09.2026, and the repo holds no verified assignment-failure figure. See `product/README.md`. |
| **Technical EDA in Python and/or SQL** | On the corpus and the retrieval layer. See below. |
| **Multiple models compared against a baseline** | Baseline 0 is retrieval-only, no LLM. See below. |
| GitHub repo with work and slides | The repo |
| 10-minute presentation | The deck |

### The baseline is already in the architecture

The groundedness gate's fallback path, **send the retrieved card verbatim**, is a complete
system with no LLM in it. That is baseline 0. It is not a strawman: for a factual question
about a visa appointment, returning the provider's own paragraph may well beat a paraphrase.

| # | System | Model | What it tests |
|---|---|---|---|
| 0 | **Retrieval only, top-1 chunk verbatim** | none | the baseline. No generation at all |
| 1 | Local | `llama3.1:8b` | can this run at zero marginal cost |
| 2 | Hosted | `gpt-oss:120b` | what a large open model adds |
| 3 | Hosted | `nemotron-3-ultra` | the largest model available here |
| 4 | Hosted | `gemma4:31b` | a different family at mid size |
| 5 | Hosted | `ministral-14b-latest` | **a different vendor**, which nothing else in the ladder is |

Updated 24.09.2026, twice over. The original ladder said "mid-tier hosted" and
"frontier paid" without naming anything, and both assumptions failed on
contact. Gemini was tier 3 for a day: `gemini-2.5-pro` is retired for new keys,
Pro sits behind billing since May 2026, and the free Flash models measure **81
seconds a call**, which projects to about thirty hours for 115 cases. Its 8
completed cases are kept as `tier-3-gemini-partial` rather than deleted.

On Ollama Cloud, `kimi-k3`, `deepseek-v4-pro`, `glm-5.x`, `minimax`,
`qwen3.5:397b` and `mistral-large-3` all return **402 Payment Required** on a
free key. Six models are free, and the four tiers are chosen from them for
**family spread rather than a size ladder of one family**: Llama, GPT-OSS,
Nemotron, Gemma. A ladder of four sizes of one model says something about
parameters; four families says something about models.

**The limitation, and the tier that partly answers it:** tiers 2 to 4 share one
provider, so a latency or availability effect common to that provider is not
separable from a model effect. Tier 5 is the control: Mistral is the only
hosted vendor in the ladder that is not Ollama Cloud, which is why it is worth
having despite being the slowest by an order of magnitude.

Measured 24.09.2026 on a free Mistral key: **about 150 seconds on every call
whatever the model**, which is an account-level throttle rather than model
latency, and only `ministral-14b-latest` is permitted at all. `mistral-medium`,
`magistral-medium`, `mistral-small` and `magistral-small` all return 429. A
full turn is ~306 seconds, so 115 cases is roughly **ten hours**, run across
nights on the checkpoint rather than in one sitting.

**Three of these are analysed for the thesis**, not five. `01-thesis/expose.md`
§6.2 fixes three configurations varying only the generation stage: baseline 0,
tier 1 and tier 3. Tiers 2 and 4 are capstone-only and carry
`thesis_analysis: false` in every row they write. A test asserts the count so
it cannot drift.

Report per model: groundedness, refusal correctness, escalation recall, latency, cost per
turn. The interesting result is almost certainly **where the cheap option is already good
enough**, which is a cost argument a provider understands.

### The EDA is on the corpus and the retrieval layer

Real distributions, in Python and SQL, not decoration:

- Chunk length and token count distribution across the provider corpus
- **Cosine similarity score distribution** for retrieved chunks, and where relevance falls off
- recall@k as k varies from 1 to 20, which sets the k you actually ship
- Question-type balance in the eval set
- Duplicate and near-duplicate detection in the corpus
- Once live: turn counts, escalation rate, which situations actually arrive

The recall@k curve is the plot that earns its place in the deck. It picks a parameter.
