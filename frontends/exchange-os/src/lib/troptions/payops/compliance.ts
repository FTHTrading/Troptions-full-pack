/**
 * TROPTIONS PayOps — Compliance Logic
 *
 * Compliance gates that prevent payouts from executing without required checks.
 *
 * RULE: No payout may bypass compliance gates.
 * RULE: "blocked_by_compliance" is enforced programmatically, not by convention.
 */

import type { TroptionsPayee, TroptionsPayoutBatch, ComplianceStatus } from "./types";

// ─── Payout block evaluation ──────────────────────────────────────────────────

/**
 * Returns true if a payee has any compliance issue that should block payouts.
 */
export function isPayeeCompliant(payee: TroptionsPayee): boolean {
  if (payee.complianceStatus === "blocked" || payee.complianceStatus === "rejected") {
    return false;
  }
  if (payee.kycStatus === "blocked" || payee.kycStatus === "rejected") {
    return false;
  }
  if (payee.sanctionsScreeningStatus === "blocked" || payee.sanctionsScreeningStatus === "rejected") {
    return false;
  }
  return true;
}

/**
 * Returns a list of compliance issues for a payee.
 */
export function getPayeeComplianceIssues(payee: TroptionsPayee): string[] {
  const issues: string[] = [];
  if (payee.complianceStatus === "blocked")
    issues.push("Payee compliance status is blocked.");
  if (payee.complianceStatus === "rejected")
    issues.push("Payee compliance check was rejected.");
  if (payee.kycStatus === "rejected" || payee.kycStatus === "blocked")
    issues.push("KYC check not passed.");
  if (payee.kycStatus === "not_started")
    issues.push("KYC not started — required before payout.");
  if (payee.w9w8Status === "not_started")
    issues.push("W-9/W-8 not collected — required for tax reporting.");
  if (payee.sanctionsScreeningStatus === "blocked")
    issues.push("Sanctions screening flagged — payout blocked.");
  if (payee.sanctionsScreeningStatus === "not_started")
    issues.push("Sanctions screening not performed.");
  return issues;
}

/**
 * Returns true if a batch has any compliance issue that blocks execution.
 */
export function isBatchCompliant(batch: TroptionsPayoutBatch): boolean {
  return (
    batch.complianceStatus !== "blocked" &&
    batch.complianceStatus !== "rejected" &&
    batch.status !== "blocked_by_compliance"
  );
}

/**
 * Returns the required compliance checks for a given payout type.
 */
export function getRequiredComplianceChecks(
  payoutType: string
): string[] {
  const base = ["kyc", "sanctions_screening"];
  const taxRequired = [
    "payroll_like_batch",
    "contractor_payout",
    "creator_payout",
    "nil_payout",
  ];
  const kybRequired = [
    "vendor_payment",
    "sponsor_revenue_share",
    "affiliate_commission",
  ];

  const checks = [...base];
  if (taxRequired.includes(payoutType)) checks.push("w9_w8");
  if (kybRequired.includes(payoutType)) checks.push("kyb");
  return checks;
}

// ─── Compliance status helpers ────────────────────────────────────────────────

/**
 * Returns true if the compliance status allows execution to proceed.
 */
export function complianceStatusAllowsExecution(status: ComplianceStatus): boolean {
  return status === "approved";
}

/**
 * Returns a human-readable compliance advisory for a given payout type.
 */
export function getComplianceAdvisory(payoutType: string): string {
  switch (payoutType) {
    case "payroll_like_batch":
      return "Payroll-like batches require W-9/W-8 collection, KYC, and sanctions screening for all payees. TROPTIONS is not a licensed payroll provider — a licensed payroll adapter is required before live execution.";
    case "contractor_payout":
      return "Contractor payouts require W-9/W-8 for US contractors, KYC, and sanctions screening. Consult a tax advisor regarding 1099 reporting obligations.";
    case "nil_payout":
      return "NIL payouts may have NCAA, state law, or institutional compliance requirements. Legal review is required before execution.";
    case "stablecoin_partner":
    case "creator_payout":
      return "Creator payouts may require disclosure of payment terms, tax identification, and rights agreements. Consult legal counsel.";
    case "sponsor_revenue_share":
      return "Sponsor revenue share agreements must be documented. Payments must align with signed sponsor agreements.";
    case "vendor_payment":
      return "Vendor payments require KYB verification and a signed vendor agreement.";
    default:
      return "All payouts require KYC and sanctions screening before execution. Consult legal counsel for regulatory requirements.";
  }
}

// ─── Compliance check summary ─────────────────────────────────────────────────

export interface ComplianceSummary {
  kybStatus: ComplianceStatus;
  kycStatus: ComplianceStatus;
  w9w8Status: ComplianceStatus;
  sanctionsStatus: ComplianceStatus;
  approvalGateStatus: ComplianceStatus;
  overallStatus: ComplianceStatus;
  blockReasons: string[];
}

/**
 * Evaluates mock compliance summary for a namespace.
 * In production this would query the compliance database.
 */
export function getMockComplianceSummary(): ComplianceSummary {
  return {
    kybStatus: "pending",
    kycStatus: "not_started",
    w9w8Status: "not_started",
    sanctionsStatus: "not_started",
    approvalGateStatus: "pending",
    overallStatus: "pending",
    blockReasons: [
      "KYC not started for namespace operator.",
      "W-9/W-8 collection not initiated.",
      "Sanctions screening not performed.",
    ],
  };
}
