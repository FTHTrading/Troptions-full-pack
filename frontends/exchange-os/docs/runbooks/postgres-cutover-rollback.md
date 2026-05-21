# Postgres Cutover and Rollback Drill Runbook

## Goal
Provide a repeatable process to cut over control-plane state to Postgres, validate readiness, run rollback drills, and capture recovery timing evidence.

## Prerequisites
- `DATABASE_URL` set to the target Postgres instance.
- `TROPTIONS_DB_ADAPTER=postgres` for Postgres-mode validation.
- Current SQLite backup available.

## Cutover
```bash
npm run cutover:postgres
```

## Cutover Verification
```bash
npm run cutover:postgres -- --verify-only
npm run check:postgres
npm run validate:env
npm run smoke:prod
```

## Rollback Drill
```bash
npm run rollback:drill
```

Expected result:
- `rollbackVerified: true`
- non-zero `restoreElapsedMs` and `totalElapsedMs`

## Recovery Timing Capture
```bash
npm run recovery:timing -- --runs=5
```

This writes a report under `data/observability/recovery-timing-*.json` with min/p50/p95/avg timing.

## Emergency Rollback
1. Set `TROPTIONS_DB_ADAPTER=sqlite`.
2. Restore latest SQLite backup:
```bash
npm run restore:control-plane -- data/backups/<backup-file>.db
```
3. Re-run:
```bash
npm run validate:env
npm run typecheck
npm test
npm run smoke:prod
```
