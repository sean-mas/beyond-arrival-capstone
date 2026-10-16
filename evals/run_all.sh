#!/usr/bin/env bash
# Every measurement in this project, on one commit, in one go.
#
#     make all
#
# **Why all of it rather than the new tiers only.** The guards changed on
# 24.09.2026 (541211f: deterministic return-intention and acute-status
# handovers, three new classifier policies, and a passport no longer tripping
# the permit rule). `01-thesis/expose.md` §6.2 requires that a difference
# between configurations be attributable to the generation stage alone, which
# holds only while the guards are identical across them. Tiers 1 and 2 were
# measured under the old guards, so comparing them against tiers 3 to 5 would
# compare two things at once.
#
# Every row this writes carries the same `git_sha`, which is what makes the set
# comparable and what a reader checks before putting two rows on one axis.
#
# Order is deliberate:
#   1. preflight, so a bad key costs ninety seconds rather than a night
#   2. guardrails, three minutes, and the direct measure of what changed
#   3. baseline 0, the floor everything else is read against
#   4. tiers 1 to 4, which all finish
#   5. tier 5 last, which will not finish tonight and is not meant to
#
# Tier 5 is about thirteen hours on Mistral's free throttle. It checkpoints
# every case, so it stops whenever you need the machine and continues with
#   make tier5 ARGS='--resume <run_id>'
# Losing it to the morning costs nothing. Running it earlier would cost the
# tiers that can finish.
#
# Tier 6 (DeepSeek) is out: the key was revoked on 24.09.2026 and the account
# had no balance. `make tier6` still works if that changes.
set -uo pipefail
cd "$(dirname "$0")/.."

PY=".venv/bin/python"
export DATABASE_URL="${DATABASE_URL:-postgresql+psycopg://companion:companion@localhost:5432/companion}"
export PYTHONPATH=src

say() { echo; echo "=== $* · $(date '+%H:%M:%S') ==="; }

run() {  # label, then the command
  local label="$1"; shift
  local now
  now=$($PY evals/codeprint.py | awk '/code_digest/ {print $2}')
  if [ "$now" != "$CODEPRINT_AT_START" ]; then
    echo
    echo "!!! measurement code changed mid-run: $CODEPRINT_AT_START -> $now"
    echo "    Steps before this one were measured on different code. Stopping"
    echo "    rather than adding rows that cannot be compared with them."
    exit 2
  fi
  say "$label"
  if ! "$@"; then
    echo "!!! $label stopped early. Whatever it completed is in its checkpoint."
    ls -t evals/results/checkpoints/*.jsonl 2>/dev/null | head -1 \
      | xargs -I{} basename {} .jsonl \
      | xargs -I{} echo "    resume: make tierN ARGS='--resume {}'"
  fi
}

# Refuse, rather than warn. On 24.09.2026 this warned, the run started anyway,
# and another session committed a prompt rewrite two hours in: tier 1 finished
# on v2 at 14:06, the commit landed at 14:22, tier 2 ran on v3. A warning
# scrolls past in a log nobody is watching at 2am.
if ! $PY evals/codeprint.py; then
  echo
  echo "  Measurement code is uncommitted. A run started now cannot be"
  echo "  reproduced from any commit, and every row would be stamped -dirty."
  echo
  echo "  Commit it, or start anyway with:  ALLOW_DIRTY=1 make all"
  echo
  [ "${ALLOW_DIRTY:-}" = "1" ] || exit 1
  echo "  ALLOW_DIRTY=1: continuing against a dirty tree."
fi

# The fingerprint at the start. Each step re-checks it, because every step is a
# fresh process and picks up whatever is on disk when it begins.
CODEPRINT_AT_START=$($PY evals/codeprint.py | awk '/code_digest/ {print $2}')
echo "  code_digest at start: $CODEPRINT_AT_START"

say "commit $(git rev-parse --short HEAD) · corpus $($PY -c 'import sys;sys.path.insert(0,"evals");import history;print(history.corpus_digest())')"

say "preflight"
if ! $PY evals/preflight.py; then
  echo "!!! no tier is usable. Stopping before anything spends a night."
  exit 1
fi

run "guardrails, 115 cases"        $PY evals/run_guardrails.py --crisis --core
run "baseline 0, judged"           $PY evals/run_baseline0.py --judge
run "tier 1, llama3.1:8b"          $PY evals/run_generation.py --tier 1
run "tier 2, gpt-oss:120b"         $PY evals/run_generation.py --tier 2
run "tier 3, nemotron-3-ultra"     $PY evals/run_generation.py --tier 3
run "tier 4, gemma4:31b"           $PY evals/run_generation.py --tier 4
run "tier 5, ministral-14b"        $PY evals/run_generation.py --tier 5

say "done"
$PY evals/history.py | tail -30
