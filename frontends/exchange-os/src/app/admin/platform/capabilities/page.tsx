import { getPlatformCapabilities, getCapabilityStatusColor } from "@/lib/troptions/platform/capabilities";
import { CAPABILITY_STATUS_LABELS } from "@/lib/troptions/platform/types";

export const metadata = { title: "Capability Registry — TROPTIONS Platform" };

export default function CapabilitiesPage() {
  const capabilities = getPlatformCapabilities();

  return (
    <div className="min-h-screen bg-[#060A12] text-gray-100 p-8">
      <div className="mb-6 rounded border border-yellow-600/60 bg-yellow-900/20 px-4 py-3 text-sm text-yellow-300">
        SIMULATION MODE — Live capabilities require production-ready provider adapters.
      </div>
      <div className="mb-8">
        <div className="text-xs font-semibold tracking-widest text-[#C9A84C] uppercase mb-2">
          TROPTIONS SR PLATFORM FOUNDATION
        </div>
        <h1 className="text-2xl font-bold text-white">Capability Registry</h1>
        <p className="mt-1 text-gray-400 text-sm">All registered platform capabilities and current readiness status.</p>
      </div>

      <div className="space-y-4">
        {capabilities.map((cap) => (
          <div key={cap.id} className="rounded-lg bg-[#0F1923] border border-gray-800 p-5">
            <div className="flex items-start justify-between mb-2">
              <div>
                <div className="font-semibold text-white">{cap.displayName}</div>
                <div className="text-xs text-gray-400 mt-1">{cap.description}</div>
              </div>
              <span className={`shrink-0 rounded px-2 py-1 text-xs border ${getCapabilityStatusColor(cap.status)}`}>
                {CAPABILITY_STATUS_LABELS[cap.status]}
              </span>
            </div>
            {cap.limitations.length > 0 && (
              <div className="mt-3">
                <div className="text-xs text-gray-600 uppercase tracking-wide mb-1">Limitations</div>
                <ul className="space-y-1">
                  {cap.limitations.map((lim, i) => (
                    <li key={i} className="text-xs text-orange-300/70">— {lim}</li>
                  ))}
                </ul>
              </div>
            )}
            {cap.nextSteps.length > 0 && (
              <div className="mt-3">
                <div className="text-xs text-gray-600 uppercase tracking-wide mb-1">Next Steps</div>
                <ul className="space-y-1">
                  {cap.nextSteps.map((step, i) => (
                    <li key={i} className="text-xs text-blue-300/70">— {step}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
