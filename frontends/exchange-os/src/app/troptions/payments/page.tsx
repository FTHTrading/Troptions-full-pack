import type { Metadata } from "next";
import Link from "next/link";
import { getPaymentReadiness } from "@/lib/troptions/payments";

export const metadata: Metadata = {
  title: "Payments — TROPTIONS",
  description:
    "How TROPTIONS handles deposits, invoices, milestone payments, and enterprise quotes. Stripe-ready architecture without breaking the build.",
};

export default function PaymentsPage() {
  const readiness = getPaymentReadiness();

  return (
    <main className="min-h-screen bg-[#071426] text-white">
      <div className="border-b border-[#C9A84C]/20">
        <div className="mx-auto max-w-3xl px-6 py-12">
          <p className="text-[10px] font-semibold uppercase tracking-[0.4em] text-[#C9A84C]">
            TROPTIONS
          </p>
          <h1 className="mt-3 text-4xl font-bold text-white">Payments</h1>
          <p className="mt-3 text-sm text-slate-300 leading-relaxed">
            How TROPTIONS handles deposits, invoices, and milestone payments for client
            engagements.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-6 py-12 space-y-10">
        {/* Payment status */}
        <div
          className={`rounded-xl border p-6 ${
            readiness.stripeConfigured
              ? "border-emerald-700/50 bg-emerald-950/30"
              : "border-yellow-700/40 bg-yellow-950/20"
          }`}
        >
          <p className="text-[10px] uppercase tracking-widest font-bold mb-1 text-yellow-400">
            Current Payment Status
          </p>
          <p className="text-sm font-semibold text-white mb-2">
            {readiness.stripeConfigured ? "Live Payment Processing Active" : "Invoice Request Mode"}
          </p>
          <p className="text-sm text-slate-300 leading-relaxed">{readiness.message}</p>
        </div>

        {/* How it works */}
        <section>
          <h2 className="text-lg font-bold text-white mb-4">How Payments Work</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {[
              {
                title: "Deposits",
                body: "A 30–50% deposit invoice is issued at engagement start. Work begins after the deposit is received. Deposits confirm the scope of work.",
                icon: "💳",
              },
              {
                title: "Milestone Invoices",
                body: "Larger engagements are billed at agreed milestones — typically mid-project and at delivery. No surprise charges outside of agreed scope.",
                icon: "📋",
              },
              {
                title: "Custom Enterprise Quotes",
                body: "Enterprise and institutional engagements are priced per scope. Payment schedules are negotiated as part of the agreement.",
                icon: "🏢",
              },
              {
                title: "Invoice Request",
                body: "You can request an invoice through the contact form. Invoices are sent via email and are due per the terms on the invoice.",
                icon: "📧",
              },
            ].map(({ title, body, icon }) => (
              <div
                key={title}
                className="rounded-lg border border-white/10 bg-white/5 p-5"
              >
                <p className="text-xl mb-2">{icon}</p>
                <p className="font-semibold text-white text-sm mb-1">{title}</p>
                <p className="text-xs text-slate-300 leading-relaxed">{body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Payment methods */}
        <section>
          <h2 className="text-lg font-bold text-white mb-3">Accepted Payment Methods</h2>
          <div className="rounded-xl border border-white/10 bg-white/5 p-6 text-sm text-slate-300 space-y-2">
            <p className="flex items-center gap-2">
              <span className="text-emerald-400">✓</span>
              Bank wire / ACH transfer
            </p>
            <p className="flex items-center gap-2">
              <span className="text-emerald-400">✓</span>
              Business check (institutional engagements)
            </p>
            <p className="flex items-center gap-2">
              <span className={readiness.stripeConfigured ? "text-emerald-400" : "text-yellow-400"}>
                {readiness.stripeConfigured ? "✓" : "○"}
              </span>
              Credit/debit card via Stripe{" "}
              {!readiness.stripeConfigured && (
                <span className="text-xs text-yellow-400">(not yet activated)</span>
              )}
            </p>
            <p className="flex items-center gap-2">
              <span className="text-slate-500">–</span>
              <span className="text-slate-400">
                Crypto payments — available on request for select engagements
              </span>
            </p>
          </div>
        </section>

        {/* Activation guide (shown when not configured) */}
        {!readiness.stripeConfigured && readiness.activationSteps.length > 0 && (
          <section>
            <h2 className="text-lg font-bold text-white mb-3">
              Stripe Activation (Internal Reference)
            </h2>
            <div className="rounded-lg border border-white/10 bg-white/5 p-5">
              <p className="text-xs text-slate-400 mb-3">
                For the admin/dev team. See{" "}
                <code className="text-[#C9A84C]">docs/revenue/PAYMENT_READINESS.md</code>{" "}
                for full details.
              </p>
              <ol className="space-y-1.5 list-decimal list-inside">
                {readiness.activationSteps.map((step) => (
                  <li key={step} className="text-xs text-slate-300">
                    {step}
                  </li>
                ))}
              </ol>
            </div>
          </section>
        )}

        {/* Disclaimer */}
        <div className="rounded-lg border border-yellow-800/40 bg-yellow-950/20 p-4">
          <p className="text-xs text-yellow-300/80 leading-relaxed">
            TROPTIONS does not process live financial transactions, securities, tokens, or
            escrow through this website. Payments described here are for professional services.
            No live payment is processed unless explicitly confirmed and payment provider keys
            are configured.
          </p>
        </div>

        {/* CTA */}
        <div className="text-center space-y-4">
          <p className="text-slate-400 text-sm">Ready to start an engagement?</p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link
              href="/troptions/contact"
              className="rounded-lg bg-[#C9A84C] px-5 py-2.5 text-sm font-semibold text-[#071426] hover:bg-[#e0bd6a] transition"
            >
              Submit Inquiry
            </Link>
            <Link
              href="/troptions/pricing"
              className="rounded-lg border border-[#C9A84C]/50 px-5 py-2.5 text-sm font-semibold text-[#C9A84C] hover:bg-[#C9A84C]/10 transition"
            >
              View Pricing
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
