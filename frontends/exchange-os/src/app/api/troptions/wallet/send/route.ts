import { NextResponse } from "next/server";
import { WALLET_ACCOUNT_REGISTRY } from "@/content/troptions/walletAccountRegistry";
import { simulateSend } from "@/lib/troptions/walletSendEngine";

export async function POST(request: Request) {
  const body = (await request.json()) as {
    walletId?: string;
    amount?: string;
    currency?: string;
    sourceChain?: string;
    destinationChain?: string;
    destinationAddress?: string;
    recipientName?: string;
    notes?: string;
  };

  const walletId = body.walletId ?? "wallet_kevan_main";
  const account = WALLET_ACCOUNT_REGISTRY.find((entry) => entry.walletId === walletId);

  if (!account) {
    return NextResponse.json({ ok: false, error: "wallet account not found" }, { status: 404 });
  }

  const result = simulateSend(account, {
    walletId,
    amount: body.amount ?? "0",
    currency: body.currency ?? "TROP USD",
    sourceChain: body.sourceChain ?? "internal-ledger",
    destinationChain: body.destinationChain ?? "internal-ledger",
    destinationAddress: body.destinationAddress,
    recipientName: body.recipientName,
    notes: body.notes,
  });

  return NextResponse.json({ ok: true, simulationOnly: true, result });
}