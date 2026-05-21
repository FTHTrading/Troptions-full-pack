import { getMockAdapters } from "@/lib/troptions/infrastructure/mockData";
import { ADAPTER_STATUS_LABELS, ADAPTER_CATEGORY_LABELS } from "@/lib/troptions/infrastructure/types";
import { getAdapterStatusColor } from "@/lib/troptions/infrastructure/adapters";

export const metadata = { title: "Adapter Registry — TROPTIONS Infrastructure" };

const DEMO_NAMESPACE_ID = "ns-troptions-main";

export default function AdaptersPage() {
  const adapters = getMockAdapters(DEMO_NAMESPACE_ID);

  return (
    <div className="min-h-screen bg-[#060A12] text-gray-100 p-8">
      <div className="mb-6 rounded border border-yellow-600/60 bg-yellow-900/20 px-4 py-3 text-sm text-yellow-300">
        SIMULATION MODE — Adapters are shells. Live execution requires production-ready credentials.
      </div>
      <div className="mb-8">
        <div className="text-xs font-semibold tracking-widest text-[#C9A84C] uppercase mb-2">
          TROPTIONS INFRASTRUCTURE CONTROL PLANE
        </div>
        <h1 className="text-2xl font-bold text-white">Adapter Registry</h1>
        <p className="mt-1 text-gray-400 text-sm">Provider-neutral adapter configuration. Execution disabled until credentials are configured.</p>
      </div>

      <div className="rounded-lg bg-[#0F1923] border border-gray-800 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-800 text-xs text-gray-500 uppercase">
              <th className="px-4 py-3 text-left">Adapter</th>
              <th className="px-4 py-3 text-left">Category</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-left">Execution</th>
              <th className="px-4 py-3 text-left">Notes</th>
            </tr>
          </thead>
          <tbody>
            {adapters.map((adapter) => (
              <tr key={adapter.id} className="border-b border-gray-800/50 hover:bg-[#080C14]">
                <td className="px-4 py-3 font-medium text-white">{adapter.adapterName}</td>
                <td className="px-4 py-3 text-xs text-gray-400">
                  {ADAPTER_CATEGORY_LABELS[adapter.category]}
                </td>
                <td className="px-4 py-3">
                  <span className={`rounded px-2 py-1 text-xs border ${getAdapterStatusColor(adapter.status)}`}>
                    {ADAPTER_STATUS_LABELS[adapter.status]}
                  </span>
                </td>
                <td className="px-4 py-3">
                  {adapter.supportsExecution ? (
                    <span className="text-xs text-orange-400">Requires Credentials</span>
                  ) : (
                    <span className="text-xs text-gray-600">Not Applicable</span>
                  )}
                </td>
                <td className="px-4 py-3 text-xs text-gray-500">{adapter.notes ?? "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
