// TROPTIONS Exchange OS — Prepare Unsigned Swap Transaction
// Returns unsigned XRPL OfferCreate blob. Wallet must sign. Never auto-submits.

import { xrplConfig } from "@/config/exchange-os/xrpl";
import { resolveCurrencyCode } from "./readToken";
import type { UnsignedXrplTransaction, XrplAmount } from "./types";

export interface PrepareSwapRequest {
  /** XRPL address of the swapping wallet */
  walletAddress: string;
  fromTicker: string;
  toTicker: string;
  fromIssuer?: string;
  toIssuer?: string;
  fromAmount: string;
  toAmount: string;
  /** Allow up to N% slippage before transaction expires */
  slippagePct?: number;
}

/** Prepare an unsigned OfferCreate for user to sign in their wallet */
export function prepareXrplSwap(
  req: PrepareSwapRequest
): UnsignedXrplTransaction {
  const networkId = xrplConfig.mainnetEnabled ? 0 : 1;
  const networkName = xrplConfig.mainnetEnabled ? "mainnet" : "testnet";
  const expiresAt = new Date(
    Date.now() + xrplConfig.unsignedTxTtlSecs * 1_000
  ).toISOString();

  const fromToken = resolveCurrencyCode(req.fromTicker);
  const toToken = resolveCurrencyCode(req.toTicker);

  const takerPays: string | XrplAmount =
    toToken.currency === "XRP"
      ? String(Math.round(parseFloat(req.toAmount) * 1_000_000)) // drops
      : {
          currency: toToken.currency,
          issuer: req.toIssuer ?? toToken.issuer ?? "",
          value: req.toAmount,
        };

  const takerGets: string | XrplAmount =
    fromToken.currency === "XRP"
      ? String(Math.round(parseFloat(req.fromAmount) * 1_000_000)) // drops
      : {
          currency: fromToken.currency,
          issuer: req.fromIssuer ?? fromToken.issuer ?? "",
          value: req.fromAmount,
        };

  const txBlob: Record<string, unknown> = {
    TransactionType: "OfferCreate",
    Account: req.walletAddress,
    TakerPays: takerPays,
    TakerGets: takerGets,
    Flags: 0x00080000, // tfImmediateOrCancel = fill immediately or cancel
    // Sequence, Fee, LastLedgerSequence: filled by wallet signer
  };

  return {
    txBlob,
    txType: "OfferCreate",
    networkId,
    networkName,
    expiresAt,
    demoMode: xrplConfig.demoMode,
    signingNote:
      "This transaction has NOT been submitted. " +
      "Sign it with your XRPL wallet (e.g. XUMM, Crossmark, or xrpl.js). " +
      "TROPTIONS never holds or requests your private key or seed phrase.",
  };
}
