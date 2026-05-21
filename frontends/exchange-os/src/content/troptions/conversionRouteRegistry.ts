export interface ConversionRouteRecord {
  routeId: string;
  sourceAsset: string;
  targetAsset: string;
  providerPath: string[];
  estimatedSlippageBps: number;
  estimatedFeeBps: number;
  routeRisk: "low" | "medium" | "high";
  approvalStatus: "pending" | "approved" | "blocked";
  simulationOnly: boolean;
}

export const CONVERSION_ROUTE_REGISTRY: ConversionRouteRecord[] = [
  {
    routeId: "CONV-001",
    sourceAsset: "USD.rIssuer",
    targetAsset: "USDC",
    providerPath: ["XRPL pathfinding", "licensed conversion provider"],
    estimatedSlippageBps: 42,
    estimatedFeeBps: 18,
    routeRisk: "medium",
    approvalStatus: "pending",
    simulationOnly: true,
  },
];
