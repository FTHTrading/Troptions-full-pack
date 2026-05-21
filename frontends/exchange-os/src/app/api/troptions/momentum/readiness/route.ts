import { NextResponse } from "next/server";
import { evaluateMomentumLaunchReadiness } from "@/lib/troptions/momentum/momentumComplianceEngine";

export const dynamic = "force-dynamic";

export async function GET() {
  const readiness = evaluateMomentumLaunchReadiness();
  return NextResponse.json({
    readiness,
    liveExecutionAllowed: false,
  });
}
