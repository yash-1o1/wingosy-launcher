# .parity — Argosy → Wingosy parity audit state

Durable state for the chronological Argosy → Wingosy feature-parity audit.
Not application code. Nothing here is compiled, bundled, or shipped.

| File | Purpose |
| --- | --- |
| `ARGOSY_WINGOSY_PARITY.md` | Source of truth: cursor, ledger, counts, candidate backlog, open decisions. |

## Rules

- Read `ARGOSY_WINGOSY_PARITY.md` **first**; treat it as the source of truth.
- Never advance the cursor past an Argosy commit that was not actually inspected.
- Every run that changes the audit must commit the updated tracker in the same push.

## Why the tracker lives here

It was previously kept at `C:\Users\yash6\repos\ARGOSY_WINGOSY_PARITY.md`,
deliberately outside both repositories, because a **local** Codex cron advanced
it and could read any path on the machine.

The runner moved to a **cloud** routine, which only sees repositories it checks
out. A local path is unreachable from there, and a run with no cursor would
restart the audit from the baseline commit every day. Keeping the tracker in
this repository is what makes the cloud runner correct.
