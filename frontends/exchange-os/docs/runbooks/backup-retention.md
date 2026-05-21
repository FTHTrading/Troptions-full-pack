# Backup Retention Runbook

## Policy
- Daily backups: 30 days
- Weekly backups: 12 weeks
- Monthly backups: 12 months

## Rotate
```bash
node scripts/rotate-backups.mjs
```

## Freshness SLA
- Latest backup should be <= 36 hours old.
- If stale, escalate to L2 compliance/security.

## Validation
- Confirm retained backup count after rotation.
- Verify restore sample quarterly.
