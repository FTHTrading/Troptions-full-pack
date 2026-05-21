import { guardPortalRead, NextResponse } from "@/lib/troptions/portalApiGuards";
import { getOpenClawAuditEvents } from "@/lib/troptions/openClawAuditEngine";
import { OPENCLAW_BLOCKED_ACTIONS, OPENCLAW_REQUIRED_APPROVALS } from "@/content/troptions/openClawPolicyRegistry";

export async function GET(request: Request) {
  const guarded = await guardPortalRead(request);
  if (guarded instanceof NextResponse) return guarded;

  return NextResponse.json({
    ok: true,
    status: "ok",
    mode: "simulation",
    agentId: "jefe",
    taskId: "audit-list",
    blockedActions: OPENCLAW_BLOCKED_ACTIONS,
    requiredApprovals: OPENCLAW_REQUIRED_APPROVALS,
    auditHint: "Read-only audit event export.",
    nextSteps: ["Review audit anomalies and route tasks"],
    events: getOpenClawAuditEvents(),
  });
}
