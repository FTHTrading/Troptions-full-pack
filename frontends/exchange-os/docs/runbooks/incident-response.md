# Incident Response Runbook

## Drill Catalog
- audit-chain-tamper
- production-lockdown
- key-compromise
- failed-release-gate
- database-restore
- backup-missing
- unauthorized-approval-attempt

## Execute Drill
```bash
node scripts/run-incident-drill.mjs <drill-id>
```

## Incident Workflow
1. Detect and classify severity.
2. Contain and preserve evidence.
3. Escalate according to policy.
4. Recover service state.
5. Complete post-incident review.
