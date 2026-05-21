# Control Hub Persistence Architecture

**Sprint**: `feat(control-hub): add persistent governance state storage`  
**Status**: Implemented

---

## Overview

The Control Hub Persistence layer adds stateful storage to the governed Clawd integration.
Before this sprint, the `POST /api/troptions/clawd/govern` route was stateless — it evaluated
governance rules and returned results without retaining any record of the evaluation.

After this sprint, every `govern` call:
1. Persists a **task record** (intent + status + routing metadata)
2. Persists a **simulation record** (full JSON snapshot of the evaluation)
3. Persists one **blocked action record** per blocked capability
4. Persists an **approval record** if `requiresApproval === true`
5. Persists an **audit entry** with the outcome, blockedCount, and auditToken

These records are readable through 4 new read-only API routes and visualized on the
Control Hub admin dashboard.

---

## Simulation-Only Guarantee

**This layer ONLY records. It NEVER enables execution.**

The `simulationOnly: true` field is set by `evaluateClawdIntent()` and passed through
unchanged. No amount of persistence state can flip that to `false`. Persistence is
non-blocking: if the SQLite write fails, the governance result is still returned with
`persisted: false` — the route does not error out.

Execution would require:
- A separate execution engine (not implemented)
- Human approval record in `control_hub_approvals` (approval-gate preserved)
- Explicit action by an authorized human (not automatable by this layer)

---

## Adapter Pattern

```
TROPTIONS_DB_ADAPTER=postgres + DATABASE_URL set
  └─→ PostgreSQL (durable, horizontally scalable, Vercel-compatible)

TROPTIONS_DB_ADAPTER=sqlite (default) OR DATABASE_URL missing
  └─→ SQLite via better-sqlite3 (local, ephemeral on Vercel)
```

The Control Hub store always uses `getControlPlaneDb()` (SQLite synchronous singleton).
The `resolveDatabaseAdapterType()` function is called only in `getControlHubStateSnapshot()`
to set the `persistenceMode` field on the snapshot response — for informational purposes.

For production Vercel deployments, set `TROPTIONS_DB_ADAPTER=postgres` and `DATABASE_URL`.
See `control-hub-postgres-cutover.md`.

---

## Data Flow on a Govern Request

```
POST /api/troptions/clawd/govern
  │
  ├─ guardControlPlaneRequest()        ← auth + idempotency enforcement
  ├─ evaluateClawdIntent(intent)       ← pure governance evaluation
  │
  └─ [persist block — try/catch]
       ├─ createTaskRecord()           → control_hub_tasks
       ├─ createSimulationRecord()     → control_hub_simulations
       ├─ [if blocked] ×N createBlockedActionRecord()
                                       → control_hub_blocked_actions
       ├─ [if requiresApproval] createApprovalRecord()
                                       → control_hub_approvals (status: pending)
       └─ createAuditRecord()         → control_hub_audit_entries
  │
  └─ Response: { ...governed, taskId, persisted, auditRecordId }
```

---

## Read Routes

| Route | Method | Auth | Description |
|---|---|---|---|
| `/api/troptions/control-hub/state` | GET | Bearer | Full state snapshot (counts + persistenceMode) |
| `/api/troptions/control-hub/tasks` | GET | Bearer | Task records list (paginated, `?limit=N`) |
| `/api/troptions/control-hub/audit` | GET | Bearer | Audit entries list (paginated) |
| `/api/troptions/control-hub/recommendations` | GET | Bearer | Recommendations list (paginated) |

All routes use `guardPortalRead()` from `portalApiGuards.ts`.

---

## Files Added or Modified

| File | Change |
|---|---|
| `src/lib/troptions/controlHubStateTypes.ts` | New — all TypeScript types |
| `src/lib/troptions/controlHubStateStore.ts` | New — CRUD + snapshot |
| `src/lib/troptions/db.ts` | Modified — 6 new tables in `initSchema()` |
| `src/app/api/troptions/clawd/govern/route.ts` | Modified — persistence wiring |
| `src/app/api/troptions/control-hub/state/route.ts` | New |
| `src/app/api/troptions/control-hub/tasks/route.ts` | New |
| `src/app/api/troptions/control-hub/audit/route.ts` | New |
| `src/app/api/troptions/control-hub/recommendations/route.ts` | New |
| `src/components/troptions/ControlHubPanel.tsx` | Modified — PersistenceStateSection |
| `src/app/admin/troptions/control-hub/page.tsx` | Modified — passes snapshot prop |
| `src/__tests__/troptions/controlHubPersistence.test.ts` | New — 30+ tests |
