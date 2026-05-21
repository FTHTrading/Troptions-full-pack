import { XRPL_TRUSTLINE_REGISTRY } from "@/content/troptions/xrplTrustlineRegistry";
import { guardPortalRead, NextResponse } from "@/lib/troptions/portalApiGuards";
import { buildXrplApiEnvelope } from "@/lib/troptions/xrplPlatformApiUtils";

export async function GET(request: Request) {
  const guarded = await guardPortalRead(request);
  if (guarded instanceof NextResponse) return guarded;
  return NextResponse.json(buildXrplApiEnvelope({ mode: "trustlines-read-only", trustlines: XRPL_TRUSTLINE_REGISTRY, blockedReason: "Execution disabled.", requiredApprovals: [], auditHint: "Read-only trustline registry." }));
}