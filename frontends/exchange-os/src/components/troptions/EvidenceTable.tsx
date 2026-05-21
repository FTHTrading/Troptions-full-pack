"use client";

/**
 * EvidenceRecordRow
 *
 * Renders one evidence record in the evidence table.
 * Provides copy-CID, copy-ipfs://, and open-gateway buttons.
 */

import { useState } from "react";
import type { EvidenceRecord } from "@/lib/troptions/ipfsEvidenceRegistry";
import {
  EVIDENCE_CATEGORY_LABELS,
  EVIDENCE_STATUS_LABELS,
} from "@/lib/troptions/ipfsEvidenceRegistry";
import { StatusBadge } from "./StatusBadge";

interface Props {
  record: EvidenceRecord;
}

function CopyButton({ value, label }: { value: string; label: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* clipboard may be blocked in some contexts */
    }
  };

  return (
    <button
      onClick={() => void handleCopy()}
      className="text-[10px] px-2 py-0.5 rounded border border-slate-600/50 bg-slate-800/60
                 text-slate-400 hover:text-white hover:border-[#C9A84C]/50 transition-colors
                 font-mono whitespace-nowrap"
      title={`Copy ${label}`}
      aria-label={copied ? "Copied!" : `Copy ${label}`}
    >
      {copied ? "✓ copied" : label}
    </button>
  );
}

const STATUS_MAP: Record<string, string> = {
  draft: "pending",
  verified: "approved",
  archived: "evaluation",
};

export function EvidenceRecordRow({ record }: Props) {
  const badgeStatus = STATUS_MAP[record.status] ?? "pending";

  return (
    <tr className="border-b border-slate-700/30 hover:bg-slate-800/30 transition-colors">
      {/* Title + filename */}
      <td className="py-3 px-4">
        <p className="text-white text-sm font-medium">{record.title}</p>
        <p className="text-slate-500 text-[10px] font-mono mt-0.5">{record.sourceFileName}</p>
      </td>

      {/* Category */}
      <td className="py-3 px-4 text-slate-400 text-xs whitespace-nowrap">
        {EVIDENCE_CATEGORY_LABELS[record.category] ?? record.category}
      </td>

      {/* CID + actions */}
      <td className="py-3 px-4">
        <p
          className="text-[#C9A84C] text-xs font-mono truncate max-w-[140px]"
          title={record.cid}
        >
          {record.cid.slice(0, 12)}…{record.cid.slice(-6)}
        </p>
        <div className="flex flex-wrap gap-1 mt-1.5">
          <CopyButton value={record.cid} label="CID" />
          <CopyButton value={record.ipfsUri} label="ipfs://" />
          <a
            href={record.localGatewayUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[10px] px-2 py-0.5 rounded border border-slate-600/50 bg-slate-800/60
                       text-slate-400 hover:text-white hover:border-[#C9A84C]/50 transition-colors
                       font-mono whitespace-nowrap"
            title="Open in local IPFS gateway (http://127.0.0.1:8080)"
          >
            ↗ gateway
          </a>
        </div>
      </td>

      {/* Pin status */}
      <td className="py-3 px-4 text-center">
        {record.pinned ? (
          <span className="text-green-400 text-xs font-mono">pinned</span>
        ) : (
          <span className="text-slate-600 text-xs font-mono">—</span>
        )}
      </td>

      {/* Status */}
      <td className="py-3 px-4">
        <StatusBadge
          status={badgeStatus}
          label={EVIDENCE_STATUS_LABELS[record.status] ?? record.status}
          size="sm"
        />
      </td>

      {/* Date */}
      <td className="py-3 px-4 text-slate-500 text-[10px] font-mono whitespace-nowrap">
        {new Date(record.createdAt).toLocaleDateString()}
      </td>
    </tr>
  );
}

// ─── Table wrapper ────────────────────────────────────────────────────────────

interface TableProps {
  records: EvidenceRecord[];
}

export function EvidenceTable({ records }: TableProps) {
  if (records.length === 0) {
    return (
      <div className="bg-[#0D1B2A] border border-[#C9A84C]/20 rounded-lg p-8 text-center">
        <p className="text-slate-500 text-sm">No evidence records yet</p>
      </div>
    );
  }

  return (
    <div className="bg-[#0D1B2A] border border-[#C9A84C]/20 rounded-lg overflow-hidden">
      <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-700/30">
        <p className="text-[#C9A84C] text-xs font-mono uppercase tracking-widest">
          Evidence Registry
        </p>
        <span className="text-slate-500 text-xs">{records.length} record{records.length !== 1 ? "s" : ""}</span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-slate-700/30">
              {["Document", "Category", "CID / Actions", "Pinned", "Status", "Date"].map((h) => (
                <th
                  key={h}
                  className="py-2.5 px-4 text-slate-500 text-[10px] font-medium uppercase tracking-wider"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {records.map((r) => (
              <EvidenceRecordRow key={r.id} record={r} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
