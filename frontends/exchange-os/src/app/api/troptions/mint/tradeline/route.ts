/**
 * POST /api/troptions/mint/tradeline
 *
 * Creates a trustline (tradeline) on XRPL or Stellar.
 * Controlled by TROPTIONS_XRPL_MINT_MODE / TROPTIONS_STELLAR_MINT_MODE env flags.
 */
import { NextResponse } from "next/server";
import { mintTradeline, type TradelineMintRequest } from "@/lib/troptions/mintingEngine";

export async function POST(request: Request) {
  let body: TradelineMintRequest;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON body" }, { status: 400 });
  }

  const { chain, assetCode, issuerAddress, limitAmount } = body;
  if (!chain || !assetCode || !issuerAddress || !limitAmount) {
    return NextResponse.json(
      { ok: false, error: "Required: chain, assetCode, issuerAddress, limitAmount" },
      { status: 400 }
    );
  }
  if (chain !== "xrpl" && chain !== "stellar") {
    return NextResponse.json({ ok: false, error: "chain must be xrpl or stellar" }, { status: 400 });
  }

  try {
    const result = await mintTradeline(body);
    return NextResponse.json(result, { status: result.ok ? 200 : 502 });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ ok: false, error: message, timestamp: new Date().toISOString() }, { status: 500 });
  }
}
