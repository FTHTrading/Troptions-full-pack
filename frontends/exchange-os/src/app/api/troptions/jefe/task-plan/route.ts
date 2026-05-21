import { guardPortalWrite, NextResponse, saveIdempotentResponse } from "@/lib/troptions/portalApiGuards";
import { createTaskPlan } from "@/lib/troptions/jefeEngine";
import { buildJefePostEnvelope } from "@/lib/troptions/jefeApi";

export async function POST(request: Request) {
  const guarded = await guardPortalWrite(request);
  if (guarded instanceof NextResponse) return guarded;

  const body = await request.json() as { objective?: string };
  const plan = createTaskPlan(body.objective ?? "Draft implementation plan");

  const responseBody = buildJefePostEnvelope("Planning-only response.", {
    status: "planned",
    mode: "simulation",
    jefeStatus: "online",
    taskId: plan.taskId,
    routedAgent: plan.routedAgent,
    plan,
  });

  saveIdempotentResponse(guarded.idempotency, 200, responseBody);
  return NextResponse.json(responseBody);
}
