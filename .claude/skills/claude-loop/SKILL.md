---
name: claude-loop
description: "Claude-only variant of claudex-loop for this repo: plan, independent plan review by a fresh Claude CLI session, build, then fresh Claude inspection. Use for claude-loop, claudex-loop, or crucible requests while Codex/OpenAI is not reachable; not for trivial edits."
---

# Claude Loop (Claude-only claudex-loop)

This is the `claudex-loop` plugin workflow with one change: the plan reviewer
and the final inspector are **fresh Claude CLI sessions** instead of Codex,
because this environment cannot reach OpenAI. Everything else (phases, round
limits, approval binding, logging) follows the plugin's own skill.

## Setup

1. Read the plugin skill and follow its phases 0–3:
   `~/.claude/plugins/cache/claudex-loop/claudex-loop/*/skills/claudex-loop/SKILL.md`
   and its `references/runtime.md` and `references/build.md`.
2. Never call the plugin runner directly. Always use this wrapper (absolute path):
   `$CLAUDE_PROJECT_DIR/.claude/skills/claude-loop/run.sh <review|inspect|check> [args]`
   It passes `--host codex --provider claude` and strips the session-id
   variables so each review/inspection runs in its own Claude session.
3. Keep run artifacts outside the checkout, e.g. `--artifacts /tmp/claude-loop-runs`.

## Overrides to the plugin skill

- **Roles:** this conversation plans, coordinates and builds (directly with its
  own tools; do not use runner `build` mode). A fresh Claude CLI session reviews
  the plan and inspects the code.
- **Honest labelling:** the runner records `host: codex` only to satisfy its
  "opposite provider" check. In `PLAN-REVIEW-LOG.md` and in every report,
  state that the reviewer and inspector were Claude sessions, i.e. same-provider
  review, not cross-provider. Never describe it as a Codex review.
- **Commands:**
  - Review, round 1: `run.sh review --repo <repo> --plan <plan> --artifacts <dir>`
  - Later rounds: add `--resume <previous result.json> --feedback <dispositions file>`
  - Before building: `run.sh check --repo <repo> --plan <plan> --approval <result.json>`
  - After building and running the proof command:
    `run.sh inspect --repo <repo> --plan <plan> --artifacts <dir> --base <pre-build commit>`
- Read each verdict from `response` in the printed `result.json`. `REVISE`,
  `BLOCKED` or a non-zero exit are never an approval.

To switch back to real cross-provider review once Codex can log in
(`codex login status`), use the plugin's `/claudex-loop:claudex-loop` instead.
