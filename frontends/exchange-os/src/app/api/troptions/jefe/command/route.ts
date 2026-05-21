import { guardPortalWrite, NextResponse, saveIdempotentResponse } from "@/lib/troptions/portalApiGuards";
import { routeCommand } from "@/lib/troptions/jefeEngine";
import { buildJefePostEnvelope } from "@/lib/troptions/jefeApi";
import { detectJefeBlockedIntent } from "@/lib/troptions/jefePolicyGuard";

export async function POST(request: Request) {
  const guarded = await guardPortalWrite(request);
  if (guarded instanceof NextResponse) return guarded;
  const idempotency = guarded.idempotency;

  const body = await request.json() as { command?: string };
  const command = body.command?.trim() ?? "";
  const blockedIntent = detectJefeBlockedIntent(command);

  if (blockedIntent) {
    const blockedBody = {
      ...buildJefePostEnvelope("Blocked by Jefe simulation safety policy.", {
        ok: false,
        status: "blocked",
        mode: "simulation",
        jefeStatus: "online",
        taskId: `jefe-command-${Date.now()}`,
        blockedReason: `Command includes blocked intent: ${blockedIntent}`,
      }),
    };
    saveIdempotentResponse(idempotency, 200, blockedBody);
    return NextResponse.json(blockedBody);
  }

  const routed = routeCommand(command);

  const responseBody = buildJefePostEnvelope(routed.auditHint, {
    status: "routed",
    mode: "simulation",
    jefeStatus: "online",
    taskId: `jefe-command-${Date.now()}`,
    routedAgent: routed.routedAgent,
  });

  saveIdempotentResponse(idempotency, 200, responseBody);
  return NextResponse.json(responseBody);
}
