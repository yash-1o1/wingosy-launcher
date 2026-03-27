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

# Run in development mode (hot-reload for React, auto-rebuild for Rust)
npm run tauri dev

# Build release binaries
npm run tauri build
```

### Output Locations

| Build | Path |
|-------|------|
| Dev binary | `src-tauri/target/debug/wingosy-launcher.exe` |
| Release binary | `src-tauri/target/release/wingosy-launcher.exe` |
| MSI installer | `src-tauri/target/release/bundle/msi/` |
| NSIS installer | `src-tauri/target/release/bundle/nsis/` |

## Project Structure

```
wingosy-launcher/
├── package.json              # Frontend deps (React, MUI, Vite)
├── vite.config.js            # Vite dev server config
├── index.html                # HTML entry point
│
├── src/                      # React frontend
│   ├── main.jsx              # React root + MUI ThemeProvider
│   ├── App.jsx               # Main app shell, routing, state
│   ├── theme.js              # MUI dark/light theme definition
│   └── components/
│       ├── Sidebar.jsx       # Navigation drawer with platforms
│       ├── Library.jsx       # Game grid view with search
│       ├── GameCard.jsx      # Individual game card with actions
│       ├── GameDetails.jsx   # Game detail page with stats
│       └── Settings.jsx      # RomM, library, emulator settings
│
├── src-tauri/                # Rust backend (Tauri)
│   ├── Cargo.toml            # Rust dependencies
│   ├── tauri.conf.json       # Tauri window/permission config
│   ├── build.rs              # Tauri build script
│   └── src/
│       ├── main.rs           # Tauri setup + command registration
│       ├── commands.rs       # Tauri command handlers (frontend ↔ backend bridge)
│       ├── api/
│       │   ├── romm.rs       # RomM REST API client
│       │   └── download.rs   # File download manager with progress
│       ├── config/
│       │   └── mod.rs        # TOML config (RomM, library, display, emulator paths)
│       ├── database/
│       │   ├── connection.rs # SQLite setup + schema migrations
│       │   ├── games.rs      # Game CRUD, filtering, favorites, play tracking
│       │   ├── platforms.rs  # Platform definitions + queries
│       │   ├── collections.rs# Smart + manual collections
│       │   └── emulators.rs  # Per-game/platform emulator config
│       ├── emulators/
│       │   ├── launcher.rs   # Process spawning + play session tracking
│       │   └── detection.rs  # Windows filesystem emulator scanning
│       ├── models/
│       │   ├── game.rs       # Game model, filtering, sorting enums
│       │   ├── platform.rs   # Platform definitions + extension mapping
│       │   ├── collection.rs # Collection + smart filter types
│       │   ├── emulator.rs   # Emulator configs + RetroArch core mapping
│       │   └── sync.rs       # Save sync state + file tracking
│       └── scanner/
│           └── mod.rs        # ROM directory scanning + name cleaning
```

## Architecture

```
┌─────────────────────────┐
│   React + MUI Frontend  │  ← UI layer (src/)
│   (Vite dev server)     │
└────────┬────────────────┘
         │ invoke("command_name", { args })
         │ @tauri-apps/api
┌────────▼────────────────┐
│   Tauri Command Layer   │  ← Bridge (commands.rs)
│   #[tauri::command]     │
└────────┬────────────────┘
         │
┌────────▼────────────────┐
│   Rust Backend          │  ← Business logic
│   • Database (SQLite)   │
│   • RomM API client     │
│   • Emulator launcher   │
│   • ROM scanner         │
└─────────────────────────┘
```

### Frontend → Backend Communication

The frontend calls Rust functions via Tauri's `invoke` API:

```javascript
import { invoke } from "@tauri-apps/api/tauri";

const games = await invoke("get_all_games");
const result = await invoke("launch_game", { gameId: 42 });
```

Each command is defined in `src-tauri/src/commands.rs`:

```rust
#[tauri::command]
pub fn get_all_games() -> CommandResult<Vec<Game>> {
    let db = get_db()?;
    db.get_all_games().map_err(|e| e.into())
}
```

## Development Workflow

### Running in Dev Mode

```bash
npm run tauri dev
```

This starts:
1. **Vite dev server** on `http://localhost:5173` with hot-reload for React changes
2. **Rust backend** compiled in debug mode, auto-rebuilds on `.rs` file changes

### Frontend Only

If you're only working on the UI and don't need the Rust backend:

```bash
npm run dev
```

This starts just the Vite server. Tauri API calls will fail, but you can mock them for UI development.

### Backend Only

To check that Rust code compiles without building the full app:

```bash
cd src-tauri
cargo check
```

## Code Style

### Rust

- Format with `cargo fmt` before committing
- Lint with `cargo clippy`
- Follow standard Rust naming conventions (snake_case for functions, CamelCase for types)

### JavaScript/React

- Use functional components with hooks
- MUI components for all UI elements
- Keep components focused — one file per component

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

1. Add the emulator config in `src-tauri/src/models/emulator.rs` → `default_emulators()`
2. Add detection paths in `src-tauri/src/emulators/detection.rs` → `emulator_patterns`
3. If it's a RetroArch core, add it to `retroarch_cores()` in `emulator.rs`
4. Add the emulator path field in `src-tauri/src/config/mod.rs` → `EmulatorPaths`
5. Map it in `src-tauri/src/emulators/launcher.rs` → `get_emulator_path()`

### Adding a New Platform

1. Add it to `default_platforms()` in `src-tauri/src/models/platform.rs`
2. The extension-based detection in `detect_platform_by_extension()` updates automatically
3. Add a color mapping in `src/components/GameCard.jsx` → `PLATFORM_COLORS`
4. Add an icon in `src/components/Sidebar.jsx` → `PLATFORM_ICONS`

## Submitting Changes

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Make your changes
4. Run checks:

```bash
cd src-tauri && cargo fmt && cargo clippy
npm run build
```

5. Commit with a clear message describing the change
6. Push and open a pull request

### Commit Messages

Follow conventional style:

- `feat: add Citra emulator support`
- `fix: correct ROM path resolution for multi-disc games`
- `refactor: simplify database query in games.rs`
- `docs: update emulator setup instructions`

## Troubleshooting

### `cargo build` fails with linker errors
Make sure Visual Studio Build Tools are installed with the C++ workload.

### `npm run tauri dev` shows a blank window
The Vite dev server may not have started. Check that port 5173 is free and `npm run dev` works standalone.

### Icons error during build
Run `npm run tauri icon` to regenerate icons, or ensure valid `.ico` and `.png` files exist in `src-tauri/icons/`.

### Database errors on startup
Delete `%APPDATA%/wingosy/launcher/wingosy.db` to reset the database. Platforms and collections will be re-initialized on next launch.
