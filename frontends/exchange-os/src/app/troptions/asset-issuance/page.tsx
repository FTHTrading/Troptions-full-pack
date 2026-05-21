import { ASSET_REGISTRY } from "@/content/troptions/assetRegistry";
import { DisclaimerBanner } from "@/components/troptions/DisclaimerBanner";
import { StatusBadge } from "@/components/troptions/StatusBadge";

export const metadata = {
  title: "Asset Issuance — Troptions",
};

export default function AssetIssuancePage() {
  const blocked = ASSET_REGISTRY.filter((a) => a.issuanceStatus !== "approved");
  const issued = ASSET_REGISTRY.filter((a) => a.issuanceStatus === "approved");

  return (
    <main className="min-h-screen bg-[#0A0A0A] text-white">
      <div className="border-b border-[#C9A84C]/20 bg-[#0D1B2A]">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <p className="text-[#C9A84C] font-mono text-xs uppercase tracking-[0.3em]">Asset Issuance</p>
          <h1 className="text-3xl font-bold text-white mt-2">Asset Registry</h1>
          <p className="text-gray-400 mt-2 text-sm">All Troptions assets with full issuance gate status.</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-10 space-y-10">
        <DisclaimerBanner variant="asset" />

        {/* Summary */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          <div className="bg-[#0D1B2A] border border-slate-700/40 rounded-lg p-4">
            <p className="text-[10px] text-slate-500 uppercase tracking-widest font-mono">Total Assets</p>
            <p className="text-3xl font-bold text-white mt-1">{ASSET_REGISTRY.length}</p>
          </div>
          <div className="bg-[#0D1B2A] border border-slate-700/40 rounded-lg p-4">
            <p className="text-[10px] text-slate-500 uppercase tracking-widest font-mono">Issued</p>
            <p className="text-3xl font-bold text-green-400 mt-1">{issued.length}</p>
          </div>
          <div className="bg-[#0D1B2A] border border-slate-700/40 rounded-lg p-4">
            <p className="text-[10px] text-slate-500 uppercase tracking-widest font-mono">Pending Approval</p>
            <p className="text-3xl font-bold text-yellow-400 mt-1">{blocked.length}</p>
          </div>
        </div>

        {/* Assets */}
        <div className="space-y-6">
          {ASSET_REGISTRY.map((asset) => (
            <div key={asset.assetId} className="bg-[#0D1B2A] border border-[#C9A84C]/20 rounded-lg p-6">
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <div className="flex items-center gap-3">
                    <span className="text-[#C9A84C] font-mono text-sm font-bold">{asset.assetType}</span>
                    <span className="text-slate-500 font-mono text-xs">{asset.assetId}</span>
                  </div>
                  <h3 className="text-white font-semibold text-lg mt-0.5">{asset.assetName}</h3>
                  <p className="text-slate-400 text-sm mt-1">{asset.assetClass} · {asset.jurisdiction}</p>
                </div>
                <StatusBadge status={asset.issuanceStatus} />
              </div>

              {/* Gate Status Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                {[
                  { label: "Legal", value: asset.legalStatus },
                  { label: "Custody", value: asset.custodyStatus },
                  { label: "Reserve", value: asset.reserveStatus },
                  { label: "Board", value: asset.boardApprovalStatus },
                  { label: "Compliance", value: asset.complianceStatus },
                ].map((gate) => (
                  <div key={gate.label} className="bg-slate-900/40 border border-slate-700/30 rounded p-3">
                    <p className="text-[10px] text-slate-500 uppercase tracking-widest font-mono">{gate.label}</p>
                    <div className="mt-1.5">
                      <StatusBadge status={gate.value === "not-started" ? "blocked" : gate.value} label={gate.value} size="sm" />
                    </div>
                  </div>
                ))}
              </div>

              {/* Blockers */}
              {asset.documentsRequired.length > 0 && (
                <div className="mt-4 bg-red-950/20 border border-red-800/30 rounded p-4">
                  <p className="text-[10px] text-red-400 uppercase tracking-widest font-mono mb-2">Required Documents</p>
                  <ul className="list-disc list-inside text-red-300 text-xs space-y-0.5">
                    {asset.documentsRequired.map((b, i) => <li key={i}>{b}</li>)}
                  </ul>
                </div>
              )}

              {/* Next Action */}
              <p className="text-slate-500 text-xs mt-4">
                <span className="text-[#C9A84C] font-mono">Next Action: </span>
                {asset.nextAction}
              </p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
