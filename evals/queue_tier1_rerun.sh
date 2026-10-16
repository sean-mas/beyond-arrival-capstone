#!/usr/bin/env bash
# Re-run tier 1 on prompt v3, once the current `make all` reaches tier 5.
#
# Tier 1 finished at 14:06 on prompt v2. 9cec543 landed at 14:22 and bumped the
# prompt to v3, so tier 2 and everything after it ran on a different prompt.
# Tier 1 is the odd one out and has to be measured again to be comparable.
#
# It waits rather than running now, because tier 1 is a local model and so is
# the judge: running it beside tier 3 would have them queue behind each other
# on one GPU and change the latency figure for both.
#
# Tier 5 is interrupted for it and resumed afterwards. Tier 5 is a thirteen
# hour run that was never going to finish tonight and checkpoints every case,
# so an hour's pause costs it nothing.
set -uo pipefail
cd "$(dirname "$0")/.."

PY=".venv/bin/python"
export DATABASE_URL="${DATABASE_URL:-postgresql+psycopg://companion:companion@localhost:5432/companion}"
export PYTHONPATH=src

say() { echo; echo "=== $* · $(date '+%H:%M:%S') ==="; }

say "waiting for tier 4 to finish"
until $PY -c "
import json, pathlib, sys
rows = [json.loads(x) for x in pathlib.Path('evals/history.jsonl').read_text().splitlines() if x.strip()]
sys.exit(0 if any(r['suite'] == 'tier-4' and r['run_at'] > '2026-09-24T09' for r in rows) else 1)
"; do
  sleep 120
done
say "tier 4 is in the history"

# Tier 5 will have started by now. Its run_id is captured BEFORE anything else
# runs, because "the newest checkpoint" stops meaning tier 5 the moment tier 1
# writes one: resuming tier 5 from tier 1's checkpoint would mark all 115 cases
# done and file tier 1's records under tier 5.
FIVE_RUN=""
FIVE=$(pgrep -f "run_generation.py --tier 5" || true)
if [ -n "$FIVE" ]; then
  # Read tier 5's OWN run_id out of its turn log, not "the newest checkpoint".
  # Measured 24.09.2026: tier 5 had run for 45 seconds and written no
  # checkpoint at all, so "newest" was tier 4's, and resuming from it marked
  # all 115 cases done and filed tier 4's numbers under tier-5 with seconds=0.
  # A resume target must be identified by the run it belongs to.
  FIVE_RUN=$($PY - <<'PYEOF'
import json, pathlib
rows = [json.loads(x) for f in sorted(pathlib.Path("private/runs").glob("turns-*.jsonl"))
        for x in f.read_text().splitlines() if x.strip()]
mine = [r for r in rows if r.get("model", "").startswith("mistral/")]
print(mine[-1]["run_id"] if mine else "")
PYEOF
)
  say "pausing tier 5 (pid $FIVE, checkpoint ${FIVE_RUN:-none})"
  kill "$FIVE" 2>/dev/null || true
  sleep 5
fi

say "tier 1 again, on prompt v3"
$PY evals/run_generation.py --tier 1 || echo "!!! tier 1 stopped early; its checkpoint holds what it did"

if [ -n "$FIVE_RUN" ]; then
  say "resuming tier 5 from $FIVE_RUN"
  $PY evals/run_generation.py --tier 5 --resume "$FIVE_RUN" || true
else
  say "starting tier 5"
  $PY evals/run_generation.py --tier 5 || true
fi

say "done"
$PY evals/history.py | tail -20
