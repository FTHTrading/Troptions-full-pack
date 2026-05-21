import { getXrplLiveDataSummary } from "@/lib/troptions/xrplLiveDataEngine";
import { guardPortalRead, NextResponse } from "@/lib/troptions/portalApiGuards";
import { XRPL_LIVE_PLATFORM_REGISTRY } from "@/content/troptions/xrplLivePlatformRegistry";
import { buildXrplApiEnvelope } from "@/lib/troptions/xrplPlatformApiUtils";

export async function GET(request: Request) {
  const guarded = await guardPortalRead(request);
  if (guarded instanceof NextResponse) return guarded;

  return NextResponse.json(buildXrplApiEnvelope({
    mode: "live-data-read-only",
    summary: getXrplLiveDataSummary(),
    blockedReason: "Mainnet execution remains blocked by design.",
    requiredApprovals: XRPL_LIVE_PLATFORM_REGISTRY.readiness[2]?.requiredApprovals ?? [],
    auditHint: "Summary endpoint is read-only.",
  }));
}