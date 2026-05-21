import { NextResponse } from "next/server";
import { submitFundingRequest } from "@/lib/troptions/walletFundingRequestEngine";

export async function POST(request: Request) {
  const body = (await request.json()) as {
    walletId?: string;
    amount?: string;
    currency?: string;
    purpose?: string;
    sourceOfFunds?: string;
    requestedRail?: string;
  };

  const result = submitFundingRequest({
    walletId: body.walletId ?? "wallet_kevan_main",
    amount: body.amount ?? "0",
    currency: body.currency ?? "TROP USD",
    purpose: body.purpose ?? "simulation funding request",
    sourceOfFunds: body.sourceOfFunds ?? "self-attested simulation source",
    requestedRail: body.requestedRail ?? "internal-ledger",
  });

  return NextResponse.json({ ok: true, simulationOnly: true, result });
}