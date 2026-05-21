import { NextRequest, NextResponse } from "next/server";
import { getMockComplianceChecks } from "@/lib/troptions/payops/mockData";
import { getMockComplianceSummary } from "@/lib/troptions/payops/compliance";

export async function GET(req: NextRequest) {
  const ns = req.nextUrl.searchParams.get("namespace") ?? "default";
  const namespaceId = `ns-payops-${ns}`;
  const checks = getMockComplianceChecks(namespaceId);
  const summary = getMockComplianceSummary();
  return NextResponse.json({
    ok: true,
    checks,
    summary,
    blocked: checks.filter((c) => c.status === "blocked").length,
    pending: checks.filter((c) => c.status === "pending").length,
    approved: checks.filter((c) => c.status === "approved").length,
    note: "Compliance checks must be approved before any payout batch can be executed.",
  });
}
