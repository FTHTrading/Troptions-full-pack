import { generatePlatformReadinessReport } from "@/lib/troptions/platform/readiness";
import { getCapabilityStatusColor } from "@/lib/troptions/platform/capabilities";
import { CAPABILITY_STATUS_LABELS } from "@/lib/troptions/platform/types";

export const metadata = { title: "Platform Readiness Report — TROPTIONS Admin" };

export default function ReadinessPage() {
  const report = generatePlatformReadinessReport();

  return (
    <div className="min-h-screen bg-[#060A12] text-gray-100 p-8">
      <div className="mb-6 rounded border border-yellow-600/60 bg-yellow-900/20 px-4 py-3 text-sm text-yellow-300">
        SIMULATION MODE — Readiness scores reflect software-build verified state.
      </div>
      <div className="mb-8">
        <div className="text-xs font-semibold tracking-widest text-[#C9A84C] uppercase mb-2">
          TROPTIONS SR PLATFORM FOUNDATION
        </div>
        <h1 className="text-2xl font-bold text-white">Platform Readiness Report</h1>
        <div className="mt-2 text-xs text-gray-500">Generated: {new Date(report.generatedAt).toLocaleString()}</div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="rounded-lg bg-[#0F1923] border border-gray-800 p-6 md:col-span-1">
          <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">Overall Score</div>
          <div className="text-5xl font-bold text-[#C9A84C]">{report.overallScore}%</div>
          <div className="text-xs text-gray-500 mt-2">Production-ready capabilities / total</div>
        </div>
        <div className="rounded-lg bg-[#0F1923] border border-gray-800 p-6">
          <div className="text-xs text-gray-500 uppercase tracking-wide mb-2">Credentials Required</div>
          {report.credentialsRequired.length === 0 ? (
            <div className="text-xs text-green-400">None</div>
          ) : (
            <ul className="space-y-1">
              {report.credentialsRequired.map((c, i) => (
                <li key={i} className="text-xs text-orange-300">— {c}</li>
              ))}
            </ul>
          )}
        </div>
        <div className="rounded-lg bg-[#0F1923] border border-gray-800 p-6">
          <div className="text-xs text-gray-500 uppercase tracking-wide mb-2">Recommendations</div>
          <ul className="space-y-1">
            {report.recommendations.map((r, i) => (
              <li key={i} className="text-xs text-blue-300/70">— {r}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className="rounded-lg bg-[#0F1923] border border-gray-800 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-800 text-xs text-gray-500 uppercase">
              <th className="px-4 py-3 text-left">Capability</th>
              <th className="px-4 py-3 text-left">Type</th>
              <th className="px-4 py-3 text-left">Status</th>
            </tr>
          </thead>
          <tbody>
            {report.capabilities.map((cap) => (
              <tr key={cap.id} className="border-b border-gray-800/50 hover:bg-[#080C14]">
                <td className="px-4 py-3 font-medium text-white">{cap.displayName}</td>
                <td className="px-4 py-3 text-xs text-gray-500 font-mono">{cap.capabilityType}</td>
                <td className="px-4 py-3">
                  <span className={`rounded px-2 py-1 text-xs border ${getCapabilityStatusColor(cap.status)}`}>
                    {CAPABILITY_STATUS_LABELS[cap.status]}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
