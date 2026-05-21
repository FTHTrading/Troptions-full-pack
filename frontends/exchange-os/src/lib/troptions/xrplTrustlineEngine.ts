import { XRPL_REGISTRY } from "@/content/troptions/xrplRegistry";

export function listTrustlineStatuses() {
  return XRPL_REGISTRY.map((item) => ({
    accountId: item.accountId,
    trustlines: item.trustlines,
    allowlistStatus: item.allowlistStatus,
    enabledStatus: item.enabledStatus,
  }));
}
