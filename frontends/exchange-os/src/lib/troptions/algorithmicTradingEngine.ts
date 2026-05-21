type TradingApprovals = {
  legalApproved: boolean;
  complianceApproved: boolean;
  riskApproved: boolean;
  custodyApproved: boolean;
  venueApproved: boolean;
  boardApproved: boolean;
};

export function canEnableAlgorithmicTrading(approvals: TradingApprovals) {
  const blockedReasons: string[] = [];
  if (!approvals.legalApproved) blockedReasons.push("Legal approval missing");
  if (!approvals.complianceApproved) blockedReasons.push("Compliance approval missing");
  if (!approvals.riskApproved) blockedReasons.push("Risk approval missing");
  if (!approvals.custodyApproved) blockedReasons.push("Custody approval missing");
  if (!approvals.venueApproved) blockedReasons.push("Trading venue approval missing");
  if (!approvals.boardApproved) blockedReasons.push("Board approval missing");

  return {
    allowed: blockedReasons.length === 0,
    blockedReasons,
    simulationOnly: blockedReasons.length > 0,
  };
}
