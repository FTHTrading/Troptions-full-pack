/**
 * GET /api/ipfs/health
 *
 * Health check for the local Kubo/IPFS node.
 * Returns node identity, peer count, and repo stats.
 *
 * ╔═══════════════════════════════════════════════════════════╗
 * ║  This route proxies to 127.0.0.1:5001 (local only).      ║
 * ║  Do NOT expose port 5001 publicly. Safe: gateway :8080.   ║
 * ╚═══════════════════════════════════════════════════════════╝
 */
import { NextResponse } from "next/server";
import { ipfsHealthCheck, ipfsRepoStats } from "@/lib/troptions/ipfsService";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const [health, stats] = await Promise.all([
    ipfsHealthCheck(),
    ipfsRepoStats(),
  ]);

  const status = health.ok ? 200 : 503;

  return NextResponse.json(
    {
      ok: health.ok,
      enabled: process.env.IPFS_LOCAL_ENABLED === "true",
      node: health.ok
        ? {
            peerId: health.peerId,
            agentVersion: health.agentVersion,
            protocolVersion: health.protocolVersion,
            addresses: health.addresses,
          }
        : null,
      repo: stats.ok
        ? {
            repoSize: stats.repoSize,
            numObjects: stats.numObjects,
            storageMax: stats.storageMax,
            peerCount: stats.peerCount,
          }
        : null,
      error: health.error ?? stats.error ?? null,
      ts: new Date().toISOString(),
    },
    { status },
  );
}
