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
- Argosy baseline observed: `8b3eed9d7ab0a350d06cdfc1f802b569d1409e15` — 2026-09-25 (2026-09-25 run)
- Baseline history size: 2,890 commits on `origin/main`
- Wingosy baseline observed: `65f82fb` — 2026-09-25 feature commit
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

- Last fully audited Argosy commit: `16a398ca072e6f900c389cfd942b2e4540dd5fcc`
- Next Argosy commit: `f4cda7d1c8af32517f01080346eefc8e42be2216`
- Audited: 84 / 2,890 baseline commits
- Portable candidates waiting: 11
- Last tracker update: 2026-09-25

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
| `3de24f3`, `76e2cc7` | Extend automatic path-aware RomM save sync and add recovery-safe sync filters | Add Windows save resolvers incrementally per emulator with live RomM negotiation proof; add opt-in bad-dump/hack/extension filtering and safe duplicate handling without destructive cleanup surprises. |
| `03261a4`, `b03791b`, `16a398c` | Consolidated multi-disc downloads and disc picker | Model sibling discs without losing RomM identity, download/repair the full set, and provide pointer plus immersive-controller selection. |
| `b03791b` | User-selectable compatible RetroArch cores per platform | Expand the one-core mapping into tested compatible choices while preserving current defaults and missing-core safeguards. |
| `362f688` | VID-based controller detection with separate A/B and X/Y icon-swap settings | Gamepad VID/PID lookup (Xbox/Nintendo/Sony), a settings UI, and icon rendering updates across desktop and immersive views. |
| `19823f6` | Battery/charging indicator on the home header for Windows handhelds | Windows battery-status API via Tauri, shown conditionally (desktop PCs without a battery should not show one), plus desktop and immersive placement. |
| `3e15b0f` | Cache RetroAchievements badge art for offline game details | Reuse the cover-cache origin-safety and retry patterns for locked/unlocked badges, then serve local asset paths to both desktop and immersive achievement views. |
| `c62bb43` | Customizable home background and image treatment | Add game-art/custom-image selection plus blur, saturation, and opacity controls with readable overlays and equivalent desktop/immersive settings access. |

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
| 2026-09-23 | `3de24f3..b03791b` (6 commits) | Complete Azahar support: official releases, `azahar.exe` discovery for managed and existing installs, and direct-launch coverage while retaining the compatible `citra` config ID | `e17c531` | 43 frontend unit tests, typecheck, frontend lint (0 errors; 8 existing warnings), and production build passed locally. Rust could not be built locally because Smart App Control blocks cargo build-script executables (`os error 4551`); Windows CI run `35905399163` passed frontend coverage, Cargo tests (non-ignored), Rust lint with warnings denied, Rust coverage, and artifact upload. | Corrected the fetched baseline to `30d42cc` / 2,854. Added candidates for broader automatic save paths, consolidated multi-disc handling, and user-selectable RetroArch cores; resolved the prior Azahar candidate. RomM rating/difficulty sync remains an open decision. |
| 2026-09-24 | `623563de..b7f891c` (17 commits) | Non-blocking local ROM deletion: filesystem removal now runs on Tokio's blocking pool before the existing desktop/immersive refresh path | `689be34` | 43 frontend unit tests, typecheck, frontend lint (0 errors; 8 existing warnings), and production build passed locally. Rust could not be built locally because Smart App Control remains enforced. Windows CI run `36025282244` passed frontend coverage, Cargo tests (including the focused deletion tests), Rust lint with warnings denied, Rust coverage, and artifact upload. Repository-wide local `cargo fmt --check` still reports extensive pre-existing formatting drift outside the changed hunk. | Refreshed the Argosy baseline to `8b3eed9` / 2,890 without moving the valid cursor. Added sync-filter and achievement-badge-cache candidates; resolved the large-file deletion candidate. RomM rating/difficulty sync remains an open decision. |
| 2026-09-25 | `6dd07eb..16a398c` (6 commits) | Available ROM-drive capacity in Storage settings, with nearest-existing-parent fallback and explicit unavailable state | `65f82fb` | 43 frontend unit tests, typecheck, frontend lint (0 errors; 8 existing warnings), production build, and targeted `rustfmt --check` passed locally. Rust could not be compiled locally because Smart App Control remains enforced. Windows CI run `36158559061` passed frontend coverage, Cargo tests (including the new storage-path test), Rust lint with warnings denied, Rust coverage, and artifact upload. | Confirmed the Argosy baseline remains `8b3eed9` / 2,890 and advanced the valid cursor to commit 84. Added a background-customization candidate; consolidated multi-disc work remains in the existing candidate. RomM rating/difficulty sync remains an open decision. |

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
