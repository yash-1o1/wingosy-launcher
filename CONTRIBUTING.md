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

Tests follow Rust convention:

- **Unit tests**: inline `#[cfg(test)]` modules inside source files (compiled away in release)
- **Integration tests**: in `src-tauri/tests/` (test public API against external services)

### Running Tests

```bash
cd src-tauri

# Run all unit tests (15 tests across 4 modules)
cargo test --bin wingosy-launcher

# Run integration tests against live RomM server (requires .env)
cargo test --test romm_integration -- --ignored

# Run everything
cargo test --bin wingosy-launcher && cargo test --test romm_integration -- --ignored
```

### Unit Test Locations

| File | Tests | What's Tested |
|------|-------|---------------|
| `models/sync.rs` | 3 | SyncState DB roundtrip, unknown string handling, underscore format |
| `models/game.rs` | 4 | GameSource roundtrip, unknown default, play time formatting |
| `models/platform.rs` | 6 | Slug mapping (RomM → wingosy), extension detection, case sensitivity |
| `scanner/mod.rs` | 2 | ROM name cleaning, multi-disc detection |

### Integration Tests

Located in `src-tauri/tests/romm_integration.rs`. These hit a live RomM server and require credentials in `.env`:

```
ROMM_SERVER_URL=https://romm.example.com
ROMM_USERNAME=your_username
ROMM_PASSWORD=your_password
```

Tests are marked `#[ignore]` so `cargo test` skips them by default. Run explicitly with `--ignored`.

| Test | What it verifies |
|------|-----------------|
| `authenticate_with_romm_server` | Token is returned and non-empty |
| `heartbeat_is_accessible` | Server is reachable, returns RomM version |
| `cookie_based_auth_flow` | CSRF cookie + JWT token flow works |
| `fetch_platforms_with_auth` | Platforms endpoint (gracefully skips on 403) |

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
