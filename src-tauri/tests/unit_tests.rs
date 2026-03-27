#[cfg(test)]
mod sync_state_tests {
    #[derive(Debug, Clone, Copy, PartialEq, Eq)]
    enum SyncState { LocalOnly, Synced, PendingUpload, PendingDownload, Conflict, RemoteOnly }

    impl SyncState {
        fn to_db_str(&self) -> &'static str {
            match self {
                SyncState::LocalOnly => "local_only",
                SyncState::Synced => "synced",
                SyncState::PendingUpload => "pending_upload",
                SyncState::PendingDownload => "pending_download",
                SyncState::Conflict => "conflict",
                SyncState::RemoteOnly => "remote_only",
            }
        }
        fn from_db_str(s: &str) -> Self {
            match s {
                "synced" => SyncState::Synced,
                "pending_upload" => SyncState::PendingUpload,
                "pending_download" => SyncState::PendingDownload,
                "conflict" => SyncState::Conflict,
                "remote_only" => SyncState::RemoteOnly,
                _ => SyncState::LocalOnly,
            }
        }
    }

    #[test]
    fn roundtrip_all_variants() {
        let variants = [
            SyncState::LocalOnly, SyncState::Synced, SyncState::PendingUpload,
            SyncState::PendingDownload, SyncState::Conflict, SyncState::RemoteOnly,
        ];
        for variant in &variants {
            let s = variant.to_db_str();
            let roundtripped = SyncState::from_db_str(s);
            assert_eq!(*variant, roundtripped, "Failed roundtrip for {:?} -> {:?}", variant, s);
        }
    }

    #[test]
    fn from_unknown_string_defaults_to_local_only() {
        assert_eq!(SyncState::from_db_str("garbage"), SyncState::LocalOnly);
        assert_eq!(SyncState::from_db_str(""), SyncState::LocalOnly);
        assert_eq!(SyncState::from_db_str("remoteonly"), SyncState::LocalOnly);
    }

    #[test]
    fn db_strings_use_underscores() {
        assert_eq!(SyncState::RemoteOnly.to_db_str(), "remote_only");
        assert_eq!(SyncState::PendingUpload.to_db_str(), "pending_upload");
        assert_eq!(SyncState::PendingDownload.to_db_str(), "pending_download");
        assert_eq!(SyncState::LocalOnly.to_db_str(), "local_only");
    }
}

#[cfg(test)]
mod game_source_tests {
    #[derive(Debug, Clone, Copy, PartialEq, Eq)]
    enum GameSource { Local, RomM }

    impl GameSource {
        fn to_db_str(&self) -> &'static str {
            match self { GameSource::Local => "local", GameSource::RomM => "romm" }
        }
        fn from_db_str(s: &str) -> Self {
            match s { "romm" => GameSource::RomM, _ => GameSource::Local }
        }
    }

    #[test]
    fn roundtrip() {
        assert_eq!(GameSource::from_db_str(GameSource::Local.to_db_str()), GameSource::Local);
        assert_eq!(GameSource::from_db_str(GameSource::RomM.to_db_str()), GameSource::RomM);
    }

    #[test]
    fn unknown_defaults_to_local() {
        assert_eq!(GameSource::from_db_str("unknown"), GameSource::Local);
    }
}

#[cfg(test)]
mod rom_name_cleaning_tests {
    fn clean_rom_name(name: &str) -> String {
        let mut result = name.to_string();
        let patterns = [r"\s*\([^)]*\)", r"\s*\[[^\]]*\]", r"\s*\{[^}]*\}"];
        for pattern in patterns {
            if let Ok(re) = regex_lite::Regex::new(pattern) {
                result = re.replace_all(&result, "").to_string();
            }
        }
        result = result.replace('_', " ");
        result.split_whitespace().collect::<Vec<_>>().join(" ")
    }

    #[test]
    fn strips_parentheses() {
        assert_eq!(clean_rom_name("Final Fantasy VII (USA) (Disc 1)"), "Final Fantasy VII");
    }

    #[test]
    fn strips_brackets() {
        assert_eq!(clean_rom_name("Zelda [USA] [Rev 1]"), "Zelda");
    }

    #[test]
    fn replaces_underscores() {
        assert_eq!(clean_rom_name("Chrono_Trigger_(USA)"), "Chrono Trigger");
    }

    #[test]
    fn handles_empty_string() {
        assert_eq!(clean_rom_name(""), "");
    }
}
