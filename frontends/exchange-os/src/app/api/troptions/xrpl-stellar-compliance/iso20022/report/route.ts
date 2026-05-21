import { NextResponse } from "next/server";
import { createIso20022ReadinessReport } from "@/lib/troptions/xrpl-stellar-compliance/iso20022Mapping";

export const revalidate = 60;

export async function GET() {
  const report = createIso20022ReadinessReport();
  return NextResponse.json({
    report,
    liveExecutionAllowed: false,
  });
}
