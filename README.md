# Wingosy Launcher

A Windows-native game launcher with RomM integration for managing and launching emulated games. Built with Tauri (Rust backend) and React + MUI (frontend). Inspired by [Argosy Launcher](https://github.com/rommapp/argosy-launcher) for Android.

## Features

### Core Functionality
- **RomM Integration**: Connect to your self-hosted [RomM](https://github.com/rommapp/romm) server to sync your game library
- **ROM Scanning**: Automatically scan local directories for ROMs and organize by platform
- **Game Launching**: Launch games directly with your preferred emulator
- **Save Sync**: Bidirectional save synchronization with your RomM server

### Library Management
- **Multi-Platform Support**: NES, SNES, N64, GameCube, Wii, PlayStation 1-3, PSP, Xbox, and more
- **Collections**: Create custom collections or use smart collections (Recently Played, Favorites, etc.)
- **Search & Filter**: Find games quickly with search and platform filters
- **Metadata**: View game information, cover art, and play statistics

### Emulator Support
- **Auto-Detection**: Automatically detects installed emulators on Windows
- **Per-Game Overrides**: Set specific emulators for individual games
- **RetroArch Integration**: Full RetroArch core support with automatic core selection
- **Standalone Emulators**: Dolphin, PCSX2, RPCS3, PPSSPP, DuckStation, Cemu, Ryujinx, and more

## Installation

Download the latest installer from the [Releases](https://github.com/yash-1o1/wingosy-launcher/releases) page:

- **MSI installer** — standard Windows install/uninstall
- **NSIS setup** — portable installer

### Requirements
- Windows 10/11
- Emulators installed for your desired platforms
- A [RomM](https://github.com/rommapp/romm) server (optional, for sync features)

## Quick Start

1. Install and launch Wingosy
2. Open **Settings** and scan your ROM directory
3. (Optional) Connect to your RomM server for cloud sync
4. Browse your library and start playing

## Configuration

Configuration is stored in:
- **Config**: `%APPDATA%/wingosy/launcher/config.toml`
- **Database**: `%APPDATA%/wingosy/launcher/wingosy.db`
- **Cache**: `%LOCALAPPDATA%/wingosy/launcher/cache/`

## Supported Platforms

| Platform | Extensions | Recommended Emulator |
|----------|------------|---------------------|
| NES | `.nes`, `.unf` | RetroArch (FCEUmm) |
| SNES | `.sfc`, `.smc` | RetroArch (Snes9x) |
| Nintendo 64 | `.n64`, `.z64`, `.v64` | RetroArch (Mupen64Plus) |
| GameCube | `.iso`, `.gcm`, `.rvz` | Dolphin |
| Wii | `.iso`, `.wbfs`, `.rvz` | Dolphin |
| Wii U | `.wud`, `.wux`, `.rpx` | Cemu |
| Switch | `.nsp`, `.xci` | Ryujinx |
| Game Boy | `.gb` | RetroArch (Gambatte) |
| Game Boy Color | `.gbc` | RetroArch (Gambatte) |
| Game Boy Advance | `.gba` | mGBA / RetroArch |
| Nintendo DS | `.nds` | melonDS |
| Nintendo 3DS | `.3ds`, `.cia` | Lime3DS |
| PlayStation | `.bin`, `.cue`, `.chd` | DuckStation |
| PlayStation 2 | `.iso`, `.chd` | PCSX2 |
| PlayStation 3 | `.iso`, `.pkg` | RPCS3 |
| PSP | `.iso`, `.cso` | PPSSPP |
| Genesis | `.md`, `.gen` | RetroArch (Genesis Plus GX) |
| Dreamcast | `.gdi`, `.cdi`, `.chd` | Flycast |
| Xbox | `.iso`, `.xiso` | xemu |
| Xbox 360 | `.iso`, `.xex` | Xenia Canary |
| Arcade | `.zip` | MAME |

## Tech Stack

| Component | Technology |
|-----------|------------|
| Backend | Rust |
| Frontend | React 18 |
| UI Library | Material UI (MUI) 6 |
| Desktop Framework | Tauri 1 |
| Build Tool | Vite |
| Database | SQLite (rusqlite) |
| HTTP Client | reqwest |
| Async Runtime | Tokio |

## Building from Source

```bash
# Prerequisites: Rust, Node.js 18+, Visual Studio Build Tools (C++)

git clone https://github.com/yash-1o1/wingosy-launcher.git
cd wingosy-launcher
npm install
npm run tauri build
```

Outputs:
- `src-tauri/target/release/bundle/msi/` — MSI installer
- `src-tauri/target/release/bundle/nsis/` — NSIS setup executable
- `src-tauri/target/release/wingosy-launcher.exe` — standalone binary

For development with hot-reload:

```bash
npm run tauri dev
```

## Roadmap

### Current (v0.1.0)
- [x] Tauri + React + MUI project architecture
- [x] Local SQLite database with full schema
- [x] ROM scanning with platform detection
- [x] Game library UI with search and filtering
- [x] Emulator launching with play session tracking
- [x] RomM API client with authentication
- [x] Settings UI (RomM, library scanning, emulator detection)
- [x] Windows emulator auto-detection
- [x] MSI and NSIS installers

### Planned
- [ ] Full RomM library sync
- [ ] Save file synchronization
- [ ] Cover art downloading and caching
- [ ] Download queue with progress tracking
- [ ] Archive extraction (.zip, .7z)
- [ ] First-run setup wizard
- [ ] Gamepad navigation support
- [ ] Custom themes (light/dark/custom)
- [ ] RetroAchievements display

## Contributing

Contributions are welcome! See [CONTRIBUTING.md](CONTRIBUTING.md) for build instructions, architecture overview, and development workflow.

## License

This project is licensed under the GNU General Public License v3.0 - see the [LICENSE](LICENSE) file for details.

## Credits

- Inspired by [Argosy Launcher](https://github.com/rommapp/argosy-launcher) for Android
- Built to complement [RomM](https://github.com/rommapp/romm) — the self-hosted ROM manager
