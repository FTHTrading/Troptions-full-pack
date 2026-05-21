import { NextRequest, NextResponse } from "next/server";
import { getMockAdapters } from "@/lib/troptions/payops/mockData";
import { canAdapterExecutePayouts } from "@/lib/troptions/payops/adapters";

export async function GET(req: NextRequest) {
  const ns = req.nextUrl.searchParams.get("namespace") ?? "default";
  const namespaceId = `ns-payops-${ns}`;
  const adapters = getMockAdapters(namespaceId);
  return NextResponse.json({
    ok: true,
    adapters,
    configured: adapters.filter((a) => a.isConfigured).length,
    executionCapable: adapters.filter((a) =>
      canAdapterExecutePayouts(a)
    ).length,
    note: "No execution-capable adapters are configured. Live payouts require an approved, production-configured adapter.",
  });
}
