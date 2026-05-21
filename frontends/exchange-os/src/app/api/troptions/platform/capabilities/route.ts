import { NextResponse } from "next/server";
import { getPlatformCapabilities } from "@/lib/troptions/platform/capabilities";
import { generatePlatformReadinessReport } from "@/lib/troptions/platform/readiness";

export function GET() {
  const capabilities = getPlatformCapabilities();
  const report = generatePlatformReadinessReport();
  return NextResponse.json({ ok: true, capabilities, report });
}
