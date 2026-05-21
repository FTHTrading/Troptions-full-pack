import { NextResponse } from "next/server";
import { getXrplStellarInstitutionalComplianceSnapshot } from "@/lib/troptions/xrpl-stellar-compliance/xrplStellarComplianceControlHubBridge";

export const dynamic = "force-dynamic";

export async function GET() {
  const snapshot = getXrplStellarInstitutionalComplianceSnapshot();
  return NextResponse.json({
    snapshot,
    liveExecutionAllowed: false,
  });
}
