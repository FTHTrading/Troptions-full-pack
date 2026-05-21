# TROPTIONS PayOps — Brand Safety Rules

**Version:** 1.0  
**Applies To:** All PayOps code, UI, docs, and API responses under the TROPTIONS namespace

---

## Rule 1 — No Third-Party Payment Provider Names

The TROPTIONS PayOps platform is **provider-neutral**. No payment processor, bank partner, KYC vendor, payroll service, or stablecoin operator may be:

- Named in the UI
- Named in API responses
- Named in code identifiers, comments, or strings
- Used as a logo asset
- Implied by color schemes or branded UI patterns

**Allowed:** "compatible with approved banking partners", "approved execution adapter", "approved KYC provider"  
**Forbidden:** Stripe, Dwolla, Plaid, Column, Synapse, Gusto, Rippling, Papaya, Persona, Jumio, Onfido, Circle, Fireblocks, or any specific vendor name

---

## Rule 2 — No Fake Live Money Movement

The simulation environment must never display, imply, or report actual money movement.

Enforcement:
- `executedPayouts` in `getMockPayOpsClient()` must always be `0`
- No batch in mock data may have `status: "executed"`
- All funding vault balances in mock data default to `0`
- Every page must display a "Simulation Only" banner
- All execution-path buttons must be disabled with `cursor-not-allowed`

---

## Rule 3 — Adapter Execution Gate is Immovable

The distinction between "approved" and "executed" is a hard architectural boundary.

- "Approved" means the payout has been reviewed and authorized within TROPTIONS
- "Executed" means a real, confirmed adapter has moved money
- These two states **must never collapse into one**
- `approved_not_executed` is a first-class status and must be prominently displayed
- This status must be described in UI as: "Approved — Awaiting Execution Adapter"

---

## Rule 4 — Execution Requires a Production-Grade Adapter

A payout may only reach `execution_pending` or `executed` when:

1. The adapter category is one of: `bank_partner`, `payroll_partner`, `wallet_partner`, `stablecoin_partner`, `card_partner`
2. The adapter instance has `isConfigured: true`
3. The adapter instance has `status: "approved"`
4. The adapter instance has `environment: "production"`

All four conditions must be true simultaneously. Missing any one condition must return `ok: false` with an explicit error message.

---

## Rule 5 — No FTH / FTHX / FTHG References

The TROPTIONS PayOps module is a TROPTIONS-sovereign product. The following names must not appear in any PayOps file:

- FTH
- FTHX
- FTHG
- Future Tech Holdings

These names belong to a separate entity. Any accidental reference must be removed immediately.

---

## Rule 6 — Compliance is Non-Negotiable

A payout that is blocked by compliance cannot proceed — period.

- `blocked_by_compliance` cannot transition to any execution state
- The only exit from `blocked_by_compliance` is `→ draft` (reset for resubmission)
- A payee with `kycStatus: "rejected"` or `kycStatus: "blocked"` is not compliant
- A payee with `complianceStatus: "blocked"` or `complianceStatus: "rejected"` is not compliant
- A payee with `sanctionsScreeningStatus: "blocked"` or `sanctionsScreeningStatus: "rejected"` is not compliant
- All three fields must be clear for a payee to be eligible for payout

---

## Rule 7 — Namespace Isolation

Each TROPTIONS namespace operates its own PayOps instance:

- All mock data functions accept `namespaceId` and scope results accordingly
- No namespace may read or modify another namespace's payees, batches, receipts, or adapters
- The `[namespace]` route segment determines scope for all PayOps pages

---

## Rule 8 — Audit Trail is Immutable

Every material action in the PayOps system must produce an audit event:

- Batch created, approved, blocked, reset
- Payee created or updated
- Adapter configured
- Receipt generated
- Compliance check completed

Audit events are append-only. No update or delete routes may be created for audit events.

---

## Rule 9 — Fee Ledger Transparency

All fees charged to the TROPTIONS namespace operator must be:

- Itemized in the fee ledger with `feeType`, `amount`, `currency`, `batchId`, and `status`
- Summarized as `totalPaid` and `totalPending` on the API response
- Displayed on the Settings page under "Fee Ledger"

No hidden fees. No opaque billing.

---

## Rule 10 — UI Consistency Requirements

Every PayOps dashboard page must include:

1. Breadcrumb: `Dashboard / PayOps / [Page Name]`
2. Yellow simulation banner: `bg-yellow-900/40 border border-yellow-700/50`
3. Gold "TROPTIONS PAYOPS" label: `text-[#C9A84C]`
4. Dark card backgrounds: `bg-[#0F1923]` outer, `bg-[#080C14]` inner
5. `generateStaticParams()` using `TROPTIONS_NAMESPACES`
6. `params: Promise<{ namespace: string }>` with `const { namespace } = await params;`

---

*These rules apply to all contributors and automated agents working within the TROPTIONS PayOps codebase. Violations should be flagged and resolved before merge.*
