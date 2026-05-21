import { CUSTODY_REGISTRY } from "@/content/troptions/custodyRegistry";
import { DisclaimerBanner } from "@/components/troptions/DisclaimerBanner";
import { StatusBadge } from "@/components/troptions/StatusBadge";

export const metadata = {
  title: "Custody — Troptions",
};

export default function CustodyPage() {
  return (
    <main className="min-h-screen bg-[#0A0A0A] text-white">
      <div className="border-b border-[#C9A84C]/20 bg-[#0D1B2A]">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <p className="text-[#C9A84C] font-mono text-xs uppercase tracking-[0.3em]">Institutional Custody</p>
          <h1 className="text-3xl font-bold text-white mt-2">Custody Registry</h1>
          <p className="text-gray-400 mt-2 text-sm">All registered custody providers with agreement and regulatory status.</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-10 space-y-10">
        <DisclaimerBanner variant="master" />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {CUSTODY_REGISTRY.map((provider) => (
            <div key={provider.custodyId} className="bg-[#0D1B2A] border border-[#C9A84C]/20 rounded-lg p-5">
              <div className="flex items-start justify-between gap-2 mb-3">
                <div>
                  <p className="text-[#C9A84C] font-mono text-xs uppercase tracking-widest">{provider.custodyId}</p>
                  <h3 className="text-white font-semibold mt-0.5">{provider.name}</h3>
                </div>
                <StatusBadge status={provider.status} />
              </div>
              <p className="text-slate-400 text-xs mb-3">{provider.type} · {provider.chains.slice(0, 3).join(", ")}{provider.chains.length > 3 ? ` +${provider.chains.length - 3}` : ""}</p>
              <div className="space-y-1.5 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Regulatory Status</span>
                  <StatusBadge status={provider.regulatoryStatus === "qualified-custodian" ? "approved" : "evaluation"} label={provider.regulatoryStatus} size="sm" />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Insurance</span>
                  <span className={provider.insuranceCoverage ? "text-green-400" : "text-red-400"}>
                    {provider.insuranceCoverage ?? "Not configured"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Multi-Sig</span>
                  <span className="text-slate-300 font-mono">{provider.multiSigConfig}</span>
                </div>
              </div>
              <p className="text-[#C9A84C] text-xs mt-3 font-mono">Next: {provider.nextAction}</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
