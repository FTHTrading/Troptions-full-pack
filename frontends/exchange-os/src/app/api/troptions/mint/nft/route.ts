/**
 * POST /api/troptions/mint/nft
 *
 * Mints an NFToken on XRPL via the treasury wallet.
 * Controlled by TROPTIONS_XRPL_MINT_MODE env flag.
 */
import { NextResponse } from "next/server";
import { mintNft, type NftMintRequest } from "@/lib/troptions/mintingEngine";

export async function POST(request: Request) {
  let body: NftMintRequest;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON body" }, { status: 400 });
  }

  const { name, uri, taxon } = body;
  if (!name || !uri || taxon === undefined) {
    return NextResponse.json(
      { ok: false, error: "Required: name, uri, taxon" },
      { status: 400 }
    );
  }
  if (typeof taxon !== "number" || taxon < 0) {
    return NextResponse.json({ ok: false, error: "taxon must be a non-negative integer" }, { status: 400 });
  }
  if (body.transferFee !== undefined && (body.transferFee < 0 || body.transferFee > 50000)) {
    return NextResponse.json({ ok: false, error: "transferFee must be 0-50000 (basis points)" }, { status: 400 });
  }

  try {
    const result = await mintNft(body);
    return NextResponse.json(result, { status: result.ok ? 200 : 502 });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ ok: false, error: message, timestamp: new Date().toISOString() }, { status: 500 });
  }
}
