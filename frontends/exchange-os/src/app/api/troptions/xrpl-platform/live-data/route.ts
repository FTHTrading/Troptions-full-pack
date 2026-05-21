import { getXrplLiveDataSummary } from "@/lib/troptions/xrplLiveDataEngine";
import { guardPortalRead, NextResponse } from "@/lib/troptions/portalApiGuards";
import { buildXrplApiEnvelope } from "@/lib/troptions/xrplPlatformApiUtils";

export async function GET(request: Request) {
  const guarded = await guardPortalRead(request);
  if (guarded instanceof NextResponse) return guarded;
  const summary = getXrplLiveDataSummary();
  return NextResponse.json(buildXrplApiEnvelope({ mode: summary.mode, marketData: summary.marketData, blockedReason: "Execution disabled.", requiredApprovals: [], auditHint: summary.auditHint }));
}