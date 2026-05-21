# x402 Usage Metering Policy

This document defines how TROPTIONS credits are metered across namespace actions using the x402 protocol in simulation mode.

## Metering Modes

| Mode | Description |
|------|-------------|
| `disabled` | No metering; access is untracked |
| `simulation_only` | Charges logged; no real credits moved |
| `metered_simulation` | Full metering logic with simulated balance effects |
| `approval_required` | Each metered action must be approved before it is counted |

## Credit Ledger Modes

| Mode | Description |
|------|-------------|
| `disabled` | No ledger maintained |
| `simulation_only` | Ledger entries recorded; balances are always simulated |
| `balance_tracking_simulation` | Running balance tracked in simulation |

## Action Policy Hierarchy

Actions are evaluated in this order:

1. **blocked** — always denied; no credit consumed
2. **approval_required** — held for Control Hub approval before proceeding
3. **metered** — TROPTIONS_CREDIT deducted based on `X402ServicePricingTemplate`
4. **free** — allowed with no credit requirement

Membership plan mapping can upgrade or restrict access per plan:
- Plans define which action IDs are accessible at each tier
- An action may be `free` for Enterprise but `metered` for Basic

## Pricing Templates

Each namespace defines `servicePricingTemplates: X402ServicePricingTemplate[]`:

```typescript
{
  actionId: string;
  actionLabel: string;
  simulatedCreditCost: number;
  currency: "TROPTIONS_CREDIT" | "XRP_SIM" | "XLM_SIM" | "USD_SIM";
  membershipRequirement: string | null;
  approvalRequired: boolean;
}
```

All currencies are simulation variants. No real asset is transferred in simulation mode.

## Policy Evaluation Flow

```
evaluateX402Action({ namespaceId, actionId, memberId, membershipPlan })
  │
  ├─ evaluateX402PaymentRequirement()  → X402ActionEvaluation (policy + cost)
  ├─ evaluateX402MembershipAccess()    → { allowed, reason }
  │
  └─ NamespaceX402PaymentDecision {
       decision: "allow_free" | "allow_metered" | "require_approval" | "block"
       simulatedCreditCost: number
       blockReason: string | null
       approvalReason: string | null
       simulationOnly: true
       livePaymentTriggered: false
     }
```

## Simulation Event Shape

```typescript
NamespaceX402UsageEvent {
  id: string;                        // UUID
  namespaceId, memberId, actionId, actionLabel;
  simulatedCreditCost: number;
  currency: string;
  membershipPlan: string;
  policy: X402ActionPolicy;
  chargeMode: "simulation";           // always
  timestamp: string;
  controlHubTaskId: string | null;
  auditToken: string;
}
```

## Compliance

All metering events are persisted to the Control Hub SQLite store via `persistX402UsageSimulation()`. This creates:
- A task record with intent `"x402_usage_charge_simulation"`
- A simulation record with the full event JSON
- An audit record with `actionType: "x402_charge"`, `outcome: "simulated"`
- A recommendation record if credits would be exhausted
