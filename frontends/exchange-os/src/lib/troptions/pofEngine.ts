import { POF_REGISTRY, type PofRecord } from "@/content/troptions/pofRegistry";

export function listPofRecords() {
  return POF_REGISTRY;
}

export function canApprovePof(record: PofRecord) {
  const blockedReasons: string[] = [];
  if (record.verificationStatus !== "verified") blockedReasons.push("POF evidence is not verified");
  if (record.sourceOfFundsReview !== "approved") blockedReasons.push("Source-of-funds review is incomplete");
  if (record.jurisdictionReview !== "approved") blockedReasons.push("Jurisdiction review is incomplete");
  return { allowed: blockedReasons.length === 0, blockedReasons };
}
