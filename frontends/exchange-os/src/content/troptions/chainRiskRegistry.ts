export interface ChainRiskProfile {
  chain: string;
  baseRisk: "low" | "medium" | "high";
  factors: readonly string[];
  defaultDecision: "allow-simulation" | "allow-monitoring" | "blocked";
}

export const CHAIN_RISK_REGISTRY: readonly ChainRiskProfile[] = [
  {
    chain: "Solana",
    baseRisk: "medium",
    factors: ["Provider approval", "Jurisdiction gating", "Operational control maturity"],
    defaultDecision: "allow-simulation",
  },
  {
    chain: "TRON",
    baseRisk: "high",
    factors: ["Illicit-finance exposure", "Issuer freeze dynamics", "Jurisdiction restrictions"],
    defaultDecision: "allow-monitoring",
  },
  {
    chain: "XRPL",
    baseRisk: "medium",
    factors: ["Route liquidity risk", "Simulation-only execution controls"],
    defaultDecision: "allow-simulation",
  },
  {
    chain: "EVM / T-REX",
    baseRisk: "medium",
    factors: ["Identity gate completeness", "Legal classification", "Transfer restriction controls"],
    defaultDecision: "allow-simulation",
  },
];
