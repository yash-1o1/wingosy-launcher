# Parity tracker branch

This branch has **no shared history with `main`** and contains no application
code. It exists only to hold durable state for the daily Argosy → Wingosy
feature-parity audit, so that a scheduled cloud agent can read and update it.

Nothing here is ever built, packaged, or shipped. Do not merge this branch into
`main`, and do not merge `main` into it.

## Files

- `ARGOSY_WINGOSY_PARITY.md` — the audit cursor, chronological ledger, open
  decisions, and run log. This is the source of truth; read it first on every
  run and update it in the same run.
- `codex-run-history.md` — run notes from the original Codex local cron
  (2026-09-16 to 2026-09-17), preserved when that automation was retired on
  2026-09-21.

## History

The audit ran as a local Codex cron from 2026-09-16, with the tracker stored
outside both repositories at `C:\Users\yash6\repos\ARGOSY_WINGOSY_PARITY.md`.
On 2026-09-21 it moved to a Claude Code scheduled cloud agent, which has no
access to that machine's filesystem — hence this branch.
