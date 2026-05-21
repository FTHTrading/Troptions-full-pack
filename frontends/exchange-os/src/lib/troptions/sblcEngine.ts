import { SBLC_REGISTRY, type SblcRecord } from "@/content/troptions/sblcRegistry";

export function listSblcRecords() {
  return SBLC_REGISTRY;
}

export function canVerifySblc(record: SblcRecord) {
  const blockedReasons: string[] = [];
  if (record.swiftVerificationStatus !== "verified") blockedReasons.push("SWIFT verification is incomplete");
  if (record.bankConfirmationStatus !== "confirmed") blockedReasons.push("Bank confirmation is incomplete");
  if (record.authenticityReviewStatus !== "approved") blockedReasons.push("Authenticity review is not approved");
  if (record.legalReviewStatus !== "approved") blockedReasons.push("Legal review is not approved");
  if (record.fraudRiskReviewStatus !== "approved") blockedReasons.push("Fraud risk review is not approved");
  if (record.boardApprovalStatus !== "approved") blockedReasons.push("Board approval is not complete");

  return { allowed: blockedReasons.length === 0, blockedReasons };
}
