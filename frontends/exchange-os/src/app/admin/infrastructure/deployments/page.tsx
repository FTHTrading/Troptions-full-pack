import { getMockDeploymentRecords } from "@/lib/troptions/infrastructure/mockData";
import { DEPLOYMENT_STATUS_LABELS } from "@/lib/troptions/infrastructure/types";
import { getDeploymentStatusColor } from "@/lib/troptions/infrastructure/deployments";

export const metadata = { title: "Deployment Readiness — TROPTIONS Infrastructure" };

const DEMO_NAMESPACE_ID = "ns-troptions-main";

export default function DeploymentsPage() {
  const records = getMockDeploymentRecords(DEMO_NAMESPACE_ID);

  return (
    <div className="min-h-screen bg-[#060A12] text-gray-100 p-8">
      <div className="mb-6 rounded border border-yellow-600/60 bg-yellow-900/20 px-4 py-3 text-sm text-yellow-300">
        SIMULATION MODE — Deployment records reflect build-verified state only.
      </div>
      <div className="mb-8">
        <div className="text-xs font-semibold tracking-widest text-[#C9A84C] uppercase mb-2">
          TROPTIONS INFRASTRUCTURE CONTROL PLANE
        </div>
        <h1 className="text-2xl font-bold text-white">Deployment Readiness</h1>
        <p className="mt-1 text-gray-400 text-sm">Deployment targets and records for all systems.</p>
      </div>

      <div className="rounded-lg bg-[#0F1923] border border-gray-800 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-800 text-xs text-gray-500 uppercase">
              <th className="px-4 py-3 text-left">Record ID</th>
              <th className="px-4 py-3 text-left">Target</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-left">Deployed At</th>
              <th className="px-4 py-3 text-left">Notes</th>
            </tr>
          </thead>
          <tbody>
            {records.map((rec) => (
              <tr key={rec.id} className="border-b border-gray-800/50 hover:bg-[#080C14]">
                <td className="px-4 py-3 font-mono text-xs text-gray-400">{rec.id}</td>
                <td className="px-4 py-3 text-white text-xs">{rec.targetId}</td>
                <td className="px-4 py-3">
                  <span className={`rounded px-2 py-1 text-xs border ${getDeploymentStatusColor(rec.status)}`}>
                    {DEPLOYMENT_STATUS_LABELS[rec.status]}
                  </span>
                </td>
                <td className="px-4 py-3 text-xs text-gray-500">
                  {rec.deployCompletedAt ? new Date(rec.deployCompletedAt).toLocaleString() : "—"}
                </td>
                <td className="px-4 py-3 text-xs text-gray-500">{rec.rollbackNotes || "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
