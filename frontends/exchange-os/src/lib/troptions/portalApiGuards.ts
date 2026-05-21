import { NextResponse } from "next/server";
import {
  guardControlPlaneRequest,
  saveIdempotentResponse,
} from "@/lib/troptions/requestGuards";
import { trackControlPlaneEvent } from "@/lib/troptions/monitoring";

export async function guardPortalRead(request: Request) {
  return guardControlPlaneRequest(request, {
    requiredAction: "read-status",
    writeAction: false,
    requireIdempotency: false,
  });
}

export async function guardPortalWrite(request: Request) {
  return guardControlPlaneRequest(request, {
    requiredAction: "request-approval",
    writeAction: true,
    requireIdempotency: true,
  });
}

export function buildBlockedResponse(blockedReasons: string[], data?: Record<string, unknown>) {
  return {
    ok: false,
    simulationOnly: true,
    blockedReasons,
    ...(data ?? {}),
  };
}

export function auditPortalAction(
  actionType: string,
  actorId: string,
  actorRole: string,
  routeKey: string,
  metadata: Record<string, unknown>,
) {
  trackControlPlaneEvent(actionType, "info", {
    actorId,
    actorRole,
    routeKey,
    ...metadata,
  });
}

export { NextResponse, saveIdempotentResponse };
