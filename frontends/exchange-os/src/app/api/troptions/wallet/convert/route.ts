import { NextResponse } from "next/server";
import { simulateConversion } from "@/lib/troptions/walletConversionEngine";

export async function POST(request: Request) {
  const body = (await request.json()) as {
    walletId?: string;
    fromCurrency?: string;
    toCurrency?: string;
    amount?: string;
    sourceChain?: string;
    destinationChain?: string;
  };

  const result = simulateConversion({
    walletId: body.walletId ?? "wallet_kevan_main",
    fromCurrency: body.fromCurrency ?? "TROP USD",
    toCurrency: body.toCurrency ?? "USDF",
    amount: body.amount ?? "0",
    sourceChain: body.sourceChain ?? "internal-ledger",
    destinationChain: body.destinationChain ?? "stellar",
  });

  return NextResponse.json({ ok: true, simulationOnly: true, result });
}