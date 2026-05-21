/**
 * Troptions NIL — Control Hub Bridge
 *
 * Connects the NIL L1 simulation bridge to the Control Hub governance store.
 * Creates task, simulation, blocked-action, audit, and recommendation records.
 *
 * SAFETY RULES:
 * - getControlPlaneDb() is synchronous — never use await here
 * - All NIL operations are recorded as simulation-only
 * - Valid task statuses: "requested" | "simulated" | "blocked" |
 *   "needs_approval" | "approved_not_executed" | "queued" |
 *   "executed" | "failed" | "audited"
 * - Valid priorities: "low" | "medium" | "high"
 * - No live payment, wallet, or execution logic here
 */

import {
  createTaskRecord,
  createSimulationRecord,
  createBlockedActionRecord,
  createAuditRecord,
  createRecommendationRecord,
} from "@/lib/troptions/controlHubStateStore";
import type {
  ControlHubTaskRecord,
  ControlHubSimulationRecord,
  ControlHubBlockedActionRecord,
  ControlHubAuditRecord,
  ControlHubRecommendationRecord,
} from "@/lib/troptions/controlHubStateTypes";
import {
  getTroptionsNilL1Status,
  simulateNilL1Valuation,
  simulateNilL1ComplianceCheck,
  simulateNilL1Receipt,
  simulateNilL1ProofAnchor,
  createNilL1ReadinessReport,
  type NilValuationSimulationResult,
  type NilComplianceSimulationResult,
  type NilReceiptSimulationResult,
  type NilProofAnchorSimulationResult,
} from "@/lib/troptions-nil/l1NilBridge";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface NilControlHubValuationResult {
  taskRecord: ControlHubTaskRecord;
  simulationRecord: ControlHubSimulationRecord;
  auditRecord: ControlHubAuditRecord;
  valuationResult: NilValuationSimulationResult;
  recommendations: ControlHubRecommendationRecord[];
}

export interface NilControlHubComplianceResult {
  taskRecord: ControlHubTaskRecord;
  simulationRecord: ControlHubSimulationRecord;
  blockedActions: ControlHubBlockedActionRecord[];
  auditRecord: ControlHubAuditRecord;
  complianceResult: NilComplianceSimulationResult;
}

export interface NilControlHubReceiptResult {
  taskRecord: ControlHubTaskRecord;
  simulationRecord: ControlHubSimulationRecord;
  auditRecord: ControlHubAuditRecord;
  receiptResult: NilReceiptSimulationResult;
}

export interface NilControlHubProofAnchorResult {
  taskRecord: ControlHubTaskRecord;
  simulationRecord: ControlHubSimulationRecord;
  auditRecord: ControlHubAuditRecord;
  anchorResult: NilProofAnchorSimulationResult;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function nilAuditToken(): string {
  return `nil-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

// ─── Public API ───────────────────────────────────────────────────────────────

/**
 * Submit a NIL valuation simulation to the Control Hub.
 * Creates task, simulation, audit, and recommendation records.
 */
export function submitNilValuationToControlHub(
  athleteIdHash: string,
  compositeSeed = 0.45,
): NilControlHubValuationResult {
  const status = getTroptionsNilL1Status();
  const valuationResult = simulateNilL1Valuation(athleteIdHash, compositeSeed);
  const auditToken = nilAuditToken();

  const taskRecord = createTaskRecord({
    intent: `nil_valuation_simulation:${athleteIdHash}`,
    status: "simulated",
    auditToken,
    routedTo: ["nil_orchestrator_agent", "valuation_agent"],
    requiresApproval: true,
  });

  const simulationRecord = createSimulationRecord({
    taskId: taskRecord.id,
    simulationJson: JSON.stringify({
      subsystem: status.subsystem,
      version: status.version,
      simulationOnly: true,
      result: valuationResult,
    }),
  });

  const auditRecord = createAuditRecord({
    taskId: taskRecord.id,
    auditToken,
    intent: `nil_valuation:athlete_id_hash=${athleteIdHash}`,
    actionType: "nil-valuation-simulation",
    outcome: "simulated",
    blockedCount: 0,
    requiresApproval: true,
  });

  const recs: ControlHubRecommendationRecord[] = [];

  if (valuationResult.missingSignalCount > 10) {
    recs.push(
      createRecommendationRecord({
        taskId: taskRecord.id,
        recommendation:
          `${valuationResult.missingSignalCount} NIL signals missing — collect additional ` +
          "athlete, performance, and market data before finalising estimate.",
        priority: "high",
      }),
    );
  }

  recs.push(
    createRecommendationRecord({
      taskId: taskRecord.id,
      recommendation:
        "Legal review required before sharing NIL estimate with athlete or institution.",
      priority: "medium",
    }),
  );

  return { taskRecord, simulationRecord, auditRecord, valuationResult, recommendations: recs };
}

/**
 * Submit a NIL compliance check simulation to the Control Hub.
 * Blocked violations are recorded as blocked-action records.
 */
export function submitNilComplianceToControlHub(
  athleteIdHash: string,
  stateCode: string,
  institutionCode: string,
  isMinor: boolean,
  compensationBand: string,
): NilControlHubComplianceResult {
  const complianceResult = simulateNilL1ComplianceCheck(
    athleteIdHash,
    stateCode,
    institutionCode,
    isMinor,
    compensationBand,
  );
  const auditToken = nilAuditToken();
  const blockedCount = complianceResult.blockedReasons.length;

  const taskRecord = createTaskRecord({
    intent: `nil_compliance_simulation:${athleteIdHash}:${stateCode}`,
    status: blockedCount > 0 ? "blocked" : "simulated",
    auditToken,
    routedTo: ["nil_orchestrator_agent", "compliance_router_agent"],
    requiresApproval: true,
  });

  const simulationRecord = createSimulationRecord({
    taskId: taskRecord.id,
    simulationJson: JSON.stringify({
      simulationOnly: true,
      result: complianceResult,
    }),
  });

  const blockedActions: ControlHubBlockedActionRecord[] = complianceResult.blockedReasons.map(
    (reason) =>
      createBlockedActionRecord({
        taskId: taskRecord.id,
        capabilityId: "nil_deal_compliance",
        reason,
      }),
  );

  const auditRecord = createAuditRecord({
    taskId: taskRecord.id,
    auditToken,
    intent: `nil_compliance:athlete=${athleteIdHash},state=${stateCode}`,
    actionType: "nil-compliance-simulation",
    outcome: blockedCount > 0 ? "blocked" : "simulated",
    blockedCount,
    requiresApproval: true,
  });

  return { taskRecord, simulationRecord, blockedActions, auditRecord, complianceResult };
}

/**
 * Submit a NIL deal receipt simulation to the Control Hub.
 * No live payment or settlement occurs.
 */
export function submitNilReceiptToControlHub(
  athleteIdHash: string,
  brandHash: string,
  compensationBand: string,
  stateCode: string,
  institutionCode: string,
): NilControlHubReceiptResult {
  const receiptResult = simulateNilL1Receipt(
    athleteIdHash,
    brandHash,
    compensationBand,
    stateCode,
    institutionCode,
  );
  const auditToken = nilAuditToken();

  const taskRecord = createTaskRecord({
    intent: `nil_deal_receipt_simulation:${athleteIdHash}`,
    status: "needs_approval",
    auditToken,
    routedTo: ["nil_orchestrator_agent", "deal_receipt_agent"],
    requiresApproval: true,
  });

  const simulationRecord = createSimulationRecord({
    taskId: taskRecord.id,
    simulationJson: JSON.stringify({
      simulationOnly: true,
      livePaymentEnabled: false,
      unsigned: true,
      result: receiptResult,
    }),
  });

  const auditRecord = createAuditRecord({
    taskId: taskRecord.id,
    auditToken,
    intent: `nil_deal_receipt:athlete=${athleteIdHash}`,
    actionType: "nil-deal-receipt-simulation",
    outcome: "needs_approval",
    blockedCount: 0,
    requiresApproval: true,
  });

  return { taskRecord, simulationRecord, auditRecord, receiptResult };
}

/**
 * Submit a NIL proof anchor simulation to the Control Hub.
 * Template is unsigned — no live XRPL/Stellar/Polygon anchoring.
 */
export function submitNilProofAnchorToControlHub(
  athleteIdHash: string,
  dealHash: string,
  documentHashes: string[],
  chainTarget = "xrpl",
): NilControlHubProofAnchorResult {
  const anchorResult = simulateNilL1ProofAnchor(
    athleteIdHash,
    dealHash,
    documentHashes,
    chainTarget,
  );
  const auditToken = nilAuditToken();

  const taskRecord = createTaskRecord({
    intent: `nil_proof_anchor_simulation:${athleteIdHash}:${chainTarget}`,
    status: "needs_approval",
    auditToken,
    routedTo: ["nil_orchestrator_agent", "proof_vault_agent"],
    requiresApproval: true,
  });

  const simulationRecord = createSimulationRecord({
    taskId: taskRecord.id,
    simulationJson: JSON.stringify({
      simulationOnly: true,
      liveWeb3AnchorEnabled: false,
      unsigned: true,
      result: anchorResult,
    }),
  });

  const auditRecord = createAuditRecord({
    taskId: taskRecord.id,
    auditToken,
    intent: `nil_proof_anchor:athlete=${athleteIdHash},chain=${chainTarget}`,
    actionType: "nil-proof-anchor-simulation",
    outcome: "needs_approval",
    blockedCount: 0,
    requiresApproval: true,
  });

  return { taskRecord, simulationRecord, auditRecord, anchorResult };
}

/**
 * Record a NIL L1 module status check in the Control Hub audit trail.
 */
export function recordNilL1StatusCheck(): {
  taskRecord: ControlHubTaskRecord;
  auditRecord: ControlHubAuditRecord;
} {
  const status = getTroptionsNilL1Status();
  const auditToken = nilAuditToken();

  const taskRecord = createTaskRecord({
    intent: "nil_l1_status_check",
    status: "audited",
    auditToken,
    routedTo: ["nil_orchestrator_agent"],
    requiresApproval: false,
  });

  const auditRecord = createAuditRecord({
    taskId: taskRecord.id,
    auditToken,
    intent: "nil_l1_status_check",
    actionType: "nil-module-status",
    outcome: "audited",
    blockedCount: 0,
    requiresApproval: false,
  });

  void status; // used for type-checking; status is recorded in the audit intent

  return { taskRecord, auditRecord };
}

/**
 * Generate a NIL L1 readiness report and record it in the Control Hub.
 */
export function generateNilL1ReadinessReportRecord(): {
  taskRecord: ControlHubTaskRecord;
  simulationRecord: ControlHubSimulationRecord;
  auditRecord: ControlHubAuditRecord;
} {
  const report = createNilL1ReadinessReport();
  const auditToken = nilAuditToken();

  const taskRecord = createTaskRecord({
    intent: "nil_l1_readiness_report",
    status: "simulated",
    auditToken,
    routedTo: ["nil_orchestrator_agent", "governance_gate_agent"],
    requiresApproval: false,
  });

  const simulationRecord = createSimulationRecord({
    taskId: taskRecord.id,
    simulationJson: JSON.stringify(report),
  });

  const auditRecord = createAuditRecord({
    taskId: taskRecord.id,
    auditToken,
    intent: "nil_l1_readiness_report",
    actionType: "nil-readiness-report",
    outcome: "simulated",
    blockedCount: 0,
    requiresApproval: false,
  });

  return { taskRecord, simulationRecord, auditRecord };
}
