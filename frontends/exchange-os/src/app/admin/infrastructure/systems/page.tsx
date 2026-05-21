import { getMockClientSystems } from "@/lib/troptions/infrastructure/mockData";
import { SYSTEM_TYPE_LABELS } from "@/lib/troptions/infrastructure/types";

export const metadata = { title: "System Factory — TROPTIONS Infrastructure" };

export default function SystemsPage() {
  const systems = getMockClientSystems();

  return (
    <div className="min-h-screen bg-[#060A12] text-gray-100 p-8">
      <div className="mb-6 rounded border border-yellow-600/60 bg-yellow-900/20 px-4 py-3 text-sm text-yellow-300">
        SIMULATION MODE — System factory data is build-verified only.
      </div>
      <div className="mb-8">
        <div className="text-xs font-semibold tracking-widest text-[#C9A84C] uppercase mb-2">
          TROPTIONS INFRASTRUCTURE CONTROL PLANE
        </div>
        <h1 className="text-2xl font-bold text-white">System Factory</h1>
        <p className="mt-1 text-gray-400 text-sm">Client systems generated from TROPTIONS system factory templates.</p>
      </div>

      <div className="space-y-6">
        {systems.map((system) => (
          <div key={system.id} className="rounded-lg bg-[#0F1923] border border-gray-800 p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="text-lg font-semibold text-white">{system.displayName}</div>
                <div className="text-xs text-gray-500 mt-1">{SYSTEM_TYPE_LABELS[system.systemType]}</div>
              </div>
              <span className="text-xs text-gray-400 border border-gray-700 rounded px-2 py-1 capitalize">
                {system.status.replace(/_/g, " ")}
              </span>
            </div>

            {system.requiredModules && system.requiredModules.length > 0 && (
              <div>
                <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Required Modules</div>
                <div className="flex flex-wrap gap-2">
                  {system.requiredModules.map((mod) => (
                    <span key={mod} className="text-xs rounded bg-[#080C14] border border-gray-700 px-2 py-1 text-gray-400">{mod}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
