# Namespace x402 Readiness

Each Troptions Cloud namespace has a dedicated x402 payment profile defining its credit metering mode, service pricing, membership plan entitlements, and action-level payment policies. All x402 operations are simulation-only until explicitly enabled through the Control Hub approval process.

## Key Concepts

| Term | Description |
|------|-------------|
| `NamespaceX402Profile` | Full x402 payment configuration for one namespace |
| `X402ActionPolicy` | `"free" \| "metered" \| "approval_required" \| "blocked"` |
| `X402ServicePricingTemplate` | Per-action credit cost and currency definition |
| `usageMeteringMode` | How usage events are tracked (simulation, metered, disabled) |
| `creditLedgerMode` | How credit balances are tracked (simulation, balance tracking, disabled) |
| `membershipPlanMapping` | Map from plan name → list of allowed action IDs |

## Registry

Defined in `src/content/troptions-cloud/namespaceX402Registry.ts`.

Same 11 namespaces as AI infrastructure. Each namespace has:
- `freeActions[]` — available without credits
- `paymentRequiredActions[]` — TROPTIONS_CREDIT metered
- `approvalRequiredActions[]` — require Control Hub approval before payment
- `blockedActions[]` — never executable in current posture

## Safety Invariants

```typescript
x402Enabled: false            // x402 rails not live
simulationOnly: true          // all charges are simulated
livePaymentsEnabled: false    // no wallet movements
```

## Action IDs

Canonical action IDs from `X402_ACTIONS`:

```typescript
AI_PROMPT, AI_AGENT_RUN, KNOWLEDGE_VAULT_SEARCH, REPORT_EXPORT,
DOCUMENT_HASH, PROOF_PACKET_GENERATE, WEB3_READINESS_REPORT,
XRPL_ROUTE_SIMULATION, STELLAR_ROUTE_SIMULATION, MEMBERSHIP_ACCESS_SIMULATION
```

## API

`GET /api/troptions-cloud/namespaces/[namespace]/x402`
- Returns `NamespaceX402Profile` (cached 60s)

`GET /api/troptions-cloud/namespaces/[namespace]/x402/usage`
- Returns policy summary and recent usage events

`POST /api/troptions-cloud/namespaces/[namespace]/x402/simulate-charge`
- Body: `{ memberId, membershipPlan, actionId }`
- Returns: `NamespaceX402UsageEvent` + `taskId`
