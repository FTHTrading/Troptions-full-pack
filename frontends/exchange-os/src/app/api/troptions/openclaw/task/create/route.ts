import { guardPortalWrite, NextResponse, saveIdempotentResponse } from "@/lib/troptions/portalApiGuards";
import { createOpenClawTask } from "@/lib/troptions/openClawTaskEngine";

export async function POST(request: Request) {
  const guarded = await guardPortalWrite(request);
  if (guarded instanceof NextResponse) return guarded;

  const body = await request.json() as { label?: string; command?: string };
  const task = createOpenClawTask({ label: body.label ?? "OpenClaw task", command: body.command });

  const responseBody = {
    ok: true,
    ...task,
    status: "created",
    approvalRequired: true,
  };

  saveIdempotentResponse(guarded.idempotency, 200, responseBody);
  return NextResponse.json(responseBody);
}
