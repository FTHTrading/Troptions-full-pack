# Control Hub PostgreSQL Cutover Guide

## Why Postgres is Required for Production

Vercel (serverless + edge) does not have a persistent filesystem between invocations.
SQLite writes to disk at `data/troptions-control-plane/control-plane.db`.  On Vercel,
this path is ephemeral — data written in one invocation is NOT visible to the next.

Result: **SQLite mode works for local development and tests only.**  
In production (Vercel), all Control Hub state would be lost between requests.

PostgreSQL runs as a durable external service (e.g. Neon, Supabase, Railway, or AWS RDS)
and is the correct storage layer for production persistence.

---

## Configuration

### Environment Variables

| Variable | Required for Postgres | Description |
|---|---|---|
| `TROPTIONS_DB_ADAPTER` | Yes — set to `postgres` | Activates Postgres mode |
| `DATABASE_URL` | Yes | Postgres connection string (`postgresql://user:pass@host/db`) |

If `TROPTIONS_DB_ADAPTER` is missing or not `postgres`, SQLite is used regardless of
whether `DATABASE_URL` is present.

### Vercel Dashboard Setup

1. Go to `vercel.com → Project → Settings → Environment Variables`
2. Add:
   - `TROPTIONS_DB_ADAPTER` = `postgres`
   - `DATABASE_URL` = `postgresql://<user>:<password>@<host>/<database>?sslmode=require`
3. Redeploy the project.

---

## Current Postgres Schema Support

The existing `postgresAdapter.ts` creates a `control_plane_state` table (key/value store).
The existing `durableObservabilityStore.ts` creates `control_plane_structured_logs`,
`control_plane_metrics_events`, `control_plane_escalations`, `control_plane_incident_drills`.

**The 6 new Control Hub tables are currently SQLite-only.**  
When Postgres is configured, `getControlPlaneDb()` still returns the SQLite DB — the
Control Hub store always uses SQLite as its primary path.

For a full Postgres-backed Control Hub, a Postgres migration needs to be added.
See the migration script reference below.

---

## Migration Script (SQLite → Postgres for Control Hub)

The existing `scripts/migrate-sqlite-to-postgres.mjs` handles the `control_plane_state`
table. A new script is needed for the 6 Control Hub tables.

Recommended path: `scripts/migrate-control-hub-to-postgres.mjs`

```bash
# Dry run (no writes)
node scripts/migrate-control-hub-to-postgres.mjs --dry-run

# Live migration
DATABASE_URL="postgresql://..." node scripts/migrate-control-hub-to-postgres.mjs
```

The script should:
1. Read all rows from each of the 6 SQLite tables
2. `CREATE TABLE IF NOT EXISTS` the corresponding Postgres tables with equivalent schema
3. `INSERT ON CONFLICT DO NOTHING` each row
4. Log counts migrated per table

---

## Adapter Extension Plan

To make the Control Hub store Postgres-aware:

1. Extend `controlHubStateStore.ts` to call `resolveDatabaseAdapterType()` at the top
   of each function.
2. If `postgres`, delegate to a `controlHubPostgresStore.ts` (using `pg.Pool`).
3. If `sqlite`, use the existing synchronous `getControlPlaneDb()` path.

This dual-path pattern matches how `durableObservabilityStore.ts` is structured.

---

## Current Health Check

```bash
# SQLite mode (local default)
GET http://localhost:8889/api/troptions/control-hub/state

# Expected:
{
  "ok": true,
  "snapshot": {
    "persistenceMode": "sqlite",
    "totalTasks": N,
    ...
  }
}
```

When `TROPTIONS_DB_ADAPTER=postgres` and `DATABASE_URL` is valid:
- `snapshot.persistenceMode` returns `"postgres"`
- State is read/written from Postgres

---

## Known Limitations

- Vercel `/api/health/ready` returns 503 when `DATABASE_URL` is missing — this is expected
  and documented in the deployment notes. The health check reflects Postgres readiness.
- SQLite DB file is gitignored (`data/troptions-control-plane/` is in `.gitignore`).
- SQLite in test env creates the DB file on disk — this is intentional and correct.
