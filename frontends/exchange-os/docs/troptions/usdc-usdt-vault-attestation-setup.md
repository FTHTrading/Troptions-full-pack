# USDC/USDT Vault Attestation Setup

## Objective
Set up a professional, verifier-friendly treasury structure where USDC or USDT balances are real, on-chain, and independently verifiable, while the assets remain locked and non-spendable for normal operations.

## Scope
- Token options: USDC or USDT
- Primary use: capital-raise diligence and proof-of-funds validation
- Control objective: verify balances and wallet control without enabling day-to-day spend

## Target Operating Model
1. Dedicated vault wallets per token and chain.
2. M-of-N signer policy with named roles.
3. Policy lock: no spend, no borrow, no pledge unless formal release conditions are met.
4. Public verification packet for counterparties.
5. Continuous monitoring with Chainlink reference feeds and threshold alerts.
6. Signed attestation report exported as PDF on a recurring schedule.

## Recommended Setup

### 1) Wallet Architecture
- Create separate vault addresses for USDC and USDT.
- Keep operational treasury and vault treasury fully segregated.
- Maintain an address registry with:
  - wallet purpose
  - token scope
  - chain/network
  - signer quorum
  - creation date

### 2) Lock and Governance Controls
- Use multisig wallets with an explicit release policy.
- Define a release matrix:
  - standard: no outgoing transfers
  - emergency: elevated quorum and written legal/compliance approval
  - final release: board or governance signature bundle
- Maintain a signer key ceremony log and periodic signer revalidation.

### 3) Counterparty Verification Packet
Provide a packet that includes:
- wallet addresses (USDC/USDT)
- signed proof-of-control messages
- timestamped balance snapshots
- exact block heights or transaction references
- verification instructions for explorers and RPC endpoints
- disclosure language: no guarantee of financing or closing

### 4) Chainlink Monitoring Layer
- Map each token/chain to relevant Chainlink reference feeds.
- Define policy thresholds:
  - peg variance alert
  - unexpected balance movement alert
  - stale data alert
- Route alerts to compliance and treasury owners.

### 5) Attestation Cadence
- Generate attestation reports daily, weekly, or monthly.
- Each report should include:
  - opening and closing balances
  - movement delta (expected to be zero under lock)
  - signer confirmation
  - monitoring exceptions
- Hash each report and retain in the internal audit log.

## Evidence Checklist
- Governance resolution approving lock policy
- Signer matrix and role assignment
- Message-signature proof of wallet control
- Source-of-funds support package
- Chainlink monitoring policy and alert recipients
- Attestation log and prior reports

## Counterparty Validation Steps
1. Verify wallet addresses from the packet.
2. Confirm token balances directly on-chain.
3. Validate signed messages proving control.
4. Review lock policy and release conditions.
5. Review latest attestation report and exception log.

## Suggested Rollout Plan
1. Week 1: wallet creation, signer setup, and lock policy finalization.
2. Week 2: verification packet publication and counterpart pilot checks.
3. Week 3: Chainlink alerts live and first signed attestation cycle.
4. Week 4: legal/compliance review and operational handoff.

## Important Notes
- This setup supports diligence and validation workflows.
- It does not replace legal, compliance, custody, or licensing obligations.
- Release authority should always be explicit, documented, and auditable.
