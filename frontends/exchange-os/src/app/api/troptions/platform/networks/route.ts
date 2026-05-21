import { NextResponse } from "next/server";
import { generateNetworkReadinessReport } from "@/lib/troptions/networks/registry";

export function GET() {
  const report = generateNetworkReadinessReport();
  return NextResponse.json({ ok: true, ...report });
}
