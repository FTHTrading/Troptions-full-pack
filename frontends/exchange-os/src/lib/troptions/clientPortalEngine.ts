import { CLIENT_ACCOUNT_REGISTRY } from "@/content/troptions/clientAccountRegistry";

export function getClientAccount(clientId: string) {
  return CLIENT_ACCOUNT_REGISTRY.find((item) => item.clientId === clientId) ?? null;
}

export function getClientPortalSummary(clientId: string) {
  const account = getClientAccount(clientId) ?? CLIENT_ACCOUNT_REGISTRY[0];

  return {
    clientId: account.clientId,
    displayName: account.displayName,
    identityStatus: `${account.kycStatus}/${account.kybStatus}`,
    entityStatus: account.entityType,
    sanctionsStatus: account.sanctionsStatus,
    proofOfFundsStatus: account.documentsRequired.some((doc) => doc.toLowerCase().includes("fund"))
      ? "pending"
      : "review-required",
    sblcStatus: account.allowedModules.includes("sblc") ? "approved" : "pending",
    rwaStatus: account.rwaAccessStatus,
    custodyStatus: account.custodyAccessStatus,
    bankingRailStatus: account.bankingAccessStatus,
    stablecoinRailStatus: account.stablecoinAccessStatus,
    xrplAccessStatus: account.xrplAccessStatus,
    exchangeRouteStatus: "simulation-only",
    tradingSimulationStatus: "enabled",
    settlementReadiness: account.settlementAccessStatus,
    openExceptions: account.openExceptions,
    requiredApprovals: ["legal", "compliance", "risk", "board"],
  };
}
