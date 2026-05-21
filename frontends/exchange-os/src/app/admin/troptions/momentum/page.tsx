import {
  MOMENTUM_PROGRAM,
  MOMENTUM_PHASES,
  MOMENTUM_COMPLIANCE_GATES,
  MOMENTUM_ALLOWED_CLAIMS,
  MOMENTUM_PROHIBITED_CLAIMS,
  MOMENTUM_RISK_DISCLOSURES,
} from "@/content/troptions/momentum/momentumRegistry";
import {
  evaluateMomentumLaunchReadiness,
  buildMomentumComplianceSnapshot,
} from "@/lib/troptions/momentum/momentumComplianceEngine";

export const metadata = {
  title: "Momentum Admin | Troptions Control Hub",
  description: "Internal admin dashboard for Troptions Momentum compliance gate status and claim audit.",
};

export default function MomentumAdminPage() {
  const readiness = evaluateMomentumLaunchReadiness();
  const snapshot = buildMomentumComplianceSnapshot();

  return (
    <main className="min-h-screen bg-[#0A0A0A] text-white">
      <div className="mx-auto max-w-6xl px-6 py-14 space-y-10">

        {/* Admin Header */}
        <header className="space-y-1">
          <p className="font-mono text-xs uppercase tracking-widest text-slate-500">
            Troptions Admin — Internal Only
          </p>
          <h1 className="text-3xl font-bold">Momentum Compliance Dashboard</h1>
          <p className="text-sm text-slate-400">
            Gate status, claim audit, and readiness overview for the Troptions Momentum program.
          </p>
          <div className="flex flex-wrap gap-2 pt-2">
            <span className="rounded-full bg-slate-800 px-3 py-1 text-xs text-slate-400 font-mono">
              v{MOMENTUM_PROGRAM.version}
            </span>
            <span className="rounded-full bg-red-900/40 px-3 py-1 text-xs text-red-300 border border-red-800/40 font-mono">
              live_execution: false
            </span>
            <span className="rounded-full bg-amber-900/40 px-3 py-1 text-xs text-amber-300 border border-amber-800/40 font-mono">
              overall: {snapshot.overallStatus}
            </span>
          </div>
        </header>

        {/* Readiness Summary */}
        <section className="rounded-xl border border-slate-700/40 bg-slate-900/40 p-5 space-y-4">
          <h2 className="font-semibold text-slate-300">Launch Readiness Summary</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="rounded-lg border border-red-800/40 bg-red-950/20 p-3 text-center">
              <p className="text-2xl font-bold text-red-300">{readiness.blockedGates.length}</p>
              <p className="text-xs text-red-400 mt-1">Locked Gates</p>
            </div>
            <div className="rounded-lg border border-yellow-800/40 bg-yellow-950/20 p-3 text-center">
              <p className="text-2xl font-bold text-yellow-300">{readiness.partialGates.length}</p>
              <p className="text-xs text-yellow-400 mt-1">Partial Gates</p>
            </div>
            <div className="rounded-lg border border-amber-800/40 bg-amber-950/20 p-3 text-center">
              <p className="text-2xl font-bold text-amber-300">{readiness.simulationGates.length}</p>
              <p className="text-xs text-amber-400 mt-1">Simulation Gates</p>
            </div>
            <div className="rounded-lg border border-emerald-800/40 bg-emerald-950/20 p-3 text-center">
              <p className="text-2xl font-bold text-emerald-300">{readiness.activeGates.length}</p>
              <p className="text-xs text-emerald-400 mt-1">Active Gates</p>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="rounded-lg border border-slate-700/40 bg-slate-800/30 p-3 text-center">
              <p className="text-xl font-bold text-slate-300">{snapshot.prohibitedClaimsCount}</p>
              <p className="text-xs text-slate-500 mt-1">Prohibited Claims</p>
            </div>
            <div className="rounded-lg border border-slate-700/40 bg-slate-800/30 p-3 text-center">
              <p className="text-xl font-bold text-slate-300">{snapshot.allowedClaimsCount}</p>
              <p className="text-xs text-slate-500 mt-1">Allowed Claims</p>
            </div>
            <div className="rounded-lg border border-slate-700/40 bg-slate-800/30 p-3 text-center">
              <p className="text-xl font-bold text-slate-300">{snapshot.totalRiskDisclosures}</p>
              <p className="text-xs text-slate-500 mt-1">Risk Disclosures</p>
            </div>
          </div>
        </section>

        {/* Phase Status Table */}
        <section className="space-y-3">
          <h2 className="font-semibold text-slate-300">Phase Status</h2>
          <div className="overflow-x-auto rounded-xl border border-slate-700/40">
            <table className="w-full text-sm">
              <thead className="bg-slate-800/60">
                <tr>
                  <th className="text-left px-4 py-2.5 font-medium text-slate-400 text-xs">ID</th>
                  <th className="text-left px-4 py-2.5 font-medium text-slate-400 text-xs">Phase</th>
                  <th className="text-left px-4 py-2.5 font-medium text-slate-400 text-xs">Name</th>
                  <th className="text-left px-4 py-2.5 font-medium text-slate-400 text-xs">Status</th>
                  <th className="text-left px-4 py-2.5 font-medium text-slate-400 text-xs">Legal Review</th>
                  <th className="text-left px-4 py-2.5 font-medium text-slate-400 text-xs">Live Execution</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {MOMENTUM_PHASES.map((phase) => (
                  <tr key={phase.id} className="bg-slate-900/20 hover:bg-slate-800/30">
                    <td className="px-4 py-2.5 font-mono text-xs text-slate-500">{phase.id}</td>
                    <td className="px-4 py-2.5 text-slate-400">{phase.phase}</td>
                    <td className="px-4 py-2.5 text-white">{phase.name}</td>
                    <td className="px-4 py-2.5">
                      <span className={`text-xs font-mono font-semibold ${
                        phase.status === "active" ? "text-emerald-400" :
                        phase.status === "simulation" ? "text-amber-400" :
                        phase.status === "partial" ? "text-yellow-400" : "text-red-400"
                      }`}>
                        {phase.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-4 py-2.5">
                      <span className={`text-xs font-mono ${phase.requiresLegalReview ? "text-amber-400" : "text-slate-600"}`}>
                        {phase.requiresLegalReview ? "REQUIRED" : "n/a"}
                      </span>
                    </td>
                    <td className="px-4 py-2.5">
                      <span className="text-xs font-mono text-red-400">false</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Compliance Gate Detail */}
        <section className="space-y-3">
          <h2 className="font-semibold text-slate-300">Compliance Gate Detail</h2>
          <div className="space-y-3">
            {MOMENTUM_COMPLIANCE_GATES.map((gate) => (
              <div
                key={gate.id}
                className="rounded-xl border border-slate-700/40 bg-slate-900/30 p-4 space-y-2"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs text-slate-500">{gate.id}</span>
                    <span className="font-medium text-white">{gate.name}</span>
                    <span className="text-xs text-slate-400">{gate.domain}</span>
                  </div>
                  <span className={`text-xs font-semibold font-mono px-2 py-0.5 rounded-full ${
                    gate.status === "locked" ? "bg-red-900/40 text-red-300" :
                    gate.status === "simulation" ? "bg-amber-900/40 text-amber-300" :
                    gate.status === "partial" ? "bg-yellow-900/40 text-yellow-300" :
                    "bg-emerald-900/40 text-emerald-300"
                  }`}>
                    {gate.status.toUpperCase()}
                  </span>
                </div>
                <p className="text-xs text-slate-500 italic">{gate.currentBlock}</p>
                <div className="space-y-1">
                  <p className="text-xs text-slate-500 font-medium">Required for activation:</p>
                  <ul className="list-disc list-inside text-xs text-slate-600 space-y-0.5">
                    {gate.requiredForActivation.map((req) => (
                      <li key={req}>{req}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Prohibited Claims Audit */}
        <section className="space-y-3">
          <h2 className="font-semibold text-slate-300">Prohibited Claims Audit</h2>
          <p className="text-xs text-slate-500">
            These phrases must not appear in any public-facing Troptions Momentum content.
          </p>
          <div className="overflow-x-auto rounded-xl border border-slate-700/40">
            <table className="w-full text-sm">
              <thead className="bg-slate-800/60">
                <tr>
                  <th className="text-left px-4 py-2.5 font-medium text-slate-400 text-xs">ID</th>
                  <th className="text-left px-4 py-2.5 font-medium text-slate-400 text-xs">Prohibited Claim</th>
                  <th className="text-left px-4 py-2.5 font-medium text-slate-400 text-xs">Reason</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {MOMENTUM_PROHIBITED_CLAIMS.map((claim) => (
                  <tr key={claim.id} className="bg-slate-900/20 hover:bg-slate-800/30">
                    <td className="px-4 py-2.5 font-mono text-xs text-slate-500">{claim.id}</td>
                    <td className="px-4 py-2.5 text-red-300 text-xs font-mono">{claim.claim}</td>
                    <td className="px-4 py-2.5 text-slate-400 text-xs">{claim.reason}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Allowed Claims */}
        <section className="space-y-3">
          <h2 className="font-semibold text-slate-300">Approved Claims</h2>
          <div className="space-y-2">
            {MOMENTUM_ALLOWED_CLAIMS.map((claim) => (
              <div
                key={claim.id}
                className="rounded-lg border border-emerald-800/30 bg-emerald-950/10 px-4 py-2.5 flex items-start gap-3"
              >
                <span className="text-emerald-500 text-xs mt-0.5">✓</span>
                <div>
                  <p className="text-sm text-white">{claim.claim}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{claim.reason}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Risk Disclosures */}
        <section className="space-y-3">
          <h2 className="font-semibold text-slate-300">Mandatory Risk Disclosures</h2>
          <div className="space-y-3">
            {MOMENTUM_RISK_DISCLOSURES.map((d) => (
              <div
                key={d.id}
                className="rounded-xl border border-slate-700/40 bg-slate-900/30 p-4"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-mono text-xs text-slate-500">{d.id}</span>
                  <span className="text-xs font-semibold text-slate-400">{d.category}</span>
                  {d.mandatory && (
                    <span className="text-xs text-red-400 font-mono">MANDATORY</span>
                  )}
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">{d.disclosure}</p>
              </div>
            ))}
          </div>
        </section>

        {/* API Endpoints */}
        <section className="rounded-xl border border-slate-700/40 bg-slate-900/30 p-5 space-y-3">
          <h2 className="font-semibold text-slate-300 text-sm">API Endpoints</h2>
          <div className="space-y-2 font-mono text-xs">
            <div className="flex items-center gap-3">
              <span className="text-emerald-400">GET</span>
              <span className="text-slate-300">/api/troptions/momentum/readiness</span>
              <span className="text-slate-500">— Launch readiness evaluation</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-blue-400">POST</span>
              <span className="text-slate-300">/api/troptions/momentum/claims/evaluate</span>
              <span className="text-slate-500">— Claim text compliance evaluation</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-emerald-400">GET</span>
              <span className="text-slate-300">/api/troptions/momentum/snapshot</span>
              <span className="text-slate-500">— Full compliance snapshot</span>
            </div>
          </div>
        </section>

        {/* Related Links */}
        <section className="space-y-2">
          <h2 className="font-semibold text-slate-300 text-sm">Related Systems</h2>
          <ul className="text-sm text-slate-400 space-y-1 list-disc list-inside">
            <li>
              <a href="/admin/troptions-nil/layer1" className="text-[#C9A84C] hover:underline">
                NIL Layer-1 Admin
              </a>{" "}
              — NIL compliance gate administration
            </li>
            <li>
              <a href="/troptions/momentum" className="text-[#C9A84C] hover:underline">
                Momentum Public Page
              </a>{" "}
              — Public-facing documentation view
            </li>
          </ul>
        </section>

      </div>
    </main>
  );
}
