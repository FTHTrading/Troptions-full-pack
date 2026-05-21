import { NextResponse } from "next/server";
import { getX402AccessByWalletId } from "@/content/troptions/walletX402Registry";
import { createX402PaymentIntent } from "@/lib/troptions/walletX402Engine";

export async function POST(request: Request) {
  const body = (await request.json()) as {
    walletId?: string;
    amount?: string;
    currency?: string;
    recipientAddress?: string;
    purpose?: string;
  };

  const walletId = body.walletId ?? "wallet_kevan_main";
  const access = getX402AccessByWalletId(walletId);

  if (!access) {
    return NextResponse.json({ ok: false, error: "x402 access not configured" }, { status: 404 });
  }

  const result = createX402PaymentIntent(access, {
    walletId,
    amount: body.amount ?? "0",
    currency: body.currency ?? "ATP",
    recipientAddress: body.recipientAddress ?? "agent:simulation-recipient",
    purpose: body.purpose,
  });

  return NextResponse.json({ ok: true, simulationOnly: true, result });
}