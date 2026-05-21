import { guardPortalWrite, NextResponse, saveIdempotentResponse } from "@/lib/troptions/portalApiGuards";
import { checkX402Readiness } from "@/lib/troptions/jefeEngine";
import { buildJefePostEnvelope } from "@/lib/troptions/jefeApi";

export async function POST(request: Request) {
  const guarded = await guardPortalWrite(request);
  if (guarded instanceof NextResponse) return guarded;

  const readiness = checkX402Readiness();
  const responseBody = buildJefePostEnvelope("x402 check remains simulation-only.", {
    status: "checked",
    mode: "simulation",
    jefeStatus: "online",
    taskId: `jefe-x402-${Date.now()}`,
    routedAgent: "x402-agent",
    readiness,
  });

  saveIdempotentResponse(guarded.idempotency, 200, responseBody);
  return NextResponse.json(responseBody);
}
