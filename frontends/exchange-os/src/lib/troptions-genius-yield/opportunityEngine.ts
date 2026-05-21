import { calculatePPSIApplicationClock } from "@/lib/troptions-genius-yield/applicationClock";
import { scoreCreditUnionCUSOOpportunity } from "@/lib/troptions-genius-yield/creditUnionScanner";
import { MOCK_CREDIT_UNION_PARTNER, MOCK_YIELD_INPUT, YIELD_ENGINE_MODE } from "@/lib/troptions-genius-yield/mockData";
import { evaluatePublicChainUse } from "@/lib/troptions-genius-yield/publicChainEligibility";
import { detectCompliantValueCapture } from "@/lib/troptions-genius-yield/rewardRisk";
import { classifyTokenizedDepositLane } from "@/lib/troptions-genius-yield/tokenizedDepositLane";
import { classifyYieldStructure } from "@/lib/troptions-genius-yield/yieldClassifier";

export function buildYieldOpportunityOverview() {
  return {
    mode: YIELD_ENGINE_MODE,
    yieldClassifier: classifyYieldStructure(MOCK_YIELD_INPUT),
    creditUnionOpportunity: scoreCreditUnionCUSOOpportunity(MOCK_CREDIT_UNION_PARTNER),
    applicationClock: calculatePPSIApplicationClock({
      dateSubmitted: "2026-04-01T00:00:00.000Z",
      substantiallyCompleteDate: "2026-04-15T00:00:00.000Z",
      missingDocuments: [],
      materialChangeResetRisk: true,
    }),
    valueCapture: detectCompliantValueCapture(),
    tokenizedDeposit: classifyTokenizedDepositLane({
      regulatedFinancialInstitutionControls: true,
      separateFromStablecoin: true,
      depositTermsMapped: true,
      interestOrDividendDisclosuresReady: true,
      taxReportingMapped: true,
      coreBankingLedgerMapped: false,
    }),
    publicChain: evaluatePublicChainUse({
      network: "XRPL",
      chainRiskReviewApproved: false,
      smartContractAuditApproved: false,
      bridgeRiskReviewed: false,
      custodyModelDefined: true,
      monitoringEnabled: true,
      walletControlsApproved: false,
      incidentResponseApproved: true,
    }),
  };
}