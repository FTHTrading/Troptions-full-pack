import { NextResponse } from "next/server";
import { getAllComplianceControls } from "@/content/troptions/xrplStellarInstitutionalComplianceRegistry";

export const revalidate = 60;

export async function GET() {
  const controls = getAllComplianceControls();
  return NextResponse.json({
    controls,
    liveExecutionAllowed: false,
    disclaimer:
      "All compliance controls are in simulation-only or read-only mode. " +
      "Legal review is required before production activation.",
  });
}
