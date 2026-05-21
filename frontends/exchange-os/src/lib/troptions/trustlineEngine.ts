/**
 * Unified Trust Engine
 * ─────────────────────────────────────────────────────────────────────────────
 * SERVER-SIDE ONLY.
 *
 * Aggregates live trustline, balance, and allowance data across:
 *   • XRPL    — account_lines WebSocket queries
 *   • Stellar  — Horizon REST balance/trustline queries
 *   • Polygon  — ERC-20 allowance JSON-RPC queries
 *
 * Also exposes resolved TROPTIONS issuer public addresses (never secrets).
 * For trustline write operations, delegates to xrplGenesisEngine /
 * stellarGenesisEngine which load secrets from env.
 */

import {
  getXrplTrustlinesLive,
  getXrplAccountLive,
  getXrplWalletAddresses,
  TROPTIONS_CURRENCY_HEX,
  type XrplLiveTrustline,
  type XrplLiveAccount,
} from "./xrplLedgerEngine";

import {
  getStellarAccountLive,
  getStellarTrustlines,
  getStellarWalletAddresses,
  type StellarLiveBalance,
  type StellarLiveAccount,
} from "./stellarLedgerEngine";

import {
  getPolygonAccountSummary,
  getErc20Allowance,
  POLYGON_KNOWN_TOKENS,
  type PolygonAccountSummary,
} from "./polygonWalletEngine";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface TroptionsIssuerAddresses {
  xrpl: {
    issuer:      string | null;
    distributor: string | null;
    treasury:    string | null;
    nftIssuer:   string | null;
    dexMaker:    string | null;
    ammLp:       string | null;
  };
  stellar: {
    issuer:      string | null;
    distributor: string | null;
    lp:          string | null;
    anchor:      string | null;
  };
  polygon: {
    kennyToken: string;
    evlToken:   string;
  };
}

export interface XrplTrustlineStatus {
  address:          string;
  account:          XrplLiveAccount | null;
  trustlines:       XrplLiveTrustline[];
  troptionsBalance: string;
  issuerAddress:    string | null;
  error?:           string;
}

export interface StellarTrustlineStatus {
  address:          string;
  account:          StellarLiveAccount | null;
  trustlines:       StellarLiveBalance[];
  troptionsBalance: string;
  issuerAddress:    string | null;
  error?:           string;
}

export interface MultiChainTrustSummary {
  xrpl?:    XrplTrustlineStatus;
  stellar?: StellarTrustlineStatus;
  polygon?: PolygonAccountSummary;
  issuers:  TroptionsIssuerAddresses;
  queriedAt: string;
}

// ─── Issuer address resolution ────────────────────────────────────────────────

/**
 * Resolve all TROPTIONS issuer and operation wallet public addresses.
 * Derived from env seeds/secrets — safe to include in API responses.
 * Never returns private keys or seeds.
 */
export function getTroptionsIssuerAddresses(): TroptionsIssuerAddresses {
  const xrpl    = getXrplWalletAddresses();
  const stellar = getStellarWalletAddresses();
  return {
    xrpl,
    stellar,
    polygon: {
      kennyToken: POLYGON_KNOWN_TOKENS.KENNY.address,
      evlToken:   POLYGON_KNOWN_TOKENS.EVL.address,
    },
  };
}

// ─── Per-chain trustline status ───────────────────────────────────────────────

/**
 * Live XRPL trustline status for any address.
 * Returns TROPTIONS IOU balance from our issuer if issuer is configured.
 */
export async function getXrplTrustlineStatus(
  address: string
): Promise<XrplTrustlineStatus> {
  const { issuer } = getXrplWalletAddresses();
  try {
    const [account, trustlines] = await Promise.all([
      getXrplAccountLive(address),
      getXrplTrustlinesLive(address),
    ]);
    const troptionsBalance = issuer
      ? (trustlines.find(
          (l) => l.counterparty === issuer && l.currency === TROPTIONS_CURRENCY_HEX
        )?.balance ?? "0")
      : "0";
    return { address, account, trustlines, troptionsBalance, issuerAddress: issuer };
  } catch (err) {
    return {
      address,
      account:          null,
      trustlines:       [],
      troptionsBalance: "0",
      issuerAddress:    issuer,
      error:            String(err),
    };
  }
}

/**
 * Live Stellar trustline status for any address.
 * Returns TROPTIONS asset balance from our issuer if issuer is configured.
 */
export async function getStellarTrustlineStatus(
  address: string
): Promise<StellarTrustlineStatus> {
  const { issuer } = getStellarWalletAddresses();
  const ASSET_CODE = process.env.STELLAR_TROPTIONS_ASSET_CODE ?? "TROPTIONS";
  try {
    const [account, trustlines] = await Promise.all([
      getStellarAccountLive(address),
      getStellarTrustlines(address),
    ]);
    const troptionsBalance = issuer
      ? (trustlines.find(
          (l) => l.assetCode === ASSET_CODE && l.issuer === issuer
        )?.balance ?? "0")
      : "0";
    return { address, account, trustlines, troptionsBalance, issuerAddress: issuer };
  } catch (err) {
    return {
      address,
      account:          null,
      trustlines:       [],
      troptionsBalance: "0",
      issuerAddress:    issuer,
      error:            String(err),
    };
  }
}

/**
 * ERC-20 token allowance on Polygon for owner → spender.
 * Pass a symbol from POLYGON_KNOWN_TOKENS (KENNY, EVL, USDC, USDT, WMATIC).
 */
export async function getPolygonErc20Allowance(
  tokenSymbol:    string,
  ownerAddress:   string,
  spenderAddress: string
): Promise<{ symbol: string; allowance: string; tokenAddress: string } | null> {
  const token = POLYGON_KNOWN_TOKENS[tokenSymbol];
  if (!token) return null;
  const allowance = await getErc20Allowance(
    token.address,
    ownerAddress,
    spenderAddress,
    token.decimals
  );
  return { symbol: tokenSymbol, allowance, tokenAddress: token.address };
}

// ─── Multi-chain summary ──────────────────────────────────────────────────────

/**
 * Fetch a complete multi-chain trust and balance summary.
 * Pass whichever addresses are known — omitted chains are skipped.
 */
export async function getMultiChainTrustSummary(opts: {
  xrplAddress?:    string;
  stellarAddress?: string;
  polygonAddress?: string;
}): Promise<MultiChainTrustSummary> {
  const issuers = getTroptionsIssuerAddresses();

  const [xrpl, stellar, polygon] = await Promise.all([
    opts.xrplAddress
      ? getXrplTrustlineStatus(opts.xrplAddress)
      : Promise.resolve(undefined),
    opts.stellarAddress
      ? getStellarTrustlineStatus(opts.stellarAddress)
      : Promise.resolve(undefined),
    opts.polygonAddress
      ? getPolygonAccountSummary(opts.polygonAddress)
      : Promise.resolve(undefined),
  ]);

  return {
    ...(xrpl    !== undefined ? { xrpl }    : {}),
    ...(stellar !== undefined ? { stellar } : {}),
    ...(polygon !== undefined ? { polygon } : {}),
    issuers,
    queriedAt: new Date().toISOString(),
  };
}

// ─── Internal wallet live status ──────────────────────────────────────────────

/**
 * Fetch live trust and balance status for all configured TROPTIONS wallets.
 * Uses addresses derived from env seeds — no secrets in response.
 */
export async function getTroptionsWalletStatus(): Promise<{
  xrpl: {
    issuer?:      XrplLiveAccount;
    distributor?: XrplLiveAccount;
    treasury?:    XrplLiveAccount;
  };
  stellar: {
    issuer?:      import("./stellarLedgerEngine").StellarLiveAccount;
    distributor?: import("./stellarLedgerEngine").StellarLiveAccount;
  };
  issuers:   TroptionsIssuerAddresses;
  queriedAt: string;
}> {
  const xrplAddrs    = getXrplWalletAddresses();
  const stellarAddrs = getStellarWalletAddresses();

  const [
    xrplIssuer,
    xrplDistributor,
    xrplTreasury,
    stellarIssuer,
    stellarDistributor,
  ] = await Promise.all([
    xrplAddrs.issuer      ? getXrplAccountLive(xrplAddrs.issuer)           : Promise.resolve(undefined),
    xrplAddrs.distributor ? getXrplAccountLive(xrplAddrs.distributor)      : Promise.resolve(undefined),
    xrplAddrs.treasury    ? getXrplAccountLive(xrplAddrs.treasury)         : Promise.resolve(undefined),
    stellarAddrs.issuer      ? getStellarAccountLive(stellarAddrs.issuer)      : Promise.resolve(undefined),
    stellarAddrs.distributor ? getStellarAccountLive(stellarAddrs.distributor) : Promise.resolve(undefined),
  ]);

  return {
    xrpl: {
      ...(xrplIssuer      ? { issuer:      xrplIssuer }      : {}),
      ...(xrplDistributor ? { distributor: xrplDistributor } : {}),
      ...(xrplTreasury    ? { treasury:    xrplTreasury }    : {}),
    },
    stellar: {
      ...(stellarIssuer      ? { issuer:      stellarIssuer }      : {}),
      ...(stellarDistributor ? { distributor: stellarDistributor } : {}),
    },
    issuers:   getTroptionsIssuerAddresses(),
    queriedAt: new Date().toISOString(),
  };
}
