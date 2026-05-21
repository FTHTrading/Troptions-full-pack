/**
 * Stellar Ledger Engine — Live Queries
 * ─────────────────────────────────────────────────────────────────────────────
 * SERVER-SIDE ONLY for address derivation functions.
 * Live Horizon REST queries for any public Stellar address. No signing.
 *
 * ENV VARS (optional — enables address derivation):
 *   STELLAR_HORIZON_URL        — Horizon endpoint (default: https://horizon.stellar.org)
 *   STELLAR_ISSUER_SECRET      — Derive issuer public address
 *   STELLAR_DISTRIBUTOR_SECRET — Derive distributor public address
 *   STELLAR_LP_SECRET          — Derive LP manager public address
 *   STELLAR_ANCHOR_SECRET      — Derive anchor public address
 *   STELLAR_TROPTIONS_ASSET_CODE — Asset code (default: "TROPTIONS")
 */

import { Horizon, Keypair } from "@stellar/stellar-sdk";

// ─── Constants ────────────────────────────────────────────────────────────────

const HORIZON_URL =
  process.env.STELLAR_HORIZON_URL ?? "https://horizon.stellar.org";

// ─── Server factory ───────────────────────────────────────────────────────────

function getServer(): Horizon.Server {
  return new Horizon.Server(HORIZON_URL);
}

// ─── Types ────────────────────────────────────────────────────────────────────

export interface StellarLiveBalance {
  assetType:   "native" | "credit_alphanum4" | "credit_alphanum12";
  assetCode:   string;
  issuer?:     string;
  balance:     string;
  limit?:      string;
  isAuthorized?: boolean;
  isAuthorizedToMaintainLiabilities?: boolean;
}

export interface StellarLiveAccount {
  address:       string;
  xlmBalance:    string;
  balances:      StellarLiveBalance[];
  sequence:      string;
  subentryCount: number;
  homeDomain?:   string;
  validated:     boolean;
  error?:        string;
}

// ─── Live Stellar Queries ─────────────────────────────────────────────────────

/**
 * Fetch live Stellar account info — all balances including non-native trustlines.
 * Works for any public Stellar address. No keys required.
 */
export async function getStellarAccountLive(address: string): Promise<StellarLiveAccount> {
  const server = getServer();
  try {
    const acc = await server.loadAccount(address);

    const balances: StellarLiveBalance[] = acc.balances.map((b) => {
      if (b.asset_type === "native") {
        return {
          assetType: "native" as const,
          assetCode: "XLM",
          balance:   b.balance,
        };
      }
      // Non-native balance line
      const cb = b as Horizon.HorizonApi.BalanceLine & {
        asset_code:   string;
        asset_issuer: string;
        limit:        string;
        is_authorized?: boolean;
        is_authorized_to_maintain_liabilities?: boolean;
      };
      return {
        assetType: b.asset_type as "credit_alphanum4" | "credit_alphanum12",
        assetCode: cb.asset_code,
        issuer:    cb.asset_issuer,
        balance:   cb.balance,
        limit:     cb.limit,
        isAuthorized: cb.is_authorized,
        isAuthorizedToMaintainLiabilities: cb.is_authorized_to_maintain_liabilities,
      };
    });

    const xlmBalance = balances.find((b) => b.assetCode === "XLM")?.balance ?? "0";

    return {
      address,
      xlmBalance,
      balances,
      sequence:      acc.sequence,
      subentryCount: acc.subentry_count,
      homeDomain:    acc.home_domain,
      validated:     true,
    };
  } catch (err) {
    return {
      address,
      xlmBalance:    "0",
      balances:      [],
      sequence:      "0",
      subentryCount: 0,
      validated:     false,
      error:         String(err),
    };
  }
}

/**
 * Fetch only the non-native (token) balances/trustlines for a Stellar address.
 */
export async function getStellarTrustlines(address: string): Promise<StellarLiveBalance[]> {
  const account = await getStellarAccountLive(address);
  return account.balances.filter((b) => b.assetType !== "native");
}

/**
 * Get balance of a specific Stellar asset for an address.
 */
export async function getStellarAssetBalance(
  address:       string,
  assetCode:     string,
  issuerAddress: string
): Promise<string> {
  const account = await getStellarAccountLive(address);
  const match = account.balances.find(
    (b) => b.assetCode === assetCode && b.issuer === issuerAddress
  );
  return match?.balance ?? "0";
}

// ─── Address derivation (server-side only) ────────────────────────────────────

/**
 * Derive Stellar public addresses from environment secrets.
 * SERVER-SIDE ONLY. Never exposes secrets in return values.
 * Returns null for any unconfigured wallet.
 */
export function getStellarWalletAddresses(): {
  issuer:      string | null;
  distributor: string | null;
  lp:          string | null;
  anchor:      string | null;
} {
  function fromSecret(envKey: string): string | null {
    const secret = process.env[envKey];
    if (!secret) return null;
    try {
      return Keypair.fromSecret(secret).publicKey();
    } catch {
      return null;
    }
  }
  return {
    issuer:      fromSecret("STELLAR_ISSUER_SECRET"),
    distributor: fromSecret("STELLAR_DISTRIBUTOR_SECRET"),
    lp:          fromSecret("STELLAR_LP_SECRET"),
    anchor:      fromSecret("STELLAR_ANCHOR_SECRET"),
  };
}
