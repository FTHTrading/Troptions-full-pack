# TROPTIONS Exchange OS — Operations Runbook

**Scope:** How to operate the TROPTIONS Exchange OS day-to-day.

---

## Daily Operations

### Morning Check (< 15 minutes)
1. Check Sentry for new errors since last check
2. Review monitoring dashboard for any critical alerts
3. Confirm LP balances for all active partner tokens (read-only RPC query)
4. Confirm mint/freeze authority unchanged for all active partner tokens
5. Check Cloudflare Analytics for unusual traffic patterns
6. Review any partner messages or escalations

### Monitoring Response
- **Critical alert fires:** Follow incident response runbook immediately
- **High alert fires:** Investigate within 1 hour. Notify partner operator.
- **Medium alert fires:** Investigate within 4 hours. Log in monitoring report.
- **All clear:** Document in daily log

---

## Proof Packet Operations

### Creating a Draft Proof Packet
1. Open `src/data/tokenProofPacketRequirements.ts`
2. Review all required fields (marked `required: true`)
3. Collect all required documents from partner
4. Update field statuses from `required` → `pending` → `verified` as documents are received and reviewed
5. Do NOT change any field to `verified` without document review by appropriate reviewer
6. Generate proof packet summary via `summarizeProofPacket()` utility function
7. Store completed proof packet in Cloudflare R2 (once configured)

### Proof Packet Status Rules
- `required` — Document not yet submitted by partner
- `pending` — Document received, under review
- `verified` — Document reviewed and approved by appropriate reviewer
- `blocked` — Critical issue found — escalate immediately
- `not_applicable` — Field not applicable to this token/chain

---

## Feature Flag Operations

### Enabling a Feature Flag
1. Confirm all prerequisites in `TROPTIONS_EXCHANGE_OS_MAINNET_READINESS_CHECKLIST.md` are complete
2. Obtain sign-off from required approvers (see mainnet enablement protocol)
3. Set via Cloudflare Secrets (not in code or wrangler.toml):
   ```
   wrangler secret put EXCHANGE_OS_XRPL_MAINNET_ENABLED
   # Enter: true
   ```
4. Log the change in the audit log with timestamp, changer, and approval chain
5. Test flag effect in production (canary if available)
6. Monitor for 30 minutes after enabling

### Disabling a Feature Flag
- Can be done without full approval process in case of incident
- Technical Lead authority sufficient for emergency disable
- Document reason in audit log within 1 hour of action

---

## Partner Operations

### Adding a New Partner Token
1. Confirm partner has completed all 12 onboarding stages
2. Confirm launch committee GO is issued
3. Add token to appropriate data files (do NOT add as "verified" without committee GO)
4. Set feature flags to appropriate level (start with `gated`, not `mainnet_ready`)
5. Configure monitoring for new token (LP, authority, volume alerts)
6. Notify partner of onboarding completion
7. Set initial risk level to `gated` or `pilot` — never `mainnet_ready` without full readiness check

### Suspending a Partner Token
1. Set token risk level to `suspended`
2. Update all truth labels to show "Under Review"
3. Notify partner operator immediately
4. Begin incident investigation
5. Do NOT re-enable without committee review

---

## API Operations

All Exchange OS API routes are read-only static config. They do not:
- Query live chain data
- Perform any write operations
- Access any private keys
- Execute any transactions

API responses include:
- `generatedAt` — ISO timestamp
- `truthLabel` — always `static_config_no_live_data`
- `version` — schema version

---

## Emergency Contacts

| Role | Escalation Trigger | Time Limit |
|------|-------------------|------------|
| Technical Lead | Any technical incident | Immediate |
| Compliance Officer | Any compliance or pattern anomaly | Immediate |
| Legal Counsel | Any regulatory inquiry, security incident | Immediate |
| Executive Sponsor | Any committee split, critical escalation | Immediate |
