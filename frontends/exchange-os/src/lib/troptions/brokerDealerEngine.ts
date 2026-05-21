import { BROKER_DEALER_PROVIDER_REGISTRY } from "@/content/troptions/brokerDealerRegistry";

export function listBrokerDealerProviders() {
  return BROKER_DEALER_PROVIDER_REGISTRY;
}

export function evaluateBrokerDealerCoordination(providerId: string) {
  const provider = BROKER_DEALER_PROVIDER_REGISTRY.find((item) => item.providerId === providerId);
  if (!provider) {
    return { allowed: false, blockedReasons: ["Licensed provider not found"] };
  }

  const blockedReasons: string[] = [];
  if (provider.engagementStatus !== "engaged") blockedReasons.push("Provider engagement is not active");
  if (provider.legalApprovalStatus !== "approved") blockedReasons.push("Legal approval not complete");

  return {
    allowed: blockedReasons.length === 0,
    blockedReasons,
    provider,
    coordinationOnly: true,
  };
}
