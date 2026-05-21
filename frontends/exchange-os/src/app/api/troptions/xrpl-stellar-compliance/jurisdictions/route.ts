import { NextResponse } from "next/server";
import { getAllJurisdictions } from "@/content/troptions/xrplStellarJurisdictionMatrix";

export const revalidate = 60;

export async function GET() {
  const jurisdictions = getAllJurisdictions();
  return NextResponse.json({
    jurisdictions,
    liveExecutionAllowed: false,
    disclaimer:
      "All jurisdiction profiles require jurisdiction-specific legal counsel review. " +
      "No operation is globally compliant. Legal review required before production activation.",
  });
}
