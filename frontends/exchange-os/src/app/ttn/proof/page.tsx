import type { Metadata } from "next";
import Link from "next/link";
import { TTN_PROOF_RECORDS } from "@/content/ttn/proofRegistry";
import type { ProofRecord } from "@/content/ttn/proofRegistry";
import { TTN_CREATORS } from "@/content/ttn/creatorRegistry";

export const metadata: Metadata = {
  title: "Proof Registry",
  description: "IPFS content fingerprints and proof records for all TTN content.",
};

const APPROVAL_BADGE: Record<ProofRecord["approvalStatus"], { label: string; cls: string }> = {
  approved: { label: "Approved", cls: "text-green-400 border-green-800 bg-green-900/20" },
  pending: { label: "Pending", cls: "text-yellow-400 border-yellow-800 bg-yellow-900/20" },
  rejected: { label: "Rejected", cls: "text-red-400 border-red-800 bg-red-900/20" },
  flagged: { label: "Flagged", cls: "text-orange-400 border-orange-800 bg-orange-900/20" },
  draft: { label: "Draft", cls: "text-gray-400 border-gray-700 bg-gray-800/20" },
};

export default function ProofRegistryPage() {
  const approved = TTN_PROOF_RECORDS.filter((r) => r.approvalStatus === "approved");
  const pending = TTN_PROOF_RECORDS.filter((r) => r.approvalStatus === "pending");
  const others = TTN_PROOF_RECORDS.filter((r) => !["approved", "pending"].includes(r.approvalStatus));

  const ProofRow = ({ record }: { record: ProofRecord }) => {
    const badge = APPROVAL_BADGE[record.approvalStatus];
    const creator = TTN_CREATORS.find((c) => c.id === record.creatorId);
    return (
      <Link
        href={`/ttn/proof/${record.ipfsCid}`}
        className="group block rounded-xl border border-gray-800 bg-[#0F1923] p-5 transition-all hover:border-[#C9A84C]/30"
      >
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <span className={`rounded border px-2 py-0.5 text-[9px] uppercase tracking-[0.12em] ${badge.cls}`}>
            {badge.label}
          </span>
          <span className="text-[10px] uppercase tracking-[0.1em] text-[#C9A84C]">
            {record.contentType.replace(/-/g, " ")}
          </span>
          <span className="ml-auto text-[10px] text-gray-500 uppercase tracking-[0.1em]">Simulation only</span>
        </div>

        <h3 className="mb-1 text-sm font-medium text-white group-hover:text-[#C9A84C] transition-colors line-clamp-1">
          {record.title}
        </h3>

        {creator && (
          <p className="mb-2 text-[10px] text-gray-500">{creator.name}</p>
        )}

        <div className="space-y-1">
          <p className="font-mono text-[10px] text-gray-500 truncate">
            <span className="text-gray-600 mr-1">CID:</span>{record.ipfsCid}
          </p>
          <p className="font-mono text-[10px] text-gray-600 truncate">
            <span className="text-gray-700 mr-1">SHA:</span>{record.sha256Hash}
          </p>
        </div>
      </Link>
    );
  };

  return (
    <div className="mx-auto max-w-7xl px-6 py-16">
      {/* Header */}
      <div className="mb-8">
        <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.3em] text-[#C9A84C]">TTN Proof System</p>
        <h1 className="text-3xl font-bold text-white">Proof Registry</h1>
        <p className="mt-3 max-w-2xl text-sm text-gray-400">
          Content fingerprints for all TTN content — SHA-256 hashes and IPFS CIDs.
          Records are informational only; they are not legal copyright registrations.
        </p>
      </div>

      {/* Stats */}
      <div className="mb-10 flex flex-wrap gap-6 rounded-xl border border-gray-800 bg-[#0D1520] p-5">
        <div className="text-center">
          <p className="text-2xl font-bold text-[#C9A84C]">{TTN_PROOF_RECORDS.length}</p>
          <p className="text-[10px] uppercase tracking-[0.2em] text-gray-500">Total</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-green-400">{approved.length}</p>
          <p className="text-[10px] uppercase tracking-[0.2em] text-gray-500">Approved</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-yellow-400">{pending.length}</p>
          <p className="text-[10px] uppercase tracking-[0.2em] text-gray-500">Pending</p>
        </div>
        <div className="ml-auto flex items-center">
          <span className="rounded border border-gray-700 bg-gray-800/40 px-3 py-1.5 text-[10px] uppercase tracking-[0.15em] text-gray-400">
            All records: simulation only
          </span>
        </div>
      </div>

      {/* Approved */}
      {approved.length > 0 && (
        <div className="mb-10">
          <p className="mb-5 text-[10px] font-semibold uppercase tracking-[0.3em] text-green-400">Approved</p>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {approved.map((r) => <ProofRow key={r.id} record={r} />)}
          </div>
        </div>
      )}

      {/* Pending */}
      {pending.length > 0 && (
        <div className="mb-10">
          <p className="mb-5 text-[10px] font-semibold uppercase tracking-[0.3em] text-yellow-400">Pending Review</p>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {pending.map((r) => <ProofRow key={r.id} record={r} />)}
          </div>
        </div>
      )}

      {/* Others */}
      {others.length > 0 && (
        <div className="mb-10">
          <p className="mb-5 text-[10px] font-semibold uppercase tracking-[0.3em] text-gray-500">Other</p>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {others.map((r) => <ProofRow key={r.id} record={r} />)}
          </div>
        </div>
      )}

      {/* Disclaimer */}
      <div className="rounded-xl border border-gray-800 bg-[#0D1520] p-6">
        <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.3em] text-gray-500">Important Notice</p>
        <p className="text-xs text-gray-500 leading-relaxed">
          Proof records are IPFS content fingerprints only. They do not constitute legal copyright registration,
          royalty entitlement, ownership proof, or any financial instrument. All records in this registry
          are marked <strong className="text-gray-400">simulation_only: true</strong> — no live IPFS pinning
          is performed through this interface. Rights management requires a separate signed creator agreement.
        </p>
      </div>
    </div>
  );
}
