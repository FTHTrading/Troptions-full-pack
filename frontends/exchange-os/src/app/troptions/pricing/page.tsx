import type { Metadata } from "next";
import Link from "next/link";
import { SERVICE_PACKAGES, formatPackagePrice } from "@/lib/troptions/revenue";

export const metadata: Metadata = {
  title: "Pricing — TROPTIONS",
  description:
    "TROPTIONS service pricing: Starter Client Setup from $2,500, Growth System Build from $10,000, Institutional Platform Sprint from $50,000, and Enterprise Custom quotes.",
  openGraph: {
    title: "TROPTIONS Pricing",
    description:
      "Transparent starting-price tiers for TROPTIONS services. From starter setup to institutional platform builds.",
  },
};

export default function PricingPage() {
  return (
    <main className="min-h-screen bg-[#071426] text-white">
      {/* Header */}
      <div className="border-b border-[#C9A84C]/20">
        <div className="mx-auto max-w-5xl px-6 py-12 text-center">
          <p className="text-[10px] font-semibold uppercase tracking-[0.4em] text-[#C9A84C]">
            TROPTIONS Platform
          </p>
          <h1 className="mt-3 text-4xl font-bold text-white md:text-5xl">Pricing</h1>
          <p className="mt-4 max-w-xl mx-auto text-sm text-slate-300 leading-relaxed">
            Transparent starting points for real engagements. Every project is scoped before
            final pricing is confirmed. No surprises.
          </p>
        </div>
      </div>

      {/* Pricing cards */}
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {SERVICE_PACKAGES.map((pkg) => (
            <div
              key={pkg.id}
              className={`flex flex-col rounded-xl border p-6 ${
                pkg.id === "institutional-platform-sprint"
                  ? "border-[#C9A84C]/50 bg-[#C9A84C]/5"
                  : "border-white/10 bg-white/5"
              }`}
            >
              {pkg.id === "institutional-platform-sprint" && (
                <div className="mb-3">
                  <span className="rounded-full bg-[#C9A84C] px-3 py-0.5 text-[10px] font-bold uppercase tracking-widest text-[#071426]">
                    Most Popular
                  </span>
                </div>
              )}
              <p className="text-[10px] font-semibold uppercase tracking-widest text-[#C9A84C] mb-2">
                {pkg.requiresQuote ? "Enterprise" : "Package"}
              </p>
              <h2 className="text-lg font-bold text-white leading-tight">{pkg.name}</h2>
              <p className="text-xs text-slate-400 mt-1 mb-4">{pkg.tagline}</p>

              <div className="my-4 pb-4 border-b border-white/10">
                <p className="text-2xl font-bold text-white">{formatPackagePrice(pkg)}</p>
                {!pkg.requiresQuote && (
                  <p className="text-[10px] text-slate-500 mt-1">+ scope-based adjustments</p>
                )}
              </div>

              <ul className="space-y-2 flex-1 mb-6">
                {pkg.includes.slice(0, 5).map((item) => (
                  <li key={item} className="flex items-start gap-1.5 text-xs text-slate-300">
                    <span className="text-emerald-400 shrink-0 mt-0.5">✓</span>
                    {item}
                  </li>
                ))}
                {pkg.includes.length > 5 && (
                  <li className="text-xs text-slate-500">
                    + {pkg.includes.length - 5} more included
                  </li>
                )}
              </ul>

              <Link
                href={`/troptions/contact?package=${pkg.id}`}
                className={`block rounded-lg px-4 py-2.5 text-center text-sm font-semibold transition ${
                  pkg.id === "institutional-platform-sprint"
                    ? "bg-[#C9A84C] text-[#071426] hover:bg-[#e0bd6a]"
                    : "border border-[#C9A84C]/50 text-[#C9A84C] hover:bg-[#C9A84C]/10"
                }`}
              >
                {pkg.cta}
              </Link>
            </div>
          ))}
        </div>

        {/* Comparison notes */}
        <div className="mt-12 rounded-xl border border-white/10 bg-white/5 p-6 md:p-8">
          <h2 className="text-lg font-bold text-white mb-4">How Pricing Works</h2>
          <div className="grid gap-6 md:grid-cols-3 text-sm text-slate-300 leading-relaxed">
            <div>
              <p className="font-semibold text-white mb-1">Starting Prices</p>
              <p>
                All prices shown are starting points. Final scope and cost are confirmed during
                a discovery call before any work begins.
              </p>
            </div>
            <div>
              <p className="font-semibold text-white mb-1">No Surprises</p>
              <p>
                TROPTIONS does not bill beyond agreed scope without a change order. Every
                engagement includes a delivery summary.
              </p>
            </div>
            <div>
              <p className="font-semibold text-white mb-1">Deposits</p>
              <p>
                Engagements are milestone-based. Deposits are typically 30–50% at
                engagement start. Enterprise projects are negotiated separately.
              </p>
            </div>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="mt-6 rounded-lg border border-yellow-800/40 bg-yellow-950/20 p-4">
          <p className="text-xs text-yellow-300/80 leading-relaxed">
            Pricing shown is for platform services, infrastructure design, and system builds.
            TROPTIONS does not offer securities, investment products, guaranteed returns, or
            live financial trading through these packages. All RWA, tokenization, escrow, and
            financial infrastructure items require separate legal, compliance, and custody review
            before any live use.
          </p>
        </div>

        {/* CTA row */}
        <div className="mt-10 text-center space-y-3">
          <p className="text-slate-400 text-sm">Not sure which tier fits your needs?</p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link
              href="/troptions/contact"
              className="rounded-lg bg-[#C9A84C] px-6 py-3 text-sm font-semibold text-[#071426] hover:bg-[#e0bd6a] transition"
            >
              Submit an Inquiry
            </Link>
            <Link
              href="/troptions/book"
              className="rounded-lg border border-[#C9A84C]/50 px-6 py-3 text-sm font-semibold text-[#C9A84C] hover:bg-[#C9A84C]/10 transition"
            >
              Book a Discovery Call
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
