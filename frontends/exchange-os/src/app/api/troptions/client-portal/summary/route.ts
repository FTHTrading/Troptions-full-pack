import { getClientPortalSummary } from "@/lib/troptions/clientPortalEngine";
import { NextResponse, guardPortalRead } from "@/lib/troptions/portalApiGuards";

export async function GET(request: Request) {
  const guarded = await guardPortalRead(request);
  if (guarded instanceof NextResponse) return guarded;

  const summary = getClientPortalSummary("CL-001");
  return NextResponse.json({ ok: true, summary, simulationOnly: true });
}
