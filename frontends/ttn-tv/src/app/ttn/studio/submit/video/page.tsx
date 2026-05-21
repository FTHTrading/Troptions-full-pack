import type { Metadata } from "next";
import Link from "next/link";
import { TTN_CHANNELS } from "@/content/ttn/channelRegistry";

export const metadata: Metadata = {
  title: "Submit Video — Creator Studio",
  description: "Submit a video to your TTN channel.",
};

export default function SubmitVideoPage() {
  const channels = TTN_CHANNELS.filter((c) => c.status === "live" || c.status === "scheduled");

  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      {/* Breadcrumb */}
      <nav className="mb-8 text-[10px] uppercase tracking-[0.2em] text-gray-500">
        <Link href="/ttn/studio" className="hover:text-white transition-colors">Studio</Link>
        <span className="mx-2">/</span>
        <Link href="/ttn/studio/submit" className="hover:text-white transition-colors">Submit</Link>
        <span className="mx-2">/</span>
        <span className="text-white">Video</span>
      </nav>

      {/* Banner */}
      <div className="mb-8 rounded-xl border border-yellow-800/50 bg-yellow-900/10 p-4">
        <p className="text-xs font-semibold text-yellow-400 uppercase tracking-[0.2em] mb-1">Simulation Only</p>
        <p className="text-xs text-yellow-300/80">
          This form is non-functional. No video will be uploaded or published.
          Inputs are disabled. Real upload requires rights verification and creator agreement.
        </p>
      </div>

      <div className="mb-8">
        <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.3em] text-[#C9A84C]">Creator Studio</p>
        <h1 className="text-2xl font-bold text-white">Submit a Video</h1>
        <p className="mt-2 text-sm text-gray-400">
          Submit video metadata for admin review. File uploads are not yet enabled.
        </p>
      </div>

      <form className="space-y-6">
        {/* Title */}
        <div>
          <label className="mb-1.5 block text-[10px] font-semibold uppercase tracking-[0.2em] text-gray-400">
            Video Title <span className="text-red-500">*</span>
          </label>
          <input
            disabled
            type="text"
            placeholder="Enter video title…"
            className="w-full cursor-not-allowed rounded-lg border border-gray-700 bg-[#080C14] px-4 py-2.5 text-sm text-gray-600 placeholder:text-gray-700"
          />
        </div>

        {/* Channel */}
        <div>
          <label className="mb-1.5 block text-[10px] font-semibold uppercase tracking-[0.2em] text-gray-400">
            Channel <span className="text-red-500">*</span>
          </label>
          <select
            disabled
            className="w-full cursor-not-allowed rounded-lg border border-gray-700 bg-[#080C14] px-4 py-2.5 text-sm text-gray-600"
          >
            <option value="">Select channel…</option>
            {channels.map((c) => (
              <option key={c.id} value={c.id}>{c.title}</option>
            ))}
          </select>
        </div>

        {/* Description */}
        <div>
          <label className="mb-1.5 block text-[10px] font-semibold uppercase tracking-[0.2em] text-gray-400">
            Description
          </label>
          <textarea
            disabled
            rows={4}
            placeholder="Describe your video…"
            className="w-full cursor-not-allowed rounded-lg border border-gray-700 bg-[#080C14] px-4 py-2.5 text-sm text-gray-600 placeholder:text-gray-700 resize-none"
          />
        </div>

        {/* Duration */}
        <div>
          <label className="mb-1.5 block text-[10px] font-semibold uppercase tracking-[0.2em] text-gray-400">
            Duration (mm:ss)
          </label>
          <input
            disabled
            type="text"
            placeholder="e.g. 15:30"
            className="w-full cursor-not-allowed rounded-lg border border-gray-700 bg-[#080C14] px-4 py-2.5 text-sm text-gray-600 placeholder:text-gray-700"
          />
        </div>

        {/* Embed URL */}
        <div>
          <label className="mb-1.5 block text-[10px] font-semibold uppercase tracking-[0.2em] text-gray-400">
            Embed URL (YouTube / Rumble / Vimeo)
          </label>
          <input
            disabled
            type="url"
            placeholder="https://www.youtube.com/embed/…"
            className="w-full cursor-not-allowed rounded-lg border border-gray-700 bg-[#080C14] px-4 py-2.5 text-sm text-gray-600 placeholder:text-gray-700"
          />
          <p className="mt-1.5 text-[10px] text-gray-600">
            Only embed URLs from approved platforms. Direct file uploads are not yet enabled.
          </p>
        </div>

        {/* Rights declaration */}
        <div className="rounded-xl border border-gray-800 bg-[#0D1520] p-5">
          <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.3em] text-gray-400">Rights Declaration</p>
          <label className="flex cursor-not-allowed items-start gap-3">
            <input disabled type="checkbox" className="mt-0.5 cursor-not-allowed" />
            <span className="text-xs text-gray-600">
              I confirm I own or have licensed rights to all content in this video, including music,
              footage, and any third-party materials. I understand TTN requires a signed creator
              agreement before any content is published.
            </span>
          </label>
        </div>

        {/* Submit */}
        <button
          disabled
          type="submit"
          className="w-full cursor-not-allowed rounded-xl border border-gray-700 bg-[#0F1923] px-6 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-gray-600"
        >
          Submit for Review — Simulation Only
        </button>
      </form>

      <div className="mt-8 rounded-xl border border-gray-800 p-5 text-xs text-gray-500 leading-relaxed">
        <strong className="text-gray-400">What happens after submission?</strong>
        <ol className="mt-2 list-decimal pl-4 space-y-1">
          <li>Admin team reviews metadata and rights status</li>
          <li>Rights verification: signed creator agreement required</li>
          <li>IPFS proof record optionally created after approval</li>
          <li>Content published to channel page</li>
        </ol>
        <p className="mt-3 text-[10px] text-gray-600">
          All steps are non-functional in simulation mode. No data is persisted.
        </p>
      </div>
    </div>
  );
}
