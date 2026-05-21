// TROPTIONS Exchange OS — Read Token from XRPL
// Read-only. Returns token info from on-chain data.

import { xrplReadQuery } from "./client";
import { xrplConfig } from "@/config/exchange-os/xrpl";
import { DEMO_TOKENS } from "@/config/exchange-os/demoData";
import { hexCurrencyToLabel } from "./types";
import type { XrplTokenInfo, XrplIssuedAsset } from "./types";

/** Fetch token (issued asset) metadata from the XRPL ledger */
export async function readXrplToken(
  currency: string,
  issuer: string
): Promise<XrplIssuedAsset | null> {
  if (xrplConfig.demoMode) {
    // In demo mode, return demo data if available
    const demo = DEMO_TOKENS.find(
      (t) => t.ticker === currency || t.issuer === issuer
    );
    if (demo) {
      return {
        currency: demo.ticker,
        issuer: demo.issuer,
        name: demo.name,
        description: demo.description,
        logoUrl: demo.logoUrl,
        verifiedIssuer: demo.verificationStatus === "verified",
        freezeEnabled: demo.freezeEnabled,
        clawbackEnabled: demo.clawbackEnabled,
      };
    }
    return null;
  }

  try {
    const result = (await xrplReadQuery("account_info", {
      account: issuer,
      ledger_index: "validated",
    })) as { account_data?: { Flags?: number; Domain?: string } } | null;

    if (!result?.account_data) return null;

    const flags = result.account_data.Flags ?? 0;
    // XRPL account flags for freeze/clawback
    const freezeEnabled = !!(flags & 0x00200000); // lsfNoFreeze is NOT set
    const clawbackEnabled = !!(flags & 0x80000000); // lsfAllowTrustLineClawback

    const displayCurrency =
      currency.length === 40 ? hexCurrencyToLabel(currency) : currency;

    return {
      currency: displayCurrency,
      issuer,
      name: displayCurrency,
      verifiedIssuer: false, // verification requires off-chain registry check
      freezeEnabled,
      clawbackEnabled,
    };
  } catch {
    return null;
  }
}

/** Resolve a human-readable currency string to XRPL format */
export function resolveCurrencyCode(ticker: string): XrplTokenInfo {
  if (ticker.toUpperCase() === "TROPTIONS") {
    return {
      currency: xrplConfig.troptionsHex,
      issuer: xrplConfig.troptionsIssuer,
      name: "TROPTIONS",
      hexCurrency: xrplConfig.troptionsHex,
      isNonStandardTicker: true,
    };
  }
  if (ticker.toUpperCase() === "XRP") {
    return { currency: "XRP", name: "XRP" };
  }
  return { currency: ticker.toUpperCase(), name: ticker.toUpperCase() };
}
