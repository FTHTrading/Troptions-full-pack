# SQLite Backup and Restore Runbook

## Backup
Run:

```bash
npm run backup:control-plane
```

This creates a timestamped backup under `data/backups/` and copies sidecar WAL/SHM files when present.

## Restore
Run:

```bash
npm run restore:control-plane -- data/backups/control-plane-YYYY-MM-DDTHH-MM-SS-msZ.db
```

This replaces the active database and optional sidecar files.

## Safety Procedure
1. Enable deployment lockdown before restore.
2. Disable control-plane writes.
3. Stop active write traffic.
4. Restore backup.
5. Verify `/api/health/ready` returns ready.
6. Re-enable writes after validation.

## Validation After Restore
- Control-plane read endpoints are healthy.
- Signed audit export remains functional.
- No schema errors in logs.
