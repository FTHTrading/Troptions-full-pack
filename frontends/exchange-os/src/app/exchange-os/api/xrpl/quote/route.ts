import { NextRequest, NextResponse } from "next/server";
import { getXrplQuote } from "@/lib/exchange-os/xrpl/quote";
import { xrplConfig } from "@/config/exchange-os/xrpl";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { sourceCurrency, destinationCurrency, amount } = body;

    if (!sourceCurrency || !destinationCurrency || amount === undefined) {
      return NextResponse.json(
        { error: "sourceCurrency, destinationCurrency, and amount are required" },
        { status: 400 }
      );
    }

    if (typeof amount !== "number" || amount <= 0) {
      return NextResponse.json({ error: "amount must be a positive number" }, { status: 400 });
    }

    const quote = await getXrplQuote({
      fromTicker: sourceCurrency,
      toTicker: destinationCurrency,
      amount: String(amount),
      fromIssuer:
        sourceCurrency === "TROPTIONS" ? xrplConfig.troptionsIssuer : body.sourceIssuer,
      toIssuer:
        destinationCurrency === "TROPTIONS"
          ? xrplConfig.troptionsIssuer
          : body.destinationIssuer,
    });

    return NextResponse.json(quote);
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Quote failed";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
