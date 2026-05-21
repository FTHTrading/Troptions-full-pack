import { NextResponse } from "next/server";
import { guardPortalRead } from "@/lib/troptions/portalApiGuards";
import { listXrplEcosystemAssets } from "@/lib/troptions/xrpl-stellar/xrplStellarControlHubBridge";

export async function GET(request: Request) {
  const guarded = await guardPortalRead(request);
  if (guarded instanceof NextResponse) return guarded;

  try {
    const assets = listXrplEcosystemAssets();
    return NextResponse.json({
      ok: true,
      isLiveMainnetExecutionEnabled: false,
      assets,
      count: assets.length,
    });
  } catch {
    return NextResponse.json(
      { ok: false, error: "XRPL ecosystem assets unavailable." },
      { status: 503 },
    );
  }
}
