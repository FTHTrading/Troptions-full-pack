"use client";

/**
 * IpfsDashboard
 *
 * Full IPFS dashboard panel: node health + evidence table + pinned CID list.
 * Shown only when IPFS_LOCAL_ENABLED=true is reflected from the health endpoint.
 */

import { useCallback, useEffect, useState } from "react";
import { IpfsNodeHealth } from "./IpfsNodeHealth";
import { EvidenceTable } from "./EvidenceTable";
import type { EvidenceRecord } from "@/lib/troptions/ipfsEvidenceRegistry";

interface PinnedCid {
  cid: string;
}

function PinnedCidList({ cids }: { cids: PinnedCid[] }) {
  const [copied, setCopied] = useState<string | null>(null);

  const copy = async (cid: string) => {
    try {
      await navigator.clipboard.writeText(cid);
      setCopied(cid);
      setTimeout(() => setCopied(null), 1800);
    } catch {
      /* blocked */
    }
  };

  if (cids.length === 0) {
    return (
      <div className="bg-[#0D1B2A] border border-[#C9A84C]/20 rounded-lg p-5">
        <p className="text-[#C9A84C] text-xs font-mono uppercase tracking-widest mb-2">
          Pinned CIDs
        </p>
        <p className="text-slate-500 text-sm">No pinned CIDs in this session</p>
      </div>
    );
  }

  return (
    <div className="bg-[#0D1B2A] border border-[#C9A84C]/20 rounded-lg p-5">
      <p className="text-[#C9A84C] text-xs font-mono uppercase tracking-widest mb-3">
        Pinned CIDs ({cids.length})
      </p>
      <ul className="flex flex-col gap-2">
        {cids.map(({ cid }) => (
          <li
            key={cid}
            className="flex items-center justify-between gap-3 bg-slate-800/40 rounded px-3 py-2"
          >
            <span className="text-slate-300 text-xs font-mono truncate" title={cid}>
              {cid}
            </span>
            <div className="flex gap-1 shrink-0">
              <button
                onClick={() => void copy(cid)}
                className="text-[10px] px-2 py-0.5 rounded border border-slate-600/50 bg-slate-800/60
                           text-slate-400 hover:text-white transition-colors font-mono"
              >
                {copied === cid ? "✓" : "copy"}
              </button>
              <a
                href={`http://127.0.0.1:8080/ipfs/${cid}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[10px] px-2 py-0.5 rounded border border-slate-600/50 bg-slate-800/60
                           text-slate-400 hover:text-white transition-colors font-mono"
                title="Open in local gateway"
              >
                ↗
              </a>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

// ─── Main dashboard ───────────────────────────────────────────────────────────

interface IpfsDashboardProps {
  /**
   * Evidence records to display. In a real app these would come from your
   * database/API. Pass an empty array to render the empty state.
   */
  evidenceRecords?: EvidenceRecord[];
  /** Pinned CIDs to display in the quick-pin list */
  pinnedCids?: PinnedCid[];
}

export function IpfsDashboard({
  evidenceRecords = [],
  pinnedCids = [],
}: IpfsDashboardProps) {
  const [enabled, setEnabled] = useState<boolean | null>(null);

  const checkEnabled = useCallback(async () => {
    try {
      const res = await fetch("/api/ipfs/health");
      const data = (await res.json()) as { enabled?: boolean };
      setEnabled(data.enabled ?? false);
    } catch {
      setEnabled(false);
    }
  }, []);

  useEffect(() => {
    void checkEnabled();
  }, [checkEnabled]);

  // Don't render anything until we know the enabled state
  if (enabled === null) return null;

  if (!enabled) {
    return (
      <div className="bg-[#0D1B2A] border border-slate-700/40 rounded-lg p-6">
        <p className="text-[#C9A84C] text-xs font-mono uppercase tracking-widest mb-2">
          IPFS Dashboard
        </p>
        <p className="text-slate-500 text-sm">
          IPFS integration is disabled.{" "}
          <span className="font-mono text-slate-400">IPFS_LOCAL_ENABLED=true</span>{" "}
          must be set in your environment to activate this panel.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Node health */}
      <IpfsNodeHealth />

      {/* Evidence table */}
      <EvidenceTable records={evidenceRecords} />

      {/* Pinned CID list */}
      <PinnedCidList cids={pinnedCids} />
    </div>
  );
}
