import { NextResponse } from "next/server";
import { buildX402ReadinessReport } from "@/lib/troptions/x402ReadinessEngine";

export async function GET() {
  return NextResponse.json({ ok: true, ...buildX402ReadinessReport() });
}
