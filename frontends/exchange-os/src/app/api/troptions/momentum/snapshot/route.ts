import { NextResponse } from "next/server";
import { buildMomentumComplianceSnapshot } from "@/lib/troptions/momentum/momentumComplianceEngine";

export const dynamic = "force-dynamic";

export async function GET() {
  const snapshot = buildMomentumComplianceSnapshot();
  return NextResponse.json({
    snapshot,
    liveExecutionAllowed: false,
    blockchainExecutionAllowed: false,
    paymentsAllowed: false,
  });
}
