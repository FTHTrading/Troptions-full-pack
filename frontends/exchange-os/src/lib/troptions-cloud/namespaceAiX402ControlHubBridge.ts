/**
 * Troptions Cloud — Namespace AI + x402 Control Hub Bridge
 *
 * Persists all namespace AI access and x402 usage simulation events into the
 * Control Hub governance state store (SQLite primary, Postgres when available).
 *
 * This is a one-way write bridge. It:
 *   - Takes AI/x402 decisions and events as input
 *   - Persists them as task, simulation, audit, and blocked-action records
 *   - Returns the IDs of all records created
 *   - NEVER triggers live execution, payments, or external API calls
 *
 * SAFETY INVARIANTS:
 *   - No live execution paths
 *   - No payment settlement
 *   - No external API calls
 *   - All writes are audit records only
 */

import crypto from "crypto";
import {
  createTaskRecord,
  createSimulationRecord,
  createAuditRecord,
  createBlockedActionRecord,
  createRecommendationRecord,
} from "@/lib/troptions/controlHubStateStore";
import {
  getNamespaceAiProfile,
} from "@/content/troptions-cloud/namespaceAiInfrastructureRegistry";
import {
  getNamespaceX402Profile,
} from "@/content/troptions-cloud/namespaceX402Registry";
import type {
  NamespaceAiAccessDecision,
  NamespaceX402UsageEvent,
  NamespaceX402CreditLedgerEntry,
  NamespaceAiX402Snapshot,
} from "@/lib/troptions-cloud/namespaceAiX402Types";

// ─── Shared result shape ──────────────────────────────────────────────────────

export interface BridgePersistResult {
  taskId: string;
  simulationId: string;
  auditId: string;
  blockedActionIds: string[];
}

// ─── Internal helper ──────────────────────────────────────────────────────────

function auditToken(): string {
  return `ns-bridge-${crypto.randomUUID()}`;
}

function persistDecisionCore(params: {
  intent: string;
  decision: "allow" | "allow_free" | "allow_metered" | "block" | "require_approval";
  blockedCapabilities: string[];
  blockReason: string | null;
  approvalReason: string | null;
  simulationPayload: unknown;
  actionType: string;
  routedTo: string[];
  recommendation: string | null;
}): BridgePersistResult {
  const {
    intent,
    decision,
    blockedCapabilities,
    blockReason,
    approvalReason,
    simulationPayload,
    actionType,
    routedTo,
    recommendation,
  } = params;

  const isBlocked = decision === "block";
  const needsApproval = decision === "require_approval";
  const status = isBlocked ? "blocked" : needsApproval ? "needs_approval" : "simulated";
  const token = auditToken();

  const task = createTaskRecord({
    intent,
    status,
    auditToken: token,
    routedTo,
    requiresApproval: needsApproval || isBlocked,
  });

  const simulation = createSimulationRecord({
    taskId: task.id,
    simulationJson: JSON.stringify(simulationPayload),
  });

  const audit = createAuditRecord({
    taskId: task.id,
    auditToken: token,
    intent,
    actionType,
    outcome: status,
    blockedCount: blockedCapabilities.length,
    requiresApproval: needsApproval || isBlocked,
  });

  const blockedActionIds: string[] = [];
  for (const cap of blockedCapabilities) {
    const blocked = createBlockedActionRecord({
      taskId: task.id,
      capabilityId: cap,
      reason: blockReason ?? "Blocked by namespace AI policy",
    });
    blockedActionIds.push(blocked.id);
  }

  if (recommendation) {
    createRecommendationRecord({
      taskId: task.id,
      recommendation,
      priority: isBlocked ? "high" : needsApproval ? "medium" : "low",
    });
  }

  return {
    taskId: task.id,
    simulationId: simulation.id,
    auditId: audit.id,
    blockedActionIds,
  };
}

// ─── AI access persistence ────────────────────────────────────────────────────

export function persistNamespaceAiAccessSimulation(
  decision: NamespaceAiAccessDecision,
): BridgePersistResult {
  return persistDecisionCore({
    intent: `namespace-ai-access:${decision.namespaceId}:${decision.requestedModule}`,
    decision: decision.decision,
    blockedCapabilities: decision.blockedCapabilities,
    blockReason: decision.blockReason,
    approvalReason: decision.approvalReason,
    simulationPayload: decision,
    actionType: "namespace-ai-access-evaluation",
    routedTo: ["namespace-ai-policy-engine", "control-hub"],
    recommendation: decision.decision === "block"
      ? `Review AI access policy for namespace '${decision.namespaceId}' module '${decision.requestedModule}'.`
      : null,
  });
}

export function persistNamespaceModelRouteSimulation(
  namespaceId: string,
  provider: string,
  decision: NamespaceAiAccessDecision,
): BridgePersistResult {
  return persistDecisionCore({
    intent: `namespace-model-route:${namespaceId}:${provider}`,
    decision: decision.decision,
    blockedCapabilities: decision.blockedCapabilities,
    blockReason: decision.blockReason,
    approvalReason: decision.approvalReason,
    simulationPayload: { namespaceId, provider, decision },
    actionType: "namespace-model-route-evaluation",
    routedTo: ["model-routing-policy-engine", "control-hub"],
    recommendation: decision.decision === "block"
      ? `Provider '${provider}' blocked for namespace '${namespaceId}'. Update model routing policy if needed.`
      : null,
  });
}

export function persistNamespaceToolAccessSimulation(
  namespaceId: string,
  toolId: string,
  decision: NamespaceAiAccessDecision,
): BridgePersistResult {
  return persistDecisionCore({
    intent: `namespace-tool-access:${namespaceId}:${toolId}`,
    decision: decision.decision,
    blockedCapabilities: decision.blockedCapabilities,
    blockReason: decision.blockReason,
    approvalReason: decision.approvalReason,
    simulationPayload: { namespaceId, toolId, decision },
    actionType: "namespace-tool-access-evaluation",
    routedTo: ["tool-access-policy-engine", "control-hub"],
    recommendation: null,
  });
}

export function persistNamespaceKnowledgeVaultSimulation(
  namespaceId: string,
  vaultId: string,
  decision: NamespaceAiAccessDecision,
): BridgePersistResult {
  return persistDecisionCore({
    intent: `namespace-vault-access:${namespaceId}:${vaultId}`,
    decision: decision.decision,
    blockedCapabilities: decision.blockedCapabilities,
    blockReason: decision.blockReason,
    approvalReason: decision.approvalReason,
    simulationPayload: { namespaceId, vaultId, decision },
    actionType: "namespace-vault-access-evaluation",
    routedTo: ["knowledge-vault-policy-engine", "control-hub"],
    recommendation: null,
  });
}

// ─── x402 persistence ─────────────────────────────────────────────────────────

export function persistX402UsageSimulation(
  event: NamespaceX402UsageEvent,
): BridgePersistResult {
  const isBlocked = event.policy === "blocked";
  const needsApproval = event.policy === "approval_required";
  const decision = isBlocked ? "block" : needsApproval ? "require_approval" : "allow" as const;

  return persistDecisionCore({
    intent: `namespace-x402-usage:${event.namespaceId}:${event.actionId}`,
    decision,
    blockedCapabilities: isBlocked ? [event.actionId] : [],
    blockReason: isBlocked ? `Action '${event.actionId}' blocked by x402 policy.` : null,
    approvalReason: needsApproval ? `Action '${event.actionId}' requires approval.` : null,
    simulationPayload: event,
    actionType: "namespace-x402-usage-simulation",
    routedTo: ["x402-policy-engine", "control-hub"],
    recommendation: isBlocked
      ? `Review x402 policy for action '${event.actionId}' in namespace '${event.namespaceId}'.`
      : null,
  });
}

export function persistX402CreditLedgerSimulation(
  entry: NamespaceX402CreditLedgerEntry,
): BridgePersistResult {
  return persistDecisionCore({
    intent: `namespace-x402-credit:${entry.namespaceId}:${entry.type}:${entry.id}`,
    decision: "allow",
    blockedCapabilities: [],
    blockReason: null,
    approvalReason: null,
    simulationPayload: entry,
    actionType: "namespace-x402-credit-ledger-simulation",
    routedTo: ["x402-credit-ledger", "control-hub"],
    recommendation: null,
  });
}

// ─── Snapshot ─────────────────────────────────────────────────────────────────

export function getNamespaceAiX402Snapshot(
  namespaceId: string,
): NamespaceAiX402Snapshot | null {
  const aiProfile = getNamespaceAiProfile(namespaceId);
  const x402Profile = getNamespaceX402Profile(namespaceId);

  if (!aiProfile || !x402Profile) return null;

  return {
    snapshotId: `snapshot-${crypto.randomUUID()}`,
    namespaceId,
    generatedAt: new Date().toISOString(),
    aiInfrastructure: aiProfile,
    x402Profile,
    recentAiAccessDecisions: [],
    recentX402Decisions: [],
    recentUsageEvents: [],
    recentAuditEvents: [],
    controlHubPersistenceStatus: "connected",
    safetyStatus: {
      livePaymentsDisabled: true,
      liveWalletMovementDisabled: true,
      externalAiCallsDisabled: true,
      healthcareSafetyEnabled: aiProfile.healthcareSafetyRequired,
      phiIntakeBlocked: true,
      controlHubApprovalRequired: true,
    },
  };
}
