import { NextResponse } from "next/server";
import {
  BITCOIN_SETTLEMENT_DISCLOSURE,
  generateBitcoinSettlementSummary,
  getBitcoinSettlement,
  seedBitcoinSettlementsIfEmpty,
} from "@/lib/troptions/bitcoinSettlementEngine";
import { listCarbonBitcoinAuditEvents } from "@/lib/troptions/carbonBitcoinAuditLog";

export const dynamic = "force-dynamic";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ settlementId: string }> }
) {
  seedBitcoinSettlementsIfEmpty();
  const { settlementId } = await params;
  const record = getBitcoinSettlement(settlementId);
  if (!record) {
    return NextResponse.json(
      { ok: false, error: "settlement_not_found", settlementId },
      { status: 404 }
    );
  }
  return NextResponse.json({
    ok: true,
    simulation: true,
    disclosure: BITCOIN_SETTLEMENT_DISCLOSURE,
    record,
    summary: generateBitcoinSettlementSummary(record.settlementId),
    auditEvents: listCarbonBitcoinAuditEvents({ relatedSettlementId: settlementId }),
  });
}
