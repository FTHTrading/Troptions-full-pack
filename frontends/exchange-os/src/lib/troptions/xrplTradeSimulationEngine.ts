import { simulateXrplPathfindingQuote, type XrplPathfindingQuoteInput } from "@/lib/troptions/xrplPathfindingEngine";

export function simulateXrplTrade(input: XrplPathfindingQuoteInput & { readonly venue?: "dex" | "amm" | "pathfinding" }) {
  const quote = simulateXrplPathfindingQuote(input);

  return {
    venue: input.venue ?? "pathfinding",
    expectedOutput: quote.expectedOutput,
    spreadBps: quote.spreadBps,
    slippageBps: quote.slippageBps,
    feeBps: quote.feeBps,
    routeRisk: quote.routeRisk,
    liquidityRisk: quote.liquidityRisk,
    issuerRisk: quote.issuerRisk,
    freezeRisk: quote.freezeRisk,
    trustlineRisk: quote.trustlineRisk,
    auditHint: "Simulation only. No XRPL transaction was signed or submitted.",
  } as const;
}