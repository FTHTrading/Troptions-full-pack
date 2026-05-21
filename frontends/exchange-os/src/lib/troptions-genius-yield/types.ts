export type RegulatoryMode =
  | "research_only"
  | "sandbox"
  | "partner_diligence"
  | "regulator_packet"
  | "approved_partner"
  | "live_blocked"
  | "live_enabled";

export type ProductLane =
  | "payment_stablecoin"
  | "tokenized_deposit"
  | "merchant_rebate"
  | "transaction_reward"
  | "loyalty_points"
  | "reserve_income"
  | "rwa_payment_rail"
  | "credit_union_share_product"
  | "credit_union_cuso_service"
  | "institutional_settlement";

export type YieldRiskLevel =
  | "allowed_low_risk"
  | "likely_allowed_with_review"
  | "gray_area_requires_counsel"
  | "high_risk_likely_prohibited"
  | "prohibited_block";

export type RewardTrigger =
  | "holding_balance"
  | "holding_time"
  | "stablecoin_use"
  | "stablecoin_retention"
  | "transaction_completion"
  | "merchant_discount"
  | "deposit_account_interest"
  | "tokenized_deposit_interest"
  | "credit_union_dividend"
  | "loyalty_non_cash"
  | "unrelated_promotional_reward"
  | "reserve_income_retained_by_issuer"
  | "affiliate_payment"
  | "third_party_payment"
  | "rwa_distribution";

export type TimingWindowType =
  | "ppsi_application_30_day_completeness_notice"
  | "ppsi_application_120_day_decision"
  | "proposed_rule_comment_window"
  | "regulator_packet_refresh"
  | "reserve_attestation_monthly"
  | "board_review_quarterly"
  | "aml_review_annual"
  | "smart_contract_audit_expiry"
  | "promotional_rebate_window"
  | "deposit_rate_campaign"
  | "tokenized_deposit_term_window";

export type PartnerType =
  | "credit_union"
  | "cuso"
  | "fics_subsidiary"
  | "ppsi"
  | "bank"
  | "reserve_custodian"
  | "kyc_provider"
  | "aml_provider"
  | "sanctions_provider"
  | "chain_analytics_provider"
  | "audit_attestation_provider"
  | "legal_counsel"
  | "merchant_network"
  | "rwa_issuer";

export interface YieldClassificationInput {
  productLane: ProductLane;
  rewardTrigger: RewardTrigger;
  payer: string;
  recipient: string;
  isStablecoinHolder: boolean;
  isAffiliateOfIssuer: boolean;
  isRelatedThirdParty: boolean;
  isSolelyForHoldingUseOrRetention: boolean;
  requiresDepositAccount: boolean;
  isTokenizedDeposit: boolean;
  isMerchantFunded: boolean;
  isTransactionSpecific: boolean;
  hasTimeBasedAccrual: boolean;
  hasBalanceBasedAccrual: boolean;
  legalMemoApproved: boolean;
  regulatorGuidanceMapped: boolean;
}

export interface YieldClassificationResult {
  riskLevel: YieldRiskLevel;
  reasons: string[];
  blockedReasons: string[];
  saferAlternative: string;
  requiredEvidence: string[];
  requiredLegalReview: boolean;
}

export interface CreditUnionPartnerInput {
  name: string;
  type: PartnerType;
  memberBaseSize: number;
  merchantRelationshipsScore: number;
  digitalBankingMaturity: number;
  cusoParticipation: number;
  paymentInnovationAppetite: number;
  complianceMaturity: number;
  coreBankingIntegrationReadiness: number;
  kycKybReadiness: number;
  boardReadiness: number;
  regulatorReadiness: number;
  reserveCustodyReadiness: number;
  tokenizedDepositLaneSupport: number;
  merchantSettlementLaneSupport: number;
}

export interface CreditUnionOpportunityScore {
  totalScore: number;
  categoryScores: Record<string, number>;
  strongestPlay: string;
  missingItems: string[];
  nextActions: string[];
}

export interface ApplicationClockInput {
  dateSubmitted?: string;
  substantiallyCompleteDate?: string;
  missingDocuments: string[];
  materialChangeResetRisk: boolean;
}

export interface ApplicationClockResult {
  timeline: Array<{ type: TimingWindowType; date: string | null }>;
  currentStatus: string;
  nextDeadline: string | null;
  riskWarnings: string[];
  readinessToFile: boolean;
}

export interface ValueCaptureResult {
  allowedRevenueLines: string[];
  blockedRevenueLines: string[];
  grayAreaRevenueLines: string[];
  suggestedCompliantStructure: string;
}

export interface MerchantRewardInput {
  rewardTrigger: RewardTrigger;
  isMerchantFunded: boolean;
  isBalanceBased: boolean;
  isTimeBased: boolean;
  isIssuerAffiliateFunded: boolean;
  isTransactionSpecific: boolean;
  isNonCash: boolean;
}

export interface MerchantRewardResult {
  classification: YieldRiskLevel;
  reason: string;
  contractLanguageNeeded: string[];
  prohibitedMarketingLanguage: string[];
  saferStructure: string;
}

export interface TokenizedDepositInput {
  regulatedFinancialInstitutionControls: boolean;
  separateFromStablecoin: boolean;
  depositTermsMapped: boolean;
  interestOrDividendDisclosuresReady: boolean;
  taxReportingMapped: boolean;
  coreBankingLedgerMapped: boolean;
}

export interface TokenizedDepositResult {
  laneStatus: string;
  requiredPartner: string;
  complianceChecklist: string[];
  prohibitedClaims: string[];
  integrationPlan: string[];
}

export interface PublicChainInput {
  network: "XRPL" | "Stellar" | "Ethereum L2" | "Solana" | "Private permissioned ledger" | "Rust-native Troptions settlement ledger";
  chainRiskReviewApproved: boolean;
  smartContractAuditApproved: boolean;
  bridgeRiskReviewed: boolean;
  custodyModelDefined: boolean;
  monitoringEnabled: boolean;
  walletControlsApproved: boolean;
  incidentResponseApproved: boolean;
}

export interface PublicChainResult {
  networkScore: number;
  allowedForResearch: boolean;
  allowedForSandbox: boolean;
  allowedForLive: boolean;
  liveBlockers: string[];
  monitoringRequirements: string[];
}

export interface RwaConfusionInput {
  marketedAsStablecoin: boolean;
  redemptionLinkedToRwaPerformance: boolean;
  guaranteedYieldClaim: boolean;
  investmentReturnWithoutSecuritiesReview: boolean;
  privateMarketAccessWithoutEligibilityChecks: boolean;
  troptionsClaimsCustodyWithoutAuthority: boolean;
}

export interface RwaConfusionResult {
  blocked: boolean;
  reasons: string[];
  requiredReview: string[];
  saferLanguage: string;
}

export interface YieldApiEnvelope<T> {
  status: "ok" | "blocked";
  complianceMode: RegulatoryMode;
  result: T;
  riskLevel: YieldRiskLevel;
  legalReviewRequired: boolean;
  liveActionBlocked: boolean;
  reasons: string[];
  saferAlternative: string;
}