import type { Metadata } from "next";
import Link from "next/link";
import { TROPTIONS_MEMBERSHIP_PLANS, MEMBERSHIP_TIER_LABELS } from "@/content/troptions-cloud/membershipRegistry";

export const metadata: Metadata = {
  title: "Choose a Plan — Troptions Onboarding",
  description: "Select a Troptions Cloud membership plan.",
};

export default function ChoosePlanPage() {
  return (
    <div className="min-h-screen bg-[#080C14] text-white px-6 py-16">
      <div className="mx-auto max-w-5xl">
        {/* Breadcrumb */}
        <nav className="mb-8 text-[10px] uppercase tracking-[0.2em] text-gray-500">
          <Link href="/troptions/onboarding" className="hover:text-white transition-colors">Onboarding</Link>
          <span className="mx-2">/</span>
          <Link href="/troptions/onboarding/create-namespace" className="hover:text-white transition-colors">Namespace</Link>
          <span className="mx-2">/</span>
          <span className="text-white">Choose Plan</span>
        </nav>

        <div className="mb-8">
          <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.4em] text-[#C9A84C]">Step 2 of 3</p>
          <h1 className="text-2xl font-bold text-white">Choose your membership plan</h1>
          <p className="mt-2 text-sm text-gray-400 max-w-2xl">
            Membership dues unlock platform tool access. Plans do not constitute an investment,
            financial product, or securities offering.
          </p>
        </div>

        {/* Simulation Banner */}
        <div className="mb-8 rounded-xl border border-yellow-800/50 bg-yellow-900/10 p-4">
          <p className="text-xs font-semibold text-yellow-400 uppercase tracking-[0.2em] mb-1">Simulation Only</p>
          <p className="text-xs text-yellow-300/80">
            Plan selection and payment processing are non-functional in this phase. No charges will occur.
          </p>
        </div>

        {/* Plans Grid */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 mb-10">
          {TROPTIONS_MEMBERSHIP_PLANS.map((plan) => (
            <div key={plan.id} className="rounded-xl border border-gray-800 bg-[#0F1923] p-5 flex flex-col">
              <div className="mb-4">
                <span className="rounded-full bg-[#C9A84C]/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#C9A84C]">
                  {MEMBERSHIP_TIER_LABELS[plan.tier]}
                </span>
              </div>

              <h2 className="text-lg font-bold text-white mb-1">{plan.displayName}</h2>

              <div className="mb-3">
                {plan.monthlyDues === null ? (
                  <p className="text-[#C9A84C] font-semibold">Contact for pricing</p>
                ) : plan.monthlyDues === 0 ? (
                  <p className="text-gray-300 font-semibold">Free</p>
                ) : (
                  <p className="text-gray-300">
                    <span className="text-2xl font-bold text-white">${plan.monthlyDues}</span>
                    <span className="text-sm text-gray-500">/mo</span>
                  </p>
                )}
              </div>

              <p className="text-xs text-gray-400 mb-4 flex-1">{plan.description}</p>

              {/* Perks */}
              {plan.perks.length > 0 && (
                <ul className="mb-5 space-y-1.5">
                  {plan.perks.map((perk) => (
                    <li key={perk.id} className="flex items-start gap-2 text-xs text-gray-400">
                      <span className="text-[#C9A84C] shrink-0 mt-0.5">✓</span>
                      {perk.label}
                    </li>
                  ))}
                </ul>
              )}

              {/* Restrictions callout */}
              {plan.restrictions.length > 0 && (
                <div className="mb-4 rounded-lg border border-gray-700/50 bg-[#080C14] p-3">
                  {plan.restrictions.map((r) => (
                    <p key={r.module} className="text-[10px] text-gray-500">{r.reason}</p>
                  ))}
                </div>
              )}

              <button
                disabled
                className="mt-auto w-full cursor-not-allowed rounded-lg border border-gray-700 bg-[#080C14] px-4 py-2.5 text-sm font-semibold text-gray-600"
              >
                Select — Simulation Only
              </button>
            </div>
          ))}
        </div>

        {/* Disclaimer */}
        <div className="rounded-xl border border-gray-800 bg-[#0F1923] p-5 mb-8">
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-gray-500 mb-2">Important notice</p>
          <p className="text-xs text-gray-500 leading-relaxed">
            Membership dues unlock access to Troptions Cloud platform tools only. Membership does not
            constitute an investment, financial product, securities offering, or guarantee of any returns,
            yield, or profit. Opportunity Room access requires individual legal eligibility review and
            is not guaranteed by any membership tier.
          </p>
        </div>

        <div className="flex justify-between">
          <Link
            href="/troptions/onboarding/create-namespace"
            className="rounded-lg border border-gray-700 bg-[#0F1923] px-6 py-2.5 text-sm text-gray-400 hover:text-white hover:border-gray-600 transition-colors"
          >
            ← Back: Namespace
          </Link>
          <Link
            href="/troptions/onboarding/issue-access"
            className="rounded-lg border border-gray-700 bg-[#0F1923] px-6 py-2.5 text-sm text-gray-400 hover:text-white hover:border-gray-600 transition-colors"
          >
            Next: Issue Access →
          </Link>
        </div>
      </div>
    </div>
  );
}
