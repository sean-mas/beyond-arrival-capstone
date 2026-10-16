#!/usr/bin/env bash
# Stop hook: Claude may not declare itself finished while the tests fail.
#
# Exit 2 blocks and feeds stderr back to Claude, which then fixes and continues.
# Exit 0 allows the turn to end.
#
# The stop_hook_active guard matters: without it, a genuinely broken test suite
# means Claude can never finish. Claude Code overrides after 8 consecutive blocks,
# but that is a safety net, not a design.

set -uo pipefail
PAYLOAD=$(cat)

if command -v jq >/dev/null 2>&1; then
  ACTIVE=$(printf '%s' "$PAYLOAD" | jq -r '.stop_hook_active // false')
else
  ACTIVE=$(printf '%s' "$PAYLOAD" | grep -q '"stop_hook_active":[[:space:]]*true' && echo true || echo false)
fi

if [ "$ACTIVE" = "true" ]; then
  exit 0   # already blocked once and Claude is still working; do not trap it
fi

cd "${CLAUDE_PROJECT_DIR:-.}" || exit 0
[ -d tests ] || exit 0

OUT=$(python3 -m pytest -q --no-header -x 2>&1)
if [ $? -eq 0 ]; then
  exit 0
fi

{
  echo "BLOCKED: the test suite fails, so this turn is not finished."
  echo
  printf '%s\n' "$OUT" | tail -30
  echo
  echo "Fix the failing tests, or say explicitly why the failure is expected."
} >&2
exit 2
