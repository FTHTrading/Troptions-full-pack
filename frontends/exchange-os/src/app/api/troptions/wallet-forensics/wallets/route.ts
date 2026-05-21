import { NextRequest, NextResponse } from "next/server";
import { XRPL_WALLET_INVENTORY_REGISTRY } from "@/content/troptions/xrplWalletInventoryRegistry";
import { requireAuth } from "@/lib/troptions/walletForensicsApiGuards";

export function GET(request: NextRequest) {
  const authError = requireAuth(request);
  if (authError) return authError;
  return NextResponse.json({ ok: true, data: XRPL_WALLET_INVENTORY_REGISTRY });
}
