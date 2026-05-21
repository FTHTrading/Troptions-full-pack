import { RWA_COMPLIANCE_RECORDS, getHighRegulatoryRiskProviders } from "@/lib/troptions/rwa-adapters/compliance";
import { getRwaProviderById } from "@/lib/troptions/rwa-adapters/providers";

export const metadata = { title: "RWA Compliance Registry — TROPTIONS Platform" };

export default function RwaCompliancePage() {
  const records = RWA_COMPLIANCE_RECORDS;
  const highRisk = getHighRegulatoryRiskProviders();

  return (
    <div className="min-h-screen bg-[#060A12] text-gray-100 p-8">
      <div className="mb-6 rounded border border-red-700/60 bg-red-900/20 px-4 py-3 text-sm text-red-300">
        INTERNAL — Compliance records are for internal review. This is NOT legal advice.
        Consult qualified legal counsel before making any public regulatory claims.
      </div>
      <div className="mb-8">
        <div className="text-xs font-semibold tracking-widest text-[#C9A84C] uppercase mb-2">
          TROPTIONS PLATFORM / RWA ADAPTERS
        </div>
        <h1 className="text-2xl font-bold text-white">RWA Compliance Registry</h1>
        <p className="mt-1 text-gray-400 text-sm">
          Regulatory context and compliance requirements for each RWA provider adapter.
          {highRisk.length} providers have securities law applicability.
        </p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="rounded-lg bg-[#0F1923] border border-gray-800 p-5">
          <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">Total Records</div>
          <div className="text-3xl font-bold text-white">{records.length}</div>
        </div>
        <div className="rounded-lg bg-[#0F1923] border border-gray-800 p-5">
          <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">Securities Law Applies</div>
          <div className="text-3xl font-bold text-red-400">{highRisk.length}</div>
        </div>
        <div className="rounded-lg bg-[#0F1923] border border-gray-800 p-5">
          <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">Accredited Required</div>
          <div className="text-3xl font-bold text-orange-400">
            {records.filter((r) => r.accreditedInvestorRequired).length}
          </div>
        </div>
        <div className="rounded-lg bg-[#0F1923] border border-gray-800 p-5">
          <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">License Required</div>
          <div className="text-3xl font-bold text-yellow-400">
            {records.filter((r) => r.licenseRequired).length}
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {records.map((rec) => {
          const adapter = getRwaProviderById(rec.providerId);
          const isCritical = rec.securitiesLawApplies;

          return (
            <div
              key={rec.providerId}
              className={`rounded-lg bg-[#0F1923] border p-5 ${
                isCritical ? "border-orange-800/60" : "border-gray-800"
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <div>
                  <div className="font-semibold text-white">{adapter?.displayName ?? rec.providerId}</div>
                  <div className="text-xs text-gray-500">{rec.jurisdiction}</div>
                </div>
                {isCritical && (
                  <span className="text-xs text-orange-400 border border-orange-800/50 rounded px-2 py-0.5">
                    Securities Law Applies
                  </span>
                )}
              </div>

              <p className="text-xs text-gray-400 mb-3 leading-relaxed">{rec.regulatoryStatus}</p>

              <div className="flex flex-wrap gap-3 mb-3">
                {[
                  { label: "License Required", value: rec.licenseRequired },
                  { label: "KYC Required", value: rec.kycRequired },
                  { label: "AML Required", value: rec.amlRequired },
                  { label: "Accredited Investor", value: rec.accreditedInvestorRequired },
                  { label: "Securities Law", value: rec.securitiesLawApplies },
                ].map(({ label, value }) => (
                  <div key={label} className="flex items-center gap-1.5">
                    <div className={`w-2 h-2 rounded-full ${value ? "bg-orange-500" : "bg-gray-700"}`} />
                    <span className="text-xs text-gray-500">{label}: {value ? "Yes" : "No"}</span>
                  </div>
                ))}
              </div>

              {rec.notes && (
                <div className="rounded bg-[#080C14] border border-gray-800 p-3 text-xs text-gray-500 leading-relaxed">
                  {rec.notes}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-8 rounded-lg border border-gray-800 bg-[#0F1923] p-5 text-xs text-gray-600">
        <strong className="text-gray-500">Disclaimer:</strong> These compliance records are research-level
        summaries based on publicly available information. They are not legal advice. TROPTIONS is not a
        registered investment adviser, broker-dealer, transfer agent, bank, or licensed money transmitter.
        Legal counsel must be engaged before any integration or public claim involving these providers.
      </div>
    </div>
  );
}
