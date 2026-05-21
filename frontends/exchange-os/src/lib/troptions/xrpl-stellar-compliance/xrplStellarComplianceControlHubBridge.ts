/**
 * XRPL/Stellar Institutional Compliance Control Hub Bridge
 *
 * Persists all institutional compliance scan results, ISO 20022 readiness reports,
 * GENIUS Act evaluations, jurisdiction decisions, and claim reviews to the Control Hub.
 *
 * Uses synchronous SQLite functions from controlHubStateStore.
 * No async, no live execution, no seeds or keys.
 */

import crypto from "node:crypto";

import {
  createTaskRecord,
  createSimulationRecord,
  createBlockedActionRecord,
  createAuditRecord,
  createRecommendationRecord,
} from "@/lib/troptions/controlHubStateStore";

import {
  getAllComplianceControls,
  getBlockedControls,
} from "@/content/troptions/xrplStellarInstitutionalComplianceRegistry";

import {
  createIso20022ReadinessReport,
} from "@/lib/troptions/xrpl-stellar-compliance/iso20022Mapping";

import {
  createGeniusActReadinessReport,
} from "@/lib/troptions/xrpl-stellar-compliance/geniusActReadinessEngine";

import {
  evaluateGlobalCompliance,
  reviewPublicClaim,
  type GlobalComplianceInput,
} from "@/lib/troptions/xrpl-stellar-compliance/globalCompliancePolicyEngine";

import {
  getAllJurisdictions,
} from "@/content/troptions/xrplStellarJurisdictionMatrix";

// ─── Token helper ──────────────────────────────────────────────────────────────

function makeAuditToken(): string {
  return `chk-${crypto.randomUUID()}`;
}

// ─── Return Types ──────────────────────────────────────────────────────────────

export interface XrplStellarCompliancePersistResult {
  readonly taskId: string;
  readonly auditRecordId: string;
  readonly auditToken: string;
  readonly persistedStatus: "persisted_simulation_only";
  readonly liveExecutionAllowed: false;
}

export interface XrplStellarComplianceSnapshot {
  readonly totalControls: number;
  readonly blockedControls: number;
  readonly jurisdictions: number;
  readonly liveExecutionAllowed: false;
  readonly snapshotAt: string;
}

// ─── Persist: Full Institutional Compliance Scan ──────────────────────────────

export function persistInstitutionalComplianceScan(): XrplStellarCompliancePersistResult {
  const auditToken = makeAuditToken();
  const allControls = getAllComplianceControls();
  const blockedControls = getBlockedControls();

  const taskRecord = createTaskRecord({
    intent: "xrpl-stellar-institutional-compliance-scan",
    status: "simulated",
    auditToken,
    routedTo: ["compliance-engine", "iso20022-engine", "genius-act-engine"],
    requiresApproval: true,
  });

  createSimulationRecord({
    taskId: taskRecord.id,
    simulationJson: JSON.stringify({
      type: "xrpl_stellar_institutional_compliance_scan",
      totalControls: allControls.length,
      blockedControlsCount: blockedControls.length,
      simulationOnly: true,
      liveExecutionAllowed: false,
    }),
  });

  // Persist blocked reasons per control
  for (const control of blockedControls) {
    createBlockedActionRecord({
      taskId: taskRecord.id,
      capabilityId: control.id,
      reason: `${control.displayName}: liveExecutionAllowed: false — ${control.riskIfMissing}`,
    });
  }

  const auditRecord = createAuditRecord({
    taskId: taskRecord.id,
    auditToken,
    intent: "xrpl-stellar-institutional-compliance-scan",
    actionType: "compliance_scan",
    outcome: "simulation_completed",
    blockedCount: blockedControls.length,
    requiresApproval: true,
  });

  createRecommendationRecord({
    taskId: taskRecord.id,
    recommendation:
      "Complete legal review and jurisdiction-specific analysis before production deployment. " +
      "All institutional compliance controls remain in simulation-only mode.",
    priority: "high",
  });

  return {
    taskId: taskRecord.id,
    auditRecordId: auditRecord.id,
    auditToken,
    persistedStatus: "persisted_simulation_only",
    liveExecutionAllowed: false,
  };
}

// ─── Persist: ISO 20022 Readiness Report ─────────────────────────────────────

export function persistIso20022ReadinessReport(): XrplStellarCompliancePersistResult {
  const auditToken = makeAuditToken();
  const report = createIso20022ReadinessReport();

  const taskRecord = createTaskRecord({
    intent: "iso-20022-readiness-report",
    status: "simulated",
    auditToken,
    routedTo: ["iso20022-engine"],
    requiresApproval: true,
  });

  createSimulationRecord({
    taskId: taskRecord.id,
    simulationJson: JSON.stringify({
      type: "iso_20022_readiness_report",
      mappingCount: report.mappings.length,
      simulationOnly: true,
      liveExecutionAllowed: false,
    }),
  });

  createBlockedActionRecord({
    taskId: taskRecord.id,
    capabilityId: "iso20022-live-certification",
    reason: "ISO 20022 certification is not available for blockchain tokens. Only message compatibility readiness assessment is provided.",
  });

  const auditRecord = createAuditRecord({
    taskId: taskRecord.id,
    auditToken,
    intent: "iso-20022-readiness-report",
    actionType: "readiness_assessment",
    outcome: "simulation_completed",
    blockedCount: 1,
    requiresApproval: true,
  });

  createRecommendationRecord({
    taskId: taskRecord.id,
    recommendation:
      "Use only 'ISO 20022 message compatibility readiness' language. " +
      "Do not claim ISO 20022 certification, compliance, or approval. " +
      "Engage a financial messaging standards consultant for detailed field-level mapping.",
    priority: "high",
  });

  return {
    taskId: taskRecord.id,
    auditRecordId: auditRecord.id,
    auditToken,
    persistedStatus: "persisted_simulation_only",
    liveExecutionAllowed: false,
  };
}

// ─── Persist: GENIUS Act Readiness Report ─────────────────────────────────────

export function persistGeniusActReadinessReport(): XrplStellarCompliancePersistResult {
  const auditToken = makeAuditToken();
  const report = createGeniusActReadinessReport();

  const taskRecord = createTaskRecord({
    intent: "genius-act-readiness-report",
    status: "simulated",
    auditToken,
    routedTo: ["genius-act-engine"],
    requiresApproval: true,
  });

  createSimulationRecord({
    taskId: taskRecord.id,
    simulationJson: JSON.stringify({
      type: "genius_act_readiness_report",
      decision: report.decision,
      requirementsCount: report.requirements.length,
      simulationOnly: true,
      liveExecutionAllowed: false,
      liveIssuanceAllowed: false,
    }),
  });

  // Persist each blocking reason
  for (const reason of report.blockedReasons) {
    createBlockedActionRecord({
      taskId: taskRecord.id,
      capabilityId: "genius-act-requirement",
      reason,
    });
  }

  const auditRecord = createAuditRecord({
    taskId: taskRecord.id,
    auditToken,
    intent: "genius-act-readiness-report",
    actionType: "readiness_assessment",
    outcome: report.decision,
    blockedCount: report.blockedReasons.length,
    requiresApproval: true,
  });

  createRecommendationRecord({
    taskId: taskRecord.id,
    recommendation:
      "Engage stablecoin regulatory counsel with GENIUS Act expertise. " +
      "Document reserve composition, attestation process, and redemption policy. " +
      "Do not claim GENIUS Act approval or compliance without actual regulatory authorization.",
    priority: "high",
  });

  return {
    taskId: taskRecord.id,
    auditRecordId: auditRecord.id,
    auditToken,
    persistedStatus: "persisted_simulation_only",
    liveExecutionAllowed: false,
  };
}

// ─── Persist: Jurisdiction Decision ──────────────────────────────────────────

export function persistJurisdictionDecision(
  jurisdictionCode: string,
  decision: string,
  blockedReasons: readonly string[]
): XrplStellarCompliancePersistResult {
  const auditToken = makeAuditToken();

  const taskRecord = createTaskRecord({
    intent: `jurisdiction-decision-${jurisdictionCode}`,
    status: "simulated",
    auditToken,
    routedTo: ["jurisdiction-matrix"],
    requiresApproval: true,
  });

  createSimulationRecord({
    taskId: taskRecord.id,
    simulationJson: JSON.stringify({
      type: "jurisdiction_decision",
      jurisdictionCode,
      decision,
      simulationOnly: true,
      liveExecutionAllowed: false,
    }),
  });

  for (const reason of blockedReasons) {
    createBlockedActionRecord({
      taskId: taskRecord.id,
      capabilityId: `jurisdiction-${jurisdictionCode}`,
      reason,
    });
  }

  const auditRecord = createAuditRecord({
    taskId: taskRecord.id,
    auditToken,
    intent: `jurisdiction-decision-${jurisdictionCode}`,
    actionType: "jurisdiction_review",
    outcome: decision,
    blockedCount: blockedReasons.length,
    requiresApproval: true,
  });

  createRecommendationRecord({
    taskId: taskRecord.id,
    recommendation:
      `Engage qualified legal counsel in ${jurisdictionCode} for jurisdiction-specific compliance analysis. ` +
      "All jurisdictions require legal review before production activation.",
    priority: "high",
  });

  return {
    taskId: taskRecord.id,
    auditRecordId: auditRecord.id,
    auditToken,
    persistedStatus: "persisted_simulation_only",
    liveExecutionAllowed: false,
  };
}

// ─── Persist: Public Claim Review ────────────────────────────────────────────

export function persistPublicClaimReview(claimText: string): XrplStellarCompliancePersistResult {
  const auditToken = makeAuditToken();
  const review = reviewPublicClaim(claimText);

  const taskRecord = createTaskRecord({
    intent: "public-claim-review",
    status: "simulated",
    auditToken,
    routedTo: ["global-compliance-policy-engine"],
    requiresApproval: !review.isAllowed,
  });

  createSimulationRecord({
    taskId: taskRecord.id,
    simulationJson: JSON.stringify({
      type: "public_claim_review",
      claimText: claimText.slice(0, 200),
      isAllowed: review.isAllowed,
      prohibitedPhrasesCount: review.prohibitedPhrases.length,
      simulationOnly: true,
      liveExecutionAllowed: false,
    }),
  });

  for (const phrase of review.prohibitedPhrases) {
    createBlockedActionRecord({
      taskId: taskRecord.id,
      capabilityId: "prohibited-public-claim",
      reason: phrase,
    });
  }

  const auditRecord = createAuditRecord({
    taskId: taskRecord.id,
    auditToken,
    intent: "public-claim-review",
    actionType: "claim_review",
    outcome: review.isAllowed ? "allowed" : "blocked",
    blockedCount: review.prohibitedPhrases.length,
    requiresApproval: !review.isAllowed,
  });

  if (!review.isAllowed) {
    createRecommendationRecord({
      taskId: taskRecord.id,
      recommendation: review.correctionSuggestion,
      priority: "high",
    });
  }

  return {
    taskId: taskRecord.id,
    auditRecordId: auditRecord.id,
    auditToken,
    persistedStatus: "persisted_simulation_only",
    liveExecutionAllowed: false,
  };
}

// ─── Persist: Global Compliance Gate ─────────────────────────────────────────

export function persistGlobalComplianceGate(
  input: GlobalComplianceInput
): XrplStellarCompliancePersistResult {
  const auditToken = makeAuditToken();
  const result = evaluateGlobalCompliance(input);

  const taskRecord = createTaskRecord({
    intent: `global-compliance-gate-${input.operationType}`,
    status: "simulated",
    auditToken,
    routedTo: ["global-compliance-policy-engine"],
    requiresApproval: result.decision !== "allowed_simulation_only",
  });

  createSimulationRecord({
    taskId: taskRecord.id,
    simulationJson: JSON.stringify({
      type: "global_compliance_gate",
      operationId: input.operationId,
      operationType: input.operationType,
      decision: result.decision,
      blockedReasonsCount: result.blockedReasons.length,
      simulationOnly: true,
      liveExecutionAllowed: false,
    }),
  });

  for (const blocked of result.blockedReasons) {
    createBlockedActionRecord({
      taskId: taskRecord.id,
      capabilityId: `compliance-gate-${blocked.code}`,
      reason: blocked.message,
    });
  }

  const auditRecord = createAuditRecord({
    taskId: taskRecord.id,
    auditToken,
    intent: `global-compliance-gate-${input.operationType}`,
    actionType: "compliance_gate",
    outcome: result.decision,
    blockedCount: result.blockedReasons.length,
    requiresApproval: result.decision !== "allowed_simulation_only",
  });

  for (const approval of result.requiredApprovals) {
    createRecommendationRecord({
      taskId: taskRecord.id,
      recommendation: approval,
      priority: "high",
    });
  }

  return {
    taskId: taskRecord.id,
    auditRecordId: auditRecord.id,
    auditToken,
    persistedStatus: "persisted_simulation_only",
    liveExecutionAllowed: false,
  };
}

// ─── Snapshot ─────────────────────────────────────────────────────────────────

export function getXrplStellarInstitutionalComplianceSnapshot(): XrplStellarComplianceSnapshot {
  const allControls = getAllComplianceControls();
  const blockedControls = getBlockedControls();
  const allJurisdictions = getAllJurisdictions();

  return {
    totalControls: allControls.length,
    blockedControls: blockedControls.length,
    jurisdictions: allJurisdictions.length,
    liveExecutionAllowed: false,
    snapshotAt: new Date().toISOString(),
  };
}
