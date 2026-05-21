import { NextRequest, NextResponse } from "next/server";
import { getWalletTransactions } from "@/content/troptions/walletTransactionRegistry";

export async function GET(request: NextRequest) {
  const walletId = request.nextUrl.searchParams.get("walletId") ?? "wallet_kevan_main";

  return NextResponse.json({
    ok: true,
    simulationOnly: true,
    transactions: getWalletTransactions(walletId),
  });
}