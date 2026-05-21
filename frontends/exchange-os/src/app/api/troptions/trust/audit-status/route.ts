import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    ok: true,
    auditStatus: "infrastructure-only",
    liveFinancialOperations: false,
    simulationMode: true,
    proofRoomStatus: "active-intake",
    lastAuditReview: null,
    gatesActivated: 0,
    gatesRequired: 6,
    note: "No capabilities are live-activated. All gates must be satisfied before activation.",
  });
}
