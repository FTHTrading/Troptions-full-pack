import { getMockHealthChecks } from "@/lib/troptions/infrastructure/mockData";
import { getHealthStatusColor, getOverallHealth } from "@/lib/troptions/infrastructure/health";

export const metadata = { title: "Health Checks — TROPTIONS Infrastructure" };

export default function HealthPage() {
  const checks = getMockHealthChecks();
  const overall = getOverallHealth(checks);

  return (
    <div className="min-h-screen bg-[#060A12] text-gray-100 p-8">
      <div className="mb-6 rounded border border-yellow-600/60 bg-yellow-900/20 px-4 py-3 text-sm text-yellow-300">
        SIMULATION MODE — Health checks are mock/build-verified state.
      </div>
      <div className="mb-8">
        <div className="text-xs font-semibold tracking-widest text-[#C9A84C] uppercase mb-2">
          TROPTIONS INFRASTRUCTURE CONTROL PLANE
        </div>
        <h1 className="text-2xl font-bold text-white">Infrastructure Health</h1>
        <div className="mt-2 flex items-center gap-3">
          <span className="text-sm text-gray-400">Overall Status:</span>
          <span className={`rounded px-2 py-1 text-xs border ${getHealthStatusColor(overall)}`}>
            {overall.toUpperCase()}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {checks.map((check) => (
          <div key={check.id} className="rounded-lg bg-[#0F1923] border border-gray-800 p-5">
            <div className="flex items-start justify-between mb-2">
              <div className="font-semibold text-white text-sm">{check.checkType.replace(/_/g, " ").toUpperCase()}</div>
              <span className={`rounded px-2 py-1 text-xs border ${getHealthStatusColor(check.status)}`}>
                {check.status.replace(/_/g, " ").toUpperCase()}
              </span>
            </div>
            <div className="text-xs text-gray-400">{check.message}</div>
            {check.responseTimeMs !== null && (
              <div className="text-xs text-gray-600 mt-2">Latency: {check.responseTimeMs}ms</div>
            )}
            <div className="text-xs text-gray-600 mt-1">Checked: {new Date(check.lastCheckedAt).toLocaleString()}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
