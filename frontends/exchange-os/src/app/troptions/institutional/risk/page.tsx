import { RISK_MATRIX, getRiskByAsset, getCriticalRisks, getUnmitigatedRisks } from "@/content/troptions/riskMatrix";
import { DisclaimerBanner } from "@/components/troptions/DisclaimerBanner";

const severityColors: Record<string, string> = {
  CRITICAL: "bg-red-950 border-red-700 text-red-400",
  HIGH: "bg-orange-950 border-orange-700 text-orange-400",
  MEDIUM: "bg-yellow-950 border-yellow-700 text-yellow-400",
  LOW: "bg-slate-900 border-slate-700 text-slate-400",
};

const categoryColors: Record<string, string> = {
  "legal-classification": "text-purple-400",
  regulatory: "text-orange-400",
  reserve: "text-yellow-400",
  custody: "text-blue-400",
  liquidity: "text-cyan-400",
  counterparty: "text-pink-400",
  technology: "text-teal-400",
  governance: "text-indigo-400",
  market: "text-green-400",
  compliance: "text-red-400",
  reputational: "text-rose-400",
  operational: "text-slate-400",
};

export default function RiskPage() {
  const critical = getCriticalRisks();
  const unmitigated = getUnmitigatedRisks();
  const assets = Array.from(new Set(RISK_MATRIX.map((r) => r.asset)));

  return (
    <main className="min-h-screen bg-[#0A0A0A] text-white">
      <DisclaimerBanner variant="institutional" />

      <div className="max-w-5xl mx-auto px-6 py-16 space-y-12">

        <section>
          <p className="text-[#C9A84C] font-mono text-xs uppercase tracking-widest mb-3">
            Institutional — Risk Matrix
          </p>
          <h1 className="text-4xl font-bold text-white mb-4">Troptions Risk Matrix</h1>
          <p className="text-slate-400 max-w-3xl leading-relaxed">
            All registered risks across Troptions assets, programs, and operations. Every risk entry includes
            required mitigation and current mitigation status.
          </p>
          <div className="mt-6 flex gap-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-red-400">{critical.length}</div>
              <div className="text-slate-500 text-xs mt-1">CRITICAL Risks</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-yellow-400">{unmitigated.length}</div>
              <div className="text-slate-500 text-xs mt-1">Not Started / Unmitigated</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white">{RISK_MATRIX.length}</div>
              <div className="text-slate-500 text-xs mt-1">Total Risks Registered</div>
            </div>
          </div>
        </section>

        {/* Critical Risks Alert */}
        {critical.length > 0 && (
          <section className="border border-red-700 bg-red-950/20 rounded-xl p-6">
            <p className="text-red-400 font-semibold text-sm mb-4">
              CRITICAL Risks — Immediate Attention Required ({critical.length})
            </p>
            <div className="space-y-3">
              {critical.map((risk) => (
                <div key={risk.riskId} className="bg-red-950/30 border border-red-800 rounded-lg p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <span className="text-[#C9A84C] font-mono text-xs">{risk.riskId}</span>
                      <span className="text-slate-400 text-xs ml-3">{risk.asset}</span>
                      <p className="text-white text-sm mt-1">{risk.description}</p>
                    </div>
                    <span className={`text-xs font-bold ${categoryColors[risk.category] ?? "text-slate-400"}`}>
                      {risk.category}
                    </span>
                  </div>
                  <p className="text-yellow-300 text-xs mt-2">Mitigation: {risk.mitigationRequired}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Risks By Asset */}
        {assets.map((asset) => {
          const assetRisks = getRiskByAsset(asset.replace("All ", ""));
          if (assetRisks.length === 0) return null;
          return (
            <section key={asset}>
              <h2 className="text-lg font-bold text-white mb-4">{asset}</h2>
              <div className="space-y-3">
                {assetRisks.map((risk) => (
                  <div key={risk.riskId}
                    className={`border rounded-xl p-4 ${severityColors[risk.severity] ?? ""}`}>
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-xs text-[#C9A84C]">{risk.riskId}</span>
                        <span className={`text-xs font-bold ${categoryColors[risk.category] ?? "text-slate-400"}`}>
                          {risk.category}
                        </span>
                        <span className="text-xs font-bold">[{risk.severity}]</span>
                      </div>
                      <span className="text-xs text-slate-500 whitespace-nowrap">{risk.currentMitigationStatus}</span>
                    </div>
                    <p className="text-slate-300 text-sm mb-2">{risk.description}</p>
                    <p className="text-xs text-slate-500">
                      <span className="text-yellow-400">Required:</span> {risk.mitigationRequired}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          );
        })}

      </div>
    </main>
  );
}
