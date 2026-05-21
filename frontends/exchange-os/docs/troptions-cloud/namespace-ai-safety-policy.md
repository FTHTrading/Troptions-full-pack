# Namespace AI Safety Policy

This document defines the AI safety controls enforced across all Troptions Cloud namespaces.

## Core Safety Invariants

These are TypeScript literal types — they cannot be overridden by runtime configuration:

```typescript
externalApiCallsEnabled: false
livePaymentsEnabled: false
simulationOnly: true
requiresControlHubApproval: true
liveExecutionTriggered: false
externalApiCallTriggered: false
```

## Healthcare Safety

Namespaces with `healthcareSafetyRequired: true` enforce an additional layer of blocked modules:

### Always-Blocked Healthcare Modules

```
diagnosis_engine
treatment_recommendation
phi_intake
emergency_guidance
clinical_decision_support
patient_data_processor
medical_imaging_analysis
prescription_advisor
```

These are blocked regardless of membership plan, approval status, or any runtime flag. The block is implemented in `namespaceAiAccessPolicyEngine.ts` as a constant array checked before any other policy evaluation.

## AI Access Decision Types

| Decision | Meaning |
|----------|---------|
| `allow` | Access permitted; simulation logged |
| `block` | Access denied; reason recorded; blocked action stored in Control Hub |
| `require_approval` | Held pending explicit Control Hub approval |

## Model Routing Safety

Unknown model providers are gated by `requiresApprovalForUnknownProvider: true` on all namespaces. The fallback behavior is `"queue_for_approval"` — unknown models do not execute silently.

## Tool Access Safety

High-risk tools require approval (`requiresApprovalForHighRisk: true`). Unknown tools never execute silently (`requiresApprovalForUnknownTool: true`).

## Knowledge Vault Access

Vaults have four access levels:
- `open` — any authenticated member
- `membership_required` — must have a qualifying plan
- `approval_required` — must request and receive explicit approval
- `restricted` — not accessible in current posture

## Audit Trail

Every AI access decision (allow, block, or require_approval) generates a full Control Hub record:
- Task record with `requiresApproval: true`
- Simulation JSON with the full `NamespaceAiAccessDecision`
- Audit record with `actionType`, `outcome`, `blockedCount`
- Per-capability blocked action records for every item in `blockedCapabilities`
- Recommendation record for blocked/approval-required decisions

## Escalation Path

No automated escalation in simulation mode. Approval-required decisions are stored in the Control Hub for human review. The recommended next action is always stored as a `createRecommendationRecord` entry with `priority: "medium"` or higher.
