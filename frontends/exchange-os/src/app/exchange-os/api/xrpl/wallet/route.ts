// TROPTIONS Exchange OS — API: Wallet Lookup
// GET /exchange-os/api/xrpl/wallet?address=r...

import { NextResponse } from "next/server";
import { readXrplWallet, isValidXrplAddress } from "@/lib/exchange-os/xrpl/readWallet";
import { xrplConfig } from "@/config/exchange-os/xrpl";
import { DEMO_WALLET } from "@/config/exchange-os/demoData";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const address = searchParams.get("address");

  if (!address) {
    return NextResponse.json({ error: "address query param required" }, { status: 400 });
  }

  if (!isValidXrplAddress(address)) {
    return NextResponse.json({ error: "Invalid XRPL address format" }, { status: 400 });
  }

  if (xrplConfig.demoMode) {
    return NextResponse.json({
      address,
      xrpBalance: DEMO_WALLET.xrpBalance,
      trustLines: DEMO_WALLET.trustLines,
      demoMode: true,
    });
  }

  const wallet = await readXrplWallet(address);
  if (!wallet) {
    return NextResponse.json({
      error: "Wallet not found or XRPL unavailable",
      demoMode: xrplConfig.demoMode,
    }, { status: 404 });
  }

  return NextResponse.json({
    address: wallet.address,
    xrpBalance: wallet.xrpBalance,
    trustLines: wallet.trustLines?.map((tl) => tl.currency) ?? [],
    demoMode: xrplConfig.demoMode,
  });
}
