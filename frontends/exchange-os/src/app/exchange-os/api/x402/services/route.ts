// TROPTIONS Exchange OS — API: x402 Services List
// GET /exchange-os/api/x402/services

import { NextResponse } from "next/server";
import { X402_SERVICES } from "@/lib/exchange-os/x402/services";
import { x402Config } from "@/config/exchange-os/x402";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category");

  const services = category
    ? X402_SERVICES.filter((s) => s.category === category)
    : X402_SERVICES;

  return NextResponse.json({
    services: services.map((s) => ({
      id: s.id,
      name: s.name,
      description: s.description,
      priceCents: s.priceCents,
      priceDisplay: s.priceDisplay,
      network: s.network,
      asset: s.asset,
      category: s.category,
      available: s.available,
      demoAvailable: s.demoAvailable,
      estimatedMs: s.estimatedMs,
    })),
    demoMode: x402Config.demoMode,
    enabled: x402Config.enabled,
    total: services.length,
  });
}
