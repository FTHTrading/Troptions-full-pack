import { SETTLEMENT_OPS_REGISTRY } from "@/content/troptions/settlementOpsRegistry";

export function listSettlementIntents() {
  return SETTLEMENT_OPS_REGISTRY;
}

export function simulateSettlement(intentId: string) {
  const intent = SETTLEMENT_OPS_REGISTRY.find((item) => item.intentId === intentId) ?? SETTLEMENT_OPS_REGISTRY[0];
  const blockedReasons: string[] = [];

  if (intent.counterpartyVerification !== "verified") blockedReasons.push("Counterparty verification is incomplete");
  if (intent.approvalPackageStatus !== "approved") blockedReasons.push("Approval package is incomplete");

  return {
    intentId: intent.intentId,
    simulationOnly: true,
    allowed: blockedReasons.length === 0,
    blockedReasons,
    railSummary: {
      payment: intent.paymentRailSelection,
      custody: intent.custodyRouteSelection,
      stablecoin: intent.stablecoinRouteSelection,
    },
  };
}
