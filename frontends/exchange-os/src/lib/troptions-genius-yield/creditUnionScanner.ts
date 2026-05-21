import type { CreditUnionOpportunityScore, CreditUnionPartnerInput } from "@/lib/troptions-genius-yield/types";

export function scoreCreditUnionCUSOOpportunity(partner: CreditUnionPartnerInput): CreditUnionOpportunityScore {
  const categoryScores = {
    memberBaseSize: Math.min(10, Math.round(partner.memberBaseSize / 10000)),
    merchantRelationships: partner.merchantRelationshipsScore,
    digitalBankingMaturity: partner.digitalBankingMaturity,
    cusoParticipation: partner.cusoParticipation,
    paymentInnovationAppetite: partner.paymentInnovationAppetite,
    complianceMaturity: partner.complianceMaturity,
    coreBankingIntegrationReadiness: partner.coreBankingIntegrationReadiness,
    kycKybReadiness: partner.kycKybReadiness,
    boardReadiness: partner.boardReadiness,
    regulatorReadiness: partner.regulatorReadiness,
    reserveCustodyReadiness: partner.reserveCustodyReadiness,
    tokenizedDepositLaneSupport: partner.tokenizedDepositLaneSupport,
    merchantSettlementLaneSupport: partner.merchantSettlementLaneSupport,
  };

  const totalScore = Math.min(
    100,
    Object.values(categoryScores).reduce((sum, value) => sum + value, 0),
  );

  const strongestPlay = partner.tokenizedDepositLaneSupport >= partner.merchantSettlementLaneSupport
    ? "tokenized_deposit_lane"
    : "merchant_settlement_lane";

  const missingItems = Object.entries(categoryScores)
    .filter(([, value]) => value < 6)
    .map(([key]) => key);

  return {
    totalScore,
    categoryScores,
    strongestPlay,
    missingItems,
    nextActions: [
      "Collect partner diligence packet.",
      "Map core banking and KYC/KYB integration requirements.",
      "Prepare board and regulator readiness narrative.",
    ],
  };
}