import { inspectXrplDependencySecurity } from "@/lib/troptions/xrplDependencySecurityGuard";
import { guardPortalRead, NextResponse } from "@/lib/troptions/portalApiGuards";
import { buildXrplApiEnvelope } from "@/lib/troptions/xrplPlatformApiUtils";

export async function GET(request: Request) {
  const guarded = await guardPortalRead(request);
  if (guarded instanceof NextResponse) return guarded;
  return NextResponse.json(buildXrplApiEnvelope({ mode: "dependency-security", findings: inspectXrplDependencySecurity(), blockedReason: undefined, requiredApprovals: [], auditHint: "Dependency read-only inspection." }));
}