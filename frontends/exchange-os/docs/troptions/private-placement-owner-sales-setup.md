# Private Placement Owner + Sales Setup

## Purpose
This guide defines a senior-level private placement operating model for a locked USDC/USDT treasury structure. It is designed for owners, sales leadership, compliance, and verifier-facing teams that need a defensible institutional process.

## Senior-Level Structure

### 1) Placement Architecture (Owner Lane)
- Establish one legal issuer lane per offering (entity + governance authority).
- Define raise objective, instrument structure, investor profile, and permitted jurisdictions.
- Separate strategic approvals (owner/board) from operational execution (sales/placement team).

### 2) Locked Treasury Design
- Keep treasury in dedicated lock-designated wallets, segregated from operating wallets.
- Use signer governance (M-of-N) with documented key ownership and role segmentation.
- Enforce no-spend, no-borrow, and no-pledge policy unless formal release conditions are met.

### 3) Verification and Chainlink Overlay
- Publish verifier packet with wallet addresses, signed control proofs, and timestamp policy.
- Require counterparties to independently verify balances and signatures.
- Configure Chainlink threshold alerts for peg variance and balance drift exceptions.

### 4) Sales Execution Protocol
- Qualify counterparties before packet release (mandate fit, authority, timeline, diligence readiness).
- Use one approved narrative and one approved packet version set.
- Log distribution events, verifier handoff timestamps, and escalation notes.

### 5) Governance and Escalation
- Route legal/compliance exceptions to owner-approved escalation contacts.
- Block unsanctioned claims, side letters, and off-script assurances.
- Require formal sign-off for any release event that changes lock status.

## Document Set You Now Have
- Owner brief PDF: private-placement-owner-strategy-brief.pdf
- Sales brief PDF: private-placement-sales-execution-guide.pdf
- Locked treasury baseline PDF: usdc-usdt-vault-attestation-framework.pdf

## Recommended Rollout Sequence
1. Approve owner governance and lock policy.
2. Confirm signer custody and verifier program assignment.
3. Train sales team on approved narrative and prohibited claims.
4. Run one internal dry-run using the full packet + verifier ping.
5. Start external distribution to qualified counterparties.

## Control Standards
- Every external claim must map to approved language.
- Every packet delivery must be logged and versioned.
- Every verifier event must be timestamped and attributable.
- Every exception must be escalated and resolved in writing.

## Outcome
This model gives owners strategic control and gives sales teams a disciplined execution path. It supports credible private placement engagement while preserving lock integrity, verification defensibility, and institutional audit readiness.
