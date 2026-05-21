import type { Metadata } from "next";
import Link from "next/link";
import { TROPTIONS_MEMBERSHIP_PLANS } from "@/content/troptions-cloud/membershipRegistry";

export const metadata: Metadata = {
  title: "Issue Access — Troptions Onboarding",
  description: "Review your Troptions Cloud access grants and enabled modules.",
};

// Show the member plan as the example reference
const examplePlan = TROPTIONS_MEMBERSHIP_PLANS.find((p) => p.tier === "member")!;

export default function IssueAccessPage() {
  return (
    <div className="min-h-screen bg-[#080C14] text-white px-6 py-16">
      <div className="mx-auto max-w-3xl">
        {/* Breadcrumb */}
        <nav className="mb-8 text-[10px] uppercase tracking-[0.2em] text-gray-500">
          <Link href="/troptions/onboarding" className="hover:text-white transition-colors">Onboarding</Link>
          <span className="mx-2">/</span>
          <Link href="/troptions/onboarding/choose-plan" className="hover:text-white transition-colors">Choose Plan</Link>
          <span className="mx-2">/</span>
          <span className="text-white">Issue Access</span>
        </nav>

        <div className="mb-8">
          <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.4em] text-[#C9A84C]">Step 3 of 3</p>
          <h1 className="text-2xl font-bold text-white">Review your access</h1>
          <p className="mt-2 text-sm text-gray-400">
            Once your account is created and your plan is active, the following access grants will be
            issued to your namespace.
          </p>
        </div>

        {/* Simulation Banner */}
        <div className="mb-8 rounded-xl border border-yellow-800/50 bg-yellow-900/10 p-4">
          <p className="text-xs font-semibold text-yellow-400 uppercase tracking-[0.2em] mb-1">Simulation Only</p>
          <p className="text-xs text-yellow-300/80">
            Access issuance is non-functional in this phase. This is a preview of the access grant flow
            based on the example Member plan.
          </p>
        </div>

        {/* Example Access Grant Summary */}
        <div className="rounded-xl border border-gray-800 bg-[#0F1923] p-6 mb-6">
          <p className="mb-4 text-[10px] font-semibold uppercase tracking-[0.3em] text-gray-400">
            Example Access Grant — {examplePlan.displayName} Plan
          </p>

          <div className="space-y-3">
            {/* Modules enabled */}
            <div>
              <p className="text-[10px] uppercase tracking-[0.2em] text-gray-500 mb-2">Enabled Modules</p>
              <ul className="space-y-1.5">
                {examplePlan.aiStudioEnabled && (
                  <li className="flex items-center gap-2 text-sm text-gray-300">
                    <span className="text-[#C9A84C]">✓</span> Troptions AI Studio
                  </li>
                )}
                {examplePlan.proofVaultEnabled && (
                  <li className="flex items-center gap-2 text-sm text-gray-300">
                    <span className="text-[#C9A84C]">✓</span> Proof Vault
                  </li>
                )}
                {examplePlan.educationLibraryEnabled && (
                  <li className="flex items-center gap-2 text-sm text-gray-300">
                    <span className="text-[#C9A84C]">✓</span> Education Library
                  </li>
                )}
              </ul>
            </div>

            {/* Namespaces */}
            <div className="pt-3 border-t border-gray-800">
              <p className="text-[10px] uppercase tracking-[0.2em] text-gray-500 mb-1">Namespaces</p>
              <p className="text-sm text-gray-300">{examplePlan.namespacesAllowed === -1 ? "Unlimited" : examplePlan.namespacesAllowed} namespace{examplePlan.namespacesAllowed !== 1 ? "s" : ""}</p>
            </div>

            {/* Safety flags */}
            <div className="pt-3 border-t border-gray-800">
              <p className="text-[10px] uppercase tracking-[0.2em] text-gray-500 mb-2">Safety flags (always enforced)</p>
              <ul className="space-y-1">
                <li className="flex items-center gap-2 text-xs text-gray-400">
                  <span className="text-yellow-500">⚠</span> Simulation Only — no live execution
                </li>
                <li className="flex items-center gap-2 text-xs text-gray-400">
                  <span className="text-yellow-500">⚠</span> Live trading disabled
                </li>
                <li className="flex items-center gap-2 text-xs text-gray-400">
                  <span className="text-yellow-500">⚠</span> Live investment access disabled
                </li>
                <li className="flex items-center gap-2 text-xs text-gray-400">
                  <span className="text-yellow-500">⚠</span> Opportunity Room requires legal eligibility review
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Restrictions */}
        <div className="rounded-xl border border-gray-800 bg-[#0F1923] p-5 mb-8">
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-gray-500 mb-3">Restrictions</p>
          <ul className="space-y-2">
            <li className="text-xs text-gray-500">
              AI System Builder requires Professional or Enterprise plan.
            </li>
            <li className="text-xs text-gray-500">
              Healthcare Workspace requires Enterprise plan + BAA + Control Hub approval.
            </li>
            <li className="text-xs text-gray-500">
              Opportunity Room access requires individual legal eligibility review regardless of plan.
            </li>
          </ul>
        </div>

        <div className="rounded-xl border border-yellow-800/30 bg-yellow-900/5 p-4 mb-8">
          <p className="text-xs text-yellow-300/70 leading-relaxed">
            Troptions Cloud access grants are tied to your membership plan and namespace.
            Access does not constitute ownership, investment, or financial product enrollment.
            All features are simulation-only until production launch.
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <button
            disabled
            className="flex-1 cursor-not-allowed rounded-lg border border-gray-700 bg-[#080C14] px-6 py-3 text-sm font-semibold text-gray-600"
          >
            Issue Access Grant — Simulation Only
          </button>
          <Link
            href="/troptions-cloud"
            className="flex-1 text-center rounded-lg border border-gray-700 bg-[#0F1923] px-6 py-3 text-sm text-gray-400 hover:text-white hover:border-gray-600 transition-colors"
          >
            Go to Troptions Cloud →
          </Link>
        </div>
      </div>
    </div>
  );
}
