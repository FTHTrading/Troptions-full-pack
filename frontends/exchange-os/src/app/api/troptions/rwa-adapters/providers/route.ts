import { NextResponse } from "next/server";
import { RWA_PROVIDER_ADAPTERS, getReferenceOnlyProviders } from "@/lib/troptions/rwa-adapters/providers";

export function GET() {
  return NextResponse.json({
    ok: true,
    adapters: RWA_PROVIDER_ADAPTERS,
    count: RWA_PROVIDER_ADAPTERS.length,
    referenceOnlyCount: getReferenceOnlyProviders().length,
    executionEnabledCount: 0,
  });
}
