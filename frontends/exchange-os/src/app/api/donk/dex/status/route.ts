import { NextResponse } from "next/server";

interface StatusItem {
  name: string;
  status: "LIVE" | "CONFIGURED" | "PENDING" | "LOCAL_ONLY" | "NOT_CONNECTED";
  detail: string;
  url?: string;
}

async function checkApostle(): Promise<StatusItem> {
  try {
    const res = await fetch("http://localhost:7332/health", { signal: AbortSignal.timeout(2000) });
    if (res.ok) {
      const data = await res.json().catch(() => ({}));
      return { name: "Apostle Chain (ATP)", status: "LIVE", detail: `chain_id 7332 — height ${data.height ?? "?"}`, url: "http://localhost:7332" };
    }
    return { name: "Apostle Chain (ATP)", status: "NOT_CONNECTED", detail: "Port 7332 responded with non-OK" };
  } catch {
    return { name: "Apostle Chain (ATP)", status: "NOT_CONNECTED", detail: "Cannot reach localhost:7332" };
  }
}

function getJupiterStatus(): StatusItem {
  return {
    name: "Jupiter DEX (Solana)",
    status: "CONFIGURED",
    detail: "Jupiter V6 API is public. Solana network: " + (process.env.NEXT_PUBLIC_SOLANA_NETWORK ?? "not set"),
    url: "https://quote-api.jup.ag/v6",
  };
}

function getX402Status(): StatusItem {
  const url = process.env.NEXT_PUBLIC_X402_URL;
  if (url) {
    return { name: "x402 Payment Rails", status: "CONFIGURED", detail: `Gateway: ${url}` };
  }
  return { name: "x402 Payment Rails", status: "PENDING", detail: "NEXT_PUBLIC_X402_URL not set" };
}

function getDonkDexEnvStatus(): StatusItem {
  const token = process.env.DONK_TOKEN_MINT;
  if (token) {
    return { name: "DONK Token Mint", status: "CONFIGURED", detail: `Mint: ${token}` };
  }
  return { name: "DONK Token Mint", status: "PENDING", detail: "DONK_TOKEN_MINT env not set — Solana DEX in demo mode" };
}

export async function GET() {
  const [apostle] = await Promise.all([checkApostle()]);

  const items: StatusItem[] = [
    apostle,
    getJupiterStatus(),
    getX402Status(),
    getDonkDexEnvStatus(),
    {
      name: "DONK Polygon Token",
      status: "LIVE",
      detail: "DONK + EVL deployed on Polygon mainnet",
      url: "https://polygonscan.com",
    },
  ];

  return NextResponse.json({
    ok: true,
    generated_at: new Date().toISOString(),
    items,
  });
}
