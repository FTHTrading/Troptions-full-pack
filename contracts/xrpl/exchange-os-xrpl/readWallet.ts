// TROPTIONS Exchange OS — Read Wallet from XRPL
// Read-only wallet queries. Never requests private keys.

import { xrplReadQuery } from "./client";
import { xrplConfig } from "@/config/exchange-os/xrpl";
import { DEMO_WALLET } from "@/config/exchange-os/demoData";
import { hexCurrencyToLabel } from "./types";
import type { XrplAccountInfo, XrplTrustLine } from "./types";

/** Validate XRPL address format (basic r-address check) */
export function isValidXrplAddress(address: string): boolean {
  return /^r[1-9A-HJ-NP-Za-km-z]{24,34}$/.test(address);
}

/** Fetch account info and trustlines for a given XRPL address */
export async function readXrplWallet(
  address: string
): Promise<XrplAccountInfo | null> {
  if (!isValidXrplAddress(address)) {
    throw new Error("Invalid XRPL address format.");
  }

  if (xrplConfig.demoMode) {
    return {
      address: DEMO_WALLET.address,
      xrpBalance: DEMO_WALLET.xrpBalance,
      sequence: 0,
      ownerCount: 0,
      trustLines: [],
    };
  }

  try {
    const [accountResult, linesResult] = await Promise.all([
      xrplReadQuery("account_info", {
        account: address,
        ledger_index: "validated",
      }) as Promise<{
        account_data?: {
          Balance?: string;
          Sequence?: number;
          OwnerCount?: number;
          Flags?: number;
          Domain?: string;
        };
      }>,
      xrplReadQuery("account_lines", {
        account: address,
        ledger_index: "validated",
      }) as Promise<{
        lines?: Array<{
          currency: string;
          account: string;
          balance: string;
          limit: string;
          limit_peer: string;
          freeze?: boolean;
          freeze_peer?: boolean;
          no_ripple?: boolean;
        }>;
      }>,
    ]);

    if (!accountResult?.account_data) return null;

    const { account_data } = accountResult;
    const xrpBalance = account_data.Balance
      ? (parseInt(account_data.Balance) / 1_000_000).toFixed(6)
      : "0";

    const trustLines: XrplTrustLine[] = (linesResult?.lines ?? []).map(
      (line) => ({
        currency:
          line.currency.length === 40
            ? hexCurrencyToLabel(line.currency)
            : line.currency,
        issuer: line.account,
        balance: line.balance,
        limit: line.limit,
        limitPeer: line.limit_peer,
        freeze: line.freeze,
        freezePeer: line.freeze_peer,
        noRipple: line.no_ripple,
      })
    );

    return {
      address,
      xrpBalance,
      sequence: account_data.Sequence ?? 0,
      ownerCount: account_data.OwnerCount ?? 0,
      trustLines,
    };
  } catch {
    return null;
  }
}

/** Check if a wallet has an active trustline for a given currency/issuer */
export async function hasActiveTrustline(
  walletAddress: string,
  currency: string,
  issuer: string
): Promise<boolean> {
  if (xrplConfig.demoMode) return false;
  const info = await readXrplWallet(walletAddress);
  if (!info) return false;
  return info.trustLines.some(
    (tl) =>
      tl.issuer === issuer &&
      (tl.currency === currency ||
        tl.currency === hexCurrencyToLabel(currency))
  );
}
