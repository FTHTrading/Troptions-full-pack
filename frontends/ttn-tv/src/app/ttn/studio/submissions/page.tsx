import type { Metadata } from "next";
import Link from "next/link";
import {
  TTN_SUBMISSIONS,
  SUBMISSION_STATUS_LABELS,
  SUBMISSION_TYPE_LABELS,
  type SubmissionStatus,
  type Submission,
} from "@/content/ttn/submissionRegistry";

export const metadata: Metadata = {
  title: "My Submissions — Creator Studio",
  description: "Review and track all your content submissions to TTN.",
};

const STATUS_COLORS: Record<SubmissionStatus, string> = {
  draft: "bg-gray-800 text-gray-300",
  submitted: "bg-blue-900/60 text-blue-300",
  under_review: "bg-yellow-900/60 text-yellow-300",
  approved: "bg-green-900/60 text-green-300",
  rejected: "bg-red-900/60 text-red-300",
  needs_rights_review: "bg-orange-900/60 text-orange-300",
};

const STATUS_ORDER: SubmissionStatus[] = [
  "under_review",
  "needs_rights_review",
  "submitted",
  "draft",
  "approved",
  "rejected",
];

function groupByStatus(submissions: Submission[]): Map<SubmissionStatus, Submission[]> {
  const map = new Map<SubmissionStatus, Submission[]>();
  for (const status of STATUS_ORDER) {
    const group = submissions.filter((s) => s.status === status);
    if (group.length > 0) map.set(status, group);
  }
  return map;
}

function RightsDot({ status }: { status: Submission["rightsStatus"] }) {
  const colors = {
    missing: "bg-red-500",
    pending: "bg-yellow-500",
    verified: "bg-green-500",
    rejected: "bg-red-700",
  };
  return (
    <span className={`inline-block h-2 w-2 rounded-full ${colors[status]}`} title={`Rights: ${status}`} />
  );
}

function IpfsDot({ status }: { status: Submission["ipfsStatus"] }) {
  const colors = {
    not_created: "bg-gray-600",
    pending: "bg-yellow-500",
    pinned: "bg-green-500",
    failed: "bg-red-500",
  };
  const labels = {
    not_created: "IPFS: not created",
    pending: "IPFS: pending",
    pinned: "IPFS: pinned",
    failed: "IPFS: failed",
  };
  return (
    <span className={`inline-block h-2 w-2 rounded-full ${colors[status]}`} title={labels[status]} />
  );
}

export default function SubmissionsListPage() {
  const grouped = groupByStatus(TTN_SUBMISSIONS);
  const total = TTN_SUBMISSIONS.length;

  return (
    <div className="mx-auto max-w-4xl px-6 py-16">
      {/* Breadcrumb */}
      <nav className="mb-8 text-[10px] uppercase tracking-[0.2em] text-gray-500">
        <Link href="/ttn/studio" className="hover:text-white transition-colors">Studio</Link>
        <span className="mx-2">/</span>
        <span className="text-white">Submissions</span>
      </nav>

      {/* Banner */}
      <div className="mb-8 rounded-xl border border-yellow-800/50 bg-yellow-900/10 p-4">
        <p className="text-xs font-semibold text-yellow-400 uppercase tracking-[0.2em] mb-1">Simulation Only</p>
        <p className="text-xs text-yellow-300/80">
          These are simulated submissions. No real content has been submitted, uploaded, or published.
        </p>
      </div>

      <div className="mb-8 flex items-start justify-between gap-4">
        <div>
          <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.3em] text-[#C9A84C]">Creator Studio</p>
          <h1 className="text-2xl font-bold text-white">My Submissions</h1>
          <p className="mt-1 text-sm text-gray-400">{total} total submission{total !== 1 ? "s" : ""}</p>
        </div>
        <Link
          href="/ttn/studio/submit"
          className="rounded-xl border border-gray-700 bg-[#0F1923] px-4 py-2.5 text-xs font-semibold uppercase tracking-[0.2em] text-gray-400 hover:border-[#C9A84C]/30 hover:text-white transition-all"
        >
          + New Submission
        </Link>
      </div>

      {/* Legend */}
      <div className="mb-6 flex flex-wrap gap-4 rounded-xl border border-gray-800 bg-[#0D1520] px-5 py-3">
        <div className="flex items-center gap-1.5 text-[10px] text-gray-500">
          <RightsDot status="missing" /> Rights missing
        </div>
        <div className="flex items-center gap-1.5 text-[10px] text-gray-500">
          <RightsDot status="pending" /> Rights pending
        </div>
        <div className="flex items-center gap-1.5 text-[10px] text-gray-500">
          <RightsDot status="verified" /> Rights verified
        </div>
        <div className="mx-2 border-l border-gray-700" />
        <div className="flex items-center gap-1.5 text-[10px] text-gray-500">
          <IpfsDot status="not_created" /> IPFS not created
        </div>
        <div className="flex items-center gap-1.5 text-[10px] text-gray-500">
          <IpfsDot status="pending" /> IPFS pending
        </div>
        <div className="flex items-center gap-1.5 text-[10px] text-gray-500">
          <IpfsDot status="pinned" /> IPFS pinned
        </div>
      </div>

      {/* Groups */}
      {Array.from(grouped.entries()).map(([status, submissions]) => (
        <div key={status} className="mb-8">
          <div className="mb-3 flex items-center gap-3">
            <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.15em] ${STATUS_COLORS[status]}`}>
              {SUBMISSION_STATUS_LABELS[status]}
            </span>
            <span className="text-[10px] text-gray-600">{submissions.length}</span>
          </div>

          <div className="divide-y divide-gray-800 rounded-xl border border-gray-800 bg-[#0F1923] overflow-hidden">
            {submissions.map((sub) => (
              <Link
                key={sub.id}
                href={`/ttn/studio/submissions/${sub.id}`}
                className="flex items-start justify-between gap-4 px-5 py-4 hover:bg-[#131e2d] transition-colors"
              >
                <div className="min-w-0 flex-1">
                  <div className="mb-1 flex items-center gap-2">
                    <span className="rounded bg-gray-800 px-1.5 py-0.5 text-[9px] uppercase tracking-[0.15em] text-gray-400">
                      {SUBMISSION_TYPE_LABELS[sub.type]}
                    </span>
                    <div className="flex items-center gap-1.5">
                      <RightsDot status={sub.rightsStatus} />
                      <IpfsDot status={sub.ipfsStatus} />
                    </div>
                  </div>
                  <p className="truncate text-sm font-medium text-white">{sub.title}</p>
                  <p className="mt-0.5 text-[10px] text-gray-500">
                    Updated {new Date(sub.updatedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                  </p>
                </div>
                <span className="mt-0.5 shrink-0 text-[10px] text-gray-600 group-hover:text-gray-400">→</span>
              </Link>
            ))}
          </div>
        </div>
      ))}

      {TTN_SUBMISSIONS.length === 0 && (
        <div className="rounded-xl border border-gray-800 bg-[#0F1923] p-10 text-center">
          <p className="text-gray-500">No submissions yet.</p>
          <Link href="/ttn/studio/submit" className="mt-4 inline-block text-xs text-[#C9A84C] underline-offset-4 hover:underline">
            Submit your first piece of content
          </Link>
        </div>
      )}
    </div>
  );
}
