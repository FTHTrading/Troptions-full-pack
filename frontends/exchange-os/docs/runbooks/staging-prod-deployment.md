# Staging and Production Deployment Runbook

## Objective
Deploy Troptions safely to staging and production with policy gates, environment validation, and rollback discipline.

## Prerequisites
- Green CI on commit (`lint`, `typecheck`, `test`, `build`, `policy:gates`, `validate:env`)
- Deployment artifact built from tagged commit
- Verified secrets in deployment environment
- Backup completed for control-plane SQLite before deployment

## Required Environment Variables
- `NODE_ENV=production`
- `TROPTIONS_DEPLOYMENT_ID`
- `TROPTIONS_RELEASE_CHANNEL` (`prod`, `staging`, or `dr`)
- `TROPTIONS_CONTROL_PLANE_WRITES_ENABLED` (`0` or `1`)
- `TROPTIONS_JWT_KEYS_JSON` or `TROPTIONS_JWT_SECRET`
- `TROPTIONS_AUDIT_EXPORT_KEYS_JSON` or (`TROPTIONS_AUDIT_EXPORT_SECRET` + `TROPTIONS_AUDIT_EXPORT_KEY_ID`)

## Staging Deployment Steps
1. Run `npm ci`.
2. Run `npm run policy:gates`.
3. Run `npm run validate:env` with staging env.
4. Run `npm run lint && npm run typecheck && npm test`.
5. Run `npm run build`.
6. Backup DB: `npm run backup:control-plane`.
7. Deploy artifact to staging.
8. Verify health:
- `GET /api/health/live` should return `200`.
- `GET /api/health/ready` should return `200`.
9. Execute smoke tests for key API routes.

## Production Deployment Steps
1. Confirm staging passed with same artifact.
2. Backup DB: `npm run backup:control-plane` and retain path.
3. Set production envs (especially deployment id and release channel).
4. Deploy artifact.
5. Verify health endpoints.
6. Verify control-plane read endpoints with production auth.
7. Enable writes only when post-deploy checks pass.

## Rollback
1. Disable writes: `TROPTIONS_CONTROL_PLANE_WRITES_ENABLED=0`.
2. Redeploy previous known-good artifact.
3. If DB corruption is suspected, restore from backup using:
- `npm run restore:control-plane -- <backup-file>`
4. Re-run health checks.

## Post-Deployment Verification
- Audit export endpoint signs with expected key id
- Workflow transition and approval route checks still enforce MFA/operator controls
- Monitoring dashboard shows no `operator_security_block` spikes beyond expected baseline
