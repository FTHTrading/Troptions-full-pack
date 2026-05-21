import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Creator Studio",
  description: "TTN Creator Studio — submit and manage your content.",
};

export default function CreatorStudioPage() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-16">
      {/* Banner */}
      <div className="mb-10 rounded-xl border border-yellow-800/50 bg-yellow-900/10 p-5">
        <p className="text-xs font-semibold text-yellow-400 uppercase tracking-[0.2em] mb-1">Preview Mode</p>
        <p className="text-sm text-yellow-300/80">
          Creator Studio is in preview mode. All actions are simulation only. No content will be published,
          submitted, or registered during this phase.
        </p>
      </div>

      <div className="mb-12">
        <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.3em] text-[#C9A84C]">Creator Studio</p>
        <h1 className="text-3xl font-bold text-white">Studio</h1>
        <p className="mt-3 text-sm text-gray-400">Publish videos, write posts, submit films, and register proof records.</p>
      </div>

      <div className="space-y-8">
        {/* Upload Video */}
        <section className="rounded-2xl border border-gray-800 bg-[#0F1923] p-7">
          <h2 className="mb-1 text-base font-semibold text-white">Upload Video</h2>
          <p className="mb-6 text-sm text-gray-400">Submit a video to your channel. Requires channel membership and approved creator account.</p>
          <div className="space-y-4">
            <div>
              <label className="mb-1 block text-[10px] font-semibold uppercase tracking-[0.2em] text-gray-400">
                Video Title
              </label>
              <input
                disabled
                type="text"
                placeholder="Enter video title…"
                className="w-full cursor-not-allowed rounded-lg border border-gray-700 bg-[#080C14] px-4 py-2.5 text-sm text-gray-600 placeholder:text-gray-700 focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-1 block text-[10px] font-semibold uppercase tracking-[0.2em] text-gray-400">
                Channel
              </label>
              <input
                disabled
                type="text"
                placeholder="Select channel…"
                className="w-full cursor-not-allowed rounded-lg border border-gray-700 bg-[#080C14] px-4 py-2.5 text-sm text-gray-600 placeholder:text-gray-700 focus:outline-none"
              />
            </div>
            <button
              disabled
              className="cursor-not-allowed rounded-lg border border-gray-700 bg-gray-800/40 px-5 py-2.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-gray-500"
            >
              Upload Video — Simulation Only
            </button>
          </div>
        </section>

        {/* Publish Blog Post */}
        <section className="rounded-2xl border border-gray-800 bg-[#0F1923] p-7">
          <h2 className="mb-1 text-base font-semibold text-white">Publish Blog Post</h2>
          <p className="mb-6 text-sm text-gray-400">Write and publish a news article or editorial to the TTN Newsroom.</p>
          <div className="space-y-4">
            <div>
              <label className="mb-1 block text-[10px] font-semibold uppercase tracking-[0.2em] text-gray-400">
                Post Title
              </label>
              <input
                disabled
                type="text"
                placeholder="Enter post title…"
                className="w-full cursor-not-allowed rounded-lg border border-gray-700 bg-[#080C14] px-4 py-2.5 text-sm text-gray-600 placeholder:text-gray-700 focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-1 block text-[10px] font-semibold uppercase tracking-[0.2em] text-gray-400">
                Category
              </label>
              <input
                disabled
                type="text"
                placeholder="news / opinion / tutorial…"
                className="w-full cursor-not-allowed rounded-lg border border-gray-700 bg-[#080C14] px-4 py-2.5 text-sm text-gray-600 placeholder:text-gray-700 focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-1 block text-[10px] font-semibold uppercase tracking-[0.2em] text-gray-400">
                Body
              </label>
              <textarea
                disabled
                rows={5}
                placeholder="Write your article…"
                className="w-full cursor-not-allowed rounded-lg border border-gray-700 bg-[#080C14] px-4 py-2.5 text-sm text-gray-600 placeholder:text-gray-700 focus:outline-none resize-none"
              />
            </div>
            <button
              disabled
              className="cursor-not-allowed rounded-lg border border-gray-700 bg-gray-800/40 px-5 py-2.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-gray-500"
            >
              Publish Post — Simulation Only
            </button>
          </div>
        </section>

        {/* Submit Film */}
        <section className="rounded-2xl border border-gray-800 bg-[#0F1923] p-7">
          <h2 className="mb-1 text-base font-semibold text-white">Submit Film</h2>
          <p className="mb-6 text-sm text-gray-400">Submit a short film or documentary for TTN screening and review.</p>
          <div className="space-y-4">
            <div>
              <label className="mb-1 block text-[10px] font-semibold uppercase tracking-[0.2em] text-gray-400">
                Film Title
              </label>
              <input
                disabled
                type="text"
                placeholder="Enter film title…"
                className="w-full cursor-not-allowed rounded-lg border border-gray-700 bg-[#080C14] px-4 py-2.5 text-sm text-gray-600 placeholder:text-gray-700 focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-1 block text-[10px] font-semibold uppercase tracking-[0.2em] text-gray-400">
                Genre
              </label>
              <input
                disabled
                type="text"
                placeholder="documentary / short-film / drama…"
                className="w-full cursor-not-allowed rounded-lg border border-gray-700 bg-[#080C14] px-4 py-2.5 text-sm text-gray-600 placeholder:text-gray-700 focus:outline-none"
              />
            </div>
            <button
              disabled
              className="cursor-not-allowed rounded-lg border border-gray-700 bg-gray-800/40 px-5 py-2.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-gray-500"
            >
              Submit Film — Simulation Only
            </button>
          </div>
        </section>

        {/* Register Proof */}
        <section className="rounded-2xl border border-[#C9A84C]/15 bg-[#0D1520] p-7">
          <h2 className="mb-1 text-base font-semibold text-white">Register Content Proof</h2>
          <p className="mb-6 text-sm text-gray-400">
            Register an IPFS CID and SHA-256 fingerprint for your content. Proof records are informational only —
            not a legal copyright registration.
          </p>
          <div className="space-y-4">
            <div>
              <label className="mb-1 block text-[10px] font-semibold uppercase tracking-[0.2em] text-gray-400">
                Content Title
              </label>
              <input
                disabled
                type="text"
                placeholder="Enter content title…"
                className="w-full cursor-not-allowed rounded-lg border border-gray-700 bg-[#080C14] px-4 py-2.5 text-sm text-gray-600 placeholder:text-gray-700 focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-1 block text-[10px] font-semibold uppercase tracking-[0.2em] text-gray-400">
                IPFS CID
              </label>
              <input
                disabled
                type="text"
                placeholder="Qm…"
                className="w-full cursor-not-allowed rounded-lg border border-gray-700 bg-[#080C14] px-4 py-2.5 font-mono text-sm text-gray-600 placeholder:text-gray-700 focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-1 block text-[10px] font-semibold uppercase tracking-[0.2em] text-gray-400">
                SHA-256 Hash
              </label>
              <input
                disabled
                type="text"
                placeholder="64-char hex…"
                className="w-full cursor-not-allowed rounded-lg border border-gray-700 bg-[#080C14] px-4 py-2.5 font-mono text-sm text-gray-600 placeholder:text-gray-700 focus:outline-none"
              />
            </div>
            <button
              disabled
              className="cursor-not-allowed rounded-lg border border-[#C9A84C]/20 bg-[#C9A84C]/5 px-5 py-2.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#C9A84C]/40"
            >
              Register Proof — Simulation Only
            </button>
          </div>
          <p className="mt-5 text-[10px] leading-relaxed text-gray-600">
            Proof registration requires creator verification and an approved rights agreement.
            Live IPFS pinning requires a separate deployment configuration with{" "}
            <code>live_execution_enabled: true</code>.
          </p>
        </section>
      </div>
    </div>
  );
}
