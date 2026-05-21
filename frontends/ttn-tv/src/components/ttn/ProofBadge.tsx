import type { ProofRecord } from "@/content/ttn/proofRegistry";
import Link from "next/link";

interface Props {
  record: ProofRecord;
  compact?: boolean;
}

const APPROVAL_BADGE: Record<ProofRecord["approvalStatus"], { label: string; cls: string }> = {
  approved: { label: "Approved", cls: "text-green-400 border-green-800 bg-green-900/20" },
  pending: { label: "Pending", cls: "text-yellow-400 border-yellow-800 bg-yellow-900/20" },
  rejected: { label: "Rejected", cls: "text-red-400 border-red-800 bg-red-900/20" },
  flagged: { label: "Flagged", cls: "text-orange-400 border-orange-800 bg-orange-900/20" },
  draft: { label: "Draft", cls: "text-gray-400 border-gray-700 bg-gray-800/30" },
};

export function ProofBadge({ record, compact }: Props) {
  const badge = APPROVAL_BADGE[record.approvalStatus];

  if (compact) {
    return (
      <Link
        href={`/ttn/proof/${record.ipfsCid}`}
        title={`Proof: ${record.title}`}
        className={`inline-flex items-center gap-1 rounded border px-2 py-0.5 text-[9px] uppercase tracking-[0.1em] transition-colors hover:brightness-110 ${badge.cls}`}
      >
        <span>⬡</span>
        <span>{badge.label}</span>
      </Link>
    );
  }

  return (
    <Link href={`/ttn/proof/${record.ipfsCid}`} className="group block">
      <div className="rounded-lg border border-gray-800 bg-[#0D1520] p-4 transition-all hover:border-[#C9A84C]/30">
        <div className="mb-2 flex items-center justify-between gap-2">
          <span className="text-[10px] uppercase tracking-[0.2em] text-[#C9A84C]">
            {record.contentType.replace(/-/g, " ")}
          </span>
          <span className={`rounded border px-1.5 py-0.5 text-[9px] uppercase tracking-[0.1em] ${badge.cls}`}>
            {badge.label}
          </span>
        </div>
        <p className="mb-2 text-xs font-medium text-white group-hover:text-[#C9A84C] transition-colors line-clamp-1">
          {record.title}
        </p>
        <p className="font-mono text-[10px] text-gray-500 truncate">
          {record.ipfsCid}
        </p>
        <div className="mt-2 flex items-center gap-2">
          <span className="text-[10px] text-gray-600 uppercase tracking-[0.1em]">Simulation only</span>
          <span className="h-1 w-1 rounded-full bg-gray-600" />
          <span className="text-[10px] text-gray-600">
            {new Date(record.createdAt).toLocaleDateString("en-US", {
              month: "short",
              year: "numeric",
            })}
          </span>
        </div>
      </div>
    </Link>
  );
}
