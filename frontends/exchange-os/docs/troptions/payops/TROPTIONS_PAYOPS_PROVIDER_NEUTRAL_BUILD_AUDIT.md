# TROPTIONS PayOps — Provider-Neutral Build Audit

**Version:** 1.0  
**Scope:** `src/lib/troptions/payops/`, `src/app/api/troptions/payops/`, `src/app/troptions-cloud/[namespace]/payops/`

---

## Purpose

This document records the provider-neutral design decisions made during the TROPTIONS PayOps build. It confirms that no third-party payment provider is named, implied, or hard-coded into the platform layer. All adapter integration points are described generically and are gated behind operator configuration.

---

## Adapter Layer Design

### 11 Adapter Categories (AdapterCategory)

All 11 adapter categories defined in `adapters.ts` use generic, category-level language:

| Category | Description Used |
|---|---|
| `bank_partner` | "ACH / wire transfer compatible with approved banking partners" |
| `payroll_partner` | "Compatible with approved payroll service providers" |
| `card_partner` | "Prepaid and virtual card issuance compatible with approved partners" |
| `stablecoin_partner` | "USDC / USDT distribution compatible with approved stablecoin networks" |
| `wallet_partner` | "Digital wallet disbursement compatible with approved wallet infrastructure" |
| `accounting_partner` | "Accounting and GL export compatible with approved platforms" |
| `kyc_partner` | "Identity verification compatible with approved KYC/AML providers" |
| `tax_partner` | "Tax form generation compatible with approved e-file providers" |
| `reporting_partner` | "Regulatory and compliance reporting output" |
| `compliance_partner` | "External compliance data feed compatible with approved sources" |
| `mock` | "Simulation-only adapter — no real money movement" |

### What is NOT present

- No named banking institution (e.g., Stripe, Dwolla, Plaid, Column, Synapse)
- No named payroll provider (e.g., Gusto, Rippling, Papaya)
- No named KYC vendor (e.g., Persona, Jumio, Onfido)
- No named stablecoin network operator
- No logo assets, color schemes, or API-key-derived integrations
- No partnership claims

---

## Execution Gate Audit

### Rule: Only Execution-Capable Adapters May Produce "executed" Status

Enforced in `status.ts → transitionPayoutStatus()`:

```typescript
const EXECUTION_CAPABLE_ADAPTERS: AdapterCategory[] = [
  "bank_partner",
  "payroll_partner",
  "wallet_partner",
  "stablecoin_partner",
  "card_partner",
];
```

- `mock` adapter: **BLOCKED** from `execution_pending` and `executed`
- `manual_proof` adapter: **BLOCKED** from `execution_pending` and `executed`
- All other non-execution categories: **BLOCKED**

### Rule: Execution-Capable Adapters Must Also Be Configured + Production

Enforced in `adapters.ts → canAdapterExecutePayouts()`:

```typescript
return (
  adapter.supportsExecution === true &&
  adapter.isConfigured === true &&
  adapter.status === "approved" &&
  adapter.environment === "production"
);
```

An adapter can be `bank_partner` in category but still **cannot** execute if:
- `isConfigured === false` (not yet set up by namespace operator)
- `status !== "approved"` (pending or suspended)
- `environment !== "production"` (sandbox only)

---

## Mock Data Enforcement

Enforced in `mockData.ts`:

- `getMockPayOpsClient()` always returns `executedPayouts: 0`
- `getMockPayoutBatches()` contains **no batch with status `"executed"`**
- Batches include: `draft`, `pending_approval`, `approved_not_executed`, `blocked_by_compliance`
- `getMockFundingVault()` always returns `{ currentBalance: 0, ... }`

---

## Compliance System

The compliance layer (`compliance.ts`) checks the following fields for payee eligibility:

| Field | Blocking Value(s) |
|---|---|
| `complianceStatus` | `"blocked"`, `"rejected"` |
| `kycStatus` | `"blocked"`, `"rejected"` |
| `sanctionsScreeningStatus` | `"blocked"`, `"rejected"` |

All three must clear for `isPayeeCompliant()` to return `true`.

---

## Dashboard UI Audit

All 8 PayOps dashboard pages include:

1. **Yellow "Simulation Only" banner** — visible at top of every page
2. **"TROPTIONS PAYOPS" gold label** — namespace + system identifier
3. **Orange advisory** (main page) — "An execution-capable adapter must be configured before any payout can reach Executed status"
4. **Disabled buttons** — all live-action buttons use `cursor-not-allowed opacity-50`
5. **`approved_not_executed` prominence** — explicitly described on batches page as "Approved — Awaiting Execution Adapter"

---

## Test Coverage

Test file: `src/__tests__/troptions/payops.test.ts`  
46 tests, 46 passing.

Key enforcement tests:
- `mock adapter cannot execute` — `adapterCanExecute("mock")` → `false`
- `mock adapter cannot transition to execution_pending` — `transitionPayoutStatus("approved_not_executed", "execution_pending", "mock")` → `{ok: false}`
- `bank_partner not configured cannot execute` — `canAdapterExecutePayouts(...)` → `false` when `isConfigured: false`
- `payee with rejected kyc is not compliant` — `isPayeeCompliant({..., kycStatus: "rejected"})` → `false`
- `no batch has executed status in mock data` — confirmed

---

## Build Status

- `pnpm build` (Next.js webpack): **exit 0**
- TypeScript strict mode: **0 errors**
- ESLint: **0 errors**
