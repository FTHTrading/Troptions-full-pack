// TROPTIONS Exchange OS — API: Launch Readiness Report
// POST /exchange-os/api/reports/launch-readiness
// Gated by x402 in production; demo mode returns full report free.

import { NextResponse } from "next/server";
import { generateLaunchReadinessReport } from "@/lib/exchange-os/reports/launchReadiness";
import { checkX402Payment } from "@/lib/exchange-os/x402/middleware";
import { xrplConfig } from "@/config/exchange-os/xrpl";
import { isValidXrplAddress } from "@/lib/exchange-os/xrpl/readWallet";

export async function POST(request: Request) {
  try {
    const body = await request.json() as {
      ticker?: string;
      issuerAddress?: string;
      maxSupply?: string;
      metadataUrl?: string;
      hasLiquidityPlan?: boolean;
      rewardPoliciesEnabled?: boolean;
      x402AccessEnabled?: boolean;
    };

    const { ticker, issuerAddress, maxSupply } = body;

    if (!ticker || !issuerAddress || !maxSupply) {
      return NextResponse.json(
        { error: "ticker, issuerAddress, and maxSupply are required" },
        { status: 400 }
      );
    }

    if (!isValidXrplAddress(issuerAddress)) {
      return NextResponse.json({ error: "Invalid XRPL issuer address" }, { status: 400 });
    }

    // x402 gate in production
    const paymentCheck = await checkX402Payment(request, "launch-readiness-report");
    if (!paymentCheck.allowed && !xrplConfig.demoMode) {
      return NextResponse.json(
        { error: "Payment required", details: paymentCheck },
        {
          status: 402,
          headers: {
            "X-Payment-Required": "true",
            "X-Payment-Service": "launch-readiness-report",
          },
        }
      );
    }

    const report = generateLaunchReadinessReport({
      ticker,
      issuerAddress,
      maxSupply,
      metadataUrl: body.metadataUrl,
      hasLiquidityPlan: body.hasLiquidityPlan ?? false,
      rewardPoliciesEnabled: body.rewardPoliciesEnabled ?? false,
      x402AccessEnabled: body.x402AccessEnabled ?? false,
    });

    return NextResponse.json({ report, demoMode: xrplConfig.demoMode });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Report generation failed";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
