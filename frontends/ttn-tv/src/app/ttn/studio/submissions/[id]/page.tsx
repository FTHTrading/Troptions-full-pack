import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  TTN_SUBMISSIONS,
  getSubmission,
  SUBMISSION_STATUS_LABELS,
  SUBMISSION_TYPE_LABELS,
  type SubmissionStatus,
} from "@/content/ttn/submissionRegistry";
import { ipfsUri, ipfsGatewayUrl } from "@/lib/troptions/ipfsService";

export async function generateStaticParams() {
  return TTN_SUBMISSIONS.map((s) => ({ id: s.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const sub = getSubmission(id);
  if (!sub) return { title: "Submission Not Found" };
  return { title: `${sub.title} — Submissions` };
}

const STATUS_COLORS: Record<SubmissionStatus, string> = {
  draft: "bg-gray-800 text-gray-300 border-gray-700",
  submitted: "bg-blue-900/60 text-blue-300 border-blue-800/50",
  under_review: "bg-yellow-900/60 text-yellow-300 border-yellow-800/50",
  approved: "bg-green-900/60 text-green-300 border-green-800/50",
  rejected: "bg-red-900/60 text-red-300 border-red-800/50",
  needs_rights_review: "bg-orange-900/60 text-orange-300 border-orange-800/50",
};

function FieldRow({ label, value }: { label: string; value?: string | number | null }) {
  if (value == null || value === "") return null;
  return (
    <div className="flex flex-col gap-0.5 py-3 border-b border-gray-800 last:border-0">
      <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-gray-500">{label}</span>
      <span className="text-sm text-gray-200">{String(value)}</span>
    </div>
  );
}

export default async function SubmissionDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const sub = getSubmission(id);
  if (!sub) notFound();

  const rightsColor = {
    missing: "text-red-400",
    pending: "text-yellow-400",
    verified: "text-green-400",
    rejected: "text-red-500",
  }[sub.rightsStatus];

  const ipfsColor = {
    not_created: "text-gray-500",
    pending: "text-yellow-400",
    pinned: "text-green-400",
    failed: "text-red-400",
  }[sub.ipfsStatus];

  const ipfsUriValue = sub.proofCid ? ipfsUri(sub.proofCid) : null;
  const ipfsGateway = sub.proofCid ? ipfsGatewayUrl(sub.proofCid) : null;

  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      {/* Breadcrumb */}
      <nav className="mb-8 text-[10px] uppercase tracking-[0.2em] text-gray-500">
        <Link href="/ttn/studio" className="hover:text-white transition-colors">Studio</Link>
        <span className="mx-2">/</span>
        <Link href="/ttn/studio/submissions" className="hover:text-white transition-colors">Submissions</Link>
        <span className="mx-2">/</span>
        <span className="text-white truncate max-w-[20ch]">{sub.id}</span>
      </nav>

      {/* Header */}
      <div className="mb-8">
        <div className="mb-3 flex flex-wrap items-center gap-3">
          <span className="rounded bg-gray-800 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-[0.2em] text-gray-300">
            {SUBMISSION_TYPE_LABELS[sub.type]}
          </span>
          <span className={`rounded-full border px-3 py-0.5 text-[10px] font-semibold uppercase tracking-[0.15em] ${STATUS_COLORS[sub.status]}`}>
            {SUBMISSION_STATUS_LABELS[sub.status]}
          </span>
        </div>
        <h1 className="text-2xl font-bold text-white">{sub.title}</h1>
        <p className="mt-2 text-sm text-gray-400 leading-relaxed">{sub.description}</p>
      </div>

      {/* Simulation badge */}
      <div className="mb-6 rounded-xl border border-yellow-800/40 bg-yellow-900/10 px-4 py-3">
        <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-yellow-400">
          Simulation Only — No content has been submitted, uploaded, or published.
        </p>
      </div>

      {/* Rights + IPFS status */}
      <div className="mb-6 grid grid-cols-2 gap-4">
        <div className="rounded-xl border border-gray-800 bg-[#0F1923] p-5">
          <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-gray-500">Rights Status</p>
          <p className={`text-sm font-semibold capitalize ${rightsColor}`}>{sub.rightsStatus}</p>
          {sub.rightsStatus === "missing" && (
            <p className="mt-2 text-[10px] text-red-400">
              ⚠️ Rights documents missing. Approval blocked.
            </p>
          )}
        </div>
        <div className="rounded-xl border border-gray-800 bg-[#0F1923] p-5">
          <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-gray-500">IPFS Status</p>
          <p className={`text-sm font-semibold capitalize ${ipfsColor}`}>{sub.ipfsStatus.replace("_", " ")}</p>
          {sub.ipfsStatus === "not_created" && (
            <p className="mt-2 text-[10px] text-gray-600">Proof record not yet created.</p>
          )}
        </div>
      </div>

      {/* IPFS Proof Section */}
      {sub.proofCid ? (
        <div className="mb-6 rounded-xl border border-gray-700 bg-[#0D1520] p-5">
          <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#C9A84C]">IPFS Proof Record</p>
          <div className="space-y-2">
            <div>
              <p className="text-[10px] text-gray-500 mb-1">CID</p>
              <p className="font-mono text-xs text-gray-300 break-all">{sub.proofCid}</p>
            </div>
            {ipfsUriValue && (
              <div>
                <p className="text-[10px] text-gray-500 mb-1">IPFS URI</p>
                <p className="font-mono text-xs text-gray-500 break-all">{ipfsUriValue}</p>
              </div>
            )}
            {ipfsGateway && (
              <div>
                <p className="text-[10px] text-gray-500 mb-1">Local Gateway (Simulation)</p>
                <p className="font-mono text-xs text-gray-600 break-all">{ipfsGateway}</p>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="mb-6 rounded-xl border border-gray-800 bg-[#0D1520] p-5">
          <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-gray-500">IPFS Proof Record</p>
          <p className="text-xs text-gray-600">
            No proof record has been created for this submission.
            Proof records require admin approval and rights verification before IPFS registration.
          </p>
          <p className="mt-2 text-[10px] text-gray-700">Simulation Only — IPFS registration is not active.</p>
        </div>
      )}

      {/* Metadata fields */}
      <div className="mb-6 rounded-xl border border-gray-800 bg-[#0F1923] p-5">
        <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.3em] text-gray-400">Submission Details</p>
        <div>
          <FieldRow label="Submission ID" value={sub.id} />
          <FieldRow label="Creator ID" value={sub.creatorId} />
          <FieldRow label="Type" value={SUBMISSION_TYPE_LABELS[sub.type]} />
          {/* Type-specific fields */}
          {"channelName" in sub && <FieldRow label="Channel Name" value={(sub as { channelName?: string }).channelName} />}
          {"channelCategory" in sub && <FieldRow label="Category" value={(sub as { channelCategory?: string }).channelCategory} />}
          {"proposedSchedule" in sub && <FieldRow label="Proposed Schedule" value={(sub as { proposedSchedule?: string }).proposedSchedule} />}
          {"channelId" in sub && <FieldRow label="Channel ID" value={(sub as { channelId?: string }).channelId} />}
          {"videoDuration" in sub && <FieldRow label="Duration" value={(sub as { videoDuration?: string }).videoDuration} />}
          {"episodeNumber" in sub && <FieldRow label="Episode Number" value={(sub as { episodeNumber?: number }).episodeNumber} />}
          {"audioDuration" in sub && <FieldRow label="Duration" value={(sub as { audioDuration?: string }).audioDuration} />}
          {"guestName" in sub && <FieldRow label="Guest" value={(sub as { guestName?: string }).guestName} />}
          {"runtime" in sub && <FieldRow label="Runtime" value={(sub as { runtime?: string }).runtime} />}
          {"productionYear" in sub && <FieldRow label="Production Year" value={(sub as { productionYear?: number }).productionYear} />}
          {"festivalTarget" in sub && <FieldRow label="Festival Target" value={(sub as { festivalTarget?: string }).festivalTarget} />}
          {"documentType" in sub && <FieldRow label="Document Type" value={(sub as { documentType?: string }).documentType} />}
          {"relatedContentId" in sub && <FieldRow label="Related Content" value={(sub as { relatedContentId?: string }).relatedContentId} />}
          <FieldRow label="Submitted" value={new Date(sub.createdAt).toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" })} />
          <FieldRow label="Last Updated" value={new Date(sub.updatedAt).toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" })} />
        </div>
      </div>

      {/* Review notes */}
      {sub.reviewNotes && (
        <div className="mb-6 rounded-xl border border-gray-700 bg-[#0D1520] p-5">
          <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-gray-400">Admin Notes</p>
          <p className="text-xs text-gray-300 leading-relaxed">{sub.reviewNotes}</p>
        </div>
      )}

      {/* Actions (all disabled) */}
      <div className="rounded-xl border border-gray-800 bg-[#0F1923] p-5">
        <p className="mb-4 text-[10px] font-semibold uppercase tracking-[0.3em] text-gray-400">Actions</p>
        <div className="flex flex-wrap gap-3">
          <button
            disabled
            className="cursor-not-allowed rounded-xl border border-gray-700 bg-[#080C14] px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.2em] text-gray-600"
          >
            Edit — Simulation Only
          </button>
          <button
            disabled
            className="cursor-not-allowed rounded-xl border border-gray-700 bg-[#080C14] px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.2em] text-gray-600"
          >
            Withdraw — Simulation Only
          </button>
          <button
            disabled
            className="cursor-not-allowed rounded-xl border border-gray-700 bg-[#080C14] px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.2em] text-gray-600"
          >
            Request Proof — Simulation Only
          </button>
        </div>
        <p className="mt-3 text-[10px] text-gray-600">
          All actions are disabled. Real submission management requires creator agreement and admin activation.
        </p>
      </div>
    </div>
  );
}
