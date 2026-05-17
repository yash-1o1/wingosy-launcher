//! RomM save sync helpers (Argosy-compatible layouts where noted).
pub mod switch_romm;
pub mod switch_save;

pub use switch_romm::{
    download_switch_save_to_eden, upload_switch_save_from_eden, SwitchSaveSyncResult,
};
pub use switch_save::resolve_local_title_save_path;
