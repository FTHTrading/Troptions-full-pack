// TROPTIONS Exchange OS — Reward Calculator
// Estimates potential rewards. Not a guarantee of earnings.

import { getPolicyByCategory } from "./rewardPolicy";
import { features } from "@/config/exchange-os/features";
import type { RewardCalculation, RewardCategory } from "./types";
import { REWARD_DISCLAIMER } from "./types";

/** Estimate potential reward for a given category and volume */
export function calculateEstimatedReward(
  category: RewardCategory,
  eligibleVolumeUsd: number
): RewardCalculation {
  const policy = getPolicyByCategory(category);

  if (!policy || !policy.enabled) {
    return {
      category,
      eligibleVolumeUsd: 0,
      rewardBps: 0,
      estimatedRewardUsd: 0,
      demoMode: true,
      disclaimers: [REWARD_DISCLAIMER],
    };
  }

  const demoMode = !features.liveTrading || features.demoMode;

  const estimatedRewardUsd = demoMode
    ? 0 // No estimated reward shown in demo mode
    : (eligibleVolumeUsd * policy.rewardBps) / 10_000;

  return {
    category,
    eligibleVolumeUsd: demoMode ? 0 : eligibleVolumeUsd,
    rewardBps: policy.rewardBps,
    estimatedRewardUsd,
    demoMode,
    disclaimers: [...policy.disclaimers, REWARD_DISCLAIMER],
  };
}

/** Format reward amount for display */
export function formatRewardDisplay(calc: RewardCalculation): string {
  if (calc.demoMode) return "Demo mode — connect to production to see estimates";
  if (calc.estimatedRewardUsd === 0) return "$0.00 (no eligible volume)";
  return "$" + calc.estimatedRewardUsd.toFixed(2) + " (estimated, not guaranteed)";
}
