import { XRPL_SIGNING_KEY_REGISTRY } from "@/content/troptions/xrplSigningKeyRegistry";

export function getSigningKeyRecords() {
  return XRPL_SIGNING_KEY_REGISTRY;
}

export function getSigningKeyRiskSummary() {
  return XRPL_SIGNING_KEY_REGISTRY.map((r) => ({
    wallet: r.wallet,
    risk: r.masterKeyStatus === "disabled" && r.signingKeySeen ? "warning" : "info",
    note: r.riskNote,
  }));
}
