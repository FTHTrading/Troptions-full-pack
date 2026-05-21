import { NextRequest, NextResponse } from "next/server";
import { prepareXrplTrustline } from "@/lib/exchange-os/xrpl/prepareTrustline";
import { isValidXrplAddress } from "@/lib/exchange-os/xrpl/readWallet";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { currency, issuer, walletAddress, limit } = body;

    if (!currency || !issuer || !walletAddress) {
      return NextResponse.json(
        { error: "currency, issuer, and walletAddress are required" },
        { status: 400 }
      );
    }

    if (!isValidXrplAddress(walletAddress) || !isValidXrplAddress(issuer)) {
      return NextResponse.json({ error: "Invalid XRPL address" }, { status: 400 });
    }

    const result = await prepareXrplTrustline({
      currency,
      issuer,
      walletAddress,
      limit: limit ?? "1000000000",
    });

    return NextResponse.json(result);
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Prepare trustline failed";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
