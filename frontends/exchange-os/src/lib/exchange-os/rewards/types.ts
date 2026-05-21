// TROPTIONS Exchange OS — Rewards Types

export type RewardCategory =
  | "creator"
  | "referral"
  | "sponsor"
  | "liquidity"
  | "api-revenue"
  | "campaign";

export interface RewardPolicy {
  category: RewardCategory;
  label: string;
  description: string;
  /** Basis points of eligible volume */
  rewardBps: number;
  enabled: boolean;
  /** Legal disclaimers for this reward category */
  disclaimers: string[];
}

export interface RewardCalculation {
  category: RewardCategory;
  eligibleVolumeUsd: number;
  rewardBps: number;
  estimatedRewardUsd: number;
  demoMode: boolean;
  disclaimers: string[];
}

export const REWARD_DISCLAIMER =
  "Reward eligibility, amounts, and timing depend on real platform usage, " +
  "program rules, market activity, and legal/compliance review. " +
  "Estimated rewards are not guaranteed. Nothing here is financial advice.";
