import { NextResponse } from "next/server";
import { guardPortalRead } from "@/lib/troptions/portalApiGuards";
import { getXrplStellarControlHubStatus } from "@/lib/troptions/xrpl-stellar/xrplStellarControlHubBridge";

export async function GET(request: Request) {
  const guarded = await guardPortalRead(request);
  if (guarded instanceof NextResponse) return guarded;

  try {
    const status = getXrplStellarControlHubStatus();
    return NextResponse.json({
      ok: true,
      stellarEcosystemEnabled: status.stellarEcosystemEnabled,
      isLivePublicNetworkEnabled: status.isLivePublicNetworkEnabled,
      executionMode: status.executionMode,
      stellarAssetsCount: status.stellarAssetsCount,
      auditHint: status.auditHint,
    });
  } catch {
    return NextResponse.json(
      { ok: false, error: "Stellar ecosystem status unavailable." },
      { status: 503 },
    );
  }
}
