/**
 * TROPTIONS PayOps — Fee Calculation Engine
 *
 * TROPTIONS earns from PayOps through:
 * - Namespace subscription fees
 * - Per-payout fees (bps or flat)
 * - Compliance packet fees
 * - Setup fees
 * - Adapter fees
 * - Export/receipt fees
 * - Sponsor campaign fees
 */

import type { FeeType, PayoutType } from "./types";

// ─── Fee Schedule ─────────────────────────────────────────────────────────────

export interface FeeSchedule {
  tier: "starter" | "growth" | "institutional" | "enterprise";
  monthlySubscription: number;
  setupFee: number;
  payoutFeeBps: number; // basis points: 100 bps = 1%
  payoutFeeMin: number;
  payoutFeeMax: number;
  compliancePacketFee: number;
  exportFee: number;
  adapterActivationFee: number;
}

export const TROPTIONS_FEE_SCHEDULES: Record<string, FeeSchedule> = {
  starter: {
    tier: "starter",
    monthlySubscription: 99,
    setupFee: 500,
    payoutFeeBps: 150, // 1.5%
    payoutFeeMin: 2.5,
    payoutFeeMax: 250,
    compliancePacketFee: 25,
    exportFee: 5,
    adapterActivationFee: 0,
  },
  growth: {
    tier: "growth",
    monthlySubscription: 499,
    setupFee: 1000,
    payoutFeeBps: 100, // 1.0%
    payoutFeeMin: 2,
    payoutFeeMax: 500,
    compliancePacketFee: 50,
    exportFee: 10,
    adapterActivationFee: 250,
  },
  institutional: {
    tier: "institutional",
    monthlySubscription: 1999,
    setupFee: 2500,
    payoutFeeBps: 75, // 0.75%
    payoutFeeMin: 5,
    payoutFeeMax: 1000,
    compliancePacketFee: 100,
    exportFee: 25,
    adapterActivationFee: 500,
  },
  enterprise: {
    tier: "enterprise",
    monthlySubscription: 4999,
    setupFee: 5000,
    payoutFeeBps: 50, // 0.5%
    payoutFeeMin: 5,
    payoutFeeMax: 2500,
    compliancePacketFee: 250,
    exportFee: 50,
    adapterActivationFee: 1000,
  },
};

// ─── Fee Calculation ──────────────────────────────────────────────────────────

/**
 * Calculate the TROPTIONS payout fee for a given amount and tier.
 */
export function calculatePayoutFee(
  amount: number,
  tier: string = "starter"
): number {
  const schedule = TROPTIONS_FEE_SCHEDULES[tier] ?? TROPTIONS_FEE_SCHEDULES.starter;
  const fee = (amount * schedule.payoutFeeBps) / 10000;
  return Math.max(schedule.payoutFeeMin, Math.min(fee, schedule.payoutFeeMax));
}

/**
 * Estimate the total platform fee for a payout batch.
 */
export function estimateBatchFee(
  totalAmount: number,
  payeeCount: number,
  tier: string = "starter",
  generateCompliancePacket = false,
  exportReceipts = false
): {
  payoutFee: number;
  compliancePacketFee: number;
  exportFee: number;
  totalEstimatedFee: number;
} {
  const schedule = TROPTIONS_FEE_SCHEDULES[tier] ?? TROPTIONS_FEE_SCHEDULES.starter;
  const payoutFee = calculatePayoutFee(totalAmount, tier);
  const compliancePacketFee = generateCompliancePacket
    ? schedule.compliancePacketFee * Math.ceil(payeeCount / 10)
    : 0;
  const exportFee = exportReceipts ? schedule.exportFee : 0;

  return {
    payoutFee,
    compliancePacketFee,
    exportFee,
    totalEstimatedFee: payoutFee + compliancePacketFee + exportFee,
  };
}

/**
 * Estimate the annual revenue TROPTIONS earns from a single client namespace.
 */
export function estimateAnnualClientRevenue(
  tier: string,
  estimatedMonthlyPayoutVolume: number,
  compliancePacketsPerMonth: number = 2,
  exportsPerMonth: number = 4
): number {
  const schedule = TROPTIONS_FEE_SCHEDULES[tier] ?? TROPTIONS_FEE_SCHEDULES.starter;
  const annualSubscription = schedule.monthlySubscription * 12;
  const annualPayoutFees =
    calculatePayoutFee(estimatedMonthlyPayoutVolume, tier) * 12;
  const annualComplianceFees =
    schedule.compliancePacketFee * compliancePacketsPerMonth * 12;
  const annualExportFees = schedule.exportFee * exportsPerMonth * 12;
  return (
    annualSubscription +
    annualPayoutFees +
    annualComplianceFees +
    annualExportFees
  );
}

export const FEE_TYPE_DESCRIPTIONS: Record<FeeType, string> = {
  namespace_subscription:
    "Monthly or annual fee for TROPTIONS PayOps namespace access.",
  payout_fee:
    "Per-payout fee charged as a percentage of the payout amount.",
  compliance_packet_fee:
    "Fee for generating a compliance packet (audit trail, proof records, W-9/W-8 status).",
  setup_fee:
    "One-time setup fee for namespace configuration and onboarding.",
  adapter_fee: "Fee for activating or maintaining a live provider adapter.",
  export_fee:
    "Fee for exporting receipt packets, audit logs, or payment records.",
  sponsor_campaign_fee:
    "Fee for managing sponsor campaign payouts and tracking.",
};

export const PAYOUT_TYPE_FEE_NOTES: Partial<Record<PayoutType, string>> = {
  payroll_like_batch:
    "Payroll-like batches may incur additional compliance packet fees.",
  nil_payout:
    "NIL payouts may require a compliance packet for each payee.",
  sponsor_revenue_share:
    "Sponsor revenue share batches may incur a sponsor campaign fee.",
};
