//! TSN Telemetry — structured trace/event emission with in-process ring buffer.
//! Thread-safe via `std::sync::Mutex` + `OnceLock`. No external log crate required.
//! All subsystems in simulation mode route traces through this module.

use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use std::sync::{Mutex, OnceLock};
use uuid::Uuid;

// ─── Trace level ─────────────────────────────────────────────────────────────

#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "UPPERCASE")]
pub enum TraceLevel {
    Debug,
    Info,
    Warn,
    Error,
}

// ─── Trace event ─────────────────────────────────────────────────────────────

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct TraceEvent {
    pub id: Uuid,
    pub level: TraceLevel,
    pub subsystem: String,
    pub message: String,
    pub payload: serde_json::Value,
    pub simulation_only: bool,
    pub emitted_at: DateTime<Utc>,
}

impl TraceEvent {
    pub fn new(
        level: TraceLevel,
        subsystem: &str,
        message: &str,
        payload: serde_json::Value,
    ) -> Self {
        TraceEvent {
            id: Uuid::new_v4(),
            level,
            subsystem: subsystem.to_string(),
            message: message.to_string(),
            payload,
            simulation_only: true,
            emitted_at: Utc::now(),
        }
    }
}

// ─── Ring buffer ─────────────────────────────────────────────────────────────

pub struct TelemetryBuffer {
    events: Vec<TraceEvent>,
    capacity: usize,
}

impl TelemetryBuffer {
    pub fn new(capacity: usize) -> Self {
        TelemetryBuffer {
            events: Vec::with_capacity(capacity),
            capacity,
        }
    }

    /// Push an event; evicts the oldest entry when at capacity.
    pub fn push(&mut self, event: TraceEvent) {
        if self.events.len() >= self.capacity {
            self.events.remove(0);
        }
        self.events.push(event);
    }

    pub fn events(&self) -> &[TraceEvent] {
        &self.events
    }

    pub fn len(&self) -> usize {
        self.events.len()
    }

    pub fn is_empty(&self) -> bool {
        self.events.is_empty()
    }

    /// Drain all events and return them.
    pub fn drain(&mut self) -> Vec<TraceEvent> {
        std::mem::take(&mut self.events)
    }

    /// Return the `n` most recent events.
    pub fn tail(&self, n: usize) -> &[TraceEvent] {
        let start = self.events.len().saturating_sub(n);
        &self.events[start..]
    }
}

// ─── Global buffer (process-scoped singleton) ────────────────────────────────

fn global_buffer() -> &'static Mutex<TelemetryBuffer> {
    static BUFFER: OnceLock<Mutex<TelemetryBuffer>> = OnceLock::new();
    BUFFER.get_or_init(|| Mutex::new(TelemetryBuffer::new(1024)))
}

// ─── Public API ───────────────────────────────────────────────────────────────

/// Emit a structured trace event to the global ring buffer.
pub fn emit(level: TraceLevel, subsystem: &str, message: &str, payload: serde_json::Value) {
    let event = TraceEvent::new(level, subsystem, message, payload);
    if let Ok(mut buf) = global_buffer().lock() {
        buf.push(event);
    }
}

/// Convenience — emit at INFO level.
pub fn info(subsystem: &str, message: &str) {
    emit(TraceLevel::Info, subsystem, message, serde_json::Value::Null);
}

/// Convenience — emit at WARN level.
pub fn warn(subsystem: &str, message: &str) {
    emit(TraceLevel::Warn, subsystem, message, serde_json::Value::Null);
}

/// Convenience — emit at ERROR level.
pub fn error(subsystem: &str, message: &str) {
    emit(TraceLevel::Error, subsystem, message, serde_json::Value::Null);
}

/// Return a snapshot of the `n` most recent events.
pub fn tail(n: usize) -> Vec<TraceEvent> {
    global_buffer()
        .lock()
        .map(|buf| buf.tail(n).to_vec())
        .unwrap_or_default()
}

/// Return total events currently in buffer.
pub fn buffer_len() -> usize {
    global_buffer()
        .lock()
        .map(|buf| buf.len())
        .unwrap_or(0)
}

/// Legacy stub — kept for compatibility, delegates to `emit`.
pub fn emit_placeholder(event: &str) {
    info("tsn_telemetry", event);
}

// ─── Tests ────────────────────────────────────────────────────────────────────

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn trace_event_fields_are_populated() {
        let event = TraceEvent::new(
            TraceLevel::Info,
            "test_subsystem",
            "hello from tests",
            serde_json::json!({ "key": "value" }),
        );
        assert_eq!(event.subsystem, "test_subsystem");
        assert_eq!(event.message, "hello from tests");
        assert!(event.simulation_only);
        assert_eq!(event.level, TraceLevel::Info);
    }

    #[test]
    fn buffer_push_and_len() {
        let mut buf = TelemetryBuffer::new(4);
        assert!(buf.is_empty());
        buf.push(TraceEvent::new(TraceLevel::Debug, "a", "m1", serde_json::Value::Null));
        buf.push(TraceEvent::new(TraceLevel::Info, "b", "m2", serde_json::Value::Null));
        assert_eq!(buf.len(), 2);
    }

    #[test]
    fn buffer_evicts_oldest_at_capacity() {
        let mut buf = TelemetryBuffer::new(3);
        buf.push(TraceEvent::new(TraceLevel::Info, "s", "first", serde_json::Value::Null));
        buf.push(TraceEvent::new(TraceLevel::Info, "s", "second", serde_json::Value::Null));
        buf.push(TraceEvent::new(TraceLevel::Info, "s", "third", serde_json::Value::Null));
        // at capacity — pushing one more should evict "first"
        buf.push(TraceEvent::new(TraceLevel::Info, "s", "fourth", serde_json::Value::Null));
        assert_eq!(buf.len(), 3);
        assert_eq!(buf.events()[0].message, "second");
        assert_eq!(buf.events()[2].message, "fourth");
    }

    #[test]
    fn buffer_tail_returns_most_recent() {
        let mut buf = TelemetryBuffer::new(10);
        for i in 0..5 {
            buf.push(TraceEvent::new(
                TraceLevel::Info,
                "s",
                &format!("event-{}", i),
                serde_json::Value::Null,
            ));
        }
        let tail = buf.tail(2);
        assert_eq!(tail.len(), 2);
        assert_eq!(tail[0].message, "event-3");
        assert_eq!(tail[1].message, "event-4");
    }

    #[test]
    fn buffer_drain_clears_events() {
        let mut buf = TelemetryBuffer::new(10);
        buf.push(TraceEvent::new(TraceLevel::Warn, "s", "x", serde_json::Value::Null));
        let drained = buf.drain();
        assert_eq!(drained.len(), 1);
        assert!(buf.is_empty());
    }

    #[test]
    fn global_emit_and_tail() {
        // Emit a uniquely-named event and verify it ends up in the global tail.
        emit(
            TraceLevel::Info,
            "tsn_test",
            "global_emit_test_marker",
            serde_json::json!({ "test": true }),
        );
        let recent = tail(32);
        assert!(
            recent.iter().any(|e| e.message == "global_emit_test_marker"),
            "emitted event not found in tail"
        );
    }

    #[test]
    fn emit_placeholder_does_not_panic() {
        emit_placeholder("compat_test_event");
    }
}
