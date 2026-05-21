// TROPTIONS Exchange OS — XRPL Shared Types

export interface XrplAmount {
  currency: string;
  issuer?: string;
  value: string;
}

export interface XrplTokenInfo {
  currency: string;
  issuer?: string;
  name?: string;
  hexCurrency?: string;
  /** TROPTIONS 9-char ticker encoded as 40-char hex */
  isNonStandardTicker?: boolean;
}

export interface XrplTrustLine {
  currency: string;
  issuer: string;
  balance: string;
  limit: string;
  limitPeer: string;
  freeze?: boolean;
  freezePeer?: boolean;
  noRipple?: boolean;
}

export interface XrplAccountInfo {
  address: string;
  xrpBalance: string;
  sequence: number;
  ownerCount: number;
  trustLines: XrplTrustLine[];
  flags?: number;
  domain?: string;
}

export interface XrplOffer {
  account: string;
  sequence: number;
  takerPays: string | XrplAmount;
  takerGets: string | XrplAmount;
  quality?: string;
  flags?: number;
}

export interface XrplOrderBook {
  bids: XrplOffer[];
  asks: XrplOffer[];
  timestamp: string;
}

export interface XrplAmmPool {
  account: string;
  asset1: XrplAmount;
  asset2: XrplAmount;
  lpTokenBalance: XrplAmount;
  tradingFee: number; // 0–1000 (1000 = 1%)
  voteSlots?: unknown[];
}

export interface XrplQuoteResult {
  /** Whether this quote is based on real data or demo simulation */
  demoMode: boolean;
  fromAmount: XrplAmount | string;
  toAmount: XrplAmount | string;
  route: "DEX" | "AMM" | "Pathfinding" | "Demo";
  estimatedSlippagePct: number;
  estimatedFeesXrp: string;
  priceImpactWarning: boolean;
  mainnetEnabled: boolean;
}

/** Unsigned transaction blob — wallet must sign before submitting */
export interface UnsignedXrplTransaction {
  txBlob: Record<string, unknown>;
  txType: "OfferCreate" | "TrustSet" | "Payment" | "AMMCreate" | "AccountSet";
  networkId: number;
  networkName: "testnet" | "mainnet";
  /** ISO timestamp when this unsigned tx expires */
  expiresAt: string;
  demoMode: boolean;
  signingNote: string;
}

export interface XrplIssuedAsset {
  currency: string;
  issuer: string;
  name: string;
  description?: string;
  logoUrl?: string;
  verifiedIssuer: boolean;
  freezeEnabled: boolean;
  clawbackEnabled: boolean;
  transferFee?: number;
  metadataUrl?: string;
}

/** Standard XRPL error response */
export interface XrplErrorResponse {
  error: string;
  errorCode?: number;
  errorMessage?: string;
  status: "error";
}

export function isXrplError(v: unknown): v is XrplErrorResponse {
  return typeof v === "object" && v !== null && (v as XrplErrorResponse).status === "error";
}

/** Decode non-standard 9-char hex-encoded currency ticker */
export function hexCurrencyToLabel(hex: string): string {
  if (hex.length !== 40) return hex;
  let str = "";
  for (let i = 0; i < hex.length; i += 2) {
    const code = parseInt(hex.slice(i, i + 2), 16);
    if (code > 0x20 && code < 0x7f) str += String.fromCharCode(code);
  }
  return str || hex.slice(0, 8) + "…";
}
