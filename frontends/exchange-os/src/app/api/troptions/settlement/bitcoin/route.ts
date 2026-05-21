import { NextResponse } from "next/server";
import {
  BITCOIN_SETTLEMENT_DISCLOSURE,
  listBitcoinSettlements,
  seedBitcoinSettlementsIfEmpty,
} from "@/lib/troptions/bitcoinSettlementEngine";

export const dynamic = "force-dynamic";

export async function GET() {
  seedBitcoinSettlementsIfEmpty();
  const records = listBitcoinSettlements();
  return NextResponse.json({
    ok: true,
    simulation: true,
    disclosure: BITCOIN_SETTLEMENT_DISCLOSURE,
    count: records.length,
    records,
  });
}
