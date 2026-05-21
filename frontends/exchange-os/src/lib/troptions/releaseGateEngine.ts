import { CLAIM_REGISTRY } from "@/content/troptions/claimRegistry";
import { INVESTOR_READINESS, isInvestorOperationallyReady } from "@/content/troptions/investorReadiness";
import {
  assertStableUnitLaunchAllowed,
  getAssetReadiness,
  isReadyForSettlement,
} from "@/content/troptions/readinessScoring";
import { FUNDING_ROUTE_REGISTRY } from "@/content/troptions/fundingRouteRegistry";
import { RELEASE_GATE_REGISTRY, getFailedReleaseGates, type ReleaseGateRecord } from "@/content/troptions/releaseGateRegistry";
import { scanForBannedTerms } from "@/content/troptions/riskLanguageRules";

export interface GateEvaluationResult {
  gateId: string;
  status: "pass" | "fail" | "warn";
  failingRules: string[];
}

export function evaluateClaimPublicationGate(claimId: string): GateEvaluationResult {
  const claim = CLAIM_REGISTRY.find((item) => item.id === claimId);
  if (!claim) {
    return { gateId: "GATE-CLAIM-UNKNOWN", status: "fail", failingRules: ["claim-not-found"] };
  }

  const failingRules: string[] = [];
  if (claim.publishStatus === "blocked") failingRules.push("claim-blocked");
  if (claim.evidenceStatus !== "approved") failingRules.push("claim-evidence-missing");

  return {
    gateId: `GATE-CLAIM-${claim.id}`,
    status: failingRules.length > 0 ? "fail" : "pass",
    failingRules,
  };
}

export function evaluateAssetIssuanceGate(assetId: string): GateEvaluationResult {
  const readiness = getAssetReadiness(assetId);
  if (!readiness) {
    return { gateId: "GATE-ISSUANCE-UNKNOWN", status: "fail", failingRules: ["asset-readiness-not-found"] };
  }

  const failingRules: string[] = [];
  if (readiness.legalScore < 80) failingRules.push("legal-score-below-threshold");
  if (readiness.custodyScore < 80) failingRules.push("custody-score-below-threshold");
  if (readiness.proofScore < 80) failingRules.push("proof-score-below-threshold");

  return {
    gateId: `GATE-ISSUANCE-${assetId}`,
    status: failingRules.length > 0 ? "fail" : "pass",
    failingRules,
  };
}

export function evaluateStableUnitLaunchGate(unitId: string): GateEvaluationResult {
  const allowed = assertStableUnitLaunchAllowed(unitId);
  return {
    gateId: `GATE-STABLE-${unitId}`,
    status: allowed ? "pass" : "fail",
    failingRules: allowed ? [] : ["licensing-approval-missing"],
  };
}

export function evaluateFundingRouteActivationGate(routeId: string): GateEvaluationResult {
  const route = FUNDING_ROUTE_REGISTRY.find((item) => item.routeId === routeId);
  if (!route) {
    return { gateId: "GATE-FUND-UNKNOWN", status: "fail", failingRules: ["funding-route-not-found"] };
  }

  const failingRules: string[] = [];
  if (route.legalStatus !== "approved") failingRules.push("legal-approval-missing");
  if (route.boardApprovalStatus !== "approved") failingRules.push("board-approval-missing");

  return {
    gateId: `GATE-FUND-${routeId}`,
    status: failingRules.length > 0 ? "fail" : "pass",
    failingRules,
  };
}

export function evaluateSettlementReleaseGate(assetId: string): GateEvaluationResult {
  const readiness = getAssetReadiness(assetId);
  if (!readiness) {
    return { gateId: "GATE-SETTLEMENT-UNKNOWN", status: "fail", failingRules: ["asset-readiness-not-found"] };
  }

  const failingRules: string[] = [];
  if (readiness.legalScore < 80) failingRules.push("legal-gate-fail");
  if (readiness.custodyScore < 80) failingRules.push("custody-gate-fail");
  if (readiness.proofScore < 80) failingRules.push("proof-gate-fail");
  if (readiness.complianceScore < 80) failingRules.push("compliance-gate-fail");
  if (readiness.boardApprovalScore < 80) failingRules.push("board-gate-fail");
  if (!isReadyForSettlement(assetId)) failingRules.push("settlement-readiness-fail");

  return {
    gateId: `GATE-SETTLEMENT-${assetId}`,
    status: failingRules.length > 0 ? "fail" : "pass",
    failingRules,
  };
}

export function evaluateInvestorAccessGate(subjectId: string): GateEvaluationResult {
  const investor = INVESTOR_READINESS.find((item) => item.subjectId === subjectId);
  if (!investor) {
    return { gateId: "GATE-INVESTOR-UNKNOWN", status: "fail", failingRules: ["investor-not-found"] };
  }

  const failingRules: string[] = [];
  if (!investor.kycComplete) failingRules.push("kyc-missing");
  if (!investor.sanctionsComplete) failingRules.push("sanctions-missing");
  if (investor.requiresAccreditation && !investor.accreditationComplete) failingRules.push("accreditation-missing");
  if (!investor.docsComplete) failingRules.push("documents-missing");
  if (!investor.walletAllowlistComplete) failingRules.push("wallet-allowlist-missing");
  if (!isInvestorOperationallyReady(investor)) failingRules.push("investor-not-operationally-ready");

  return {
    gateId: `GATE-INVESTOR-${subjectId}`,
    status: failingRules.length > 0 ? "fail" : "pass",
    failingRules,
  };
}

export function evaluatePublicContentReleaseGate(content: string): GateEvaluationResult {
  const violations = scanForBannedTerms(content);
  const critical = violations.filter((rule) => rule.riskLevel === "CRITICAL");
  return {
    gateId: "GATE-CONTENT-RUNTIME",
    status: critical.length > 0 ? "fail" : violations.length > 0 ? "warn" : "pass",
    failingRules: critical.length > 0 ? critical.map((item) => `banned-term:${item.bannedTerm}`) : [],
  };
}

export function getReleaseGateStatus(): {
  total: number;
  failing: number;
  failedGates: ReleaseGateRecord[];
} {
  const failedGates = getFailedReleaseGates();
  return {
    total: RELEASE_GATE_REGISTRY.length,
    failing: failedGates.length,
    failedGates,
  };
}
