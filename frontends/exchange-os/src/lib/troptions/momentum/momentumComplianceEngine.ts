/**
 * Troptions Momentum Compliance Engine
 *
 * Gate-based evaluation of Momentum claims, launch readiness, user access,
 * payment readiness, jurisdiction readiness, and compliance snapshots.
 *
 * SIMULATION ONLY — All financial/blockchain operations return blocked status.
 * No live payments, no token issuance, no blockchain execution.
 *
 * @see docs/troptions/momentum/revamp/compliance-modernization-framework.md
 */

import {
  MOMENTUM_SAFETY,
  MOMENTUM_PROGRAM,
  MOMENTUM_PHASES,
  MOMENTUM_COMPLIANCE_GATES,
  MOMENTUM_RISK_DISCLOSURES,
  MOMENTUM_ALLOWED_CLAIMS,
  MOMENTUM_PROHIBITED_CLAIMS,
  type MomentumGateStatus,
} from "@/content/troptions/momentum/momentumRegistry";

// ─── Result Types ─────────────────────────────────────────────────────────────

export type EvaluationOutcome = "pass" | "blocked" | "needs_review" | "simulation";

export interface EvaluationResult {
  readonly outcome: EvaluationOutcome;
  readonly reason: string;
  readonly liveExecutionAllowed: false;
  readonly requiresLegalReview: boolean;
  readonly requiresComplianceReview: boolean;
  readonly timestamp: string;
}

export interface ClaimEvaluationResult extends EvaluationResult {
  readonly claimText: string;
  readonly matchedRule?: string;
}

export interface LaunchReadinessResult {
  readonly overallStatus: "not_ready" | "simulation_only" | "partial";
  readonly blockedGates: readonly string[];
  readonly activeGates: readonly string[];
  readonly partialGates: readonly string[];
  readonly simulationGates: readonly string[];
  readonly disclosuresRequired: readonly string[];
  readonly liveExecutionAllowed: false;
  readonly timestamp: string;
}

export interface UserAccessResult {
  readonly accessGranted: boolean;
  readonly accessLevel: "documentation" | "simulation" | "none";
  readonly reason: string;
  readonly livePaymentsAllowed: false;
  readonly blockchainActionsAllowed: false;
  readonly timestamp: string;
}

export interface PaymentReadinessResult {
  readonly paymentsEnabled: false;
  readonly blockedBy: readonly string[];
  readonly requiredGates: readonly string[];
  readonly timestamp: string;
}

export interface JurisdictionReadinessResult {
  readonly jurisdiction: string;
  readonly status: "not_cleared" | "simulation_only";
  readonly blockedFeatures: readonly string[];
  readonly timestamp: string;
}

export interface ComplianceSnapshot {
  readonly programId: string;
  readonly programName: string;
  readonly snapshotAt: string;
  readonly overallStatus: "documentation_only";
  readonly safety: typeof MOMENTUM_SAFETY;
  readonly gateStatuses: ReadonlyArray<{
    id: string;
    name: string;
    status: MomentumGateStatus;
    currentBlock: string;
  }>;
  readonly phaseStatuses: ReadonlyArray<{
    id: string;
    phase: number;
    name: string;
    status: string;
    liveExecutionEnabled: false;
  }>;
  readonly totalRiskDisclosures: number;
  readonly prohibitedClaimsCount: number;
  readonly allowedClaimsCount: number;
  readonly liveExecutionAllowed: false;
  readonly blockchainExecutionAllowed: false;
  readonly paymentsAllowed: false;
}

// ─── Claim Evaluation ─────────────────────────────────────────────────────────

/**
 * Evaluates whether a given claim is permitted under the Momentum compliance framework.
 *
 * Returns `blocked` for any prohibited phrase pattern. Returns `pass` only for
 * explicitly allowed claims. All financial/investment/return language is blocked.
 */
export function evaluateMomentumClaim(claimText: string): ClaimEvaluationResult {
  const normalized = claimText.toLowerCase();

  // Check against prohibited claims
  for (const prohibited of MOMENTUM_PROHIBITED_CLAIMS) {
    if (normalized.includes(prohibited.claim.toLowerCase())) {
      return {
        outcome: "blocked",
        reason: prohibited.reason,
        claimText,
        matchedRule: prohibited.id,
        liveExecutionAllowed: false,
        requiresLegalReview: true,
        requiresComplianceReview: true,
        timestamp: new Date().toISOString(),
      };
    }
  }

  // Check for implicit financial promise patterns
  const implicitProhibitions: Array<{ pattern: string; reason: string }> = [
    {
      pattern: "guaranteed",
      reason: "No outcomes are guaranteed. 'Guaranteed' language is prohibited in financial/technology contexts.",
    },
    {
      pattern: "risk-free",
      reason: "Risk-free claims are false and prohibited.",
    },
    {
      pattern: "risk free",
      reason: "Risk-free claims are false and prohibited.",
    },
    {
      pattern: "passive income",
      reason: "Passive income claims imply investment returns — prohibited without proper securities registration.",
    },
    {
      pattern: "invest",
      reason: "Investment solicitation language requires proper securities registration and disclosure.",
    },
    {
      pattern: "returns",
      reason: "Return promise language requires proper financial disclosure. Use 'potential outcomes subject to risk' instead.",
    },
    {
      pattern: "profit",
      reason: "Profit promise language requires proper financial disclosure.",
    },
    {
      pattern: "earning",
      reason: "Earnings claims require substantiation. Use factual documentation language instead.",
    },
  ];

  for (const { pattern, reason } of implicitProhibitions) {
    if (normalized.includes(pattern)) {
      return {
        outcome: "blocked",
        reason,
        claimText,
        matchedRule: `IMPLICIT-${pattern.toUpperCase().replace(/\s/g, "_")}`,
        liveExecutionAllowed: false,
        requiresLegalReview: true,
        requiresComplianceReview: false,
        timestamp: new Date().toISOString(),
      };
    }
  }

  // Check for explicitly allowed claims
  const allowed = MOMENTUM_ALLOWED_CLAIMS.some(
    (a) => normalized.includes(a.claim.toLowerCase().substring(0, 30))
  );

  if (allowed) {
    return {
      outcome: "pass",
      reason: "Claim matches an explicitly approved documentation or informational statement.",
      claimText,
      liveExecutionAllowed: false,
      requiresLegalReview: false,
      requiresComplianceReview: false,
      timestamp: new Date().toISOString(),
    };
  }

  // Neutral / needs review
  return {
    outcome: "needs_review",
    reason: "Claim does not match prohibited patterns but has not been explicitly approved. Requires compliance review before publication.",
    claimText,
    liveExecutionAllowed: false,
    requiresLegalReview: false,
    requiresComplianceReview: true,
    timestamp: new Date().toISOString(),
  };
}

// ─── Launch Readiness ─────────────────────────────────────────────────────────

/**
 * Evaluates overall Momentum launch readiness based on compliance gate statuses.
 * Current state: simulation_only — no live features are enabled.
 */
export function evaluateMomentumLaunchReadiness(): LaunchReadinessResult {
  const blocked: string[] = [];
  const active: string[] = [];
  const partial: string[] = [];
  const simulation: string[] = [];

  for (const gate of MOMENTUM_COMPLIANCE_GATES) {
    switch (gate.status) {
      case "locked":
        blocked.push(gate.id);
        break;
      case "active":
        active.push(gate.id);
        break;
      case "partial":
        partial.push(gate.id);
        break;
      case "simulation":
        simulation.push(gate.id);
        break;
    }
  }

  const disclosuresRequired = MOMENTUM_RISK_DISCLOSURES
    .filter((d) => d.mandatory)
    .map((d) => d.id);

  return {
    overallStatus: "simulation_only",
    blockedGates: blocked,
    activeGates: active,
    partialGates: partial,
    simulationGates: simulation,
    disclosuresRequired,
    liveExecutionAllowed: false,
    timestamp: new Date().toISOString(),
  };
}

// ─── User Access ──────────────────────────────────────────────────────────────

/**
 * Evaluates what level of access a user should receive for Momentum features.
 * Current state: documentation access only. No payment or blockchain access.
 */
export function evaluateMomentumUserAccess(_userId?: string): UserAccessResult {
  // Safety check — always enforce simulation-only in current state
  if (MOMENTUM_SAFETY.livePaymentsEnabled) {
    // This branch should never be reached — safety constants are readonly
    return {
      accessGranted: false,
      accessLevel: "none",
      reason: "Unexpected safety state — live payments should not be enabled.",
      livePaymentsAllowed: false,
      blockchainActionsAllowed: false,
      timestamp: new Date().toISOString(),
    };
  }

  return {
    accessGranted: true,
    accessLevel: "documentation",
    reason:
      "Documentation and informational access granted. Live payments, token issuance, and " +
      "blockchain execution are disabled until compliance gates are cleared.",
    livePaymentsAllowed: false,
    blockchainActionsAllowed: false,
    timestamp: new Date().toISOString(),
  };
}

// ─── Payment Readiness ────────────────────────────────────────────────────────

/**
 * Evaluates whether Momentum payment features can be activated.
 * Current state: payments are always blocked — requires MTL and AML/KYC clearance.
 */
export function evaluateMomentumPaymentReadiness(): PaymentReadinessResult {
  const blockedBy: string[] = [];
  const requiredGates = ["GATE-MTL", "GATE-AML", "GATE-SEC"];

  for (const gateId of requiredGates) {
    const gate = MOMENTUM_COMPLIANCE_GATES.find((g) => g.id === gateId);
    if (!gate || gate.status === "locked") {
      blockedBy.push(gateId);
    }
  }

  return {
    paymentsEnabled: false,
    blockedBy,
    requiredGates,
    timestamp: new Date().toISOString(),
  };
}

// ─── Jurisdiction Readiness ───────────────────────────────────────────────────

/**
 * Evaluates readiness for a given jurisdiction.
 * No jurisdiction is currently cleared for live financial operations.
 */
export function evaluateMomentumJurisdictionReadiness(
  jurisdiction: string
): JurisdictionReadinessResult {
  const blockedFeatures = [
    "live-payments",
    "token-issuance",
    "securities-offering",
    "money-transmission",
    "investment-advice",
    "banking-services",
  ];

  return {
    jurisdiction,
    status: "simulation_only",
    blockedFeatures,
    timestamp: new Date().toISOString(),
  };
}

// ─── Compliance Snapshot ──────────────────────────────────────────────────────

/**
 * Builds a full compliance snapshot of the current Momentum program state.
 * Used by admin dashboards, API endpoints, and audit logs.
 */
export function buildMomentumComplianceSnapshot(): ComplianceSnapshot {
  return {
    programId: MOMENTUM_PROGRAM.id,
    programName: MOMENTUM_PROGRAM.name,
    snapshotAt: new Date().toISOString(),
    overallStatus: "documentation_only",
    safety: MOMENTUM_SAFETY,
    gateStatuses: MOMENTUM_COMPLIANCE_GATES.map((gate) => ({
      id: gate.id,
      name: gate.name,
      status: gate.status,
      currentBlock: gate.currentBlock,
    })),
    phaseStatuses: MOMENTUM_PHASES.map((phase) => ({
      id: phase.id,
      phase: phase.phase,
      name: phase.name,
      status: phase.status,
      liveExecutionEnabled: false as const,
    })),
    totalRiskDisclosures: MOMENTUM_RISK_DISCLOSURES.length,
    prohibitedClaimsCount: MOMENTUM_PROHIBITED_CLAIMS.length,
    allowedClaimsCount: MOMENTUM_ALLOWED_CLAIMS.length,
    liveExecutionAllowed: false,
    blockchainExecutionAllowed: false,
    paymentsAllowed: false,
  };
}
