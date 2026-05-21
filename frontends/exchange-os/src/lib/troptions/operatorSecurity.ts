import type { PermissionAction } from "@/content/troptions/permissionRegistry";
import type { ControlPlaneAuthContext } from "@/lib/troptions/apiAuth";

export class OperatorSecurityError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

const DEFAULT_SENSITIVE_ACTIONS: PermissionAction[] = [
  "request-approval",
  "transition-workflow",
  "resolve-exception",
  "append-audit-log",
  "approve-legal",
  "approve-custody",
  "approve-compliance",
  "approve-board",
  "reject-approval",
  "acknowledge-alert",
];

function parseSensitiveActions(): Set<string> {
  const fromEnv = process.env.TROPTIONS_SENSITIVE_ACTIONS;
  if (!fromEnv || !fromEnv.trim()) {
    return new Set(DEFAULT_SENSITIVE_ACTIONS);
  }

  return new Set(
    fromEnv
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean),
  );
}

function parseIpAllowlist(): Set<string> {
  const raw = process.env.TROPTIONS_OPERATOR_IP_ALLOWLIST;
  if (!raw || !raw.trim()) return new Set();

  return new Set(
    raw
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean),
  );
}

function shouldEnforce(): boolean {
  return process.env.NODE_ENV === "production" || process.env.TROPTIONS_ENFORCE_OPERATOR_SECURITY === "1";
}

function requestIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0]?.trim() ?? "unknown";
  }

  return request.headers.get("x-real-ip") ?? "unknown";
}

export function enforceOperatorSecurity(
  request: Request,
  auth: ControlPlaneAuthContext,
  action: PermissionAction,
): void {
  if (!shouldEnforce()) return;

  const sensitiveActions = parseSensitiveActions();
  if (!sensitiveActions.has(action)) return;

  if (!auth.mfaVerified) {
    throw new OperatorSecurityError(403, "Sensitive operator action requires MFA-verified authentication.");
  }

  const allowlist = parseIpAllowlist();
  if (allowlist.size > 0) {
    const ip = requestIp(request);
    if (!allowlist.has(ip)) {
      throw new OperatorSecurityError(403, `Operator IP ${ip} is not in the allowlist.`);
    }
  }

  if (process.env.NODE_ENV === "production" && auth.authProvider === "token") {
    const legacyAllowed = process.env.TROPTIONS_ALLOW_STATIC_TOKEN_AUTH === "1";
    if (!legacyAllowed) {
      throw new OperatorSecurityError(403, "Static token auth is disabled for sensitive production actions.");
    }
  }
}
