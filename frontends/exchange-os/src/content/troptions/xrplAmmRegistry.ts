export interface XrplAmmRecord {
  poolId: string;
  assetA: string;
  assetB: string;
  poolAddress: string;
  liquidityStatus: "low" | "moderate" | "high";
  feeBps: number;
  slippageModel: string;
  reserveStatus: "pending" | "adequate" | "inadequate";
  riskStatus: "normal" | "heightened" | "blocked";
  enabledStatus: "disabled" | "simulation-only";
}

export const XRPL_AMM_REGISTRY: XrplAmmRecord[] = [
  {
    poolId: "XRPL-AMM-001",
    assetA: "XRP",
    assetB: "USD.rIssuer",
    poolAddress: "rAMMplaceholder001",
    liquidityStatus: "moderate",
    feeBps: 30,
    slippageModel: "constant-product-simulation",
    reserveStatus: "adequate",
    riskStatus: "normal",
    enabledStatus: "simulation-only",
  },
];
