use std::fs::{File, OpenOptions};
use std::io::Write;
use std::path::PathBuf;
use tauri::Manager;
use std::sync::atomic::{AtomicBool, Ordering};
use std::sync::{LazyLock, OnceLock};
use std::time::Instant;
use parking_lot::Mutex;

static BOOT_START_INSTANT: OnceLock<Instant> = OnceLock::new();
static BOOT_LOG_FILE: LazyLock<Mutex<Option<File>>> = LazyLock::new(|| Mutex::new(None));
static BOOT_COMPLETED: AtomicBool = AtomicBool::new(false);

pub fn get_boot_log_path() -> PathBuf {
    crate::system::config::get_config_dir().join("boot.log")
}

/// Initialize the Boot Trace system at the very beginning of main().
/// Cleans previous boot.log and starts the high-precision millisecond stopwatch.
pub fn init_boot_trace() {
    let start = Instant::now();
    let _ = BOOT_START_INSTANT.set(start);

    let path = get_boot_log_path();
    let file_res = OpenOptions::new()
        .create(true)
        .write(true)
        .truncate(true)
        .open(&path)
        .or_else(|_| OpenOptions::new().create(true).append(true).open(&path));

    if let Ok(mut f) = file_res {
        let now_str = chrono_or_fallback_now();
        let args: Vec<String> = std::env::args().collect();
        let pid = std::process::id();
        let current_exe = std::env::current_exe()
            .map(|p| p.to_string_lossy().to_string())
            .unwrap_or_else(|_| "unknown".to_string());

        let header = format!(
            "================================================================================\n\
             OpenRevo Boot Trace Log (Dedicated Startup Diagnostics)\n\
             Boot Time: {}\n\
             Binary:    {}\n\
             PID:       {}\n\
             Arguments: {:?}\n\
             ================================================================================\n",
            now_str, current_exe, pid, args
        );
        let _ = f.write_all(header.as_bytes());
        let _ = f.flush();
        *BOOT_LOG_FILE.lock() = Some(f);
    }

    boot_log("INIT", &format!("Boot stopwatch initialized (PID: {})", std::process::id()));
}

fn chrono_or_fallback_now() -> String {
    let now = std::time::SystemTime::now();
    let duration = now.duration_since(std::time::UNIX_EPOCH).unwrap_or_default();
    let secs = duration.as_secs();
    format!("UNIX Epoch: {}s", secs)
}

/// Record a boot milestone with relative millisecond timestamp.
/// Persisted immediately to boot.log with zero disk buffering.
pub fn boot_log(tag: &str, message: &str) {
    let start = BOOT_START_INSTANT.get_or_init(Instant::now);
    let elapsed = start.elapsed();
    let ms = elapsed.as_millis();

    let line = format!("[+{:>5}ms] [{:<8}] {}\n", ms, tag, message);

    // 1. Output to console
    print!("[BOOT] {}", line);

    // 2. Output to global logger
    crate::log_info!("BOOT", "[{}] {}", tag, message);

    // 3. Persist unconditionally to boot.log
    let mut guard = BOOT_LOG_FILE.lock();
    if let Some(ref mut f) = *guard {
        let _ = f.write_all(line.as_bytes());
        let _ = f.flush();
    } else {
        // Fallback open if init was bypassed
        let path = get_boot_log_path();
        if let Ok(mut f) = OpenOptions::new().create(true).append(true).open(path) {
            let _ = f.write_all(line.as_bytes());
            let _ = f.flush();
        }
    }
}

/// Execute a boot milestone scope, automatically recording its start, end, and duration.
pub fn boot_scope<T, F: FnOnce() -> T>(step_name: &str, f: F) -> T {
    boot_log("START", step_name);
    let start = Instant::now();
    let res = f();
    let duration = start.elapsed();
    boot_log("DONE", &format!("{} (took {}ms)", step_name, duration.as_millis()));
    res
}

/// Record that Tauri backend setup finished and main WebviewWindow was spawned.
pub fn record_stage0_ui_ready() {
    let total = BOOT_START_INSTANT.get().map(|s| s.elapsed().as_millis()).unwrap_or(0);
    boot_log(
        "STAGE0_OK",
        &format!("Stage 0 UI Ready: Main WebviewWindow positioned and spawned (+{}ms). Awaiting frontend DOM handshake...", total),
    );
}

/// Record that frontend React/Vue application mounted, executed first render, and established two-way IPC handshake.
#[tauri::command]
pub fn frontend_ready(app: tauri::AppHandle) -> Result<u128, String> {
    let total = BOOT_START_INSTANT.get().map(|s| s.elapsed().as_millis()).unwrap_or(0);
    boot_log(
        "FE_READY",
        &format!("Frontend DOM Mounted & Handshake Confirmed (+{}ms). WebView2 message loop fully responsive!", total),
    );
    mark_boot_completed();
    crate::system::webview_orchestrator::WebviewOrchestrator::global().notify_main_ready();

    // Diagnostics & Visibility Override: Auto-reveal main window only if explicitly requested
    // via CLI argument (--visible / --show) or persistent config.json ("launch_visible": true).
    let args: Vec<String> = std::env::args().collect();
    let cli_visible = args.iter().any(|a| a == "--visible" || a == "--show");
    let cfg = crate::system::config::load_config();
    let should_reveal = cli_visible || cfg.launch_visible;

    if should_reveal {
        if let Some(window) = app.get_webview_window("main") {
            crate::log_info!("BOOT", "Diagnostic auto-reveal triggered (CLI --visible or config.json launch_visible): revealing main window");
            crate::system::window::restore_and_sync_window(&window);
        }
    }

    Ok(total)
}

/// Record asynchronous GPU cold-probe completion with precise duration.
pub fn record_gpu_probe_milestone(name: &str, base_w: u16, max_w: u16, duration_ms: u128) {
    boot_log(
        "GPU_DONE",
        &format!("Async GPU Cold Probe Completed in {}ms: {} (Base: {}W, Max: {}W)", duration_ms, name, base_w, max_w),
    );
}

/// Mark boot sequence completed and Tauri event loop active.
pub fn mark_boot_completed() {
    BOOT_COMPLETED.store(true, Ordering::SeqCst);
    let total = BOOT_START_INSTANT.get().map(|s| s.elapsed().as_millis()).unwrap_or(0);
    boot_log(
        "BOOT_OK",
        &format!("=== All Boot Tasks Finished in {}ms! Full System Operational. ===", total),
    );
}

/// Check if boot sequence has completed
pub fn is_boot_completed() -> bool {
    BOOT_COMPLETED.load(Ordering::Relaxed)
}

/// Retrieve the current boot log contents for frontend diagnostics view
#[tauri::command]
pub fn get_boot_log() -> Result<String, String> {
    let path = get_boot_log_path();
    std::fs::read_to_string(&path).map_err(|e| format!("Failed to read boot log: {}", e))
}
