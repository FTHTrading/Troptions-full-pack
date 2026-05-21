import { NextResponse } from "next/server";
import { RWA_COMPLIANCE_RECORDS, getHighRegulatoryRiskProviders } from "@/lib/troptions/rwa-adapters/compliance";

export function GET() {
  return NextResponse.json({
    ok: true,
    records: RWA_COMPLIANCE_RECORDS,
    highRiskProviders: getHighRegulatoryRiskProviders(),
  });
}
