use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Platform {
    pub id: String,
    pub name: String,
    pub short_name: Option<String>,
    pub extensions: Vec<String>,
    pub logo_path: Option<String>,
    pub sort_order: i32,
}
impl Platform {
    pub fn new(id: impl Into<String>, name: impl Into<String>, extensions: Vec<&str>) -> Self {
        let id = id.into();
        Self {
            sort_order: platform_sort_order(&id),
            id,
            name: name.into(),
            short_name: None,
            extensions: extensions.into_iter().map(String::from).collect(),
            logo_path: None,
        }
    }
}

pub fn platform_sort_order(id: &str) -> i32 {
    match id {
        "nes" => 100,
        "snes" => 110,
        "n64" => 120,
        "gc" => 130,
        "wii" => 140,
        "wiiu" => 150,
        "switch" => 160,
        "gb" => 200,
        "gbc" => 210,
        "gba" => 220,
        "nds" => 230,
        "3ds" => 240,
        "psx" => 300,
        "ps2" => 310,
        "ps3" => 320,
        "psp" => 350,
        "psvita" => 360,
        "genesis" => 400,
        "saturn" => 410,
        "dreamcast" => 420,
        "xbox" => 500,
        "xbox360" => 510,
        "arcade" => 900,
        "pc" => 1_000,
        _ => 10_000,
    }
}

pub fn default_platforms() -> Vec<Platform> {
    vec![
        Platform::new("nes", "Nintendo Entertainment System", vec![".nes", ".unf", ".unif"]),
        Platform::new("snes", "Super Nintendo", vec![".sfc", ".smc"]),
        Platform::new("n64", "Nintendo 64", vec![".n64", ".z64", ".v64"]),
        Platform::new("gc", "Nintendo GameCube", vec![".iso", ".gcm", ".gcz", ".rvz"]),
        Platform::new("wii", "Nintendo Wii", vec![".iso", ".wbfs", ".rvz"]),
        Platform::new("wiiu", "Nintendo Wii U", vec![".wud", ".wux", ".rpx"]),
        Platform::new("switch", "Nintendo Switch", vec![".nsp", ".xci", ".nsz"]),
        Platform::new("gb", "Game Boy", vec![".gb"]),
        Platform::new("gbc", "Game Boy Color", vec![".gbc"]),
        Platform::new("gba", "Game Boy Advance", vec![".gba"]),
        Platform::new("nds", "Nintendo DS", vec![".nds"]),
        Platform::new("3ds", "Nintendo 3DS", vec![".3ds", ".cia", ".cci", ".cxi"]),
        Platform::new("psx", "PlayStation", vec![".bin", ".cue", ".iso", ".chd", ".pbp"]),
        Platform::new("ps2", "PlayStation 2", vec![".iso", ".bin", ".chd"]),
        Platform::new("ps3", "PlayStation 3", vec![".iso", ".pkg"]),
        Platform::new("psp", "PlayStation Portable", vec![".iso", ".cso", ".pbp"]),
        Platform::new("psvita", "PlayStation Vita", vec![".vpk"]),
        Platform::new("genesis", "Sega Genesis", vec![".md", ".gen", ".bin", ".smd"]),
        Platform::new("saturn", "Sega Saturn", vec![".iso", ".bin", ".cue", ".chd"]),
        Platform::new("dreamcast", "Sega Dreamcast", vec![".gdi", ".cdi", ".chd"]),
        Platform::new("xbox", "Xbox", vec![".iso", ".xiso"]),
        Platform::new("xbox360", "Xbox 360", vec![".iso", ".xex"]),
        Platform::new("arcade", "Arcade", vec![".zip"]),
        Platform::new("pc", "PC Games", vec![".exe"]),
    ]
}

pub fn detect_platform_by_extension(ext: &str) -> Option<String> {
    let ext_lower = ext.to_lowercase();
    for platform in default_platforms() {
        if platform.extensions.iter().any(|e| e == &ext_lower) {
            return Some(platform.id);
        }
    }
    None
}

pub fn map_romm_slug(slug: &str) -> String {
    let normalized = slug.trim().to_ascii_lowercase().replace('_', "-");

    match normalized.as_str() {
        "snes"
        | "super-nintendo"
        | "super-nintendo-entertainment-system"
        | "super-famicom"
        | "superfamicom" => "snes".into(),
        "nes" | "nintendo-entertainment-system" | "famicom" => "nes".into(),
        "n64" | "nintendo-64" | "nintendo64" => "n64".into(),
        "gc" | "gamecube" | "nintendo-gamecube" | "ngc" => "gc".into(),
        "wii" | "nintendo-wii" => "wii".into(),
        "wiiu" | "wii-u" | "nintendo-wii-u" | "nintendo-wiiu" => "wiiu".into(),
        "switch" | "nintendo-switch" | "nswitch" => "switch".into(),
        "gb" | "game-boy" | "gameboy" | "nintendo-game-boy" => "gb".into(),
        "gbc" | "game-boy-color" | "gameboy-color" | "gameboycolor" | "nintendo-game-boy-color" => "gbc".into(),
        "gba" | "game-boy-advance" | "gameboy-advance" | "gameboyadvance" | "nintendo-game-boy-advance" => "gba".into(),
        "nds" | "nintendo-ds" | "nintendods" => "nds".into(),
        "3ds" | "nintendo-3ds" | "nintendo3ds" | "new-nintendo-3ds" => "3ds".into(),
        "psx" | "ps" | "ps1" | "playstation" | "playstation-1" | "playstation1" | "sony-playstation" => "psx".into(),
        "ps2" | "playstation-2" | "playstation2" | "sony-playstation-2" => "ps2".into(),
        "ps3" | "playstation-3" | "playstation3" | "sony-playstation-3" => "ps3".into(),
        "psp" | "playstation-portable" | "sony-psp" => "psp".into(),
        "vita" | "psvita" | "playstation-vita" | "playstationvita" | "ps-vita" | "sony-playstation-vita" => "psvita".into(),
        "genesis" | "sega-genesis" | "mega-drive" | "sega-mega-drive" | "megadrive" | "sega-mega-drive-genesis" => "genesis".into(),
        "saturn" | "sega-saturn" => "saturn".into(),
        "dreamcast" | "sega-dreamcast" | "dc" => "dreamcast".into(),
        "xbox" | "microsoft-xbox" => "xbox".into(),
        "xbox360" | "xbox-360" | "microsoft-xbox-360" | "x360" => "xbox360".into(),
        "arcade" | "mame" | "fbneo" | "final-burn-neo" => "arcade".into(),
        "pc" | "dos" | "ms-dos" | "windows" | "microsoft-windows" => "pc".into(),
        _ => slug.to_string(),
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn slug_maps_common_romm_slugs() {
        assert_eq!(map_romm_slug("sega-genesis"), "genesis");
        assert_eq!(map_romm_slug("sega-mega-drive-genesis"), "genesis");
        assert_eq!(map_romm_slug("super-nintendo"), "snes");
        assert_eq!(map_romm_slug("nintendo-64"), "n64");
        assert_eq!(map_romm_slug("sony-playstation"), "psx");
        assert_eq!(map_romm_slug("playstation-2"), "ps2");
        assert_eq!(map_romm_slug("nintendo-game-boy-advance"), "gba");
        assert_eq!(map_romm_slug("sega-dreamcast"), "dreamcast");
        assert_eq!(map_romm_slug("nintendo-switch"), "switch");
        assert_eq!(map_romm_slug("vita"), "psvita");
        assert_eq!(map_romm_slug("GAMEBOY_ADVANCE"), "gba");
        assert_eq!(map_romm_slug("nintendo64"), "n64");
        assert_eq!(map_romm_slug("playstation3"), "ps3");
        assert_eq!(map_romm_slug("final_burn_neo"), "arcade");
    }

    #[test]
    fn slug_passes_through_short_ids() {
        assert_eq!(map_romm_slug("snes"), "snes");
        assert_eq!(map_romm_slug("nes"), "nes");
        assert_eq!(map_romm_slug("gba"), "gba");
        assert_eq!(map_romm_slug("psx"), "psx");
    }

    #[test]
    fn slug_unknown_passes_through() {
        assert_eq!(map_romm_slug("neo-geo-pocket"), "neo-geo-pocket");
        assert_eq!(map_romm_slug("Custom_System"), "Custom_System");
    }

    #[test]
    fn default_platforms_follow_stable_family_order() {
        let platforms = default_platforms();
        assert!(platforms
            .windows(2)
            .all(|pair| pair[0].sort_order < pair[1].sort_order));
        assert!(platform_sort_order("unknown-system") > platforms.last().unwrap().sort_order);
    }

    #[test]
    fn extension_detects_common() {
        assert_eq!(detect_platform_by_extension(".sfc"), Some("snes".into()));
        assert_eq!(detect_platform_by_extension(".nes"), Some("nes".into()));
        assert_eq!(detect_platform_by_extension(".gba"), Some("gba".into()));
        assert_eq!(detect_platform_by_extension(".nds"), Some("nds".into()));
    }

    #[test]
    fn extension_case_insensitive() {
        assert_eq!(detect_platform_by_extension(".SFC"), Some("snes".into()));
        assert_eq!(detect_platform_by_extension(".GBA"), Some("gba".into()));
    }

    #[test]
    fn extension_unknown_returns_none() {
        assert_eq!(detect_platform_by_extension(".xyz"), None);
    }
}
