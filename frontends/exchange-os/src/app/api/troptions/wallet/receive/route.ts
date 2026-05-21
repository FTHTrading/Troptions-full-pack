import { NextResponse } from "next/server";
import { generateReceiveRequest } from "@/lib/troptions/walletReceiveEngine";

export async function POST(request: Request) {
  const body = (await request.json()) as {
    walletId?: string;
    currency?: string;
    chain?: string;
    amount?: string;
    note?: string;
  };

  const result = generateReceiveRequest({
    walletId: body.walletId ?? "wallet_kevan_main",
    currency: body.currency ?? "TROP USD",
    chain: body.chain ?? "internal-ledger",
    amount: body.amount,
    note: body.note,
  });

  return NextResponse.json({ ok: true, simulationOnly: true, result });
}