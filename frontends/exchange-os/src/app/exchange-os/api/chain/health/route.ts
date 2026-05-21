// TROPTIONS Exchange OS — Chain Health Proxy
// GET /exchange-os/api/chain/health
// Checks health of ATP (chain 7332) and FTH Pay (chain 7331 / needai port 3000).
// Server-side only — proxies to localhost services to avoid CORS.

import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface ChainStatus {
  online: boolean;
  height?: number;
  agents?: number;
  cycles?: number;
  error?: string;
}

async function checkAtp(): Promise<ChainStatus> {
  try {
    const url = process.env.ATP_CHAIN_URL ?? "http://localhost:7332";
    const res = await fetch(`${url}/status`, { signal: AbortSignal.timeout(4000) });
    if (!res.ok) return { online: false, error: `HTTP ${res.status}` };
    const data = await res.json() as {
      height?: number;
      block_height?: number;
      agents?: number;
      agent_count?: number;
    };
    return {
      online: true,
      height: data.height ?? data.block_height,
      agents: data.agents ?? data.agent_count,
    };
  } catch {
    return { online: false };
  }
}

async function checkFthPay(): Promise<ChainStatus> {
  try {
    const url = process.env.FTH_PAY_URL ?? "http://localhost:3000";
    const res = await fetch(`${url}/api/health`, { signal: AbortSignal.timeout(4000) });
    if (!res.ok) return { online: false, error: `HTTP ${res.status}` };
    const data = await res.json() as {
      ok?: boolean;
      height?: number;
      cycles?: number;
    };
    return { online: data.ok !== false, height: data.height, cycles: data.cycles };
  } catch {
    return { online: false };
  }
}

// Also check ATP agent balance for the chairman
async function checkChairmanBalance(): Promise<{ atp?: number; uny?: number; fthusd?: number }> {
  const chairmanId = process.env.CHAIRMAN_AGENT_ID ?? "87724c76-da93-4b1a-9fa6-271ba856338e";
  try {
    const url = process.env.ATP_CHAIN_URL ?? "http://localhost:7332";
    const res = await fetch(`${url}/v1/agent/${chairmanId}/balance`, {
      signal: AbortSignal.timeout(4000),
    });
    if (!res.ok) return {};
    const data = await res.json() as { ATP?: string; UNY?: string; FTHUSD?: string };
    return {
      atp: data.ATP ? parseFloat(data.ATP) / 1e18 : undefined,
      uny: data.UNY ? parseFloat(data.UNY) / 1e18 : undefined,
      fthusd: data.FTHUSD ? parseFloat(data.FTHUSD) / 1e7 : undefined,
    };
  } catch {
    return {};
  }
}

export async function GET() {
  const [chain7332, chain7331, chairman] = await Promise.all([
    checkAtp(),
    checkFthPay(),
    checkChairmanBalance(),
  ]);

  return NextResponse.json({
    chain7331,
    chain7332,
    chairman,
    ts: new Date().toISOString(),
  });
}
