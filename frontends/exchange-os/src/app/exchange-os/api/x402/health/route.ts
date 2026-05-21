// TROPTIONS Exchange OS — API: x402 Health
// GET /exchange-os/api/x402/health

import { NextResponse } from "next/server";
import { x402Config } from "@/config/exchange-os/x402";
import { X402_SERVICES } from "@/lib/exchange-os/x402/services";

export async function GET() {
  return NextResponse.json({
    enabled: x402Config.enabled,
    demoMode: x402Config.demoMode,
    facilitatorUrl: x402Config.enabled ? x402Config.facilitatorUrl : null,
    network: x402Config.defaultNetwork,
    asset: x402Config.defaultAsset,
    protocolVersion: x402Config.protocolVersion,
    serviceCount: X402_SERVICES.length,
    availableServices: X402_SERVICES.filter((s) => s.available).length,
    timestamp: new Date().toISOString(),
  });
}
