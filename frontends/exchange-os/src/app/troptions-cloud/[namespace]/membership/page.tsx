import type { Metadata } from "next";
import Link from "next/link";
import {
  TROPTIONS_NAMESPACES,
  getNamespace,
} from "@/content/troptions-cloud/namespaceRegistry";
import {
  TROPTIONS_MEMBERSHIP_PLANS,
  MEMBERSHIP_TIER_LABELS,
} from "@/content/troptions-cloud/membershipRegistry";

interface Props {
  params: Promise<{ namespace: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { namespace } = await params;
  return { title: `Membership — ${namespace} — Troptions Cloud` };
}

export async function generateStaticParams() {
  return TROPTIONS_NAMESPACES.map((n) => ({ namespace: n.slug }));
}

export default async function MembershipPage({ params }: Props) {
  const { namespace } = await params;
  const ns = getNamespace(namespace);

  return (
    <div className="px-6 py-10">
      <div className="mx-auto max-w-4xl">
        <div className="mb-6">
          <nav className="mb-4 text-[10px] uppercase tracking-[0.2em] text-gray-500">
            <Link href={`/troptions-cloud/${namespace}`} className="hover:text-white transition-colors">Dashboard</Link>
            <span className="mx-2">/</span>
            <span className="text-white">Membership</span>
          </nav>
          <h1 className="text-2xl font-bold text-white">Membership Plans</h1>
          <p className="mt-2 text-sm text-gray-400">Membership dues unlock platform tool access only.</p>
        </div>

        {/* Simulation Banner */}
        <div className="mb-8 rounded-xl border border-yellow-800/50 bg-yellow-900/10 p-4">
          <p className="text-xs font-semibold text-yellow-400 uppercase tracking-[0.2em] mb-1">Simulation Only</p>
          <p className="text-xs text-yellow-300/80">
            Membership management is non-functional in this phase. No payments will be processed.
          </p>
        </div>

        {/* Current namespace plan badge */}
        {ns && (
          <div className="mb-8 rounded-xl border border-gray-800 bg-[#0F1923] p-5">
            <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-gray-400 mb-2">
              Current namespace plan
            </p>
            <p className="text-xl font-bold text-white">{ns.plan}</p>
            <p className="text-xs text-gray-500 mt-1">{ns.displayName}</p>
          </div>
        )}

        {/* Plans */}
        <div className="space-y-4 mb-8">
          {TROPTIONS_MEMBERSHIP_PLANS.map((plan) => (
            <div key={plan.id} className="rounded-xl border border-gray-800 bg-[#0F1923] p-5">
              <div className="flex flex-wrap items-start justify-between gap-4 mb-3">
                <div>
                  <span className="rounded-full bg-[#C9A84C]/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#C9A84C]">
                    {MEMBERSHIP_TIER_LABELS[plan.tier]}
                  </span>
                  <h2 className="mt-2 text-base font-bold text-white">{plan.displayName}</h2>
                  <p className="text-xs text-gray-400 mt-1">{plan.description}</p>
                </div>
                <div className="text-right">
                  {plan.monthlyDues === null ? (
                    <p className="text-sm font-semibold text-[#C9A84C]">Contact for pricing</p>
                  ) : plan.monthlyDues === 0 ? (
                    <p className="text-sm font-semibold text-gray-300">Free</p>
                  ) : (
                    <p className="text-sm text-gray-300">
                      <span className="text-xl font-bold text-white">${plan.monthlyDues}</span>
                      <span className="text-gray-500">/mo</span>
                    </p>
                  )}
                </div>
              </div>

              {/* Perks */}
              {plan.perks.length > 0 && (
                <ul className="mb-3 space-y-1">
                  {plan.perks.map((perk) => (
                    <li key={perk.id} className="flex items-start gap-2 text-xs text-gray-400">
                      <span className="text-[#C9A84C] shrink-0 mt-0.5">✓</span>
                      {perk.label}
                    </li>
                  ))}
                </ul>
              )}

              {/* Restrictions */}
              {plan.restrictions.length > 0 && (
                <div className="rounded-lg border border-gray-700/50 bg-[#080C14] p-3 mb-3">
                  {plan.restrictions.map((r) => (
                    <p key={r.module} className="text-[10px] text-gray-500">{r.reason}</p>
                  ))}
                </div>
              )}

              <button
                disabled
                className="mt-1 cursor-not-allowed rounded-lg border border-gray-700 bg-[#080C14] px-4 py-2 text-xs font-semibold text-gray-600"
              >
                Select Plan — Simulation Only
              </button>
            </div>
          ))}
        </div>

        {/* Disclaimer */}
        <div className="rounded-xl border border-gray-800 bg-[#0F1923] p-5">
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-gray-500 mb-2">Important</p>
          <p className="text-xs text-gray-500 leading-relaxed">
            Membership dues unlock access to Troptions Cloud platform tools only. Membership does not
            constitute an investment, financial product, or securities offering. Opportunity Room access
            requires individual legal eligibility review regardless of tier. Membership does not guarantee
            access to investment opportunities.
          </p>
        </div>
      </div>
    </div>
  );
}
