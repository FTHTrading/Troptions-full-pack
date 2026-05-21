# Alert Escalation Runbook

## Escalation Levels
- L1 operator
- L2 compliance/security
- L3 legal/board
- emergency lockdown

## Trigger Classes
- Repeated auth failures
- Critical exception open too long
- Production release gate failures
- Audit-chain verification/signing failures
- DB health failure
- Backup stale
- Smoke check failure
- Prohibited jurisdiction attempt
- Static-token auth attempt in production

## Response
1. Confirm trigger validity.
2. Open incident record with evidence.
3. Notify required escalation level.
4. Execute emergency lockdown if critical integrity fails.
