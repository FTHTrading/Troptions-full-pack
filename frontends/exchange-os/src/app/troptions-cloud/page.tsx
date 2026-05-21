import type { Metadata } from "next";
import Link from "next/link";
import { getActiveNamespaces, NAMESPACE_PLAN_LABELS, NAMESPACE_STATUS_LABELS, NAMESPACE_MODULE_LABELS } from "@/content/troptions-cloud/namespaceRegistry";

export const metadata: Metadata = {
  title: "Troptions Cloud",
  description: "Your Troptions Cloud namespaces and tools.",
};

export default function TroptionsCloudPage() {
  const namespaces = getActiveNamespaces();

  return (
    <div className="min-h-screen bg-[#080C14] text-white px-6 py-16">
      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <div className="mb-10">
          <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.4em] text-[#C9A84C]">Troptions</p>
          <h1 className="text-3xl font-bold text-white">Troptions Cloud</h1>
          <p className="mt-3 text-sm text-gray-400 max-w-2xl leading-relaxed">
            Manage your Troptions namespaces, AI tools, media production, proof vault, business workspace,
            and Control Hub from one place.
          </p>
        </div>

        {/* Simulation Banner */}
        <div className="mb-8 rounded-xl border border-yellow-800/50 bg-yellow-900/10 p-4">
          <p className="text-xs font-semibold text-yellow-400 uppercase tracking-[0.2em] mb-1">Simulation Only</p>
          <p className="text-xs text-yellow-300/80">
            All Troptions Cloud features are simulation-only. No live execution, trading, or investment operations are enabled.
          </p>
        </div>

        {/* Namespaces Grid */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 mb-12">
          {namespaces.map((ns) => (
            <Link
              key={ns.id}
              href={`/troptions-cloud/${ns.slug}`}
              className="block rounded-xl border border-gray-800 bg-[#0F1923] p-5 hover:border-[#C9A84C]/30 transition-colors"
            >
              <div className="mb-3 flex items-start justify-between gap-2">
                <span className="rounded-full bg-[#C9A84C]/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#C9A84C]">
                  {NAMESPACE_PLAN_LABELS[ns.plan]}
                </span>
                <span className="rounded-full bg-gray-800 px-2 py-0.5 text-[10px] text-gray-500">
                  {NAMESPACE_STATUS_LABELS[ns.status]}
                </span>
              </div>

              <h2 className="text-base font-bold text-white mb-1">{ns.displayName}</h2>
              <p className="text-[10px] font-mono text-gray-500 mb-2">{ns.slug}</p>
              <p className="text-xs text-gray-400 mb-4 line-clamp-2">{ns.description}</p>

              {ns.enabledModules.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {ns.enabledModules.slice(0, 3).map((m) => (
                    <span key={m} className="rounded-full bg-gray-800 px-2 py-0.5 text-[10px] text-gray-400">
                      {NAMESPACE_MODULE_LABELS[m]}
                    </span>
                  ))}
                  {ns.enabledModules.length > 3 && (
                    <span className="rounded-full bg-gray-800 px-2 py-0.5 text-[10px] text-gray-500">
                      +{ns.enabledModules.length - 3}
                    </span>
                  )}
                </div>
              )}
            </Link>
          ))}

          {/* Create namespace CTA */}
          <div className="rounded-xl border border-dashed border-gray-700 bg-transparent p-5 flex flex-col items-center justify-center text-center">
            <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-gray-600 mb-2">Add Namespace</p>
            <Link
              href="/troptions/onboarding/create-namespace"
              className="rounded-lg border border-gray-700 bg-[#0F1923] px-4 py-2 text-xs text-gray-400 hover:text-white hover:border-gray-600 transition-colors"
            >
              Start Onboarding
            </Link>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <p className="mb-4 text-[10px] font-semibold uppercase tracking-[0.3em] text-gray-500">Quick Access</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: "AI Studio", href: "/troptions-cloud/troptions/ai" },
              { label: "Proof Vault", href: "/troptions-cloud/troptions/proof" },
              { label: "Media Studio", href: "/troptions-cloud/troptions-tv/media" },
              { label: "Control Hub", href: "/troptions-cloud/troptions-enterprise/settings" },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-xl border border-gray-800 bg-[#0F1923] p-4 text-center hover:border-[#C9A84C]/30 transition-colors"
              >
                <p className="text-xs font-semibold text-gray-300">{link.label}</p>
              </Link>
            ))}
          </div>
        </div>

        <p className="mt-12 text-[10px] text-gray-600 leading-relaxed max-w-xl">
          Troptions Cloud provides access to platform tools only. Membership does not constitute
          an investment, financial product, or securities offering. All features are simulation-only.
        </p>
      </div>
    </div>
  );
}
