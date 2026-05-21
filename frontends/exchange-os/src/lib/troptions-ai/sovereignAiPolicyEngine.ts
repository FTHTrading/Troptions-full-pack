/**
 * Troptions Sovereign AI — Policy Engine
 *
 * Evaluates whether an AI system operation is allowed (simulation) or blocked (live).
 *
 * SAFETY INVARIANTS:
 * - blockedForLive is always true — no live execution in this phase
 * - Healthcare restrictions are always enforced
 * - Financial restrictions are always enforced
 * - External API calls are always blocked by default
 * - Control Hub approval is always required
 * - Live automation is always blocked
 */

import type { TroptionsSovereignAiSystem, TroptionsSovereignAiVertical } from "@/content/troptions-ai/sovereignAiRegistry";
import type { TroptionsKnowledgeSensitivity } from "@/content/troptions-ai/knowledgeVaultRegistry";
import type { TroptionsModelProvider } from "./modelRouter";

// ─── Policy Check Input ────────────────────────────────────────────────────────

export interface TroptionsPolicyCheckInput {
  namespaceActive: boolean;
  membershipActive: boolean;
  aiSystem: TroptionsSovereignAiSystem;
  requestedTool?: string;
  dataSensitivities: TroptionsKnowledgeSensitivity[];
  requestedModelProvider?: TroptionsModelProvider | string;
  externalApiCallsEnabled: boolean;
  liveAutomationRequested: boolean;
}

// ─── Audit Event ──────────────────────────────────────────────────────────────

export interface TroptionsPolicyAuditEvent {
  eventType: "policy_check";
  systemId: string;
  namespaceId: string;
  vertical: TroptionsSovereignAiVertical;
  allowedForSimulation: boolean;
  blockedForLive: true;
  blockerCount: number;
  warningCount: number;
  timestamp: string;
}

// ─── Policy Decision ──────────────────────────────────────────────────────────

export interface TroptionsPolicyDecision {
  allowedForSimulation: boolean;
  blockedForLive: true;
  blockers: string[];
  warnings: string[];
  requiredApprovals: string[];
  auditEvent: TroptionsPolicyAuditEvent;
}

// ─── Healthcare Vertical Checks ───────────────────────────────────────────────

const HEALTHCARE_BLOCKED_TOOLS = [
  "medical_diagnosis",
  "treatment_planner",
  "prescription_helper",
  "phi_reader",
  "clinical_decision_support",
];

// ─── Financial Vertical Checks ────────────────────────────────────────────────

const FINANCIAL_BLOCKED_TOOLS = [
  "investment_advisor",
  "financial_returns_calculator",
  "securities_router",
  "yield_calculator",
];

// ─── External Provider Check ──────────────────────────────────────────────────

const EXTERNAL_PROVIDERS: (TroptionsModelProvider | string)[] = [
  "openai_placeholder",
  "anthropic_placeholder",
  "google_placeholder",
];

const SENSITIVE_DATA_TYPES: TroptionsKnowledgeSensitivity[] = [
  "confidential",
  "regulated",
  "healthcare_restricted",
  "financial_restricted",
  "legal_restricted",
];

// ─── Policy Engine ────────────────────────────────────────────────────────────

export function evaluateAiSystemPolicy(
  input: TroptionsPolicyCheckInput
): TroptionsPolicyDecision {
  const blockers: string[] = [];
  const warnings: string[] = [];
  const requiredApprovals: string[] = [];

  // 1. Namespace active
  if (!input.namespaceActive) {
    blockers.push("Namespace is not active. AI system cannot be used.");
  }

  // 2. Membership active
  if (!input.membershipActive) {
    blockers.push("Membership is not active. AI system access requires an active Troptions membership.");
  }

  // 3. AI system status check
  const status = input.aiSystem.status;
  if (status === "blocked") {
    blockers.push("AI system is blocked by the Control Hub. Contact Troptions support.");
  }
  if (status === "archived") {
    blockers.push("AI system is archived and cannot be used.");
  }
  if (status === "pending_review") {
    blockers.push("AI system is pending review. It must be approved before use.");
    requiredApprovals.push("Control Hub review and approval");
  }
  if (status === "draft") {
    warnings.push("AI system is in draft status. It has not been reviewed yet.");
    requiredApprovals.push("Control Hub review and approval");
  }

  // 4. Control Hub approval
  if (input.aiSystem.requiresControlHubApproval) {
    requiredApprovals.push("Control Hub approval required before production activation.");
  }

  // 5. Legal review for sensitive use
  if (input.aiSystem.requiresLegalReviewForSensitiveUse) {
    const hasSensitive = input.dataSensitivities.some((s) =>
      SENSITIVE_DATA_TYPES.includes(s)
    );
    if (hasSensitive) {
      requiredApprovals.push("Legal review required for sensitive data use.");
    }
  }

  // 6. Data review
  if (input.aiSystem.requiresDataReview) {
    if (input.dataSensitivities.includes("healthcare_restricted")) {
      requiredApprovals.push("Healthcare compliance review required. BAA required before production.");
      blockers.push("Healthcare-restricted data cannot be used in production without compliance review and BAA.");
    }
    if (input.dataSensitivities.includes("financial_restricted")) {
      requiredApprovals.push("Financial compliance review required.");
      warnings.push("Financial-restricted data requires compliance review before AI use.");
    }
    if (input.dataSensitivities.includes("legal_restricted")) {
      requiredApprovals.push("Legal review required for legal-restricted data.");
      warnings.push("Legal-restricted data requires attorney review before AI use.");
    }
  }

  // 7. Model route check
  if (input.requestedModelProvider) {
    const isExternal = EXTERNAL_PROVIDERS.includes(input.requestedModelProvider);
    if (isExternal && !input.externalApiCallsEnabled) {
      blockers.push(`External model provider '${input.requestedModelProvider}' is blocked. External API calls are disabled by default.`);
    }
    const hasSensitiveData = input.dataSensitivities.some((s) =>
      ["confidential", "regulated", "healthcare_restricted", "financial_restricted", "legal_restricted"].includes(s)
    );
    if (isExternal && hasSensitiveData) {
      blockers.push(`Sensitive data cannot route to external provider '${input.requestedModelProvider}' without explicit Control Hub approval.`);
    }
  }

  // 8. Tool check
  if (input.requestedTool) {
    if (HEALTHCARE_BLOCKED_TOOLS.includes(input.requestedTool)) {
      blockers.push(`Tool '${input.requestedTool}' is blocked in all Troptions AI systems. Medical diagnosis and clinical tools are not permitted.`);
    }
    if (FINANCIAL_BLOCKED_TOOLS.includes(input.requestedTool)) {
      blockers.push(`Tool '${input.requestedTool}' is blocked. Investment advice and financial returns tools are not permitted.`);
    }

    // Check against system's enabled tools
    const toolAllowed = input.aiSystem.enabledTools.some((t) => t.id === input.requestedTool || t.name === input.requestedTool);
    const toolBlocked = !toolAllowed && input.aiSystem.enabledTools.length > 0;
    if (toolBlocked) {
      warnings.push(`Tool '${input.requestedTool}' is not in the enabled tools list for this AI system.`);
    }
  }

  // 9. Vertical restrictions
  const vertical = input.aiSystem.vertical;
  if (vertical === "healthcare_admin") {
    if (!input.dataSensitivities.every((s) => s !== "healthcare_restricted")) {
      warnings.push("Healthcare admin systems must undergo compliance review before processing any health-adjacent data.");
    }
    blockers.push("Healthcare admin vertical: medical diagnosis, treatment, PHI, and emergency guidance are always blocked.");
    requiredApprovals.push("Healthcare compliance review and BAA before production.");
  }

  // 10. Live automation check
  if (input.liveAutomationRequested) {
    blockers.push("Live automation is disabled. All AI system actions are simulation-only in this phase.");
  }

  if (input.aiSystem.liveAutomationEnabled) {
    blockers.push("AI system liveAutomationEnabled flag violation — must be false in this phase.");
  }

  // 11. External calls check
  if (input.aiSystem.externalApiCallsEnabled) {
    blockers.push("AI system externalApiCallsEnabled flag violation — must be false in this phase.");
  }

  // 12. Live execution check
  if (input.aiSystem.liveExecutionEnabled) {
    blockers.push("AI system liveExecutionEnabled flag violation — must be false in this phase.");
  }

  const allowedForSimulation = blockers.length === 0;

  const auditEvent: TroptionsPolicyAuditEvent = {
    eventType: "policy_check",
    systemId: input.aiSystem.id,
    namespaceId: input.aiSystem.namespaceId,
    vertical: input.aiSystem.vertical,
    allowedForSimulation,
    blockedForLive: true,
    blockerCount: blockers.length,
    warningCount: warnings.length,
    timestamp: new Date().toISOString(),
  };

  return {
    allowedForSimulation,
    blockedForLive: true,
    blockers,
    warnings,
    requiredApprovals,
    auditEvent,
  };
}
