/**
 * GET /api/troptions/xrpl-platform/lp/positions?address=<addr>&chain=xrpl|stellar
 *
 * Read LP token positions and full account summary for any address.
 * READ-ONLY — no signing, no authentication required.
 *
 * Query params:
 *   address  — XRPL address (r…) or Stellar public key (G…)
 *   chain    — "xrpl" | "stellar"
 *
 * Returns:
 *   XRPL:    XrplAccountSummary (XRP balance, TROPTIONS balance, NFTs, LP tokens, trustlines)
 *   Stellar: StellarAccountSummary (XLM balance, TROPTIONS balance, LP shares, trustlines)
 */

import { NextResponse } from "next/server";
import {
  getXrplAccountSummary,
  getStellarAccountSummary,
  getXrplLpPositions,
  getStellarLpPositions,
} from "@/lib/troptions/clientWalletEngine";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const address = searchParams.get("address") ?? "";
  const chain   = searchParams.get("chain") === "stellar" ? "stellar" : "xrpl";

  if (!address) {
    return NextResponse.json({ ok: false, error: "address query parameter is required." }, { status: 400 });
  }

  try {
    if (chain === "stellar") {
      const summary = await getStellarAccountSummary(address);
      return NextResponse.json({ ok: true, chain, summary });
    } else {
      const summary = await getXrplAccountSummary(address);
      return NextResponse.json({ ok: true, chain, summary });
    }
  } catch (err) {
    return NextResponse.json({ ok: false, error: String(err) }, { status: 502 });
  }
}

/**
 * POST /api/troptions/xrpl-platform/lp/positions
 * Batch query for multiple addresses.
 *
 * Request body: { addresses: string[], chain: "xrpl" | "stellar" }
 * Returns:      { ok: true, results: Record<string, AccountSummary> }
 */
export async function POST(request: Request) {
  let body: { addresses?: string[]; chain?: string } = {};

  try {
    body = await request.json() as typeof body;
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON body." }, { status: 400 });
  }

  const addresses = body.addresses ?? [];
  const chain     = body.chain === "stellar" ? "stellar" : "xrpl";

  if (addresses.length === 0) {
    return NextResponse.json({ ok: false, error: "addresses array is required." }, { status: 400 });
  }

  if (addresses.length > 20) {
    return NextResponse.json({ ok: false, error: "Maximum 20 addresses per batch request." }, { status: 400 });
  }

  const results: Record<string, unknown> = {};
  const errors:  Record<string, string>  = {};

  await Promise.allSettled(
    addresses.map(async (addr) => {
      try {
        if (chain === "stellar") {
          results[addr] = await getStellarAccountSummary(addr);
        } else {
          results[addr] = await getXrplAccountSummary(addr);
        }
      } catch (err) {
        errors[addr] = String(err);
      }
    })
  );

  return NextResponse.json({ ok: true, chain, results, errors });
}
