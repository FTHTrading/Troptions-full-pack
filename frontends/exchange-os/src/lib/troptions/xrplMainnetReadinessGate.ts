import { XRPL_TRADE_READINESS_REGISTRY } from "@/content/troptions/xrplTradeReadinessRegistry";

export function getXrplMainnetReadinessGate() {
  const gate = XRPL_TRADE_READINESS_REGISTRY.find((item) => item.stage === "mainnet-execution");

  return {
    mode: "mainnet-readiness-gate",
    isLiveMainnetExecutionEnabled: false,
    allowed: false,
    blockedReason: "Mainnet XRPL execution is disabled by default until all approvals are complete.",
    requiredApprovals: gate?.requiredApprovals ?? [],
    blockedTransactionTypes: gate?.blockedTransactionTypes ?? [],
    auditHint: "Keep mainnet execution blocked until legal, custody, provider, compliance, signer, and board approvals are complete.",
  } as const;
}