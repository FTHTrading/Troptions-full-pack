export interface WalletInvestigationChecklistItem {
  readonly id: string;
  readonly section: string;
  readonly item: string;
}

export const WALLET_INVESTIGATION_CHECKLIST: readonly WalletInvestigationChecklistItem[] = [
  { id: "check-1", section: "Evidence", item: "Collect public wallet address, tx hash, timestamp, amount, and chain." },
  { id: "check-2", section: "Classification", item: "Separate native XRP from issued-currency IOUs." },
  { id: "check-3", section: "Exchange", item: "Detect exchange deposit destination accounts and destination tags." },
  { id: "check-4", section: "Trustlines", item: "Review trustline create/remove events and issuer exposure." },
  { id: "check-5", section: "NFT / AMM", item: "Identify NFT events and AMM / DEX references." },
  { id: "check-6", section: "Signing Keys", item: "Review master key and regular key changes or anomalies." },
  { id: "check-7", section: "Support", item: "Generate support-ready message for exchange/internal routing issues." },
  { id: "check-8", section: "Safety", item: "Do not request or store private keys, seeds, or mnemonics." },
];
