import { XRPL_EXCHANGE_DEPOSIT_REGISTRY } from "@/content/troptions/xrplExchangeDepositRegistry";

export function getExchangeDeposits() {
  return XRPL_EXCHANGE_DEPOSIT_REGISTRY;
}

export function getExchangeDepositByTxHash(txHash: string) {
  return XRPL_EXCHANGE_DEPOSIT_REGISTRY.find((item) => item.txHash.toLowerCase() === txHash.toLowerCase());
}
