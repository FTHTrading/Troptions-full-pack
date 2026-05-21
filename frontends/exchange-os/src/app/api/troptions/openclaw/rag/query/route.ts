import { guardPortalWrite, NextResponse, saveIdempotentResponse } from "@/lib/troptions/portalApiGuards";
import { OPENCLAW_BLOCKED_ACTIONS, OPENCLAW_REQUIRED_APPROVALS } from "@/content/troptions/openClawPolicyRegistry";

export async function POST(request: Request) {
  const guarded = await guardPortalWrite(request);
  if (guarded instanceof NextResponse) return guarded;

  const body = await request.json() as { query?: string };
  const query = body.query ?? "";

  const responseBody = {
    ok: true,
    status: "queried",
    mode: "simulation",
    agentId: "rag-agent",
    taskId: `rag-${Date.now()}`,
    blockedActions: OPENCLAW_BLOCKED_ACTIONS,
    requiredApprovals: OPENCLAW_REQUIRED_APPROVALS,
    auditHint: "Registry-first RAG stub response.",
    nextSteps: ["Request deep source review if evidence is required"],
    approvalRequired: false,
    query,
    results: [
      {
        sourceId: "openclaw-task-registry",
        summary: "OpenClaw task templates provide simulation and planning workflows.",
      },
      {
        sourceId: "openclaw-policy-registry",
        summary: "Sensitive actions remain blocked and approval-gated.",
      },
    ],
  };

  saveIdempotentResponse(guarded.idempotency, 200, responseBody);
  return NextResponse.json(responseBody);
}
