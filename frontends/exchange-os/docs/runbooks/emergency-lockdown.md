# Emergency Lockdown Procedure

## Trigger Conditions
- Suspected credential compromise
- Unauthorized control-plane write attempts
- Active incident requiring immediate write freeze

## Immediate Actions
1. Set `TROPTIONS_DEPLOYMENT_LOCKDOWN=1`.
2. Set `TROPTIONS_CONTROL_PLANE_WRITES_ENABLED=0`.
3. Redeploy or restart service with updated environment.
4. Confirm mutating control-plane routes return gate-blocked responses.

## Verification
- `GET /api/health/live` returns `200`.
- `GET /api/health/ready` reflects environment validity.
- Mutating endpoints are blocked by deployment gate.

## Containment
- Rotate JWT and audit keys (see key-rotation runbook).
- Revoke static token auth in production:
- unset `TROPTIONS_CONTROL_PLANE_TOKEN` or keep `TROPTIONS_ALLOW_STATIC_TOKEN_AUTH` disabled.
- Apply operator IP allowlist if not already set.

## Recovery
1. Investigate incident and root cause.
2. Re-enable writes only after approval:
- `TROPTIONS_DEPLOYMENT_LOCKDOWN=0`
- `TROPTIONS_CONTROL_PLANE_WRITES_ENABLED=1`
3. Monitor logs and metrics for recurrence.

## Audit Requirements
- Record incident timeline
- Record env changes and key rotation IDs
- Export signed audit log after stabilization
