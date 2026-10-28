#!/usr/bin/env bash
# Tiers 3, 4 and 5, one after the other, detached.
#
# Tiers 3 and 4 finish inside two hours. Tier 5 is about thirteen and will
# not finish in one night: that is expected, it checkpoints every case, and
# `make tier5 ARGS='--resume <run_id>'` continues it. Losing tier 5 to the
# morning costs nothing; running it first would cost tiers 3 and 4.
#
#     make overnight
#
# Sequential rather than parallel on purpose: the guards and the judge are
# local models on one GPU, and two hosted tiers running at once would queue
# behind each other there anyway while doubling the chance that a rate limit
# takes both down.
#
# Each tier checks its key before spending anything, so a missing key costs a
# second rather than an hour.
set -uo pipefail
cd "$(dirname "$0")/.."

PY=".venv/bin/python"
export DATABASE_URL="${DATABASE_URL:-postgresql+psycopg://companion:companion@localhost:5432/companion}"
export PYTHONPATH=src

# Shortest useful ordering: the two that can finish, then the one that cannot.
# Tier 3 leads because the weekly GPU quota on a free Ollama Cloud account is
# likelier to bite the second run than the first.
for tier in 3 4 5; do
  echo "=== tier $tier · $(date '+%H:%M:%S') ==="
  if ! $PY evals/run_generation.py --tier "$tier"; then
    # Keep going. A tier that fails on a key or a rate limit must not take the
    # other one down with it, and a partial comparison beats none by morning.
    # Whatever it completed is in its checkpoint and in a row marked partial.
    echo "!!! tier $tier stopped early. Resume it with:"
    ls -t evals/results/checkpoints/*.jsonl 2>/dev/null | head -1 \
      | xargs -I{} basename {} .jsonl \
      | xargs -I{} echo "      make tier$tier ARGS='--resume {}'"
  fi
done

echo "=== done · $(date '+%H:%M:%S') ==="
$PY evals/history.py | tail -20
