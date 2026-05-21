import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Submit Blog Post — Creator Studio",
  description: "Submit a blog post or news article to the TTN Newsroom.",
};

const BLOG_CATEGORIES = [
  "news", "editorial", "analysis", "technology", "policy",
  "creator-economy", "web3", "finance", "culture", "education",
];

export default function SubmitBlogPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      {/* Breadcrumb */}
      <nav className="mb-8 text-[10px] uppercase tracking-[0.2em] text-gray-500">
        <Link href="/ttn/studio" className="hover:text-white transition-colors">Studio</Link>
        <span className="mx-2">/</span>
        <Link href="/ttn/studio/submit" className="hover:text-white transition-colors">Submit</Link>
        <span className="mx-2">/</span>
        <span className="text-white">Blog Post</span>
      </nav>

      {/* Banner */}
      <div className="mb-8 rounded-xl border border-yellow-800/50 bg-yellow-900/10 p-4">
        <p className="text-xs font-semibold text-yellow-400 uppercase tracking-[0.2em] mb-1">Simulation Only</p>
        <p className="text-xs text-yellow-300/80">
          This form is non-functional. No blog post will be created or published. Inputs are disabled.
        </p>
      </div>

      <div className="mb-8">
        <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.3em] text-[#C9A84C]">Creator Studio</p>
        <h1 className="text-2xl font-bold text-white">Submit a Blog Post</h1>
        <p className="mt-2 text-sm text-gray-400">
          Submit a written article for the TTN Newsroom. Requires a signed creator agreement.
        </p>
      </div>

      <form className="space-y-6">
        {/* Title */}
        <div>
          <label className="mb-1.5 block text-[10px] font-semibold uppercase tracking-[0.2em] text-gray-400">
            Post Title <span className="text-red-500">*</span>
          </label>
          <input
            disabled
            type="text"
            placeholder="Enter post title…"
            className="w-full cursor-not-allowed rounded-lg border border-gray-700 bg-[#080C14] px-4 py-2.5 text-sm text-gray-600 placeholder:text-gray-700"
          />
        </div>

        {/* Category */}
        <div>
          <label className="mb-1.5 block text-[10px] font-semibold uppercase tracking-[0.2em] text-gray-400">
            Category
          </label>
          <select
            disabled
            className="w-full cursor-not-allowed rounded-lg border border-gray-700 bg-[#080C14] px-4 py-2.5 text-sm text-gray-600"
          >
            <option value="">Select category…</option>
            {BLOG_CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>{cat.replace(/-/g, " ")}</option>
            ))}
          </select>
        </div>

        {/* Excerpt */}
        <div>
          <label className="mb-1.5 block text-[10px] font-semibold uppercase tracking-[0.2em] text-gray-400">
            Excerpt / Summary
          </label>
          <textarea
            disabled
            rows={3}
            placeholder="A short summary shown in card previews…"
            className="w-full cursor-not-allowed rounded-lg border border-gray-700 bg-[#080C14] px-4 py-2.5 text-sm text-gray-600 placeholder:text-gray-700 resize-none"
          />
        </div>

        {/* Body */}
        <div>
          <label className="mb-1.5 block text-[10px] font-semibold uppercase tracking-[0.2em] text-gray-400">
            Body Content <span className="text-red-500">*</span>
          </label>
          <textarea
            disabled
            rows={10}
            placeholder="Write your full article here…"
            className="w-full cursor-not-allowed rounded-lg border border-gray-700 bg-[#080C14] px-4 py-2.5 text-sm text-gray-600 placeholder:text-gray-700 resize-none"
          />
          <p className="mt-1.5 text-[10px] text-gray-600">
            Plain text or Markdown. HTML is not supported. No file embeds in this phase.
          </p>
        </div>

        {/* Tags */}
        <div>
          <label className="mb-1.5 block text-[10px] font-semibold uppercase tracking-[0.2em] text-gray-400">
            Tags (comma-separated)
          </label>
          <input
            disabled
            type="text"
            placeholder="e.g. troptions, web3, creator-economy"
            className="w-full cursor-not-allowed rounded-lg border border-gray-700 bg-[#080C14] px-4 py-2.5 text-sm text-gray-600 placeholder:text-gray-700"
          />
        </div>

        {/* Rights declaration */}
        <div className="rounded-xl border border-gray-800 bg-[#0D1520] p-5">
          <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.3em] text-gray-400">Rights Declaration</p>
          <label className="flex cursor-not-allowed items-start gap-3">
            <input disabled type="checkbox" className="mt-0.5 cursor-not-allowed" />
            <span className="text-xs text-gray-600">
              I confirm I am the original author of this content. I grant TTN a non-exclusive license
              to publish it on the platform. I understand that a signed creator agreement is required.
            </span>
          </label>
        </div>

        <button
          disabled
          type="submit"
          className="w-full cursor-not-allowed rounded-xl border border-gray-700 bg-[#0F1923] px-6 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-gray-600"
        >
          Submit for Review — Simulation Only
        </button>
      </form>
    </div>
  );
}
