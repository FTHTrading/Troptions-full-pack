import { guardPortalWrite, NextResponse, saveIdempotentResponse } from "@/lib/troptions/portalApiGuards";
import { checkSiteHealth } from "@/lib/troptions/jefeEngine";
import { buildJefePostEnvelope } from "@/lib/troptions/jefeApi";

export async function POST(request: Request) {
  const guarded = await guardPortalWrite(request);
  if (guarded instanceof NextResponse) return guarded;

  const check = checkSiteHealth();
  const responseBody = buildJefePostEnvelope("Site check is simulation-safe and does not deploy.", {
    status: "checked",
    mode: "simulation",
    jefeStatus: "online",
    taskId: `jefe-site-${Date.now()}`,
    routedAgent: "site-ops-agent",
    check,
  });

  saveIdempotentResponse(guarded.idempotency, 200, responseBody);
  return NextResponse.json(responseBody);
}
