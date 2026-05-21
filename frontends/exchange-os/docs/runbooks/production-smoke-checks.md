# Production Smoke Checks Runbook

## API/Control Checks
- `/api/health/live` passes
- `/api/health/ready` passes
- env validation passes
- DB adapter health passes
- audit-chain verification passes
- release gates evaluate
- auth rejects missing token
- auth accepts valid staging test token only
- idempotency replay works
- audit export signs snapshot
- backup freshness acceptable

## Script
```bash
node scripts/run-production-smoke-checks.mjs
```

## Failure Handling
1. Mark deployment as blocked.
2. Open incident and escalate.
3. Re-run checks only after remediation.
