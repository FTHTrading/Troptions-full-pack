import type { CreditUnionPartnerInput, YieldClassificationInput } from "@/lib/troptions-genius-yield/types";

export const YIELD_ENGINE_MODE = "research_only" as const;

export const MOCK_YIELD_INPUT: YieldClassificationInput = {
  productLane: "merchant_rebate",
  rewardTrigger: "transaction_completion",
  payer: "merchant network",
  recipient: "member namespace",
  isStablecoinHolder: false,
  isAffiliateOfIssuer: false,
  isRelatedThirdParty: false,
  isSolelyForHoldingUseOrRetention: false,
  requiresDepositAccount: false,
  isTokenizedDeposit: false,
  isMerchantFunded: true,
  isTransactionSpecific: true,
  hasTimeBasedAccrual: false,
  hasBalanceBasedAccrual: false,
  legalMemoApproved: false,
  regulatorGuidanceMapped: true,
};

export const MOCK_CREDIT_UNION_PARTNER: CreditUnionPartnerInput = {
  name: "Blue River Community Credit Union",
  type: "credit_union",
  memberBaseSize: 54000,
  merchantRelationshipsScore: 8,
  digitalBankingMaturity: 7,
  cusoParticipation: 8,
  paymentInnovationAppetite: 7,
  complianceMaturity: 8,
  coreBankingIntegrationReadiness: 7,
  kycKybReadiness: 8,
  boardReadiness: 6,
  regulatorReadiness: 5,
  reserveCustodyReadiness: 6,
  tokenizedDepositLaneSupport: 8,
  merchantSettlementLaneSupport: 7,
};

export const BLOCKED_PATTERNS = [
  "stablecoin balance APY",
  "stablecoin holding-time rewards",
  "issuer affiliate pass-through yield",
  "guaranteed RWA yield",
  "stablecoin advertised as insured",
  "unlicensed mint/redeem",
  "risk free profit language",
  "RWA token sold without securities review",
];

export const SAFER_STRUCTURES = [
  "tokenized deposit through regulated FI",
  "merchant-funded transaction rebate",
  "non-cash loyalty tied to purchase",
  "issuer retains reserve income as operating revenue",
  "SaaS compliance fees",
  "settlement workflow fee",
  "namespace subscription fee",
  "credit-union/CUSO shared-service fee",
];