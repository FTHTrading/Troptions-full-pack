/**
 * TROPTIONS Infrastructure — Billing Readiness
 */

import type { TroptionsBillingReadinessRecord, BillingReadinessStatus } from "./types";

export function getBillingReadinessScore(record: TroptionsBillingReadinessRecord): number {
  let score = 0;
  if (record.billingPackage) score += 20;
  if (record.contractStatus === "signed" || record.contractStatus === "active") score += 30;
  if (record.paymentMethodStatus === "verified") score += 25;
  if (record.invoiceStatus === "paid") score += 15;
  if (record.billingContactEmail) score += 10;
  return Math.min(score, 100);
}

export function getBillingBlockers(record: TroptionsBillingReadinessRecord): string[] {
  const blockers: string[] = [];
  if (!record.billingPackage) blockers.push("No billing package selected.");
  if (record.contractStatus === "not_started") blockers.push("Contract not started.");
  if (record.paymentMethodStatus === "not_provided") blockers.push("Payment method not provided.");
  if (!record.billingContactEmail) blockers.push("Billing contact email missing.");
  return blockers;
}

export function getBillingStatusColor(status: BillingReadinessStatus): string {
  const map: Record<BillingReadinessStatus, string> = {
    not_started: "text-slate-400 bg-slate-800/60 border-slate-600/50",
    package_selected: "text-blue-300 bg-blue-900/60 border-blue-700/50",
    contract_pending: "text-yellow-300 bg-yellow-900/60 border-yellow-700/50",
    payment_method_pending: "text-orange-300 bg-orange-900/60 border-orange-700/50",
    deposit_pending: "text-orange-300 bg-orange-900/60 border-orange-700/50",
    billing_ready: "text-green-300 bg-green-900/60 border-green-700/50",
    blocked: "text-red-300 bg-red-900/60 border-red-700/50",
  };
  return map[status];
}
