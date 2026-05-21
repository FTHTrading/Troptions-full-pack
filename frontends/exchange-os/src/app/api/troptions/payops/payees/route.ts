import { NextRequest, NextResponse } from "next/server";
import { getMockPayees } from "@/lib/troptions/payops/mockData";
import { isPayeeCompliant, getPayeeComplianceIssues } from "@/lib/troptions/payops/compliance";

export async function GET(req: NextRequest) {
  const ns = req.nextUrl.searchParams.get("namespace") ?? "default";
  const payees = getMockPayees(`ns-payops-${ns}`);
  return NextResponse.json({
    ok: true,
    payees,
    total: payees.length,
    active: payees.filter((p) => p.isActive).length,
    blocked: payees.filter((p) => !isPayeeCompliant(p)).length,
  });
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  if (!body?.name || !body?.email || !body?.payeeType || !body?.namespaceId) {
    return NextResponse.json(
      { error: "name, email, payeeType, and namespaceId are required" },
      { status: 400 }
    );
  }

  // In production: persist to DB, trigger compliance check, create audit event
  return NextResponse.json({
    ok: true,
    message:
      "Payee created. Compliance checks (KYC, sanctions screening) must be completed before this payee can receive a payout.",
    payeeId: `payee-${Date.now()}`,
    complianceStatus: "not_started",
    requiredNextSteps: [
      "Complete KYC verification",
      "Collect W-9 or W-8 form",
      "Run sanctions screening",
    ],
  });
}

export async function PUT(req: NextRequest) {
  const body = await req.json().catch(() => null);
  if (!body?.payeeId) {
    return NextResponse.json({ error: "payeeId required" }, { status: 400 });
  }
  // In production: update payee record, create audit event
  return NextResponse.json({
    ok: true,
    message: "Payee updated.",
    payeeId: body.payeeId,
    issues: getPayeeComplianceIssues({ ...body, sanctionsScreeningStatus: "not_started", kycStatus: "not_started", w9w8Status: "not_started" }),
  });
}
