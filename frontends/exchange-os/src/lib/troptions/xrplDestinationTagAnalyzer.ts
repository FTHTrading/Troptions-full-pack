import { XRPL_EXCHANGE_DEPOSIT_REGISTRY } from "@/content/troptions/xrplExchangeDepositRegistry";

export interface DestinationTagAnalysis {
  readonly isTaggedExchangeDeposit: boolean;
  readonly exchangeName?: string;
  readonly note: string;
}

export function analyzeDestinationTag(destinationTag: string, destinationAccount: string): DestinationTagAnalysis {
  const found = XRPL_EXCHANGE_DEPOSIT_REGISTRY.find(
    (r) => r.destinationTag === destinationTag && r.exchangeAccount.toLowerCase() === destinationAccount.toLowerCase(),
  );

  if (found) {
    return {
      isTaggedExchangeDeposit: true,
      exchangeName: found.exchangeName,
      note:
        "Destination tag matched an exchange deposit route. Post-deposit flow is exchange-internal and must be traced through exchange support.",
    };
  }

  return {
    isTaggedExchangeDeposit: false,
    note: "Destination tag not matched to known exchange deposit mapping in current registry.",
  };
}
