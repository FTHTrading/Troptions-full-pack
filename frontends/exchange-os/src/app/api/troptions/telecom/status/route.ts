import { NextResponse } from "next/server";
import { TELECOM_CAPABILITIES, TELECOM_COMPLIANCE_REQUIREMENTS, TELECOM_DISCLAIMER } from "@/content/troptions/telexRegistry";

export async function GET() {
  return NextResponse.json({
    ok: true,
    status: "dry-run",
    capabilities: TELECOM_CAPABILITIES,
    complianceRequirements: TELECOM_COMPLIANCE_REQUIREMENTS,
    disclaimer: TELECOM_DISCLAIMER,
    liveActivated: false,
    note: "Telecom capabilities are in dry-run mode. All gates must be satisfied before live activation.",
  });
}
