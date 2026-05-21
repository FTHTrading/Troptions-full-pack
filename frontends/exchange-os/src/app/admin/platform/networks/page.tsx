import { generateNetworkReadinessReport } from "@/lib/troptions/networks/registry";

export const metadata = { title: "Network Adapters — TROPTIONS Platform" };

export default function NetworkAdaptersPage() {
  const report = generateNetworkReadinessReport();

  return (
    <div className="min-h-screen bg-[#060A12] text-gray-100 p-8">
      <div className="mb-6 rounded border border-yellow-600/60 bg-yellow-900/20 px-4 py-3 text-sm text-yellow-300">
        SIMULATION MODE — Network adapters are shells. No live execution. Credentials required for all production adapters.
      </div>
      <div className="mb-8">
        <div className="text-xs font-semibold tracking-widest text-[#C9A84C] uppercase mb-2">
          TROPTIONS SR PLATFORM FOUNDATION
        </div>
        <h1 className="text-2xl font-bold text-white">Network Adapter Registry</h1>
        <p className="mt-1 text-gray-400 text-sm">
          Provider-neutral adapter shells for XRPL, Stellar, EVM, Solana, Bitcoin, stablecoin, bank, and payroll partners.
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="rounded-lg bg-[#0F1923] border border-gray-800 p-5">
          <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">Total Adapters</div>
          <div className="text-3xl font-bold text-white">{report.adapters.length}</div>
        </div>
        <div className="rounded-lg bg-[#0F1923] border border-gray-800 p-5">
          <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">Credentials Required</div>
          <div className="text-3xl font-bold text-orange-400">{report.requiresCredentials.length}</div>
        </div>
        <div className="rounded-lg bg-[#0F1923] border border-gray-800 p-5">
          <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">Mock Only</div>
          <div className="text-3xl font-bold text-blue-400">{report.mockOnly.length}</div>
        </div>
        <div className="rounded-lg bg-[#0F1923] border border-gray-800 p-5">
          <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">Ready for Mainnet</div>
          <div className="text-3xl font-bold text-green-400">{report.readyForMainnet.length}</div>
        </div>
      </div>

      <div className="space-y-4">
        {report.adapters.map((adapter) => (
          <div key={adapter.adapterId} className="rounded-lg bg-[#0F1923] border border-gray-800 p-5">
            <div className="flex items-start justify-between mb-2">
              <div>
                <div className="font-semibold text-white">{adapter.networkName}</div>
                <div className="text-xs text-gray-500 mt-0.5 font-mono">{adapter.adapterId}</div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500 border border-gray-700 rounded px-2 py-0.5 capitalize">
                  {adapter.readinessStatus.replace(/_/g, " ")}
                </span>
                <span className="text-xs text-red-400 border border-red-900/50 rounded px-2 py-0.5">
                  Execution Disabled
                </span>
              </div>
            </div>
            <div className="text-xs text-gray-400 mb-3">{adapter.notes}</div>
            {adapter.requiredCredentials.length > 0 && (
              <div className="text-xs text-orange-300/70">
                Required credentials: {adapter.requiredCredentials.join(", ")}
              </div>
            )}
            {adapter.complianceNotes.length > 0 && (
              <div className="mt-2 space-y-1">
                {adapter.complianceNotes.map((note, i) => (
                  <div key={i} className="text-xs text-yellow-300/60">— {note}</div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
