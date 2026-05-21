/**
 * XRPL Ledger Engine — Live Queries
 * ─────────────────────────────────────────────────────────────────────────────
 * SERVER-SIDE ONLY for address derivation functions.
 * Live account_info and account_lines queries via WebSocket (xrpl v4).
 *
 * ENV VARS (optional — enables address derivation):
 *   XRPL_WS_URL              — WebSocket URL (default: wss://xrplcluster.com)
 *   XRPL_WS_FALLBACK         — Fallback WS URL
 *   XRPL_ISSUER_SEED         — Derive issuer public address
 *   XRPL_DISTRIBUTOR_SEED    — Derive distributor public address
 *   XRPL_TREASURY_SEED       — Derive treasury public address
 *   XRPL_NFT_ISSUER_SEED     — Derive NFT issuer public address
 *   XRPL_DEX_MAKER_SEED      — Derive DEX maker public address
 *   XRPL_AMM_LP_SEED         — Derive AMM LP public address
 *   XRPL_TROPTIONS_CURRENCY_HEX — 40-char hex currency code for TROPTIONS
 */

import { Client, Wallet, dropsToXrp } from "xrpl";
import { XRPL_REGISTRY } from "@/content/troptions/xrplRegistry";

// ─── Constants ────────────────────────────────────────────────────────────────

export const XRPL_WS_PRIMARY  = process.env.XRPL_WS_URL      ?? "wss://xrplcluster.com";
export const XRPL_WS_FALLBACK = process.env.XRPL_WS_FALLBACK ?? "wss://s1.ripple.com";

// "TROPTIONS" right-padded to 20 bytes as uppercase hex
export const TROPTIONS_CURRENCY_HEX =
  process.env.XRPL_TROPTIONS_CURRENCY_HEX ?? "54524F5054494F4E530000000000000000000000";

// ─── Client factory ───────────────────────────────────────────────────────────

async function getClient(): Promise<Client> {
  const client = new Client(XRPL_WS_PRIMARY);
  try {
    await client.connect();
    return client;
  } catch {
    const fallback = new Client(XRPL_WS_FALLBACK);
    await fallback.connect();
    return fallback;
  }
}

// ─── Types ────────────────────────────────────────────────────────────────────

export interface XrplLiveAccount {
  address:     string;
  xrpBalance:  string; // in XRP (not drops)
  sequence:    number;
  ownerCount:  number;
  flags:       number;
  ledgerIndex: number;
  validated:   boolean;
  error?:      string;
}

export interface XrplLiveTrustline {
  counterparty: string; // the issuer's XRPL address
  currency:     string; // 3-char ISO code or 40-char hex currency code
  balance:      string; // positive = holder has tokens from counterparty
  limit:        string; // our trust limit
  limitPeer:    string; // counterparty's limit toward us
  noRipple:     boolean;
  freeze:       boolean;
  authorized:   boolean;
}

// ─── Live XRPL Queries ────────────────────────────────────────────────────────

/**
 * Fetch live XRPL account info (XRP balance, sequence, owner count).
 * Returns an error field instead of throwing on failure.
 */
export async function getXrplAccountLive(address: string): Promise<XrplLiveAccount> {
  const client = await getClient();
  try {
    const response = await client.request({
      command:      "account_info",
      account:      address,
      ledger_index: "validated",
    });
    const acc = response.result.account_data;
    return {
      address,
      xrpBalance:  String(dropsToXrp(acc.Balance)),
      sequence:    acc.Sequence,
      ownerCount:  acc.OwnerCount,
      flags:       acc.Flags ?? 0,
      ledgerIndex: (response.result as { ledger_index?: number }).ledger_index ?? 0,
      validated:   true,
    };
  } catch (err) {
    return {
      address,
      xrpBalance:  "0",
      sequence:    0,
      ownerCount:  0,
      flags:       0,
      ledgerIndex: 0,
      validated:   false,
      error:       String(err),
    };
  } finally {
    await client.disconnect();
  }
}

/**
 * Fetch live trustlines (account_lines) for an XRPL address.
 * Returns empty array on error.
 */
export async function getXrplTrustlinesLive(address: string): Promise<XrplLiveTrustline[]> {
  const client = await getClient();
  try {
    const response = await client.request({
      command:      "account_lines",
      account:      address,
      ledger_index: "validated",
    });
    type RawLine = {
      account:    string;
      currency:   string;
      balance:    string;
      limit:      string;
      limit_peer: string;
      no_ripple?: boolean;
      freeze?:    boolean;
      authorized?: boolean;
    };
    const lines = (response.result as { lines?: RawLine[] }).lines ?? [];
    return lines.map((line) => ({
      counterparty: line.account,
      currency:     line.currency,
      balance:      line.balance,
      limit:        line.limit,
      limitPeer:    line.limit_peer,
      noRipple:     line.no_ripple  ?? false,
      freeze:       line.freeze     ?? false,
      authorized:   line.authorized ?? false,
    }));
  } catch {
    return [];
  } finally {
    await client.disconnect();
  }
}

/**
 * Get balance of a specific IOU (currency + issuer pair) for an address.
 */
export async function getXrplIouBalance(
  address:       string,
  currency:      string,
  issuerAddress: string
): Promise<string> {
  const lines = await getXrplTrustlinesLive(address);
  const line = lines.find(
    (l) => l.counterparty === issuerAddress && l.currency === currency
  );
  return line?.balance ?? "0";
}

// ─── Address derivation (server-side only) ────────────────────────────────────

/**
 * Derive XRPL public addresses from environment seeds.
 * SERVER-SIDE ONLY. Never exposes seeds in return values.
 * Returns null for any unconfigured wallet.
 */
export function getXrplWalletAddresses(): {
  issuer:      string | null;
  distributor: string | null;
  treasury:    string | null;
  nftIssuer:   string | null;
  dexMaker:    string | null;
  ammLp:       string | null;
} {
  function fromSeed(envKey: string): string | null {
    const seed = process.env[envKey];
    if (!seed) return null;
    try {
      return Wallet.fromSeed(seed).address;
    } catch {
      return null;
    }
  }
  return {
    issuer:      fromSeed("XRPL_ISSUER_SEED"),
    distributor: fromSeed("XRPL_DISTRIBUTOR_SEED"),
    treasury:    fromSeed("XRPL_TREASURY_SEED"),
    nftIssuer:   fromSeed("XRPL_NFT_ISSUER_SEED"),
    dexMaker:    fromSeed("XRPL_DEX_MAKER_SEED"),
    ammLp:       fromSeed("XRPL_AMM_LP_SEED"),
  };
}

// ─── Legacy registry functions ────────────────────────────────────────────────

export function listXrplAccounts() {
  return XRPL_REGISTRY;
}

export function canSignXrplTransaction() {
  const hasSeed = !!process.env.XRPL_ISSUER_SEED;
  return {
    allowed:        hasSeed,
    blockedReasons: hasSeed
      ? []
      : ["XRPL_ISSUER_SEED not configured — run scripts/genesis-blockchain-setup.mjs"],
  };
}
