import { getMockBillingReadiness } from "@/lib/troptions/infrastructure/mockData";
import { getBillingReadinessScore, getBillingBlockers, getBillingStatusColor } from "@/lib/troptions/infrastructure/billingReadiness";

export const metadata = { title: "Billing Readiness — TROPTIONS Infrastructure" };

const DEMO_NAMESPACE_ID = "ns-troptions-main";

export default function BillingReadinessPage() {
  const billing = getMockBillingReadiness(DEMO_NAMESPACE_ID);
  const score = getBillingReadinessScore(billing);
  const blockers = getBillingBlockers(billing);

  return (
    <div className="min-h-screen bg-[#060A12] text-gray-100 p-8">
      <div className="mb-6 rounded border border-yellow-600/60 bg-yellow-900/20 px-4 py-3 text-sm text-yellow-300">
        SIMULATION MODE — Billing readiness data is mock state.
      </div>
      <div className="mb-8">
        <div className="text-xs font-semibold tracking-widest text-[#C9A84C] uppercase mb-2">
          TROPTIONS INFRASTRUCTURE CONTROL PLANE
        </div>
        <h1 className="text-2xl font-bold text-white">Billing Readiness</h1>
        <p className="mt-1 text-gray-400 text-sm">Track billing configuration and approval status.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="rounded-lg bg-[#0F1923] border border-gray-800 p-5">
          <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">Readiness Score</div>
          <div className="text-4xl font-bold text-[#C9A84C]">{score}%</div>
        </div>
        <div className="rounded-lg bg-[#0F1923] border border-gray-800 p-5">
          <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">Status</div>
          <span className={`rounded px-2 py-1 text-xs border ${getBillingStatusColor(billing.billingReadinessStatus)}`}>
            {billing.billingReadinessStatus.replace(/_/g, " ").toUpperCase()}
          </span>
        </div>
        <div className="rounded-lg bg-[#0F1923] border border-gray-800 p-5">
          <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">Blockers</div>
          <div className="text-3xl font-bold text-red-400">{blockers.length}</div>
        </div>
      </div>

      {blockers.length > 0 && (
        <div className="rounded-lg bg-[#0F1923] border border-red-800/50 p-5 mb-6">
          <div className="text-sm font-semibold text-red-400 mb-3">Billing Blockers</div>
          <ul className="space-y-2">
            {blockers.map((b, i) => (
              <li key={i} className="text-xs text-red-300 flex items-start gap-2">
                <span className="mt-0.5 shrink-0 text-red-500">—</span>
                {b}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="rounded-lg bg-[#0F1923] border border-gray-800 p-5">
        <div className="text-sm font-semibold text-[#C9A84C] mb-3">Billing Configuration</div>
        <dl className="space-y-2 text-sm">
          <div className="flex justify-between">
            <dt className="text-gray-500">Package</dt>
            <dd className="text-white capitalize">{billing.billingPackage ?? "—"}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-gray-500">Payment Method</dt>
            <dd className="text-white">{billing.paymentMethodStatus === "verified" ? "Verified" : billing.paymentMethodStatus === "provided" ? "On File" : "Missing"}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-gray-500">Contract Signed</dt>
            <dd className="text-white">{billing.contractStatus === "signed" || billing.contractStatus === "active" ? "Yes" : "No"}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-gray-500">Approved for Launch</dt>
            <dd className={billing.billingReadinessStatus === "billing_ready" ? "text-green-400" : "text-orange-400"}>
              {billing.billingReadinessStatus === "billing_ready" ? "Yes" : "Pending"}
            </dd>
          </div>
        </dl>
      </div>
    </div>
  );
}
