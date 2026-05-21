"use client";

/**
 * IpfsNodeHealth
 *
 * Displays live status of the local Kubo/IPFS node.
 * Polls /api/ipfs/health every 30 seconds.
 * Hidden automatically when IPFS is disabled server-side.
 */

import { useCallback, useEffect, useState } from "react";

interface NodeHealthData {
  ok: boolean;
  enabled: boolean;
  node: {
    peerId: string;
    agentVersion: string;
    protocolVersion: string;
    addresses: string[];
  } | null;
  repo: {
    repoSize: number;
    numObjects: number;
    storageMax: number;
    peerCount: number;
  } | null;
  error: string | null;
  ts: string;
}

function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${(bytes / Math.pow(k, i)).toFixed(1)} ${sizes[i]}`;
}

export function IpfsNodeHealth() {
  const [data, setData] = useState<NodeHealthData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchHealth = useCallback(async () => {
    try {
      const res = await fetch("/api/ipfs/health");
      const json = (await res.json()) as NodeHealthData;
      setData(json);
    } catch {
      setData({
        ok: false,
        enabled: false,
        node: null,
        repo: null,
        error: "Failed to reach /api/ipfs/health",
        ts: new Date().toISOString(),
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchHealth();
    const interval = setInterval(() => void fetchHealth(), 30_000);
    return () => clearInterval(interval);
  }, [fetchHealth]);

  if (loading) {
    return (
      <div className="bg-[#0D1B2A] border border-[#C9A84C]/20 rounded-lg p-5 animate-pulse">
        <div className="h-4 bg-slate-700/50 rounded w-32 mb-2" />
        <div className="h-3 bg-slate-700/30 rounded w-48" />
      </div>
    );
  }

  if (!data?.enabled) {
    return (
      <div className="bg-[#0D1B2A] border border-slate-700/40 rounded-lg p-5">
        <p className="text-[#C9A84C] text-xs font-mono uppercase tracking-widest mb-1">IPFS Node</p>
        <p className="text-slate-500 text-sm">Disabled — set IPFS_LOCAL_ENABLED=true to enable</p>
      </div>
    );
  }

  const dotColor = data.ok ? "bg-green-400" : "bg-red-400";
  const statusText = data.ok ? "Online" : "Offline";
  const statusTextColor = data.ok ? "text-green-400" : "text-red-400";

  return (
    <div className="bg-[#0D1B2A] border border-[#C9A84C]/20 rounded-lg p-5 flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <p className="text-[#C9A84C] text-xs font-mono uppercase tracking-widest">IPFS Node</p>
        <span className={`flex items-center gap-1.5 text-xs font-medium ${statusTextColor}`}>
          <span className={`inline-block w-2 h-2 rounded-full ${dotColor}`} />
          {statusText}
        </span>
      </div>

      {data.ok && data.node ? (
        <>
          {/* Peer ID */}
          <div>
            <p className="text-slate-500 text-[10px] uppercase tracking-wider mb-0.5">Peer ID</p>
            <p className="text-slate-300 text-xs font-mono truncate" title={data.node.peerId}>
              {data.node.peerId}
            </p>
          </div>

          {/* Stats grid */}
          {data.repo && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { label: "Peers", value: String(data.repo.peerCount) },
                { label: "Objects", value: String(data.repo.numObjects) },
                { label: "Repo Size", value: formatBytes(data.repo.repoSize) },
                { label: "Max Storage", value: formatBytes(data.repo.storageMax) },
              ].map(({ label, value }) => (
                <div key={label} className="bg-slate-800/50 rounded p-2.5 text-center">
                  <p className="text-slate-500 text-[10px] uppercase tracking-wider">{label}</p>
                  <p className="text-white text-sm font-semibold mt-0.5">{value}</p>
                </div>
              ))}
            </div>
          )}

          {/* Agent version */}
          <p className="text-slate-600 text-[10px] font-mono truncate">
            {data.node.agentVersion}
          </p>
        </>
      ) : (
        <p className="text-red-400 text-sm">{data?.error ?? "Node unreachable"}</p>
      )}
    </div>
  );
}
