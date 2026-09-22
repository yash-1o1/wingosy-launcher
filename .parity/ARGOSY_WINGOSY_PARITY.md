# Argosy → Wingosy parity tracker

This file is the durable source of truth for the daily Argosy parity review.
It lives outside either repository so it is not published as application code.

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
- Argosy baseline observed: `f18070b0fa21b542abc3c06b90627f20da7a108f` — 2026-03-04 (2026-09-22 run)
- Baseline history size: 805 commits on `origin/main`
- Wingosy baseline observed: `2a1c780` — 2026-09-22
- Audit direction: oldest → newest, first-parent-independent chronological order from `git log --reverse origin/main`

### Baseline correction (2026-09-22)

A prior run recorded an Argosy baseline of `a1e8437463c95b4a34bc9b8a6f6005ad5cf0c7c4`
with 2,842 commits, dated 2026-09-20. That SHA does not exist in the real
repository (`git cat-file -t` on it returns "bad object" after a full
unshallow fetch), and both a direct `git fetch` and the GitHub API confirm
`origin/main`'s actual tip is `f18070b` (805 commits total), dated
2026-03-04 — no branch in the repository (including all `dependabot/*` and
`feature/*` branches) has any commit newer than 2026-03-07. The figures
above were corrected to match the verified repository state. This did not
require rewinding the audit: every commit already recorded in the ledger
(`900808d` through `dfc98b4`, and the stored cursor `bee6b46`) was verified
to exist at its recorded position in the real history, so only the
aggregate baseline metadata was wrong, not the per-commit ledger work.

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

- Last fully audited Argosy commit: `c21a65e49ffa276e8bc3335dd7db372236cfb022`
- Next Argosy commit: `3de24f35c1fdc83861aa66c7f756bf65e8bc5ca3`
- Audited: 55 / 805 baseline commits
- Portable candidates waiting: 6
- Last tracker update: 2026-09-22

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
| 18 | `6b98551` | 2025-12-07 | Add control legend footer to home screen | candidate | Wingosy immersive mode already has a controller hint bar for navigation, select, back, sections, settings, and help. Argosy's direct Y=favorite and X=details actions are a worthwhile but separate controller-routing slice. |
| 19 | `d199708` | 2025-12-07 | Fix UI hang when deleting large installed files | candidate | Wingosy removes local ROMs through an async Tauri command, but its filesystem deletion remains synchronous within the command. Moving large deletion work to a dedicated blocking task with immediate UI refresh merits a focused Rust/UX slice. |
| 20 | `323327f` | 2025-12-07 | Bump version to 0.3.0 | non-feature | Android release metadata only; no portable runtime behavior. |
| 21 | `9c0eca7` | 2025-12-07 | Improve home screen with smart sorting, ratings, and View All navigation | already-covered | Wingosy has installed/favorites filters, name/recently played/play-count/play-time/release-year sorting, personal and community ratings, and an immersive Recent section. Argosy's Android platform-row/View All layout is not a direct fit for Wingosy's full library navigation. |
| 22 | `99a3d03` | 2025-12-07 | Bump version to 0.4.0 | non-feature | Android release metadata only. |
| 23 | `86b76e1` | 2025-12-08 | Add sound effects, improve feedback systems, and fix download bugs | implemented | `702d6ec`: added direct Y-button favorite toggling for the focused immersive-library game, including keyboard equivalent and hint. Wingosy already had immersive UI sounds, sound settings, and download event feedback; the remaining Android haptic and queue mechanics are not copied. |
| 24 | `6ecfe99` | 2025-12-08 | Refactor codebase for cleanliness and fix downloads screen bugs | candidate | The cleanup is non-portable, but non-blocking cancellation cleanup remains worthwhile; combine it with the existing native large-file deletion candidate rather than expose incomplete controls. |
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
| 35 | `5f6ebd8` | 2025-12-09 | Fix 3DS emulator launch intents and add Azahar support | candidate | Wingosy's Citra/Lime3DS entry can download Azahar-compatible assets, but does not detect `azahar.exe`; add focused detection/launch coverage before claiming full Azahar support. |
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
| `6ecfe99`, `d199708` | Non-blocking cleanup after cancelling downloads or deleting large local ROMs | Move filesystem removal to a blocking Rust task, refresh UI immediately, and verify in Windows CI. |
| `5f6ebd8` | Complete Azahar support | Detect `azahar.exe`, validate the existing launcher command, and add focused Windows CI coverage. |
| `362f688` | VID-based controller detection with separate A/B and X/Y icon-swap settings | Gamepad VID/PID lookup (Xbox/Nintendo/Sony), a settings UI, and icon rendering updates across desktop and immersive views. |
| `19823f6` | Battery/charging indicator on the home header for Windows handhelds | Windows battery-status API via Tauri, shown conditionally (desktop PCs without a battery should not show one), plus desktop and immersive placement. |

## Open decisions

### RomM sync for personal ratings and difficulty

- Argosy commits: `ad8519e`, `b7a5b79`.
- Question: should Wingosy sync personal rating/difficulty to RomM with a durable offline queue, or keep these fields local to each PC?
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
