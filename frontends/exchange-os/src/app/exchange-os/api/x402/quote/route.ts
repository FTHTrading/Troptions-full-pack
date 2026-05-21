import { NextRequest, NextResponse } from "next/server";
import { X402_SERVICES } from "@/lib/exchange-os/x402/services";
import { generateX402Quote } from "@/lib/exchange-os/x402/quote";
import { isDemoState } from "@/lib/exchange-os/x402/types";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { serviceId } = body;

    if (!serviceId) {
      return NextResponse.json({ error: "serviceId is required" }, { status: 400 });
    }

    const svc = X402_SERVICES.find((s) => s.id === serviceId);
    if (!svc) {
      return NextResponse.json({ error: "Unknown service ID" }, { status: 404 });
    }

    const quote = await generateX402Quote(serviceId);

    if (isDemoState(quote)) {
      return NextResponse.json(quote);
    }

    // Return payment headers + quote data
    return NextResponse.json(quote, {
      headers: {
        "X-Payment-Required": "true",
        "X-Payment-Amount": quote.priceCents.toString(),
        "X-Payment-Asset": quote.asset,
        "X-Payment-Network": quote.network,
        "X-Payment-Nonce": quote.nonce,
        "X-Payment-Expires": quote.expiresAt,
      },
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "x402 quote failed";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    services: X402_SERVICES.map((s) => ({
      id: s.id,
      name: s.name,
      category: s.category,
      priceCents: s.priceCents,
    })),
  });
}
