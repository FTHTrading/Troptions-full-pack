import { getMockNamespaces } from "@/lib/troptions/infrastructure/mockData";
import { NAMESPACE_STATUS_LABELS } from "@/lib/troptions/infrastructure/types";
import { getNamespaceStatusColor, getNamespaceReadinessScore } from "@/lib/troptions/infrastructure/namespace";

export const metadata = { title: "Namespace Registry — TROPTIONS Infrastructure" };

export default function NamespacesPage() {
  const namespaces = getMockNamespaces();

  return (
    <div className="min-h-screen bg-[#060A12] text-gray-100 p-8">
      <div className="mb-6 rounded border border-yellow-600/60 bg-yellow-900/20 px-4 py-3 text-sm text-yellow-300">
        SIMULATION MODE — Namespace data is mock/build-verified only.
      </div>
      <div className="mb-8">
        <div className="text-xs font-semibold tracking-widest text-[#C9A84C] uppercase mb-2">
          TROPTIONS INFRASTRUCTURE CONTROL PLANE
        </div>
        <h1 className="text-2xl font-bold text-white">Namespace Registry</h1>
        <p className="mt-1 text-gray-400 text-sm">All provisioned and in-progress namespaces.</p>
      </div>

      <div className="rounded-lg bg-[#0F1923] border border-gray-800 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-800 text-xs text-gray-500 uppercase">
              <th className="px-4 py-3 text-left">Namespace</th>
              <th className="px-4 py-3 text-left">Slug</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-left">Readiness</th>
              <th className="px-4 py-3 text-left">Plan</th>
            </tr>
          </thead>
          <tbody>
            {namespaces.map((ns) => {
              const score = getNamespaceReadinessScore(ns);
              return (
                <tr key={ns.id} className="border-b border-gray-800/50 hover:bg-[#080C14]">
                  <td className="px-4 py-3 font-medium text-white">{ns.displayName}</td>
                  <td className="px-4 py-3 text-gray-400 font-mono text-xs">{ns.slug}</td>
                  <td className="px-4 py-3">
                    <span className={`rounded px-2 py-1 text-xs border ${getNamespaceStatusColor(ns.status)}`}>
                      {NAMESPACE_STATUS_LABELS[ns.status]}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 w-20 rounded-full bg-gray-800">
                        <div
                          className="h-1.5 rounded-full bg-[#C9A84C]"
                          style={{ width: `${score}%` }}
                        />
                      </div>
                      <span className="text-xs text-gray-400">{score}%</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-500 capitalize">{ns.billingPackage ?? "—"}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
