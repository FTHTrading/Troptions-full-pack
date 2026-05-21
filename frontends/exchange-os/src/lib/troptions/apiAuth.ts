import { isKnownRole, type TroptionsRole } from "@/content/troptions/roleRegistry";
import type { PermissionAction } from "@/content/troptions/permissionRegistry";
import { assertAuthorized } from "@/lib/troptions/authorizationEngine";
import crypto from "node:crypto";
import { upsertUserAccount } from "@/lib/troptions/db";
import { getJwtVerificationKeys } from "@/lib/troptions/keyManagement";

export class ControlPlaneAuthError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

export interface ControlPlaneAuthContext {
  actorId: string;
  actorRole: TroptionsRole;
  authProvider: "jwt" | "token";
  mfaVerified: boolean;
}

function parseBearerToken(request: Request): string | null {
  const authHeader = request.headers.get("authorization");
  if (!authHeader) return null;

  const [scheme, token] = authHeader.split(" ");
  if (scheme?.toLowerCase() !== "bearer" || !token) return null;
  return token;
}

function parseCookieHeader(request: Request): Record<string, string> {
  const raw = request.headers.get("cookie");
  if (!raw) return {};

  const entries = raw
    .split(";")
    .map((part) => part.trim())
    .filter(Boolean)
    .map((pair) => {
      const separator = pair.indexOf("=");
      if (separator < 0) return [pair, ""] as const;
      const key = pair.slice(0, separator);
      const value = pair.slice(separator + 1);
      return [key, decodeURIComponent(value)] as const;
    });

  return Object.fromEntries(entries);
}

function base64UrlToBuffer(value: string): Buffer {
  const normalized = value.replace(/-/g, "+").replace(/_/g, "/");
  const padded = normalized.padEnd(normalized.length + ((4 - (normalized.length % 4)) % 4), "=");
  return Buffer.from(padded, "base64");
}

interface JwtPayload {
  sub?: string;
  role?: string;
  troptions_role?: string;
  email?: string;
  name?: string;
  amr?: string[] | string;
  mfa?: boolean;
  exp?: number;
  nbf?: number;
}

function verifyJwt(token: string, secret: string): JwtPayload {
  const parts = token.split(".");
  if (parts.length !== 3) {
    throw new ControlPlaneAuthError(401, "Invalid JWT format.");
  }

  const [encodedHeader, encodedPayload, encodedSignature] = parts;
  const header = JSON.parse(base64UrlToBuffer(encodedHeader).toString("utf8")) as {
    alg?: string;
  };

  if (header.alg !== "HS256") {
    throw new ControlPlaneAuthError(401, "Unsupported JWT algorithm.");
  }

  const signingInput = `${encodedHeader}.${encodedPayload}`;
  const expected = crypto.createHmac("sha256", secret).update(signingInput).digest();
  const provided = base64UrlToBuffer(encodedSignature);

  if (provided.length !== expected.length || !crypto.timingSafeEqual(provided, expected)) {
    throw new ControlPlaneAuthError(401, "Invalid JWT signature.");
  }

  const payload = JSON.parse(base64UrlToBuffer(encodedPayload).toString("utf8")) as JwtPayload;
  const now = Math.floor(Date.now() / 1000);

  if (typeof payload.nbf === "number" && now < payload.nbf) {
    throw new ControlPlaneAuthError(401, "JWT not active yet.");
  }

  if (typeof payload.exp === "number" && now >= payload.exp) {
    throw new ControlPlaneAuthError(401, "JWT has expired.");
  }

  return payload;
}

function decodeJwtHeader(token: string): { alg?: string; kid?: string } {
  const parts = token.split(".");
  if (parts.length !== 3) {
    throw new ControlPlaneAuthError(401, "Invalid JWT format.");
  }

  return JSON.parse(base64UrlToBuffer(parts[0]).toString("utf8")) as { alg?: string; kid?: string };
}

function verifyJwtWithKeySet(token: string): JwtPayload {
  const header = decodeJwtHeader(token);
  const keys = getJwtVerificationKeys(header.kid);

  if (keys.length === 0) {
    throw new ControlPlaneAuthError(503, "No JWT verification keys are configured.");
  }

  let lastError: Error | null = null;
  for (const key of keys) {
    try {
      return verifyJwt(token, key.secret);
    } catch (error) {
      lastError = error as Error;
    }
  }

  throw new ControlPlaneAuthError(401, lastError?.message ?? "JWT verification failed.");
}

function isMfaVerified(payload: JwtPayload, request: Request): boolean {
  if (payload.mfa === true) return true;

  if (Array.isArray(payload.amr) && payload.amr.some((item) => item.toLowerCase() === "mfa")) {
    return true;
  }

  if (typeof payload.amr === "string" && payload.amr.toLowerCase().includes("mfa")) {
    return true;
  }

  const mfaHeader = request.headers.get("x-troptions-operator-mfa");
  return mfaHeader?.toLowerCase() === "verified";
}

function extractJwtToken(request: Request): string | null {
  const bearer = parseBearerToken(request);
  if (bearer) return bearer;

  const cookies = parseCookieHeader(request);
  return cookies.troptions_session ?? null;
}

function requireJwtAuth(
  request: Request,
  requiredAction: PermissionAction,
): ControlPlaneAuthContext {
  const token = extractJwtToken(request);
  if (!token) {
    throw new ControlPlaneAuthError(401, "Missing JWT session token.");
  }

  const payload = verifyJwtWithKeySet(token);
  const roleValue = payload.troptions_role ?? payload.role;

  if (!roleValue || !isKnownRole(roleValue)) {
    throw new ControlPlaneAuthError(403, "JWT role is missing or invalid.");
  }

  const actorId = payload.sub;
  if (!actorId || !actorId.trim()) {
    throw new ControlPlaneAuthError(403, "JWT subject is missing.");
  }

  try {
    assertAuthorized(roleValue, requiredAction);
  } catch (error) {
    throw new ControlPlaneAuthError(403, (error as Error).message);
  }

  upsertUserAccount({
    actorId,
    role: roleValue,
    authProvider: "jwt",
    authSubject: payload.sub,
    email: payload.email,
    displayName: payload.name,
  });

  return {
    actorId,
    actorRole: roleValue,
    authProvider: "jwt",
    mfaVerified: isMfaVerified(payload, request),
  };
}

function requireTokenAuth(
  request: Request,
  requiredAction: PermissionAction,
  expectedToken: string,
): ControlPlaneAuthContext {
  const providedToken = parseBearerToken(request);
  if (!providedToken || providedToken !== expectedToken) {
    throw new ControlPlaneAuthError(401, "Unauthorized control-plane request.");
  }

  const roleHeader = request.headers.get("x-troptions-actor-role");
  if (!roleHeader || !isKnownRole(roleHeader)) {
    throw new ControlPlaneAuthError(400, "Missing or invalid x-troptions-actor-role header.");
  }

  const actorRole = roleHeader;
  const actorId = request.headers.get("x-troptions-actor-id") ?? "control-plane-api";

  try {
    assertAuthorized(actorRole, requiredAction);
  } catch (error) {
    throw new ControlPlaneAuthError(403, (error as Error).message);
  }

  upsertUserAccount({
    actorId,
    role: actorRole,
    authProvider: "token",
  });

  const mfaHeader = request.headers.get("x-troptions-operator-mfa");
  return {
    actorId,
    actorRole,
    authProvider: "token",
    mfaVerified: mfaHeader?.toLowerCase() === "verified",
  };
}

export function requireControlPlaneAuth(
  request: Request,
  requiredAction: PermissionAction,
): ControlPlaneAuthContext {
  const jwtKeysConfigured =
    Boolean(process.env.TROPTIONS_JWT_KEYS_JSON && process.env.TROPTIONS_JWT_KEYS_JSON.trim()) ||
    Boolean(process.env.TROPTIONS_JWT_SECRET && process.env.TROPTIONS_JWT_SECRET.trim());

  if (jwtKeysConfigured) {
    return requireJwtAuth(request, requiredAction);
  }

  const expectedToken = process.env.TROPTIONS_CONTROL_PLANE_TOKEN;
  if (!expectedToken) {
    throw new ControlPlaneAuthError(
      503,
      "Control-plane authentication is not configured. Set TROPTIONS_JWT_SECRET or TROPTIONS_CONTROL_PLANE_TOKEN.",
    );
  }

  if (process.env.NODE_ENV === "production" && process.env.TROPTIONS_ALLOW_STATIC_TOKEN_AUTH !== "1") {
    throw new ControlPlaneAuthError(
      503,
      "Static token auth is disabled in production. Configure JWT keys.",
    );
  }

  return requireTokenAuth(request, requiredAction, expectedToken);
}
