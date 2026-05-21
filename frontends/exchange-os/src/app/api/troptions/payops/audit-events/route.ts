import { NextRequest, NextResponse } from "next/server";
import { getMockAuditEvents } from "@/lib/troptions/payops/mockData";

export async function GET(req: NextRequest) {
  const ns = req.nextUrl.searchParams.get("namespace") ?? "default";
  const limit = Number(req.nextUrl.searchParams.get("limit") ?? "20");
  const namespaceId = `ns-payops-${ns}`;
  const events = getMockAuditEvents(namespaceId)
    .sort((a, b) => b.timestamp.localeCompare(a.timestamp))
    .slice(0, Math.min(limit, 100));
  return NextResponse.json({
    ok: true,
    events,
    total: events.length,
    note: "Audit events are immutable. Every payout action is logged.",
  });
}
