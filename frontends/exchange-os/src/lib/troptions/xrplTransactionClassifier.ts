import type {
  TransactionClassification,
  WalletForensicsTransactionRecord,
} from "@/content/troptions/walletForensicsRegistry";

const KNOWN_EXCHANGE_DEPOSIT_ACCOUNTS = new Set([
  "rKKbNYZRqwPgZYkFWvqNUFBuscEyiFyCE".toLowerCase(),
]);

export function classifyXrplTransaction(
  tx: Pick<WalletForensicsTransactionRecord, "currency" | "classification" | "to" | "destinationTag" | "nativeOrIou">,
): TransactionClassification {
  if (tx.classification !== "unknown") return tx.classification;

  if (tx.nativeOrIou === "native" && tx.currency === "XRP") {
    if (KNOWN_EXCHANGE_DEPOSIT_ACCOUNTS.has(tx.to.toLowerCase()) && tx.destinationTag) {
      return "exchange-deposit";
    }
    return "native-xrp-payment";
  }

  if (tx.nativeOrIou === "iou") return "issued-currency-iou";
  return "unknown";
}
