import { generateCrossRailReadinessReport } from "@/lib/troptions/xrpl-stellar/xrplStellarControlHubBridge";

export const metadata = {
  title: "Cross-Rail Readiness | Troptions",
  description:
    "Troptions cross-rail XRPL & Stellar readiness report — simulation-first governance posture, compliance gaps, and recommended next actions.",
};

export default function CrossRailPage() {
  const report = generateCrossRailReadinessReport();

  return (
    <main className="min-h-screen bg-[#0A0A0A] text-white">
      <div className="mx-auto max-w-5xl px-6 py-16 space-y-10">
        {/* Safety notice — must be prominent */}
        <div className="rounded-xl border border-red-700/40 bg-red-900/20 p-5 space-y-2">
          <p className="font-bold text-red-300 text-base">Important Disclosures</p>
          <ul className="text-sm text-red-200 space-y-1 list-disc list-inside">
            <li>Cross-rail settlement between XRPL and Stellar is <strong>simulation-only</strong>.</li>
            <li>No mainnet execution, no public network calls, no live bridge operations are enabled.</li>
            <li><strong>No guaranteed liquidity, yield, profit, or return</strong> is implied by any cross-rail route.</li>
            <li>All cross-rail operations require legal review, KYC/KYB, and operator approval before deployment.</li>
          </ul>
        </div>

        <header className="space-y-2">
          <p className="font-mono text-xs uppercase tracking-widest text-[#C9A84C]">
            Troptions — Cross-Rail Ecosystem
          </p>
          <h1 className="text-4xl font-bold">Cross-Rail Readiness</h1>
          <p className="max-w-2xl text-base text-slate-400 leading-7">
            The Troptions cross-rail layer unifies XRPL and Stellar asset governance under a
            single simulation-first policy framework. This report reflects the current readiness
            posture across both rails as of the time this page was generated.
          </p>
        </header>

        {/* ── Readiness Summary ─────────────────────────────────────────── */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold border-b border-slate-800 pb-3">
            Readiness Summary
          </h2>
          <p className="text-xs text-slate-500">
            Generated at: {report.generatedAt}
          </p>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {[
              { label: "XRPL Total", value: report.xrplAssetsTotal },
              { label: "XRPL Sim-Only", value: report.xrplAssetsSimulationOnly },
              { label: "Stellar Total", value: report.stellarAssetsTotal },
              { label: "Stellar Sim-Only", value: report.stellarAssetsSimulationOnly },
              { label: "Compliance Gaps", value: report.complianceGapsCount },
              { label: "Blocked Actions", value: report.blockedActionsCount },
              { label: "XRPL Blocked", value: report.xrplAssetsBlocked },
              { label: "Stellar Blocked", value: report.stellarAssetsBlocked },
            ].map(({ label, value }) => (
              <div key={label} className="rounded-xl border border-slate-800 bg-slate-900 p-5">
                <p className="text-xs uppercase tracking-widest text-slate-500">{label}</p>
                <p className="mt-1 text-3xl font-bold text-[#C9A84C]">{value}</p>
              </div>
            ))}
          </div>

          <div className="flex gap-3 flex-wrap">
            <span className="inline-flex items-center rounded-full bg-red-900/60 px-2.5 py-0.5 text-xs font-semibold text-red-300">
              ✗ Live Mainnet Disabled
            </span>
            <span className="inline-flex items-center rounded-full bg-red-900/60 px-2.5 py-0.5 text-xs font-semibold text-red-300">
              ✗ Public Network Disabled
            </span>
            <span className="inline-flex items-center rounded-full bg-amber-900/60 px-2.5 py-0.5 text-xs font-semibold text-amber-300">
              ◎ Simulation Only
            </span>
          </div>
        </section>

        {/* ── Governance Decision ───────────────────────────────────────── */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold border-b border-slate-800 pb-3">
            Governance Posture
          </h2>
          <div className="rounded-xl border border-slate-800 bg-slate-900 p-5 space-y-3">
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center rounded-full bg-red-900/60 px-3 py-1 text-sm font-semibold text-red-300">
                Execution Blocked
              </span>
              <span className="inline-flex items-center rounded-full bg-amber-900/60 px-3 py-1 text-sm font-semibold text-amber-300">
                Simulation Only
              </span>
            </div>
            <p className="text-sm text-slate-400">{report.governanceDecision.auditHint}</p>
            {report.governanceDecision.blockedActions.length > 0 && (
              <div>
                <p className="text-xs uppercase tracking-widest text-slate-500 mb-2">Blocked Actions</p>
                <ul className="space-y-1">
                  {report.governanceDecision.blockedActions.map((action, i) => (
                    <li key={i} className="text-xs text-red-300 flex items-start gap-2">
                      <span className="shrink-0">✗</span> {action}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </section>

        {/* ── Recommended Next Actions ─────────────────────────────────── */}
        {report.recommendedNextActions.length > 0 && (
          <section className="space-y-4">
            <h2 className="text-xl font-semibold border-b border-slate-800 pb-3">
              Recommended Next Actions
            </h2>
            <ul className="space-y-3">
              {report.recommendedNextActions.map((action, i) => (
                <li
                  key={i}
                  className="flex items-start gap-3 rounded-xl border border-slate-800 bg-slate-900 px-5 py-4 text-sm text-slate-300"
                >
                  <span className="text-[#C9A84C] font-bold mt-0.5">{i + 1}.</span>
                  {action}
                </li>
              ))}
            </ul>
          </section>
        )}

        <section className="rounded-xl border border-slate-800 bg-slate-900 p-6 space-y-3">
          <h2 className="text-lg font-semibold">About Cross-Rail Simulation</h2>
          <p className="text-sm text-slate-400 leading-6">
            Troptions operates a unified cross-rail governance layer that evaluates asset movement
            across XRPL and Stellar under the same compliance framework. Both rails are currently
            in simulation-only mode. The cross-rail readiness report is generated deterministically
            from the live asset registry and policy engine state — no cached data, no external calls.
            All simulations are persisted to the Control Hub audit log for future compliance review.
          </p>
        </section>
      </div>
    </main>
  );
}
