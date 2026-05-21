# Control Hub Integration

**Document**: TSN Governance Series
**Status**: Architecture design — Rust ↔ TypeScript bridge specification

---

## Overview

The Troptions Control Hub is the AI-governed approval and audit layer that governs all state changes in the Troptions ecosystem. It is currently implemented in TypeScript (Next.js + better-sqlite3) and governs the XRPL/Stellar simulation layer, wallet forensics, and all regulatory operations.

The TSN Rust Layer-1 integrates with the Control Hub through the `tsn-control-hub` crate, which serializes task records, simulation records, approval records, blocked-action records, audit records, and recommendations in a format compatible with the TypeScript persistence model.

---

## Control Hub Actors

| Actor | Role | Authority |
|---|---|---|
| **Clawd** | Primary AI governance engine | Highest — can block or authorize any operation |
| **OpenClaw** | Secondary AI reviewer | High — reviews compliance decisions |
| **Jefe** | Oversight and escalation | Escalation path — final decision authority |

---

## TypeScript Persistence Model

The existing TypeScript Control Hub persists the following record types to `data/troptions-control-plane/control-plane.db`:

- **Task records** — `{ taskId, type, status, inputs, outputs, createdAt, updatedAt }`
- **Simulation records** — `{ simulationId, taskId, simulationType, assetId, inputs, outputs, simulationOnly }`
- **Approval records** — `{ approvalId, taskId, requiredAction, status, decidedBy, decidedAt }`
- **Blocked action records** — `{ blockedId, taskId, blockedAction, reason, timestamp }`
- **Audit records** — `{ auditId, eventType, actor, summary, metadata, timestamp }`
- **Recommendations** — `{ recId, taskId, recommendation, priority, generatedAt }`

---

## Rust `tsn-control-hub` Crate

The `tsn-control-hub` crate provides Rust-side serialization compatible with the TypeScript model:

```rust
pub struct ControlHubTask {
    pub task_id: String,         // UUID string — matches TypeScript taskId
    pub task_type: String,
    pub status: TaskStatus,
    pub inputs: serde_json::Value,
    pub outputs: serde_json::Value,
    pub simulation_only: bool,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
}

pub struct ControlHubSimulation {
    pub simulation_id: String,
    pub task_id: String,
    pub simulation_type: String,
    pub asset_id: String,
    pub inputs: serde_json::Value,
    pub outputs: serde_json::Value,
    pub simulation_only: bool,   // Always true in scaffold
}

pub struct ControlHubApproval {
    pub approval_id: String,
    pub task_id: String,
    pub required_action: String,
    pub status: ApprovalStatus,
    pub decided_by: Option<String>,
    pub decided_at: Option<DateTime<Utc>>,
}

pub struct ControlHubBlockedAction {
    pub blocked_id: String,
    pub task_id: String,
    pub blocked_action: String,
    pub reason: String,
    pub timestamp: DateTime<Utc>,
}

pub struct ControlHubAuditRecord {
    pub audit_id: String,
    pub event_type: String,
    pub actor: String,
    pub summary: String,
    pub metadata: serde_json::Value,
    pub simulation_only: bool,
    pub timestamp: DateTime<Utc>,
}
```

---

## Integration Flow

```
Rust TSN Operation
      │
      ▼
tsn-compliance TCSA evaluation
      │
      ▼
tsn-control-hub: create_task_record()
      │
      ▼
Serialize to JSON (compatible with TypeScript schema)
      │
      ▼
POST /api/control-hub/task (TypeScript endpoint)
      │  OR
      │ Write to shared SQLite DB
      │  OR
      │ Queue for async ingestion
      ▼
TypeScript Control Hub persists
      │
      ▼
Clawd/OpenClaw/Jefe reviews
      │
      ▼
Approval granted → tsn returns GovernanceDecision { allowed: false, simulation_only: true }
      │
      ▼
No live execution — all governance decisions feed back to simulation records
```

---

## Governance Decision Compatibility

The `GovernanceDecision` type in both TypeScript and Rust uses the same shape:

```typescript
// TypeScript
interface CrossRailGovernanceDecision {
  taskId: string;
  auditRecordId: string;
  persisted: boolean;
  allowed: false;
  simulationOnly: true;
  blockedActions: string[];
  requiredApprovals: string[];
  complianceChecks: string[];
  auditHint: string;
}
```

```rust
// Rust
pub struct GovernanceDecision {
    pub task_id: String,
    pub audit_record_id: String,
    pub allowed: bool,           // Always false
    pub simulation_only: bool,   // Always true
    pub blocked_actions: Vec<String>,
    pub required_approvals: Vec<String>,
    pub compliance_checks: Vec<String>,
    pub audit_hint: String,
    pub decided_at: DateTime<Utc>,
}
```

The field names use `snake_case` in Rust with `#[serde(rename_all = "camelCase")]` for JSON compatibility with TypeScript.

---

## Audit Trail Guarantee

Every Rust-side operation that produces a `GovernanceDecision` must:
1. Emit an `AuditEvent` with `simulation_only: true`
2. Record a `ControlHubTask` with inputs and outputs
3. Record a `ControlHubSimulation` with full simulation context
4. Record at least one `ControlHubBlockedAction` (since all operations are blocked in simulation)
5. Record a `ControlHubApproval` requirement

This ensures the TypeScript Control Hub has full visibility into all Rust-side operations.

---

## Engineering Next Steps

1. Complete `tsn-control-hub` serialization functions
2. Build HTTP client for TypeScript Control Hub API (optional — can use file-based bridge initially)
3. Design shared SQLite schema that both TypeScript and Rust can read/write
4. Build audit record streaming from Rust devnet to TypeScript dashboard
5. Test round-trip serialization compatibility (JSON schema parity)
