import { NextResponse } from "next/server";
import { guardPortalRead } from "@/lib/troptions/portalApiGuards";
import { getXrplStellarControlHubStatus } from "@/lib/troptions/xrpl-stellar/xrplStellarControlHubBridge";

export async function GET(request: Request) {
  const guarded = await guardPortalRead(request);
  if (guarded instanceof NextResponse) return guarded;

  try {
    const status = getXrplStellarControlHubStatus();
    return NextResponse.json({ ok: true, ...status });
  } catch {
    return NextResponse.json(
      { ok: false, error: "XRPL ecosystem status unavailable." },
      { status: 503 },
    );
  }
}
