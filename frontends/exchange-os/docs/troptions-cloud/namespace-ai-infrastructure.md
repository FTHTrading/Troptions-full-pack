# Namespace AI Infrastructure

Each Troptions Cloud namespace operates its own isolated AI infrastructure stack — sovereign AI systems, knowledge vaults, model routing policies, and tool access controls — all governed by the Control Hub with simulation-only safety enforcement.

## Key Concepts

| Term | Description |
|------|-------------|
| `NamespaceAiInfrastructureProfile` | Defines all AI capabilities, access policies, and safety controls for one namespace |
| Sovereign AI Systems | Namespace-scoped AI agents with `executionMode: "simulation_only"` by default |
| Knowledge Vaults | Versioned knowledge repositories with access level controls |
| Model Routing Policy | Allowed/blocked providers, fallback behavior, unknown-provider approval |
| Tool Access Policy | Allowed/blocked tools, high-risk gating, unknown-tool approval |

## Registry

Defined in `src/content/troptions-cloud/namespaceAiInfrastructureRegistry.ts`.

11 namespaces:
- `troptions`, `troptions-enterprise`, `troptions-health`, `troptions-media`, `troptions-business`
- `troptions-ai`, `troptions-real-estate`, `troptions-solar`, `troptions-education`, `troptions-xchange`, `troptions-web3`

## Safety Invariants

All namespaces enforce:

```typescript
externalApiCallsEnabled: false     // no live AI provider calls
requiresControlHubApproval: true   // every action must pass through Control Hub
```

Healthcare namespaces additionally enforce:

```typescript
healthcareSafetyRequired: true
```

This blocks: `diagnosis_engine`, `treatment_recommendation`, `phi_intake`, `emergency_guidance`, `clinical_decision_support`, `patient_data_processor`, `medical_imaging_analysis`, `prescription_advisor`.

## Execution Modes

| Mode | Description |
|------|-------------|
| `read_only` | No writes; content access only |
| `simulation_only` | All actions simulated and logged |
| `approval_required` | Each action requires explicit Control Hub approval |
| `disabled` | Workspace is offline |

## API

`GET /api/troptions-cloud/namespaces/[namespace]/ai-infrastructure`
- Returns `NamespaceAiInfrastructureProfile` (cached 60s)

`POST /api/troptions-cloud/namespaces/[namespace]/ai/simulate-access`
- Body: `{ memberId, membershipPlan, requestedModule }`
- Returns: `NamespaceAiAccessDecision` + `taskId`

`POST /api/troptions-cloud/namespaces/[namespace]/ai/simulate-route`
- Body: `{ memberId, requestedModel }`
- Returns: `NamespaceAiAccessDecision` + `taskId`

`POST /api/troptions-cloud/namespaces/[namespace]/ai/simulate-tool`
- Body: `{ memberId, requestedTool }`
- Returns: `NamespaceAiAccessDecision` + `taskId`
