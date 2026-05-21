import { guardPortalWrite, NextResponse, saveIdempotentResponse } from "@/lib/troptions/portalApiGuards";
import { routeCommand } from "@/lib/troptions/jefeEngine";
import { buildJefePostEnvelope } from "@/lib/troptions/jefeApi";
import { detectJefeBlockedIntent } from "@/lib/troptions/jefePolicyGuard";

export async function POST(request: Request) {
  const guarded = await guardPortalWrite(request);
  if (guarded instanceof NextResponse) return guarded;
  const idempotency = guarded.idempotency;

  const body = await request.json() as { prompt?: string; command?: string };
  const prompt = body.prompt?.trim() || body.command?.trim() || "";
  const blockedIntent = detectJefeBlockedIntent(prompt);

  if (blockedIntent) {
    const blockedBody = {
      ...buildJefePostEnvelope("Blocked by Jefe simulation safety policy.", {
        ok: false,
        status: "blocked",
        mode: "simulation",
        jefeStatus: "online",
        taskId: `jefe-route-${Date.now()}`,
        blockedReason: `Routing request includes blocked intent: ${blockedIntent}`,
      }),
    };
    saveIdempotentResponse(idempotency, 200, blockedBody);
    return NextResponse.json(blockedBody);
  }

  const routed = routeCommand(prompt);

  const responseBody = buildJefePostEnvelope(routed.auditHint, {
    status: "routed",
    mode: "simulation",
    jefeStatus: "online",
    taskId: `jefe-route-${Date.now()}`,
    routedAgent: routed.routedAgent,
  });

  saveIdempotentResponse(idempotency, 200, responseBody);
  return NextResponse.json(responseBody);
}
