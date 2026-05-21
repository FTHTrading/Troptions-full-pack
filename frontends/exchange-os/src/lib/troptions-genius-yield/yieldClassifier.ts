import type { YieldClassificationInput, YieldClassificationResult } from "@/lib/troptions-genius-yield/types";

export function classifyYieldStructure(input: YieldClassificationInput): YieldClassificationResult {
  const reasons: string[] = [];
  const blockedReasons: string[] = [];
  const requiredEvidence = ["legal memo", "marketing review", "product lane mapping"];

  if (input.productLane === "payment_stablecoin" && input.isSolelyForHoldingUseOrRetention) {
    blockedReasons.push("Payment stablecoin rewards tied solely to holding, use, or retention are prohibited.");
  }

  if (
    input.productLane === "payment_stablecoin" &&
    (input.rewardTrigger === "holding_balance" || input.rewardTrigger === "holding_time" || input.hasTimeBasedAccrual || input.hasBalanceBasedAccrual)
  ) {
    blockedReasons.push("Balance-based or time-based stablecoin rewards are high risk and likely prohibited.");
  }

  if (input.productLane === "payment_stablecoin" && (input.isAffiliateOfIssuer || input.isRelatedThirdParty)) {
    blockedReasons.push("Affiliate or related third-party stablecoin holder rewards require presumption of heightened risk.");
  }

  if (input.isTokenizedDeposit && input.requiresDepositAccount) {
    reasons.push("Tokenized deposit lane may be viable if controlled by a regulated financial institution with deposit terms.");
    return {
      riskLevel: "likely_allowed_with_review",
      reasons,
      blockedReasons,
      saferAlternative: "Route value accrual through a tokenized deposit product with regulated FI controls and deposit disclosures.",
      requiredEvidence: requiredEvidence.concat(["deposit terms", "FI authority memo", "tax reporting plan"]),
      requiredLegalReview: true,
    };
  }

  if (input.productLane === "merchant_rebate" && input.isMerchantFunded && input.isTransactionSpecific && !input.hasBalanceBasedAccrual && !input.hasTimeBasedAccrual) {
    reasons.push("Merchant-funded, transaction-specific rebates are structurally safer than holder-balance rewards.");
    return {
      riskLevel: "likely_allowed_with_review",
      reasons,
      blockedReasons,
      saferAlternative: "Keep rewards tied to completed commerce rather than stablecoin balance or retention.",
      requiredEvidence: requiredEvidence.concat(["merchant funding source", "rebate policy"]),
      requiredLegalReview: true,
    };
  }

  if (input.productLane === "loyalty_points" && input.rewardTrigger === "loyalty_non_cash") {
    reasons.push("Non-cash loyalty tied to commerce may be lower risk but still needs counsel review.");
    return {
      riskLevel: input.regulatorGuidanceMapped ? "likely_allowed_with_review" : "gray_area_requires_counsel",
      reasons,
      blockedReasons,
      saferAlternative: "Use non-cash merchant loyalty credits that are not redeemable as yield.",
      requiredEvidence: requiredEvidence.concat(["loyalty terms", "redemption restrictions"]),
      requiredLegalReview: true,
    };
  }

  if (input.productLane === "reserve_income" && input.rewardTrigger === "reserve_income_retained_by_issuer") {
    reasons.push("Issuer-retained reserve income is distinct from holder yield.");
    return {
      riskLevel: "likely_allowed_with_review",
      reasons,
      blockedReasons,
      saferAlternative: "Retain reserve income as issuer operating revenue instead of passing it through to holders.",
      requiredEvidence: requiredEvidence.concat(["reserve policy", "accounting memo"]),
      requiredLegalReview: true,
    };
  }

  if (input.rewardTrigger === "rwa_distribution") {
    blockedReasons.push("RWA distributions require securities review and cannot be marketed as stablecoin yield.");
    return {
      riskLevel: "gray_area_requires_counsel",
      reasons,
      blockedReasons,
      saferAlternative: "Separate the RWA investment or cash-flow product from the payment stablecoin rail.",
      requiredEvidence: requiredEvidence.concat(["securities memo", "product separation map"]),
      requiredLegalReview: true,
    };
  }

  return {
    riskLevel: blockedReasons.length > 0 ? "high_risk_likely_prohibited" : "gray_area_requires_counsel",
    reasons,
    blockedReasons,
    saferAlternative: "Use compliance SaaS fees, merchant-funded rebates, or tokenized deposit routing instead of holder yield.",
    requiredEvidence,
    requiredLegalReview: true,
  };
}