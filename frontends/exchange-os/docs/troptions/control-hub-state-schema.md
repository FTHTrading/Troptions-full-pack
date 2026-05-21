# Control Hub State Schema

**DB file (SQLite)**: `data/troptions-control-plane/control-plane.db`  
**WAL mode**: enabled — allows concurrent reads during writes.  
**Synchronous**: NORMAL — safe balance between durability and write speed.

---

## Table: `control_hub_tasks`

Represents one govern intent evaluation request.

| Column | Type | Notes |
|---|---|---|
| `id` | TEXT PRIMARY KEY | Format: `cht-{uuid}` |
| `intent` | TEXT NOT NULL | Raw intent string from caller |
| `status` | TEXT NOT NULL | See task statuses below |
| `audit_token` | TEXT NOT NULL | Token from `evaluateClawdIntent()`, format `ctrl-*` |
| `routed_to` | TEXT NOT NULL | JSON array of agent names, e.g. `["clawd","jefe"]` |
| `requires_approval` | INTEGER NOT NULL | `1` = true, `0` = false |
| `created_at` | TEXT NOT NULL | ISO 8601 date string |
| `updated_at` | TEXT NOT NULL | ISO 8601 date string (mirrors `created_at` on insert) |

### Task Statuses

| Value | Meaning |
|---|---|
| `requested` | Received, not yet evaluated |
| `simulated` | Evaluated, allowed, no approval needed |
| `blocked` | At least one capability was blocked |
| `needs_approval` | `requiresApproval === true` |
| `approved_not_executed` | Approved but execution not triggered (future use) |
| `queued` | Queued for deferred execution (future use) |
| `executed` | Executed (unreachable from current govern route — simulation-only) |
| `failed` | Evaluation or persistence failure |
| `audited` | Completed audit pass |

---

## Table: `control_hub_simulations`

Full JSON snapshot of each governance evaluation.

| Column | Type | Notes |
|---|---|---|
| `id` | TEXT PRIMARY KEY | Format: `chs-{uuid}` |
| `task_id` | TEXT NOT NULL | FK → `control_hub_tasks.id` |
| `simulation_json` | TEXT NOT NULL | Serialized `GovernedPlan` object |
| `created_at` | TEXT NOT NULL | ISO 8601 |

---

## Table: `control_hub_approvals`

Approval requirements created when `requiresApproval === true`.

| Column | Type | Notes |
|---|---|---|
| `id` | TEXT PRIMARY KEY | Format: `cha-{uuid}` |
| `task_id` | TEXT NOT NULL | FK → `control_hub_tasks.id` |
| `required_for` | TEXT NOT NULL | Description of what requires approval |
| `status` | TEXT NOT NULL | `pending` \| `approved` \| `rejected` \| `expired` |
| `created_at` | TEXT NOT NULL | ISO 8601 |
| `updated_at` | TEXT NOT NULL | ISO 8601 |

---

## Table: `control_hub_audit_entries`

Immutable audit log of every governance evaluation.

| Column | Type | Notes |
|---|---|---|
| `id` | TEXT PRIMARY KEY | Format: `cau-{uuid}` |
| `task_id` | TEXT NOT NULL | FK → `control_hub_tasks.id` |
| `audit_token` | TEXT NOT NULL | Matches `auditToken` in task + govern response |
| `intent` | TEXT NOT NULL | Original intent string |
| `action_type` | TEXT NOT NULL | e.g. `govern-intent-evaluation` |
| `outcome` | TEXT NOT NULL | Task status at point of audit |
| `blocked_count` | INTEGER NOT NULL | Number of capabilities blocked |
| `requires_approval` | INTEGER NOT NULL | `1` = true, `0` = false |
| `created_at` | TEXT NOT NULL | ISO 8601 |

---

## Table: `control_hub_blocked_actions`

One row per blocked capability per evaluation.

| Column | Type | Notes |
|---|---|---|
| `id` | TEXT PRIMARY KEY | Format: `chb-{uuid}` |
| `task_id` | TEXT NOT NULL | FK → `control_hub_tasks.id` |
| `capability_id` | TEXT NOT NULL | Capability slug, e.g. `approve-transaction` |
| `reason` | TEXT NOT NULL | Human-readable reason from governance policy |
| `created_at` | TEXT NOT NULL | ISO 8601 |

---

## Table: `control_hub_recommendations`

Policy or operational recommendations linked to a task.

| Column | Type | Notes |
|---|---|---|
| `id` | TEXT PRIMARY KEY | Format: `chr-{uuid}` |
| `task_id` | TEXT | FK → `control_hub_tasks.id` (nullable) |
| `recommendation` | TEXT NOT NULL | Recommendation text |
| `priority` | TEXT NOT NULL | `low` \| `medium` \| `high` \| `critical` |
| `created_at` | TEXT NOT NULL | ISO 8601 |

---

## ID Prefix Reference

| Prefix | Table |
|---|---|
| `cht-` | `control_hub_tasks` |
| `chs-` | `control_hub_simulations` |
| `cha-` | `control_hub_approvals` |
| `cau-` | `control_hub_audit_entries` |
| `chb-` | `control_hub_blocked_actions` |
| `chr-` | `control_hub_recommendations` |

---

## Notes on JSON fields

`routed_to` in `control_hub_tasks` is stored as a JSON string (`JSON.stringify` on write,
`JSON.parse` on read). This keeps the schema flat while preserving array semantics for
the `ControlHubTaskRecord.routedTo: string[]` TypeScript field.

`simulation_json` in `control_hub_simulations` stores the complete `GovernedPlan` object
serialized with `JSON.stringify`. No separate FK columns are needed for governed plan
fields because the simulation is treated as an immutable snapshot.
