import { getWalletRiskAssessment, getRiskRecommendations } from "@/content/troptions/walletRiskRegistry";

export interface WalletRiskSummary {
  ok: boolean;
  walletId: string;
  overallRiskLevel: "low" | "medium" | "high" | "critical";
  riskScore: number;
  recommendations: readonly string[];
  actionsRequired: readonly string[];
  reassessmentDue: string;
}

export function assessWalletRisk(walletId: string): WalletRiskSummary {
  const risk = getWalletRiskAssessment(walletId);

  if (!risk) {
    return {
      ok: false,
      walletId,
      overallRiskLevel: "high",
      riskScore: 75,
      recommendations: ["Complete initial risk assessment", "Provide KYC documentation", "Pass sanctions screening"],
      actionsRequired: ["kyc-pending", "sanctions-pending", "risk-assessment-pending"],
      reassessmentDue: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
    };
  }

  const riskScoreMap: Record<string, number> = {
    low: 25,
    medium: 50,
    high: 75,
    critical: 100,
  };

  const score = riskScoreMap[risk.overallRiskLevel] || 50;
  const recommendations = getRiskRecommendations(risk.overallRiskLevel);

  return {
    ok: true,
    walletId,
    overallRiskLevel: risk.overallRiskLevel,
    riskScore: score,
    recommendations,
    actionsRequired: risk.flags,
    reassessmentDue: risk.reassessmentDueAt,
  };
}

export function shouldFreezeWallet(riskLevel: string): boolean {
  return riskLevel === "critical" || riskLevel === "high";
}

export function requiresEscalation(riskLevel: string): boolean {
  return riskLevel === "critical" || riskLevel === "high";
}
