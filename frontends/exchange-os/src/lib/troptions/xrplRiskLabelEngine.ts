export type RiskLabel = "info" | "warning" | "critical";

export function deriveRiskLabel(params: {
  readonly isExchangeDeposit: boolean;
  readonly hasDestinationTag: boolean;
  readonly masterKeyDisabled: boolean;
}): RiskLabel {
  if (params.isExchangeDeposit && params.hasDestinationTag && params.masterKeyDisabled) {
    return "critical";
  }

  if (params.isExchangeDeposit || params.masterKeyDisabled) {
    return "warning";
  }

  return "info";
}
