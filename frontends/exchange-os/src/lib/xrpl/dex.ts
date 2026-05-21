/**
 * XRPL DEX facade for Exchange OS — re-exports read/prepare helpers.
 * Canonical implementation: @/lib/exchange-os/xrpl/*
 */
export {
  xrplReadAccountInfo,
  xrplReadAccountLines,
  xrplReadBookOffers,
} from "@/lib/exchange-os/xrpl/client";

export { getXrplQuote } from "@/lib/exchange-os/xrpl/quote";
export { prepareXrplSwap } from "@/lib/exchange-os/xrpl/prepareSwap";
export { readXrplAmm } from "@/lib/exchange-os/xrpl/readAmm";

export type { XrplErrorResponse } from "@/lib/exchange-os/xrpl/types";

/** Governance kill-switch hook — pass flag from worker env or API */
export function isXrplTradingAllowed(opts: {
  xrplMainnetEnabled: boolean;
  killSwitchArmed?: boolean;
}): boolean {
  if (!opts.xrplMainnetEnabled) return false;
  if (opts.killSwitchArmed) return false;
  return true;
}
