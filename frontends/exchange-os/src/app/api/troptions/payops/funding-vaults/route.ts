import { NextRequest, NextResponse } from "next/server";
import { getMockFundingVault } from "@/lib/troptions/payops/mockData";

export async function GET(req: NextRequest) {
  const ns = req.nextUrl.searchParams.get("namespace") ?? "default";
  const vault = getMockFundingVault(`ns-payops-${ns}`);
  return NextResponse.json({
    ok: true,
    vault,
    disclaimer:
      "Vault balance is a manual record only. No banking adapter is configured. TROPTIONS does not hold funds on your behalf.",
  });
}
