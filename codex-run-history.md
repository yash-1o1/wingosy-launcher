# Daily Wingosy improvements memory

## 2026-09-16 parity-program update

- The user replaced the generic daily-improvement policy with a chronological Argosy-to-Wingosy parity audit.
- Durable audit state is stored at `C:\Users\yash6\repos\ARGOSY_WINGOSY_PARITY.md`; read and update it on every run.
- Begin with Argosy commit `900808dc5c938f0e42b779b4c1240a41d8bc4414` and never skip an inspected commit in the ledger.
- Implement one or two portable features per run; record non-portable, superseded, already-covered, decision-needed, and non-feature commits as dispositions.
- After historical parity, prioritize Argosy commits from the prior 24 hours; use generic Wingosy improvements only when no relevant new Argosy change exists.

## 2026-09-16T09:04:59-07:00

- Synced local `main` from `origin/main` at `41cfd5c` before editing.
- Fixed RomM URL normalization so mixed-case local hostnames such as `LOCALHOST` and `RomM.LOCAL` are recognized as local and receive `http://`; preserved the user's original hostname casing.
- Added two regression assertions in `src/utils/normalizeUrl.test.js`.
- Verification passed: targeted normalizeUrl tests (7/7), full unit suite (37/37), TypeScript typecheck, frontend lint (0 errors; 8 pre-existing warnings), and Vite production build (existing chunk-size warning only). Because npm was unavailable on PATH, checks ran via the configured bundled Node executable against the repository scripts; tool-created pnpm metadata was removed before commit.
- Committed as `c0289bb3aec7c84ed2c16cb25ef459a283314921` (`fix: normalize local RomM hostnames case-insensitively`) with verified author and committer `yash-1o1 <60495222+yash-1o1@users.noreply.github.com>`.
- Pushed successfully to `origin/main`; final local and remote SHA match, and the working tree is clean.

## 2026-09-17T09:07:03-07:00

- Read the durable tracker first, fetched both repositories, verified Wingosy was clean, and fast-forwarded Wingosy `main` from `c0289bb` to release commit `140318e` before editing.
- Audited the first eight Argosy commits in strict chronological order: `900808d..b7a5b79`. The tracker cursor is now `0e23a85`; counts are 8 / 2,741 audited with 0 portable candidates waiting.
- Exposed Wingosy's existing local per-game library status, 1–5 personal rating, and 1–5 difficulty persistence through one shared editor used by desktop and immersive game details. Fixed immersive refresh to reload the saved game directly.
- Verification passed: focused tests 2/2, full unit suite 39/39, TypeScript typecheck, frontend lint (0 errors; 8 pre-existing warnings), and Vite build (existing chunk-size warning only).
- Committed as `ba600c0e4d34c37c88602832ee11fd61aa4caffb` (`feat: add personal game ratings and status`) with verified author and committer `yash-1o1 <60495222+yash-1o1@users.noreply.github.com>` and pushed directly to `origin/main`. Local and remote match; the Wingosy tree is clean.
- Updated `C:\Users\yash6\repos\ARGOSY_WINGOSY_PARITY.md` with all eight ledger rows, current baselines, cursor/counts, run log, and one open decision: keep ratings/difficulty local for now or later add RomM-backed writes with an offline queue. Provisional recommendation remains local-only until the API contract and conflict semantics have integration coverage.
