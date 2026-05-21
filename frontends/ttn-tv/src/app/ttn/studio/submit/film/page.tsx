import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Submit Film — Creator Studio",
  description: "Submit a short film or documentary to TTN.",
};

const FILM_GENRES = [
  "documentary", "short-film", "drama", "comedy", "experimental",
  "social-impact", "education", "animation", "biography",
];

export default function SubmitFilmPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      {/* Breadcrumb */}
      <nav className="mb-8 text-[10px] uppercase tracking-[0.2em] text-gray-500">
        <Link href="/ttn/studio" className="hover:text-white transition-colors">Studio</Link>
        <span className="mx-2">/</span>
        <Link href="/ttn/studio/submit" className="hover:text-white transition-colors">Submit</Link>
        <span className="mx-2">/</span>
        <span className="text-white">Film</span>
      </nav>

      {/* Banner */}
      <div className="mb-8 rounded-xl border border-yellow-800/50 bg-yellow-900/10 p-4">
        <p className="text-xs font-semibold text-yellow-400 uppercase tracking-[0.2em] mb-1">Simulation Only</p>
        <p className="text-xs text-yellow-300/80">
          This form is non-functional. No film will be submitted or published.
          Film submissions require full rights verification and a signed creator agreement before review.
        </p>
      </div>

      <div className="mb-8">
        <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.3em] text-[#C9A84C]">Creator Studio</p>
        <h1 className="text-2xl font-bold text-white">Submit a Film</h1>
        <p className="mt-2 text-sm text-gray-400">
          Submit a short film or documentary for TTN review and publication. Runtime maximum: 60 minutes.
        </p>
      </div>

      <form className="space-y-6">
        {/* Title */}
        <div>
          <label className="mb-1.5 block text-[10px] font-semibold uppercase tracking-[0.2em] text-gray-400">
            Film Title <span className="text-red-500">*</span>
          </label>
          <input
            disabled
            type="text"
            placeholder="Enter film title…"
            className="w-full cursor-not-allowed rounded-lg border border-gray-700 bg-[#080C14] px-4 py-2.5 text-sm text-gray-600 placeholder:text-gray-700"
          />
        </div>

        {/* Tagline */}
        <div>
          <label className="mb-1.5 block text-[10px] font-semibold uppercase tracking-[0.2em] text-gray-400">
            Tagline
          </label>
          <input
            disabled
            type="text"
            placeholder="One-line tagline…"
            className="w-full cursor-not-allowed rounded-lg border border-gray-700 bg-[#080C14] px-4 py-2.5 text-sm text-gray-600 placeholder:text-gray-700"
          />
        </div>

        {/* Synopsis */}
        <div>
          <label className="mb-1.5 block text-[10px] font-semibold uppercase tracking-[0.2em] text-gray-400">
            Synopsis <span className="text-red-500">*</span>
          </label>
          <textarea
            disabled
            rows={5}
            placeholder="Describe the film…"
            className="w-full cursor-not-allowed rounded-lg border border-gray-700 bg-[#080C14] px-4 py-2.5 text-sm text-gray-600 placeholder:text-gray-700 resize-none"
          />
        </div>

        {/* Genre */}
        <div>
          <label className="mb-1.5 block text-[10px] font-semibold uppercase tracking-[0.2em] text-gray-400">
            Genre
          </label>
          <select
            disabled
            className="w-full cursor-not-allowed rounded-lg border border-gray-700 bg-[#080C14] px-4 py-2.5 text-sm text-gray-600"
          >
            <option value="">Select primary genre…</option>
            {FILM_GENRES.map((g) => (
              <option key={g} value={g}>{g.replace(/-/g, " ")}</option>
            ))}
          </select>
        </div>

        {/* Runtime */}
        <div>
          <label className="mb-1.5 block text-[10px] font-semibold uppercase tracking-[0.2em] text-gray-400">
            Runtime (mm:ss)
          </label>
          <input
            disabled
            type="text"
            placeholder="e.g. 28:45"
            className="w-full cursor-not-allowed rounded-lg border border-gray-700 bg-[#080C14] px-4 py-2.5 text-sm text-gray-600 placeholder:text-gray-700"
          />
        </div>

        {/* Production Year */}
        <div>
          <label className="mb-1.5 block text-[10px] font-semibold uppercase tracking-[0.2em] text-gray-400">
            Production Year
          </label>
          <input
            disabled
            type="number"
            min={2000}
            max={2030}
            placeholder="e.g. 2026"
            className="w-full cursor-not-allowed rounded-lg border border-gray-700 bg-[#080C14] px-4 py-2.5 text-sm text-gray-600 placeholder:text-gray-700"
          />
        </div>

        {/* Festival target */}
        <div>
          <label className="mb-1.5 block text-[10px] font-semibold uppercase tracking-[0.2em] text-gray-400">
            Festival Target (optional)
          </label>
          <input
            disabled
            type="text"
            placeholder="e.g. Sundance, SXSW, local festival…"
            className="w-full cursor-not-allowed rounded-lg border border-gray-700 bg-[#080C14] px-4 py-2.5 text-sm text-gray-600 placeholder:text-gray-700"
          />
        </div>

        {/* Rights declaration */}
        <div className="rounded-xl border border-gray-800 bg-[#0D1520] p-5">
          <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.3em] text-gray-400">Rights & Clearances</p>
          <div className="space-y-3">
            {[
              "I own or have licensed all rights to this film.",
              "All actors, crew, and subjects have provided written consent.",
              "All music, footage, and third-party materials are properly licensed.",
            ].map((text) => (
              <label key={text} className="flex cursor-not-allowed items-start gap-3">
                <input disabled type="checkbox" className="mt-0.5 cursor-not-allowed" />
                <span className="text-xs text-gray-600">{text}</span>
              </label>
            ))}
          </div>
          <p className="mt-4 text-[10px] text-gray-600">
            ⚠️ Rights verification is required before any film can be published. Legal review of all
            clearances is mandatory. Do not submit if rights are not fully resolved.
          </p>
        </div>

        <button
          disabled
          type="submit"
          className="w-full cursor-not-allowed rounded-xl border border-gray-700 bg-[#0F1923] px-6 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-gray-600"
        >
          Submit Film — Simulation Only
        </button>
      </form>
    </div>
  );
}
