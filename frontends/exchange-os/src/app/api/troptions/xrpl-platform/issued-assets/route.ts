import { XRPL_ISSUED_ASSET_REGISTRY } from "@/content/troptions/xrplIssuedAssetRegistry";
import { guardPortalRead, NextResponse } from "@/lib/troptions/portalApiGuards";
import { buildXrplApiEnvelope } from "@/lib/troptions/xrplPlatformApiUtils";

export async function GET(request: Request) {
  const guarded = await guardPortalRead(request);
  if (guarded instanceof NextResponse) return guarded;
  return NextResponse.json(buildXrplApiEnvelope({ mode: "issued-assets-read-only", issuedAssets: XRPL_ISSUED_ASSET_REGISTRY, blockedReason: "Execution disabled.", requiredApprovals: [], auditHint: "Registry-only issued asset data." }));
}