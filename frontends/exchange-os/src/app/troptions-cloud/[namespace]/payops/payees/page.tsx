import type { Metadata } from "next";
import Link from "next/link";
import { TROPTIONS_NAMESPACES } from "@/content/troptions-cloud/namespaceRegistry";
import { getMockPayees } from "@/lib/troptions/payops/mockData";
import { isPayeeCompliant, getPayeeComplianceIssues } from "@/lib/troptions/payops/compliance";
import { PAYEE_TYPE_LABELS, COMPLIANCE_STATUS_LABELS, PAYOUT_STATUS_LABELS } from "@/lib/troptions/payops/types";

interface Props {
  params: Promise<{ namespace: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { namespace } = await params;
  return { title: `Payees — ${namespace} — TROPTIONS PayOps` };
}

export async function generateStaticParams() {
  return TROPTIONS_NAMESPACES.map((n) => ({ namespace: n.slug }));
}

export default async function PayeesPage({ params }: Props) {
  const { namespace } = await params;
  const payees = getMockPayees(`ns-payops-${namespace}`);
  const blocked = payees.filter((p) => !isPayeeCompliant(p));

  return (
    <div className="px-6 py-10">
      <div className="mx-auto max-w-5xl">
        <nav className="mb-4 text-[10px] uppercase tracking-[0.2em] text-gray-500">
          <Link href={`/troptions-cloud/${namespace}`} className="hover:text-white transition-colors">Dashboard</Link>
          <span className="mx-2">/</span>
          <Link href={`/troptions-cloud/${namespace}/payops`} className="hover:text-white transition-colors">PayOps</Link>
          <span className="mx-2">/</span>
          <span className="text-white">Payees</span>
        </nav>

        <div className="mb-8">
          <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.4em] text-[#C9A84C]">TROPTIONS PAYOPS</p>
          <h1 className="text-2xl font-bold text-white">Payees</h1>
          <p className="mt-2 text-sm text-gray-400">
            Manage payee records for your namespace. KYC, W-9/W-8, and sanctions screening are required before any payee can receive a payout.
          </p>
        </div>

        <div className="mb-6 rounded-xl border border-yellow-800/50 bg-yellow-900/10 p-4">
          <p className="text-xs font-semibold text-yellow-400 uppercase tracking-[0.2em] mb-1">Simulation Only</p>
          <p className="text-xs text-yellow-300/80">Payee records shown are demonstration data. No real individuals are represented.</p>
        </div>

        {blocked.length > 0 && (
          <div className="mb-6 rounded-xl border border-red-800/40 bg-red-950/20 p-4">
            <p className="text-xs font-semibold text-red-400 uppercase tracking-[0.2em] mb-1">
              {blocked.length} Payee{blocked.length > 1 ? "s" : ""} Blocked by Compliance
            </p>
            <p className="text-xs text-red-300/80">
              Blocked payees cannot receive payouts until compliance issues are resolved.
            </p>
          </div>
        )}

        {/* Summary Strip */}
        <div className="mb-6 flex flex-wrap gap-4">
          {[
            { label: "Total", value: payees.length },
            { label: "Active", value: payees.filter((p) => p.isActive).length },
            { label: "Compliant", value: payees.filter((p) => isPayeeCompliant(p)).length },
            { label: "Blocked", value: blocked.length },
          ].map((s) => (
            <div key={s.label} className="rounded-lg border border-gray-800 bg-[#0F1923] px-4 py-2">
              <p className="text-[10px] text-gray-500 uppercase tracking-wide">{s.label}</p>
              <p className="text-xl font-bold text-white">{s.value}</p>
            </div>
          ))}
        </div>

        {/* Payee Table */}
        <div className="rounded-xl border border-gray-800 bg-[#0F1923] overflow-hidden">
          <div className="border-b border-gray-800 px-5 py-3 flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-gray-400">Payee Records</p>
            <button
              disabled
              className="rounded-lg border border-gray-700 bg-gray-800 px-3 py-1.5 text-[11px] text-gray-500 cursor-not-allowed"
              title="Adapter required to add live payees"
            >
              + Add Payee (Adapter Required)
            </button>
          </div>
          <div className="divide-y divide-gray-800">
            {payees.map((payee) => {
              const compliant = isPayeeCompliant(payee);
              const issues = getPayeeComplianceIssues(payee);
              return (
                <div key={payee.id} className="px-5 py-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="text-sm font-semibold text-white">{payee.name}</p>
                        <span className="rounded-full border border-gray-700 bg-gray-800 px-2 py-0.5 text-[10px] text-gray-400">
                          {PAYEE_TYPE_LABELS[payee.payeeType]}
                        </span>
                        {!payee.isActive && (
                          <span className="rounded-full border border-gray-700 bg-gray-900 px-2 py-0.5 text-[10px] text-gray-600">
                            Inactive
                          </span>
                        )}
                      </div>
                      <p className="mt-0.5 text-[11px] text-gray-500">{payee.email}</p>
                    </div>
                    <span
                      className={`shrink-0 inline-flex items-center rounded-full border px-2.5 py-0.5 text-[10px] uppercase tracking-wide font-medium ${
                        compliant
                          ? "border-green-800 text-green-400"
                          : "border-red-800 text-red-400"
                      }`}
                    >
                      {compliant ? "Compliant" : "Blocked"}
                    </span>
                  </div>
                  {issues.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {issues.map((issue, i) => (
                        <span key={i} className="rounded-full border border-red-900/50 bg-red-950/30 px-2 py-0.5 text-[10px] text-red-400">
                          {issue}
                        </span>
                      ))}
                    </div>
                  )}
                  <div className="mt-2 flex flex-wrap gap-3 text-[10px] text-gray-600">
                    <span>KYC: {payee.kycStatus ?? "n/a"}</span>
                    <span>W-9/W-8: {payee.w9w8Status ?? "n/a"}</span>
                    <span>Sanctions: {payee.sanctionsScreeningStatus ?? "n/a"}</span>
                    <span>Preference: {payee.payoutPreference}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
