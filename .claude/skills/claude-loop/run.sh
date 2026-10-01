#!/bin/bash
# Runs the claudex-loop plugin runner with a fresh Claude CLI session as the
# reviewer/inspector (Claude-only mode, no Codex/OpenAI access needed).
# Usage: run.sh review|inspect|check [runner args...]
set -euo pipefail

runner=$(ls -d "$HOME"/.claude/plugins/cache/claudex-loop/claudex-loop/*/skills/claudex-loop/scripts/runner.py 2>/dev/null | sort -V | tail -1)
[ -n "$runner" ] || { echo "claudex-loop plugin not found: /plugin install claudex-loop@claudex-loop" >&2; exit 1; }

mode=${1:?mode required}; shift
case "$mode" in review|inspect|check) ;; *) echo "unsupported mode: $mode" >&2; exit 2 ;; esac

# The runner requires the reviewer to differ from the planner, so the
# coordinating session is declared as --host codex. The child CLI must not
# inherit this session's id (in cloud sessions the remote vars pin it too),
# or it would not be an independent session.
exec env -u CLAUDE_CODE_SESSION_ID -u CLAUDE_CODE_REMOTE_SESSION_ID -u CLAUDE_CODE_REMOTE python3 "$runner" "$mode" --host codex --provider claude "$@"
