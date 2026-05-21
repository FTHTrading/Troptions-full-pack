# AI + x402 Control Hub Architecture

This document describes how the namespace AI infrastructure and x402 payment systems integrate with the Troptions Control Hub for governance, simulation persistence, and audit trail generation.

## Architecture Overview

```
Namespace AI/x402 Event
        │
        ▼
  Policy Engine (pure functions)
  ├── namespaceAiAccessPolicyEngine.ts    — AI access decisions
  └── namespaceX402PolicyEngine.ts        — x402 payment decisions
        │
        ▼
  Control Hub Bridge
  └── namespaceAiX402ControlHubBridge.ts
        ├── createTaskRecord()           → task (audit token)
        ├── createSimulationRecord()     → simulation JSON
        ├── createAuditRecord()          → audit event
        ├── createBlockedActionRecord()  → per-capability block
        └── createRecommendationRecord() → remediation advice
        │
        ▼
  SQLite Control Plane
  └── getControlPlaneDb() — via controlHubStateStore.ts
```

## Key Files

| File | Purpose |
|------|---------|
| `src/lib/troptions-cloud/namespaceAiX402ControlHubBridge.ts` | Bridge — all persistence wiring |
| `src/lib/troptions/controlHubStateStore.ts` | SQLite store — synchronous functions |
| `src/lib/troptions/controlHubStateTypes.ts` | Input/output types for all store functions |
| `src/lib/troptions-cloud/namespaceAiAccessPolicyEngine.ts` | Pure AI access policy logic |
| `src/lib/troptions-cloud/namespaceX402PolicyEngine.ts` | Pure x402 payment policy logic |

## Bridge Functions

| Function | Input | Returns |
|----------|-------|---------|
| `persistNamespaceAiAccessSimulation` | `NamespaceAiAccessDecision` | `BridgePersistResult` |
| `persistNamespaceModelRouteSimulation` | `(namespaceId, provider, decision)` | `BridgePersistResult` |
| `persistNamespaceToolAccessSimulation` | `(namespaceId, toolId, decision)` | `BridgePersistResult` |
| `persistNamespaceKnowledgeVaultSimulation` | `(namespaceId, vaultId, decision)` | `BridgePersistResult` |
| `persistX402UsageSimulation` | `NamespaceX402UsageEvent` | `BridgePersistResult` |
| `persistX402CreditLedgerSimulation` | `NamespaceX402CreditLedgerEntry` | `BridgePersistResult` |
| `getNamespaceAiX402Snapshot` | `namespaceId` | `NamespaceAiX402Snapshot \| null` |

## Persistence Flow (per event)

1. `createTaskRecord` → generates `auditToken`, stores intent + routing
2. `createSimulationRecord` → stores serialized event JSON linked to task
3. `createAuditRecord` → stores actionType, outcome, blockedCount
4. For each blocked capability: `createBlockedActionRecord`
5. For non-trivial outcomes: `createRecommendationRecord`

## Snapshot Generation

`getNamespaceAiX402Snapshot(namespaceId)`:
1. Loads `NamespaceAiInfrastructureProfile` from registry
2. Loads `NamespaceX402Profile` from registry
3. Assembles hardcoded safety literals (always `true` / `false`)
4. Returns empty `recentAiAccessDecisions`, `recentX402Decisions`, `recentUsageEvents` (full DB query is future scope)
5. Queries Control Hub status from store for `controlHubPersistenceStatus`

## Governance Posture

Every namespace event is:
- **Recorded** — task + simulation + audit stored in SQLite
- **Non-blocking** — bridge errors are caught and logged, never surface to users
- **Simulation-only** — `simulationOnly: true`, `liveActionTriggered: false` literals enforced at type level
