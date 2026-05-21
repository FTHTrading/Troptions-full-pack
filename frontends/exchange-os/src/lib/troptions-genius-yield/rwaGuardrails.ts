import type { RwaConfusionInput, RwaConfusionResult } from "@/lib/troptions-genius-yield/types";

export function detectRWAStablecoinConfusion(input: RwaConfusionInput): RwaConfusionResult {
  const reasons = [
    input.marketedAsStablecoin ? "RWA product is being marketed as a stablecoin." : null,
    input.redemptionLinkedToRwaPerformance ? "Stablecoin redemption cannot be linked to RWA performance." : null,
    input.guaranteedYieldClaim ? "Guaranteed yield claims are blocked." : null,
    input.investmentReturnWithoutSecuritiesReview ? "Investment return claims require securities review." : null,
    input.privateMarketAccessWithoutEligibilityChecks ? "Private-market access requires eligibility and investor checks." : null,
    input.troptionsClaimsCustodyWithoutAuthority ? "Troptions cannot claim custody or control it does not legally have." : null,
  ].filter(Boolean) as string[];

  return {
    blocked: reasons.length > 0,
    reasons,
    requiredReview: ["legal review", "securities review", "marketing review"],
    saferLanguage:
      "Describe stablecoin as a payment rail only, keep RWA or private-market products separate, and avoid yield, insurance, or guaranteed redemption claims.",
  };
}