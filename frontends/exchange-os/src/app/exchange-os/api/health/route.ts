import { NextResponse } from "next/server";
import { features } from "@/config/exchange-os/features";
import { xrplConfig } from "@/config/exchange-os/xrpl";
import { x402Config } from "@/config/exchange-os/x402";

export async function GET() {
  return NextResponse.json({
    ok: true,
    service: "TROPTIONS Exchange OS",
    version: "1.0.0",
    demoMode: features.demoMode,
    features: {
      liveTrading: features.liveTrading,
      swapEnabled: features.swapEnabled,
      ammEnabled: features.ammEnabled,
      x402Enabled: features.x402Enabled,
      voiceEnabled: features.voiceEnabled,
    },
    xrpl: {
      network: xrplConfig.network,
      mainnetEnabled: xrplConfig.mainnetEnabled,
      demoMode: xrplConfig.demoMode,
    },
    x402: {
      enabled: x402Config.enabled,
      demoMode: x402Config.demoMode,
    },
    timestamp: new Date().toISOString(),
  });
}
