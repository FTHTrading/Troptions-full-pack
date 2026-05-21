import { NextResponse } from "next/server";
import {
  getRecentWalletActivity,
  getTroptionsWalletHubSnapshot,
  TROPTIONS_WALLET_HUB_SAFETY_STATEMENT,
} from "@/lib/troptions/troptionsWalletHubEngine";

export async function GET() {
  const snapshot = getTroptionsWalletHubSnapshot();
  const recentActivity = getRecentWalletActivity();

  return NextResponse.json({
    ok: true,
    snapshot,
    balances: snapshot.balances,
    recentActivity,
    chainHealthStatus: snapshot.chainHealth,
    safetyStatement: TROPTIONS_WALLET_HUB_SAFETY_STATEMENT,
  });
}
