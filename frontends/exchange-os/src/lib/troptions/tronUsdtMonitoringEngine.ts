import { TRON_RAIL_REGISTRY } from "@/content/troptions/tronRailRegistry";

export interface TronUsdtRiskRequest {
  sourceWallet: string;
  destinationWallet: string;
  jurisdiction?: string;
}

export function getTronRailSummary() {
  return {
    rails: TRON_RAIL_REGISTRY,
    policy: "monitoring-and-evaluation-only",
  };
}

export function simulateTronUsdtRiskCheck(request: TronUsdtRiskRequest) {
  const riskSignals = [
    "Sanctions screening placeholder",
    "Freeze-status awareness",
    "Source/destination risk scoring",
  ];

  return {
    ok: false,
    simulationOnly: true,
    blockedReasons: [
      "TRON routes are monitoring and evaluation only",
      "Live transfer execution disabled",
    ],
    riskResult: {
      sourceWallet: request.sourceWallet,
      destinationWallet: request.destinationWallet,
      jurisdiction: request.jurisdiction ?? "unspecified",
      riskLevel: "high",
      signals: riskSignals,
    },
  };
}
