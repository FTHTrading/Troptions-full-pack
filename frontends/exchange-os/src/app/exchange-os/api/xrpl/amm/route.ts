// TROPTIONS Exchange OS — API: AMM Pool Info
// GET /exchange-os/api/xrpl/amm?ticker=TROPTIONS&issuer=r...&quote=XRP

import { NextResponse } from "next/server";
import { readXrplAmm } from "@/lib/exchange-os/xrpl/readAmm";
import { xrplConfig } from "@/config/exchange-os/xrpl";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const ticker = searchParams.get("ticker") ?? "TROPTIONS";
  const issuer = searchParams.get("issuer") ?? xrplConfig.troptionsIssuer;
  const quote = searchParams.get("quote") ?? "XRP";

  const pool = await readXrplAmm(
    { currency: quote },
    { currency: ticker.toUpperCase(), issuer }
  );

  if (!pool) {
    return NextResponse.json({
      error: "No AMM pool found for this pair",
      demoMode: xrplConfig.demoMode,
    }, { status: 404 });
  }

  return NextResponse.json({ pool, demoMode: xrplConfig.demoMode });
}
