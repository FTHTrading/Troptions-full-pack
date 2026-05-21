import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Submit Content — Creator Studio",
  description: "Choose the type of content you want to submit to TTN.",
};

const SUBMIT_TYPES = [
  {
    href: "/ttn/studio/submit/video",
    emoji: "🎬",
    label: "Video",
    description: "Submit a video to one of your channels. Requires an active channel and creator account.",
    color: "border-blue-800/40 hover:border-blue-700/50",
    badge: "blue",
  },
  {
    href: "/ttn/studio/submit/blog",
    emoji: "✍️",
    label: "Blog Post",
    description: "Submit a written article, editorial, or news post to the TTN Newsroom.",
    color: "border-green-800/40 hover:border-green-700/50",
    badge: "green",
  },
  {
    href: "/ttn/studio/submit/podcast",
    emoji: "🎙",
    label: "Podcast Episode",
    description: "Submit an episode to one of your podcast shows.",
    color: "border-purple-800/40 hover:border-purple-700/50",
    badge: "purple",
  },
  {
    href: "/ttn/studio/submit/film",
    emoji: "🎞️",
    label: "Short Film / Documentary",
    description: "Submit a short film or documentary for review and publication.",
    color: "border-orange-800/40 hover:border-orange-700/50",
    badge: "orange",
  },
  {
    href: "/ttn/studio/submit/channel",
    emoji: "📡",
    label: "Channel Application",
    description: "Apply to open a new channel on TTN. All applications are reviewed by the admin team.",
    color: "border-[#C9A84C]/30 hover:border-[#C9A84C]/50",
    badge: "gold",
  },
] as const;

export default function StudioSubmitIndexPage() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-16">
      {/* Breadcrumb */}
      <nav className="mb-8 text-[10px] uppercase tracking-[0.2em] text-gray-500">
        <Link href="/ttn/studio" className="hover:text-white transition-colors">Studio</Link>
        <span className="mx-2">/</span>
        <span className="text-white">Submit Content</span>
      </nav>

      {/* Banner */}
      <div className="mb-10 rounded-xl border border-yellow-800/50 bg-yellow-900/10 p-5">
        <p className="text-xs font-semibold text-yellow-400 uppercase tracking-[0.2em] mb-1">Simulation Only</p>
        <p className="text-sm text-yellow-300/80">
          All submission forms are simulation-only. No content will be uploaded, published, or registered.
          Forms collect metadata only and do not write to any database in this phase.
        </p>
      </div>

      <div className="mb-10">
        <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.3em] text-[#C9A84C]">Creator Studio</p>
        <h1 className="text-3xl font-bold text-white">Submit Content</h1>
        <p className="mt-3 text-sm text-gray-400">Choose the type of content you want to submit for review and publication.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {SUBMIT_TYPES.map(({ href, emoji, label, description, color }) => (
          <Link
            key={href}
            href={href}
            className={`group block rounded-2xl border bg-[#0F1923] p-6 transition-all ${color}`}
          >
            <div className="mb-4 text-3xl">{emoji}</div>
            <h2 className="mb-2 text-base font-semibold text-white group-hover:text-[#C9A84C] transition-colors">
              {label}
            </h2>
            <p className="text-xs text-gray-400 leading-relaxed">{description}</p>
            <p className="mt-4 text-[10px] font-semibold uppercase tracking-[0.2em] text-gray-600">
              Simulation only →
            </p>
          </Link>
        ))}
      </div>

      <div className="mt-10 rounded-xl border border-gray-800 bg-[#0D1520] p-6">
        <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.3em] text-gray-400">Need to upload files?</p>
        <p className="text-xs text-gray-500 leading-relaxed">
          Real file uploads, IPFS registration, and live publishing will be enabled in a future phase after
          creator agreements, rights verification, and infrastructure readiness checks are complete.
          All features that touch file storage, IPFS, or payment rails require legal review before activation.
        </p>
      </div>
    </div>
  );
}
