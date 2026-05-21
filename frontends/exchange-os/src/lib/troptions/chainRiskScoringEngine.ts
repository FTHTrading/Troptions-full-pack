import { CHAIN_RISK_REGISTRY } from "@/content/troptions/chainRiskRegistry";

export function buildChainRiskSummary() {
  return {
    chains: CHAIN_RISK_REGISTRY,
    highestRiskChains: CHAIN_RISK_REGISTRY.filter((item) => item.baseRisk === "high").map((item) => item.chain),
  };
}
