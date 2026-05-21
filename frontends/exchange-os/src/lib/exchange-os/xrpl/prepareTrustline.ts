// TROPTIONS Exchange OS — Prepare Unsigned TrustSet Transaction
// Returns unsigned TrustSet blob. Wallet must sign. Never stores keys.

import { xrplConfig } from "@/config/exchange-os/xrpl";
import type { UnsignedXrplTransaction } from "./types";

export interface PrepareTrustlineRequest {
  walletAddress: string;
  currency: string;
  issuer: string;
  /** Maximum tokens to trust — user sets this */
  limit: string;
}

/** Prepare unsigned TrustSet for user to sign */
export function prepareXrplTrustline(
  req: PrepareTrustlineRequest
): UnsignedXrplTransaction {
  const networkId = xrplConfig.mainnetEnabled ? 0 : 1;
  const networkName = xrplConfig.mainnetEnabled ? "mainnet" : "testnet";
  const expiresAt = new Date(
    Date.now() + xrplConfig.unsignedTxTtlSecs * 1_000
  ).toISOString();

  const txBlob: Record<string, unknown> = {
    TransactionType: "TrustSet",
    Account: req.walletAddress,
    LimitAmount: {
      currency: req.currency,
      issuer: req.issuer,
      value: req.limit,
    },
    // Sequence, Fee, LastLedgerSequence: filled by wallet signer
  };

  return {
    txBlob,
    txType: "TrustSet",
    networkId,
    networkName,
    expiresAt,
    demoMode: xrplConfig.demoMode,
    signingNote:
      "This sets a trust line so your wallet can hold this token. " +
      "Sign with your XRPL wallet. TROPTIONS never sees your keys.",
  };
}
