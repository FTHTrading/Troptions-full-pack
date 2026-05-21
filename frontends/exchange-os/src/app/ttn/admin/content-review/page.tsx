import type { Metadata } from "next";
import Link from "next/link";
import { TTN_VIDEOS } from "@/content/ttn/videoRegistry";
import { TTN_BLOG_POSTS } from "@/content/ttn/blogRegistry";
import { TTN_FILMS } from "@/content/ttn/filmRegistry";
import { TTN_PROOF_RECORDS } from "@/content/ttn/proofRegistry";
import { TTN_CREATORS } from "@/content/ttn/creatorRegistry";
import {
  TTN_SUBMISSIONS,
  getSubmissionsByType,
  getSubmissionsNeedingRights,
  getSubmissionsNeedingProof,
  SUBMISSION_STATUS_LABELS,
  SUBMISSION_TYPE_LABELS,
  type SubmissionStatus,
} from "@/content/ttn/submissionRegistry";

export const metadata: Metadata = {
  title: "Admin — Content Review",
  description: "TTN content review and approval hub.",
};

const STATUS_COLORS: Record<SubmissionStatus, string> = {
  draft: "bg-gray-800 text-gray-300",
  submitted: "bg-blue-900/60 text-blue-300",
  under_review: "bg-yellow-900/60 text-yellow-300",
  approved: "bg-green-900/60 text-green-300",
  rejected: "bg-red-900/60 text-red-300",
  needs_rights_review: "bg-orange-900/60 text-orange-300",
};

type AdminTab = "all" | "videos" | "blogs" | "podcasts" | "films" | "channels" | "rights" | "ipfs";

const TABS: { id: AdminTab; label: string }[] = [
  { id: "all", label: "All" },
  { id: "videos", label: "Videos" },
  { id: "blogs", label: "Blogs" },
  { id: "podcasts", label: "Podcasts" },
  { id: "films", label: "Films" },
  { id: "channels", label: "Channels" },
  { id: "rights", label: "Rights Review" },
  { id: "ipfs", label: "IPFS Proof" },
];

export default async function AdminContentReviewPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  const { tab: rawTab } = await searchParams;
  const activeTab: AdminTab = (TABS.some((t) => t.id === rawTab) ? rawTab : "all") as AdminTab;

  const pendingVideos = TTN_VIDEOS.filter((v) => v.status === "draft" || v.status === "pending-review");
  const pendingBlogs = TTN_BLOG_POSTS.filter((p) => p.status === "draft");
  const pendingFilms = TTN_FILMS.filter((f) => f.status === "pending-review");
  const pendingProofs = TTN_PROOF_RECORDS.filter((r) => r.approvalStatus === "pending");
  const pendingCreators = TTN_CREATORS.filter((c) => c.status === "pending");

  const submissionVideos = getSubmissionsByType("video");
  const submissionBlogs = getSubmissionsByType("blog");
  const submissionPodcasts = getSubmissionsByType("podcast-episode");
  const submissionFilms = getSubmissionsByType("film");
  const submissionChannels = getSubmissionsByType("channel-application");
  const needsRights = getSubmissionsNeedingRights();
  const needsIpfs = getSubmissionsNeedingProof();

  return (
    <div className="mx-auto max-w-5xl px-6 py-16">
      {/* Admin banner */}
      <div className="mb-8 rounded-xl border border-red-800/40 bg-red-900/10 p-5">
        <p className="text-xs font-semibold text-red-400 uppercase tracking-[0.2em] mb-1">Admin Access Required</p>
        <p className="text-sm text-red-300/70">
          Admin features are disabled in this environment. Simulation only. All approve/reject actions are non-functional.
        </p>
      </div>

      <div className="mb-8">
        <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.3em] text-[#C9A84C]">Admin</p>
        <h1 className="text-3xl font-bold text-white">Content Review Hub</h1>
        <p className="mt-3 text-sm text-gray-400">
          Review and approve pending content submissions across all TTN content types.
        </p>
      </div>

      {/* Stats grid */}
      <div className="mb-8 grid grid-cols-3 gap-3 sm:grid-cols-6">
        {[
          { label: "Videos", count: pendingVideos.length, color: "text-blue-400" },
          { label: "Blogs", count: pendingBlogs.length, color: "text-green-400" },
          { label: "Films", count: pendingFilms.length, color: "text-purple-400" },
          { label: "Proof Records", count: pendingProofs.length, color: "text-[#C9A84C]" },
          { label: "Creators", count: pendingCreators.length, color: "text-pink-400" },
          { label: "Submissions", count: TTN_SUBMISSIONS.length, color: "text-cyan-400" },
        ].map(({ label, count, color }) => (
          <div key={label} className="rounded-xl border border-gray-800 bg-[#0F1923] p-4 text-center">
            <p className={`text-2xl font-bold ${color}`}>{count}</p>
            <p className="text-[10px] uppercase tracking-[0.2em] text-gray-500">{label}</p>
          </div>
        ))}
      </div>

      {/* Tab bar */}
      <div className="mb-8 flex flex-wrap gap-1 rounded-xl border border-gray-800 bg-[#0D1520] p-1">
        {TABS.map((tab) => {
          const isActive = tab.id === activeTab;
          return (
            <Link
              key={tab.id}
              href={`/ttn/admin/content-review?tab=${tab.id}`}
              className={`rounded-lg px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.15em] transition-all ${
                isActive
                  ? "bg-[#0F1923] text-white"
                  : "text-gray-500 hover:text-gray-300"
              }`}
            >
              {tab.label}
            </Link>
          );
        })}
      </div>

      {/* ── All / Legacy content queues ── */}
      {(activeTab === "all" || activeTab === "videos") && pendingVideos.length > 0 && (
        <section className="mb-8">
          <h2 className="mb-4 text-[10px] font-semibold uppercase tracking-[0.3em] text-blue-400">
            Pending Videos ({pendingVideos.length})
          </h2>
          <div className="divide-y divide-gray-800 rounded-xl border border-gray-800 bg-[#0F1923] overflow-hidden">
            {pendingVideos.map((v) => (
              <div key={v.id} className="flex items-center gap-4 px-5 py-4">
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-white">{v.title}</p>
                  <p className="text-[10px] text-gray-500 capitalize">{v.status.replace(/-/g, " ")}</p>
                </div>
                <div className="flex shrink-0 gap-2">
                  <Link href={`/ttn/videos/${v.slug ?? v.id}`} className="rounded border border-gray-700 px-3 py-1.5 text-[9px] font-semibold uppercase tracking-[0.1em] text-gray-400 hover:text-white transition-colors">View</Link>
                  <button disabled className="cursor-not-allowed rounded border border-green-800/50 bg-green-900/10 px-3 py-1.5 text-[9px] font-semibold uppercase tracking-[0.1em] text-green-600">Approve</button>
                  <button disabled className="cursor-not-allowed rounded border border-red-800/50 bg-red-900/10 px-3 py-1.5 text-[9px] font-semibold uppercase tracking-[0.1em] text-red-600">Reject</button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {(activeTab === "all" || activeTab === "blogs") && pendingBlogs.length > 0 && (
        <section className="mb-8">
          <h2 className="mb-4 text-[10px] font-semibold uppercase tracking-[0.3em] text-green-400">
            Pending Blog Posts ({pendingBlogs.length})
          </h2>
          <div className="divide-y divide-gray-800 rounded-xl border border-gray-800 bg-[#0F1923] overflow-hidden">
            {pendingBlogs.map((post) => (
              <div key={post.id} className="flex items-center gap-4 px-5 py-4">
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-white">{post.title}</p>
                  <p className="text-[10px] text-gray-500 capitalize">{post.category} · {post.readingTimeMinutes} min read</p>
                </div>
                <div className="flex shrink-0 gap-2">
                  <button disabled className="cursor-not-allowed rounded border border-green-800/50 bg-green-900/10 px-3 py-1.5 text-[9px] font-semibold uppercase tracking-[0.1em] text-green-600">Publish</button>
                  <button disabled className="cursor-not-allowed rounded border border-red-800/50 bg-red-900/10 px-3 py-1.5 text-[9px] font-semibold uppercase tracking-[0.1em] text-red-600">Reject</button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {(activeTab === "all" || activeTab === "films") && pendingFilms.length > 0 && (
        <section className="mb-8">
          <h2 className="mb-4 text-[10px] font-semibold uppercase tracking-[0.3em] text-purple-400">
            Pending Films ({pendingFilms.length})
          </h2>
          <div className="divide-y divide-gray-800 rounded-xl border border-gray-800 bg-[#0F1923] overflow-hidden">
            {pendingFilms.map((film) => (
              <div key={film.id} className="flex items-start gap-4 px-5 py-4">
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-white">{film.title}</p>
                  <p className="text-[10px] text-gray-500">{film.runtime} · {film.genre.join(", ")}</p>
                </div>
                <div className="flex shrink-0 gap-2">
                  <Link href={`/ttn/films/${film.slug}`} className="rounded border border-gray-700 px-3 py-1.5 text-[9px] font-semibold uppercase tracking-[0.1em] text-gray-400 hover:text-white transition-colors">View</Link>
                  <button disabled className="cursor-not-allowed rounded border border-green-800/50 bg-green-900/10 px-3 py-1.5 text-[9px] font-semibold uppercase tracking-[0.1em] text-green-600">Approve</button>
                  <button disabled className="cursor-not-allowed rounded border border-red-800/50 bg-red-900/10 px-3 py-1.5 text-[9px] font-semibold uppercase tracking-[0.1em] text-red-600">Reject</button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── Submission queues (Phase 22) ── */}
      {(activeTab === "all" || activeTab === "videos") && submissionVideos.length > 0 && (
        <section className="mb-8">
          <h2 className="mb-4 text-[10px] font-semibold uppercase tracking-[0.3em] text-blue-400">
            Video Submissions ({submissionVideos.length})
          </h2>
          <SubmissionTable items={submissionVideos} statusColors={STATUS_COLORS} />
        </section>
      )}

      {(activeTab === "all" || activeTab === "blogs") && submissionBlogs.length > 0 && (
        <section className="mb-8">
          <h2 className="mb-4 text-[10px] font-semibold uppercase tracking-[0.3em] text-green-400">
            Blog Submissions ({submissionBlogs.length})
          </h2>
          <SubmissionTable items={submissionBlogs} statusColors={STATUS_COLORS} />
        </section>
      )}

      {(activeTab === "all" || activeTab === "podcasts") && submissionPodcasts.length > 0 && (
        <section className="mb-8">
          <h2 className="mb-4 text-[10px] font-semibold uppercase tracking-[0.3em] text-purple-400">
            Podcast Submissions ({submissionPodcasts.length})
          </h2>
          <SubmissionTable items={submissionPodcasts} statusColors={STATUS_COLORS} />
        </section>
      )}

      {(activeTab === "all" || activeTab === "films") && submissionFilms.length > 0 && (
        <section className="mb-8">
          <h2 className="mb-4 text-[10px] font-semibold uppercase tracking-[0.3em] text-orange-400">
            Film Submissions ({submissionFilms.length})
          </h2>
          <SubmissionTable items={submissionFilms} statusColors={STATUS_COLORS} />
        </section>
      )}

      {(activeTab === "all" || activeTab === "channels") && submissionChannels.length > 0 && (
        <section className="mb-8">
          <h2 className="mb-4 text-[10px] font-semibold uppercase tracking-[0.3em] text-[#C9A84C]">
            Channel Applications ({submissionChannels.length})
          </h2>
          <SubmissionTable items={submissionChannels} statusColors={STATUS_COLORS} />
        </section>
      )}

      {activeTab === "rights" && (
        <section className="mb-8">
          <h2 className="mb-4 text-[10px] font-semibold uppercase tracking-[0.3em] text-orange-400">
            Submissions Needing Rights Review ({needsRights.length})
          </h2>
          {needsRights.length === 0 ? (
            <EmptyState message="No submissions are pending rights review." />
          ) : (
            <SubmissionTable items={needsRights} statusColors={STATUS_COLORS} showRights />
          )}
        </section>
      )}

      {activeTab === "ipfs" && (
        <section className="mb-8">
          <h2 className="mb-4 text-[10px] font-semibold uppercase tracking-[0.3em] text-cyan-400">
            Submissions Needing IPFS Proof ({needsIpfs.length})
          </h2>
          {needsIpfs.length === 0 ? (
            <EmptyState message="No approved submissions are waiting for IPFS proof." />
          ) : (
            <SubmissionTable items={needsIpfs} statusColors={STATUS_COLORS} showIpfs />
          )}

          {/* Legacy proof records */}
          {pendingProofs.length > 0 && (
            <div className="mt-6">
              <h3 className="mb-4 text-[10px] font-semibold uppercase tracking-[0.3em] text-[#C9A84C]">
                Pending Proof Records (legacy) ({pendingProofs.length})
              </h3>
              <div className="divide-y divide-gray-800 rounded-xl border border-gray-800 bg-[#0F1923] overflow-hidden">
                {pendingProofs.map((record) => {
                  const creator = TTN_CREATORS.find((c) => c.id === record.creatorId);
                  return (
                    <div key={record.id} className="flex items-start gap-4 px-5 py-4">
                      <div className="flex-1 min-w-0">
                        <p className="mb-0.5 text-sm text-white">{record.title}</p>
                        <p className="text-[10px] text-gray-500 capitalize">
                          {record.contentType.replace(/-/g, " ")}
                          {creator ? ` · ${creator.name}` : ""}
                        </p>
                        <p className="mt-1 font-mono text-[9px] text-gray-600 truncate">{record.ipfsCid}</p>
                      </div>
                      <div className="flex shrink-0 gap-2">
                        <Link href={`/ttn/proof/${record.ipfsCid}`} className="rounded border border-gray-700 px-3 py-1.5 text-[9px] font-semibold uppercase tracking-[0.1em] text-gray-400 hover:text-white transition-colors">View</Link>
                        <button disabled className="cursor-not-allowed rounded border border-green-800/50 bg-green-900/10 px-3 py-1.5 text-[9px] font-semibold uppercase tracking-[0.1em] text-green-600">Approve</button>
                        <button disabled className="cursor-not-allowed rounded border border-red-800/50 bg-red-900/10 px-3 py-1.5 text-[9px] font-semibold uppercase tracking-[0.1em] text-red-600">Reject</button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </section>
      )}

      {/* Pending Creators (all tab only) */}
      {activeTab === "all" && pendingCreators.length > 0 && (
        <section className="mb-8">
          <h2 className="mb-4 text-[10px] font-semibold uppercase tracking-[0.3em] text-pink-400">
            Pending Creator Approvals ({pendingCreators.length})
          </h2>
          <div className="divide-y divide-gray-800 rounded-xl border border-gray-800 bg-[#0F1923] overflow-hidden">
            {pendingCreators.map((creator) => (
              <div key={creator.id} className="flex items-center gap-4 px-5 py-4">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gray-800 text-sm font-bold text-white">
                  {creator.name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-white">{creator.name}</p>
                  <p className="text-[10px] text-gray-500 truncate">{creator.tagline}</p>
                </div>
                <div className="flex shrink-0 gap-2">
                  <button disabled className="cursor-not-allowed rounded border border-green-800/50 bg-green-900/10 px-3 py-1.5 text-[9px] font-semibold uppercase tracking-[0.1em] text-green-600">Approve</button>
                  <button disabled className="cursor-not-allowed rounded border border-red-800/50 bg-red-900/10 px-3 py-1.5 text-[9px] font-semibold uppercase tracking-[0.1em] text-red-600">Reject</button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Disclaimer */}
      <div className="mt-4 rounded-xl border border-gray-800 bg-[#090E18] p-5">
        <p className="text-[11px] text-gray-600">
          This admin panel is simulation only. No approval actions trigger any database writes,
          notifications, or live content publication. All TTN content registries are static TypeScript files.
          Live admin functionality requires authenticated API endpoints and a live database.
        </p>
      </div>
    </div>
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────

import type { Submission } from "@/content/ttn/submissionRegistry";

function SubmissionTable({
  items,
  statusColors,
  showRights = false,
  showIpfs = false,
}: {
  items: Submission[];
  statusColors: Record<SubmissionStatus, string>;
  showRights?: boolean;
  showIpfs?: boolean;
}) {
  return (
    <div className="divide-y divide-gray-800 rounded-xl border border-gray-800 bg-[#0F1923] overflow-hidden">
      {items.map((sub) => (
        <div key={sub.id} className="flex items-start gap-4 px-5 py-4">
          <div className="flex-1 min-w-0">
            <div className="mb-1 flex items-center gap-2">
              <span className={`rounded-full px-2 py-0.5 text-[9px] font-semibold uppercase tracking-[0.1em] ${statusColors[sub.status]}`}>
                {SUBMISSION_STATUS_LABELS[sub.status]}
              </span>
              <span className="rounded bg-gray-800 px-1.5 py-0.5 text-[9px] text-gray-400">
                {SUBMISSION_TYPE_LABELS[sub.type]}
              </span>
            </div>
            <p className="text-sm text-white">{sub.title}</p>
            {showRights && (
              <p className="mt-0.5 text-[10px] text-orange-400">Rights: {sub.rightsStatus}</p>
            )}
            {showIpfs && (
              <p className="mt-0.5 text-[10px] text-cyan-400">IPFS: {sub.ipfsStatus.replace("_", " ")}</p>
            )}
          </div>
          <div className="flex shrink-0 gap-2">
            <Link
              href={`/ttn/admin/content-review/${sub.id}`}
              className="rounded border border-gray-700 px-3 py-1.5 text-[9px] font-semibold uppercase tracking-[0.1em] text-gray-400 hover:text-white transition-colors"
            >
              Review
            </Link>
            <button disabled className="cursor-not-allowed rounded border border-green-800/50 bg-green-900/10 px-3 py-1.5 text-[9px] font-semibold uppercase tracking-[0.1em] text-green-600">Approve</button>
            <button disabled className="cursor-not-allowed rounded border border-red-800/50 bg-red-900/10 px-3 py-1.5 text-[9px] font-semibold uppercase tracking-[0.1em] text-red-600">Reject</button>
          </div>
        </div>
      ))}
    </div>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="rounded-xl border border-dashed border-gray-700 p-10 text-center text-sm text-gray-500">
      {message}
    </div>
  );
}
