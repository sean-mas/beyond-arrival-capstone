#!/usr/bin/env python3
"""PostToolUse: run ruff on the Python files this tool call just touched.

Never blocks. PostToolUse fires after the edit has already happened, so blocking
here would achieve nothing except noise. It fixes what is auto-fixable and reports
the rest back to Claude, which then corrects it in the same turn.

Covers Bash as well as Write and Edit. A file written with `cat > f <<EOF` carries
no file_path in the payload, so a Write|Edit matcher never sees it. For Bash this
falls back to scanning for recently modified .py files.
"""

import json
import os
import subprocess
import sys
import time
from pathlib import Path

ROOT = Path(os.environ.get("CLAUDE_PROJECT_DIR", ".")).resolve()
MTIME_WINDOW = 120
SKIP = {".venv", "venv", ".git", "__pycache__", ".mypy_cache", ".ruff_cache", "node_modules"}


def touched(payload: dict) -> list[Path]:
    raw = (payload.get("tool_input") or {}).get("file_path")
    if raw:
        p = Path(raw)
        return [p] if p.suffix == ".py" and p.is_file() else []

    if (payload.get("tool_name") or "") != "Bash":
        return []

    cutoff = time.time() - MTIME_WINDOW
    out = []
    for p in ROOT.rglob("*.py"):
        if SKIP & set(p.parts):
            continue
        try:
            if p.stat().st_mtime >= cutoff:
                out.append(p)
        except OSError:
            continue
    return out


def main() -> int:
    try:
        payload = json.load(sys.stdin)
    except (json.JSONDecodeError, ValueError):
        return 0

    files = touched(payload)
    if not files:
        return 0

    args = [str(f) for f in files]
    subprocess.run(["ruff", "check", "--fix", "--quiet", *args], capture_output=True)
    subprocess.run(["ruff", "format", "--quiet", *args], capture_output=True)

    left = subprocess.run(["ruff", "check", *args], capture_output=True, text=True)
    if left.returncode != 0:
        print(f"ruff still reports issues after --fix:\n{left.stdout}", file=sys.stderr)

    return 0


if __name__ == "__main__":
    sys.exit(main())
