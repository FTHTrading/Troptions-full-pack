import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Onboarding — Troptions Cloud",
  description: "Get started with Troptions Cloud — set up your namespace and choose a plan.",
};

const STEPS = [
  { href: "/troptions/onboarding/create-namespace", label: "1. Create Namespace", description: "Choose a Troptions Cloud namespace for your account." },
  { href: "/troptions/onboarding/choose-plan", label: "2. Choose a Plan", description: "Select the membership tier that fits your needs." },
  { href: "/troptions/onboarding/issue-access", label: "3. Issue Access", description: "Review your access grants and enabled modules." },
];

export default function OnboardingPage() {
  return (
    <div className="min-h-screen bg-[#080C14] text-white px-6 py-16">
      <div className="mx-auto max-w-3xl">
        {/* Header */}
        <div className="mb-10">
          <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.4em] text-[#C9A84C]">Troptions Cloud</p>
          <h1 className="text-3xl font-bold text-white">Welcome to Troptions Cloud</h1>
          <p className="mt-3 text-sm text-gray-400 leading-relaxed">
            Troptions Cloud gives you access to AI tools, media production, proof vault, business workspace,
            and the Control Hub — all within your own namespace.
          </p>
        </div>

        {/* Simulation Banner */}
        <div className="mb-8 rounded-xl border border-yellow-800/50 bg-yellow-900/10 p-4">
          <p className="text-xs font-semibold text-yellow-400 uppercase tracking-[0.2em] mb-1">Simulation Only</p>
          <p className="text-xs text-yellow-300/80">
            Onboarding is non-functional in this phase. No accounts, wallets, or tokens will be created.
            No payments will be processed. This is a scaffold for the registration flow.
          </p>
        </div>

        {/* Steps */}
        <div className="space-y-4 mb-10">
          {STEPS.map((step) => (
            <Link
              key={step.href}
              href={step.href}
              className="block rounded-xl border border-gray-800 bg-[#0F1923] p-5 hover:border-[#C9A84C]/30 transition-colors"
            >
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#C9A84C] mb-1">{step.label}</p>
              <p className="text-sm text-gray-300">{step.description}</p>
            </Link>
          ))}
        </div>

        {/* What Troptions Cloud includes */}
        <div className="rounded-xl border border-gray-800 bg-[#0F1923] p-6 mb-6">
          <p className="mb-4 text-[10px] font-semibold uppercase tracking-[0.3em] text-gray-400">What you get</p>
          <ul className="space-y-2 text-sm text-gray-400">
            <li className="flex items-start gap-2"><span className="text-[#C9A84C]">—</span>Troptions AI Studio (AI writing, content, proposal tools)</li>
            <li className="flex items-start gap-2"><span className="text-[#C9A84C]">—</span>Troptions AI System Builder (agent templates, Control Hub path)</li>
            <li className="flex items-start gap-2"><span className="text-[#C9A84C]">—</span>Troptions Media Studio (TTN creator tools)</li>
            <li className="flex items-start gap-2"><span className="text-[#C9A84C]">—</span>Troptions Proof Vault (IPFS document fingerprinting)</li>
            <li className="flex items-start gap-2"><span className="text-[#C9A84C]">—</span>Troptions Business Workspace (proposals, templates)</li>
            <li className="flex items-start gap-2"><span className="text-[#C9A84C]">—</span>Education &amp; Research Library</li>
            <li className="flex items-start gap-2"><span className="text-[#C9A84C]">—</span>Control Hub compliance review access</li>
          </ul>
        </div>

        {/* Disclaimer */}
        <p className="text-[10px] text-gray-600 leading-relaxed">
          Troptions Cloud membership provides access to platform tools only. Membership does not constitute
          an investment, financial product, or securities offering. Opportunity room access requires
          individual legal eligibility review and is not guaranteed by any membership tier.
        </p>
      </div>
    </div>
  );
}
