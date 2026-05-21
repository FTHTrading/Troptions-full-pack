import { XRPL_MARKET_DATA_REGISTRY } from "@/content/troptions/xrplMarketDataRegistry";

export interface XrplPathfindingQuoteInput {
  readonly fromAsset: string;
  readonly toAsset: string;
  readonly amount: number;
}

export function simulateXrplPathfindingQuote(input: XrplPathfindingQuoteInput) {
  const routeKey = `${input.fromAsset.toUpperCase()} / ${input.toAsset.toUpperCase()}`;
  const market = XRPL_MARKET_DATA_REGISTRY.find((item) => item.pair === routeKey || item.pair === `${input.toAsset.toUpperCase()} / ${input.fromAsset.toUpperCase()}`);
  const referencePrice = market ? Number.parseFloat(market.lastPrice) : 1;
  const expectedOutput = Number((input.amount * (referencePrice || 1) * 0.9925).toFixed(6));

  return {
    routeKey,
    expectedOutput,
    spreadBps: 42,
    slippageBps: 75,
    feeBps: 30,
    liquidityRisk: market?.risk ?? "medium",
    routeRisk: "medium",
    issuerRisk: input.toAsset.toUpperCase() === "XRP" ? "low" : "medium",
    freezeRisk: input.toAsset.toUpperCase() === "XRP" ? "low" : "medium",
    trustlineRisk: input.toAsset.toUpperCase() === "XRP" ? "low" : "medium",
  } as const;
}