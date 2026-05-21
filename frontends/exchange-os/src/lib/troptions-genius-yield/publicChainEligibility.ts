import type { PublicChainInput, PublicChainResult } from "@/lib/troptions-genius-yield/types";

export function evaluatePublicChainUse(input: PublicChainInput): PublicChainResult {
  const liveBlockers = [
    !input.chainRiskReviewApproved ? "chain risk review" : null,
    !input.smartContractAuditApproved ? "smart contract audit" : null,
    !input.bridgeRiskReviewed ? "bridge risk review" : null,
    !input.custodyModelDefined ? "custody model" : null,
    !input.monitoringEnabled ? "monitoring" : null,
    !input.walletControlsApproved ? "wallet controls" : null,
    !input.incidentResponseApproved ? "incident response" : null,
  ].filter(Boolean) as string[];

  const privateNetwork = input.network === "Private permissioned ledger" || input.network === "Rust-native Troptions settlement ledger";
  const baseScore = privateNetwork ? 82 : input.network === "XRPL" || input.network === "Stellar" ? 74 : 66;

  return {
    networkScore: baseScore - liveBlockers.length * 6,
    allowedForResearch: true,
    allowedForSandbox: true,
    allowedForLive: liveBlockers.length === 0,
    liveBlockers,
    monitoringRequirements: [
      "wallet policy controls",
      "chain analytics monitoring",
      "incident escalation",
      "bridge and custody review",
    ],
  };
}