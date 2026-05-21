import { NextRequest, NextResponse } from "next/server";
import { prepareXrplSwap } from "@/lib/exchange-os/xrpl/prepareSwap";
import { isValidXrplAddress } from "@/lib/exchange-os/xrpl/readWallet";
import { xrplConfig } from "@/config/exchange-os/xrpl";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      sourceCurrency,
      destinationCurrency,
      amount,
      slippageBps,
      walletAddress,
    } = body;

    if (!sourceCurrency || !destinationCurrency || !amount || !walletAddress) {
      return NextResponse.json(
        { error: "sourceCurrency, destinationCurrency, amount, and walletAddress are required" },
        { status: 400 }
      );
    }

    if (!isValidXrplAddress(walletAddress)) {
      return NextResponse.json({ error: "Invalid XRPL wallet address" }, { status: 400 });
    }

    const result = await prepareXrplSwap({
      fromTicker: sourceCurrency,
      toTicker: destinationCurrency,
      fromAmount: String(amount),
      toAmount: String(amount), // user provides input amount; wallet resolves at signing
      slippagePct: slippageBps ? slippageBps / 100 : 1,
      walletAddress,
      fromIssuer:
        sourceCurrency === "TROPTIONS" ? xrplConfig.troptionsIssuer : body.sourceIssuer,
      toIssuer:
        destinationCurrency === "TROPTIONS"
          ? xrplConfig.troptionsIssuer
          : body.destinationIssuer,
    });

    return NextResponse.json(result);
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Prepare swap failed";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
