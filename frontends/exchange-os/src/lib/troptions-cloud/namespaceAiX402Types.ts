/**
 * Troptions Cloud — Namespace AI + x402 Types
 *
 * SAFETY INVARIANTS (enforced as TypeScript literal types):
 *   livePaymentsEnabled: false
 *   externalApiCallsEnabled: false
 *   simulationOnly: true
 *   requiresControlHubApproval: true
 *
 * No live payments, no live wallet movement, no external AI calls,
 * no PHI intake, no diagnosis/treatment/emergency guidance.
 * All events are simulation-only until an explicit approval gate enables them.
 */

// ─── Execution modes ──────────────────────────────────────────────────────────

export type NamespaceExecutionMode =
  | "read_only"
  | "simulation_only"
  | "approval_required"
  | "disabled";

export type NamespaceDataResidencyMode =
  | "local_only"
  | "regional"
  | "cloud_gated"
  | "unrestricted";

export type NamespaceAuditMode =
  | "full"
  | "summary"
  | "minimal"
  | "disabled";

// ─── AI infrastructure profile ────────────────────────────────────────────────

export interface NamespaceAiSystemInstance {
  systemId: string;
  displayName: string;
  category: string;
  enabled: boolean;
  requiresApproval: boolean;
  executionMode: NamespaceExecutionMode;
  /** Always false — no external API calls without explicit gate */
  externalApiCallsEnabled: false;
}

export interface NamespaceKnowledgeVaultProfile {
  vaultId: string;
  displayName: string;
  category: string;
  accessLevel: "open" | "membership_required" | "approval_required" | "restricted";
  queryEnabled: boolean;
  requiresComplianceReview: boolean;
}

export interface NamespaceModelRoutingPolicy {
  allowedModelProviders: string[];
  blockedModelProviders: string[];
  defaultProvider: string | null;
  requiresApprovalForUnknownProvider: boolean;
  fallbackBehavior: "block" | "queue_for_approval" | "use_default";
}

export interface NamespaceToolAccessPolicy {
  allowedTools: string[];
  blockedTools: string[];
  highRiskTools: string[];
  requiresApprovalForHighRisk: boolean;
  requiresApprovalForUnknownTool: boolean;
}

export interface NamespaceAiInfrastructureProfile {
  namespaceId: string;
  displayName: string;
  aiWorkspaceEnabled: boolean;
  sovereignAiSystems: NamespaceAiSystemInstance[];
  knowledgeVaults: NamespaceKnowledgeVaultProfile[];
  allowedModelProviders: string[];
  blockedModelProviders: string[];
  allowedTools: string[];
  blockedTools: string[];
  /** Always false — no external API calls without explicit approval gate */
  externalApiCallsEnabled: false;
  /** Always true — every AI action must be Control Hub approved before production */
  requiresControlHubApproval: true;
  healthcareSafetyRequired: boolean;
  dataResidencyMode: NamespaceDataResidencyMode;
  auditMode: NamespaceAuditMode;
  executionMode: NamespaceExecutionMode;
  modelRoutingPolicy: NamespaceModelRoutingPolicy;
  toolAccessPolicy: NamespaceToolAccessPolicy;
}

// ─── x402 profile ─────────────────────────────────────────────────────────────

export type X402UsageMeteringMode =
  | "disabled"
  | "simulation_only"
  | "metered_simulation"
  | "approval_required";

export type X402CreditLedgerMode =
  | "disabled"
  | "simulation_only"
  | "balance_tracking_simulation";

export type X402ActionPolicy =
  | "free"
  | "metered"
  | "approval_required"
  | "blocked";

export interface X402ServicePricingTemplate {
  actionId: string;
  actionLabel: string;
  simulatedCreditCost: number;
  currency: "TROPTIONS_CREDIT" | "XRP_SIM" | "XLM_SIM" | "USD_SIM";
  membershipRequirement: string | null;
  approvalRequired: boolean;
}

export interface NamespaceX402Profile {
  namespaceId: string;
  /** Always false — no live payments without explicit gate */
  x402Enabled: false;
  /** Always true — all payment logic is simulation-only */
  simulationOnly: true;
  /** Always false — no live payment rails */
  livePaymentsEnabled: false;
  acceptedRails: string[];
  usageMeteringMode: X402UsageMeteringMode;
  creditLedgerMode: X402CreditLedgerMode;
  membershipPlanMapping: Record<string, string[]>; // plan → allowed actions
  servicePricingTemplates: X402ServicePricingTemplate[];
  paymentRequiredActions: string[];
  freeActions: string[];
  approvalRequiredActions: string[];
  blockedActions: string[];
  complianceNotes: string[];
  recommendedNextAction: string;
}

// ─── Usage events ─────────────────────────────────────────────────────────────

export interface NamespaceX402UsageEvent {
  id: string;
  namespaceId: string;
  memberId: string;
  actionId: string;
  actionLabel: string;
  simulatedCreditCost: number;
  currency: string;
  membershipPlan: string;
  policy: X402ActionPolicy;
  /** Always "simulation" — no live charges */
  chargeMode: "simulation";
  timestamp: string;
  controlHubTaskId: string | null;
  auditToken: string;
}

export interface NamespaceX402CreditLedgerEntry {
  id: string;
  namespaceId: string;
  memberId: string;
  type: "credit" | "debit" | "reserve" | "release";
  simulatedAmount: number;
  currency: string;
  referenceActionId: string | null;
  /** Always "simulation" */
  ledgerMode: "simulation";
  balanceAfter: number;
  timestamp: string;
  auditToken: string;
}

export interface NamespaceX402PaymentDecision {
  decisionId: string;
  namespaceId: string;
  actionId: string;
  memberId: string;
  membershipPlan: string;
  decision: "allow_free" | "allow_metered" | "require_approval" | "block";
  simulatedCreditCost: number;
  blockReason: string | null;
  approvalReason: string | null;
  /** Always true */
  simulationOnly: true;
  /** Always false */
  livePaymentTriggered: false;
  timestamp: string;
  auditToken: string;
}

// ─── AI access decisions ──────────────────────────────────────────────────────

export interface NamespaceAiAccessDecision {
  decisionId: string;
  namespaceId: string;
  memberId: string;
  requestedModule: string;
  requestedModel: string | null;
  requestedTool: string | null;
  decision: "allow" | "block" | "require_approval";
  blockReason: string | null;
  approvalReason: string | null;
  blockedCapabilities: string[];
  allowedCapabilities: string[];
  /** Always true */
  requiresControlHubApproval: true;
  /** Always false */
  externalApiCallTriggered: false;
  /** Always false */
  liveExecutionTriggered: false;
  healthcareSafetyCheck: boolean;
  timestamp: string;
  auditToken: string;
}

// ─── Audit events ─────────────────────────────────────────────────────────────

export type NamespaceAiX402AuditEventType =
  | "ai_access_evaluated"
  | "model_route_evaluated"
  | "tool_access_evaluated"
  | "knowledge_vault_access_evaluated"
  | "x402_action_evaluated"
  | "x402_charge_simulated"
  | "x402_credit_simulated"
  | "ai_x402_snapshot_generated";

export interface NamespaceAiX402AuditEvent {
  id: string;
  eventType: NamespaceAiX402AuditEventType;
  namespaceId: string;
  memberId: string;
  summary: string;
  decisionId: string | null;
  controlHubTaskId: string | null;
  simulationOnly: true;
  liveActionTriggered: false;
  timestamp: string;
  auditToken: string;
  metadata: Record<string, unknown>;
}

// ─── Snapshot ─────────────────────────────────────────────────────────────────

export interface NamespaceAiX402Snapshot {
  snapshotId: string;
  namespaceId: string;
  generatedAt: string;
  aiInfrastructure: NamespaceAiInfrastructureProfile;
  x402Profile: NamespaceX402Profile;
  recentAiAccessDecisions: NamespaceAiAccessDecision[];
  recentX402Decisions: NamespaceX402PaymentDecision[];
  recentUsageEvents: NamespaceX402UsageEvent[];
  recentAuditEvents: NamespaceAiX402AuditEvent[];
  controlHubPersistenceStatus: "connected" | "degraded" | "unavailable";
  safetyStatus: {
    livePaymentsDisabled: true;
    liveWalletMovementDisabled: true;
    externalAiCallsDisabled: true;
    healthcareSafetyEnabled: boolean;
    phiIntakeBlocked: true;
    controlHubApprovalRequired: true;
  };
}
