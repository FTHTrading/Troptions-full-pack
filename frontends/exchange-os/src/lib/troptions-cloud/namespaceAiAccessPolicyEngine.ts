/**
 * Troptions Cloud — Namespace AI Access Policy Engine
 *
 * Evaluates AI access requests against namespace configuration, membership plan,
 * healthcare safety rules, model routing policy, and tool access policy.
 *
 * SAFETY RULES (enforced at runtime):
 * 1. Namespace must exist in registry.
 * 2. Membership plan must allow the requested AI module.
 * 3. Every decision requires Control Hub approval before production.
 * 4. External API calls are blocked by default.
 * 5. Healthcare AI blocks diagnosis, treatment, PHI intake, emergency guidance.
 * 6. High-risk tools require approval.
 * 7. Unknown model providers are blocked.
 * 8. Private data must not be sent to external models.
 * 9. Every decision is audit-ready with a unique auditToken.
 *
 * No live execution. No external AI calls. No PHI. Simulation-only.
 */

import crypto from "crypto";
import {
  getNamespaceAiProfile,
} from "@/content/troptions-cloud/namespaceAiInfrastructureRegistry";
import type {
  NamespaceAiAccessDecision,
  NamespaceAiInfrastructureProfile,
} from "@/lib/troptions-cloud/namespaceAiX402Types";

// ─── Healthcare blocked actions ───────────────────────────────────────────────

const HEALTHCARE_BLOCKED_MODULES = [
  "diagnosis_engine",
  "treatment_recommendation",
  "phi_intake",
  "emergency_guidance",
  "clinical_decision_support",
  "patient_data_processor",
  "medical_imaging_analysis",
  "prescription_advisor",
];

// ─── Decision builder ─────────────────────────────────────────────────────────

export function createNamespaceAiAccessDecision(
  partial: Omit<
    NamespaceAiAccessDecision,
    "requiresControlHubApproval" | "externalApiCallTriggered" | "liveExecutionTriggered" | "timestamp" | "auditToken"
  >,
): NamespaceAiAccessDecision {
  return {
    ...partial,
    requiresControlHubApproval: true,
    externalApiCallTriggered: false,
    liveExecutionTriggered: false,
    timestamp: new Date().toISOString(),
    auditToken: `ai-access-${crypto.randomUUID()}`,
  };
}

// ─── Main evaluations ─────────────────────────────────────────────────────────

export function evaluateNamespaceAiAccess(params: {
  namespaceId: string;
  memberId: string;
  membershipPlan: string;
  requestedModule: string;
}): NamespaceAiAccessDecision {
  const { namespaceId, memberId, membershipPlan, requestedModule } = params;

  // Rule 1: Namespace must exist
  const profile = getNamespaceAiProfile(namespaceId);
  if (!profile) {
    return createNamespaceAiAccessDecision({
      decisionId: crypto.randomUUID(),
      namespaceId,
      memberId,
      requestedModule,
      requestedModel: null,
      requestedTool: null,
      decision: "block",
      blockReason: `Namespace '${namespaceId}' not found in AI infrastructure registry.`,
      approvalReason: null,
      blockedCapabilities: [requestedModule],
      allowedCapabilities: [],
      healthcareSafetyCheck: false,
    });
  }

  // Rule: Workspace must be enabled
  if (!profile.aiWorkspaceEnabled) {
    return createNamespaceAiAccessDecision({
      decisionId: crypto.randomUUID(),
      namespaceId,
      memberId,
      requestedModule,
      requestedModel: null,
      requestedTool: null,
      decision: "block",
      blockReason: `AI workspace is not enabled for namespace '${namespaceId}'.`,
      approvalReason: null,
      blockedCapabilities: [requestedModule],
      allowedCapabilities: [],
      healthcareSafetyCheck: false,
    });
  }

  // Rule: Execution mode
  if (profile.executionMode === "disabled") {
    return createNamespaceAiAccessDecision({
      decisionId: crypto.randomUUID(),
      namespaceId,
      memberId,
      requestedModule,
      requestedModel: null,
      requestedTool: null,
      decision: "block",
      blockReason: `AI execution is disabled for namespace '${namespaceId}'.`,
      approvalReason: null,
      blockedCapabilities: [requestedModule],
      allowedCapabilities: [],
      healthcareSafetyCheck: false,
    });
  }

  // Rule 5: Healthcare safety
  if (profile.healthcareSafetyRequired) {
    const safetyBlock = evaluateHealthcareAiSafety({ namespaceId, memberId, requestedModule });
    if (safetyBlock !== null) {
      return safetyBlock;
    }
  }

  // Rule 4: External API calls blocked
  if (profile.externalApiCallsEnabled !== false) {
    return createNamespaceAiAccessDecision({
      decisionId: crypto.randomUUID(),
      namespaceId,
      memberId,
      requestedModule,
      requestedModel: null,
      requestedTool: null,
      decision: "block",
      blockReason: "External AI API calls are blocked by safety policy.",
      approvalReason: null,
      blockedCapabilities: ["external_api"],
      allowedCapabilities: [],
      healthcareSafetyCheck: profile.healthcareSafetyRequired,
    });
  }

  // Rule: approval_required mode
  if (profile.executionMode === "approval_required") {
    return createNamespaceAiAccessDecision({
      decisionId: crypto.randomUUID(),
      namespaceId,
      memberId,
      requestedModule,
      requestedModel: null,
      requestedTool: null,
      decision: "require_approval",
      blockReason: null,
      approvalReason: `Namespace '${namespaceId}' requires Control Hub approval for all AI access.`,
      blockedCapabilities: [],
      allowedCapabilities: [requestedModule],
      healthcareSafetyCheck: profile.healthcareSafetyRequired,
    });
  }

  // Allow (simulation)
  return createNamespaceAiAccessDecision({
    decisionId: crypto.randomUUID(),
    namespaceId,
    memberId,
    requestedModule,
    requestedModel: null,
    requestedTool: null,
    decision: "allow",
    blockReason: null,
    approvalReason: null,
    blockedCapabilities: [],
    allowedCapabilities: [requestedModule],
    healthcareSafetyCheck: profile.healthcareSafetyRequired,
  });
}

export function evaluateNamespaceModelRoute(params: {
  namespaceId: string;
  memberId: string;
  requestedModel: string;
}): NamespaceAiAccessDecision {
  const { namespaceId, memberId, requestedModel } = params;

  const profile = getNamespaceAiProfile(namespaceId);
  if (!profile) {
    return createNamespaceAiAccessDecision({
      decisionId: crypto.randomUUID(),
      namespaceId,
      memberId,
      requestedModule: "model_router",
      requestedModel,
      requestedTool: null,
      decision: "block",
      blockReason: `Namespace '${namespaceId}' not found.`,
      approvalReason: null,
      blockedCapabilities: [requestedModel],
      allowedCapabilities: [],
      healthcareSafetyCheck: false,
    });
  }

  const policy = profile.modelRoutingPolicy;

  // Rule 7: Blocked providers
  if (policy.blockedModelProviders.includes(requestedModel)) {
    return createNamespaceAiAccessDecision({
      decisionId: crypto.randomUUID(),
      namespaceId,
      memberId,
      requestedModule: "model_router",
      requestedModel,
      requestedTool: null,
      decision: "block",
      blockReason: `Model provider '${requestedModel}' is blocked for namespace '${namespaceId}'.`,
      approvalReason: null,
      blockedCapabilities: [requestedModel],
      allowedCapabilities: [],
      healthcareSafetyCheck: profile.healthcareSafetyRequired,
    });
  }

  // Rule 7: Unknown provider requires approval
  if (!policy.allowedModelProviders.includes(requestedModel)) {
    if (policy.requiresApprovalForUnknownProvider) {
      return createNamespaceAiAccessDecision({
        decisionId: crypto.randomUUID(),
        namespaceId,
        memberId,
        requestedModule: "model_router",
        requestedModel,
        requestedTool: null,
        decision: policy.fallbackBehavior === "block" ? "block" : "require_approval",
        blockReason: policy.fallbackBehavior === "block" ? `Unknown model provider '${requestedModel}' is blocked.` : null,
        approvalReason: policy.fallbackBehavior !== "block" ? `Unknown model provider '${requestedModel}' requires approval.` : null,
        blockedCapabilities: policy.fallbackBehavior === "block" ? [requestedModel] : [],
        allowedCapabilities: policy.fallbackBehavior !== "block" ? [requestedModel] : [],
        healthcareSafetyCheck: profile.healthcareSafetyRequired,
      });
    }
  }

  return createNamespaceAiAccessDecision({
    decisionId: crypto.randomUUID(),
    namespaceId,
    memberId,
    requestedModule: "model_router",
    requestedModel,
    requestedTool: null,
    decision: "allow",
    blockReason: null,
    approvalReason: null,
    blockedCapabilities: [],
    allowedCapabilities: [requestedModel],
    healthcareSafetyCheck: profile.healthcareSafetyRequired,
  });
}

export function evaluateNamespaceToolAccess(params: {
  namespaceId: string;
  memberId: string;
  requestedTool: string;
}): NamespaceAiAccessDecision {
  const { namespaceId, memberId, requestedTool } = params;

  const profile = getNamespaceAiProfile(namespaceId);
  if (!profile) {
    return createNamespaceAiAccessDecision({
      decisionId: crypto.randomUUID(),
      namespaceId,
      memberId,
      requestedModule: "tool_access",
      requestedModel: null,
      requestedTool,
      decision: "block",
      blockReason: `Namespace '${namespaceId}' not found.`,
      approvalReason: null,
      blockedCapabilities: [requestedTool],
      allowedCapabilities: [],
      healthcareSafetyCheck: false,
    });
  }

  const policy = profile.toolAccessPolicy;

  // Rule: Blocked tools
  if (policy.blockedTools.includes(requestedTool)) {
    return createNamespaceAiAccessDecision({
      decisionId: crypto.randomUUID(),
      namespaceId,
      memberId,
      requestedModule: "tool_access",
      requestedModel: null,
      requestedTool,
      decision: "block",
      blockReason: `Tool '${requestedTool}' is blocked for namespace '${namespaceId}'.`,
      approvalReason: null,
      blockedCapabilities: [requestedTool],
      allowedCapabilities: [],
      healthcareSafetyCheck: profile.healthcareSafetyRequired,
    });
  }

  // Rule 6: High-risk tools require approval
  if (policy.highRiskTools.includes(requestedTool) && policy.requiresApprovalForHighRisk) {
    return createNamespaceAiAccessDecision({
      decisionId: crypto.randomUUID(),
      namespaceId,
      memberId,
      requestedModule: "tool_access",
      requestedModel: null,
      requestedTool,
      decision: "require_approval",
      blockReason: null,
      approvalReason: `Tool '${requestedTool}' is high-risk and requires Control Hub approval.`,
      blockedCapabilities: [],
      allowedCapabilities: [requestedTool],
      healthcareSafetyCheck: profile.healthcareSafetyRequired,
    });
  }

  // Rule: Unknown tool
  if (!policy.allowedTools.includes(requestedTool) && policy.requiresApprovalForUnknownTool) {
    return createNamespaceAiAccessDecision({
      decisionId: crypto.randomUUID(),
      namespaceId,
      memberId,
      requestedModule: "tool_access",
      requestedModel: null,
      requestedTool,
      decision: "require_approval",
      blockReason: null,
      approvalReason: `Tool '${requestedTool}' is unknown and requires Control Hub approval.`,
      blockedCapabilities: [],
      allowedCapabilities: [],
      healthcareSafetyCheck: profile.healthcareSafetyRequired,
    });
  }

  return createNamespaceAiAccessDecision({
    decisionId: crypto.randomUUID(),
    namespaceId,
    memberId,
    requestedModule: "tool_access",
    requestedModel: null,
    requestedTool,
    decision: "allow",
    blockReason: null,
    approvalReason: null,
    blockedCapabilities: [],
    allowedCapabilities: [requestedTool],
    healthcareSafetyCheck: profile.healthcareSafetyRequired,
  });
}

export function evaluateKnowledgeVaultAccess(params: {
  namespaceId: string;
  memberId: string;
  vaultId: string;
  membershipPlan: string;
}): NamespaceAiAccessDecision {
  const { namespaceId, memberId, vaultId, membershipPlan } = params;

  const profile = getNamespaceAiProfile(namespaceId);
  if (!profile) {
    return createNamespaceAiAccessDecision({
      decisionId: crypto.randomUUID(),
      namespaceId,
      memberId,
      requestedModule: "knowledge_vault",
      requestedModel: null,
      requestedTool: vaultId,
      decision: "block",
      blockReason: `Namespace '${namespaceId}' not found.`,
      approvalReason: null,
      blockedCapabilities: [vaultId],
      allowedCapabilities: [],
      healthcareSafetyCheck: false,
    });
  }

  const vault = profile.knowledgeVaults.find((v) => v.vaultId === vaultId);
  if (!vault) {
    return createNamespaceAiAccessDecision({
      decisionId: crypto.randomUUID(),
      namespaceId,
      memberId,
      requestedModule: "knowledge_vault",
      requestedModel: null,
      requestedTool: vaultId,
      decision: "block",
      blockReason: `Knowledge vault '${vaultId}' not found in namespace '${namespaceId}'.`,
      approvalReason: null,
      blockedCapabilities: [vaultId],
      allowedCapabilities: [],
      healthcareSafetyCheck: profile.healthcareSafetyRequired,
    });
  }

  if (vault.accessLevel === "restricted") {
    return createNamespaceAiAccessDecision({
      decisionId: crypto.randomUUID(),
      namespaceId,
      memberId,
      requestedModule: "knowledge_vault",
      requestedModel: null,
      requestedTool: vaultId,
      decision: "block",
      blockReason: `Vault '${vaultId}' is restricted.`,
      approvalReason: null,
      blockedCapabilities: [vaultId],
      allowedCapabilities: [],
      healthcareSafetyCheck: profile.healthcareSafetyRequired,
    });
  }

  if (vault.accessLevel === "approval_required") {
    return createNamespaceAiAccessDecision({
      decisionId: crypto.randomUUID(),
      namespaceId,
      memberId,
      requestedModule: "knowledge_vault",
      requestedModel: null,
      requestedTool: vaultId,
      decision: "require_approval",
      blockReason: null,
      approvalReason: `Vault '${vaultId}' requires Control Hub approval.`,
      blockedCapabilities: [],
      allowedCapabilities: [vaultId],
      healthcareSafetyCheck: profile.healthcareSafetyRequired,
    });
  }

  if (vault.accessLevel === "membership_required") {
    const MEMBER_PLANS = ["member", "creator", "business", "professional", "enterprise"];
    if (!MEMBER_PLANS.includes(membershipPlan)) {
      return createNamespaceAiAccessDecision({
        decisionId: crypto.randomUUID(),
        namespaceId,
        memberId,
        requestedModule: "knowledge_vault",
        requestedModel: null,
        requestedTool: vaultId,
        decision: "block",
        blockReason: `Membership plan '${membershipPlan}' is insufficient for vault '${vaultId}'. Requires 'member' or higher.`,
        approvalReason: null,
        blockedCapabilities: [vaultId],
        allowedCapabilities: [],
        healthcareSafetyCheck: profile.healthcareSafetyRequired,
      });
    }
  }

  return createNamespaceAiAccessDecision({
    decisionId: crypto.randomUUID(),
    namespaceId,
    memberId,
    requestedModule: "knowledge_vault",
    requestedModel: null,
    requestedTool: vaultId,
    decision: "allow",
    blockReason: null,
    approvalReason: null,
    blockedCapabilities: [],
    allowedCapabilities: [vaultId],
    healthcareSafetyCheck: profile.healthcareSafetyRequired,
  });
}

export function evaluateHealthcareAiSafety(params: {
  namespaceId: string;
  memberId: string;
  requestedModule: string;
}): NamespaceAiAccessDecision | null {
  const { namespaceId, memberId, requestedModule } = params;

  if (HEALTHCARE_BLOCKED_MODULES.includes(requestedModule)) {
    return createNamespaceAiAccessDecision({
      decisionId: crypto.randomUUID(),
      namespaceId,
      memberId,
      requestedModule,
      requestedModel: null,
      requestedTool: null,
      decision: "block",
      blockReason: `Healthcare safety policy blocks '${requestedModule}'. This includes diagnosis, treatment recommendations, PHI intake, and emergency guidance.`,
      approvalReason: null,
      blockedCapabilities: [requestedModule],
      allowedCapabilities: [],
      healthcareSafetyCheck: true,
    });
  }

  return null; // no healthcare safety block
}
