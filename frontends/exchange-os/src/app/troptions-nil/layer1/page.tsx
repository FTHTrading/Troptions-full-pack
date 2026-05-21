import { getTroptionsNilL1Status, createNilL1ReadinessReport } from "@/lib/troptions-nil/l1NilBridge";

export const metadata = {
  title: "NIL Protocol | Troptions Layer-1",
  description:
    "Troptions NIL native Layer-1 protocol overview — 33-signal valuation, pseudonymous identity, deal compliance, and proof vault. Simulation-only. No live NIL payments, guaranteed income, or on-chain execution.",
};

const BUCKETS = [
  { name: "Identity & Verification", count: 6, color: "text-blue-400", border: "border-blue-800/40", bg: "bg-blue-950/20" },
  { name: "Performance Proof", count: 7, color: "text-emerald-400", border: "border-emerald-800/40", bg: "bg-emerald-950/20" },
  { name: "Recruiting & Exposure", count: 5, color: "text-purple-400", border: "border-purple-800/40", bg: "bg-purple-950/20" },
  { name: "Market & Reach", count: 7, color: "text-amber-400", border: "border-amber-800/40", bg: "bg-amber-950/20" },
  { name: "Compliance & Eligibility", count: 5, color: "text-red-400", border: "border-red-800/40", bg: "bg-red-950/20" },
  { name: "Deal Execution", count: 3, color: "text-cyan-400", border: "border-cyan-800/40", bg: "bg-cyan-950/20" },
];

const AGENTS = [
  { id: "nil_orchestrator_agent", label: "NIL Orchestrator", role: "Top-level coordinator for NIL protocol workflows" },
  { id: "athlete_identity_agent", label: "Athlete Identity", role: "Pseudonymous identity hashing — no PII stored" },
  { id: "signal_collection_agent", label: "Signal Collection", role: "33-signal data collection coordinator" },
  { id: "valuation_agent", label: "Valuation Engine", role: "Composite score and estimate band computation" },
  { id: "compliance_router_agent", label: "Compliance Router", role: "50-state NIL law + institution overlay evaluation" },
  { id: "deal_receipt_agent", label: "Deal Receipt", role: "Unsigned NIL deal receipt creation (no live payment)" },
  { id: "proof_vault_agent", label: "Proof Vault", role: "Document hash vault and Merkle root computation" },
  { id: "governance_gate_agent", label: "Governance Gate", role: "Control Hub approval gating and decision routing" },
  { id: "audit_recorder_agent", label: "Audit Recorder", role: "Full audit trail — all NIL events recorded" },
];

export default function NilLayer1PublicPage() {
  const status = getTroptionsNilL1Status();
  const report = createNilL1ReadinessReport();

  return (
    <main className="min-h-screen bg-[#0A0A0A] text-white">
      <div className="mx-auto max-w-6xl px-6 py-16 space-y-10">

        {/* Safety notices */}
        <div className="rounded-xl border border-red-700/40 bg-red-900/20 p-5 space-y-2">
          <p className="font-bold text-red-300 text-base">Important NIL Disclosures</p>
          <ul className="text-sm text-red-200 space-y-1 list-disc list-inside">
            <li>
              All NIL operations are <strong>simulation-only</strong>. No live athlete payments,
              settlements, or NFT/token minting is enabled.
            </li>
            <li>
              <strong>No guaranteed NIL value, deal, income, or endorsement amount</strong> is
              represented or implied.
            </li>
            <li>
              No pay-for-play or recruiting inducement structures are supported — these are
              blocked at the protocol level.
            </li>
            <li>
              Minor athletes require guardian consent approval before any identity hashing or
              deal creation.
            </li>
            <li>
              No sensitive athlete PII (name, DOB, SSN) is stored — only pseudonymous SHA-256
              identity hashes.
            </li>
            <li>
              Legal review, institutional pre-approval, and Control Hub governance gating are
              required before any real-world deployment.
            </li>
          </ul>
        </div>

        {/* Header */}
        <header className="space-y-2">
          <p className="font-mono text-xs uppercase tracking-widest text-[#C9A84C]">
            Troptions — Native Layer-1 Protocol
          </p>
          <h1 className="text-4xl font-bold">NIL Protocol</h1>
          <p className="max-w-2xl text-base text-slate-400 leading-7">
            The Troptions NIL protocol is a native Layer-1 module providing pseudonymous athlete
            identity hashing, 33-signal composite valuation, deal compliance evaluation, and
            proof vault with Merkle root anchoring templates. All operations are devnet-only,
            simulation-only, and approval-gated.
          </p>
        </header>

        {/* Status Banner */}
        <section className="rounded-xl border border-slate-700 bg-slate-900 p-6">
          <h2 className="text-lg font-semibold mb-4">Module Status</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="space-y-1">
              <p className="text-xs text-slate-500 uppercase tracking-wider">Version</p>
              <p className="font-mono text-white">{status.version}</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-slate-500 uppercase tracking-wider">Signals</p>
              <p className="font-mono text-amber-300">{status.signalCount}</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-slate-500 uppercase tracking-wider">Agents</p>
              <p className="font-mono text-amber-300">{status.agentCount}</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-slate-500 uppercase tracking-wider">Execution Mode</p>
              <span className="inline-flex items-center rounded-full bg-amber-900/60 px-2.5 py-0.5 text-xs font-semibold text-amber-300">
                Simulation Only
              </span>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-slate-500 uppercase tracking-wider">Live Execution</p>
              <span className="inline-flex items-center rounded-full bg-red-900/60 px-2.5 py-0.5 text-xs font-semibold text-red-300">
                Disabled
              </span>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-slate-500 uppercase tracking-wider">Live Payment</p>
              <span className="inline-flex items-center rounded-full bg-red-900/60 px-2.5 py-0.5 text-xs font-semibold text-red-300">
                Disabled
              </span>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-slate-500 uppercase tracking-wider">NFT Minting</p>
              <span className="inline-flex items-center rounded-full bg-red-900/60 px-2.5 py-0.5 text-xs font-semibold text-red-300">
                Disabled
              </span>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-slate-500 uppercase tracking-wider">Web3 Anchor</p>
              <span className="inline-flex items-center rounded-full bg-red-900/60 px-2.5 py-0.5 text-xs font-semibold text-red-300">
                Disabled
              </span>
            </div>
          </div>
        </section>

        {/* 33-Signal Buckets */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold border-b border-slate-800 pb-3">
            33-Signal Protocol ({status.signalCount} signals across {status.buckets} buckets)
          </h2>
          <p className="text-sm text-slate-500">
            The NIL valuation model uses 33 weighted signals across 6 category buckets to compute
            a composite score (0–100). Output is an <strong>estimate only</strong> — not a
            guaranteed income projection.
          </p>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {BUCKETS.map((bucket) => (
              <div
                key={bucket.name}
                className={`rounded-xl border ${bucket.border} ${bucket.bg} p-5 space-y-2`}
              >
                <p className={`font-semibold ${bucket.color}`}>{bucket.name}</p>
                <p className="text-2xl font-bold text-white">{bucket.count}</p>
                <p className="text-xs text-slate-500">signals in this bucket</p>
              </div>
            ))}
          </div>
        </section>

        {/* Valuation Bands */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold border-b border-slate-800 pb-3">
            Valuation Bands
          </h2>
          <p className="text-sm text-slate-500">
            Composite scores map to estimate bands. All ranges are indicative only — not
            guaranteed NIL income or deal values.
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-slate-300">
              <thead>
                <tr className="border-b border-slate-800 text-slate-500 text-xs uppercase tracking-wider">
                  <th className="pb-2 text-left">Band</th>
                  <th className="pb-2 text-left">Score Range</th>
                  <th className="pb-2 text-left">Indicative USD Range</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                <tr className="py-2"><td className="py-2">InsufficientData</td><td>0 – 14</td><td>Less than 12 months data</td></tr>
                <tr><td className="py-2">Emerging</td><td>15 – 39</td><td>Early-stage presence</td></tr>
                <tr><td className="py-2">Developing</td><td>40 – 64</td><td>Growing profile</td></tr>
                <tr><td className="py-2">Established</td><td>65 – 84</td><td>Consistent regional reach</td></tr>
                <tr><td className="py-2">Elite</td><td>85 – 100</td><td>National/premium profile</td></tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Agent Profiles */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold border-b border-slate-800 pb-3">
            NIL Agent Profiles ({AGENTS.length} agents)
          </h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {AGENTS.map((agent) => (
              <div
                key={agent.id}
                className="rounded-xl border border-slate-800 bg-slate-900 p-4 space-y-1"
              >
                <p className="font-semibold text-white text-sm">{agent.label}</p>
                <p className="font-mono text-xs text-slate-500">{agent.id}</p>
                <p className="text-xs text-slate-400">{agent.role}</p>
                <div className="flex gap-2 pt-1">
                  <span className="inline-flex items-center rounded-full bg-amber-900/40 px-2 py-0.5 text-xs text-amber-300">
                    simulation_only
                  </span>
                  <span className="inline-flex items-center rounded-full bg-slate-800 px-2 py-0.5 text-xs text-slate-400">
                    approval_gated
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Compliance Checks */}
        <section className="rounded-xl border border-slate-800 bg-slate-900 p-6 space-y-4">
          <h2 className="text-lg font-semibold">Compliance Framework</h2>
          <ul className="space-y-2">
            {report.complianceChecks.map((check) => (
              <li key={check} className="flex items-center gap-3 text-sm text-slate-300">
                <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                <code className="text-emerald-300 text-xs">{check}</code>
              </li>
            ))}
          </ul>
        </section>

        {/* Safety Gates */}
        <section className="rounded-xl border border-amber-700/30 bg-amber-950/10 p-6 space-y-4">
          <h2 className="text-lg font-semibold text-amber-300">Safety Gates</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {report.safetyGates.map((gate) => (
              <div key={gate} className="flex items-center gap-2 text-sm text-slate-300">
                <span className="text-red-400">✕</span>
                <code className="text-xs text-slate-400">{gate}</code>
              </div>
            ))}
          </div>
        </section>

        {/* Disclaimer */}
        <section className="rounded-xl border border-slate-700 bg-slate-900 p-6 space-y-3">
          <h2 className="text-base font-semibold text-slate-300">Disclaimer</h2>
          <p className="text-sm text-slate-500 leading-6">
            The Troptions NIL Protocol is a software simulation module. It does not provide legal
            advice, compliance certification, NIL deal structuring, athlete representation, or
            financial services. No NIL values, deals, income projections, or guaranteed outcomes
            are represented or implied. All outputs are devnet-only simulation estimates requiring
            independent legal and institutional review before any real-world use.
          </p>
        </section>

      </div>
    </main>
  );
}
