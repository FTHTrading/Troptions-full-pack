import { NextRequest, NextResponse } from "next/server";
import { createProofPacket } from "@/lib/exchange-os/proof/createProofPacket";
import { isValidXrplAddress } from "@/lib/exchange-os/xrpl/readWallet";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { tokenName, tokenTicker, issuerAddress } = body;

    if (!tokenName || !tokenTicker || !issuerAddress) {
      return NextResponse.json(
        { error: "tokenName, tokenTicker, and issuerAddress are required" },
        { status: 400 }
      );
    }

    if (!isValidXrplAddress(issuerAddress)) {
      return NextResponse.json({ error: "Invalid XRPL issuer address" }, { status: 400 });
    }

    const packet = createProofPacket({
      tokenName,
      tokenTicker,
      issuerAddress,
      metadataUrl: body.metadataUrl,
      trustlineRequired: body.trustlineRequired ?? true,
      ammPoolAccount: body.ammPoolAccount,
      x402ServiceIds: body.x402ServiceIds,
      rewardPolicy: body.rewardPolicy,
      feePolicy: body.feePolicy,
      riskLabelIds: body.riskLabelIds,
    });

    return NextResponse.json(packet);
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Proof packet generation failed";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
