import type { WalletForensicsExchangeDepositRecord } from "@/content/troptions/walletForensicsRegistry";
import { CHANGE_NOW_SUPPORT_TEMPLATE } from "@/content/troptions/walletForensicsRegistry";

export const XRPL_EXCHANGE_DEPOSIT_REGISTRY: readonly WalletForensicsExchangeDepositRecord[] = [
  {
    exchangeName: "ChangeNOW",
    exchangeAccount: "rKKbNYZRqwPgZYkFWvqNUFBuscEyiFyCE",
    destinationTag: "614122458",
    txHash: "84F7978E290E10A8F6FBFF17D04846C9E90EDC8224A40071DB70D55458A2FD47",
    amount: "81.417325",
    currency: "XRP",
    fromWallet: "rpP12ND2K7ZRzXZBEUnQM2i18tMGytXnW1",
    date: "2026-03-05T00:46:21Z",
    status: "delivered",
    supportMessage: CHANGE_NOW_SUPPORT_TEMPLATE,
    requiredNextAction:
      "Provide tx hash and destination tag to ChangeNOW support and request internal order lookup, payout status, and refund path.",
  },
];
