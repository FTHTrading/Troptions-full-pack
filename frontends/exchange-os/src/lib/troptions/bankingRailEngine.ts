import { BANKING_RAIL_REGISTRY } from "@/content/troptions/bankingRailRegistry";

export function listBankingRails() {
  return BANKING_RAIL_REGISTRY;
}

export function canInitiateLiveBankingTransfer() {
  return {
    allowed: false,
    blockedReasons: [
      "Live banking transfers are disabled by default",
      "Provider approval and board authorization are required",
    ],
  };
}
