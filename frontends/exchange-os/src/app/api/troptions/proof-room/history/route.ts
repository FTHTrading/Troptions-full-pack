import { NextResponse } from "next/server";
import { getMockHistoryTimeline, getApprovedPublicHistory } from "@/lib/troptions/proof-room/history";

export function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const publicOnly = searchParams.get("publicOnly") !== "false";
  const all = getMockHistoryTimeline();
  const events = publicOnly ? getApprovedPublicHistory(all) : all;
  return NextResponse.json({ ok: true, events, count: events.length });
}
