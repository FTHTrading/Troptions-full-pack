import { RWA_OPERATIONS_REGISTRY, type RwaOperationsRecord } from "@/content/troptions/rwaOperationsRegistry";

export function listRwaAssets() {
  return RWA_OPERATIONS_REGISTRY;
}

export function canMarkRwaIssuanceReady(record: RwaOperationsRecord) {
  const blockedReasons: string[] = [];
  if (record.legalStatus !== "approved") blockedReasons.push("Legal approval is incomplete");
  if (record.custodyStatus !== "approved") blockedReasons.push("Custody approval is incomplete");
  if (record.proofStatus !== "approved") blockedReasons.push("Proof package approval is incomplete");
  return { allowed: blockedReasons.length === 0, blockedReasons };
}
