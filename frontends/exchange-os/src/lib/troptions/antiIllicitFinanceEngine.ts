import { ANTI_ILLICIT_FINANCE_REGISTRY } from "@/content/troptions/antiIllicitFinanceRegistry";

export interface WalletRiskRequest {
  wallet: string;
  chain: string;
  amount?: string;
}

export function getAntiIllicitFinanceSummary() {
  return {
    controls: ANTI_ILLICIT_FINANCE_REGISTRY,
    defaultMode: "blocked-by-default",
  };
}

export function simulateWalletRisk(request: WalletRiskRequest) {
  const blockedReasons = [
    "High-risk route defaults to blocked",
    "Sanctions and freeze checks require provider confirmation",
    "Compliance escalation required",
  ];

  return {
    ok: false,
    simulationOnly: true,
    blockedReasons,
    assessment: {
      wallet: request.wallet,
      chain: request.chain,
      amount: request.amount ?? "unspecified",
      riskTier: "high",
      escalation: "compliance-review",
    },
  };
}
