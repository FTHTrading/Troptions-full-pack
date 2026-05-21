import { NextResponse } from "next/server";
import {
  CARBON_CREDIT_DISCLOSURE,
  calculateCarbonReadinessScore,
  listCarbonAssets,
  seedCarbonRegistryIfEmpty,
} from "@/lib/troptions/carbonCreditEngine";

export const dynamic = "force-dynamic";

export async function GET() {
  seedCarbonRegistryIfEmpty();
  const records = listCarbonAssets().map((r) => ({
    ...r,
    readinessScore: calculateCarbonReadinessScore(r),
  }));
  return NextResponse.json({
    ok: true,
    simulation: true,
    disclosure: CARBON_CREDIT_DISCLOSURE,
    count: records.length,
    records,
  });
}
