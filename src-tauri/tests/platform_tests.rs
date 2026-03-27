#[path = "../src/models/platform.rs"]
#[allow(dead_code)]
mod platform_mod;

#[cfg(test)]
mod slug_mapping_tests {
    use super::platform_mod::map_romm_slug;

    #[test]
    fn maps_common_romm_slugs() {
        assert_eq!(map_romm_slug("sega-genesis"), "genesis");
        assert_eq!(map_romm_slug("sega-mega-drive-genesis"), "genesis");
        assert_eq!(map_romm_slug("mega-drive"), "genesis");
        assert_eq!(map_romm_slug("super-nintendo"), "snes");
        assert_eq!(map_romm_slug("super-nintendo-entertainment-system"), "snes");
        assert_eq!(map_romm_slug("nintendo-64"), "n64");
        assert_eq!(map_romm_slug("sony-playstation"), "psx");
        assert_eq!(map_romm_slug("playstation-2"), "ps2");
        assert_eq!(map_romm_slug("playstation-portable"), "psp");
        assert_eq!(map_romm_slug("nintendo-game-boy-advance"), "gba");
        assert_eq!(map_romm_slug("sega-dreamcast"), "dreamcast");
        assert_eq!(map_romm_slug("nintendo-switch"), "switch");
    }

    #[test]
    fn passes_through_already_short_slugs() {
        assert_eq!(map_romm_slug("snes"), "snes");
        assert_eq!(map_romm_slug("nes"), "nes");
        assert_eq!(map_romm_slug("n64"), "n64");
        assert_eq!(map_romm_slug("gba"), "gba");
        assert_eq!(map_romm_slug("psx"), "psx");
    }

    #[test]
    fn unknown_slugs_pass_through() {
        assert_eq!(map_romm_slug("neo-geo-pocket"), "neo-geo-pocket");
        assert_eq!(map_romm_slug("turbografx-16"), "turbografx-16");
    }
}

#[cfg(test)]
mod extension_detection_tests {
    use super::platform_mod::detect_platform_by_extension;

    #[test]
    fn detects_common_extensions() {
        assert_eq!(detect_platform_by_extension(".sfc"), Some("snes".into()));
        assert_eq!(detect_platform_by_extension(".nes"), Some("nes".into()));
        assert_eq!(detect_platform_by_extension(".gba"), Some("gba".into()));
        assert_eq!(detect_platform_by_extension(".nds"), Some("nds".into()));
        assert_eq!(detect_platform_by_extension(".n64"), Some("n64".into()));
    }

    #[test]
    fn case_insensitive() {
        assert_eq!(detect_platform_by_extension(".SFC"), Some("snes".into()));
        assert_eq!(detect_platform_by_extension(".GBA"), Some("gba".into()));
    }

    #[test]
    fn unknown_extension_returns_none() {
        assert_eq!(detect_platform_by_extension(".xyz"), None);
        assert_eq!(detect_platform_by_extension(".mp3"), None);
    }
}
