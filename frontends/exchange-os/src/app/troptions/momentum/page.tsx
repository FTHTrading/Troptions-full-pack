import {
  MOMENTUM_PROGRAM,
  MOMENTUM_PHASES,
  MOMENTUM_COMPLIANCE_GATES,
  MOMENTUM_RISK_DISCLOSURES,
} from "@/content/troptions/momentum/momentumRegistry";

export const metadata = {
  title: "Troptions Momentum | Sports Ecosystem Documentation Framework",
  description:
    "Troptions Momentum — a documentation, AI workflow, and compliance-readiness layer for sports ecosystem participants. " +
    "Not a financial product. Not a securities offering. Simulation-only. No live payments or token issuance.",
};

const GATE_STATUS_STYLE: Record<string, { border: string; bg: string; badge: string; label: string }> = {
  locked: {
    border: "border-red-800/40",
    bg: "bg-red-950/20",
    badge: "bg-red-900/40 text-red-300",
    label: "LOCKED",
  },
  simulation: {
    border: "border-amber-800/40",
    bg: "bg-amber-950/20",
    badge: "bg-amber-900/40 text-amber-300",
    label: "SIMULATION ONLY",
  },
  partial: {
    border: "border-yellow-800/40",
    bg: "bg-yellow-950/20",
    badge: "bg-yellow-900/40 text-yellow-300",
    label: "PARTIAL",
  },
  active: {
    border: "border-emerald-800/40",
    bg: "bg-emerald-950/20",
    badge: "bg-emerald-900/40 text-emerald-300",
    label: "ACTIVE",
  },
};

const PHASE_STATUS_STYLE: Record<string, { color: string; dot: string }> = {
  active: { color: "text-emerald-400", dot: "bg-emerald-500" },
  simulation: { color: "text-amber-400", dot: "bg-amber-500" },
  locked: { color: "text-red-400", dot: "bg-red-500" },
  partial: { color: "text-yellow-400", dot: "bg-yellow-500" },
};

export default function MomentumPublicPage() {
  return (
    <main className="min-h-screen bg-[#0A0A0A] text-white">
      <div className="mx-auto max-w-6xl px-6 py-16 space-y-10">

        {/* Disclaimer Banner */}
        <div className="rounded-xl border border-red-700/40 bg-red-900/20 p-5 space-y-2">
          <p className="font-bold text-red-300 text-base">Important Disclosures</p>
          <ul className="text-sm text-red-200 space-y-1 list-disc list-inside">
            {MOMENTUM_RISK_DISCLOSURES.filter((d) => d.mandatory).map((d) => (
              <li key={d.id}>
                <strong>{d.category}:</strong>{" "}
                {d.disclosure.length > 160 ? d.disclosure.substring(0, 160) + "…" : d.disclosure}
              </li>
            ))}
          </ul>
        </div>

        {/* Header */}
        <header className="space-y-2">
          <p className="font-mono text-xs uppercase tracking-widest text-[#C9A84C]">
            Troptions — Sports Ecosystem
          </p>
          <h1 className="text-4xl font-bold">Momentum Program</h1>
          <p className="max-w-2xl text-base text-slate-400 leading-7">
            {MOMENTUM_PROGRAM.description}
          </p>
          <div className="flex flex-wrap gap-2 pt-2">
            <span className="rounded-full bg-slate-800 px-3 py-1 text-xs text-slate-400">
              Documentation Framework
            </span>
            <span className="rounded-full bg-slate-800 px-3 py-1 text-xs text-slate-400">
              Compliance-Readiness Layer
            </span>
            <span className="rounded-full bg-amber-900/40 px-3 py-1 text-xs text-amber-300 border border-amber-800/40">
              Simulation Only
            </span>
            <span className="rounded-full bg-red-900/40 px-3 py-1 text-xs text-red-300 border border-red-800/40">
              No Live Payments
            </span>
          </div>
        </header>

        {/* What This Is — and Is Not */}
        <section className="grid md:grid-cols-2 gap-6">
          <div className="rounded-xl border border-emerald-800/40 bg-emerald-950/20 p-5 space-y-3">
            <h2 className="text-emerald-300 font-semibold text-base">What Momentum Provides</h2>
            <ul className="text-sm text-emerald-200 space-y-1.5 list-disc list-inside">
              <li>Compliance-readiness documentation frameworks</li>
              <li>ESG and sustainability documentation tools</li>
              <li>Sponsor and partnership documentation templates</li>
              <li>AI analytics documentation (informational only)</li>
              <li>Blockchain technology conceptual overviews</li>
              <li>NIL integration documentation (simulation only)</li>
              <li>Gate-based compliance activation management</li>
            </ul>
          </div>
          <div className="rounded-xl border border-red-800/40 bg-red-950/20 p-5 space-y-3">
            <h2 className="text-red-300 font-semibold text-base">What Momentum Does NOT Provide</h2>
            <ul className="text-sm text-red-200 space-y-1.5 list-disc list-inside">
              <li>Financial returns, yield, or profit guarantees</li>
              <li>Securities or token offerings</li>
              <li>Banking or custody services</li>
              <li>Investment advice or financial planning</li>
              <li>Live payment processing</li>
              <li>Live token issuance or blockchain execution</li>
              <li>Legal or regulatory clearance of any kind</li>
            </ul>
          </div>
        </section>

        {/* Program Phases */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold">Program Phases</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {MOMENTUM_PHASES.map((phase) => {
              const style = PHASE_STATUS_STYLE[phase.status] ?? PHASE_STATUS_STYLE.locked;
              return (
                <div
                  key={phase.id}
                  className="rounded-xl border border-slate-800/60 bg-slate-900/40 p-4 space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono text-slate-500">Phase {phase.phase}</span>
                    <span className={`flex items-center gap-1.5 text-xs font-medium ${style.color}`}>
                      <span className={`inline-block h-2 w-2 rounded-full ${style.dot}`} />
                      {phase.status.toUpperCase().replace("_", " ")}
                    </span>
                  </div>
                  <p className="font-medium text-sm text-white">{phase.name}</p>
                  <p className="text-xs text-slate-400 leading-relaxed">{phase.description}</p>
                  {!phase.liveExecutionEnabled && (
                    <p className="text-xs text-red-400 font-mono">
                      live_execution_enabled: false
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* Compliance Gates */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold">Compliance Gate Status</h2>
          <p className="text-sm text-slate-400">
            All financial and blockchain features require gate clearance before activation. Current status:
          </p>
          <div className="grid md:grid-cols-2 gap-4">
            {MOMENTUM_COMPLIANCE_GATES.map((gate) => {
              const style = GATE_STATUS_STYLE[gate.status] ?? GATE_STATUS_STYLE.locked;
              return (
                <div
                  key={gate.id}
                  className={`rounded-xl border ${style.border} ${style.bg} p-4 space-y-2`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono text-slate-500">{gate.id}</span>
                    <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${style.badge}`}>
                      {style.label}
                    </span>
                  </div>
                  <p className="font-medium text-sm text-white">{gate.name}</p>
                  <p className="text-xs text-slate-400">{gate.domain}</p>
                  <p className="text-xs text-slate-500 italic">{gate.currentBlock}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* Safety Constants */}
        <section className="rounded-xl border border-slate-700/40 bg-slate-900/30 p-5 space-y-3">
          <h2 className="text-base font-semibold text-slate-300">Technical Safety State</h2>
          <p className="text-xs text-slate-500">
            These flags are hardcoded in the Momentum compliance engine and cannot be changed
            without written legal opinion and recorded operator board approval.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 font-mono text-xs">
            {[
              { key: "livePaymentsEnabled", value: false },
              { key: "blockchainExecutionEnabled", value: false },
              { key: "x402SimulationOnly", value: true },
              { key: "investmentClaimsAllowed", value: false },
              { key: "yieldClaimsAllowed", value: false },
              { key: "custodyClaimsAllowed", value: false },
              { key: "publicOfferingClaimsAllowed", value: false },
              { key: "legalReviewRequired", value: true },
              { key: "jurisdictionReviewRequired", value: true },
            ].map(({ key, value }) => (
              <div key={key} className="rounded-lg bg-slate-800/50 px-3 py-2">
                <span className="text-slate-400">{key}:</span>{" "}
                <span className={value === false ? "text-red-400" : "text-emerald-400"}>
                  {String(value)}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* Governing Documents */}
        <section className="space-y-3">
          <h2 className="text-lg font-semibold">Governing Documents</h2>
          <ul className="text-sm text-slate-400 space-y-1 list-disc list-inside">
            <li>Legacy Claim Audit — <code className="text-slate-500">docs/troptions/momentum/revamp/legacy-claim-audit.md</code></li>
            <li>Compliance Modernization Framework — <code className="text-slate-500">docs/troptions/momentum/revamp/compliance-modernization-framework.md</code></li>
            <li>Modernized Momentum Document — <code className="text-slate-500">docs/troptions/momentum/revamp/momentum-modernized.md</code></li>
            <li>NIL Layer-1 Integration — <a href="/troptions-nil/layer1" className="text-[#C9A84C] hover:underline">/troptions-nil/layer1</a></li>
          </ul>
        </section>

        {/* Footer Disclaimer */}
        <footer className="border-t border-slate-800 pt-6 text-xs text-slate-500">
          <p>{MOMENTUM_PROGRAM.disclaimer}</p>
        </footer>

      </div>
    </main>
  );
}
