import { NextResponse } from "next/server";
import { getMerchantSettlementMap } from "@/lib/troptions/genius";

export async function GET() {
  return NextResponse.json({
    ok: true,
    simulationOnly: true,
    map: getMerchantSettlementMap(),
  });
}