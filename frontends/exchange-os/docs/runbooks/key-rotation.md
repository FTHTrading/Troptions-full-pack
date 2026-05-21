# Key Rotation Runbook

## Scope
Rotation of:
- JWT verification keys (`TROPTIONS_JWT_KEYS_JSON`)
- Audit export signing keys (`TROPTIONS_AUDIT_EXPORT_KEYS_JSON`)

## JWT Key Rotation Procedure
1. Add a new key record to `keys[]` in `TROPTIONS_JWT_KEYS_JSON` with `enabled=true`.
2. Keep existing key enabled during grace period.
3. Set `activeKid` to new key.
4. Redeploy application.
5. Verify auth flow with tokens signed by new key.
6. After token TTL expiration window, disable old key (`enabled=false`).
7. Redeploy and verify old token rejection.

## Audit Signing Key Rotation Procedure
1. Add new key into `TROPTIONS_AUDIT_EXPORT_KEYS_JSON`.
2. Set `activeKid` to the new key.
3. Redeploy.
4. Trigger audit export and verify returned `keyId` matches new active key.
5. Keep old key in disabled or removed state per retention policy.

## Validation Checklist
- `npm run validate:env` passes.
- `/api/health/ready` is `ok: true`.
- Authentication succeeds with new JWT key.
- Audit export signatures use expected key id.

## Rollback
- Revert `activeKid` to prior key.
- Redeploy.
- Re-test auth and audit export.

## Security Notes
- Secrets must be at least 32 characters.
- Never commit key material.
- Use short grace windows for deprecating old keys.
