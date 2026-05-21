import { NextResponse } from "next/server";
import {
  CARBON_CREDIT_DISCLOSURE,
  calculateCarbonReadinessScore,
  generateCarbonProofSummary,
  getCarbonAsset,
  seedCarbonRegistryIfEmpty,
} from "@/lib/troptions/carbonCreditEngine";
import { listCarbonBitcoinAuditEvents } from "@/lib/troptions/carbonBitcoinAuditLog";

export const dynamic = "force-dynamic";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ assetId: string }> }
) {
  seedCarbonRegistryIfEmpty();
  const { assetId } = await params;
  const record = getCarbonAsset(assetId);
  if (!record) {
    return NextResponse.json({ ok: false, error: "carbon_asset_not_found", assetId }, { status: 404 });
  }
  return NextResponse.json({
    ok: true,
    simulation: true,
    disclosure: CARBON_CREDIT_DISCLOSURE,
    record,
    readinessScore: calculateCarbonReadinessScore(record),
    proofSummary: generateCarbonProofSummary(record.carbonAssetId),
    auditEvents: listCarbonBitcoinAuditEvents({ relatedAssetId: assetId }),
  });
}
