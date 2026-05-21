import Link from "next/link";
import { Card, Badge, SectionHeader } from "@/components/ui";
import { getActiveTnnShows, TNN_DISCLAIMER } from "@/lib/troptions/tnnShowRegistry";

export const metadata = {
  title: "TROPTIONS Media & Web3 TV - TNN Episodes & Creator Content",
  description:
    "TROPTIONS Television Network (TNN) — episodes, creator spotlights, merchant stories, charity campaigns, and Web3 education.",
};

export default function TroptionsMediaPage() {
  const shows = getActiveTnnShows();

  // Mock episode data (would be from API in real implementation)
  const mockEpisodes = [
    {
      id: "ep-001",
      showId: "troptions-founder-files",
      episodeNumber: 1,
      title: "The TROPTIONS Story",
      guestName: "Bryan/Garland",
      status: "DRAFT",
      hasGuestRelease: false,
      publishStatus: "NEEDS_RELEASE",
    },
    {
      id: "ep-002",
      showId: "web3-made-simple",
      episodeNumber: 1,
      title: "What is a Wallet?",
      guestName: "TROPTIONS Team",
      status: "DRAFT",
      hasGuestRelease: true,
      publishStatus: "READY_TO_PUBLISH",
    },
    {
      id: "ep-003",
      showId: "creator-nil-spotlight",
      episodeNumber: 1,
      title: "Creator Profile: [Creator Name]",
      guestName: "TBD",
      status: "PLANNING",
      hasGuestRelease: false,
      publishStatus: "NOT_STARTED",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#071426] to-[#0a1a2e]">
      <div className="mx-auto max-w-6xl px-6 py-12">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-5xl font-bold text-white mb-4">TROPTIONS Media & Web3 TV</h1>
          <p className="text-xl text-slate-300 mb-6">
            TROPTIONS Television Network (TNN) — Spotlighting creators, merchants, charities, and Web3 innovation.
          </p>
          <p className="text-base text-slate-400 mb-8">
            {TNN_DISCLAIMER}
          </p>
          <div className="flex gap-4 flex-wrap">
            <Link
              href="/troptions/nil"
              className="inline-flex items-center rounded-lg bg-[#c99a3c] px-6 py-3 font-bold text-[#111827] hover:bg-[#f0cf82] transition-colors"
            >
              Launch Creator Campaigns
            </Link>
            <button className="inline-flex items-center rounded-lg border border-[#C9A84C] px-6 py-3 font-bold text-[#f0cf82] hover:bg-[#C9A84C]/10 transition-colors cursor-not-allowed opacity-50">
              Create Episode (Coming Soon)
            </button>
          </div>
        </div>

        {/* TNN Shows Overview */}
        <div className="mb-16">
          <SectionHeader
            heading="TROPTIONS Television Network Shows"
            body="Five foundational shows building the TNN platform: Founder Files, Creator Spotlight, Merchant Spotlight, Charity Impact, and Web3 Education"
          />

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mt-8">
            {shows.map((show) => (
              <Card key={show.showId} className="h-full hover:border-[#C9A84C]/80 hover:bg-white/[0.02] transition-all">
                <div className="p-6 space-y-4 h-full flex flex-col">
                  {/* Title + Status */}
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-lg font-semibold text-white flex-1">{show.displayName}</h3>
                    <Badge variant="amber">{show.status}</Badge>
                  </div>

                  {/* Description */}
                  <p className="text-sm text-slate-400">{show.description}</p>

                  {/* Details */}
                  <div className="space-y-2 text-xs text-slate-500">
                    <div>
                      <strong>Target Audience:</strong> {show.targetAudience.join(", ")}
                    </div>
                    <div>
                      <strong>Frequency:</strong> {show.episodeFrequency}
                    </div>
                    <div>
                      <strong>Episodes:</strong> {show.targetEpisodeCount || "TBD"}
                    </div>
                    {show.launchDate && (
                      <div>
                        <strong>Launch:</strong> {new Date(show.launchDate).toLocaleDateString()}
                      </div>
                    )}
                  </div>

                  {/* Purpose */}
                  <div className="border-t border-white/10 pt-3 mt-auto">
                    <p className="text-xs text-slate-300 italic">
                      <strong>Purpose:</strong> {show.purpose}
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Episodes in Progress */}
        <div className="mb-16">
          <SectionHeader
            heading="Episodes in Progress"
            body="Pilot episodes being prepared for launch — all require guest releases before publishing"
          />

          <div className="grid gap-4 mt-8">
            {mockEpisodes.map((ep) => (
              <Card key={ep.id} className="hover:border-[#C9A84C]/80 hover:bg-white/[0.02] transition-all">
                <div className="p-6 space-y-4">
                  {/* Title + Status */}
                  <div className="flex items-start justify-between gap-4 flex-wrap">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-white mb-1">{ep.title}</h3>
                      <p className="text-sm text-slate-400">
                        Episode {ep.episodeNumber} · Guest: {ep.guestName}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Badge variant={ep.status === "DRAFT" ? "amber" : "blue"}>{ep.status}</Badge>
                      <Badge
                        variant={
                          ep.publishStatus === "READY_TO_PUBLISH"
                            ? "green"
                            : ep.publishStatus === "NEEDS_RELEASE"
                              ? "red"
                              : "slate"
                        }
                      >
                        {ep.publishStatus === "READY_TO_PUBLISH"
                          ? "Ready"
                          : ep.publishStatus === "NEEDS_RELEASE"
                            ? "Needs Release"
                            : "Planning"}
                      </Badge>
                    </div>
                  </div>

                  {/* Release Status */}
                  <div className="flex items-center justify-between bg-white/5 rounded-lg p-3">
                    <span className="text-sm text-slate-300">Guest Release Attached:</span>
                    <span
                      className={`text-sm font-semibold ${ep.hasGuestRelease ? "text-green-400" : "text-amber-400"}`}
                    >
                      {ep.hasGuestRelease ? "✓ Yes" : "✗ Not Attached"}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 pt-2">
                    {ep.publishStatus === "READY_TO_PUBLISH" ? (
                      <button className="flex-1 rounded-lg bg-[#c99a3c] px-4 py-2 text-sm font-bold text-[#111827] hover:bg-[#f0cf82] transition-colors">
                        Publish Episode
                      </button>
                    ) : (
                      <button className="flex-1 rounded-lg border border-[#C9A84C] px-4 py-2 text-sm font-bold text-[#f0cf82] hover:bg-[#C9A84C]/10 transition-colors cursor-not-allowed opacity-50">
                        Upload Release Required
                      </button>
                    )}
                    <button className="rounded-lg border border-white/20 px-4 py-2 text-sm font-semibold text-slate-300 hover:bg-white/10 transition-colors">
                      Edit
                    </button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Get Started Section */}
        <div className="rounded-xl border border-[#C9A84C]/30 bg-gradient-to-r from-[#C9A84C]/5 to-transparent p-8">
          <h2 className="text-2xl font-bold text-white mb-4">Get Started with TNN</h2>

          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div>
              <h3 className="text-lg font-semibold text-[#f0cf82] mb-3">For Creators & Athletes</h3>
              <ul className="text-slate-300 space-y-2 text-sm">
                <li>✓ Build your creator profile</li>
                <li>✓ Sign media release</li>
                <li>✓ Get sponsors matched</li>
                <li>✓ Track campaign proof-of-performance</li>
              </ul>
              <Link
                href="/troptions/nil"
                className="inline-block mt-4 text-[#f0cf82] font-semibold hover:underline"
              >
                Creator Onboarding →
              </Link>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-[#f0cf82] mb-3">For Sponsors & Brands</h3>
              <ul className="text-slate-300 space-y-2 text-sm">
                <li>✓ Create sponsored campaigns</li>
                <li>✓ Set deliverables</li>
                <li>✓ Track proof-of-performance</li>
                <li>✓ Manage payments</li>
              </ul>
              <button className="inline-block mt-4 text-[#f0cf82] font-semibold hover:underline cursor-not-allowed opacity-50">
                Sponsor Campaigns (Coming Soon) →
              </button>
            </div>
          </div>

          <div className="border-t border-white/10 pt-6">
            <h4 className="text-sm font-bold text-white mb-2 uppercase tracking-widest">IMPORTANT DISCLAIMERS</h4>
            <ul className="text-xs text-slate-400 space-y-1">
              <li>
                • No guaranteed sponsorships, income, followers, views, or campaign outcomes • All episodes require guest
                releases
              </li>
              <li>
                • All sponsored content requires signed agreements • Merchant spotlights do not guarantee customer acquisition
              </li>
              <li>
                • Educational content is informational only • Simulation-only: No live streaming, video delivery, or sponsorship
                payments enabled
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
