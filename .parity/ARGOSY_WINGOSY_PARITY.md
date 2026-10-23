# Argosy → Wingosy parity tracker

This file is the durable source of truth for the daily Argosy parity review.
It is committed under Wingosy's `.parity` directory so local and cloud runs share
one chronological cursor and one decision record.

## Objective

Audit Argosy's `origin/main` history from its first commit to its latest commit in
strict chronological order. Record every commit reviewed. Implement one or two
portable, worthwhile Argosy features in Wingosy per daily run until the audit and
portable-feature backlog are complete. After parity, inspect new Argosy commits
from the previous 24 hours; only when there are no relevant new commits should the
job make a small independent Wingosy improvement.

Parity means feature parity where it makes sense for Wingosy's Windows/Tauri
architecture. It does not mean copying Android-only implementation details,
branding, release metadata, obsolete intermediate fixes, or code verbatim.

## Repositories and baseline

- Argosy: `C:\Users\yash6\repos\argosy-launcher`
- Wingosy: `C:\Users\yash6\repos\wingosy-launcher`
- Argosy first commit: `900808dc5c938f0e42b779b4c1240a41d8bc4414` — Initial commit: Argosy Launcher
- Argosy baseline observed: `98562a1e7c6679eaa1edf91ce440655479520eaa` — 2026-10-23 (2026-10-23 run)
- Baseline history size: 3,366 commits on `origin/main`
- Wingosy baseline observed: `7db590e` — 2026-10-23 feature commit
- Audit direction: oldest → newest, first-parent-independent chronological order from `git log --reverse origin/main`

### Baseline correction (2026-09-23)

The 2026-09-22 correction to `f18070b` / 805 commits came from an incomplete
view of the remote and was itself stale. A fresh fetch on 2026-09-23 verifies
`origin/main` at `30d42ccb12ba696feec0f070e9a7d55f2ae83d82` with 2,854 commits.
The formerly rejected SHA `a1e8437463c95b4a34bc9b8a6f6005ad5cf0c7c4`
exists, is an ancestor of the current tip, and is commit 2,842 in the same
reverse history. The chronological cursor did not need to move or rewind:
`c21a65e` remains commit 55 and its recorded next commit `3de24f3` remains
commit 56. Only aggregate baseline metadata was corrected before this run's
six newly audited commits were appended.

### Baseline refresh (2026-09-24)

A fresh fetch advanced Argosy `origin/main` from `30d42cc` / 2,854 commits to
`8b3eed9` / 2,890 commits. The stored chronological cursor was still valid:
`b03791b` remained commit 61 and `623563de` remained commit 62. The baseline
metadata was refreshed without skipping or reordering history.

### Baseline confirmation (2026-09-25)

A fresh fetch left Argosy `origin/main` unchanged at `8b3eed9` / 2,890
commits. The stored cursor remained valid: `b7f891c` was still commit 78 and
`6dd07eb` was still commit 79. Only the observation date was refreshed before
the next six chronological dispositions were appended.

### Baseline refresh (2026-09-29)

A fresh fetch advanced Argosy `origin/main` from `8b3eed9` / 2,890 commits to
`60dc343` / 2,956 commits. The stored chronological cursor remains valid:
`16a398c` is still commit 84 and `f4cda7d` is still commit 85. Aggregate
metadata was refreshed without moving or reinterpreting the valid cursor.

### Baseline refresh (2026-10-02)

A fresh fetch advanced Argosy `origin/main` from `60dc343` / 2,956 commits to
`c1b8371` / 3,060 commits. The chronological cursor remained valid:
`eca9c0f` was still commit 90 and `dd67a69` was still commit 91. Aggregate
metadata was refreshed without skipping or reordering history.

### Baseline refresh (2026-10-03)

A fresh fetch advanced Argosy `origin/main` from `c1b8371` / 3,060 commits to
`9cbc743` / 3,080 commits. The chronological cursor remained valid:
`b058467` was still commit 120 and `7d0d783` was still commit 121. Aggregate
metadata was refreshed before the next ten chronological dispositions were
appended.

### Baseline refresh (2026-10-04)

A fresh fetch advanced Argosy `origin/main` from `9cbc743` / 3,080 commits to
`1d58f89` / 3,087 commits. The chronological cursor remained valid:
`7d54348` was still commit 130 and `35fd921` was still commit 131. Aggregate
metadata was refreshed without skipping or reordering history.
The stored candidate total was also reconciled from 20 to the 21 candidate
ledger rows already present before this run; resolving two and adding four
new candidates leaves 23 waiting.

### Baseline refresh (2026-10-05)

A fresh fetch advanced Argosy `origin/main` from `1d58f89` / 3,087 commits to
`4a5f529` / 3,090 commits. The chronological cursor remained valid:
`ea8b196` was still commit 140 and `8fc59ff` was still commit 141. Aggregate
metadata was refreshed without skipping or reordering history.

### Baseline confirmation (2026-10-06)

A fresh fetch left Argosy `origin/main` unchanged at `4a5f529` / 3,090
commits. The chronological cursor remained valid: `f1df1da` was still commit
154 and `6282d11` was still commit 155. Only the observation date was
refreshed before this run's seven chronological dispositions were appended.

### Baseline confirmation (2026-10-07)

A fresh fetch left Argosy `origin/main` unchanged at `4a5f529` / 3,090
commits. The chronological cursor remained valid: `bb3d832` was still commit
161 and `b40a188` was still commit 162. Only the observation date was
refreshed before this run's eight chronological dispositions were appended.

### Baseline refresh (2026-10-08)

A fresh fetch advanced Argosy `origin/main` from `4a5f529` / 3,090 commits to
`2714d54` / 3,179 commits. The chronological cursor remained valid:
`cc54e4b` was still commit 169 and `f998a3f` was still commit 170. Aggregate
metadata was refreshed without skipping or reordering history.

### Baseline refresh (2026-10-09)

A fresh fetch advanced Argosy `origin/main` from `2714d54` / 3,179 commits to
`446eae8` / 3,207 commits. The chronological cursor remained valid:
`188a15f` was still commit 185 and `f1c3c3c` was still commit 186. Aggregate
metadata was refreshed without skipping or reordering history.

### Baseline refresh (2026-10-10)

A fresh fetch advanced Argosy `origin/main` from `446eae8` / 3,207 commits to
`9b0fefb` / 3,213 commits. The chronological cursor remained valid:
`bff1f7b` was still commit 191 and `81d055d` was still commit 192. Aggregate
metadata was refreshed without skipping or reordering history.

### Baseline refresh (2026-10-11)

A fresh fetch advanced Argosy `origin/main` from `9b0fefb` / 3,213 commits to
`f287e8a` / 3,219 commits. The chronological cursor remained valid:
`ab05a87` was still commit 200 and `8ea383a` was still commit 201. Aggregate
metadata was refreshed before this run's twenty chronological dispositions
were appended.

### Baseline refresh (2026-10-12)

A fresh fetch advanced Argosy `origin/main` from `f287e8a` / 3,219 commits to
`6a7efc4` / 3,243 commits. The chronological cursor remained valid:
`cac12ec` was still commit 220 and `beab044` was still commit 221. Aggregate
metadata was refreshed before this run's forty-five chronological dispositions
were appended.

### Baseline refresh (2026-10-13)

A fresh fetch advanced Argosy `origin/main` from `6a7efc4` / 3,243 commits to
`3059f55` / 3,268 commits. The chronological cursor remained valid:
`19e7a03` was still commit 265 and `aafa1c3` was still commit 266. Aggregate
metadata was refreshed before this run's fifteen chronological dispositions
were appended.

### Baseline refresh (2026-10-14)

A fresh fetch advanced Argosy `origin/main` from `3059f55` / 3,268 commits to
`65f5485` / 3,336 commits. The chronological cursor remained valid:
`fa58fac` was still commit 280 and `c05cc2f` was still commit 281. Aggregate
metadata was refreshed before this run's two chronological dispositions were
appended.

### Baseline refresh (2026-10-15)

A fresh fetch advanced Argosy `origin/main` from `65f5485` / 3,336 commits to
`9940f11` / 3,356 commits. The chronological cursor remained valid:
`ada75a7` was still commit 282 and `9162b3f` was still commit 283. Aggregate
metadata was refreshed before this run's eight chronological dispositions were
appended.

### Baseline refresh (2026-10-16)

A fresh fetch advanced Argosy `origin/main` from `9940f11` / 3,356 commits to
`56ae10b` / 3,361 commits. The chronological cursor remained valid:
`acf3d82` was still commit 290 and `79b448c` was still commit 291. Aggregate
metadata was refreshed before this run's five chronological dispositions were
appended.

### Baseline refresh (2026-10-17)

A fresh fetch advanced Argosy `origin/main` from `56ae10b` / 3,361 commits to
`98562a1` / 3,366 commits. The chronological cursor remained valid:
`d19db53` was still commit 295 and `b1d09fe` was still commit 296. Aggregate
metadata was refreshed before this run's ten chronological dispositions were
appended.

### Baseline confirmation (2026-10-18)

A fresh fetch left Argosy `origin/main` unchanged at `98562a1` / 3,366
commits. The chronological cursor remained valid: `0f232e8` was still commit
305 and `4edbbfa` was still commit 306. Only the observation date was
refreshed before this run's twenty-eight chronological dispositions were
appended. The stored candidate total was also reconciled from 66 to the 65
candidate ledger rows actually present before this run; adding ten leaves 75.

### Baseline confirmation (2026-10-20)

A fresh fetch left Argosy `origin/main` unchanged at `98562a1` / 3,366
commits. The chronological cursor remained valid: `db43178` was still commit
333 and `5a92044` was still commit 334. The 2026-10-19 audit and feature push
were held out of this tracker while GitHub Actions reported delayed workflow
processing. Windows CI run `39282965458` later passed the complete gate for
`b0b8a8e`; this run records the ten inspected dispositions and advances the
candidate total from 75 to 80.

### Baseline confirmation (2026-10-21)

A fresh fetch left Argosy `origin/main` unchanged at `98562a1` / 3,366
commits. The chronological cursor remained valid: `eca7d1a` was still commit
343 and `b645f45` was still commit 344. Only the observation date was
refreshed before this run's twenty-one chronological dispositions were
appended.

### Baseline confirmation (2026-10-22)

A fresh fetch left Argosy `origin/main` unchanged at `98562a1` / 3,366
commits. The chronological cursor remained valid: `21cf9df` was still commit
364 and `b8b2206` was still commit 365. Only the observation date was
refreshed before this run's four chronological dispositions were appended.

### Baseline confirmation (2026-10-23)

A fresh fetch left Argosy `origin/main` unchanged at `98562a1` / 3,366
commits. The chronological cursor remained valid: `8b41f18` was still commit
368 and `f73a6a7` was still commit 369. No Argosy commits were authored in the
previous 24 hours. Only the observation date was refreshed before this run's
thirteen chronological dispositions were appended.

### Local verification constraints

Recorded 2026-09-21 so future runs do not rediscover them:

- `git`, `node`, `npm` and `gh` are not on `PATH`. Working binaries:
  git `C:\Users\yash6\.cache\codex-runtimes\codex-primary-runtime\dependencies\native\git\cmd\git.exe`,
  node `C:\Users\yash6\AppData\Local\OpenAI\Codex\bin\5b9024f90663758b\node.exe`,
  gh `C:\Users\yash6\Documents\Codex\2026-06-04\do-you-have-access-to-my\work\tools\gh\bin\gh.exe`.
  Run frontend checks directly, e.g. `node node_modules/vitest/vitest.mjs run`.
- **Rust cannot be compiled locally.** Smart App Control is enforced
  (`HKLM:\SYSTEM\CurrentControlSet\Control\CI\Policy\VerifiedAndReputablePolicyState = 1`),
  so Windows blocks every unsigned build-script executable cargo produces in
  `target/` with `os error 4551`. VS Build Tools 2022 (MSVC 14.44 + Windows SDK
  10.0.26100) was installed on 2026-09-21 and did **not** lift this; the linker
  now exists but cargo still cannot execute what it builds. Disabling Smart App
  Control is irreversible without reinstalling Windows and must not be done
  without the user's explicit decision.
- Consequence: Rust changes are verified by CI (`.github/workflows/ci.yml` runs
  `cargo test` and clippy on `windows-latest` for every push to `main`). A run
  that touches Rust must say so and check the CI result.

**Cloud/Linux sandbox runs (recorded 2026-09-22):** when this job runs in a
Linux container instead of the Windows machine above, `git`, `node`, `npm`
and `cargo`/`rustc` are all directly on `PATH` and frontend checks (vitest,
tsc, eslint, vite build) run normally. `cargo check`/`cargo test` on the
native Linux target additionally needs `libgtk-3-dev libwebkit2gtk-4.1-dev
libayatana-appindicator3-dev librsvg2-dev` (`apt-get install`, run
`apt-get update` first or the mirror 404s) to get past the `gdk-sys` build
script, and `npm run build` must run first so `tauri::generate_context!()`
finds `../dist`. Even with those installed, a full `cargo check` still
cannot pass on Linux: several pre-existing functions in `commands.rs` /
`emulators/detection.rs` are only defined under `#[cfg(windows)]` with no
Linux fallback, so the crate fails to fully type-check on any non-Windows
host regardless of what a given run changes. This is still useful:
`cargo check` surfaces real errors in any newly-added/changed code (it
caught two real mistakes in this run's `covers.rs`/`api/romm.rs` module
before they reached CI), and the remaining failures can be diffed against
`git diff` to confirm they're the same pre-existing Windows-only gaps and
not something the run introduced. Full correctness of `#[cfg(windows)]`
code paths still relies on CI on `windows-latest`.

## Status vocabulary

- `implemented`: portable behavior added to Wingosy and pushed.
- `already-covered`: equivalent behavior already exists in Wingosy.
- `candidate`: portable behavior worth implementing later.
- `not-portable`: Android-specific or incompatible with Wingosy's architecture.
- `superseded`: an intermediate change replaced by a later Argosy commit.
- `non-feature`: docs, release/version metadata, funding, formatting, or repository administration.
- `decision-needed`: a product choice is recorded under Open decisions; safe unrelated work may continue.

## Audit cursor

- Last fully audited Argosy commit: `7a5ece668fffa9abf9a6cc2cd516e6980d21658e`
- Next Argosy commit: `20b2f37b22414c8fa668f59968b49c4247779e52`
- Audited: 381 / 3,366 baseline commits
- Portable candidates waiting: 90
- Last tracker update: 2026-10-23

The first automated parity run must begin with `900808d`. A run may inspect as
many consecutive commits as needed to locate one or two coherent features, but
must record every inspected commit before advancing this cursor.

## Chronological audit ledger

| Seq. | Argosy commit | Date | Summary | Status | Wingosy mapping / notes |
|---:|---|---|---|---|---|
| 1 | `900808d` | 2025-12-06 | Initial commit: Argosy Launcher | already-covered | Wingosy already provides the portable launcher foundation: setup, RomM library sync, downloads, emulator detection/launch, library/search, and settings. Android framework and bundled design-doc mechanics are not copied. |
| 2 | `2581867` | 2025-12-06 | Update app icon to nautical helm and refine UI | already-covered | Wingosy has its own branding, setup folder picker, download-count badge, and download/sync surfaces. Android SAF and Argosy branding are platform-specific. |
| 3 | `a2fadf7` | 2025-12-06 | Add release compliance: signing, icons, privacy policy | non-feature | Android/Play Store signing, launcher resources, and compliance documentation; no portable runtime behavior. |
| 4 | `c0727f9` | 2025-12-06 | Add README with project overview and features | non-feature | Documentation-only change. |
| 5 | `ae856c5` | 2025-12-06 | Refactor input legend with consistent hierarchy | already-covered | Wingosy immersive views use a shared hint bar and consistent controller hierarchy. |
| 6 | `92ad408` | 2025-12-06 | Refactor business logic into Use Cases with unit tests | non-feature | Android architecture/test refactor with no user-visible behavior to port. |
| 7 | `ad8519e` | 2025-12-06 | Add user ratings with offline sync queue | implemented | Wingosy now exposes its existing local status, 1–5 personal rating, and 1–5 difficulty persistence in both desktop and immersive game details (`ba600c0`). RomM write/offline-queue behavior remains an explicit product decision below. |
| 8 | `b7a5b79` | 2025-12-06 | Fix RomM API request body format for user props | decision-needed | Applies only if Wingosy adopts RomM-backed user-property writes; the local-only implementation does not issue this request. |
| 9 | `0e23a85` | 2025-12-06 | Add GitHub CI workflows and project templates | non-feature | Repository administration: CI, issue/PR templates, Dependabot, EditorConfig, README badges. Wingosy already has its own CI, nightly, beta and release workflows. |
| 10 | `50f0099` | 2025-12-06 | Add Ko-fi username for funding support | non-feature | `.github/FUNDING.yml` only; no runtime behavior. |
| 11 | `3f1fc99` | 2025-12-06 | Suppress false positive RestrictedApi lint warning | not-portable | Android lint annotation on `dispatchKeyEvent`; no Tauri/Windows equivalent. |
| 12 | `32b72cc` | 2025-12-06 | Add debug build differentiation and fix ProGuard rules | not-portable | Android debug theming, launcher icon variants and Moshi/Retrofit ProGuard keep rules. Wingosy has no R8/ProGuard stage. |
| 13 | `4047889` | 2025-12-07 | Add self-updater with GitHub Releases integration | already-covered | Wingosy's updater is broader: `tauri-plugin-updater` with signed `latest.json`, a pubkey, `createUpdaterArtifacts`, passive install, plus `UpdaterConfig` with `check_on_startup`, `auto_update_enabled` and a Stable/Beta/Nightly channel. WorkManager periodic scheduling is Android-only. |
| 14 | `3b4cea6` | 2025-12-07 | Add update download and install functionality | already-covered | APK download plus system package-installer intent; Tauri's passive installer flow replaces it end to end. |
| 15 | `a98a571` | 2025-12-07 | Add community rating display and UI refinements | implemented | `612c099`. Added RomM `average_rating` as a fallback behind IGDB `aggregated_rating`/`total_rating`, a shared `formatCommunityRating` helper, the missing community rating row in immersive game details, and an accurate "Community rating" label on desktop. Compose typography/opacity tweaks are Argosy-specific styling and were not ported. |
| 16 | `0e4296d` | 2025-12-07 | Add concurrent downloads with pause/resume and progress UI | candidate | Wingosy already shows concurrent active transfers, progress, game-card indicators, and recent results. Durable queueing, HTTP Range resume, pause controls, and a configurable concurrency limit require a native transfer-job model; retain as a bounded future vertical slice rather than adding partial controls. |
| 17 | `12895cc` | 2025-12-07 | Reorganize settings menu and add UI density feature | implemented | Wingosy already uses semantic settings sections. This run exposes and applies its existing persisted `display.grid_columns` setting as Compact (6), Comfortable (5), or Spacious (4) desktop library density. Android-only app-grid behavior and cache progress details are not applicable. |
| 18 | `6b98551` | 2025-12-07 | Add control legend footer to home screen | implemented | Wingosy immersive mode already had a controller hint bar for navigation, select, back, sections, settings, and help. The portable direct-action gap was completed by `702d6ec`, which adds Y-button favorite toggling and its matching hint; details already has a controller-accessible route. |
| 19 | `d199708` | 2025-12-07 | Fix UI hang when deleting large installed files | implemented | `689be34`: Wingosy now runs local ROM removal on Tokio's blocking pool instead of performing synchronous filesystem work on the async command executor. Desktop and immersive callers already refresh game state after successful removal, and focused tests cover successful and missing-file outcomes. |
| 20 | `323327f` | 2025-12-07 | Bump version to 0.3.0 | non-feature | Android release metadata only; no portable runtime behavior. |
| 21 | `9c0eca7` | 2025-12-07 | Improve home screen with smart sorting, ratings, and View All navigation | already-covered | Wingosy has installed/favorites filters, name/recently played/play-count/play-time/release-year sorting, personal and community ratings, and an immersive Recent section. Argosy's Android platform-row/View All layout is not a direct fit for Wingosy's full library navigation. |
| 22 | `99a3d03` | 2025-12-07 | Bump version to 0.4.0 | non-feature | Android release metadata only. |
| 23 | `86b76e1` | 2025-12-08 | Add sound effects, improve feedback systems, and fix download bugs | implemented | `702d6ec`: added direct Y-button favorite toggling for the focused immersive-library game, including keyboard equivalent and hint. Wingosy already had immersive UI sounds, sound settings, and download event feedback; the remaining Android haptic and queue mechanics are not copied. |
| 24 | `6ecfe99` | 2025-12-08 | Refactor codebase for cleanliness and fix downloads screen bugs | candidate | The general cleanup is non-portable. `689be34` resolves the related large-file deletion path, but durable cancellation cleanup still depends on the future native transfer-job model and remains a candidate. |
| 25 | `3c89635` | 2025-12-08 | Fix RetroArch launch not working on Android 13+ | not-portable | Android activity/URI compatibility only; Wingosy builds Windows process arguments directly. |
| 26 | `afd7f68` | 2025-12-08 | Fix emulator auto-detection not running before game launch | already-covered | Wingosy resolves a per-game override, platform default, and detected installed emulator on every launch. |
| 27 | `63ba7c7` | 2025-12-08 | Fix emulator launch intent compatibility for Android 13+ | not-portable | Android intent compatibility only. |
| 28 | `e204c4a` | 2025-12-08 | Add emulator-specific launch configurations for Android 13+ | not-portable | Android package/activity/extras configuration does not map to Windows executables and CLI arguments. |
| 29 | `1e3b360` | 2025-12-08 | Fix RetroArch launch with additional required extras | not-portable | Android intent-extra fix; Wingosy uses its own direct RetroArch command builder. |
| 30 | `927d6ae` | 2025-12-08 | Fix input state desync after returning from emulator | already-covered | Wingosy maintains one requestAnimationFrame gamepad mapper and stable immersive state; it does not use Compose collectors or an Android drawer. |
| 31 | `e310506` | 2025-12-08 | Persist home screen state across process death | not-portable | Android process-death persistence for a Compose ViewModel; Wingosy's desktop-session model differs. |
| 32 | `305a00f` | 2025-12-08 | Add download path recovery after validation | not-portable | Repairs Android storage-validation path loss caused by that platform's lifecycle; Wingosy keeps local paths in its database and has no matching invalidation flow. |
| 33 | `599f21b` | 2025-12-08 | Fix download validation clearing paths before device unlock | not-portable | Android user-unlock/storage lifecycle only. |
| 34 | `080ac7e` | 2025-12-08 | Fix storage validation to work on normal app restart | not-portable | Android mount-state polling and post-unlock validation do not apply to Wingosy's Windows filesystem model. |
| 35 | `5f6ebd8` | 2025-12-09 | Fix 3DS emulator launch intents and add Azahar support | implemented | The 2026-09-23 run completes the portable Windows behavior: the stable `citra` config ID now presents Azahar, downloads the official recommended Windows MXE archive, discovers `azahar.exe` for both managed and existing installs, retains legacy Lime3DS/Citra executable compatibility, and has focused direct-launch/detection tests. Android intent mechanics are not copied. |
| 36 | `05e55c7` | 2025-12-09 | Fix drawer input routing desync after returning from emulator | superseded | Intermediate Android drawer-routing change replaced by the later single-handler and subscription revisions in this reviewed sequence. |
| 37 | `3859fda` | 2025-12-09 | Refactor input handling to use overlay priority pattern | superseded | Intermediate Android input architecture replaced by subsequent handler/subscription fixes. |
| 38 | `5f9dc76` | 2025-12-09 | Move drawer state to ViewModel for lifecycle stability | superseded | Intermediate Android drawer-state revision replaced by subsequent routing fixes. |
| 39 | `d89113b` | 2025-12-09 | Unify input handling with single-handler architecture | superseded | Intermediate Android input architecture replaced by subsequent routing/subscription fixes. |
| 40 | `d8a392c` | 2025-12-09 | Fix drawer state race condition on Activity recreation | superseded | Intermediate Android drawer race fix replaced by later routing changes. |
| 41 | `271b0e7` | 2025-12-09 | Use confirmStateChange for synchronous drawer state sync | superseded | Intermediate Android drawer synchronization change replaced by later routing changes. |
| 42 | `7b66721` | 2025-12-09 | Refactor input handling with priority-based subscribe/unsubscribe pattern | superseded | Intermediate Android subscription architecture replaced by later timing and restoration fixes. |
| 43 | `55045f4` | 2025-12-09 | Fix drawer input timing race condition | superseded | Intermediate Android timing fix replaced by later unsubscribe/restore handling. |
| 44 | `61f8c52` | 2025-12-09 | Fix drawer not unsubscribing on navigation | superseded | Intermediate Android subscription fix replaced by the final restore registration change. |
| 45 | `dfc98b4` | 2025-12-09 | Fix input subscription not re-registering on navigation restore | already-covered | Wingosy's single gamepad mapper remains mounted across immersive navigation and routes through the active view; no Compose lifecycle subscription exists. |
| 46 | `bee6b46` | 2025-12-09 | Bump version to 0.5.22-beta.1 | non-feature | Android release metadata only. |
| 47 | `3375b88` | 2025-12-09 | Add cover art caching during sync | implemented | Wingosy already had `covers_dir()` (`config/mod.rs`) and frontend `convertFileSrc`/`isLocalPath` handling for cover art scaffolded but unused. This run wires them together: `RomMClient::download_cover` (auth header only sent when the URL is same-origin as the RomM server, so a token never leaks to a third-party image host like IGDB's CDN), a new `covers` module that downloads and caches each synced game's cover under `covers_dir()` and updates `cover_path` to the local file, queued from both `sync_romm_library` and `sync_romm_platform` after each upsert, plus a resume pass in `sync_romm_library` for any game left uncached by an interrupted prior sync. No resizing (Argosy resizes to 400px JPEG 85%); caching the original bytes was judged sufficient value without adding an image-processing dependency. |
| 48 | `362f688` | 2025-12-09 | Add VID-based controller detection and separate button swap settings | candidate | Wingosy has no controller-VID detection or A/B or X/Y icon-swap settings at all today. Worthwhile for Xbox vs. Nintendo-layout controllers on Windows, but is a multi-file frontend slice (gamepad VID/PID detection, settings UI, icon rendering across desktop and immersive) better scoped as its own run. |
| 49 | `c697635` | 2025-12-09 | Add route-validated input subscriptions to prevent focus stealing | already-covered | Android Compose navigation race between background screens kept alive by `saveState`/`restoreState`; Wingosy's single gamepad mapper has no comparable multi-screen subscription race to guard against. |
| 50 | `19823f6` | 2025-12-09 | Add battery indicator to home screen and drawer | candidate | Android battery/charging display on the home header and drawer. Wingosy targets desktop and immersive/couch modes that could run on Windows handhelds (e.g. ROG Ally, Legion Go) where a battery indicator would matter; worth a focused slice using Windows battery APIs rather than assuming Argosy's Android `BatteryManager` semantics. |
| 51 | `f973883` | 2025-12-09 | Improve Apps screen layout and add touch support | already-covered | Android app-grid padding/density and touch-target tuning; Wingosy's density selector (`613160f`) and desktop pointer/touch input already cover the portable intent. |
| 52 | `397a395` | 2025-12-09 | Bump version to 0.6.0 | non-feature | Android release metadata only. |
| 53 | `56ed787` | 2025-12-09 | Add Steam game integration with launcher scanning and manual entry | not-portable | Launches Steam titles on Android handhelds indirectly through third-party launcher APKs (GameHub variants, GameNative) running Windows games under emulation. Wingosy runs natively on Windows, where users already have native Steam; there is no equivalent indirection to port. |
| 54 | `c8841df` | 2025-12-09 | Update README for general users with new features and screenshots structure | non-feature | Documentation-only change. |
| 55 | `c21a65e` | 2025-12-09 | Bump version to 0.7.0 | non-feature | Android release metadata only. |
| 56 | `3de24f3` | 2025-12-09 | Add save sync infrastructure, touch input fixes, and UI improvements | candidate | Wingosy already has negotiated pre/post-launch RomM save sync, retry/failure state, manual save actions, pointer input, and equivalent settings organization. Its automatic path-aware sync is currently limited to RetroArch and Eden, while Argosy's registry covers more emulator families; extending Wingosy's resolver to additional Windows emulators remains a bounded candidate. The ROM-hack metadata filter is useful but lower priority and should travel with a broader sync-filter pass. |
| 57 | `26c7023` | 2025-12-09 | Bump version to 0.8.0-beta.1 | non-feature | Android release metadata only. |
| 58 | `03261a4` | 2025-12-10 | Add multi-disc game support for PlayStation titles | candidate | Wingosy detects multi-disc filenames during scanning but still exposes separate launch paths and an explicit "Multi-disc support planned" action. Consolidating sibling discs, downloading the complete set, and providing a desktop/immersive disc picker is a portable future vertical slice. |
| 59 | `8a9f00a` | 2025-12-10 | Let RetroArch pick cores based on file extension | superseded | Android-only interim removal of explicit core paths was replaced two commits later by deliberate per-platform core resolution. Windows RetroArch command-line launch requires Wingosy's explicit `-L` core argument. |
| 60 | `211e865` | 2025-12-10 | Bump version to 0.8.0-beta.2 | non-feature | Android release metadata only. |
| 61 | `b03791b` | 2025-12-10 | Add RetroArch core selection and multi-disc improvements | candidate | Wingosy already supports per-platform emulator defaults, displays the effective RetroArch core, and hides RetroArch when its mapped core is absent. It currently maps one fixed core per platform; user-selectable compatible cores are portable and should be implemented as a focused settings/launch slice. The disc-menu changes belong to the multi-disc candidate above; Android process/intent flags are not portable. |
| 62 | `623563de` | 2025-12-10 | Bump version to 0.8.0 | non-feature | Android release metadata only. |
| 63 | `13596a1` | 2025-12-11 | Update RetroArch core IDs to match Android buildbot | already-covered | Wingosy deliberately uses Windows libretro DLL identifiers rather than Android GLES/core names, and its mapped cores share one buildbot URL resolver with an upstream-availability validation test. The Android identifier substitutions are not portable. |
| 64 | `92447d9` | 2025-12-11 | Bump version to 0.8.1-beta.1 | non-feature | Android release metadata only. |
| 65 | `72a0f91` | 2025-12-11 | Add RetroAchievements display and game detail navigation | already-covered | Wingosy shows RomM-backed achievement definitions, progress, points, badge art, locked state, refresh, and the full overlay from both desktop and immersive game details. |
| 66 | `772a0aa` | 2025-12-11 | Bump version to 0.8.1-beta.2 | non-feature | Android release metadata only. |
| 67 | `d38524e` | 2025-12-11 | Add earned achievement tracking from RetroAchievements | already-covered | Wingosy merges RomM achievement definitions with the signed-in user's earned progression, including hardcore unlocks, and exposes explicit refresh with focused parsing and UI tests. |
| 68 | `53d4330` | 2025-12-11 | Bump version to 0.8.1-beta.3 | non-feature | Android release metadata only. |
| 69 | `3128812` | 2025-12-12 | Bump version to 0.8.1 | non-feature | Android release metadata only. |
| 70 | `9af5a63` | 2025-12-12 | Fix DownloadGameUseCaseTest constructor to include GameDiscDao | non-feature | Test-only constructor maintenance for Argosy's Android dependency graph. |
| 71 | `b4fc721` | 2025-12-12 | Bump version to 0.9.0 | non-feature | Android release metadata only. |
| 72 | `6edde78` | 2025-12-12 | Update dependencies and migrate to Kotlin 2.0 | non-feature | Android/Kotlin dependency maintenance; dependency upgrades are outside parity scope. |
| 73 | `2246fa8` | 2025-12-12 | Merge pull request #15 from nendotools/chore/dependency-updates | non-feature | Merge commit containing the dependency-only change already dispositioned at `6edde78`. |
| 74 | `76e2cc7` | 2025-12-12 | Improve sync filtering and cleanup for RomM games | candidate | Wingosy already removes stale RomM records after a complete sync, but lacks Argosy's invalid-extension, bad-dump/hack, and achievement-aware duplicate filtering. Fold the portable filtering intent into the existing broader sync-filter candidate; destructive cleanup needs recovery-safe design rather than copying Argosy's file deletion. |
| 75 | `f58c021` | 2025-12-12 | Add Wii U platform and Cemu emulator support | already-covered | Wingosy already maps Wii U to Cemu, detects existing `Cemu.exe` installs, downloads official Windows x64 releases, and launches Wii U ROMs through the shared emulator path. |
| 76 | `0b6733b` | 2025-12-12 | Bump version to 0.9.1-beta.1 | non-feature | Android release metadata only. |
| 77 | `3e15b0f` | 2025-12-12 | Improve RetroArch launch handling and add achievement badge caching | candidate | Android focus-return launch retries and intent flags do not map to direct Windows process launch. Local achievement badge caching is portable and would improve offline game details; retain it as a bounded extension of Wingosy's existing cover cache. |
| 78 | `b7f891c` | 2025-12-12 | Bump version to 0.9.1 | non-feature | Android release metadata only. |
| 79 | `6dd07eb` | 2025-12-12 | Fix home screen scroll reset and improve list sorting | already-covered | Wingosy already excludes never-played games from Recents, exposes explicit Favorites and Recent sections, supports user-selected library sorting, clamps immersive selection as lists change, and keeps controller focus visible while navigating. Argosy's Android DAO and lifecycle refactor is not copied. |
| 80 | `0c0e749` | 2025-12-12 | Bump version to 0.9.2 | non-feature | Android release metadata only. |
| 81 | `0be3db2` | 2025-12-12 | Show available storage space in Download Location setting | implemented | Wingosy's Storage dashboard now reports free space on the configured ROM drive via the native Windows disk-space API. Missing future folders fall back to their nearest existing parent, and API failures display as unavailable instead of falsely claiming zero bytes (`65f82fb`). |
| 82 | `c62bb43` | 2025-12-12 | Add background image settings with customization options | candidate | Wingosy has themed desktop/immersive backgrounds and game-detail artwork but no user-selectable home background or blur, saturation, and opacity controls. A portable appearance slice should preserve readable overlays and work with both pointer and controller settings flows. |
| 83 | `b3b427b` | 2025-12-12 | Add Refresh Game Data option to all game modals | already-covered | Both Wingosy desktop and immersive game details already expose Refresh game data. The shared native command refetches the individual RomM record, preserves local state, updates metadata and artwork fields, and refreshes the active view. |
| 84 | `16a398c` | 2025-12-13 | Improve multi-disc download handling and queue tracking | candidate | Durable per-disc queue identity, disc labels, and grouped downloads reinforce the existing consolidated multi-disc candidate. Wingosy must retain each disc's RomM identity and expose repair/selection across desktop and immersive views; Android database mechanics and globally ambiguous archive-extension detection are not copied. |
| 85 | `f4cda7d` | 2025-12-13 | Bump version to 0.9.3 | non-feature | Android release metadata only. |
| 86 | `38dc789` | 2025-12-13 | Fix AetherSX2 PS2 launch intent and bump version to 0.9.4-beta.1 | not-portable | Android activity, intent-extra, file-URI permission, and APK-download behavior. Wingosy already launches PS2 games directly through native Windows PCSX2 command lines. |
| 87 | `4a9bda3` | 2025-12-14 | Add m3u multi-disc support and fix bugs, bump to 0.9.4-beta.2 | candidate | Automatic M3U generation for PS1, Saturn, and Dreamcast strengthens the existing consolidated multi-disc candidate and must be designed with Wingosy's retained RomM disc identities and desktop/immersive selection. Wingosy metadata refresh does not delete its cached cover first, and Argosy's Compose scroll-timing adjustment is not portable. |
| 88 | `0f6576b` | 2025-12-14 | Add Vita3K ZX emulator and proper launch intent support | implemented | `3866196`: added official upstream Vita3K Windows x86_64 releases, managed/existing `Vita3K.exe` discovery, persisted configuration, and direct installed-title launch via Vita3K's `-r` contract when a title ID is available. The Android-only ZX fork and intent mechanics are not copied. |
| 89 | `7c9d67c` | 2025-12-14 | Fix Vita3K detection and add zip format support, bump to 0.9.4-beta.4 | implemented | `3866196`: Vita title IDs are resolved from bracketed or prefixed filenames and ZIP entry paths; an unknown ID safely opens Vita3K without a false direct-launch argument. ZIP was not added as a global Vita scan extension because it is ambiguous with other platforms. |
| 90 | `eca9c0f` | 2025-12-14 | Add wildcard emulator detection and new emulator support, bump to 0.9.4-beta.5 | already-covered | Android package-family wildcarding has no Windows equivalent. Wingosy detects supported emulators by executable across registry, managed, and common filesystem paths, supports custom configured paths, and now covers the portable Vita3K gap; the added Android-specific emulator packages and save-package routing are not copied. |
| 91 | `dd67a69` | 2025-12-14 | Fix Dolphin launch intent and download URL, bump to 0.9.4-beta.6 | already-covered | Wingosy launches Dolphin directly with native Windows arguments and obtains official upstream Windows builds; Android activities, intent extras, and the handheld APK URL do not apply. |
| 92 | `ff58410` | 2025-12-14 | Require MANAGE_EXTERNAL_STORAGE permission in first-run wizard | not-portable | Android all-files permission flow; Wingosy uses ordinary Windows paths and its folder picker. |
| 93 | `2e4cf91` | 2025-12-14 | Bump version to 0.9.4 | non-feature | Android release metadata only. |
| 94 | `30e97da` | 2025-12-14 | Allow ROM sync without IGDB metadata | already-covered | Wingosy upserts every RomM record by stable RomM ID and never requires IGDB, MobyGames, or RetroAchievements metadata. |
| 95 | `f78a71a` | 2025-12-14 | Bump version to 0.9.5-beta.1 | non-feature | Android release metadata only. |
| 96 | `40e8685` | 2025-12-14 | Add zip, 7z, and chd support to all platforms | candidate | Archive support is portable, but assigning globally ambiguous extensions to every platform would make Wingosy's extension-only scanner misclassify files. Retain platform-context-aware archive discovery as a bounded candidate. |
| 97 | `632ce5e` | 2025-12-14 | Bump version to 0.9.5-beta.2 | non-feature | Android release metadata only. |
| 98 | `6287d37` | 2025-12-15 | Add save sync with RomM server integration | already-covered | Wingosy already has device-aware negotiated and legacy RomM save APIs, pre/post-launch sync, retry/failure state, manual actions, and safe local backups. Broader Windows emulator path resolution remains the existing candidate. |
| 99 | `ec40284` | 2025-12-15 | Fix lint and formatting issues | non-feature | Android-only formatting and static-analysis cleanup. |
| 100 | `3fdd187` | 2025-12-15 | Add save channel system for managing multiple save slots | candidate | Named cloud-save slots, timeline restore, and active-slot tracking are portable, but need live RomM compatibility and conflict tests before altering Wingosy's working negotiated sync path. |
| 101 | `37496ca` | 2025-12-15 | Add detekt static analysis and improve code quality | non-feature | Android/Kotlin analysis configuration and refactoring; the save-note behavior belongs to the save-channel candidate. |
| 102 | `23e02f1` | 2025-12-15 | Refactor Settings screen with GameDataSection and improved navigation | non-feature | Compose settings decomposition and navigation refactor with no missing portable runtime capability. |
| 103 | `045c864` | 2025-12-16 | Add psvita platform slug alias for Vita3K detection | implemented | `edc2424`: Wingosy now normalizes RomM's `vita` slug to its canonical `psvita` ID, preserving Vita3K detection and launch behavior across either server naming convention. |
| 104 | `7867247` | 2025-12-16 | Improve platform sorting and expand platform definitions | implemented | `3d5c895`: Wingosy now canonicalizes established aliases only for its supported systems, assigns stable family/chronological sort ranks to default and RomM platforms, and leaves unknown server slugs unchanged instead of implying emulator support. |
| 105 | `60ca11f` | 2025-12-16 | Improve save channel system with timestamp tracking and menu reorganization | candidate | Timestamp-accurate active-slot tracking strengthens the named save-channel candidate; the Compose menu reorganization is not copied. |
| 106 | `202c6e8` | 2025-12-16 | Bump version to 0.9.5-beta.3 | non-feature | Android release metadata only. |
| 107 | `3e7ef9d` | 2025-12-16 | Use argosy-latest as default save name and add proactive server download | already-covered | Wingosy uses an `autosave` latest slot, restores legacy `argosy-latest`, and its negotiated sync engine compares server/local state before launch. |
| 108 | `66bfb40` | 2025-12-16 | Add controller support to FirstRun wizard and fix Home screen updates | implemented | `5b77952`: Wingosy now mounts its existing controller mapper during setup, establishes visible focus across enabled controls, maps D-pad navigation and A activation, and lets B move to the previous setup step. The existing completion callback already refreshes the library after setup. |
| 109 | `85bd420` | 2025-12-16 | Fix LaunchGameUseCase test to match updated signature | non-feature | Android test maintenance only. |
| 110 | `12397d9` | 2025-12-16 | Improve save sync on game download and fix duplicate channel entries | candidate | Pre-launch sync already pulls the latest server save before first play, while channel deduplication, cleanup, and download-time prefetch belong to the named save-channel vertical slice. |
| 111 | `ab7b4a4` | 2025-12-16 | Bump version to 0.9.5-beta.4 | non-feature | Android release metadata only. |
| 112 | `926cc4f` | 2025-12-16 | Add All Files Access permission setting to Storage section | not-portable | Android permission settings have no Windows/Tauri equivalent. |
| 113 | `450d6d4` | 2025-12-16 | Bump version to 0.9.5-beta.5 | non-feature | Android release metadata only. |
| 114 | `5646383` | 2025-12-16 | Improve platform sorting with comprehensive definitions and slug aliases | implemented | `3d5c895`: completed with the same bounded alias/order slice as `7867247`; RomM sync overviews and stored platforms now share the deterministic order while unknown platforms sort last by name. |
| 115 | `04ce9d3` | 2025-12-16 | Bump version to 0.9.5-beta.6 | non-feature | Android release metadata only. |
| 116 | `668908f` | 2025-12-16 | Add save folder detection and folder-based save sync | candidate | Folded into the existing automatic save-path candidate: expand Windows emulator resolvers incrementally with live RomM proof and reversible backups. The blur default and slider fix are Argosy UI details. |
| 117 | `6f1a3cd` | 2025-12-16 | Bump version to 0.9.5 | non-feature | Android release metadata only. |
| 118 | `65a86a7` | 2025-12-16 | Update README with save sync feature and cleanup | non-feature | Documentation-only change. |
| 119 | `db1c6d9` | 2025-12-16 | Update README with new screenshots and sections | non-feature | Documentation-only change. |
| 120 | `b058467` | 2025-12-17 | Restore Continue Playing QoL features and add View All navigation | implemented | `edc2424`: filtered library loads now run Wingosy's existing filesystem validation, and immersive Recent excludes entries without a validated local path. Wingosy already has dedicated Favorites and Recent library sections and selection clamping. |
| 121 | `7d0d783` | 2025-12-17 | Add touch input support to settings sliders | already-covered | Wingosy's web-native settings controls already accept pointer/touch input directly; the Android tap-to-cycle workaround is unnecessary. |
| 122 | `884575a` | 2025-12-17 | Add touch support to SaveChannelModal | candidate | Folded into the named save-channel vertical slice: any future timeline/slot UI must provide pointer and immersive-controller access, including selection, rename/lock actions, and dismissal. |
| 123 | `9f20d8e` | 2025-12-17 | Add touch support to Home view game rail | already-covered | Wingosy's desktop library and Recent/Favorites sections already select and open cards with pointer input; immersive mode retains explicit controller selection and details navigation. Android long-press and Compose scroll-focus mechanics are not needed. |
| 124 | `5fb036c` | 2025-12-17 | Add touch support to Library view | already-covered | Desktop cards, filters, and game actions already have direct pointer paths, while immersive cards remain controller-navigable. The two-stage Android touch-focus convention does not improve the Windows UI. |
| 125 | `f63aba3` | 2025-12-17 | Fix double cursor on d-pad navigation and Apps screen back button | not-portable | The duplicate indicator came from Compose native focus layered over Argosy's custom focus state, and Apps is an Android launcher surface. Wingosy uses DOM focus plus its own Windows navigation routes. |
| 126 | `0fa289b` | 2025-12-17 | Remove redundant items from About settings section | non-feature | Argosy-specific settings cleanup with no missing Wingosy capability. |
| 127 | `ada8052` | 2025-12-17 | Add touch support, file logging UI improvements, and save sync logging | already-covered | Wingosy's React controls already support pointer input, and its native tracing stack writes daily application logs with save-sync lifecycle messages. Android folder-picker layout and emulator-card tap semantics do not port. |
| 128 | `ad906b6` | 2025-12-17 | Improve save sync logging and fix save discovery logic | already-covered | Wingosy carries the selected RetroArch core through launch and resolves SRAM from core-specific save directories, with pre/post-launch tracing and safe fallback paths. Android intent parsing and package paths do not apply. |
| 129 | `b1b3ae6` | 2025-12-17 | Bump version to 0.9.6 | non-feature | Android release metadata only. |
| 130 | `7d54348` | 2025-12-17 | Fix tablet display scaling and file logging folder picker | already-covered | Wingosy uses responsive MUI/CSS breakpoints plus a configurable desktop grid density, and writes logs to its stable app-data location. Android tablet sizing, SAF URI parsing, and lifecycle refresh behavior are not portable. |
| 131 | `35fd921` | 2025-12-17 | Bump version to 0.9.7 | non-feature | Android release metadata only. |
| 132 | `3a2c4ad` | 2025-12-17 | Fix Mega Drive .md ROM files being rejected as invalid | already-covered | Wingosy already recognizes `.md` as a Genesis/Mega Drive extension in its canonical platform definition. |
| 133 | `a8d6800` | 2025-12-17 | Bump version to 0.9.8 | non-feature | Android release metadata only. |
| 134 | `5682b08` | 2025-12-18 | Fix Azahar detection, but launching currently blocked by Azahar | already-covered | Wingosy detects official Windows Azahar builds under the stable `citra` configuration ID and launches ROMs directly through `azahar.exe`; Android package-name fallback and intent mechanics do not apply. |
| 135 | `e7641f8` | 2025-12-18 | Add per-platform storage configuration and fix Azahar launching | candidate | Per-platform RomM enablement and custom ROM roots are portable, but require a migration and cleanup design that cannot strand or delete existing downloads. Wingosy's native Azahar launch behavior is already covered. |
| 136 | `0612991` | 2025-12-18 | Fix platform sync toggle and view state handling | candidate | Consolidated with `e7641f8`: disabled platforms must be excluded from sync and cleanup without losing selection state, and re-enabling must remain reversible. |
| 137 | `5ad2252` | 2025-12-18 | Bump version to 0.9.9 | non-feature | Android release metadata only. |
| 138 | `68c56e3` | 2025-12-18 | Fix save sync discovery by using ROM filename instead of title matching | already-covered | Wingosy's RetroArch save resolver derives candidates from the local ROM filename/base name rather than display-title matching. |
| 139 | `c8131a1` | 2025-12-18 | Add per-emulator save path override UI in Settings | candidate | User-configurable Windows save roots strengthen the existing automatic save-path candidate, but must be validated per emulator and retain Wingosy's negotiated-sync backups and failure recovery. |
| 140 | `ea8b196` | 2025-12-18 | Add save status transparency and step-by-step sync overlay | candidate | Persistent per-game save status and explicit sync progress are useful beyond Wingosy's current launch-warning surface; Android permission prompts are not portable and newest-wins conflict handling needs live RomM proof. |
| 141 | `8fc59ff` | 2025-12-18 | Improve save management UI and fix sync overlay | candidate | Save-path context, stable progress messaging, immediate status updates, and complete pointer/controller controls strengthen the existing save-status and named-channel candidates. Wingosy should not copy Compose focus or animation mechanics. |
| 142 | `554d616` | 2025-12-18 | Fix post-session sync ignoring experimental folder saves setting | already-covered | Wingosy's RetroArch and Switch pre/post-launch paths share the same `sync_saves` guard, and unsupported platforms return without sync; there is no separate experimental folder-save flag that one phase can ignore. |
| 143 | `15d8198` | 2025-12-18 | Bump version to 0.9.10 | non-feature | Android release metadata only. |
| 144 | `5bb4358` | 2025-12-19 | Improve data flow and reduce race conditions | implemented | `f0848a6`: Wingosy now holds one native guard across pre-launch sync, the complete emulator session, and post-launch sync, rejecting repeated desktop/controller launch requests until the active session ends. Argosy's Compose state buses and delegate refresh mechanics are not copied. |
| 145 | `d152e97` | 2025-12-19 | Fix RetroArch custom save path to use override as base path | candidate | Folded into the existing per-emulator save-path candidate: a RetroArch override must remain a base directory while preserving core/content subfolder rules, with the effective path preview matching discovery. |
| 146 | `fd66383` | 2025-12-19 | Bump version to 0.9.11 | non-feature | Android release metadata only. |
| 147 | `e9b6755` | 2025-12-19 | Fix light mode theme consistency across UI components | implemented | `5993169`: replaced dark-only detail/settings/firmware surfaces and scrollbar styling with active-theme surfaces, retaining deliberate dark scrims only over artwork. |
| 148 | `0d93830` | 2025-12-19 | Add semantic colors for consistent theming across UI states | implemented | `5993169`: centralized semantic surface tint helpers and applied MUI success, warning, and error roles to download, favorite, installed-emulator, missing-core, and synced-state treatments in desktop and Immersive views. |
| 149 | `6924ef1` | 2025-12-19 | Add box art customization and platform badges | implemented | `f5c8dc9`: Wingosy now persists corner shape, minimal/border/glow frame treatment, platform-label visibility/side/inset, and applies the same result in desktop and Immersive libraries with a representative settings preview. |
| 150 | `dd872e8` | 2025-12-19 | Fix Default View setting to control B button navigation | not-portable | Argosy chooses between separate Showcase and Library roots. Wingosy's desktop and immersive homes are both library-based, so there is no equivalent competing root destination for a default-view setting. |
| 151 | `4dc32e8` | 2025-12-19 | Add platform badge curved corners and shadow glow options | implemented | `f5c8dc9`: the shared cover renderer keeps edge-attached badge corners coherent, rounds inset badges, and offers persistent border/glow treatments without copying Argosy's bespoke Compose geometry. |
| 152 | `831b37a` | 2025-12-19 | Move game info above carousel to prevent title overlap | superseded | Intermediate Argosy carousel layout immediately replaced by `4c9fb09`. |
| 153 | `4c9fb09` | 2025-12-19 | Reposition game info as top-right overlay | already-covered | Wingosy's immersive grid keeps each title clamped inside its own cover card instead of using a detached carousel information overlay, so the overlap/clipping failure mode is absent. |
| 154 | `f1df1da` | 2025-12-19 | Hide platform badges in single-platform views | implemented | `bf10b78`: Wingosy desktop cards now retain badges for mixed-platform Library/Favorites views and omit the repeated badge when a specific platform is selected. Immersive All/Favorites/Recent remain badged because all are mixed-platform sections. |
| 155 | `6282d11` | 2025-12-19 | Fix detekt static analysis issues and tune configuration | non-feature | Android static-analysis cleanup and configuration tuning. Its semantic icon constants reinforce the existing theme-token candidate but add no separate user-visible behavior to port. |
| 156 | `12129c6` | 2025-12-19 | Add log sanitization and comprehensive launch debugging | implemented | `e606dc6`: Wingosy launch diagnostics now retain game, emulator, executable, ROM filename, and core context while omitting user directories, raw command lines, and arguments from persistent and dry-run logs. Control characters in labels are flattened to prevent forged log lines. |
| 157 | `f6164f4` | 2025-12-19 | Bump version to 0.9.13 | non-feature | Android release metadata only. |
| 158 | `15d47d7` | 2025-12-19 | Fix save sync timestamp comparison using stale cached values | already-covered | Wingosy constructs every launch negotiation from current filesystem metadata and a fresh RomM negotiation response rather than cached local/server timestamps. Server conflict selection stays inside RomM's negotiated protocol. |
| 159 | `c3a9519` | 2025-12-19 | Bump version to 0.9.14-beta.1 | non-feature | Android prerelease metadata only. |
| 160 | `c31c87c` | 2025-12-20 | Improve save state conflict resolution and logging | candidate | Wingosy already negotiates fresh state and blocks post-session upload when RomM reports a newer save. Compatibility with legacy timestamp-suffixed latest filenames and retry semantics after a rejected update need live RomM proof before changing the fragile save path. |
| 161 | `bb3d832` | 2025-12-20 | Bump version to 0.9.14-beta.2 | non-feature | Android prerelease metadata only. |
| 162 | `b40a188` | 2025-12-20 | Add bidirectional favorites sync with RomM Collections API | candidate | Favorites already work locally in both Wingosy shells. Roaming them through RomM is portable, but needs a verified Collections API contract, explicit opt-in, durable retry state, and conflict-safe reconciliation before local choices can be written remotely. |
| 163 | `ad28ae8` | 2025-12-20 | Fix first favorites sync to merge instead of overwrite | candidate | Folded into `b40a188`: the first connected sync must union local and remote favorites rather than treating either side as authoritative, then record a baseline only after a successful merge. |
| 164 | `0ac5cc1` | 2025-12-20 | Add weekly game recommendations with repeat penalty | candidate | A small rotating recommendation rail could be useful in desktop and immersive modes, but requires deterministic/testable scoring, clear installed-versus-downloadable semantics, and a privacy-preserving local history model. Argosy's Android scheduling and DAO implementation are not copied. |
| 165 | `85f7dd5` | 2025-12-20 | Add changelog modal for post-update notifications | implemented | `22dbcbd`: Wingosy now records the first observed app version silently, then shows a desktop- and immersive-safe update dialog only after a later version change. The controller-friendly dialog links to current GitHub release notes instead of embedding Argosy-specific changelog text or Android-only required actions. |
| 166 | `864e66a` | 2025-12-20 | Add text search to Library filter menu | already-covered | Wingosy's desktop library already has case-insensitive text search, clear/empty states, and Ctrl/Cmd+F or `/` focus shortcuts; filtered queries are also passed to the native library command. Argosy's Compose filter-sheet history UI is not needed for equivalent search behavior. |
| 167 | `16371b9` | 2025-12-20 | Add platform selection step to setup wizard | candidate | Consolidated with the existing per-platform RomM sync candidate: initial selection is valuable for large servers, but must share the same reversible enablement model, safe cleanup rules, and setup/controller behavior rather than introducing a second source of platform state. |
| 168 | `8115f63` | 2025-12-20 | Bump version to 0.9.14 | non-feature | Android release metadata only. |
| 169 | `cc54e4b` | 2025-12-20 | Fix first-time recommendation generation | candidate | Folded into `0ac5cc1`: a future recommendation engine must generate an initial set when no prior schedule marker exists, while persisting the marker only after a usable result is produced. The bundled version/changelog edits are release metadata. |
| 170 | `f998a3f` | 2025-12-20 | Audit emulator registry: fix URLs, add Kenji-NX | already-covered | Wingosy maintains a Windows-specific registry that offers supported upstream sources, including Eden's official Forgejo feed and Azahar releases, while retaining compatibility detection separately. Kenji-NX and the corrected package URLs in this commit are Android-only. |
| 171 | `e438cac` | 2025-12-21 | Fix wizard crash with duplicate platform slugs | superseded | The slug deduplication avoided duplicate UI keys by discarding versioned platform identities; `13c7946` immediately replaced it with a numeric-ID/slug separation that preserves both platforms. |
| 172 | `e0e8c06` | 2025-12-21 | Bump version to 0.9.16-beta.1 | non-feature | Android prerelease metadata only. |
| 173 | `13c7946` | 2025-12-21 | Fix platform ID handling for users with platform versions | candidate | Wingosy's sync monitor keeps RomM numeric platform IDs for individual sync actions, but persisted games still collapse identity to a canonical emulator slug. Add a safe migration that retains remote platform identity separately from the launch slug so same-slug platform versions cannot cross-delete or overwrite one another. |
| 174 | `679f98b` | 2025-12-21 | Bump version to 0.9.16-beta.2 | non-feature | Android prerelease metadata only. |
| 175 | `bb5ce24` | 2025-12-21 | Fix ConfigureEmulatorUseCase tests for new signature | non-feature | Test-only follow-up for Argosy's platform-ID refactor; the portable behavior is tracked with `13c7946`. |
| 176 | `cc81d46` | 2025-12-21 | Fix background image loading on devices with outdated certificates | superseded | The custom trust-all TLS client was reverted by `d6e8ac4` and must not be ported. Its cover-as-background fallback is folded into Wingosy's existing customizable-background candidate. |
| 177 | `2834ad7` | 2025-12-21 | Bump version to 0.9.16 | non-feature | Android release metadata only. |
| 178 | `07b81bb` | 2025-12-21 | Fix silent failure patterns from codebase audit | already-covered | Wingosy refuses to mutate library state when user-requested file deletion fails, runs deletion off the async executor, and logs sync/cleanup failures. Multi-disc recovery remains in its existing candidate; fabricated timestamps and placeholder disc records are not used by Wingosy's current paths. |
| 179 | `4514960` | 2025-12-22 | Fix AppsScreen scroll crashes | not-portable | Hardens Android installed-application icon conversion and Compose grid scrolling. Wingosy is a Windows game launcher and has no Android package-manager Apps screen. |
| 180 | `d6e8ac4` | 2025-12-22 | Revert image caching to java.net.URL with better logging | already-covered | Wingosy's cover cache retains normal TLS verification and logs download failures; it never adopted the unsafe certificate bypass this commit removes. Android `java.net.URL` and Coil mechanics are not copied. |
| 181 | `2706a12` | 2025-12-22 | Merge image-cache revert branch | non-feature | Merge-only commit carrying the already-dispositioned `d6e8ac4` changes. |
| 182 | `3d5073d` | 2025-12-22 | Fix GameDetail back navigation to pop back stack | already-covered | Desktop details returns to the preserved library context and filters, while immersive details closes back to its originating library state. Wingosy does not redirect Back to an unrelated default root. |
| 183 | `f5fe4ff` | 2025-12-22 | Bump version to 0.9.17 | non-feature | Android release metadata only. |
| 184 | `605657e` | 2025-12-22 | Add play time tracking and game status sync with RomM | implemented | `e541906`: emulator sessions of at least 30 seconds now round to the nearest minute, so meaningful 30–59 second sessions are no longer discarded. Wingosy already tracks process lifetime and exposes local play time/status; RomM status/rating writes remain part of the explicit personal-metadata sync decision below. |
| 185 | `188a15f` | 2025-12-22 | Migrate AppsScreen to Coil for async icon loading | not-portable | Android package icons, Coil fetchers, and the installed-app grid have no Wingosy equivalent. |
| 186 | `f1c3c3c` | 2025-12-22 | Fix modal input handling and StatusPicker UX | already-covered | Wingosy's MUI dialogs trap focus, native select/listbox controls own their input, and immersive global hotkeys explicitly defer while a dialog, menu, or listbox has focus. It does not use Argosy's global Select-to-toggle modal state, so the stacking failure mode is absent. |
| 187 | `70b0b59` | 2025-12-23 | Improve Steam game handling and fix deletion bug | not-portable | This extends Argosy's Android launcher-APK bridge for running Steam titles through GameHub/GameNative and its matching database lifecycle. Wingosy runs natively on Windows, where users already have Steam; the indirect Android launcher selection and deletion mechanics do not apply. |
| 188 | `82dab05` | 2025-12-23 | Add fullscreen screenshot viewer with background customization | already-covered | Wingosy already opens RomM screenshots in a shared full-screen, keyboard/controller-safe lightbox from desktop and immersive details, with wrapping previous/next navigation. Setting artwork as a home background remains folded into the existing customizable-background candidate rather than coupling it to the viewer. |
| 189 | `9942402` | 2025-12-23 | Fix app icon crashes for apps with undefined intrinsic dimensions | not-portable | Guards Android package drawables with invalid intrinsic dimensions before rendering them through Coil. Wingosy has no Android installed-app icon fetcher or drawable conversion path. |
| 190 | `f23e1cd` | 2025-12-23 | Add background music feature to launcher | already-covered | Wingosy already supports optional Immersive-mode background audio from a file or folder, looping or shuffled playback, persisted enable/volume controls, and automatic playback when Immersive mode mounts. Android audio-focus and MediaPlayer lifecycle mechanics are not copied. |
| 191 | `bff1f7b` | 2025-12-23 | Fix background music volume balance and input handling | implemented | `4290d41`: Wingosy now caps ambient music at 35%, normalizes legacy or invalid configured values for both playback and settings, labels the ceiling in the UI, and tests the gain conversion. Its web-native slider already handles pointer, keyboard, and controller-mapped directional input. |
| 192 | `81d055d` | 2025-12-23 | Bump version to 0.9.18 | non-feature | Android release metadata only. |
| 193 | `b99cacf` | 2025-12-23 | Add built-in file browser for folder selection | already-covered | Wingosy uses the native Windows/Tauri folder picker for setup, ROM storage, logs, emulator saves, and ambient-audio folders. Argosy's replacement exists for Android devices without a system file manager; Android storage-volume probing and Compose D-pad panes are not needed on Windows. |
| 194 | `de10d41` | 2025-12-23 | Bump version to 0.9.19-beta.1 | non-feature | Android prerelease metadata plus static-analysis annotations and locale-stable file-size formatting for its Android-only browser; no missing Wingosy behavior. |
| 195 | `e49f857` | 2025-12-23 | Fix crash when apps have multiple launcher activities | not-portable | Deduplicates Android package-manager launcher activities for the installed-app grid. Wingosy does not enumerate Android packages or Compose app-grid keys. |
| 196 | `8aba31c` | 2025-12-23 | Add Steam game scanning and improve integration | not-portable | Scans Android GameHub/GameNative compatibility-layer files and Wine logs, then resolves titles through the Steam store for third-party launcher APKs. Wingosy runs on Windows with native Steam, so these mobile bridge scanners, stale-log warnings, and APK launcher selection do not map to its library model. |
| 197 | `09c4e35` | 2025-12-23 | Bump version to 0.9.19 | non-feature | Android release metadata only. |
| 198 | `d776a61` | 2025-12-23 | Add Android game detection and RomM APK install flow | not-portable | Android package categorization, Play Store scraping, APK installation permissions, package-added broadcasts, and app launching are outside Wingosy's Windows/Tauri architecture. |
| 199 | `0a0226a` | 2025-12-23 | Add verbose save sync logging for ZIP container diagnosis | already-covered | Wingosy's native tracing already records save-sync phases, failures, negotiated fallbacks, and safe filename/emulator context. It intentionally omits private directory listings and raw paths from persistent diagnostics; Argosy's Android logger and ZIP-container directory dump are not copied. |
| 200 | `ab05a87` | 2025-12-24 | Add missing platform slug aliases for regional variants | implemented | `49fa1c1`: Wingosy now maps RomM's `fc`, `fam`, `family_computer`, `sfc`, and `sfam` regional forms to its canonical NES/SNES launch IDs while preserving its existing unknown-slug passthrough. Focused Rust coverage verifies case and underscore normalization. |
| 201 | `8ea383a` | 2025-12-24 | Fix metadata not fetching during Android and Steam game sync | not-portable | Repairs Play Store and Android compatibility-layer Steam metadata scans. Wingosy neither catalogs Android packages nor scans Android Steam bridge launchers; its RomM sync already refreshes server metadata through a different path. |
| 202 | `59c010f` | 2025-12-24 | Add save state sync (Phase 1: local management) | candidate | Add a separately tested RetroArch state-snapshot model: discover configured state directories, cache state/screenshot pairs with core identity and version, expose reversible restore/delete controls, and keep it isolated from RomM save-file negotiation until live compatibility is proven. |
| 203 | `e673dd2` | 2025-12-24 | Fix BGM blocking UI sounds by using same audio stream | already-covered | Wingosy ambient music and UI feedback are independent HTML audio elements that WebView2 mixes concurrently; it has no Android AudioAttributes stream split or `isMusicActive` gate. |
| 204 | `93639ae` | 2025-12-24 | Fix ambient audio not resuming after rotation or game exit | already-covered | Wingosy has no Android activity rotation lifecycle. Its ambient player remounts and restarts from persisted settings whenever Immersive mode returns after the awaited emulator process exits. |
| 205 | `c28cf27` | 2025-12-24 | Add game session resume and permissions management | already-covered | Wingosy owns and awaits the Windows emulator child process, preventing a duplicate session and returning naturally when it exits. Android task flags, usage-stats access, and Manage Storage permission UI do not apply on Windows. |
| 206 | `40ad573` | 2025-12-24 | Bump version to 0.9.20-beta.3 | non-feature | Android prerelease metadata only. |
| 207 | `1b7d605` | 2025-12-24 | Filter completed games from recommendations and expand pool | candidate | Consolidated into the local recommendation candidate: score a larger pool, exclude completed/abandoned statuses before display, and apply repeat penalties only to results users actually see. |
| 208 | `10112cb` | 2025-12-24 | Add favorite penalty to recommendations and fix Controls settings | candidate | Consolidated into the local recommendation candidate so favorites can be de-emphasized without being excluded. Wingosy's native settings controls do not share Argosy's stale Compose focus-index bug. |
| 209 | `1f37178` | 2025-12-24 | Bump version to 0.9.20 | non-feature | Android release metadata only. |
| 210 | `32fa06b` | 2025-12-24 | Merge main into save-state branch | non-feature | Merge-only commit carrying already dispositioned commits 202–209. |
| 211 | `3f33cd7` | 2025-12-25 | WIP save-state sync with channel support | candidate | Consolidated into the RetroArch state-snapshot candidate: parse state-directory settings, bind cached states to save channels, and preserve core/version compatibility warnings without copying Android paths. |
| 212 | `cf81ce9` | 2025-12-25 | Fix platform ID vs slug for download directory paths | candidate | Consolidated into the distinct RomM platform-version identity candidate. Wingosy must keep the remote numeric platform identity separate while continuing to use the canonical slug for local folders and emulator launch. |
| 213 | `5253a4f` | 2025-12-25 | Merge main into save-state branch | non-feature | Merge-only commit carrying the already dispositioned download-path and save-state work. |
| 214 | `953070c` | 2025-12-25 | Add core-aware state caching and fix channel state restoration | candidate | Consolidated into the RetroArch state-snapshot candidate; core identity belongs in the cache key and switching save channels must restore the matching state set rather than reusing another core's files. |
| 215 | `3cd1efd` | 2025-12-25 | Limit state management to RetroArch and fix session sync timing | candidate | Consolidated into the RetroArch state-snapshot candidate. The narrow RetroArch-only boundary is the safe first scope; session-end capture must wait for a meaningful process lifetime and confirmed emulator exit. |
| 216 | `a3f94ed` | 2025-12-25 | Fix DownloadGameUseCaseTest missing platformSlug in test helper | non-feature | Test-only repair for Argosy's platform-ID/slug refactor; the portable behavior remains tracked with `13c7946` and `cf81ce9`. |
| 217 | `8c8527d` | 2025-12-25 | Bump version to 0.9.21-beta.1 | non-feature | Android prerelease metadata only. |
| 218 | `e94a156` | 2025-12-26 | Bump version to 0.9.21 | non-feature | Android release metadata only. |
| 219 | `86e719c` | 2025-12-26 | Fix Game Gear platform mapping and core patterns | implemented | `006d21e`: Wingosy now recognizes Game Gear as a first-class `.gg` platform, normalizes RomM's Game Gear aliases including `sgg`, and selects the correctly named Genesis Plus GX libretro core. |
| 220 | `cac12ec` | 2025-12-28 | Map N3DS platform variants to 3ds folder | implemented | `006d21e`: Wingosy now maps RomM's `n3ds` and normalized `new_nintendo_3ds` forms to the existing `3ds` folder and launch identity. |
| 221 | `beab044` | 2025-12-28 | Add external image cache and file browser audio selection | candidate | Wingosy already uses native Windows file selection and caches cover art. Extend the existing background candidate to cache remote screenshots/backgrounds safely for offline detail views. |
| 222 | `ae55b79` | 2025-12-28 | Fix custom save path not being used for downloads | candidate | Consolidated into the existing per-emulator save-path override candidate; validated custom paths must be used consistently by discovery, download, launch, and sync. |
| 223 | `e74a18d` | 2025-12-28 | Add .ref to gitignore | non-feature | Repository ignore-list maintenance only. |
| 224 | `e610a1f` | 2025-12-28 | Fix sync filter blocking legitimate ROMs | candidate | Consolidated into the recovery-safe sync-filter candidate: filters must not treat ordinary punctuation such as parentheses as proof that a ROM is a hack or bad dump. |
| 225 | `2168f23` | 2025-12-28 | Fix file selection in internal file browser | already-covered | Wingosy delegates file and folder selection to the native Windows/Tauri pickers and does not maintain Argosy's internal-browser selection state. |
| 226 | `8783e23` | 2025-12-28 | Add per-platform resync functionality | already-covered | Wingosy already exposes per-platform RomM sync with progress through the sync monitor (`57bc35f`). |
| 227 | `9ad117d` | 2025-12-28 | Add resync platform option to library quick menu | already-covered | The same per-platform sync is available from Wingosy's controller-accessible platform sync monitor. |
| 228 | `23986d1` | 2025-12-28 | Clean up unused code and fix permission card tap handling | not-portable | Kotlin cleanup plus Android permission-card touch routing; Wingosy uses native desktop permissions and controls. |
| 229 | `d8a174c` | 2025-12-28 | Bump version to 0.9.22 | non-feature | Android release metadata only. |
| 230 | `51516c8` | 2025-12-29 | Fix platform resync and image cache regressions | already-covered | Wingosy's platform sync retains numeric RomM IDs for requests, and cover-cache work is queued after each upsert without Argosy's worker/in-memory cache race. |
| 231 | `beabc08` | 2025-12-29 | Fix foreign key constraint in platform ID migration | candidate | Consolidated into the platform-version identity migration candidate; the eventual schema change must rebuild dependent rows without disabling referential safety. |
| 232 | `ff73788` | 2025-12-29 | Migrate platform IDs from String to Long | candidate | Consolidated into the platform-version identity candidate, keeping remote numeric IDs distinct from canonical emulator slugs. |
| 233 | `f70aadb` | 2025-12-29 | Add instant download for small files | already-covered | Wingosy starts every requested download immediately instead of holding small jobs behind a persistent background queue, so no size threshold is needed. |
| 234 | `3214426` | 2025-12-29 | Fix settings navigation, emulator links, and image cache fallback | already-covered | Wingosy's settings use native pointer/keyboard controls and its cover components fall back to placeholders when an image fails; Android package-link navigation is not applicable. |
| 235 | `2726a12` | 2025-12-29 | Fix platform ID migration and prioritize game detail images | candidate | The migration portion remains with the platform-version identity candidate. Wingosy detail screenshots are fetched independently, so Argosy's shared cache queue priority is not copied. |
| 236 | `77f1aa4` | 2025-12-29 | Bump version to 0.9.25 | non-feature | Android release metadata only. |
| 237 | `947d5ae` | 2025-12-29 | Fix storage section D-pad navigation for instant download threshold | not-portable | Navigation for an Argosy-only instant-download threshold; Wingosy has no such queued-download setting. |
| 238 | `d31a083` | 2025-12-30 | Reset modals and drawer on app resume to sync UI with input state | already-covered | Wingosy's single mounted gamepad mapper routes through current React view state and has no Android Activity-resume subscription reset. |
| 239 | `226907d` | 2025-12-26 | WIP: Add NSW multi-file download handling with updates/DLC support | candidate | Consolidated into archive-aware multi-file installation: model base ROMs, updates, and DLC without importing Android emulator package mechanics. |
| 240 | `755cad8` | 2025-12-30 | Add multi-platform zip extraction with updates/DLC support | candidate | Consolidated into platform-context-aware extraction and multi-file installation, with traversal-safe extraction and unambiguous platform routing. |
| 241 | `2489792` | 2025-12-31 | Add 3DS extension toggle, AzaharPlus support, and extraction recovery | candidate | Wingosy already supports Azahar. Extraction recovery and preserving the intended ROM extension remain part of the archive-install candidate; Android package variants are not copied. |
| 242 | `09f6b15` | 2025-12-31 | Improve Updates/DLC modal and extraction progress UI | candidate | A future multi-file installer should surface extraction progress and recoverable failures consistently in desktop and immersive modes. |
| 243 | `1a6b7cb` | 2025-12-31 | Fix 3DS file extension D-pad cycling in emulator settings | not-portable | Fixes controller navigation for an Android emulator-specific extension toggle that Wingosy does not need. |
| 244 | `568133a` | 2025-12-31 | Lazy rename 3DS files on launch instead of on setting change | not-portable | Android 3DS emulator package variants require extension rewriting; Wingosy launches supported Windows Azahar formats directly. |
| 245 | `f96d18e` | 2025-12-31 | Unify folder-based ROM extraction with RomM folder conventions | candidate | Consolidated into platform-context-aware archive installation, including folder ROMs and stable RomM identity after extraction. |
| 246 | `90384ea` | 2025-12-31 | Remove disc selection UI in favor of emulator-native M3U handling | candidate | Consolidated into the multi-disc candidate; Wingosy should generate a correct playlist where supported while retaining an accessible fallback for emulators that require explicit selection. |
| 247 | `007c667` | 2025-12-31 | Fix M3U generation to only consider root-level disc files | candidate | Consolidated into the multi-disc candidate; generated playlists must exclude nested update/content files and unrelated discs. |
| 248 | `af9a0c9` | 2025-12-31 | Add comprehensive tests for ZipExtractor folder ROM extraction | non-feature | Test-only follow-up for unresolved archive behavior. |
| 249 | `38bb34b` | 2025-12-31 | Add platform save/state path config and quick settings panel | candidate | Consolidated into existing save-path overrides and RetroArch state snapshots, with equivalent desktop and immersive controls rather than an Android overlay. |
| 250 | `adbf5be` | 2025-12-31 | Bump version to 0.10.0 | non-feature | Android release metadata only. |
| 251 | `c4fc69a` | 2026-01-01 | Fix download progress display and add smart zip extraction | candidate | Wingosy already reports byte progress. Safe, platform-aware extraction remains in the archive-install candidate. |
| 252 | `c7cb490` | 2026-01-01 | Add background downloads and screen dimmer for burn-in protection | candidate | Android foreground-service mechanics do not apply, but an opt-in inactivity dimmer is portable for OLED handheld and couch displays and needs pointer/controller wake coverage. |
| 253 | `e2f6d38` | 2026-01-01 | Bump version to 0.10.1 | non-feature | Android release metadata only. |
| 254 | `a9c5669` | 2026-01-02 | Add BIOS management feature | candidate | Add per-platform Windows firmware requirements, configured-path validation, presence/version status, and safe user-directed installation without redistributing restricted firmware. |
| 255 | `2fb2cc8` | 2026-01-02 | Fix disc-based game launching and improve BIOS distribution | candidate | Disc launching remains with the multi-disc candidate; permitted open firmware distribution and validation remain with BIOS management. |
| 256 | `6ffd1c6` | 2026-01-02 | Bump version to 0.11.0 | non-feature | Android release metadata only. |
| 257 | `9f028e0` | 2026-01-02 | Fix BIOS distribution and platform name display | candidate | Consolidated into BIOS management; match by canonical platform identity and show user-facing platform names without coupling firmware paths to Android storage. |
| 258 | `6275116` | 2026-01-02 | Add Quick Menu overlay (L3 trigger) | already-covered | Wingosy immersive mode already provides controller-first Library, Recent, Favorites, details, help, and settings navigation without a second launcher overlay. |
| 259 | `cd74f02` | 2026-01-03 | Fix melonDS launch by using data URI only | not-portable | Android content-URI launch contract only; Wingosy passes Windows filesystem paths to melonDS. |
| 260 | `0a7c2af` | 2026-01-03 | Improve melonDS compatibility for Beta and Nightly versions | not-portable | Android package/activity variants and URI grants do not map to Wingosy's Windows executable discovery. |
| 261 | `7d068c4` | 2026-01-03 | Add Collections feature with RomM sync support | candidate | Add user collections only after verifying the current RomM Collections API, with offline-safe local membership and desktop/immersive management. |
| 262 | `868294e` | 2026-01-03 | Bump version to 0.12.0-beta.1 | non-feature | Android prerelease metadata only. |
| 263 | `a1c4c64` | 2026-01-03 | Improve Collections UX and add quick menu integration | candidate | Consolidated into the collections candidate: creation, rename/delete, membership actions, and controller-complete browsing should ship as one vertical slice. |
| 264 | `f6f02ef` | 2026-01-03 | Improve WideGameCard footer with themed styling and curved ears | already-covered | Wingosy uses its own responsive, theme-aware desktop and immersive card system; Argosy's Compose card geometry is branding-specific. |
| 265 | `19e7a03` | 2026-01-03 | Add fuzzy search and improve Collections UX | implemented | `a143f0b`: Wingosy library search now normalizes accents/punctuation and matches multi-word prefixes, subsequences, and bounded typos locally while preserving platform, favorite, availability, and sort filters. Collection actions remain consolidated in the collections candidate. |
| 266 | `aafa1c3` | 2026-01-03 | Use People icon for community rating in Quick Menu | already-covered | Wingosy's desktop details already distinguish the community rating with a Groups icon and explicit label; immersive mode uses an explicit text label rather than an ambiguous personal-rating star. |
| 267 | `a6576aa` | 2026-01-03 | Bump version to 0.12.0-beta.2 | non-feature | Android prerelease metadata only. |
| 268 | `59a713e` | 2026-01-03 | Improve startup flash, hidden games filter, and image cache reliability | already-covered | Wingosy has stable loading surfaces, restores hidden games through Settings, retries URL-addressed cover downloads during sync, and filters Recent to locally playable entries. The stronger content validation is recorded separately at commit 273. |
| 269 | `d33a814` | 2026-01-03 | Bump version to 0.12.0 | non-feature | Android release metadata only. |
| 270 | `2a0c931` | 2026-01-03 | Focus filtered collections in collection selection modal | candidate | Consolidated into the collections candidate: keyboard/controller focus must follow the visible filtered list rather than the unfiltered backing index. |
| 271 | `75257f0` | 2026-01-04 | Fix Citra core, modal input, hidden labels, image cache, and focus bugs | already-covered | Wingosy handles 3DS through managed Azahar, uses pointer-native desktop dialogs, labels hidden-game actions accurately, hashes cover URLs into cache keys, and mounts one persistent gamepad mapper rather than route-scoped subscriptions. |
| 272 | `1e35637` | 2026-01-04 | Prevent stale image cache when RomM IDs are reassigned | already-covered | Wingosy's cached filename combines the RomM ID with a hash of the cover URL, and sync stores the remote URL before recaching, so a reassigned ID cannot reuse bytes from a different URL. |
| 273 | `5573075` | 2026-01-04 | Add comprehensive image cache validation | implemented | `876d8f0`: Wingosy now validates cached and downloaded JPEG, PNG, GIF, and WebP content; invalid existing files are removed and redownloaded, and malformed responses are rejected before the database cache path is updated. Three Rust tests cover valid signatures, truncation/non-images, and invalid-cache replacement. |
| 274 | `2ea324b` | 2026-01-04 | Fix cold-boot focus and Continue Playing loading | already-covered | Wingosy has no Android storage-mount lifecycle; native requests complete before loading clears and Recent selection verifies real local paths. |
| 275 | `34a47fe` | 2026-01-04 | Fix controller input on cold start | already-covered | Wingosy uses one persistent requestAnimationFrame gamepad mapper, avoiding per-route subscription timing and cold-start attachment races. |
| 276 | `62142ae` | 2026-01-04 | Add cache-validation progress and fix first controller input | candidate | Per-file cache content validation is implemented and first controller input is already covered; a user-invoked full-cache validation action with progress remains useful and is consolidated into image-cache maintenance. |
| 277 | `4a90369` | 2026-01-04 | Fix StatusPicker touch input | already-covered | Wingosy's MUI dialog and list controls use native pointer activation across mouse and touch input. |
| 278 | `beb5bd8` | 2026-01-04 | Bump version to 0.12.1-beta.1 | non-feature | Android prerelease metadata only. |
| 279 | `10078a8` | 2026-01-04 | Prevent cursor crash while hiding games | already-covered | Wingosy filters in-memory collections and does not expose an Android SQLite CursorWindow stream that can close during the mutation. |
| 280 | `fa58fac` | 2026-01-04 | Add CCI extension to 3DS platform filter | already-covered | `.cci` is already included in Wingosy's default 3DS extension list, and managed Azahar launches the selected filesystem path directly. |
| 281 | `c05cc2f` | 2026-01-04 | Bump version to 0.12.2 | non-feature | Android release metadata only; no portable runtime behavior. |
| 282 | `ada75a7` | 2026-01-05 | Add comprehensive box art styling customization | implemented | `f5c8dc9`: added validated, persisted cover corners, frame effects, platform-label placement/inset, and a live preview, shared by desktop and Immersive cards. Deliberately omits Argosy-specific glass/shine rendering and Android input mechanics. |
| 283 | `9162b3f` | 2026-01-05 | Remove redundant comments from settings code | non-feature | Comment cleanup only; no runtime behavior changed. |
| 284 | `f6397cb` | 2026-01-05 | Fix naming collision when extracting folder-based multi-file ROMs | candidate | Consolidated into platform-context-aware archive installation: choose collision-free archive/extraction paths, preserve folder-ROM identity, and never delete an extracted directory as though it were the downloaded archive. Android storage mechanics are not copied. |
| 285 | `7bbcc95` | 2026-01-05 | Fix game detail modal input handling and status sync | decision-needed | Wingosy already uses pointer-safe MUI actions, while updates/DLC remain in the archive candidate. Avoiding remote refresh overwrite of queued personal status/rating/difficulty changes belongs to the existing RomM personal-metadata sync decision and requires a tested write/conflict contract. |
| 286 | `65b3e00` | 2026-01-05 | Add Android game title fallback, GameHub link, and folder creation | not-portable | Android package-category fallback and GameHub/Play Store links do not apply to a native Windows launcher. Wingosy's native folder picker already permits selecting or creating local destinations without copying Android SAF behavior. |
| 287 | `5e1e115` | 2026-01-05 | Add Steam platform to Emulators settings and clean up file browser footer | not-portable | The Steam entries are Android compatibility-layer packages; Wingosy runs on Windows where native Steam is available. Android footer wording and package detection are not portable behavior. |
| 288 | `8272c13` | 2026-01-05 | Adjust game info positioning on Home screen | already-covered | Wingosy's desktop and Immersive layouts keep title metadata attached to responsive game cards/details rather than a fixed detached overlay, so the Android carousel-overlap correction is unnecessary. |
| 289 | `c4d0c0b` | 2026-01-05 | Add pinned collections with home screen prefetching | candidate | Consolidated into RomM-backed collections: include regular and virtual pins, controller-complete pin/reorder management, prefetched membership, explicit empty/loading states, and refresh throttling after verifying the current Collections API. |
| 290 | `acf3d82` | 2026-01-05 | Bump version to 0.13.0 | not-portable | The only functional emulator addition is an Android Cemu fork sharing the official package name; Wingosy already supports native Windows Cemu. The remaining version, default style, and Argosy branding changes are release/presentation metadata. |
| 291 | `79b448c` | 2026-01-05 | Refine glass border+stub effect to eliminate blur seam | already-covered | Wingosy's shared cover renderer does not use Argosy's combined glass badge/frame clipping path, so the Compose blur seam is absent; existing border/glow styling stays platform-native. |
| 292 | `b242fdd` | 2026-01-05 | Remove redundant comments and debug logs | non-feature | Comment and debug-log cleanup only; no portable user-visible behavior. |
| 293 | `6751a75` | 2026-01-05 | Add dual-color mode with secondary accent color | implemented | `91b5b8b`: added persisted primary/secondary hue palettes, legacy-safe theme persistence, a secondary appearance control that defaults to primary, and consistent secondary color for cloud-only games plus ROM/download/library-sync progress across desktop and Immersive views. |
| 294 | `01d65c9` | 2026-01-05 | Redesign notification popup for compact elegance | already-covered | Wingosy's MUI snackbar/alert surfaces are already compact, non-blocking, semantically colored, and positioned clear of primary content; Argosy's Compose spring/glass treatment is design-specific. |
| 295 | `d19db53` | 2026-01-05 | Implement progressive blur falloff for glass inner effect | not-portable | Compose-specific shader/clipping refinement for Argosy's glass card effect. Wingosy deliberately uses simpler border/glow treatments and has no equivalent blur stack to repair. |
| 296 | `b1d09fe` | 2026-01-06 | Add foreground service for background sync operations | not-portable | Android foreground-service, wake-lock, and notification-channel lifecycle mechanics do not map to Wingosy's foreground Windows/Tauri process. Wingosy already exposes active library/download progress while the desktop app owns the work. |
| 297 | `df21c09` | 2026-01-06 | Disambiguate platforms with duplicate slugs | candidate | Consolidated into distinct RomM platform-version identity: preserve the remote numeric platform ID before selecting full-name badge labels, so duplicate canonical slugs are not merely relabeled after being merged. |
| 298 | `a9aa0b6` | 2026-01-06 | Fix save restore path fallback and game switching | candidate | Server-filename restore fallback belongs to path-aware save sync and needs live RomM negotiation proof. Wingosy does not force-stop an unrelated emulator: its single-flight native launch guard owns one emulator process through post-launch sync and rejects overlapping launches. |
| 299 | `5f3d168` | 2026-01-06 | Bump version to 0.13.1 | non-feature | Android release metadata only. |
| 300 | `94ef754` | 2026-01-06 | Add extraction feedback and improve Switch save path detection | already-covered | Wingosy exposes download/install progress and its Windows Switch resolver restores title-root archives into the newest valid user/profile tree, without copying Android notifications or Compose animation. |
| 301 | `f5c4250` | 2026-01-06 | Bump version to 0.13.2-beta.1 | non-feature | Android beta release metadata only. |
| 302 | `cd0c7bb` | 2026-01-06 | Fix Switch profile folder validation to accept 32-char hex IDs | already-covered | Wingosy's Switch resolver already accepts both 16- and 32-character hexadecimal profile IDs and selects the newest non-zero profile. |
| 303 | `13669c2` | 2026-01-06 | Bump version to 0.13.2-beta.2 | non-feature | Android beta release metadata only. |
| 304 | `bf78c24` | 2026-01-07 | Improve save path detection fallbacks | already-covered | Wingosy probes core-specific and flat RetroArch save layouts across portable, AppData, and LocalAppData locations; its launcher supplies the resolved emulator/core, and its Switch resolver already validates profiles and title IDs. |
| 305 | `0f232e8` | 2026-01-07 | Fix game-specific core settings not persisting | already-covered | Wingosy's per-game emulator setter always replaces or inserts the complete emulator/core override row, and launch resolution reads that row before platform defaults. |
| 306 | `4edbbfa` | 2026-01-07 | Fix Dolphin launch failing with scoped storage | not-portable | Android content-URI permissions and Dolphin intent extras do not apply to Wingosy's native Windows process launch, which passes a filesystem path directly. |
| 307 | `e9c674d` | 2026-01-07 | Improve save path detection fallbacks | already-covered | Wingosy already checks configured, core-specific, and flat RetroArch save/state layouts and resolves the selected emulator before sync. The commit's intermediate same-slug migration was replaced by Argosy's numeric-ID-only fix at `28e9098`, tracked separately below. |
| 308 | `2887503` | 2026-01-07 | Use RomM-provided platform names instead of canonical names | candidate | Consolidated into distinct RomM platform-version identity: retain the remote display name with the numeric platform ID while keeping Wingosy's canonical slug for emulator selection and local paths. |
| 309 | `fe0e6f9` | 2026-01-07 | Fix Continue Playing not populating on cold boot | already-covered | Wingosy does not invalidate recent entries during startup from an Android-style delayed storage mount. Desktop Recent selection is derived after the library loads and requires a stored local path without destructively rewriting the row on a transient volume state. |
| 310 | `edcee9f` | 2026-01-07 | Fix null safety issues in API response and DB operations | already-covered | Wingosy's Rust API and database paths use `Result`/`Option` checks and return explicit errors for absent response bodies or rows rather than relying on Kotlin-style non-null assertions. |
| 311 | `93e629d` | 2026-01-07 | Fix APK files being extracted instead of kept for installation | not-portable | Wingosy does not download or install Android APKs; its archive handling is scoped to Windows ROM and emulator packages. |
| 312 | `e616d81` | 2026-01-07 | Bump version to 0.13.2-beta.3 | non-feature | Android beta release metadata only. |
| 313 | `b136580` | 2026-01-07 | Change UI sounds to prevent BGM ducking | not-portable | Android `AudioAttributes` usage categories have no browser/WebView equivalent. Wingosy mixes its UI sounds and ambient audio inside the same Web Audio graph with independent persisted levels. |
| 314 | `395a5f2` | 2026-01-07 | Fix extracting border animation to rotate gradient instead of shape | superseded | Intermediate Compose extraction-border treatment replaced by `838f8f8` eleven commits later; Wingosy does not use this rotating border. |
| 315 | `28e9098` | 2026-01-07 | Fix platforms with same slug being merged during sync | candidate | Consolidated into distinct RomM platform-version identity: numeric RomM IDs must own remote identity and cleanup scope, while the canonical slug remains a separate launch/path field. |
| 316 | `65361aa` | 2026-01-07 | Add Reset Library option to Storage settings | candidate | Add a separately confirmed recovery action that clears Wingosy metadata and derived image cache while preserving downloaded ROMs, configuration, credentials, and save data; verification must prove the preserved paths before any destructive operation. |
| 317 | `466bfa5` | 2026-01-07 | Use displayName for library header platform name | candidate | Consolidated into distinct RomM platform-version identity so remote names can be shown consistently without using display labels as launch or storage keys. |
| 318 | `caa0b47` | 2026-01-07 | Use RomM platform names consistently everywhere | candidate | Consolidated into distinct RomM platform-version identity; use the remote name across library surfaces after the schema safely separates it from the canonical emulator slug. |
| 319 | `309f461` | 2026-01-07 | Log error body on save upload failure | already-covered | Wingosy reports save-sync operation context and HTTP failure status while deliberately avoiding raw server bodies that may contain private paths, tokens, or untrusted content. |
| 320 | `032f6cf` | 2026-01-07 | Use platform slug for game card badge | already-covered | Wingosy's desktop and Immersive cards use the shared bounded canonical platform badge label rather than a full display name. |
| 321 | `f4981b8` | 2026-01-07 | Add device performance and fan controls to Quick Settings | not-portable | AYN PServerBinder, Android system settings, and device-specific sysfs fan paths do not map to a general Windows launcher; speculative OEM control is intentionally out of scope. |
| 322 | `7769b0c` | 2026-01-07 | Force platform badge slugs to uppercase | already-covered | Wingosy's shared `platformBadgeLabel` returns compact uppercase labels in both desktop and Immersive cards. |
| 323 | `b5c9dd1` | 2026-01-07 | Improve save sync logging and title ID detection | candidate | Consolidated into path-aware save sync: retain privacy-safe structured diagnostics, minimum-content validation, and newest valid title/profile discovery, with live RomM negotiation proof before changing restore behavior. Wingosy already handles 16/32-character Switch profiles. |
| 324 | `cfd55c4` | 2026-01-07 | Map collection Options action to SELECT instead of START | candidate | Consolidated into RomM-backed collections: reserve global settings input, choose a controller-complete collection action mapping, and keep on-screen hints aligned when collections are implemented in both shells. |
| 325 | `838f8f8` | 2026-01-07 | Fix spinning border to show single color section | not-portable | Compose-specific extraction-border animation polish; Wingosy uses ordinary transfer progress indicators rather than a rotating gradient border. |
| 326 | `5c10aa2` | 2026-01-07 | Bump version to 0.13.2-beta.4 | non-feature | Android beta release metadata only. |
| 327 | `814b671` | 2026-01-08 | Fix save sync download failing when emulatorId is default | already-covered | Wingosy's launch path resolves the effective per-game or per-platform emulator before pre/post-launch sync and passes that concrete Windows emulator identity into its save resolver. |
| 328 | `ce4db53` | 2026-01-08 | Block gamepad input briefly after wake | not-portable | Workaround for a spurious Odin 3 Android wake event. Wingosy has no evidence of the hardware-specific phantom input and should not add latency to every Windows focus regain. |
| 329 | `e976464` | 2026-01-08 | Comprehensive save sync reliability improvements | candidate | Consolidated into path-aware save sync and recovery hardening: validate free space and response bodies, preserve backups before overwrite, retry transient downloads, normalize title IDs, and keep emulator resolution single-sourced, with live RomM negotiate/no-op proof for the fragile save paths. |
| 330 | `e9b9f82` | 2026-01-08 | Prevent auto-state from overwriting restored timeline saves | candidate | Consolidated into RetroArch state snapshots tied to save channels: a non-latest restore must suppress stale auto-state replay, while returning to latest restores the matching core/channel state reversibly. |
| 331 | `5b1b256` | 2026-01-08 | Add Platform Filters modal to Sync Settings | candidate | Consolidated into per-platform RomM enablement: expose reversible toggles and counts in desktop and Immersive settings, use live platforms with cached fallback, and exclude disabled platforms from both sync and orphan cleanup. |
| 332 | `ddb02a7` | 2026-01-08 | Add cemu_dualscreen save config to fix Wii U save sync | not-portable | The duplicate Android package-ID ambiguity does not exist for Wingosy's native Windows Cemu executable; Windows Wii U save discovery belongs to emulator-specific path work rather than an Android registry alias. |
| 333 | `db43178` | 2026-01-08 | Sort favorites with installed games first | implemented | `037c999`: desktop and Immersive favorites now stable-partition installed games ahead of cloud-only entries while preserving the user's selected sort order within each group. |
| 334 | `5a92044` | 2026-01-08 | Bump version to 0.13.2-beta.5 | non-feature | Android beta release metadata only. |
| 335 | `4fe6555` | 2026-01-08 | Fix StorageSettingsDelegateTest to include new dependencies | non-feature | Test-fixture maintenance for Argosy's existing reset-library dependencies; no portable runtime behavior. |
| 336 | `2b72300` | 2026-01-08 | Fix WideGameCard ear offset to match fixed border thickness | non-feature | Argosy-specific Compose card geometry adjustment with no missing Wingosy behavior. |
| 337 | `ba22033` | 2026-01-08 | Block input for 200ms on resume to prevent phantom inputs | not-portable | Repeats the Android handheld wake workaround from `ce4db53`; Wingosy has no evidence of phantom Windows resume input and should not delay all controller input. |
| 338 | `b998d78` | 2026-01-08 | Add section-focused scrolling to settings views | candidate | Add explicit controller focus ownership to Immersive settings, keep the active control visible, and align the on-screen D-pad/A hints with actual navigation; preserve browser-native desktop interaction rather than copying Compose indices. |
| 339 | `54dba02` | 2026-01-08 | Add Vibrant Colors mode for box art borders | candidate | Wingosy's existing optional cover frames can gain artwork-derived, theme-safe color gradients, but extraction must be cached, bounded, accessible, and consistent between desktop and Immersive cards. |
| 340 | `7799087` | 2026-01-08 | Fix multi-disc download conflicts and m3u generation | candidate | Consolidated into multi-disc installation: prefer one canonical grouped game without deleting recoverable local data, discover nested disc files, place sibling downloads together, and regenerate playlists after retry. |
| 341 | `f6d1cdc` | 2026-01-08 | Add missing content detection and download from game detail | candidate | Consolidated into archive-aware multi-file installation: retain remote update/DLC identity, show missing content in both shells, and migrate flat-disc records into grouped games only after aggregating metadata and validating every preserved local path. |
| 342 | `f29a975` | 2026-01-08 | Add YouTube video preview on home screen | candidate | Opt-in trailer previews are portable if RomM supplies a verified video ID, but Wingosy needs explicit network/privacy behavior, mute/data controls, focus-safe cancellation, and a no-video fallback before adding autoplay. |
| 343 | `eca7d1a` | 2026-01-09 | Filter macOS resource fork files from ROM selection | implemented | `b0b8a8e`: Wingosy now rejects AppleDouble `._*` sidecars during recursive/local single-file scans and path rediscovery, preventing metadata files from becoming launchable ROM entries. |
| 344 | `b645f45` | 2026-01-09 | Fix gamepad navigation with dialogs and improve download handling | already-covered | Wingosy already normalizes omitted RomM URL schemes, uses modal focus containment, resolves RomM download filenames from server metadata, and presents persistent actionable errors. Android Compose focus indices and layout fixes are not copied. |
| 345 | `450c761` | 2026-01-10 | Simplify controller layout settings with auto-detection | candidate | Consolidated with controller identification: detect Windows gamepad identity where available and offer an explicit Auto/Xbox/Nintendo presentation override without changing the user's emulator mappings. |
| 346 | `dd01885` | 2026-01-10 | Fix synced saves not renamed for RetroArch | already-covered | Wingosy's RetroArch restore path derives the destination stem from the launched ROM and recognizes both RomM latest-slot names and ROM-named saves; focused native tests cover this compatibility. |
| 347 | `641c26d` | 2026-01-10 | Add ARMSX2 and rename AetherSX2 to NetherSX2 | not-portable | Android package detection and intent launch support for mobile PS2 emulators do not apply to Wingosy's native Windows PCSX2 integration. |
| 348 | `bf9dfc6` | 2026-01-10 | Add Quick Menu recent searches and fix video/settings issues | candidate | Persist a bounded, deduplicated recent-search list for Wingosy's library and expose it through keyboard/pointer plus controller-complete Immersive search; Android WebView lifecycle and Compose quick-setting fixes are not ported. |
| 349 | `c7ec72d` | 2026-01-10 | Bump version to 0.14.0 | non-feature | Android release metadata only. |
| 350 | `d0a29e4` | 2026-01-10 | Fix ZIP extraction errors and DuckStation launch intent | candidate | Consolidated into archive-aware installation: validate completeness and archive readability before extraction, retain recoverable failure state, and redownload corrupt content explicitly. Android DuckStation intents and core IDs are not portable. |
| 351 | `7d2796e` | 2026-01-10 | Bump version to 0.14.1 | non-feature | Android release metadata only. |
| 352 | `88db9c0` | 2026-01-10 | Fix DuckStation launch and stop video on game launch | not-portable | Android intent action correction and the then-current Compose video-preview lifecycle do not apply to Wingosy's native DuckStation launch path; future trailer cancellation is tracked separately. |
| 353 | `47ab2e8` | 2026-01-10 | Bump version to 0.14.2 | non-feature | Android release metadata only. |
| 354 | `35bac3c` | 2026-01-10 | Don't auto-resume video preview on device wake | superseded | Intermediate Android WebView lifecycle fix superseded by `529384f` and then process-level handling in `b5212ff`. |
| 355 | `3704f40` | 2026-01-10 | Bump version to 0.14.3 | non-feature | Android release metadata only. |
| 356 | `0e6a2a7` | 2026-01-10 | Add PS2 BIOS distribution support for NetherSX2 | already-covered | Wingosy downloads RomM firmware with checksum validation and distributes PS2 firmware into the configured Windows PCSX2 `bios` directory. Android NetherSX2 paths are platform-specific. |
| 357 | `3a83190` | 2026-01-10 | Bump version to 0.14.4 | non-feature | Android release metadata only. |
| 358 | `529384f` | 2026-01-10 | Fix video preview auto-starting after device wake | superseded | Intermediate suppression flag for Android activity resume, replaced by the broader process-level stop/suppression behavior in `b5212ff`. |
| 359 | `8475c89` | 2026-01-10 | Bump version to 0.14.5 | non-feature | Android release metadata only. |
| 360 | `407cc69` | 2026-01-10 | Improve Android game box art quality | not-portable | Play Store scraping, APK icon replacement, and Android-app metadata refresh do not apply to Wingosy's ROM/RomM cover pipeline. |
| 361 | `079d7a6` | 2026-01-10 | Bump version to 0.14.6 | non-feature | Android release metadata only. |
| 362 | `b5212ff` | 2026-01-11 | Fix video preview not stopping when app loses focus | candidate | Consolidated into opt-in trailer previews: stop and release embedded media on window blur, navigation, launch, and teardown, then require fresh user navigation before autoplay can resume. Android lifecycle dependencies are not copied. |
| 363 | `a6ecd17` | 2026-01-11 | Bump version to 0.14.7 | non-feature | Android release metadata only. |
| 364 | `21cf9df` | 2026-01-11 | Add NEW badge for recently added unplayed games | implemented | `bff4bbc`: desktop and Immersive cards now mark installed, unplayed games added within the previous 24 hours, backed by Wingosy's persisted database creation timestamp and shared eligibility tests. |
| 365 | `b8b2206` | 2026-01-11 | Add PS2 disc selection and fix video preview restart | candidate | Consolidated into the existing multi-disc and opt-in trailer candidates: emulators that cannot launch M3U playlists need an accessible disc choice in both shells, while preview media must not restart merely because focus returns after launch. Android intents and Compose lifecycle mechanics are not copied. |
| 366 | `32aadbc` | 2026-01-11 | Bump version to 0.14.8 | non-feature | Android release metadata only. |
| 367 | `da004d8` | 2026-01-11 | Add CHD support for PSP games | implemented | `a0a26ed`: Wingosy now recognizes `.chd` as a supported PSP image format, with focused registry coverage. |
| 368 | `8b41f18` | 2026-01-11 | Bump version to 0.14.9 | non-feature | Android release metadata only. |
| 369 | `f73a6a7` | 2026-01-11 | Pre-compute gradient colors during cover caching | candidate | Consolidated into artwork-derived vibrant cover frames: derive and cache a bounded palette alongside validated cover assets so desktop and Immersive rendering does not repeatedly decode artwork. |
| 370 | `d4fcfaa` | 2026-01-11 | Fix Flycast launch intent to use file:// URI scheme | not-portable | Android intent URI construction does not apply to Wingosy's native Windows Flycast command-line launch path. |
| 371 | `dbec8a0` | 2026-01-11 | Bump version to 0.14.10 | non-feature | Android release metadata only. |
| 372 | `1bee156` | 2026-01-11 | Fix test and update addedAt on download completion | candidate | Wingosy's NEW badge currently uses the library record creation time. Track a distinct successful install/download timestamp before changing badge semantics so remote discovery time remains intact and failed transfers cannot appear newly installed. |
| 373 | `8b6c2a5` | 2026-01-11 | Bump version to 0.14.11 | non-feature | Android release metadata only. |
| 374 | `47a75e8` | 2026-01-11 | Prevent video preview from starting after device wake | candidate | Consolidated into opt-in trailer previews: resume must require fresh navigation or an explicit action after wake/focus restoration, not merely a returning app lifecycle. |
| 375 | `e852c5c` | 2026-01-11 | Mute video preview when ambient audio is enabled | candidate | Consolidated into opt-in trailer previews: preview audio should default muted whenever Wingosy's ambient background audio is active, with one clear user-controlled audio owner. |
| 376 | `293d98e` | 2026-01-11 | Bump version to 0.14.12 | non-feature | Android release metadata only. |
| 377 | `7490c48` | 2026-01-12 | Add Commodore 64 RetroArch support and fix arcade zip extraction | implemented | `7db590e`: Wingosy now recognizes C64 disk, tape, program, and cartridge images, normalizes RomM C64 aliases, launches them with the verified VICE x64 RetroArch core, and presents C64 consistently in desktop and Immersive views. Archive handling remains consolidated into the existing platform-aware installation candidate rather than copying Android extraction mechanics. |
| 378 | `fd82e70` | 2026-01-12 | Fix gradient border not showing in library view | candidate | Consolidated into artwork-derived vibrant cover frames, whose eventual implementation must share the same cached palette and rendering policy across every card surface. |
| 379 | `7b9d4c1` | 2026-01-12 | Bump version to 0.14.13 | non-feature | Android release metadata only. |
| 380 | `1ea1a2e` | 2026-01-12 | Fix VICE x64sc core display name | implemented | `7db590e`: Wingosy uses a single explicit default mapping to the current VICE x64 core; it does not expose Argosy's mislabeled x64sc choice. Future selectable core labels remain covered by the existing compatible-core candidate. |
| 381 | `7a5ece6` | 2026-01-12 | Add missing C64 file extensions | implemented | `7db590e`: added the upstream-supported C64 disk, tape, program, and cartridge extensions while intentionally withholding ambiguous archive formats until platform-aware archive discovery is implemented. |

## Implemented parity outside the chronological audit

These features were implemented before this ledger existed. They are useful
cross-references, but they do not advance the chronological cursor; the matching
Argosy commits must still be recorded when encountered.

| Wingosy commit | Capability |
|---|---|
| `57bc35f` / merge `2505564` | Per-platform RomM library sync monitor with progress and controller-accessible navigation. |
| `fe9b0f4` / merge `1174c52` | RomM-backed RetroAchievements definitions, progress, badge art, refresh, and hardcore status. |
| `b93b365` | Achievement completion bars, earned/total points, empty states, accessibility, and stale-request protection. |
| `c0289bb` | Case-insensitive normalization of local RomM hostnames. |

## Candidate backlog

| Argosy commit | Candidate | Scope needed to resolve |
|---|---|---|
| `0e4296d` | Resumable, pausable concurrent ROM downloads | Native persistent job queue, Range-capable transfer restart, queue policy, and desktop/immersive controls. |
| `6ecfe99` | Non-blocking cleanup after cancelling downloads | Complete this only alongside the durable transfer-job model so cancellation, partial-file cleanup, and restart recovery share one state machine. Large local-ROM deletion was resolved by `689be34`. |
| `3de24f3`, `76e2cc7`, `c8131a1`, `d152e97`, `ae55b79`, `e610a1f`, `a9aa0b6`, `b5c9dd1`, `e976464` | Extend automatic path-aware RomM save sync, per-emulator path overrides, and recovery-safe sync filters | Add Windows save resolvers and override validation incrementally per emulator with live RomM negotiation proof; use server filenames as a safe restore fallback only after identity and destination validation; treat RetroArch overrides as base paths while retaining core/content subfolders; validate responses, free space, minimum content and reversible backups; add opt-in bad-dump/hack/extension filtering without treating ordinary punctuation as proof of a bad ROM. |
| `e7641f8`, `0612991`, `16371b9`, `5b1b256` | Per-platform RomM sync enablement, first-run selection, and custom ROM roots | Add reversible platform toggles (including an optional setup step for large servers), migrate existing downloads safely, exclude disabled platforms from sync and orphan cleanup, preserve current selection, and show live/cached platform counts without copying Android storage APIs. |
| `40e8685`, `226907d`, `755cad8`, `2489792`, `09f6b15`, `f96d18e`, `c4fc69a`, `f6397cb`, `f6d1cdc`, `d0a29e4`, `7490c48` | Platform-context-aware archive discovery and multi-file installation | Recognize ZIP/7z/CHD only when platform context is unambiguous; validate completeness and readability before extraction; extract safely with progress/recovery and collision-free paths; preserve folder-ROM identity; model base games, updates, and DLC; surface missing content in both shells; and migrate flat-disc records only after preserving aggregated user metadata and validating local paths. |
| `03261a4`, `b03791b`, `16a398c`, `4a9bda3`, `90384ea`, `007c667`, `2fb2cc8`, `7799087`, `b8b2206` | Consolidated multi-disc downloads, M3U generation, and disc picker | Model sibling discs without losing RomM identity, download/repair the full set into one game folder, discover nested disc files, regenerate root-disc-only M3U playlists after retry, and provide pointer plus immersive-controller fallback selection without deleting recoverable local data. |
| `b03791b` | User-selectable compatible RetroArch cores per platform | Expand the one-core mapping into tested compatible choices while preserving current defaults and missing-core safeguards. |
| `362f688`, `450c761` | Controller detection with explicit layout and icon-swap settings | Use Windows gamepad identity where available, fall back predictably, provide Auto/Xbox/Nintendo display overrides plus separate A/B and X/Y swaps, and update control glyphs consistently across desktop and Immersive views. |
| `19823f6` | Battery/charging indicator on the home header for Windows handhelds | Windows battery-status API via Tauri, shown conditionally (desktop PCs without a battery should not show one), plus desktop and immersive placement. |
| `3e15b0f` | Cache RetroAchievements badge art for offline game details | Reuse the cover-cache origin-safety and retry patterns for locked/unlocked badges, then serve local asset paths to both desktop and immersive achievement views. |
| `c62bb43`, `beab044`, `62142ae` | Customizable home background, image treatment, and external image cache | Add game-art/custom-image selection plus blur, saturation, and opacity controls with readable overlays and equivalent desktop/immersive settings access; cache authorized screenshots/backgrounds safely for offline details, with an on-demand full-cache validation action and visible progress. |
| `3fdd187`, `60ca11f`, `12397d9`, `884575a` | Named RomM save channels and timeline restore | Prove current RomM channel contracts live, model active-slot timestamps and duplicate handling, retain reversible backups, and expose equivalent pointer and immersive-controller controls. |
| `ea8b196`, `8fc59ff` | Persistent save-sync status and progress UX | Surface per-game local/server state, conflicts, errors, explicit sync steps, and effective save paths without blocking launch; retain warning recovery and verify conflict semantics against a live RomM server. |
| `c31c87c` | Legacy timestamped latest-save compatibility | Verify current RomM slot metadata and update-failure behavior against live data, then recognize timestamp-tagged latest filenames only where slot metadata is absent and preserve negotiated conflict safety. |
| `b40a188`, `ad28ae8` | Opt-in bidirectional favorites sync through RomM collections | Verify the current Collections API, merge local and remote favorites on first sync, persist retryable local changes, and avoid destructive reconciliation when a device was offline or a collection is unavailable. |
| `0ac5cc1`, `cc54e4b`, `1b7d605`, `10112cb` | Local weekly game recommendations with repeat avoidance | Define deterministic/testable scoring from local play history, distinguish installed and downloadable suggestions, generate a larger candidate pool, exclude completed/abandoned games, de-emphasize favorites, and expose the rail consistently in desktop and immersive modes. |
| `13c7946`, `cf81ce9`, `beabc08`, `ff73788`, `2726a12`, `df21c09`, `2887503`, `28e9098`, `466bfa5`, `caa0b47` | Preserve distinct RomM platform-version identity | Store the remote numeric platform ID and display name separately from Wingosy's canonical emulator slug, migrate existing games and dependent rows without destructive guessing or foreign-key gaps, use the slug for local paths, scope per-platform cleanup so same-slug versions cannot affect one another, and show full remote names consistently where short labels collide. |
| `59c010f`, `3f33cd7`, `953070c`, `3cd1efd`, `38bb34b`, `e9b9f82` | RetroArch save-state snapshots tied to local save channels | Discover configured or overridden state directories, cache state/screenshot pairs with core identity and version, suppress stale auto-state replay after non-latest restores, restore/delete state reversibly with save-channel changes, and prove process-exit timing before considering any server sync. |
| `c7cb490` | Opt-in inactivity dimmer for OLED/handheld displays | Dim only the launcher after configurable inactivity, wake immediately on pointer, keyboard, or controller input, and avoid changing Windows display state or active emulator windows. |
| `a9c5669`, `2fb2cc8`, `9f028e0` | Per-platform BIOS/firmware management | Model Windows emulator firmware requirements, validate configured paths and versions, show clear missing/ready status, and only offer redistributable open firmware while guiding users to provide restricted files themselves. |
| `7d068c4`, `a1c4c64`, `2a0c931`, `c4d0c0b`, `cfd55c4` | RomM-backed user collections | Verify the current Collections API, retain offline-safe local membership with durable retries, and expose controller-complete create, rename, delete, membership, pin/reorder, and browse flows in both shells, reserving global settings input and keeping focus indexed to the visible filtered collection list. |
| `65361aa` | Recovery-safe library metadata reset | Add an explicitly confirmed reset that clears the local metadata database and derived image cache while proving downloaded ROMs, emulator configuration, credentials, and save data are preserved; restart or resync into a valid empty state. |
| `b998d78` | Controller-complete Immersive settings focus and scrolling | Give Immersive settings explicit D-pad focus ownership, A activation, section-aware visibility, expansion-safe index updates, and accurate hints while retaining native pointer/keyboard controls on desktop. |
| `54dba02`, `f73a6a7`, `fd82e70` | Artwork-derived vibrant cover-frame colors | Cache bounded color extraction from cover art, apply readable theme-aware gradients only when opted in, fall back safely for muted or invalid art, and render the same treatment in desktop and Immersive cards. |
| `f29a975`, `b5212ff`, `b8b2206`, `47a75e8`, `e852c5c` | Opt-in RomM trailer previews | Verify RomM video identifiers, expose explicit network/privacy and mute/data controls, cancel and release media immediately on blur, navigation, launch, or teardown, require fresh navigation before resuming autoplay or after wake, mute previews while ambient audio owns the mix, and keep both shells usable when embedding fails or no trailer exists. |
| `bf9dfc6` | Bounded recent library searches | Persist a deduplicated ten-query history, expose it without obscuring live results, and provide keyboard/pointer plus controller-complete Immersive navigation and clearing controls. |
| `1bee156` | Install-time NEW badge semantics | Add a distinct persisted `installed_at` timestamp set only after successful download or validated local discovery, preserve the original library creation time, migrate existing rows conservatively, and use install time for the shared desktop/Immersive NEW badge. |

## Open decisions

### RomM sync for personal ratings, difficulty, and completion status

- Argosy commits: `ad8519e`, `b7a5b79`, `605657e`, `7bbcc95`.
- Question: should Wingosy sync personal rating, difficulty, and completion status to RomM with a durable offline queue, or keep these fields local to each PC?
- Trade-offs: RomM sync makes the data portable across devices but adds API-version compatibility, conflict, retry, and stale-write semantics; local-only storage is predictable and already works offline but does not roam.
- Recommendation: keep the newly exposed fields local until the current RomM user-properties contract and conflict semantics are covered by integration tests, then add opt-in sync as a separate vertical slice.
- Provisional choice: local-only, explicitly labeled in the editor. The chronological audit can continue while this remains unresolved.
- Opened: 2026-09-17. Resolution: pending user decision.

When a decision is needed, append an item containing:

1. the Argosy commit(s) involved;
2. the question and relevant trade-offs;
3. the automation's recommended default;
4. what work can safely continue while awaiting the answer; and
5. the date and resolution once the user replies.

The daily run should also repeat unresolved questions in its final report. It
must not block the entire parity audit when a wise reversible default or unrelated
chronological work can proceed safely.

## Daily run log

| Date | Argosy range audited | Features implemented | Wingosy commit | Verification | Notes / questions |
|---|---|---|---|---|---|
| 2026-09-16 | Pre-tracker improvement | Local RomM hostname normalization | `c0289bb` | 37 unit tests, typecheck, lint, build | Original generic-improvement run; does not advance parity cursor. |
| 2026-09-17 | `900808d..b7a5b79` (8 commits) | Local per-game status, rating, and difficulty editor in desktop and immersive views | `ba600c0` | 39 unit tests, typecheck, lint (0 errors; 8 existing warnings), build | Pushed to `origin/main`. RomM user-property syncing remains an open product decision; provisional behavior is local-only. |
| 2026-09-21 | `0e23a85..a98a571` (7 commits) | Community rating: RomM `average_rating` fallback, shared formatter, immersive display, accurate desktop label | `612c099` | 43 unit tests (+4 new), typecheck, lint (0 errors; 8 existing warnings), build. Rust verified in CI, not locally (Smart App Control blocks cargo, `os error 4551`): CI run `35642876461` green, including "Cargo tests (non-ignored)" and "Rust lint". | Pushed to `origin/main` after the user chose CI verification for the Rust half. First run in this program to touch Rust. Argosy baseline grew 2,741 → 2,842 (tip `a1e8437`, 2026-09-20). |
| 2026-09-22 | `0e4296d..9c0eca7` (6 commits) | Desktop library density selector backed by existing `display.grid_columns` | `613160f` | 43 unit tests, typecheck, frontend lint (0 errors; 8 existing warnings), production build. | Three native/controller candidates recorded; no Rust was changed. |
| 2026-09-22 | `99a3d03..dfc98b4` (24 commits) | Immersive controller Y shortcut to favorite the focused game | `702d6ec` | 43 unit tests, typecheck, frontend lint (0 errors; 8 existing warnings), production build. | Release metadata, Android storage/intent mechanics, and superseded Android input fixes were dispositioned. New candidates: non-blocking cancellation cleanup and complete Azahar detection. |
| 2026-09-22 | `bee6b46..c21a65e` (10 commits) | Local RomM cover-art caching during sync, completing the previously scaffolded `covers_dir()`/`convertFileSrc` support | `b671f00` | 43 unit tests, typecheck, frontend lint (0 errors; 8 existing warnings), production build. `cargo check` run directly (this run executed in a Linux cloud sandbox, not the Windows machine above): new/changed files (`covers.rs`, `api/romm.rs`, `database/games.rs`, `commands.rs` sync wiring) compiled with no errors; the only remaining `cargo check` failures are pre-existing `#[cfg(windows)]`-only functions unrelated to this diff (verified via `git diff --stat` that those call sites were untouched). Full `#[cfg(windows)]` correctness still falls to CI on `windows-latest`. | Corrected a stale baseline (see Repositories and baseline). Two new candidates recorded: VID-based controller/button-swap detection, and a battery indicator for Windows handhelds. Steam-launcher integration dispositioned not-portable (Wingosy runs natively on Windows, where real Steam is already available). |
| 2026-09-23 | `3de24f3..b03791b` (6 commits) | Complete Azahar support: official releases, `azahar.exe` discovery for managed and existing installs, and direct-launch coverage while retaining the compatible `citra` config ID | `e17c531` | 43 frontend unit tests, typecheck, frontend lint (0 errors; 8 existing warnings), and production build passed locally. Rust could not be built locally because Smart App Control blocks cargo build-script executables (`os error 4551`); Windows CI run `35905399163` passed frontend coverage, Cargo tests (non-ignored), Rust lint with warnings denied, Rust coverage, and artifact upload. | Corrected the fetched baseline to `30d42cc` / 2,854. Added candidates for broader automatic save paths, consolidated multi-disc handling, and user-selectable RetroArch cores; resolved the prior Azahar candidate. RomM rating/difficulty sync remains an open decision. |
| 2026-09-24 | `623563de..b7f891c` (17 commits) | Non-blocking local ROM deletion: filesystem removal now runs on Tokio's blocking pool before the existing desktop/immersive refresh path | `689be34` | 43 frontend unit tests, typecheck, frontend lint (0 errors; 8 existing warnings), and production build passed locally. Rust could not be built locally because Smart App Control remains enforced. Windows CI run `36025282244` passed frontend coverage, Cargo tests (including the focused deletion tests), Rust lint with warnings denied, Rust coverage, and artifact upload. Repository-wide local `cargo fmt --check` still reports extensive pre-existing formatting drift outside the changed hunk. | Refreshed the Argosy baseline to `8b3eed9` / 2,890 without moving the valid cursor. Added sync-filter and achievement-badge-cache candidates; resolved the large-file deletion candidate. RomM rating/difficulty sync remains an open decision. |
| 2026-09-25 | `6dd07eb..16a398c` (6 commits) | Available ROM-drive capacity in Storage settings, with nearest-existing-parent fallback and explicit unavailable state | `65f82fb` | 43 frontend unit tests, typecheck, frontend lint (0 errors; 8 existing warnings), production build, and targeted `rustfmt --check` passed locally. Rust could not be compiled locally because Smart App Control remains enforced. Windows CI run `36158559061` passed frontend coverage, Cargo tests (including the new storage-path test), Rust lint with warnings denied, Rust coverage, and artifact upload. | Confirmed the Argosy baseline remains `8b3eed9` / 2,890 and advanced the valid cursor to commit 84. Added a background-customization candidate; consolidated multi-disc work remains in the existing candidate. RomM rating/difficulty sync remains an open decision. |
| 2026-09-29 | `f4cda7d..eca9c0f` (6 commits) | Official Windows Vita3K download/detection/configuration and title-ID direct launch, including ZIP-entry title discovery and safe emulator-only fallback | `3866196` | 43 frontend unit tests, typecheck, frontend lint (0 errors; 8 existing warnings), and production build passed locally. Rust could not be compiled locally because Smart App Control remains enforced. Windows CI run `36640540601` passed frontend coverage, Cargo tests (including focused Vita3K metadata/title-ID tests), Rust lint with warnings denied, Rust coverage, and artifact upload. | Refreshed the Argosy baseline to `60dc343` / 2,956 without moving the valid cursor, then advanced it to commit 90. Consolidated M3U support into the existing multi-disc candidate. RomM rating/difficulty sync remains an open decision. |
| 2026-10-02 | `dd67a69..b058467` (30 commits) | RomM `vita` slug normalization for Vita3K; filesystem-validated filtered loads and locally playable immersive Recent results | `edc2424` | 45 frontend unit tests, typecheck, frontend lint (0 errors; 8 existing warnings), and production build passed locally. Rust could not be compiled locally because Smart App Control remains enforced. Windows CI run `37079548487` passed frontend coverage, Cargo tests, Rust lint with warnings denied, Rust coverage, and artifact upload. | Refreshed the Argosy baseline to `c1b8371` / 3,060 while preserving the valid cursor, then advanced it to commit 120. Added archive-context, save-channel, platform-catalog, and first-run-controller candidates. RomM rating/difficulty sync remains an open decision. |
| 2026-10-03 | `7d0d783..7d54348` (10 commits) | Controller-complete setup wizard with visible focus, D-pad navigation, A activation, and B back navigation | `5b77952` | 48 frontend unit tests (+3), typecheck, frontend lint (0 errors; 8 existing warnings), and production build passed locally. No Rust files changed. | Refreshed the Argosy baseline to `9cbc743` / 3,080 while preserving the valid cursor, then advanced it to commit 130. The save-channel pointer requirements were consolidated into the existing candidate. RomM rating/difficulty sync remains an open decision. |
| 2026-10-04 | `35fd921..ea8b196` (10 commits) | Established RomM aliases for supported systems plus deterministic family/chronological platform ordering, with exact unknown-slug passthrough | `3d5c895` | 48 frontend unit tests, typecheck, frontend lint (0 errors; 8 existing warnings), and production build passed locally. Rust could not be compiled locally because Smart App Control remains enforced (`os error 4551`); Windows CI run `37215735027` passed frontend coverage, Cargo tests, Rust lint with warnings denied, Rust coverage, and artifact upload. | Refreshed the Argosy baseline to `1d58f89` / 3,087 while preserving the valid cursor, then advanced it to commit 140. Reconciled the stale pre-run candidate total (20 stated vs. 21 ledger rows), added candidates for per-platform sync/storage controls, save-path overrides, and save-status/progress UX, and resolved the two alias/order commits for a final 23. RomM rating/difficulty sync remains an open decision. |
| 2026-10-05 | `8fc59ff..f1df1da` (14 commits) | Context-aware desktop platform badges: visible in mixed-platform Library/Favorites views and hidden for a selected platform | `bf10b78` | 50 frontend unit tests (+2), typecheck, frontend lint (0 errors; 8 existing warnings), and production build passed locally. No Rust files changed. | Refreshed the Argosy baseline to `4a5f529` / 3,090 while preserving the valid cursor, then advanced it to commit 154. Added race-hardening, light-theme semantics, save-path, save-status, and box-art candidates. RomM rating/difficulty sync remains an open decision. |
| 2026-10-06 | `6282d11..bb3d832` (7 commits) | Privacy-safe launch diagnostics that retain useful filenames and emulator/core context while omitting private directories and raw command arguments | `e606dc6` | 50 frontend unit tests, typecheck, frontend lint (0 errors; 8 existing warnings), and production build passed locally. Smart App Control remained enforced, so Rust was not run locally. Windows CI run `37493018816` passed the two new Rust tests, frontend coverage, Cargo tests, Rust lint with warnings denied, Rust coverage, and artifact upload. | Confirmed the Argosy baseline remained `4a5f529` / 3,090 and advanced the valid cursor to commit 161. Added a candidate for legacy timestamped latest-save compatibility; RomM rating/difficulty sync remains an open decision. |
| 2026-10-07 | `b40a188..cc54e4b` (8 commits) | First-install-safe post-update notice for desktop and immersive mode, with keyboard/controller focus and a current releases link | `22dbcbd` | 4 targeted and 54 full frontend unit tests, typecheck, frontend lint (0 errors; 8 existing warnings), and production build passed locally. No Rust files changed. | Confirmed the Argosy baseline remained `4a5f529` / 3,090 and advanced the valid cursor to commit 169. Added favorites-sync and recommendation candidates and consolidated first-run platform selection into the existing platform-sync candidate. RomM rating/difficulty sync remains an open decision. |
| 2026-10-08 | `f998a3f..188a15f` (16 commits) | Nearest-minute play-session accounting from 30 seconds, preserving meaningful short sessions | `e541906` | 54 frontend unit tests, typecheck, frontend lint (0 errors; 8 existing warnings), and production build passed locally. Smart App Control blocked local Rust execution; Windows CI run `37805856253` passed the new boundary test, all Cargo tests, Rust lint with warnings denied, Rust coverage, frontend coverage, and artifact upload. Repository-wide `rustfmt --check` still reports pre-existing formatting drift in `launcher.rs` outside the changed hunk. | Refreshed the Argosy baseline to `2714d54` / 3,179 while preserving the valid cursor, then advanced it to commit 185. Added the distinct platform-version identity candidate. The open personal-metadata sync decision now explicitly includes completion status. |
| 2026-10-09 | `f1c3c3c..bff1f7b` (6 commits) | Ambient background-music ceiling with normalized legacy values | `4290d41` | 3 targeted and 57 full frontend unit tests, typecheck, frontend lint (0 errors; 8 existing warnings), and production build passed locally. No Rust files changed. | Refreshed the Argosy baseline to `446eae8` / 3,207 while preserving the valid cursor, then advanced it to commit 191. No new candidate was needed; screenshot background selection remains consolidated with the existing customizable-background candidate. RomM personal-metadata sync remains an open decision. |
| 2026-10-10 | `81d055d..ab05a87` (9 commits) | Regional Famicom/Super Famicom RomM slug normalization | `49fa1c1` | 57 frontend unit tests, typecheck, frontend lint (0 errors; 8 existing warnings), and production build passed locally. Smart App Control blocked local Rust execution; Windows CI run `38065890788` passed the new Rust test, all Cargo tests, Rust lint with warnings denied, Rust coverage, frontend coverage, and artifact upload. Targeted `rustfmt --check` still reports pre-existing formatting drift elsewhere in `platform.rs`; the changed mapping and test hunks match rustfmt output. | Refreshed the Argosy baseline to `9b0fefb` / 3,213 while preserving the valid cursor, then advanced it to commit 200. No new candidate was added. RomM personal-metadata sync remains an open decision. |
| 2026-10-11 | `8ea383a..cac12ec` (20 commits) | First-class Game Gear platform/core support and N3DS slug normalization | `006d21e` | 57 frontend unit tests, typecheck, frontend lint (0 errors; 8 existing warnings), and production build passed locally. Smart App Control prevented local Rust execution; Windows CI run `38153735545` passed the new Rust tests, all Cargo tests, Rust lint with warnings denied, Rust coverage, frontend coverage, and artifact upload. Targeted `rustfmt --check` still reports pre-existing formatting drift in the touched model files. | Refreshed the Argosy baseline to `f287e8a` / 3,219 while preserving the valid cursor, then advanced it to commit 220. Seven newly audited commits remain candidates, consolidated into one new save-state backlog row and two existing recommendation/platform-identity rows, leaving 44 candidate commits waiting. RomM personal-metadata sync remains an open decision. |
| 2026-10-12 | `beab044..19e7a03` (45 commits) | Accent-, punctuation-, abbreviation-, and typo-tolerant multi-word library search | `a143f0b` | 60 frontend unit tests, typecheck, frontend lint (0 errors; 8 existing warnings), and production build passed locally. No Rust files changed. | Refreshed the Argosy baseline to `6a7efc4` / 3,243 while preserving the valid cursor, then advanced it to commit 265. Twenty-one newly audited commits remain candidates, consolidated into existing save/archive/multi-disc/background/platform-identity/state rows plus new dimmer, BIOS, and collections rows, leaving 65 waiting including the open personal-metadata sync decision. |
| 2026-10-13 | `aafa1c3..fa58fac` (15 commits) | Validated cover-cache reuse and downloads, with automatic repair of corrupt cached files | `876d8f0` | 60 frontend unit tests, typecheck, frontend lint (0 errors; 8 existing warnings), production build, and targeted Rust formatting passed locally. Smart App Control prevented local Rust execution; Windows CI run `38427676640` passed frontend coverage, all Cargo tests including three new cover tests, Rust lint with warnings denied, Rust coverage, and artifact upload. | Refreshed the Argosy baseline to `3059f55` / 3,268 while preserving the valid cursor, then advanced it to commit 280. Two newly audited commits remain candidates, consolidated into the collections and image-cache rows, leaving 67 waiting including the open personal-metadata sync decision. |
| 2026-10-14 | `c05cc2f..ada75a7` (2 commits) | Persistent cover corners, minimal/border/glow frames, platform-label placement/inset, and a representative preview shared by desktop and Immersive libraries | `f5c8dc9` | 64 frontend unit tests (+4), typecheck, frontend lint (0 errors; 8 existing warnings), and production build passed locally. Smart App Control prevented local Rust execution; Windows CI run `38594503391` passed the repository Windows gate. Targeted `rustfmt --check` still reports pre-existing formatting drift in `config/mod.rs` outside the changed hunks. | Refreshed the Argosy baseline to `65f5485` / 3,336 while preserving the valid cursor, then advanced it to commit 282. Resolved the two older box-art candidate commits without adding a new candidate, leaving 65 waiting including the open personal-metadata sync decision. |
| 2026-10-15 | `9162b3f..acf3d82` (8 commits) | Single-flight native game launch guard covering pre-launch sync, emulator lifetime, and post-launch sync | `f0848a6` | 64 frontend unit tests, typecheck, frontend lint (0 errors; 8 existing warnings), and production build passed locally. Smart App Control prevented local Rust execution. Windows CI run `38765179621` passed frontend coverage, all Cargo tests including the new guard test, Rust lint with warnings denied, Rust coverage, and artifact upload. | Refreshed the Argosy baseline to `9940f11` / 3,356 while preserving the valid cursor, then advanced it to commit 290. Resolved `5bb4358`; added archive-collision and pinned-collection candidates, leaving 66 candidate dispositions plus the open personal-metadata sync decision. |
| 2026-10-16 | `79b448c..d19db53` (5 commits) | Persistent primary and optional secondary cloud/progress accent, including legacy-safe theme persistence and consistent desktop/Immersive cloud-state styling | `91b5b8b`, lint fix `58f88f5` | 4 targeted and 68 full frontend unit tests, typecheck, frontend lint (0 errors; 8 existing warnings), production build, and `git diff --check` passed locally. Smart App Control prevented local Rust execution. The first Windows CI run `38929853607` exposed a Clippy-only test construction warning; `58f88f5` corrected it, and run `38931094094` passed frontend coverage, all Cargo tests, Rust lint with warnings denied, Rust coverage, and artifact upload. | Refreshed the Argosy baseline to `56ae10b` / 3,361 while preserving the valid cursor, then advanced it to commit 295. No candidate was added, leaving 66 candidate dispositions plus the open personal-metadata sync decision. |
| 2026-10-17 | `b1d09fe..0f232e8` (10 commits) | Theme-aware raised/subtle surfaces, scrollbar contrast, and centralized semantic status tints across desktop and Immersive views | `5993169` | 4 targeted and 72 full frontend unit tests, typecheck, frontend lint (0 errors; 8 existing warnings), production build, and `git diff --check` passed locally. No Rust files changed. Windows CI run `39047361722` passed frontend coverage, Cargo tests, Rust lint with warnings denied, Rust coverage, and artifact upload. | Refreshed the Argosy baseline to `98562a1` / 3,366 while preserving the valid cursor, then advanced it to commit 305. Resolved two older theme candidates and added two platform/save candidates, leaving 66 candidate dispositions plus the open personal-metadata sync decision. |
| 2026-10-18 | `4edbbfa..db43178` (28 commits) | Installed favorites before cloud-only favorites in desktop and Immersive views, preserving each view's existing sort order within both groups | `037c999` | 15 targeted and 73 full frontend unit tests, typecheck, frontend lint (0 errors; 8 existing warnings), production build, and `git diff --check` passed locally. No Rust files changed. Windows CI run `39143401332` passed frontend coverage, Cargo tests, Rust lint with warnings denied, Rust coverage, and artifact upload. | Confirmed the Argosy baseline remained `98562a1` / 3,366 and advanced the valid cursor to commit 333. Reconciled the stale candidate total from 66 stated to 65 ledger rows, then added ten dispositions across platform identity, save/state reliability, per-platform sync, collections, and recovery-safe library reset, leaving 75 plus the open personal-metadata sync decision. |
| 2026-10-20 | `5a92044..eca7d1a` (10 commits) | Ignore macOS AppleDouble `._*` ROM sidecars during scan and rediscovery | `b0b8a8e` | 73 frontend unit tests, typecheck, frontend lint (0 errors; 8 existing warnings), production build, and `git diff --check` passed locally. Smart App Control prevented local Rust execution; Windows CI run `39282965458` passed frontend coverage, Cargo tests including the new scanner coverage, Rust lint with warnings denied, Rust coverage, and artifact upload. | The feature was pushed on 2026-10-19, but the tracker advance waited for GitHub's delayed Actions result. Confirmed the baseline remains `98562a1` / 3,366, advanced the cursor to commit 343, and added five candidate dispositions for controller settings, vibrant covers, multi-disc/multi-file handling, and opt-in trailer previews, leaving 80 plus the open personal-metadata sync decision. |
| 2026-10-21 | `b645f45..21cf9df` (21 commits) | NEW badges for installed, unplayed games added within 24 hours in desktop and Immersive views | `bff4bbc` | 6 targeted and 77 full frontend tests, typecheck, frontend lint (0 errors; 8 existing warnings), production build, and `git diff --check` passed locally. Smart App Control prevented local Rust execution; Windows CI run `39631646170` passed frontend coverage, all Cargo tests including database timestamp coverage, Rust lint with warnings denied, Rust coverage, and artifact upload. | Confirmed the Argosy baseline remains `98562a1` / 3,366, advanced the cursor to commit 364, and added four candidate dispositions for controller layout detection, recent searches, archive validation, and trailer lifecycle, leaving 84 plus the open personal-metadata sync decision. |
| 2026-10-22 | `b8b2206..8b41f18` (4 commits) | PSP CHD image recognition in the platform registry | `a0a26ed` | 77 frontend tests, typecheck, frontend lint (0 errors; 8 existing warnings), production build, and `git diff --check` passed locally. Smart App Control prevented local Rust execution. Windows CI run `39811068710` passed the new PSP registry test, frontend coverage, all Cargo tests, Rust lint with warnings denied, Rust coverage, and artifact upload. Targeted `rustfmt --check` still reports pre-existing formatting drift elsewhere in `platform.rs`. | Confirmed the Argosy baseline remains `98562a1` / 3,366, advanced the cursor to commit 368, and consolidated the PS2 disc picker/video restart work into existing multi-disc and trailer candidates, leaving 85 plus the open personal-metadata sync decision. |
| 2026-10-23 | `f73a6a7..7a5ece6` (13 commits) | First-class Commodore 64 platform discovery, RomM aliases, VICE x64 RetroArch launch mapping, and consistent desktop/Immersive presentation | `7db590e` | 77 frontend tests, typecheck, frontend lint (0 errors; 8 existing warnings), production build, and `git diff --check` passed locally. Smart App Control prevented local Rust execution. Windows CI run `39983774342` passed the new C64 registry/core tests, frontend coverage, all Cargo tests, Rust lint with warnings denied, Rust coverage, and artifact upload. Targeted `rustfmt --check` still reports pre-existing formatting drift elsewhere in the two touched model files. | Confirmed the Argosy baseline remains `98562a1` / 3,366 with no commits from the previous 24 hours, advanced the cursor to commit 381, and added five candidate dispositions for cached cover palettes, install-time NEW semantics, and trailer lifecycle/audio policy, leaving 90 plus the open personal-metadata sync decision. VIC-20 remains next because its overlapping C64 extensions require an explicit local-detection policy. |

## Completion rule

Historical parity is reached only when:

- every Argosy commit through the stored baseline has a ledger disposition;
- every portable candidate is either implemented, already covered, superseded,
  or resolved as an explicit product decision; and
- the audit cursor is at the latest fetched Argosy `origin/main` commit.

After that point, each daily run fetches Argosy and reviews commits from the last
24 hours. If relevant commits exist, it handles those first. If none exist, it may
make one small, safe Wingosy improvement under the existing verification and
direct-push rules.
