# Contributing to Wingosy Launcher

Thanks for your interest in contributing! This guide covers everything you need to get the project running locally, understand the architecture, and submit changes.

## Prerequisites

- **Windows 10/11**
- **Rust** (1.70+) — [Install via rustup](https://rustup.rs/)
- **Node.js** (18+) — [Download LTS](https://nodejs.org/)
- **Visual Studio Build Tools** with "Desktop development with C++" workload
  - Required: MSVC build tools, Windows 10/11 SDK

Verify your setup:

```bash
rustc --version
cargo --version
node --version
npm --version
```

## Getting Started

```bash
# Clone the repository
git clone https://github.com/yash-1o1/wingosy-launcher.git
cd wingosy-launcher

# Install frontend dependencies
npm install

# Set up environment (for integration tests)
cp .env.example .env
# Edit .env with your RomM server credentials

# Run in development mode (hot-reload for React, auto-rebuild for Rust)
npm run tauri dev

# Build release binaries
npm run tauri build
```

### Output Locations

| Build | Path |
|-------|------|
| Dev binary | `src-tauri/target/debug/wingosy-launcher.exe` |
| Release binary | `src-tauri/target/release/Wingosy Launcher.exe` |
| MSI installer | `src-tauri/target/release/bundle/msi/` |
| NSIS installer | `src-tauri/target/release/bundle/nsis/` |

## Project Structure

```
wingosy-launcher/
├── package.json                  # Frontend deps (React, MUI, Vite)
├── vite.config.js                # Vite dev server config
├── index.html                    # HTML shell
├── .env                          # RomM test credentials (gitignored)
├── .env.example                  # Template for contributors
│
├── src/                          # FRONTEND — React + MUI (runs in webview)
│   ├── main.jsx                  # React root + MUI ThemeProvider
│   ├── App.jsx                   # Root component, state, routing, RomM token
│   ├── theme.js                  # MUI dark/light theme
│   ├── components/
│   │   ├── Sidebar.jsx           # Platform nav drawer
│   │   ├── Library.jsx           # Game grid with search + empty state
│   │   ├── GameCard.jsx          # Game card with cover art, sync badges, hover actions
│   │   ├── GameDetails.jsx       # Detail view: hero image, stats, ROM download, save sync
│   │   ├── Settings.jsx          # RomM connect/sync, ROM scanning, emulator detection
│   │   └── SetupWizard.jsx       # First-run wizard (RomM → folder → scan)
│   └── utils/
│       └── normalizeUrl.js       # Auto-prepend http/https to RomM URLs
│
├── src-tauri/                    # BACKEND — Rust (runs natively on OS)
│   ├── Cargo.toml                # Rust dependencies
│   ├── tauri.conf.json           # Window config, permissions, asset protocol
│   ├── build.rs                  # Tauri build script
│   ├── src/
│   │   ├── main.rs               # Tauri app entry point + command registration
│   │   ├── commands.rs           # Tauri commands (frontend ↔ backend bridge)
│   │   ├── api/
│   │   │   ├── romm.rs           # RomM REST client (cookie-based auth, all endpoints)
│   │   │   └── download.rs       # Download manager with progress tracking
│   │   ├── config/
│   │   │   └── mod.rs            # TOML config (RomM creds, library, display, emulators)
│   │   ├── database/
│   │   │   ├── connection.rs     # SQLite setup + schema
│   │   │   ├── games.rs          # Game CRUD, filtering, upsert + inline unit tests
│   │   │   ├── platforms.rs      # Platform queries
│   │   │   ├── collections.rs    # Smart + manual collections
│   │   │   └── emulators.rs      # Per-game/platform emulator config
│   │   ├── emulators/
│   │   │   ├── launcher.rs       # Process spawning + play session tracking
│   │   │   └── detection.rs      # Windows emulator auto-detection
│   │   ├── models/
│   │   │   ├── game.rs           # Game model, GameSource, GameFilter + unit tests
│   │   │   ├── platform.rs       # Platform defs, slug mapping, extension detection + unit tests
│   │   │   ├── collection.rs     # Collection + smart filter types
│   │   │   ├── emulator.rs       # Emulator configs + RetroArch core mapping
│   │   │   └── sync.rs           # SyncState with DB serialization + unit tests
│   │   └── scanner/
│   │       └── mod.rs            # ROM scanning, name cleaning, multi-disc detection + unit tests
│   │
│   └── tests/                    # INTEGRATION TESTS (against live RomM server)
│       └── romm_integration.rs   # Auth, heartbeat, cookie flow, platform fetch
```

### `src/` vs `src-tauri/` — What's What?

| | `src/` (Frontend) | `src-tauri/` (Backend) |
|---|---|---|
| **Language** | JavaScript (JSX) | Rust |
| **Runs in** | Tauri webview (like a browser) | Native OS process |
| **Purpose** | UI rendering, user interaction | DB, file system, HTTP, process spawning |
| **Communication** | `invoke("command", {args})` | `#[tauri::command]` functions |
| **Hot reload** | Yes (Vite) | Recompiles on save |

## Architecture

```
┌────────────────────────────────┐
│  React + MUI Frontend (src/)   │
│  Components, state, theme      │
└──────────┬─────────────────────┘
           │ invoke("command", { args })
           │ @tauri-apps/api
┌──────────▼─────────────────────┐
│  Tauri Command Layer           │
│  commands.rs — 22 commands     │
└──────────┬─────────────────────┘
           │
┌──────────▼─────────────────────┐
│  Rust Backend                  │
│  ┌────────┐ ┌───────┐         │
│  │ SQLite │ │ RomM  │         │
│  │   DB   │ │ API   │         │
│  └────────┘ └───────┘         │
│  ┌──────────┐ ┌───────────┐   │
│  │ Emulator │ │   ROM     │   │
│  │ Launcher │ │  Scanner  │   │
│  └──────────┘ └───────────┘   │
└────────────────────────────────┘
```

### RomM Sync Flow

```
connect_romm(url, user, pass)
  → POST /api/token (gets JWT + CSRF cookie)
  → saves credentials to config.toml
  → returns access_token to frontend

sync_romm_library(url, token)
  → re-authenticates (cookie required per session)
  → GET /api/platforms
  → for each platform:
      → map slug (e.g. "sega-genesis" → "genesis")
      → GET /api/roms?platform_id=X (paginated)
      → for each ROM:
          → map metadata (release_year from epoch)
          → download cover art to cache/covers/{id}.jpg
          → upsert into SQLite (preserves favorites, play stats)
```

### Tauri Commands Reference

| Command | Returns | Description |
|---------|---------|-------------|
| `is_first_run` | `bool` | Check if config file exists |
| `complete_setup` | `()` | Save initial setup config |
| `connect_romm` | `String` (token) | Authenticate with RomM server |
| `sync_romm_library` | `Vec<Game>` | Full library sync with covers |
| `get_all_games` | `Vec<Game>` | All non-hidden games |
| `get_games_filtered` | `Vec<Game>` | Filtered/sorted game query |
| `get_all_platforms` | `Vec<Platform>` | All platforms |
| `get_platforms_with_games` | `Vec<(Platform, i32)>` | Platforms + game counts |
| `toggle_favorite` | `bool` | Toggle game favorite |
| `launch_game` | `String` | Launch game in emulator |
| `scan_directory` | `Vec<Game>` | Scan folder for ROMs |
| `download_rom` | `String` | Download ROM from RomM |
| `get_game_saves` | `Vec<RomMSave>` | List saves for a game |
| `download_game_save` | `String` | Download a save file |
| `upload_game_save` | `()` | Upload a save file |
| `detect_emulators` | `Vec<DetectedEmulatorInfo>` | Find installed emulators |
| `get_config` / `save_config` | `AppConfig` / `()` | Read/write config |
| `get_collections` | `Vec<Collection>` | List collections |
| `search_games` | `Vec<Game>` | Full-text search |

## Testing

### Test Structure

Wingosy uses a three-layer testing strategy:

| Layer | Location | What it Tests | AI/CI Friendly |
|-------|----------|---------------|----------------|
| Unit Tests | Inline `#[cfg(test)]` modules | Logic, parsing, data transforms | ✅ Yes |
| Backend Integration | `src-tauri/tests/` | Real downloads, API calls | ✅ Yes |
| E2E (WebDriver) | `e2e-webdriver/` | Full app with Rust backend | ✅ Yes |

### Running Tests

```bash
# === Backend Tests (Rust) ===
cd src-tauri

# Unit tests (fast, no network)
cargo test --bin wingosy-launcher

# RomM integration tests (requires .env with server credentials)
cargo test --test romm_integration -- --ignored

# Emulator download tests (no credentials, tests real downloads)
cargo test --test emulator_integration -- --ignored --nocapture

# === E2E Tests (WebDriver - full Tauri app) ===
cd ..  # back to project root

# Run all E2E tests
npm run test:e2e

# Run specific test files
npm run test:e2e:app       # Basic app tests
npm run test:e2e:download  # Emulator download tests

# === Run Everything ===
cd src-tauri && cargo test --bin wingosy-launcher && cargo test --test emulator_integration -- --ignored && cd .. && npm run test:e2e
```

### E2E Tests (WebDriver)

Located in `e2e-webdriver/`. These test the **complete Tauri app** including the Rust backend, using the official Tauri WebDriver approach.

| Test File | What it Tests |
|-----------|---------------|
| `app.spec.js` | App launch, navigation, emulator list with real backend data |
| `emulator-download.spec.js` | Full download workflow: UI → Rust → Download → Extract → UI update |

#### Prerequisites

1. **Install tauri-driver** (one-time):
   ```bash
   cargo install tauri-driver
   ```

2. **Download Microsoft Edge WebDriver**:
   - Check your Edge version: `edge://version` or `Settings > About`
   - Download matching driver from: https://developer.microsoft.com/en-us/microsoft-edge/tools/webdriver/
   - Place `msedgedriver.exe` in `e2e-webdriver/` folder or add to PATH

3. **Build the app**:
   ```bash
   npm run tauri build
   ```

#### Running E2E Tests

```bash
# Run all E2E tests
npm run test:e2e

# Run specific tests
npm run test:e2e:app
npm run test:e2e:download

# Run with wdio directly
npx wdio run wdio.conf.js --spec e2e-webdriver/app.spec.js
```

| Test File | What it Tests |
|-----------|---------------|
| `app.spec.js` | App launch, navigation, emulator list with real backend data |
| `emulator-download.spec.js` | Full download workflow: UI → Rust → Download → Extract → UI update |

**Why use WebDriver tests?**
- Tests the **real app** with Rust backend
- Verifies `invoke()` calls actually work
- Tests real emulator downloads end-to-end
- Official Tauri-recommended approach for desktop E2E testing

### Unit Test Locations

| File | Tests | What's Tested |
|------|-------|---------------|
| `models/sync.rs` | 3 | SyncState DB roundtrip, unknown string handling, underscore format |
| `models/game.rs` | 4 | GameSource roundtrip, unknown default, play time formatting |
| `models/platform.rs` | 6 | Slug mapping (RomM → wingosy), extension detection, case sensitivity |
| `scanner/mod.rs` | 2 | ROM name cleaning, multi-disc detection |

### Integration Tests

Integration tests are in `src-tauri/tests/` and test against real external services. They're marked `#[ignore]` so `cargo test` skips them by default.

#### RomM Integration Tests (`romm_integration.rs`)

Require credentials in `.env`:

```
ROMM_SERVER_URL=https://romm.example.com
ROMM_USERNAME=your_username
ROMM_PASSWORD=your_password
```

| Test | What it verifies |
|------|-----------------|
| `authenticate_with_romm_server` | Token is returned and non-empty |
| `heartbeat_is_accessible` | Server is reachable, returns RomM version |
| `cookie_based_auth_flow` | CSRF cookie + JWT token flow works |
| `fetch_platforms_with_auth` | Platforms endpoint (gracefully skips on 403) |

#### Emulator Download Tests (`emulator_integration.rs`)

No credentials required - these test actual downloads from GitHub and libretro buildbot.

```bash
# Run all emulator tests
cargo test --test emulator_integration -- --ignored --nocapture

# Run specific tests
cargo test --test emulator_integration test_retroarch_direct_download -- --ignored --nocapture
cargo test --test emulator_integration test_github_release_download -- --ignored --nocapture
cargo test --test emulator_integration test_retroarch_core_download -- --ignored --nocapture
cargo test --test emulator_integration test_all_emulator_sources_accessible -- --ignored --nocapture
```

| Test | What it verifies | Duration |
|------|------------------|----------|
| `test_all_emulator_sources_accessible` | All emulator download URLs/GitHub releases are reachable | ~3s |
| `test_retroarch_core_download` | Download and extract a RetroArch core (snes9x) | ~2s |
| `test_github_release_download` | Full workflow: fetch mGBA release → download → extract → find exe | ~60s |
| `test_retroarch_direct_download` | Full workflow: download RetroArch 7z → extract → find exe | ~120s |

These tests are **AI/CI-friendly** - they can be run headless without any UI interaction.

### Environment Setup for Tests

```bash
# Copy the example env file
cp .env.example .env

# Edit with your RomM credentials
# The test user needs API read permissions for full integration tests
```

## Development Workflow

### Running in Dev Mode

```bash
npm run tauri dev
```

This starts:
1. **Vite dev server** on `http://localhost:5173` with hot-reload for React
2. **Rust backend** compiled in debug mode, auto-rebuilds on `.rs` file changes

### Debug vs Release Builds

Wingosy uses compile-time debug mode (like Argosy Launcher):

| | Debug Build (`npm run tauri dev`) | Release Build (`npm run tauri build`) |
|---|---|---|
| **Console window** | Visible (shows logs) | Hidden |
| **Game launching** | **Dry run** — commands logged, games NOT launched | Normal — games launch |
| **Tracing level** | `debug` and above | `info` and above |
| **Performance** | Slower (no optimizations) | Optimized |

**In debug builds**, clicking "Play" will:
1. Log the full emulator command to the console
2. Write the command to `%APPDATA%/wingosy/launcher/data/logs/launches.log`
3. **NOT actually launch the game** (dry run mode)

This lets you verify launch commands without running emulators. To actually play games during development, build a release binary:

```bash
npm run tauri build
# Then run: src-tauri/target/release/wingosy-launcher.exe
```

### Launch Logs

All game launches (debug and release) are logged to:

```
%APPDATA%/wingosy/launcher/data/logs/launches.log
```

Each entry includes:
- Timestamp
- Game name and emulator
- ROM path
- Full command line

Example log entry:
```
[2026-03-29 14:32:15] Super Mario World via RetroArch
  ROM: C:\Games\SNES\Super Mario World.sfc
  Command: "C:\RetroArch\retroarch.exe" -L "cores\snes9x_libretro.dll" "C:\Games\SNES\Super Mario World.sfc"
```

### Frontend Only

```bash
npm run dev
```

Starts just the Vite server. Tauri API calls will fail, but useful for UI-only work.

### Backend Only

```bash
cd src-tauri
cargo check    # type-check without building
cargo build    # full debug build
```

## Adding Features

### Adding a New Tauri Command

1. Add the function in `src-tauri/src/commands.rs`:

```rust
#[tauri::command]
pub fn my_new_command(arg: String) -> CommandResult<String> {
    Ok(format!("Hello, {}!", arg))
}
```

2. Register it in `src-tauri/src/main.rs`:

```rust
.invoke_handler(tauri::generate_handler![
    // ... existing commands
    commands::my_new_command,
])
```

3. Call it from React:

```javascript
const result = await invoke("my_new_command", { arg: "world" });
```

### Adding a New Emulator

1. Add config in `src-tauri/src/models/emulator.rs` → `default_emulators()`
2. Add detection paths in `src-tauri/src/emulators/detection.rs` → `emulator_patterns`
3. If RetroArch core, add to `retroarch_cores()` in `emulator.rs`
4. Add path field in `src-tauri/src/config/mod.rs` → `EmulatorPaths`
5. Map it in `src-tauri/src/emulators/launcher.rs` → `get_emulator_path()`

### Adding a New Platform

1. Add to `default_platforms()` in `src-tauri/src/models/platform.rs`
2. Add RomM slug mapping in `map_romm_slug()` in the same file
3. Add a color in `src/components/GameCard.jsx` → `PLATFORM_COLORS`
4. Add an icon in `src/components/Sidebar.jsx` → `PLATFORM_ICONS`
5. Add unit tests for the new slug mappings

### Adding a New RomM Sync Feature

1. Add the API method in `src-tauri/src/api/romm.rs`
2. Add a Tauri command in `src-tauri/src/commands.rs` (re-authenticate via cookie)
3. Register in `src-tauri/src/main.rs`
4. Add React UI in the appropriate component
5. Add integration test in `src-tauri/tests/romm_integration.rs`

## Code Style

### Rust

- Format: `cargo fmt`
- Lint: `cargo clippy`
- Naming: `snake_case` for functions, `CamelCase` for types
- Tests: inline `#[cfg(test)]` for unit tests, `tests/` for integration

### JavaScript/React

- Functional components with hooks
- MUI components for all UI elements
- One file per component
- `normalizeUrl()` for any user-entered URLs

## Submitting Changes

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Make your changes
4. Run checks:

```bash
# Rust
cd src-tauri && cargo fmt && cargo clippy && cargo test --bin wingosy-launcher

# Frontend
npm run build
```

5. Commit with a clear message
6. Push and open a pull request

### Commit Messages

Follow conventional style:

- `feat: add Citra emulator support`
- `fix: correct ROM path resolution for multi-disc games`
- `refactor: simplify database query in games.rs`
- `docs: update emulator setup instructions`
- `test: add slug mapping tests for Sega platforms`

## Configuration

### App Config

Stored at `%APPDATA%/wingosy/launcher/config/config.toml`:

```toml
[romm]
server_url = "https://romm.example.com"
username = "user"
password = "pass"
auth_token = "eyJ..."
auto_sync = false
sync_saves = false

[library]
roms_directory = "C:\\Games\\ROMs"
scan_subdirectories = true

[display]
theme = "Dark"
grid_columns = 5
```

### Data Locations

| Data | Path |
|------|------|
| Config | `%APPDATA%/wingosy/launcher/config/config.toml` |
| Database | `%APPDATA%/wingosy/launcher/data/wingosy.db` |
| Cover art cache | `%LOCALAPPDATA%/wingosy/launcher/cache/covers/` |
| Downloaded saves | `%APPDATA%/wingosy/launcher/data/saves/` |
| Downloaded ROMs | Configured `roms_directory` or `%APPDATA%/wingosy/launcher/data/roms/` |
| Launch logs | `%APPDATA%/wingosy/launcher/data/logs/launches.log` |

## Logging

Wingosy uses the `tracing` crate for comprehensive logging. Logs are output to the console window in debug builds.

### Log Categories

All log messages are prefixed with a category tag for easy filtering:

| Tag | Description |
|-----|-------------|
| `[App]` | Application startup and lifecycle |
| `[Config]` | Configuration loading/saving |
| `[Library]` | Game database queries |
| `[Launch]` | Game launching and dry runs |
| `[Scanner]` | ROM directory scanning |
| `[Emulators]` | Emulator detection and installation |
| `[RetroArch]` | RetroArch cores management |
| `[RomM]` | RomM server authentication and sync |
| `[Download]` | ROM and asset downloads |
| `[Setup]` | Initial setup wizard |
| `[Scan]` | Directory scanning progress |

### Log Levels

| Level | When to use |
|-------|-------------|
| `tracing::error!` | Operation failed, user needs to know |
| `tracing::warn!` | Something unexpected but recoverable |
| `tracing::info!` | Key operations (login, sync complete, game launched) |
| `tracing::debug!` | Detailed progress for debugging |

### Example Log Output

```
INFO [App] Starting Wingosy Launcher v0.1.0
INFO [Config] Loaded configuration successfully
DEBUG [Config] RomM server: Some("https://romm.example.com")
INFO [RomM] Authenticating user 'admin' at https://romm.example.com
INFO [RomM] Authentication successful for 'admin'
INFO [Emulators] Starting emulator detection scan...
DEBUG [Emulators] Found RetroArch at "C:\\RetroArch\\retroarch.exe"
INFO [Emulators] Detected 3 emulator(s):
INFO [Emulators]   - RetroArch at "C:\\RetroArch\\retroarch.exe"
INFO [Emulators]   - PCSX2 at "C:\\PCSX2\\pcsx2.exe"
INFO [Emulators]   - Dolphin at "C:\\Dolphin\\Dolphin.exe"
INFO [Library] Loaded 156 games from database
INFO [Launch] Launching game id=42
INFO [Launch] Game: Super Mario World (snes)
WARN [DEBUG BUILD] Dry run - game not launched
INFO [DEBUG BUILD] Command: "C:\\RetroArch\\retroarch.exe" -L "cores\\snes9x_libretro.dll" "C:\\Games\\SNES\\Super Mario World.sfc"
```

### Reading Logs

In **debug builds** (`npm run tauri dev`), logs appear in the console window that opens alongside the app.

For persistent logging, check the launch log file:
```
%APPDATA%/wingosy/launcher/data/logs/launches.log
```

### Filtering Logs

You can filter console output by piping through a search tool:

```bash
# PowerShell - filter for RomM-related logs
npm run tauri dev 2>&1 | Select-String "\[RomM\]"

# Or filter for errors/warnings only
npm run tauri dev 2>&1 | Select-String "(ERROR|WARN)"
```

## Troubleshooting

### `cargo build` fails with linker errors
Make sure Visual Studio Build Tools are installed with the C++ workload.

### `npm run tauri dev` shows a blank window
The Vite dev server may not have started. Check that port 5173 is free and `npm run dev` works standalone.

### Icons error during build
Ensure valid `.ico` and `.png` files exist in `src-tauri/icons/`.

### Database errors on startup
Delete `%APPDATA%/wingosy/launcher/data/wingosy.db` to reset. Platforms and collections re-initialize on next launch.

### RomM sync returns 403
The user account needs API read permissions on the RomM server. Check the user role in RomM admin settings.

### Cover art not showing
Verify `protocol-asset` is in the Tauri features (`Cargo.toml`) and `asset: true` is in `tauri.conf.json`. Cover images must be local files — the sync downloads them to the cache directory.

### Games not launching in dev mode
This is expected behavior. Debug builds use **dry run mode** — games are not launched, only the command is logged. Check the console output or `%APPDATA%/wingosy/launcher/data/logs/launches.log` to see what command would have been executed. To test actual launching, use a release build.

### Checking what command would be executed
Look at the launch log at `%APPDATA%/wingosy/launcher/data/logs/launches.log`. This file is written in both debug and release builds and contains the full command line for each launch attempt.
