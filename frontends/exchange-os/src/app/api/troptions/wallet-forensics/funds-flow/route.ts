import { NextRequest, NextResponse } from "next/server";
import { getFundsFlowEdges } from "@/lib/troptions/xrplFundsFlowAnalyzer";
import { requireAuth } from "@/lib/troptions/walletForensicsApiGuards";

export function GET(request: NextRequest) {
  const authError = requireAuth(request);
  if (authError) return authError;
  return NextResponse.json({ ok: true, data: getFundsFlowEdges() });
}
