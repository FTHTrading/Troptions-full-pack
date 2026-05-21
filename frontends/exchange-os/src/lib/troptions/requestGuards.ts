import { NextResponse } from "next/server";
import type { PermissionAction } from "@/content/troptions/permissionRegistry";
import {
  requireControlPlaneAuth,
  type ControlPlaneAuthContext,
  ControlPlaneAuthError,
} from "@/lib/troptions/apiAuth";
import { ensureControlPlanePersistenceLoaded } from "@/lib/troptions/controlPlanePersistence";
import { enforceDeploymentGate, DeploymentGateError } from "@/lib/troptions/deploymentGates";
import { enforceOperatorSecurity, OperatorSecurityError } from "@/lib/troptions/operatorSecurity";
import {
  consumeRateLimit,
  getIdempotencyRecord,
  hashRequestBody,
  saveIdempotencyRecord,
} from "@/lib/troptions/db";
import { trackControlPlaneEvent } from "@/lib/troptions/monitoring";

export class ControlPlaneGuardError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

export interface IdempotencyContext {
  idempotencyKey: string;
  routeKey: string;
  actorId: string;
  requestHash: string;
}

export interface GuardedRequestContext {
  auth: ControlPlaneAuthContext;
  idempotency?: IdempotencyContext;
}

interface GuardOptions {
  requiredAction: PermissionAction;
  writeAction?: boolean;
  requireIdempotency?: boolean;
}

function requestIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0]?.trim() ?? "unknown";
  }

  return request.headers.get("x-real-ip") ?? "unknown";
}

function rateLimitConfig() {
  const limit = Number(process.env.TROPTIONS_RATE_LIMIT_PER_MINUTE ?? "120");
  const windowSeconds = Number(process.env.TROPTIONS_RATE_LIMIT_WINDOW_SECONDS ?? "60");
  return {
    limit: Number.isFinite(limit) && limit > 0 ? limit : 120,
    windowSeconds: Number.isFinite(windowSeconds) && windowSeconds > 0 ? windowSeconds : 60,
  };
}

async function buildIdempotencyContext(
  request: Request,
  actorId: string,
  routeKey: string,
): Promise<IdempotencyContext | NextResponse> {
  const key = request.headers.get("idempotency-key");
  if (!key || !key.trim()) {
    throw new ControlPlaneGuardError(400, "Missing idempotency-key header for mutating endpoint.");
  }

  const bodyText = await request.clone().text();
  const requestHash = hashRequestBody(bodyText);
  const existing = getIdempotencyRecord(key, routeKey, actorId, requestHash);

  if (existing) {
    trackControlPlaneEvent("idempotency_hit", "info", { routeKey, actorId });
    return NextResponse.json(JSON.parse(existing.responseJson), { status: existing.statusCode });
  }

  return {
    idempotencyKey: key,
    routeKey,
    actorId,
    requestHash,
  };
}

export async function guardControlPlaneRequest(
  request: Request,
  options: GuardOptions,
): Promise<GuardedRequestContext | NextResponse> {
  try {
    ensureControlPlanePersistenceLoaded();
    const auth = requireControlPlaneAuth(request, options.requiredAction);
    enforceDeploymentGate(Boolean(options.writeAction));
    enforceOperatorSecurity(request, auth, options.requiredAction);

    const routeKey = new URL(request.url).pathname;
    const { limit, windowSeconds } = rateLimitConfig();
    const rateLimitBucket = `${auth.actorId}:${routeKey}`;
    const rate = consumeRateLimit(rateLimitBucket, limit, windowSeconds);

    if (!rate.allowed) {
      trackControlPlaneEvent("rate_limit_block", "warn", {
        routeKey,
        actorId: auth.actorId,
        resetAt: rate.resetAtEpochSeconds,
      });
      throw new ControlPlaneGuardError(429, "Rate limit exceeded.");
    }

    trackControlPlaneEvent("request_guard_pass", "info", {
      routeKey,
      actorId: auth.actorId,
      actorRole: auth.actorRole,
      ip: requestIp(request),
    });

    if (options.requireIdempotency) {
      const idempotency = await buildIdempotencyContext(request, auth.actorId, routeKey);
      if (idempotency instanceof NextResponse) return idempotency;
      return { auth, idempotency };
    }

    return { auth };
  } catch (error) {
    if (error instanceof ControlPlaneAuthError) {
      trackControlPlaneEvent("auth_failure", "warn", { message: error.message });
      return NextResponse.json({ ok: false, error: error.message }, { status: error.status });
    }

    if (error instanceof DeploymentGateError) {
      trackControlPlaneEvent("deployment_gate_block", "warn", { message: error.message });
      return NextResponse.json({ ok: false, error: error.message }, { status: error.status });
    }

    if (error instanceof OperatorSecurityError) {
      trackControlPlaneEvent("operator_security_block", "warn", { message: error.message });
      return NextResponse.json({ ok: false, error: error.message }, { status: error.status });
    }

    if (error instanceof ControlPlaneGuardError) {
      trackControlPlaneEvent("request_guard_block", "warn", { message: error.message });
      return NextResponse.json({ ok: false, error: error.message }, { status: error.status });
    }

    trackControlPlaneEvent("request_guard_error", "error", {
      message: (error as Error).message,
    });
    return NextResponse.json(
      { ok: false, error: (error as Error).message },
      { status: 400 },
    );
  }
}

export function saveIdempotentResponse(
  idempotency: IdempotencyContext | undefined,
  statusCode: number,
  responseBody: unknown,
): void {
  if (!idempotency) return;
  const ttlSeconds = Number(process.env.TROPTIONS_IDEMPOTENCY_TTL_SECONDS ?? "600");
  const effectiveTtl = Number.isFinite(ttlSeconds) && ttlSeconds > 0 ? ttlSeconds : 600;

  saveIdempotencyRecord(
    idempotency.idempotencyKey,
    idempotency.routeKey,
    idempotency.actorId,
    idempotency.requestHash,
    statusCode,
    responseBody,
    effectiveTtl,
  );
}
