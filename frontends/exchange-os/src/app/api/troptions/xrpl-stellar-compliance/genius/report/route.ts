import { NextResponse } from "next/server";
import { createGeniusActReadinessReport } from "@/lib/troptions/xrpl-stellar-compliance/geniusActReadinessEngine";

export const revalidate = 60;

export async function GET() {
  const report = createGeniusActReadinessReport();
  return NextResponse.json({
    report,
    liveExecutionAllowed: false,
  });
}
