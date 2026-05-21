import { XRPL_IOU_REGISTRY } from "@/content/troptions/xrplIouRegistry";

export interface XrplIouClassification {
  readonly isIou: boolean;
  readonly warning: string;
}

const KNOWN_IOU_CODES = new Set(XRPL_IOU_REGISTRY.map((r) => r.currency.toUpperCase()));

export function classifyXrplCurrency(currencyCode: string): XrplIouClassification {
  const code = currencyCode.toUpperCase();
  if (code === "XRP") {
    return {
      isIou: false,
      warning: "Native XRP movement.",
    };
  }

  if (KNOWN_IOU_CODES.has(code)) {
    return {
      isIou: true,
      warning:
        "Issued currency / IOU detected. Verify issuer, trustline, liquidity, and redemption pathway before treating as cash-equivalent value.",
    };
  }

  return {
    isIou: true,
    warning: "Non-XRP code on XRPL should be treated as issued currency / IOU unless proven otherwise.",
  };
}
