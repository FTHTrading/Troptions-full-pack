import type { Metadata } from "next";
import {
  getTroptionsNilL1Status,
  createNilL1ReadinessReport,
  simulateNilL1Valuation,
  simulateNilL1ComplianceCheck,
  simulateNilL1ProofAnchor,
} from "@/lib/troptions-nil/l1NilBridge";

export const metadata: Metadata = {
  title: "NIL Protocol Layer-1 Admin | TROPTIONS Admin",
  description:
    "Admin simulation panel for Troptions NIL native Layer-1 protocol. " +
    "Simulation-only. No live athlete payments, NFT minting, or on-chain anchoring enabled.",
  robots: { index: false, follow: false },
};

export default function NilLayer1AdminPage() {
  const status = getTroptionsNilL1Status();
  const report = createNilL1ReadinessReport();

  // Fixed-seed simulations for admin preview (no user PII)
  const exampleAthleteHash = "a".repeat(64); // all-zero placeholder hash
  const valuation = simulateNilL1Valuation(exampleAthleteHash, 0.62);
  const compliance = simulateNilL1ComplianceCheck(
    exampleAthleteHash,
    "TX",
    "UNIV_001",
    false,
    "flat_fee_social_post",
  );
  const anchor = simulateNilL1ProofAnchor(
    exampleAthleteHash,
    "deal_hash_example",
    ["doc_hash_a", "doc_hash_b"],
    "xrpl",
  );

  return (
    <main className="max-w-6xl mx-auto px-4 py-10 space-y-8">

      {/* Header */}
      <div className="mb-2">
        <h1 className="text-2xl font-bold text-gray-900">
          NIL Protocol Layer-1 — Admin Simulation Panel
        </h1>
        <p className="text-sm text-gray-600 mt-2">
          Troptions NIL native L1 module. All outputs are simulation-only, devnet-only, and
          unsigned. No live athlete payments, NFT minting, real on-chain anchoring, or guaranteed
          NIL income is enabled.
        </p>
      </div>

      {/* Safety Banner */}
      <div className="rounded-xl border border-red-200 bg-red-50 p-5 space-y-2">
        <p className="font-bold text-red-700 text-sm">ADMIN SAFETY NOTICE</p>
        <ul className="text-sm text-red-700 space-y-1 list-disc list-inside">
          <li>All NIL operations are simulation-only — no live athlete payments.</li>
          <li>No guaranteed NIL value, deal, or income is represented.</li>
          <li>No pay-for-play or recruiting inducement structures are supported.</li>
          <li>Minor athlete data requires guardian consent approval before any processing.</li>
          <li>Control Hub approval required for all deal receipt and proof anchor operations.</li>
          <li>Legal review required before any real-world use or disclosure to athletes.</li>
        </ul>
      </div>

      {/* Module Status */}
      <section className="rounded-xl border border-gray-200 bg-white p-6 space-y-4 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-800">Module Status</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: "Subsystem", value: status.subsystem },
            { label: "Version", value: status.version },
            { label: "Signals", value: String(status.signalCount) },
            { label: "Agents", value: String(status.agentCount) },
            { label: "Simulation Only", value: String(status.simulationOnly) },
            { label: "Live Execution", value: String(status.liveExecutionEnabled) },
            { label: "Live Payment", value: String(status.livePaymentEnabled) },
            { label: "Web3 Anchor", value: String(status.liveWeb3AnchorEnabled) },
          ].map(({ label, value }) => (
            <div key={label} className="space-y-1">
              <p className="text-xs text-gray-500 uppercase tracking-wider">{label}</p>
              <p
                className={`font-mono text-sm font-medium ${
                  value === "false"
                    ? "text-red-600"
                    : value === "true"
                      ? "text-amber-600"
                      : "text-gray-900"
                }`}
              >
                {value}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Valuation Simulation Preview */}
      <section className="rounded-xl border border-gray-200 bg-white p-6 space-y-4 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-800">
          Valuation Simulation Preview (Fixed Seed)
        </h2>
        <p className="text-xs text-gray-400">
          Athlete ID hash: <code>{exampleAthleteHash.slice(0, 16)}…</code> (placeholder — no real
          athlete data)
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm">
          <div>
            <p className="text-xs text-gray-500 uppercase">Composite Score</p>
            <p className="font-mono text-gray-900">{valuation.compositeScore}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase">Valuation Band</p>
            <p className="font-mono text-gray-900">{valuation.valuationBand}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase">Estimate Range</p>
            <p className="font-mono text-gray-900">
              ${valuation.estimateLowUsd.toFixed(0)} – ${valuation.estimateHighUsd.toFixed(0)}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase">Missing Signals</p>
            <p className="font-mono text-gray-900">{valuation.missingSignalCount}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase">Simulation Only</p>
            <p className="font-mono text-amber-600">{String(valuation.simulationOnly)}</p>
          </div>
        </div>
        <p className="text-xs text-gray-400 italic border-t border-gray-100 pt-3">
          {valuation.disclaimer}
        </p>
      </section>

      {/* Compliance Simulation Preview */}
      <section className="rounded-xl border border-gray-200 bg-white p-6 space-y-4 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-800">
          Compliance Simulation Preview (TX / flat_fee_social_post)
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm">
          <div>
            <p className="text-xs text-gray-500 uppercase">State</p>
            <p className="font-mono text-gray-900">{compliance.stateCode}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase">State Rule Status</p>
            <p className="font-mono text-gray-900">{compliance.stateRuleStatus}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase">Pay-For-Play Risk</p>
            <p
              className={`font-mono ${
                compliance.payForPlayRisk === "Blocked" ? "text-red-600" : "text-green-700"
              }`}
            >
              {compliance.payForPlayRisk}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase">Recruiting Risk</p>
            <p
              className={`font-mono ${
                compliance.recruitingRisk === "Blocked" ? "text-red-600" : "text-green-700"
              }`}
            >
              {compliance.recruitingRisk}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase">Minor Consent</p>
            <p className="font-mono text-gray-900">{compliance.minorConsentStatus}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase">Blocked Reasons</p>
            <p className="font-mono text-gray-900">{compliance.blockedReasons.length}</p>
          </div>
        </div>
        {compliance.blockedReasons.length > 0 && (
          <div className="rounded bg-red-50 border border-red-200 p-3 space-y-1">
            {compliance.blockedReasons.map((r) => (
              <p key={r} className="text-xs text-red-700 font-mono">
                {r}
              </p>
            ))}
          </div>
        )}
      </section>

      {/* Proof Anchor Template Preview */}
      <section className="rounded-xl border border-gray-200 bg-white p-6 space-y-4 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-800">
          Proof Anchor Template Preview
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm">
          <div>
            <p className="text-xs text-gray-500 uppercase">Chain Target</p>
            <p className="font-mono text-gray-900">{anchor.chainTarget}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase">Unsigned</p>
            <p className="font-mono text-amber-600">{String(anchor.unsigned)}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase">Live Submission</p>
            <p className="font-mono text-red-600">{String(anchor.liveSubmissionEnabled)}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase">Signature</p>
            <p className="font-mono text-gray-500">{anchor.signatureHex ?? "null"}</p>
          </div>
          <div className="col-span-2">
            <p className="text-xs text-gray-500 uppercase">Merkle Root</p>
            <p className="font-mono text-xs text-gray-700 break-all">
              {anchor.proofMerkleRoot ?? "null"}
            </p>
          </div>
        </div>
        <p className="text-xs text-gray-400 italic">{anchor.disclaimer}</p>
      </section>

      {/* Safety Gates */}
      <section className="rounded-xl border border-amber-200 bg-amber-50 p-6 space-y-3">
        <h2 className="text-base font-semibold text-amber-800">Safety Gates (All Active)</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {report.safetyGates.map((gate) => (
            <div key={gate} className="flex items-center gap-2 text-sm">
              <span className="text-red-500">✕</span>
              <code className="text-xs text-gray-600">{gate}</code>
            </div>
          ))}
        </div>
      </section>

      {/* Readiness Report Summary */}
      <section className="rounded-xl border border-gray-200 bg-white p-6 space-y-3 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-800">Readiness Report Summary</h2>
        <div className="space-y-2">
          <div className="flex gap-4 text-sm">
            <span className="text-gray-500">Signals:</span>
            <span className="font-mono">{report.signals}</span>
            <span className="text-gray-500 ml-4">Buckets:</span>
            <span className="font-mono">{report.buckets}</span>
            <span className="text-gray-500 ml-4">Agents:</span>
            <span className="font-mono">{report.agents}</span>
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase mb-2">Integration Points</p>
            <div className="flex flex-wrap gap-2">
              {report.integrationPoints.map((pt) => (
                <code key={pt} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
                  {pt}
                </code>
              ))}
            </div>
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase mb-2">Compliance Checks</p>
            <div className="flex flex-wrap gap-2">
              {report.complianceChecks.map((ch) => (
                <code key={ch} className="text-xs bg-green-50 text-green-700 px-2 py-0.5 rounded border border-green-200">
                  {ch}
                </code>
              ))}
            </div>
          </div>
        </div>
      </section>

    </main>
  );
}
