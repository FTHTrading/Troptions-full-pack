import type { Metadata } from "next";
import Link from "next/link";
import { SystemStatusBadge } from "@/components/troptions/SystemStatusBadge";

export const metadata: Metadata = {
  title: "Client Onboarding — TROPTIONS",
  description:
    "Start your TROPTIONS client engagement: business intake, use-case review, compliance check, build scope, deposit, and delivery dashboard.",
  openGraph: {
    title: "TROPTIONS Client Onboarding",
    description:
      "A structured 6-step onboarding process for new TROPTIONS clients.",
  },
};

const STEPS = [
  {
    number: "01",
    title: "Business Intake",
    status: "Intake Open" as const,
    description:
      "Tell us about your business: what you do, who you serve, your current digital infrastructure, and what you're trying to build or solve.",
    action: "Submit your inquiry",
    href: "/troptions/contact",
  },
  {
    number: "02",
    title: "Use-Case Review",
    status: "Client Ready" as const,
    description:
      "The TROPTIONS team reviews your intake, qualifies your use case, and identifies the right service tier and scope for your needs. Typically happens within 1–2 business days.",
    action: null,
    href: null,
  },
  {
    number: "03",
    title: "Compliance & Document Review",
    status: "Client Ready" as const,
    description:
      "Depending on your use case, we review business registration, ownership structure, and any applicable compliance requirements. RWA, token, and escrow use cases require additional review.",
    action: null,
    href: null,
  },
  {
    number: "04",
    title: "Build Scope",
    status: "Client Ready" as const,
    description:
      "We finalize a scope of work: deliverables, timeline, milestones, and pricing. You receive a written scope before any engagement begins.",
    action: null,
    href: null,
  },
  {
    number: "05",
    title: "Deposit & Invoice",
    status: "Client Ready" as const,
    description:
      "A deposit invoice (typically 30–50%) is issued to confirm the engagement. Work begins after deposit is received. Milestone invoices follow at agreed delivery points.",
    action: "Review payment options",
    href: "/troptions/payments",
  },
  {
    number: "06",
    title: "Delivery Dashboard",
    status: "In Development" as const,
    description:
      "Clients receive access to a delivery dashboard to track progress, review deliverables, and communicate with the team. This feature is in development and will be available for engagements starting Q3 2026.",
    action: null,
    href: null,
  },
];

export default function ClientOnboardingPage() {
  return (
    <main className="min-h-screen bg-[#071426] text-white">
      {/* Header */}
      <div className="border-b border-[#C9A84C]/20">
        <div className="mx-auto max-w-4xl px-6 py-12">
          <p className="text-[10px] font-semibold uppercase tracking-[0.4em] text-[#C9A84C]">
            TROPTIONS
          </p>
          <h1 className="mt-3 text-4xl font-bold text-white">Client Onboarding</h1>
          <p className="mt-3 text-sm text-slate-300 leading-relaxed max-w-xl">
            A structured 6-step process from first contact to delivered platform. Every
            engagement is scoped and documented before work begins.
          </p>
          <div className="mt-6">
            <Link
              href="/troptions/contact"
              className="inline-flex items-center rounded-lg bg-[#C9A84C] px-5 py-2.5 text-sm font-semibold text-[#071426] hover:bg-[#e0bd6a] transition"
            >
              Start Client Intake →
            </Link>
          </div>
        </div>
      </div>

      {/* Steps */}
      <div className="mx-auto max-w-4xl px-6 py-12">
        <div className="space-y-4">
          {STEPS.map((step, i) => (
            <div
              key={step.number}
              className="flex gap-6 rounded-xl border border-white/10 bg-white/5 p-6"
            >
              {/* Step number */}
              <div className="shrink-0 w-12 text-right">
                <span className="text-3xl font-bold text-white/20">{step.number}</span>
              </div>

              {/* Content */}
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-3 mb-2">
                  <h2 className="text-base font-bold text-white">{step.title}</h2>
                  <SystemStatusBadge status={step.status} size="sm" />
                </div>
                <p className="text-sm text-slate-300 leading-relaxed">{step.description}</p>
                {step.action && step.href && (
                  <div className="mt-3">
                    <Link
                      href={step.href}
                      className="text-xs text-[#C9A84C] hover:underline font-semibold"
                    >
                      {step.action} →
                    </Link>
                  </div>
                )}
              </div>

              {/* Connector line */}
              {i < STEPS.length - 1 && (
                <div className="hidden md:block absolute ml-6 mt-20 h-6 w-px bg-white/10" />
              )}
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-10 rounded-xl border border-[#C9A84C]/30 bg-[#C9A84C]/5 p-8 text-center">
          <h2 className="text-xl font-bold text-white mb-3">Ready to Start?</h2>
          <p className="text-sm text-slate-300 mb-6 max-w-md mx-auto">
            Submit an inquiry and the TROPTIONS team will reach out to begin your intake
            within 1 business day.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link
              href="/troptions/contact"
              className="rounded-lg bg-[#C9A84C] px-6 py-3 text-sm font-semibold text-[#071426] hover:bg-[#e0bd6a] transition"
            >
              Submit Inquiry
            </Link>
            <Link
              href="/troptions/book"
              className="rounded-lg border border-[#C9A84C]/50 px-6 py-3 text-sm font-semibold text-[#C9A84C] hover:bg-[#C9A84C]/10 transition"
            >
              Book a Call
            </Link>
            <Link
              href="/troptions/pricing"
              className="rounded-lg border border-white/20 px-6 py-3 text-sm font-semibold text-white hover:bg-white/10 transition"
            >
              View Pricing
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
