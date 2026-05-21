import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { TTN_PROOF_RECORDS, getProofRecordByCid } from "@/content/ttn/proofRegistry";
import { TTN_CREATORS } from "@/content/ttn/creatorRegistry";

interface Props {
  params: Promise<{ cid: string }>;
}

export async function generateStaticParams() {
  return TTN_PROOF_RECORDS.map((r) => ({ cid: r.ipfsCid }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { cid } = await params;
  const record = getProofRecordByCid(cid);
  if (!record) return { title: "Proof Record Not Found" };
  return {
    title: `Proof: ${record.title}`,
    description: `IPFS proof record for ${record.title} (CID: ${record.ipfsCid})`,
  };
}

export default async function ProofRecordPage({ params }: Props) {
  const { cid } = await params;
  const record = getProofRecordByCid(cid);
  if (!record) notFound();

  const creator = TTN_CREATORS.find((c) => c.id === record.creatorId);

  const APPROVAL_BADGE = {
    approved: { label: "Approved", cls: "text-green-400 border-green-800 bg-green-900/20" },
    pending: { label: "Pending", cls: "text-yellow-400 border-yellow-800 bg-yellow-900/20" },
    rejected: { label: "Rejected", cls: "text-red-400 border-red-800 bg-red-900/20" },
    flagged: { label: "Flagged", cls: "text-orange-400 border-orange-800 bg-orange-900/20" },
    draft: { label: "Draft", cls: "text-gray-400 border-gray-700 bg-gray-800/20" },
  } as const;
  const badge = APPROVAL_BADGE[record.approvalStatus];

  const RIGHTS_LABELS: Record<string, string> = {
    signed: "Rights Agreement Signed",
    unsigned: "Not Signed",
    pending: "Pending Signature",
    disputed: "Disputed",
    "not-required": "Not Required",
  };

  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      {/* Breadcrumb */}
      <nav className="mb-8 text-[10px] uppercase tracking-[0.2em] text-gray-500">
        <Link href="/ttn/proof" className="hover:text-white transition-colors">Proof Registry</Link>
        <span className="mx-2">/</span>
        <span className="text-white font-mono">{record.ipfsCid.slice(0, 12)}…</span>
      </nav>

      {/* Header */}
      <div className="mb-8 flex flex-wrap items-center gap-2">
        <span className={`rounded border px-2 py-0.5 text-[9px] uppercase tracking-[0.12em] ${badge.cls}`}>
          {badge.label}
        </span>
        <span className="text-[10px] uppercase tracking-[0.1em] text-[#C9A84C]">
          {record.contentType.replace(/-/g, " ")}
        </span>
        <span className="rounded border border-gray-700 bg-gray-800/30 px-2 py-0.5 text-[9px] uppercase tracking-[0.1em] text-gray-500">
          Simulation Only
        </span>
      </div>

      <h1 className="mb-2 text-xl font-bold text-white">{record.title}</h1>
      {creator && (
        <Link href={`/ttn/creators/${creator.slug}`} className="mb-6 block text-xs text-gray-400 hover:text-white transition-colors">
          by {creator.name}
        </Link>
      )}

      {/* Proof data */}
      <div className="mb-8 space-y-4 rounded-2xl border border-[#C9A84C]/20 bg-[#0D1520] p-6">
        <div>
          <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.3em] text-[#C9A84C]">IPFS CID</p>
          <p className="font-mono text-sm text-white break-all">{record.ipfsCid}</p>
        </div>
        <div>
          <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.3em] text-gray-400">IPFS URI</p>
          <p className="font-mono text-xs text-gray-300 break-all">{record.ipfsUri}</p>
        </div>
        <div>
          <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.3em] text-gray-400">SHA-256 Hash</p>
          <p className="font-mono text-xs text-gray-300 break-all">{record.sha256Hash}</p>
        </div>
        <div>
          <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.3em] text-gray-400">Local Gateway</p>
          <p className="font-mono text-xs text-gray-500 break-all">{record.localGatewayUrl}</p>
        </div>
      </div>

      {/* Metadata */}
      <div className="mb-8 grid gap-4 rounded-xl border border-gray-800 bg-[#0F1923] p-6 sm:grid-cols-2">
        <div>
          <p className="mb-1 text-[10px] uppercase tracking-[0.2em] text-gray-500">Record ID</p>
          <p className="text-xs text-gray-300 font-mono">{record.id}</p>
        </div>
        <div>
          <p className="mb-1 text-[10px] uppercase tracking-[0.2em] text-gray-500">Content Reference</p>
          <p className="text-xs text-gray-300">{record.contentId}</p>
        </div>
        <div>
          <p className="mb-1 text-[10px] uppercase tracking-[0.2em] text-gray-500">Rights Document</p>
          <p className="text-xs text-gray-300">{RIGHTS_LABELS[record.rightsDocumentStatus] ?? record.rightsDocumentStatus}</p>
        </div>
        <div>
          <p className="mb-1 text-[10px] uppercase tracking-[0.2em] text-gray-500">Created</p>
          <p className="text-xs text-gray-300">
            {new Date(record.createdAt).toLocaleDateString("en-US", {
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
          </p>
        </div>
      </div>

      {record.notes && (
        <div className="mb-8 rounded-xl border border-gray-800 bg-[#0F1923] p-5">
          <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.3em] text-gray-400">Notes</p>
          <p className="text-sm text-gray-300 leading-relaxed">{record.notes}</p>
        </div>
      )}

      {/* Safety disclaimer */}
      <div className="rounded-xl border border-gray-800 bg-[#090E18] p-5">
        <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.3em] text-gray-500">Compliance Notice</p>
        <p className="text-[11px] text-gray-500 leading-relaxed">
          This proof record is an IPFS content fingerprint only.{" "}
          <strong className="text-gray-400">simulation_only: true</strong> —
          no live IPFS execution has been performed through this registry interface.{" "}
          <strong className="text-gray-400">live_execution_enabled: false</strong>.
          This record does not constitute a legal copyright registration, royalty entitlement,
          ownership certificate, or any financial instrument.
        </p>
      </div>

      <div className="mt-8">
        <Link href="/ttn/proof" className="text-xs uppercase tracking-[0.2em] text-gray-500 hover:text-white transition-colors">
          ← Back to Proof Registry
        </Link>
      </div>
    </div>
  );
}
