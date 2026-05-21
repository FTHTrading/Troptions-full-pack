import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    ok: true,
    status: "live",
    service: "troptions-control-plane",
    ts: new Date().toISOString(),
  });
}
