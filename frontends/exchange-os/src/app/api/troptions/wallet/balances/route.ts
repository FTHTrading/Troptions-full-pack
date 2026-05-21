import { NextRequest, NextResponse } from "next/server";
import { getWalletLedger } from "@/lib/troptions/walletLedgerEngine";
import { getMultiChainTrustSummary } from "@/lib/troptions/trustlineEngine";
import { getXrplWalletAddresses } from "@/lib/troptions/xrplLedgerEngine";
import { getStellarWalletAddresses } from "@/lib/troptions/stellarLedgerEngine";

/**
 * GET /api/troptions/wallet/balances
 *
 * Query params:
 *   walletId=<id>          — internal ledger wallet (default: wallet_kevan_main)
 *   xrpl=<classic_address> — live XRPL balance for this address (default: distributor from env)
 *   stellar=<G_address>    — live Stellar balance for this address (default: distributor from env)
 *   polygon=<0x_address>   — live Polygon balance for this address
 *
 * Returns both the internal ledger balance and live on-chain balances in parallel.
 */
export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;

  const walletId = searchParams.get("walletId") ?? "wallet_kevan_main";

  // Address overrides — fall back to env-derived distributor addresses when not provided
  const xrplOverride    = searchParams.get("xrpl")    ?? undefined;
  const stellarOverride = searchParams.get("stellar") ?? undefined;
  const polygonAddress  = searchParams.get("polygon") ?? undefined;

  const xrplAddrs    = getXrplWalletAddresses();
  const stellarAddrs = getStellarWalletAddresses();

  const effectiveXrpl    = xrplOverride    ?? xrplAddrs.distributor    ?? undefined;
  const effectiveStellar = stellarOverride ?? stellarAddrs.distributor ?? undefined;

  // Run internal ledger + live chain queries in parallel
  const [ledger, liveChains] = await Promise.all([
    Promise.resolve(getWalletLedger(walletId)),
    getMultiChainTrustSummary({
      xrplAddress:    effectiveXrpl,
      stellarAddress: effectiveStellar,
      polygonAddress,
    }),
  ]);

  return NextResponse.json({
    ok: true,
    walletId,
    ledger,
    live: liveChains,
  });
}