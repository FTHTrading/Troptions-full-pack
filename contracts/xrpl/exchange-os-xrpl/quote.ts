// TROPTIONS Exchange OS — XRPL Route Quote (read-only)
// Returns best-route quote for a swap. Never executes trades.

import { xrplReadQuery } from "./client";
import { xrplConfig } from "@/config/exchange-os/xrpl";
import { resolveCurrencyCode } from "./readToken";
import type { XrplQuoteResult, XrplAmount } from "./types";

export interface QuoteRequest {
  fromTicker: string;
  toTicker: string;
  fromIssuer?: string;
  toIssuer?: string;
  amount: string; // human-readable amount
}

/** Get a best-route quote from XRPL — read-only, no execution */
export async function getXrplQuote(req: QuoteRequest): Promise<XrplQuoteResult> {
  const demoResult: XrplQuoteResult = {
    demoMode: true,
    fromAmount: req.amount + " " + req.fromTicker,
    toAmount: "~(simulated) " + req.toTicker,
    route: "Demo",
    estimatedSlippagePct: 0,
    estimatedFeesXrp: "0.00012",
    priceImpactWarning: false,
    mainnetEnabled: xrplConfig.mainnetEnabled,
  };

  if (xrplConfig.demoMode) return demoResult;

  try {
    const fromToken = resolveCurrencyCode(req.fromTicker);
    const toToken = resolveCurrencyCode(req.toTicker);

    const sendCurrency: string | XrplAmount =
      fromToken.currency === "XRP"
        ? "XRP"
        : {
            currency: fromToken.currency,
            issuer: req.fromIssuer ?? fromToken.issuer ?? "",
            value: req.amount,
          };

    const destCurrency: string | XrplAmount =
      toToken.currency === "XRP"
        ? "XRP"
        : {
            currency: toToken.currency,
            issuer: req.toIssuer ?? toToken.issuer ?? "",
            value: req.amount,
          };

    const result = (await xrplReadQuery("ripple_path_find", {
      source_account: xrplConfig.troptionsIssuer, // placeholder — pathfind only
      destination_account: xrplConfig.troptionsIssuer,
      destination_amount:
        typeof destCurrency === "string" ? "1000000" : destCurrency,
      send_max: sendCurrency,
    })) as {
      alternatives?: Array<{
        paths_computed?: unknown[];
        source_amount?: string | XrplAmount;
        destination_amount?: string | XrplAmount;
      }>;
    };

    const best = result?.alternatives?.[0];
    if (!best) {
      return { ...demoResult, demoMode: false, route: "DEX" };
    }

    return {
      demoMode: false,
      fromAmount: best.source_amount ?? req.amount,
      toAmount: best.destination_amount ?? req.amount,
      route: "Pathfinding",
      estimatedSlippagePct: 0.5, // real slippage requires AMM depth read
      estimatedFeesXrp: "0.00012",
      priceImpactWarning: false,
      mainnetEnabled: xrplConfig.mainnetEnabled,
    };
  } catch {
    return demoResult;
  }
}
