import { guardPortalRead, NextResponse } from "@/lib/troptions/portalApiGuards";
import { getControlHubStateSnapshot } from "@/lib/troptions/controlHubStateStore";

export async function GET(request: Request) {
  const guarded = await guardPortalRead(request);
  if (guarded instanceof NextResponse) return guarded;

  try {
    const snapshot = getControlHubStateSnapshot();
    return NextResponse.json({ ok: true, snapshot });
  } catch {
    return NextResponse.json(
      { ok: false, error: "State snapshot unavailable — persistence layer not ready." },
      { status: 503 },
    );
  }
}
