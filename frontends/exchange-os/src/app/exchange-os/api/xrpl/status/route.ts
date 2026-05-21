import { NextResponse } from "next/server";
import { checkXrplConnectivity } from "@/lib/exchange-os/xrpl/client";
import { xrplConfig } from "@/config/exchange-os/xrpl";

export async function GET() {
  const status = await checkXrplConnectivity();
  return NextResponse.json({
    ...status,
    network: xrplConfig.network,
    mainnetEnabled: xrplConfig.mainnetEnabled,
    troptionsIssuer: xrplConfig.troptionsIssuer,
    timestamp: new Date().toISOString(),
  });
}
