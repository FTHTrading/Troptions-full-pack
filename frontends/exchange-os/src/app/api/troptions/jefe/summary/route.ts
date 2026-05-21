import { NextResponse } from "next/server";
import { summarizeBlockers, summarizeNextSteps } from "@/lib/troptions/jefeEngine";
import { JEFE_BLOCKED_ACTIONS, JEFE_REQUIRED_APPROVALS } from "@/content/troptions/jefePolicyRegistry";

export async function GET() {
  return NextResponse.json({
    ok: true,
    simulationOnly: true,
    status: "ok",
    mode: "simulation",
    agentId: "jefe",
    taskId: "jefe-summary",
    blockedActions: JEFE_BLOCKED_ACTIONS,
    requiredApprovals: JEFE_REQUIRED_APPROVALS,
    auditHint: "Read-only Jefe summary.",
    nextSteps: summarizeNextSteps().nextSteps,
    blockers: summarizeBlockers().blockerSummary,
  });
}
