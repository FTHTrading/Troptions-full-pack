import { getCriticalRisks, getUnmitigatedRisks, RISK_MATRIX } from "@/content/troptions/riskMatrix";
import { DisclaimerBanner } from "@/components/troptions/DisclaimerBanner";
import { RiskBadge, StatusBadge } from "@/components/troptions/StatusBadge";

export const metadata = {
  title: "Risk Analytics — Troptions Institutional",
};

export default function RiskAnalyticsPage() {
  const critical = getCriticalRisks();
  const unmitigated = getUnmitigatedRisks();

  return (
    <main className="min-h-screen bg-[#0A0A0A] text-white">
      <div className="border-b border-[#C9A84C]/20 bg-[#0D1B2A]">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <p className="text-[#C9A84C] font-mono text-xs uppercase tracking-[0.3em]">Risk Analytics</p>
          <h1 className="text-3xl font-bold text-white mt-2">Risk Matrix</h1>
          <p className="text-gray-400 mt-2 text-sm">All registered risks across assets, programs, and compliance domains.</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-10 space-y-10">
        <DisclaimerBanner variant="master" />

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: "Total Risks", value: RISK_MATRIX.length, color: "text-white" },
            { label: "Critical", value: critical.length, color: "text-red-500" },
            { label: "Unmitigated", value: unmitigated.length, color: "text-red-400" },
            { label: "Mitigated", value: RISK_MATRIX.length - unmitigated.length, color: "text-green-400" },
          ].map((stat) => (
            <div key={stat.label} className="bg-[#0D1B2A] border border-slate-700/40 rounded-lg p-4">
              <p className="text-[10px] text-slate-500 uppercase tracking-widest font-mono">{stat.label}</p>
              <p className={`text-3xl font-bold mt-1 ${stat.color}`}>{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Critical Risks */}
        <section>
          <h2 className="text-lg font-bold text-red-400 mb-4">Critical Risks</h2>
          <div className="space-y-4">
            {critical.map((risk) => (
              <div key={risk.riskId} className="bg-red-950/20 border border-red-800/40 rounded-lg p-5">
                <div className="flex items-center gap-2 mb-2 flex-wrap">
                  <span className="text-slate-500 font-mono text-xs">{risk.riskId}</span>
                  <RiskBadge level={risk.severity} />
                  <span className="text-slate-500 text-xs">{risk.asset}</span>
                </div>
                <h3 className="text-white font-medium text-sm mb-2">{risk.description}</h3>
                <div className="bg-[#0D1B2A]/60 rounded p-3">
                  <p className="text-[10px] text-[#C9A84C] uppercase tracking-widest font-mono mb-1">Mitigation Required</p>
                  <p className="text-slate-300 text-xs">{risk.mitigationRequired}</p>
                </div>
                <p className="text-slate-500 text-xs mt-2">
                  Mitigation Status: <span className="text-red-400">{risk.currentMitigationStatus}</span>
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* All Risks Table */}
        <section>
          <h2 className="text-lg font-bold text-white mb-4">All Risks</h2>
          <div className="overflow-x-auto rounded-lg border border-slate-700/40">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-700/40 bg-[#0D1B2A]">
                  {["ID", "Asset", "Category", "Severity", "Mitigation Status"].map((h) => (
                    <th key={h} className="text-left text-[#C9A84C] font-mono text-xs uppercase tracking-widest px-4 py-3">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {RISK_MATRIX.map((risk) => (
                  <tr key={risk.riskId} className="border-b border-slate-800/60 hover:bg-slate-900/30 transition-colors">
                    <td className="px-4 py-3 text-slate-400 font-mono text-xs whitespace-nowrap">{risk.riskId}</td>
                    <td className="px-4 py-3 text-slate-300 text-xs max-w-[160px]">{risk.asset}</td>
                    <td className="px-4 py-3 text-slate-400 text-xs">{risk.category}</td>
                    <td className="px-4 py-3 whitespace-nowrap"><RiskBadge level={risk.severity} /></td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <StatusBadge status={risk.currentMitigationStatus === "not-started" ? "blocked" : "pending"} label={risk.currentMitigationStatus} size="sm" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </main>
  );
}
