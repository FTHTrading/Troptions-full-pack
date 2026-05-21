import type { Metadata } from "next";
import Link from "next/link";
import { ComplianceNotice } from "@/components/troptions/ComplianceNotice";

export const metadata: Metadata = {
  title: "Trust & Transparency — TROPTIONS",
  description:
    "How TROPTIONS operates, what is real, what is in development, and what clients can rely on.",
  openGraph: {
    title: "TROPTIONS Trust & Transparency",
    description:
      "What TROPTIONS builds, how engagements work, and what clients can count on.",
  },
};

export default function TrustPage() {
  return (
    <main className="min-h-screen bg-[#071426] text-white">
      <div className="border-b border-[#C9A84C]/20">
        <div className="mx-auto max-w-3xl px-6 py-12">
          <p className="text-[10px] font-semibold uppercase tracking-[0.4em] text-[#C9A84C]">
            TROPTIONS
          </p>
          <h1 className="mt-3 text-4xl font-bold text-white">Trust & Transparency</h1>
          <p className="mt-3 text-sm text-slate-300 leading-relaxed">
            How we operate, what is live, what is in progress, and what you can rely on
            as a TROPTIONS client.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-6 py-12 space-y-10">
        {/* What TROPTIONS Is */}
        <section>
          <h2 className="text-lg font-bold text-white mb-3">What TROPTIONS Is</h2>
          <div className="rounded-xl border border-white/10 bg-white/5 p-6 space-y-3 text-sm text-slate-300 leading-relaxed">
            <p>
              TROPTIONS is a technology services company that builds platforms, portals,
              AI systems, and digital infrastructure for businesses, institutions, sponsors,
              and operators.
            </p>
            <p>
              We design, scope, and deliver real systems. Every engagement starts with a
              written scope and ends with documented deliverables.
            </p>
            <p>
              We also maintain an ecosystem of Web3, blockchain, and financial infrastructure
              capabilities that are in various stages of design, development, and compliance
              review. These are labeled clearly on each page.
            </p>
          </div>
        </section>

        {/* What Is Live */}
        <section>
          <h2 className="text-lg font-bold text-white mb-3">What Is Operational Today</h2>
          <ul className="space-y-2">
            {[
              "Client inquiry and intake system",
              "Booking request system",
              "Service scoping and delivery process",
              "Admin review and lead management",
              "Platform design, build, and deployment",
              "AI system design and integration",
              "Cloud namespace architecture",
              "Sponsor activation systems",
              "Media and NIL platform setup",
              "Trade desk readiness documentation",
            ].map((item) => (
              <li key={item} className="flex items-start gap-2 text-sm text-slate-300">
                <span className="text-emerald-400 mt-0.5 shrink-0">✓</span>
                {item}
              </li>
            ))}
          </ul>
        </section>

        {/* What Requires Review */}
        <section>
          <h2 className="text-lg font-bold text-white mb-3">What Requires Additional Review</h2>
          <ComplianceNotice />
          <ul className="mt-4 space-y-2">
            {[
              "Live token issuance or token sales",
              "Real-world asset (RWA) tokenization on-chain",
              "Stablecoin issuance or backing",
              "Escrow or custody with financial institution involvement",
              "Live trading desk operations",
              "XRPL or Stellar mainnet financial operations",
              "Securities offerings or broker-dealer services",
              "Accredited investor or KYC-required onboarding",
            ].map((item) => (
              <li key={item} className="flex items-start gap-2 text-sm text-slate-400">
                <span className="text-orange-400 mt-0.5 shrink-0">!</span>
                {item} — requires legal, compliance, and custody review
              </li>
            ))}
          </ul>
        </section>

        {/* How We Work */}
        <section>
          <h2 className="text-lg font-bold text-white mb-3">How Engagements Work</h2>
          <div className="grid gap-4 md:grid-cols-2 text-sm text-slate-300">
            {[
              {
                title: "Scope First",
                body: "Every engagement begins with a written scope of work. We do not start billing before you sign off on scope.",
              },
              {
                title: "Milestone Invoicing",
                body: "Payments are milestone-based. Typically 30–50% deposit at start, balance at delivery. No surprise charges.",
              },
              {
                title: "Documented Delivery",
                body: "Every engagement ends with a delivery packet: documentation, walkthrough, and handoff notes.",
              },
              {
                title: "No Misleading Claims",
                body: "We label everything clearly: what is live, what is in development, and what requires compliance review.",
              },
            ].map(({ title, body }) => (
              <div key={title} className="rounded-lg border border-white/10 bg-white/5 p-4">
                <p className="font-semibold text-white mb-1">{title}</p>
                <p className="leading-relaxed">{body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <div className="text-center pt-6 border-t border-white/10 space-y-4">
          <p className="text-slate-400 text-sm">Questions about how we work?</p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link
              href="/troptions/contact"
              className="rounded-lg bg-[#C9A84C] px-5 py-2.5 text-sm font-semibold text-[#071426] hover:bg-[#e0bd6a] transition"
            >
              Contact Us
            </Link>
            <Link
              href="/troptions/disclaimers"
              className="rounded-lg border border-white/20 px-5 py-2.5 text-sm font-semibold text-white hover:bg-white/10 transition"
            >
              Legal Disclaimers
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
