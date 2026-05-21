import type { Metadata } from "next";
import Link from "next/link";
import { TROPTIONS_NAMESPACES, NAMESPACE_MODULE_LABELS } from "@/content/troptions-cloud/namespaceRegistry";

export const metadata: Metadata = {
  title: "Create Namespace — Troptions Onboarding",
  description: "Choose a Troptions Cloud namespace for your account.",
};

export default function CreateNamespacePage() {
  const examples = TROPTIONS_NAMESPACES.slice(0, 5);

  return (
    <div className="min-h-screen bg-[#080C14] text-white px-6 py-16">
      <div className="mx-auto max-w-3xl">
        {/* Breadcrumb */}
        <nav className="mb-8 text-[10px] uppercase tracking-[0.2em] text-gray-500">
          <Link href="/troptions/onboarding" className="hover:text-white transition-colors">Onboarding</Link>
          <span className="mx-2">/</span>
          <span className="text-white">Create Namespace</span>
        </nav>

        <div className="mb-8">
          <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.4em] text-[#C9A84C]">Step 1 of 3</p>
          <h1 className="text-2xl font-bold text-white">Create your namespace</h1>
          <p className="mt-2 text-sm text-gray-400">
            A Troptions Cloud namespace is your private workspace on the platform. It controls which modules
            your team can access and organizes your content, AI tools, and proof records.
          </p>
        </div>

        {/* Simulation Banner */}
        <div className="mb-8 rounded-xl border border-yellow-800/50 bg-yellow-900/10 p-4">
          <p className="text-xs font-semibold text-yellow-400 uppercase tracking-[0.2em] mb-1">Simulation Only</p>
          <p className="text-xs text-yellow-300/80">
            Namespace creation is non-functional in this phase. No namespace will be issued.
          </p>
        </div>

        {/* Namespace Form */}
        <div className="rounded-xl border border-gray-800 bg-[#0F1923] p-6 mb-8">
          <div className="space-y-5">
            <div>
              <label className="mb-1.5 block text-[10px] font-semibold uppercase tracking-[0.2em] text-gray-400">
                Namespace Slug
              </label>
              <input
                disabled
                type="text"
                placeholder="e.g. troptions-media"
                className="w-full cursor-not-allowed rounded-lg border border-gray-700 bg-[#080C14] px-4 py-2.5 text-sm text-gray-600"
              />
              <p className="mt-1 text-[10px] text-gray-600">Must start with &quot;troptions-&quot; or use a Troptions-approved prefix.</p>
            </div>
            <div>
              <label className="mb-1.5 block text-[10px] font-semibold uppercase tracking-[0.2em] text-gray-400">
                Display Name
              </label>
              <input
                disabled
                type="text"
                placeholder="e.g. Troptions Media"
                className="w-full cursor-not-allowed rounded-lg border border-gray-700 bg-[#080C14] px-4 py-2.5 text-sm text-gray-600"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-[10px] font-semibold uppercase tracking-[0.2em] text-gray-400">
                Description
              </label>
              <textarea
                disabled
                rows={3}
                placeholder="What will this namespace be used for?"
                className="w-full cursor-not-allowed rounded-lg border border-gray-700 bg-[#080C14] px-4 py-2.5 text-sm text-gray-600 resize-none"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-[10px] font-semibold uppercase tracking-[0.2em] text-gray-400">
                Namespace Type
              </label>
              <select
                disabled
                className="w-full cursor-not-allowed rounded-lg border border-gray-700 bg-[#080C14] px-4 py-2.5 text-sm text-gray-600"
              >
                <option>Personal</option>
                <option>Business</option>
                <option>Media</option>
                <option>Healthcare</option>
                <option>Enterprise</option>
              </select>
            </div>
            <button
              disabled
              className="w-full cursor-not-allowed rounded-lg border border-gray-700 bg-[#080C14] px-4 py-3 text-sm font-semibold text-gray-600"
            >
              Create Namespace — Simulation Only
            </button>
          </div>
        </div>

        {/* Example Namespaces */}
        <div>
          <p className="mb-4 text-[10px] font-semibold uppercase tracking-[0.3em] text-gray-400">Example Troptions namespaces</p>
          <div className="space-y-3">
            {examples.map((ns) => (
              <div key={ns.id} className="rounded-xl border border-gray-800 bg-[#0F1923] p-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold text-white">{ns.displayName}</p>
                    <p className="text-xs text-gray-500 mt-0.5 font-mono">{ns.slug}</p>
                    <p className="text-xs text-gray-500 mt-1">{ns.description}</p>
                  </div>
                  <span className="shrink-0 rounded-full bg-[#C9A84C]/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#C9A84C]">
                    {ns.plan}
                  </span>
                </div>
                {ns.enabledModules.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {ns.enabledModules.slice(0, 4).map((m) => (
                      <span key={m} className="rounded-full bg-gray-800 px-2 py-0.5 text-[10px] text-gray-400">
                        {NAMESPACE_MODULE_LABELS[m]}
                      </span>
                    ))}
                    {ns.enabledModules.length > 4 && (
                      <span className="rounded-full bg-gray-800 px-2 py-0.5 text-[10px] text-gray-500">
                        +{ns.enabledModules.length - 4} more
                      </span>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 flex justify-end">
          <Link
            href="/troptions/onboarding/choose-plan"
            className="rounded-lg border border-gray-700 bg-[#0F1923] px-6 py-2.5 text-sm text-gray-400 hover:text-white hover:border-gray-600 transition-colors"
          >
            Next: Choose a Plan →
          </Link>
        </div>
      </div>
    </div>
  );
}
