export interface WalletRiskAssessment {
  readonly riskAssessmentId: string;
  readonly walletId: string;
  readonly overallRiskLevel: "low" | "medium" | "high" | "critical";
  readonly kycRiskLevel: "low" | "medium" | "high" | "not-completed";
  readonly sanctionsRiskLevel: "low" | "medium" | "high" | "flagged";
  readonly behavioralRiskLevel: "low" | "medium" | "high" | "not-applicable";
  readonly sourceOfFundsRiskLevel: "low" | "medium" | "high" | "unreviewed";
  readonly countryOfResidenceRiskLevel: "low" | "medium" | "high" | "restricted";
  readonly industryRiskLevel: "low" | "medium" | "high" | "not-applicable";
  readonly flags: readonly string[];
  readonly recommendations: readonly string[];
  readonly assessedAt: string;
  readonly reassessmentDueAt: string;
}

export const WALLET_RISK_REGISTRY: readonly WalletRiskAssessment[] = [
  {
    riskAssessmentId: "risk_kevan_001",
    walletId: "wallet_kevan_main",
    overallRiskLevel: "low",
    kycRiskLevel: "low",
    sanctionsRiskLevel: "low",
    behavioralRiskLevel: "not-applicable",
    sourceOfFundsRiskLevel: "low",
    countryOfResidenceRiskLevel: "low",
    industryRiskLevel: "not-applicable",
    flags: [],
    recommendations: [
      "Continue monitoring for compliance updates",
      "Annual KYC refresh when due",
      "Enhanced screening for new funding sources",
    ],
    assessedAt: "2026-04-25T12:00:00Z",
    reassessmentDueAt: "2027-04-25T23:59:59Z",
  },
];

export function getWalletRiskAssessment(walletId: string): WalletRiskAssessment | undefined {
  return WALLET_RISK_REGISTRY.find((risk) => risk.walletId === walletId);
}

export function isWalletRiskyForFunding(riskLevel: string): boolean {
  return riskLevel === "high" || riskLevel === "critical";
}

export function getRiskRecommendations(riskLevel: string): string[] {
  if (riskLevel === "critical") {
    return ["FREEZE wallet immediately", "Escalate to compliance", "Review source of funds"];
  }
  if (riskLevel === "high") {
    return ["Escalate to senior operator", "Enhanced due diligence required", "Possible funding restrictions"];
  }
  if (riskLevel === "medium") {
    return ["Monitor for 30 days", "Enhanced KYC recommended", "Reduced daily limit recommended"];
  }
  return ["Standard monitoring", "Annual KYC refresh", "Standard compliance checks"];
}
