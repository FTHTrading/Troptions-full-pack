import type { RegulatoryMode, YieldApiEnvelope, YieldRiskLevel } from "@/lib/troptions-genius-yield/types";

export function buildYieldApiEnvelope<T>(input: {
  complianceMode: RegulatoryMode;
  result: T;
  riskLevel: YieldRiskLevel;
  legalReviewRequired: boolean;
  reasons: string[];
  saferAlternative: string;
}): YieldApiEnvelope<T> {
  return {
    status: input.riskLevel === "prohibited_block" || input.riskLevel === "high_risk_likely_prohibited" ? "blocked" : "ok",
    complianceMode: input.complianceMode,
    result: input.result,
    riskLevel: input.riskLevel,
    legalReviewRequired: input.legalReviewRequired,
    liveActionBlocked: input.complianceMode !== "live_enabled",
    reasons: input.reasons,
    saferAlternative: input.saferAlternative,
  };
}