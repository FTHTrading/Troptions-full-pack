import { POST as classifyYieldRoute } from "@/app/api/genius-yield/classify-yield/route";
import {
  calculatePPSIApplicationClock,
  classifyMerchantReward,
  classifyTokenizedDepositLane,
  classifyYieldStructure,
  detectCompliantValueCapture,
  detectRWAStablecoinConfusion,
  evaluatePublicChainUse,
} from "@/lib/troptions-genius-yield";
import { evaluateStablecoinAction, GENIUS_GATES, GENIUS_PROFILE } from "@/lib/troptions/genius";

describe("GENIUS yield opportunity engine", () => {
  it("payment stablecoin plus holding balance reward is prohibited or high risk", () => {
    const result = classifyYieldStructure({
      productLane: "payment_stablecoin",
      rewardTrigger: "holding_balance",
      payer: "issuer",
      recipient: "holder",
      isStablecoinHolder: true,
      isAffiliateOfIssuer: false,
      isRelatedThirdParty: false,
      isSolelyForHoldingUseOrRetention: true,
      requiresDepositAccount: false,
      isTokenizedDeposit: false,
      isMerchantFunded: false,
      isTransactionSpecific: false,
      hasTimeBasedAccrual: false,
      hasBalanceBasedAccrual: true,
      legalMemoApproved: false,
      regulatorGuidanceMapped: false,
    });
    expect(["prohibited_block", "high_risk_likely_prohibited"]).toContain(result.riskLevel);
  });

  it("payment stablecoin plus holding time reward is prohibited or high risk", () => {
    const result = classifyYieldStructure({
      productLane: "payment_stablecoin",
      rewardTrigger: "holding_time",
      payer: "issuer",
      recipient: "holder",
      isStablecoinHolder: true,
      isAffiliateOfIssuer: false,
      isRelatedThirdParty: false,
      isSolelyForHoldingUseOrRetention: true,
      requiresDepositAccount: false,
      isTokenizedDeposit: false,
      isMerchantFunded: false,
      isTransactionSpecific: false,
      hasTimeBasedAccrual: true,
      hasBalanceBasedAccrual: false,
      legalMemoApproved: false,
      regulatorGuidanceMapped: false,
    });
    expect(["prohibited_block", "high_risk_likely_prohibited"]).toContain(result.riskLevel);
  });

  it("payment stablecoin plus affiliate pass-through reward is high risk", () => {
    const result = classifyYieldStructure({
      productLane: "payment_stablecoin",
      rewardTrigger: "affiliate_payment",
      payer: "affiliate",
      recipient: "holder",
      isStablecoinHolder: true,
      isAffiliateOfIssuer: true,
      isRelatedThirdParty: true,
      isSolelyForHoldingUseOrRetention: true,
      requiresDepositAccount: false,
      isTokenizedDeposit: false,
      isMerchantFunded: false,
      isTransactionSpecific: false,
      hasTimeBasedAccrual: false,
      hasBalanceBasedAccrual: false,
      legalMemoApproved: false,
      regulatorGuidanceMapped: false,
    });
    expect(result.riskLevel).toBe("high_risk_likely_prohibited");
  });

  it("tokenized deposit plus regulated FI controls is likely allowed with review", () => {
    const result = classifyYieldStructure({
      productLane: "tokenized_deposit",
      rewardTrigger: "tokenized_deposit_interest",
      payer: "regulated fi",
      recipient: "account holder",
      isStablecoinHolder: false,
      isAffiliateOfIssuer: false,
      isRelatedThirdParty: false,
      isSolelyForHoldingUseOrRetention: false,
      requiresDepositAccount: true,
      isTokenizedDeposit: true,
      isMerchantFunded: false,
      isTransactionSpecific: false,
      hasTimeBasedAccrual: true,
      hasBalanceBasedAccrual: true,
      legalMemoApproved: false,
      regulatorGuidanceMapped: true,
    });
    expect(result.riskLevel).toBe("likely_allowed_with_review");
  });

  it("merchant-funded purchase rebate is likely allowed with review", () => {
    const result = classifyMerchantReward({
      rewardTrigger: "transaction_completion",
      isMerchantFunded: true,
      isBalanceBased: false,
      isTimeBased: false,
      isIssuerAffiliateFunded: false,
      isTransactionSpecific: true,
      isNonCash: false,
    });
    expect(result.classification).toBe("likely_allowed_with_review");
  });

  it("merchant rebate based on stablecoin balance is high risk", () => {
    const result = classifyMerchantReward({
      rewardTrigger: "holding_balance",
      isMerchantFunded: true,
      isBalanceBased: true,
      isTimeBased: false,
      isIssuerAffiliateFunded: false,
      isTransactionSpecific: false,
      isNonCash: false,
    });
    expect(result.classification).toBe("high_risk_likely_prohibited");
  });

  it("reserve income retained by issuer is a likely allowed with review revenue line", () => {
    const result = detectCompliantValueCapture();
    expect(result.allowedRevenueLines).toContain("reserve dashboard fee");
    expect(result.blockedRevenueLines).toContain("issuer-paid stablecoin yield to holder");
  });

  it("RWA guaranteed yield claim is blocked", () => {
    const result = detectRWAStablecoinConfusion({
      marketedAsStablecoin: false,
      redemptionLinkedToRwaPerformance: false,
      guaranteedYieldClaim: true,
      investmentReturnWithoutSecuritiesReview: true,
      privateMarketAccessWithoutEligibilityChecks: false,
      troptionsClaimsCustodyWithoutAuthority: false,
    });
    expect(result.blocked).toBe(true);
    expect(result.reasons.join(" ")).toMatch(/guaranteed yield/i);
  });

  it("public chain use alone does not block sandbox", () => {
    const result = evaluatePublicChainUse({
      network: "XRPL",
      chainRiskReviewApproved: false,
      smartContractAuditApproved: false,
      bridgeRiskReviewed: false,
      custodyModelDefined: false,
      monitoringEnabled: false,
      walletControlsApproved: false,
      incidentResponseApproved: false,
    });
    expect(result.allowedForSandbox).toBe(true);
    expect(result.allowedForLive).toBe(false);
  });

  it("public chain live use requires audit monitoring and custody controls", () => {
    const result = evaluatePublicChainUse({
      network: "Ethereum L2",
      chainRiskReviewApproved: false,
      smartContractAuditApproved: false,
      bridgeRiskReviewed: false,
      custodyModelDefined: false,
      monitoringEnabled: false,
      walletControlsApproved: false,
      incidentResponseApproved: false,
    });
    expect(result.liveBlockers).toEqual(expect.arrayContaining(["chain risk review", "smart contract audit", "custody model", "monitoring"]));
  });

  it("PPSI 120-day clock calculates deadline correctly and missing docs block substantially complete status", () => {
    const result = calculatePPSIApplicationClock({
      dateSubmitted: "2026-04-01T00:00:00.000Z",
      substantiallyCompleteDate: "2026-04-15T00:00:00.000Z",
      missingDocuments: ["legal memo"],
      materialChangeResetRisk: true,
    });
    expect(result.timeline[1]?.date).toBe("2026-08-13T00:00:00.000Z");
    expect(result.readinessToFile).toBe(false);
  });

  it("live stablecoin issuance remains blocked by default", async () => {
    const routeResponse = await classifyYieldRoute(
      new Request("http://localhost/api/genius-yield/classify-yield", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          productLane: "payment_stablecoin",
          rewardTrigger: "holding_balance",
          payer: "issuer",
          recipient: "holder",
          isStablecoinHolder: true,
          isAffiliateOfIssuer: false,
          isRelatedThirdParty: false,
          isSolelyForHoldingUseOrRetention: true,
          requiresDepositAccount: false,
          isTokenizedDeposit: false,
          isMerchantFunded: false,
          isTransactionSpecific: false,
          hasTimeBasedAccrual: false,
          hasBalanceBasedAccrual: true,
          legalMemoApproved: false,
          regulatorGuidanceMapped: false,
        }),
      }),
    );
    const routeBody = await routeResponse.json();
    expect(routeBody.liveActionBlocked).toBe(true);

    const stablecoinDecision = evaluateStablecoinAction(GENIUS_PROFILE, GENIUS_GATES, "live_mint");
    expect(stablecoinDecision.allowed).toBe(false);
  });

  it("tokenized deposit lane stays separate from stablecoin lane", () => {
    const result = classifyTokenizedDepositLane({
      regulatedFinancialInstitutionControls: true,
      separateFromStablecoin: true,
      depositTermsMapped: true,
      interestOrDividendDisclosuresReady: true,
      taxReportingMapped: true,
      coreBankingLedgerMapped: true,
    });
    expect(result.prohibitedClaims).toContain("same product as payment stablecoin");
  });
});