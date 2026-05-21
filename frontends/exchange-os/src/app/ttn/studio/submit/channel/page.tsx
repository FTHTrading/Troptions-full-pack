import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Channel Application — Creator Studio",
  description: "Apply to open a new channel on TTN.",
};

const CHANNEL_CATEGORIES = [
  "finance", "technology", "education", "news", "culture",
  "entertainment", "social-impact", "sports", "health", "creator-economy",
];

export default function SubmitChannelPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      {/* Breadcrumb */}
      <nav className="mb-8 text-[10px] uppercase tracking-[0.2em] text-gray-500">
        <Link href="/ttn/studio" className="hover:text-white transition-colors">Studio</Link>
        <span className="mx-2">/</span>
        <Link href="/ttn/studio/submit" className="hover:text-white transition-colors">Submit</Link>
        <span className="mx-2">/</span>
        <span className="text-white">Channel Application</span>
      </nav>

      {/* Banner */}
      <div className="mb-8 rounded-xl border border-yellow-800/50 bg-yellow-900/10 p-4">
        <p className="text-xs font-semibold text-yellow-400 uppercase tracking-[0.2em] mb-1">Simulation Only</p>
        <p className="text-xs text-yellow-300/80">
          This form is non-functional. Channel applications are reviewed manually by the TTN admin team.
          All inputs are disabled in this phase.
        </p>
      </div>

      <div className="mb-8">
        <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.3em] text-[#C9A84C]">Creator Studio</p>
        <h1 className="text-2xl font-bold text-white">Channel Application</h1>
        <p className="mt-2 text-sm text-gray-400">
          Apply to open a new channel on TTN. Approved channels receive a dedicated page, RSS feed setup,
          and access to the creator analytics dashboard.
        </p>
      </div>

      <form className="space-y-6">
        {/* Channel Name */}
        <div>
          <label className="mb-1.5 block text-[10px] font-semibold uppercase tracking-[0.2em] text-gray-400">
            Channel Name <span className="text-red-500">*</span>
          </label>
          <input
            disabled
            type="text"
            placeholder="e.g. FTH Daily Markets"
            className="w-full cursor-not-allowed rounded-lg border border-gray-700 bg-[#080C14] px-4 py-2.5 text-sm text-gray-600 placeholder:text-gray-700"
          />
        </div>

        {/* Proposed slug */}
        <div>
          <label className="mb-1.5 block text-[10px] font-semibold uppercase tracking-[0.2em] text-gray-400">
            Proposed URL Slug
          </label>
          <div className="flex items-center gap-2">
            <span className="rounded-l-lg border border-r-0 border-gray-700 bg-[#050810] px-3 py-2.5 text-xs text-gray-600">
              /ttn/channels/
            </span>
            <input
              disabled
              type="text"
              placeholder="e.g. fth-daily-markets"
              className="flex-1 cursor-not-allowed rounded-r-lg border border-gray-700 bg-[#080C14] px-4 py-2.5 text-sm text-gray-600 placeholder:text-gray-700"
            />
          </div>
        </div>

        {/* Category */}
        <div>
          <label className="mb-1.5 block text-[10px] font-semibold uppercase tracking-[0.2em] text-gray-400">
            Category <span className="text-red-500">*</span>
          </label>
          <select
            disabled
            className="w-full cursor-not-allowed rounded-lg border border-gray-700 bg-[#080C14] px-4 py-2.5 text-sm text-gray-600"
          >
            <option value="">Select category…</option>
            {CHANNEL_CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>{cat.replace(/-/g, " ")}</option>
            ))}
          </select>
        </div>

        {/* Description */}
        <div>
          <label className="mb-1.5 block text-[10px] font-semibold uppercase tracking-[0.2em] text-gray-400">
            Channel Description <span className="text-red-500">*</span>
          </label>
          <textarea
            disabled
            rows={4}
            placeholder="Describe what this channel will cover and who it is for…"
            className="w-full cursor-not-allowed rounded-lg border border-gray-700 bg-[#080C14] px-4 py-2.5 text-sm text-gray-600 placeholder:text-gray-700 resize-none"
          />
        </div>

        {/* Creator Bio */}
        <div>
          <label className="mb-1.5 block text-[10px] font-semibold uppercase tracking-[0.2em] text-gray-400">
            Creator Bio
          </label>
          <textarea
            disabled
            rows={3}
            placeholder="Brief bio of the creator or team behind this channel…"
            className="w-full cursor-not-allowed rounded-lg border border-gray-700 bg-[#080C14] px-4 py-2.5 text-sm text-gray-600 placeholder:text-gray-700 resize-none"
          />
        </div>

        {/* Schedule */}
        <div>
          <label className="mb-1.5 block text-[10px] font-semibold uppercase tracking-[0.2em] text-gray-400">
            Proposed Publishing Schedule
          </label>
          <input
            disabled
            type="text"
            placeholder="e.g. Monday–Friday, 3 videos per week, daily newsletter…"
            className="w-full cursor-not-allowed rounded-lg border border-gray-700 bg-[#080C14] px-4 py-2.5 text-sm text-gray-600 placeholder:text-gray-700"
          />
        </div>

        {/* Creator Agreement */}
        <div className="rounded-xl border border-gray-800 bg-[#0D1520] p-5">
          <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.3em] text-gray-400">
            Channel Agreement
          </p>
          <div className="space-y-3">
            {[
              "I agree to the TTN Creator Terms of Service.",
              "I understand that all content published must comply with TTN content policies.",
              "I acknowledge that channel approval is at the sole discretion of the TTN admin team.",
            ].map((text) => (
              <label key={text} className="flex cursor-not-allowed items-start gap-3">
                <input disabled type="checkbox" className="mt-0.5 cursor-not-allowed" />
                <span className="text-xs text-gray-600">{text}</span>
              </label>
            ))}
          </div>
        </div>

        <button
          disabled
          type="submit"
          className="w-full cursor-not-allowed rounded-xl border border-gray-700 bg-[#0F1923] px-6 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-gray-600"
        >
          Submit Application — Simulation Only
        </button>
      </form>

      <div className="mt-8 rounded-xl border border-gray-800 p-5">
        <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.3em] text-gray-400">Review Timeline</p>
        <p className="text-xs text-gray-500 leading-relaxed">
          Channel applications are reviewed within 5–10 business days. Approved channels will receive
          onboarding documentation, creator agreement for signature, and access to the Creator Studio dashboard.
          All features are non-functional in simulation mode.
        </p>
      </div>
    </div>
  );
}
