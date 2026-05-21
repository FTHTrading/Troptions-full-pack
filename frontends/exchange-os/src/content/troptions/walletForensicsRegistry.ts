export type SupportedChain = "xrpl" | "stellar" | "ethereum_evm" | "tron" | "solana";

export type TransactionClassification =
  | "native-xrp-payment"
  | "exchange-deposit"
  | "exchange-withdrawal"
  | "issued-currency-iou"
  | "trustline-created"
  | "trustline-removed"
  | "nft-mint"
  | "nft-burn"
  | "offer-create"
  | "amm-related"
  | "account-config"
  | "signing-key-change"
  | "unknown";

export interface WalletForensicsWalletRecord {
  readonly walletId: string;
  readonly address: string;
  readonly chain: SupportedChain;
  readonly label: string;
  readonly source: string;
  readonly role: string;
  readonly firstSeen: string;
  readonly lastSeen: string;
  readonly activationTx?: string;
  readonly activatedBy?: string;
  readonly initialBalance?: string;
  readonly currentBalance?: string;
  readonly reserve?: string;
  readonly availableBalance?: string;
  readonly masterKeyStatus?: "enabled" | "disabled" | "unknown";
  readonly regularKey?: string;
  readonly signingKeySeen?: boolean;
  readonly domain?: string;
  readonly riskStatus: "low" | "medium" | "high" | "unknown";
  readonly notes: readonly string[];
  readonly explorerLinks: readonly { label: string; url: string }[];
}

export interface WalletForensicsTransactionRecord {
  readonly txHash: string;
  readonly chain: SupportedChain;
  readonly date: string;
  readonly type: string;
  readonly from: string;
  readonly to: string;
  readonly destinationTag?: string;
  readonly amount: string;
  readonly currency: string;
  readonly issuer?: string;
  readonly fee: string;
  readonly deliveredAmount: string;
  readonly outcome: "success" | "failed" | "pending";
  readonly ledgerIndex?: number;
  readonly sequence?: number;
  readonly nativeOrIou: "native" | "iou";
  readonly classification: TransactionClassification;
  readonly riskLabel: "info" | "warning" | "critical";
  readonly plainEnglishSummary: string;
  readonly explorerUrl: string;
}

export interface WalletForensicsExchangeDepositRecord {
  readonly exchangeName: string;
  readonly exchangeAccount: string;
  readonly destinationTag: string;
  readonly txHash: string;
  readonly amount: string;
  readonly currency: string;
  readonly fromWallet: string;
  readonly date: string;
  readonly status: "delivered" | "pending" | "failed" | "unknown";
  readonly supportMessage: string;
  readonly requiredNextAction: string;
}

export const CHANGE_NOW_SUPPORT_TEMPLATE = `I need help locating an XRP deposit.

Tx hash:
84F7978E290E10A8F6FBFF17D04846C9E90EDC8224A40071DB70D55458A2FD47

Amount:
81.417325 XRP

From:
rpP12ND2K7ZRzXZBEUnQM2i18tMGytXnW1

To:
rKKbNYZRqwPgZYkFWvqNUFBuscEyiFyCE

Destination tag:
614122458

Date:
Mar 05, 2026, 12:46:21 AM UTC

Outcome:
Success

Please identify the ChangeNOW order tied to destination tag 614122458, confirm the payout asset/address, confirm whether payout completed, and advise whether refund is possible if the order failed.`;

export const XRPL_KNOWN_ISSUE_PLAIN_ENGLISH =
  "81.417325 XRP left wallet rpP12ND2K7ZRzXZBEUnQM2i18tMGytXnW1 and was delivered successfully to the XRPL account labeled ChangeNOW (3). The transaction used destination tag 614122458. That means the XRP entered ChangeNOW's internal deposit system. To trace what happened after that, the destination tag and transaction hash must be provided to ChangeNOW support.";

export const XRPL_CONTROL_KEY_QUESTION =
  "The critical control question is who set and controlled the regular keys rpKmcC1PevAxTBRQgkYtakdGVup2K2Luqh and rJpKvdn64acBnVGNQ873JpQKujA4TAVbfN after master-key disablement.";

export const XRPL_FORENSICS_TIMELINE: readonly string[] = [
  "2026-02-07: Legacy wallet set (issuer/treasury/escrow/attestation/amm/trading) generated offline.",
  "2026-02-18 16:00–16:01 UTC: Issuer rGSDDiG (unykorn.org) distributes UnyKorn USDT to 4 holder wallets: rKNvud9 (39.7M), rnAF6Ki (38.8M), rPqUumc (38.8M), rGhaJrY (10M). Total: ~127.3M USDT issued.",
  "2026-02-18: rpP12ND wallet ecosystem receives XRP and multiple IOUs from rGSDDiG (USDT, GOLD, EUR, USD, GBP, DONK). rDEW3 opens a USDT trustline (50M limit).",
  "2026-02-21: NFT burn activity observed on rpP12ND.",
  "2026-02-25 11:06:01 UTC: SetRegularKey on rpP12ND → rpKmcC1PevAxTBRQgkYtakdGVup2K2Luqh. [CRITICAL — first key takeover]",
  "2026-02-25 11:06:10 UTC: AccountSet asfDisableMaster on rpP12ND. Original owner loses master key control.",
  "2026-03-04 04:41 UTC: rDEW3 sends 20,000,513.71 USDT back to issuer rGSDDiG (tx: E29E7C...934C80). IOU burned.",
  "2026-03-04 05:15 UTC: rPqUumc sends 38.8M USDT to rGSDDiG (tx: 95D3B8...C9DBD2). IOU burned.",
  "2026-03-04 05:22 UTC: rnAF6Ki sends 38.8M USDT to rGSDDiG (tx: 0FCFAA...177124). IOU burned.",
  "2026-03-04 05:35 UTC: rGhaJrY sends 10.0M USDT to rGSDDiG (tx: 646C49...CA0A80). IOU burned.",
  "2026-03-04 06:45 UTC: rKNvud9 sends 39.7M USDT to rGSDDiG (tx: 6839ED...0114DA). IOU burned.",
  "2026-03-04 07:37 UTC: rpP12ND sends 37.6M USDT to rGSDDiG (tx: 61717F...7D4943). IOU burned.",
  "2026-03-04 21:47:41 UTC: rDEW3 sends 8.101678 XRP to rpP12ND — topping up reserve ahead of sweep.",
  "2026-03-04 23:47 UTC: rKNvud9 closes all trustlines (USDT, DRUNKS, DONK, GOLD set to 0).",
  "2026-03-04 23:47:41 UTC: rDEW3 AccountDelete attempt → FAILS (tecHAS_OBLIGATIONS, USDT trustline still open). Fee: 0.2 XRP.",
  "2026-03-05 00:24:22 UTC: SetRegularKey on rpP12ND → rJpKvdn64acBnVGNQ873JpQKujA4TAVbfN. [CRITICAL — final controller set, 22 min before theft]",
  "2026-03-05 00:25 UTC: AMM withdraw activity on rpP12ND.",
  "2026-03-05 00:29–00:38 UTC: rpP12ND sends remaining IOU balances to rGSDDiG (USDT 37.6M, GOLD 15M, EUR 25M, USD 60K, GBP 22.5M, DONK 2M). All burned.",
  "2026-03-05 00:33–00:43 UTC: rpP12ND closes all trustlines (DONK, USDT, GOLD, GBP, EUR, USD all set to 0).",
  "2026-03-05 00:38 UTC: IOU drain complete. rGSDDiG now shows 0 IOUs issued, 0 held. Entire USDT supply destroyed.",
  "2026-03-05 00:46:21 UTC: FINAL SWEEP — 81.417325 XRP sent from rpP12ND to ChangeNOW (rKKbNYZR...) destination tag 614122458. Tx: 84F7978E...",
  "2026-03-24: rGSDDiG account still active with 7.02 XRP; no IOUs. Rippling still enabled. Two small 0.000001 XRP dust payments received.",
];

export const WALLET_FORENSICS_SCOPE = {
  mission:
    "Read-only wallet intelligence and XRPL funds forensics. No signing, no transaction submission, no private-key handling.",
  safetyRules: [
    "No private key, seed, family seed, or mnemonic collection.",
    "No transaction signing.",
    "No transaction submission.",
    "No live wallet connection required for analysis.",
    "Only public ledger data, addresses, and hashes.",
  ] as const,
} as const;
