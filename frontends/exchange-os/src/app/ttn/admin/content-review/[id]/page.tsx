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
  return { title: `Admin Review — ${sub.title}` };
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

export default async function AdminSubmissionDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const sub = getSubmission(id);
  if (!sub) notFound();

  const rightsWarning = sub.rightsStatus === "missing" || sub.rightsStatus === "rejected";

  const ipfsUriValue = sub.proofCid ? ipfsUri(sub.proofCid) : null;
  const ipfsGateway = sub.proofCid ? ipfsGatewayUrl(sub.proofCid) : null;

  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      {/* Breadcrumb */}
      <nav className="mb-8 text-[10px] uppercase tracking-[0.2em] text-gray-500">
        <Link href="/ttn/admin" className="hover:text-white transition-colors">Admin</Link>
        <span className="mx-2">/</span>
        <Link href="/ttn/admin/content-review" className="hover:text-white transition-colors">Content Review</Link>
        <span className="mx-2">/</span>
        <span className="text-white">{sub.id}</span>
      </nav>

      {/* Admin banner */}
      <div className="mb-6 rounded-xl border border-red-800/40 bg-red-900/10 px-4 py-3">
        <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-red-400">
          Admin View — Simulation Only — No actions will be saved.
        </p>
      </div>

      {/* Rights warning */}
      {rightsWarning && (
        <div className="mb-6 rounded-xl border border-orange-800/50 bg-orange-900/10 px-5 py-4">
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-orange-400 mb-1">
            Rights Review Blocked
          </p>
          <p className="text-sm text-orange-300/80">
            {sub.rightsStatus === "missing"
              ? "Rights documents are missing. Approval is blocked until verified."
              : "Rights documents were rejected. Creator must re-submit before approval."}
          </p>
        </div>
      )}

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

      {/* Creator + rights + IPFS status */}
      <div className="mb-6 grid grid-cols-3 gap-3">
        <div className="rounded-xl border border-gray-800 bg-[#0F1923] p-4">
          <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-gray-500">Creator</p>
          <Link
            href={`/ttn/creators/${sub.creatorId}`}
            className="text-sm font-medium text-[#C9A84C] hover:underline"
          >
            {sub.creatorId}
          </Link>
        </div>
        <div className="rounded-xl border border-gray-800 bg-[#0F1923] p-4">
          <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-gray-500">Rights</p>
          <p className={`text-sm font-semibold capitalize ${
            sub.rightsStatus === "verified" ? "text-green-400" :
            sub.rightsStatus === "pending" ? "text-yellow-400" : "text-red-400"
          }`}>{sub.rightsStatus}</p>
        </div>
        <div className="rounded-xl border border-gray-800 bg-[#0F1923] p-4">
          <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-gray-500">IPFS</p>
          <p className={`text-sm font-semibold ${
            sub.ipfsStatus === "pinned" ? "text-green-400" :
            sub.ipfsStatus === "pending" ? "text-yellow-400" :
            sub.ipfsStatus === "failed" ? "text-red-400" : "text-gray-500"
          }`}>{sub.ipfsStatus.replace("_", " ")}</p>
        </div>
      </div>

      {/* IPFS proof */}
      {sub.proofCid ? (
        <div className="mb-6 rounded-xl border border-gray-700 bg-[#0D1520] p-5">
          <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#C9A84C]">IPFS Proof Record</p>
          <FieldRow label="CID" value={sub.proofCid} />
          {ipfsUriValue && <FieldRow label="IPFS URI" value={ipfsUriValue} />}
          {ipfsGateway && <FieldRow label="Local Gateway" value={ipfsGateway} />}
          <div className="mt-3 pt-3 border-t border-gray-700">
            <Link
              href={`/ttn/proof/${sub.proofCid}`}
              className="text-xs font-semibold uppercase tracking-[0.2em] text-[#C9A84C] hover:underline"
            >
              View Proof Record →
            </Link>
          </div>
        </div>
      ) : (
        <div className="mb-6 rounded-xl border border-gray-800 bg-[#0D1520] p-5">
          <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-gray-500">IPFS Proof Record</p>
          <p className="text-xs text-gray-600">No proof record created yet.</p>
        </div>
      )}

      {/* Submission fields */}
      <div className="mb-6 rounded-xl border border-gray-800 bg-[#0F1923] p-5">
        <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.3em] text-gray-400">Submission Fields</p>
        <FieldRow label="ID" value={sub.id} />
        <FieldRow label="Creator ID" value={sub.creatorId} />
        <FieldRow label="Type" value={SUBMISSION_TYPE_LABELS[sub.type]} />
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
        <FieldRow label="Submitted" value={new Date(sub.createdAt).toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" })} />
        <FieldRow label="Updated" value={new Date(sub.updatedAt).toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" })} />
      </div>

      {/* Admin notes (disabled) */}
      <div className="mb-6 rounded-xl border border-gray-800 bg-[#0F1923] p-5">
        <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.3em] text-gray-400">Admin Notes</p>
        {sub.reviewNotes ? (
          <p className="text-sm text-gray-300 leading-relaxed mb-4">{sub.reviewNotes}</p>
        ) : (
          <p className="text-xs text-gray-600 mb-4">No notes on this submission.</p>
        )}
        <textarea
          disabled
          rows={3}
          placeholder="Add admin notes… (Simulation Only)"
          className="w-full cursor-not-allowed resize-none rounded-lg border border-gray-700 bg-[#080C14] px-4 py-3 text-sm text-gray-600 placeholder-gray-700"
        />
      </div>

      {/* Admin actions (all disabled) */}
      <div className="rounded-xl border border-gray-800 bg-[#0F1923] p-5">
        <p className="mb-4 text-[10px] font-semibold uppercase tracking-[0.3em] text-gray-400">Admin Actions</p>
        <div className="flex flex-wrap gap-3">
          <button
            disabled
            className="cursor-not-allowed rounded-xl border border-green-800/50 bg-green-900/10 px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.2em] text-green-700"
          >
            Approve — Simulation Only
          </button>
          <button
            disabled
            className="cursor-not-allowed rounded-xl border border-red-800/50 bg-red-900/10 px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.2em] text-red-700"
          >
            Reject — Simulation Only
          </button>
          <button
            disabled
            className="cursor-not-allowed rounded-xl border border-gray-700 bg-[#080C14] px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.2em] text-gray-600"
          >
            Request Rights Docs — Simulation Only
          </button>
          <button
            disabled
            className="cursor-not-allowed rounded-xl border border-gray-700 bg-[#080C14] px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.2em] text-gray-600"
          >
            Create IPFS Proof — Simulation Only
          </button>
        </div>
        <p className="mt-4 text-[10px] text-gray-600">
          All admin actions are disabled. Live admin functionality requires authentication and a production database.
        </p>
      </div>
    </div>
  );
}
