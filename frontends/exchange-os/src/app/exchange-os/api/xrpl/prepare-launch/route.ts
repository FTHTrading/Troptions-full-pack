import { NextRequest, NextResponse } from "next/server";
import { prepareXrplLaunch } from "@/lib/exchange-os/xrpl/prepareLaunch";
import { isValidXrplAddress } from "@/lib/exchange-os/xrpl/readWallet";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { tokenName, ticker, totalSupply, issuerAddress } = body;
    // tokenName used for display only, ticker is the XRPL currency code
    void tokenName;

    if (!tokenName || !ticker || !totalSupply || !issuerAddress) {
      return NextResponse.json(
        { error: "tokenName, ticker, totalSupply, and issuerAddress are required" },
        { status: 400 }
      );
    }

    if (!isValidXrplAddress(issuerAddress)) {
      return NextResponse.json({ error: "Invalid XRPL issuer address" }, { status: 400 });
    }

    if (ticker.length > 9) {
      return NextResponse.json({ error: "Ticker must be 9 characters or fewer" }, { status: 400 });
    }

    const result = await prepareXrplLaunch({
      issuerWallet: issuerAddress,
      currency: ticker,
      maxSupply: String(totalSupply),
      metadataUrl: body.metadataUrl,
      launchWithAmm: body.enableAmmCreate ?? false,
      initialLiquidityXrp: body.xrpLiquidityAmount ? String(body.xrpLiquidityAmount) : undefined,
    });

    return NextResponse.json(result);
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Prepare launch failed";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
