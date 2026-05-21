import type { Metadata } from "next";
import Link from "next/link";
import { TROPTIONS_NAMESPACES } from "@/content/troptions-cloud/namespaceRegistry";
import { getMockComplianceChecks } from "@/lib/troptions/payops/mockData";
import { getMockComplianceSummary } from "@/lib/troptions/payops/compliance";
import { COMPLIANCE_STATUS_COLORS } from "@/lib/troptions/payops/status";
import { COMPLIANCE_STATUS_LABELS } from "@/lib/troptions/payops/types";

interface Props {
  params: Promise<{ namespace: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { namespace } = await params;
  return { title: `Compliance — ${namespace} — TROPTIONS PayOps` };
}

export async function generateStaticParams() {
  return TROPTIONS_NAMESPACES.map((n) => ({ namespace: n.slug }));
}

const CHECK_TYPE_LABELS: Record<string, string> = {
  kyb: "Know Your Business (KYB)",
  kyc: "Know Your Customer (KYC)",
  w9_w8: "W-9 / W-8 Collection",
  sanctions_screening: "Sanctions Screening",
  approval_gate: "Approval Gate",
  aml: "AML Review",
  custom: "Custom Check",
};

export default async function CompliancePage({ params }: Props) {
  const { namespace } = await params;
  const checks = getMockComplianceChecks(`ns-payops-${namespace}`);
  const summary = getMockComplianceSummary();

  const summaryItems = [
    { label: "KYB", status: summary.kybStatus },
    { label: "KYC", status: summary.kycStatus },
    { label: "W-9 / W-8", status: summary.w9w8Status },
    { label: "Sanctions", status: summary.sanctionsStatus },
    { label: "Approval Gate", status: summary.approvalGateStatus },
    { label: "Overall", status: summary.overallStatus },
  ];

  return (
    <div className="px-6 py-10">
      <div className="mx-auto max-w-5xl">
        <nav className="mb-4 text-[10px] uppercase tracking-[0.2em] text-gray-500">
          <Link href={`/troptions-cloud/${namespace}`} className="hover:text-white transition-colors">Dashboard</Link>
          <span className="mx-2">/</span>
          <Link href={`/troptions-cloud/${namespace}/payops`} className="hover:text-white transition-colors">PayOps</Link>
          <span className="mx-2">/</span>
          <span className="text-white">Compliance</span>
        </nav>

        <div className="mb-8">
          <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.4em] text-[#C9A84C]">TROPTIONS PAYOPS</p>
          <h1 className="text-2xl font-bold text-white">Compliance</h1>
          <p className="mt-2 text-sm text-gray-400">
            All payouts require compliance approval before execution. Track KYC, KYB, W-9/W-8, and sanctions screening status here.
          </p>
        </div>

        <div className="mb-6 rounded-xl border border-yellow-800/50 bg-yellow-900/10 p-4">
          <p className="text-xs font-semibold text-yellow-400 uppercase tracking-[0.2em] mb-1">Simulation Only</p>
          <p className="text-xs text-yellow-300/80">Compliance statuses shown are demonstration data. No real compliance checks have been performed.</p>
        </div>

        {summary.blockReasons.length > 0 && (
          <div className="mb-6 rounded-xl border border-orange-800/40 bg-orange-950/20 p-4">
            <p className="text-xs font-semibold text-orange-400 uppercase tracking-[0.2em] mb-2">Open Compliance Items</p>
            <ul className="space-y-1">
              {summary.blockReasons.map((r, i) => (
                <li key={i} className="flex items-start gap-2 text-xs text-orange-300/80">
                  <span className="mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full bg-orange-400" />
                  {r}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Summary Grid */}
        <div className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-3">
          {summaryItems.map((item) => {
            const colors = COMPLIANCE_STATUS_COLORS[item.status];
            return (
              <div key={item.label} className={`rounded-xl border ${colors} p-4`}>
                <p className="text-[10px] uppercase tracking-[0.15em] opacity-70">{item.label}</p>
                <p className="mt-1 text-sm font-semibold">{COMPLIANCE_STATUS_LABELS[item.status]}</p>
              </div>
            );
          })}
        </div>

        {/* Check Records */}
        <div className="rounded-xl border border-gray-800 bg-[#0F1923] overflow-hidden">
          <div className="border-b border-gray-800 px-5 py-3">
            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-gray-400">Compliance Check Records</p>
          </div>
          <div className="divide-y divide-gray-800">
            {checks.map((c) => {
              const colors = COMPLIANCE_STATUS_COLORS[c.status];
              return (
                <div key={c.id} className="px-5 py-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-sm font-semibold text-white">
                        {CHECK_TYPE_LABELS[c.checkType] ?? c.checkType}
                      </p>
                      <p className="text-[11px] text-gray-500 mt-0.5">
                        Entity: {c.entityType} · {c.entityId}
                      </p>
                    </div>
                    <span className={`shrink-0 inline-flex items-center rounded-full border px-2.5 py-0.5 text-[10px] uppercase tracking-wide font-medium ${colors}`}>
                      {COMPLIANCE_STATUS_LABELS[c.status]}
                    </span>
                  </div>
                  {c.blockReason && (
                    <div className="mt-2 rounded-lg border border-red-800/40 bg-red-950/20 px-3 py-2">
                      <p className="text-[11px] text-red-400">{c.blockReason}</p>
                    </div>
                  )}
                  {c.notes && <p className="mt-2 text-[11px] text-gray-600">{c.notes}</p>}
                  <p className="mt-2 text-[10px] text-gray-700">Updated: {new Date(c.updatedAt).toLocaleDateString()}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
