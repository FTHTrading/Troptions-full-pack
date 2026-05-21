# Control Hub Persistence — Codebase Audit

**Date:** 2025-07-18  
**Sprint:** `feat(control-hub): add persistent governance state storage`

---

## 1. Existing Database Infrastructure

### 1.1 Primary SQLite store — `src/lib/troptions/db.ts`

- Driver: `better-sqlite3` (synchronous)
- Path: `data/troptions-control-plane/control-plane.db`
- WAL mode, NORMAL synchronous
- Singleton via module-level `let db: Database.Database | null = null`
- `initSchema(database)` creates all tables on first connection
- Helper exports: `getControlPlaneDb()`, `loadStateFromDb<T>()`, `saveStateToDb<T>()`, `upsertUserAccount()`, `getIdempotencyRecord()`, `saveIdempotencyRecord()`, `consumeRateLimit()`, `insertMetric()`
- **Tables (existing):**
  - `control_plane_state` (key/value blob store)
  - `control_plane_users`
  - `control_plane_idempotency`
  - `control_plane_rate_limit`
  - `control_plane_metrics`

### 1.2 Adapter layer — `src/lib/troptions/databaseAdapter.ts`

- Selects `postgres` when `TROPTIONS_DB_ADAPTER=postgres` AND `DATABASE_URL` is non-empty
- Falls back to `sqlite` otherwise
- `StateDatabaseAdapter` interface: `type`, `isConfigured()`, `healthCheck()`
- `getDatabaseAdapter()` / `resetDatabaseAdapterForTests()`
- Used primarily for health checks, not direct data access

### 1.3 SQLite adapter — `src/lib/troptions/sqliteAdapter.ts`

- Wraps `getControlPlaneDb()` as a `StateDatabaseAdapter`
- `isConfigured()` always returns `true`

### 1.4 Postgres adapter — `src/lib/troptions/postgresAdapter.ts`

- Uses `pg` Pool pointed at `process.env.DATABASE_URL`
- Creates `control_plane_state` table in Postgres (mirrors SQLite)
- `isConfigured()` returns `false` when `DATABASE_URL` absent → safe health fail

### 1.5 Durable observability store — `src/lib/troptions/durableObservabilityStore.ts`

- Postgres-only durable layer for structured logs, metrics, escalations, incident drills
- `isDurableObservabilityEnabled()` guards all writes
- `ensureSchema()` creates tables on first use
- Pattern to follow for the Control Hub durable store

### 1.6 Migration script — `scripts/migrate-sqlite-to-postgres.mjs`

- Migrates `control_plane_state` rows from SQLite → Postgres
- `buildMigrationPlan()` (importable, used in tests)
- Supports `--dry-run` flag
- Uses `better-sqlite3` + `pg` Pool (pure ESM)

---

## 2. Environment Variables

| Variable              | Purpose                                | Required for Postgres |
|-----------------------|----------------------------------------|-----------------------|
| `TROPTIONS_DB_ADAPTER`| `"postgres"` or `"sqlite"` (default)  | Yes                   |
| `DATABASE_URL`        | Postgres connection string             | Yes                   |

---

## 3. Packages Available

| Package         | Available | Notes                                  |
|-----------------|-----------|----------------------------------------|
| `better-sqlite3`| ✅        | Already in `package.json`, used in `db.ts` |
| `pg`            | ✅        | Already in `package.json`, used in Postgres adapter |

---

## 4. Existing Tables — NOT to modify

All existing tables and their helper functions must remain unchanged to preserve
the 314 passing tests.

---

## 5. New Tables to Add

The following tables will be added to `initSchema()` in `db.ts` and mirrored in
the Postgres durable store:

| Table                           | Purpose                                          |
|---------------------------------|--------------------------------------------------|
| `control_hub_tasks`             | One record per governed intent evaluation        |
| `control_hub_simulations`       | Full simulation JSON per task                    |
| `control_hub_approvals`         | Approval requirements per task                   |
| `control_hub_audit_entries`     | Immutable audit trail                            |
| `control_hub_blocked_actions`   | Each blocked capability per task                 |
| `control_hub_recommendations`   | Future: advisory signals per task                |

---

## 6. Test Compatibility Notes

- Tests run with `testEnvironment: "node"` via `ts-jest`
- `better-sqlite3` works synchronously in test env — SQLite file is created at
  `data/troptions-control-plane/control-plane.db` during tests
- Postgres is never called in tests (no `DATABASE_URL` in test env)
- Existing `controlHub.test.ts` (37 tests) must continue to pass unchanged
- New tests will extend or create a parallel test file

---

## 7. Gaps Identified

1. No Control Hub-specific tables exist yet → will be added
2. No `taskId` / `persisted` / `auditRecordId` fields in govern route response → will be added
3. No read-only state endpoints at `/api/troptions/control-hub/` → will be created
4. `ControlHubPanel` does not display persisted state summary → will be extended
5. No migration script for new tables → will be added alongside existing migration

---

*Audit complete. Proceed to Phase 2 — State Type Model.*
