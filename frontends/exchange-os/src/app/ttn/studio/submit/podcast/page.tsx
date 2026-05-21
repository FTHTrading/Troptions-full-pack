import type { Metadata } from "next";
import Link from "next/link";
import { TTN_PODCAST_SHOWS } from "@/content/ttn/podcastRegistry";

export const metadata: Metadata = {
  title: "Submit Podcast Episode — Creator Studio",
  description: "Submit a podcast episode to one of your shows.",
};

export default function SubmitPodcastPage() {
  const shows = TTN_PODCAST_SHOWS.filter((s) => s.status === "active" || s.status === "draft");

  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      {/* Breadcrumb */}
      <nav className="mb-8 text-[10px] uppercase tracking-[0.2em] text-gray-500">
        <Link href="/ttn/studio" className="hover:text-white transition-colors">Studio</Link>
        <span className="mx-2">/</span>
        <Link href="/ttn/studio/submit" className="hover:text-white transition-colors">Submit</Link>
        <span className="mx-2">/</span>
        <span className="text-white">Podcast Episode</span>
      </nav>

      {/* Banner */}
      <div className="mb-8 rounded-xl border border-yellow-800/50 bg-yellow-900/10 p-4">
        <p className="text-xs font-semibold text-yellow-400 uppercase tracking-[0.2em] mb-1">Simulation Only</p>
        <p className="text-xs text-yellow-300/80">
          This form is non-functional. No audio will be uploaded or published. Inputs are disabled.
          Audio hosting and RSS distribution require infrastructure readiness review.
        </p>
      </div>

      <div className="mb-8">
        <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.3em] text-[#C9A84C]">Creator Studio</p>
        <h1 className="text-2xl font-bold text-white">Submit a Podcast Episode</h1>
        <p className="mt-2 text-sm text-gray-400">Submit episode metadata for review. Audio file upload is not yet enabled.</p>
      </div>

      <form className="space-y-6">
        {/* Show */}
        <div>
          <label className="mb-1.5 block text-[10px] font-semibold uppercase tracking-[0.2em] text-gray-400">
            Podcast Show <span className="text-red-500">*</span>
          </label>
          <select
            disabled
            className="w-full cursor-not-allowed rounded-lg border border-gray-700 bg-[#080C14] px-4 py-2.5 text-sm text-gray-600"
          >
            <option value="">Select show…</option>
            {shows.map((s) => (
              <option key={s.id} value={s.id}>{s.title}</option>
            ))}
          </select>
        </div>

        {/* Episode Number */}
        <div>
          <label className="mb-1.5 block text-[10px] font-semibold uppercase tracking-[0.2em] text-gray-400">
            Episode Number
          </label>
          <input
            disabled
            type="number"
            min={1}
            placeholder="e.g. 4"
            className="w-full cursor-not-allowed rounded-lg border border-gray-700 bg-[#080C14] px-4 py-2.5 text-sm text-gray-600 placeholder:text-gray-700"
          />
        </div>

        {/* Title */}
        <div>
          <label className="mb-1.5 block text-[10px] font-semibold uppercase tracking-[0.2em] text-gray-400">
            Episode Title <span className="text-red-500">*</span>
          </label>
          <input
            disabled
            type="text"
            placeholder="Enter episode title…"
            className="w-full cursor-not-allowed rounded-lg border border-gray-700 bg-[#080C14] px-4 py-2.5 text-sm text-gray-600 placeholder:text-gray-700"
          />
        </div>

        {/* Description */}
        <div>
          <label className="mb-1.5 block text-[10px] font-semibold uppercase tracking-[0.2em] text-gray-400">
            Episode Description
          </label>
          <textarea
            disabled
            rows={4}
            placeholder="Describe the episode…"
            className="w-full cursor-not-allowed rounded-lg border border-gray-700 bg-[#080C14] px-4 py-2.5 text-sm text-gray-600 placeholder:text-gray-700 resize-none"
          />
        </div>

        {/* Guest */}
        <div>
          <label className="mb-1.5 block text-[10px] font-semibold uppercase tracking-[0.2em] text-gray-400">
            Guest Name (if applicable)
          </label>
          <input
            disabled
            type="text"
            placeholder="Guest name…"
            className="w-full cursor-not-allowed rounded-lg border border-gray-700 bg-[#080C14] px-4 py-2.5 text-sm text-gray-600 placeholder:text-gray-700"
          />
        </div>

        {/* Duration */}
        <div>
          <label className="mb-1.5 block text-[10px] font-semibold uppercase tracking-[0.2em] text-gray-400">
            Duration (hh:mm:ss or mm:ss)
          </label>
          <input
            disabled
            type="text"
            placeholder="e.g. 1:02:15 or 45:30"
            className="w-full cursor-not-allowed rounded-lg border border-gray-700 bg-[#080C14] px-4 py-2.5 text-sm text-gray-600 placeholder:text-gray-700"
          />
        </div>

        {/* Audio file reference */}
        <div className="rounded-xl border border-gray-800 bg-[#0D1520] p-5">
          <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.3em] text-gray-400">
            Audio File
          </p>
          <p className="mb-3 text-xs text-gray-600">
            Direct audio upload is not yet enabled. When ready, TTN will support MP3, M4A, and AAC formats.
            File uploads require storage infrastructure readiness and legal review of hosting terms.
          </p>
          <input
            disabled
            type="text"
            placeholder="Audio filename reference (no upload)…"
            className="w-full cursor-not-allowed rounded-lg border border-gray-700 bg-[#080C14] px-4 py-2.5 text-sm text-gray-600 placeholder:text-gray-700"
          />
        </div>

        <button
          disabled
          type="submit"
          className="w-full cursor-not-allowed rounded-xl border border-gray-700 bg-[#0F1923] px-6 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-gray-600"
        >
          Submit Episode — Simulation Only
        </button>
      </form>
    </div>
  );
}
