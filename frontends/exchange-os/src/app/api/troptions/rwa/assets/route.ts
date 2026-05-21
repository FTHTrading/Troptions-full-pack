import { listRwaAssets } from "@/lib/troptions/rwaOperationsEngine";
import { NextResponse, guardPortalRead } from "@/lib/troptions/portalApiGuards";

export async function GET(request: Request) {
  const guarded = await guardPortalRead(request);
  if (guarded instanceof NextResponse) return guarded;
  return NextResponse.json({ ok: true, assets: listRwaAssets(), simulationOnly: true });
}
