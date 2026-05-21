// TROPTIONS Exchange OS — Fee Policy Engine
// All fees are basis points (bps). 100 bps = 1%.
// Fees do not guarantee revenue — they are policy targets, not guarantees.
// All real-money fee flows require production env + legal/compliance review.

export interface FeePolicyConfig {
  /** Platform fee on eligible swap volume (bps) */
  platformFeeBps: number;
  /** Eligible creator reward from platform fee pool (bps of platform fee) */
  creatorRewardBps: number;
  /** Eligible referral reward from platform fee pool (bps of platform fee) */
  referralRewardBps: number;
  /** Eligible sponsor reward allocation (bps of platform fee) */
  sponsorRewardBps: number;
  /** Burn or treasury allocation (bps of platform fee) */
  burnOrTreasuryBps: number;
  /** Operator revenue share (bps of platform fee) */
  operatorRevenueShareBps: number;
  /** x402 service base fee in USD cents (e.g. 50 = $0.50) */
  x402ServiceFeeMinCents: number;
  /** Production mode: all fee flows are real */
  isProduction: boolean;
}

/** Default fee policy — demo mode, safe defaults */
export const defaultFeePolicy: FeePolicyConfig = {
  platformFeeBps: 30,           // 0.30% platform swap fee
  creatorRewardBps: 2500,       // 25% of platform fee → creator reward pool
  referralRewardBps: 1000,      // 10% of platform fee → referral pool
  sponsorRewardBps: 1500,       // 15% of platform fee → sponsor pool
  burnOrTreasuryBps: 1000,      // 10% → burn/treasury
  operatorRevenueShareBps: 4000, // 40% → operator revenue
  x402ServiceFeeMinCents: 1,    // $0.01 minimum x402 service fee
  isProduction: process.env.TROPTIONS_PRODUCTION_FEES === "true",
};

/** Convert bps to percentage string for display */
export function bpsToPercent(bps: number): string {
  return (bps / 100).toFixed(2) + "%";
}

/** Convert USD cents to display string */
export function centsToDisplay(cents: number): string {
  return "$" + (cents / 100).toFixed(2);
}

export const feeDisclaimer =
  "Fee allocations are policy targets. Actual payouts depend on real usage, " +
  "platform rules, program eligibility, legal review, and market activity. " +
  "Nothing is guaranteed.";
