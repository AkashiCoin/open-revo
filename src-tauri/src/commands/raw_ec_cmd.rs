// OpenRevo - Raw EC & Hardware Driver Gateway IPC Commands
// Exposes low-level motherboard driver read/write and mailbox invocation endpoints.

use crate::system::raw_gateway::{
    execute_raw_mailbox, execute_raw_read, execute_raw_write, get_gateway_capabilities,
    RawEcCapabilities, RawEcReadRequest, RawEcWriteRequest, RawMailboxRequest,
};

#[tauri::command]
pub fn get_raw_ec_capabilities() -> RawEcCapabilities {
    get_gateway_capabilities()
}

#[tauri::command]
pub fn raw_ec_read(request: RawEcReadRequest) -> Result<u8, String> {
    execute_raw_read(request)
}

#[tauri::command]
pub fn raw_ec_write(request: RawEcWriteRequest) -> Result<bool, String> {
    execute_raw_write(request)
}

#[tauri::command]
pub fn raw_mailbox_invoke(request: RawMailboxRequest) -> Result<Vec<u8>, String> {
    execute_raw_mailbox(request)
}
