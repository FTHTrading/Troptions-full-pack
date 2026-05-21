# Postgres Migration Runbook

## Goal
Move control-plane state from SQLite to Postgres with a reversible path.

## Prerequisites
- Set `DATABASE_URL` to target Postgres.
- Keep latest SQLite backup before migration.

## Dry Run
```bash
node scripts/migrate-sqlite-to-postgres.mjs --dry-run
```

## Execute
```bash
node scripts/migrate-sqlite-to-postgres.mjs
```

## Execute Full Cutover
```bash
node scripts/cutover-control-plane-to-postgres.mjs
```

## Verify Cutover
```bash
node scripts/cutover-control-plane-to-postgres.mjs --verify-only
node scripts/check-postgres-connection.mjs
```

## Validate
```bash
node scripts/check-postgres-connection.mjs
npm run validate:env
npm run build
```

## Rollback
1. Set `TROPTIONS_DB_ADAPTER=sqlite`.
2. Restore SQLite using Phase 8 restore runbook.
3. Re-run readiness checks.
