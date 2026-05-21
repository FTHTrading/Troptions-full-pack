import type { MerchantRewardInput, MerchantRewardResult, ValueCaptureResult } from "@/lib/troptions-genius-yield/types";

export function detectCompliantValueCapture(): ValueCaptureResult {
  return {
    allowedRevenueLines: [
      "software licensing fee",
      "compliance packet fee",
      "merchant settlement SaaS fee",
      "namespace registration fee",
      "wallet UX fee",
      "KYC/KYB orchestration fee",
      "audit evidence automation fee",
      "CUSO shared service fee",
      "reserve dashboard fee",
      "transaction processing fee",
      "API integration fee",
      "legal packet preparation fee",
      "tokenized deposit routing SaaS fee",
      "merchant-funded discount/rebate network fee",
    ],
    blockedRevenueLines: [
      "issuer-paid stablecoin yield to holder",
      "balance-time stablecoin rewards",
      "affiliate pass-through yield",
      "guaranteed RWA yield",
      "misrepresented insurance",
      "redemption guarantee without regulated backing",
      "unlicensed issuance fee",
    ],
    grayAreaRevenueLines: [
      "commerce-linked loyalty credits",
      "merchant marketing-funded discounts",
      "tokenized deposit servicing fees with FI review",
    ],
    suggestedCompliantStructure:
      "Monetize Troptions as settlement software, compliance automation, namespace orchestration, and partner packet infrastructure rather than a holder-yield product.",
  };
}

export function classifyMerchantReward(input: MerchantRewardInput): MerchantRewardResult {
  if (input.isBalanceBased || input.isTimeBased) {
    return {
      classification: "high_risk_likely_prohibited",
      reason: "Balance-based or time-based merchant rewards can look like prohibited stablecoin yield.",
      contractLanguageNeeded: ["merchant funding source", "purchase trigger definition"],
      prohibitedMarketingLanguage: ["earn APY", "hold for rewards", "yield on balance"],
      saferStructure: "Tie the reward to completed purchase activity, not stored balance or duration.",
    };
  }

  if (input.isIssuerAffiliateFunded) {
    return {
      classification: "high_risk_likely_prohibited",
      reason: "Issuer-affiliate funding increases pass-through yield risk.",
      contractLanguageNeeded: ["separate merchant contract", "independent funding proof"],
      prohibitedMarketingLanguage: ["issuer-sponsored rewards", "stablecoin holder bonus"],
      saferStructure: "Use merchant-funded transaction rebates with independent budgets and explicit commerce triggers.",
    };
  }

  return {
    classification: input.isMerchantFunded && input.isTransactionSpecific ? "likely_allowed_with_review" : "gray_area_requires_counsel",
    reason: input.isMerchantFunded && input.isTransactionSpecific
      ? "Merchant-funded purchase rebates are lower risk when not tied to balance or holding time."
      : "The reward needs further fact development and legal review.",
    contractLanguageNeeded: ["rebate trigger", "merchant funding source", "no-balance-accrual clause"],
    prohibitedMarketingLanguage: ["guaranteed profit", "yield on holdings", "risk-free return"],
    saferStructure: "Keep rewards non-cash or transaction-specific and document that they are funded by commerce activity.",
  };
}