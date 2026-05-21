import { NextRequest, NextResponse } from "next/server";
import {
  getMultiChainTrustSummary,
  getTroptionsIssuerAddresses,
  getTroptionsWalletStatus,
} from "@/lib/troptions/trustlineEngine";

/**
 * GET /api/troptions/wallet/trustlines
 *
 * Query params:
 *   xrpl=<classic_address>   — live XRPL account_lines for this address
 *   stellar=<G_address>      — live Stellar trustlines for this address
 *   polygon=<0x_address>     — live Polygon ERC-20 balances for this address
 *   mode=issuers             — only return resolved issuer addresses (no live query)
 *   mode=wallet-status       — return live status of all configured TROPTIONS wallets
 *
 * Without any params: returns issuer addresses + usage hint.
 */
export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;

  const mode           = searchParams.get("mode");
  const xrplAddress    = searchParams.get("xrpl")    ?? undefined;
  const stellarAddress = searchParams.get("stellar") ?? undefined;
  const polygonAddress = searchParams.get("polygon") ?? undefined;

  // mode=issuers — just return resolved addresses, no live queries
  if (mode === "issuers") {
    return NextResponse.json({
      ok:      true,
      issuers: getTroptionsIssuerAddresses(),
    });
  }

  // mode=wallet-status — live status for all configured TROPTIONS internal wallets
  if (mode === "wallet-status") {
    const status = await getTroptionsWalletStatus();
    return NextResponse.json({ ok: true, ...status });
  }

  // No addresses provided — return hint + issuers
  if (!xrplAddress && !stellarAddress && !polygonAddress) {
    return NextResponse.json({
      ok:      true,
      issuers: getTroptionsIssuerAddresses(),
      hint:    "Pass ?xrpl=<address>, ?stellar=<address>, or ?polygon=<address> for live trustline status. " +
               "Use ?mode=wallet-status to check all configured TROPTIONS wallets.",
    });
  }

  // Live multi-chain query
  const summary = await getMultiChainTrustSummary({
    xrplAddress,
    stellarAddress,
    polygonAddress,
  });

  return NextResponse.json({ ok: true, ...summary });
}
