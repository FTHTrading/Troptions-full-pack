import { NextRequest, NextResponse } from "next/server";
import { getMockFundingSources } from "@/lib/troptions/payops/mockData";

export async function GET(req: NextRequest) {
  const ns = req.nextUrl.searchParams.get("namespace") ?? "default";
  const sources = getMockFundingSources(`ns-payops-${ns}`);
  return NextResponse.json({
    ok: true,
    fundingSources: sources,
    configured: sources.filter((s) => s.isConfigured).length,
    unconfigured: sources.filter((s) => !s.isConfigured).length,
  });
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  if (!body?.label || !body?.sourceType || !body?.namespaceId) {
    return NextResponse.json(
      { error: "label, sourceType, and namespaceId are required" },
      { status: 400 }
    );
  }

  return NextResponse.json({
    ok: true,
    message:
      "Funding source record created. Manual proof records do not confirm actual fund availability. A live bank or stablecoin adapter is required for confirmed balances.",
    fundingSourceId: `fsrc-${Date.now()}`,
    status: "not_configured",
    warning:
      "TROPTIONS does not hold or move your funds. Adapter configuration is required before live payouts.",
  });
}
