import { CONVERSION_ROUTE_REGISTRY } from "@/content/troptions/conversionRouteRegistry";

export function simulateConversionRoute(sourceAsset: string, targetAsset: string, amount: number) {
  const route = CONVERSION_ROUTE_REGISTRY.find(
    (item) => item.sourceAsset === sourceAsset && item.targetAsset === targetAsset,
  );

  const estimatedOutput = Math.max(amount * (1 - ((route?.estimatedFeeBps ?? 25) + (route?.estimatedSlippageBps ?? 55)) / 10000), 0);

  return {
    simulationOnly: true,
    sourceAsset,
    targetAsset,
    amount,
    estimatedOutput,
    slippageBps: route?.estimatedSlippageBps ?? 55,
    feeBps: route?.estimatedFeeBps ?? 25,
    routeRisk: route?.routeRisk ?? "high",
    approvalStatus: route?.approvalStatus ?? "pending",
    blockedReasons:
      route?.approvalStatus === "approved"
        ? []
        : ["Conversion route remains simulation-only until approvals complete"],
  };
}
