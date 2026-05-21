import {
  CHANGE_NOW_SUPPORT_TEMPLATE,
  WALLET_FORENSICS_SCOPE,
} from "@/content/troptions/walletForensicsRegistry";
import { XRPL_EXCHANGE_DEPOSIT_REGISTRY } from "@/content/troptions/xrplExchangeDepositRegistry";
import { XRPL_IOU_REGISTRY } from "@/content/troptions/xrplIouRegistry";
import { XRPL_TRANSACTION_REGISTRY } from "@/content/troptions/xrplTransactionRegistry";
import { XRPL_WALLET_INVENTORY_REGISTRY } from "@/content/troptions/xrplWalletInventoryRegistry";
import { STELLAR_WALLET_INVENTORY_REGISTRY } from "@/content/troptions/stellarWalletInventoryRegistry";
import { getFlowNarrative } from "@/lib/troptions/xrplFundsFlowAnalyzer";

export function getWalletForensicsSummary() {
  return {
    mission: WALLET_FORENSICS_SCOPE.mission,
    safetyRules: WALLET_FORENSICS_SCOPE.safetyRules,
    trackedWalletCount: XRPL_WALLET_INVENTORY_REGISTRY.length + STELLAR_WALLET_INVENTORY_REGISTRY.length,
    trackedTransactionCount: XRPL_TRANSACTION_REGISTRY.length,
    exchangeDepositCount: XRPL_EXCHANGE_DEPOSIT_REGISTRY.length,
    iouCodeCount: XRPL_IOU_REGISTRY.length,
    keyIssue: getFlowNarrative(),
    supportTemplate: CHANGE_NOW_SUPPORT_TEMPLATE,
  };
}

export function getWalletForensicsDataset() {
  return {
    wallets: [...XRPL_WALLET_INVENTORY_REGISTRY, ...STELLAR_WALLET_INVENTORY_REGISTRY],
    transactions: XRPL_TRANSACTION_REGISTRY,
    exchangeDeposits: XRPL_EXCHANGE_DEPOSIT_REGISTRY,
    ious: XRPL_IOU_REGISTRY,
  };
}
