export interface XrplDexRecord {
  pairId: string;
  baseAsset: string;
  quoteAsset: string;
  orderbookStatus: "active" | "thin" | "halted";
  liquidityScore: number;
  spreadEstimate: number;
  routeRisk: "low" | "medium" | "high";
  approvalStatus: "pending" | "approved" | "blocked";
}

export const XRPL_DEX_REGISTRY: XrplDexRecord[] = [
  {
    pairId: "XRPL-DEX-USD-XRP",
    baseAsset: "USD.rIssuer",
    quoteAsset: "XRP",
    orderbookStatus: "active",
    liquidityScore: 61,
    spreadEstimate: 0.008,
    routeRisk: "medium",
    approvalStatus: "approved",
  },
];
