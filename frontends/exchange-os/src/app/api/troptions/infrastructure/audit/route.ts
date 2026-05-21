import { NextResponse } from "next/server";
import { getMockAuditEvents } from "@/lib/troptions/infrastructure/mockData";

export function GET() {
  const events = getMockAuditEvents();
  return NextResponse.json({ ok: true, events, count: events.length });
}
