import type { Metadata } from "next";
import Link from "next/link";
import { TROPTIONS_NAMESPACES, getNamespace } from "@/content/troptions-cloud/namespaceRegistry";
import { getMockPayOpsClient, getMockFeeLedger } from "@/lib/troptions/payops/mockData";
import { TROPTIONS_FEE_SCHEDULES } from "@/lib/troptions/payops/fees";
import { FEE_TYPE_DESCRIPTIONS } from "@/lib/troptions/payops/fees";

interface Props {
  params: Promise<{ namespace: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { namespace } = await params;
  return { title: `PayOps Settings — ${namespace} — TROPTIONS PayOps` };
}

export async function generateStaticParams() {
  return TROPTIONS_NAMESPACES.map((n) => ({ namespace: n.slug }));
}

export default async function PayOpsSettingsPage({ params }: Props) {
  const { namespace } = await params;
  const ns = getNamespace(namespace);
  const client = getMockPayOpsClient(namespace);
  const ledger = getMockFeeLedger(`ns-payops-${namespace}`);
  const schedule = TROPTIONS_FEE_SCHEDULES[client.subscriptionTier ?? "growth"];

  return (
    <div className="px-6 py-10">
      <div className="mx-auto max-w-4xl">
        <nav className="mb-4 text-[10px] uppercase tracking-[0.2em] text-gray-500">
          <Link href={`/troptions-cloud/${namespace}`} className="hover:text-white transition-colors">Dashboard</Link>
          <span className="mx-2">/</span>
          <Link href={`/troptions-cloud/${namespace}/payops`} className="hover:text-white transition-colors">PayOps</Link>
          <span className="mx-2">/</span>
          <span className="text-white">Settings</span>
        </nav>

        <div className="mb-8">
          <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.4em] text-[#C9A84C]">TROPTIONS PAYOPS</p>
          <h1 className="text-2xl font-bold text-white">PayOps Settings</h1>
          <p className="mt-2 text-sm text-gray-400">
            Namespace-level configuration for TROPTIONS PayOps. Contact your TROPTIONS account manager to make changes.
          </p>
        </div>

        <div className="mb-6 rounded-xl border border-yellow-800/50 bg-yellow-900/10 p-4">
          <p className="text-xs font-semibold text-yellow-400 uppercase tracking-[0.2em] mb-1">Simulation Only</p>
          <p className="text-xs text-yellow-300/80">Settings shown are demonstration values. No live configuration is active.</p>
        </div>

        {/* Namespace Info */}
        <div className="mb-6 rounded-xl border border-gray-800 bg-[#0F1923] p-5">
          <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-gray-500 mb-3">Namespace</p>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-[10px] text-gray-600">Display Name</p>
              <p className="text-white mt-0.5">{ns?.displayName ?? namespace}</p>
            </div>
            <div>
              <p className="text-[10px] text-gray-600">Slug</p>
              <p className="text-white font-mono mt-0.5">{namespace}</p>
            </div>
            <div>
              <p className="text-[10px] text-gray-600">PayOps Status</p>
              <p className="text-white mt-0.5 capitalize">{client.payOpsStatus}</p>
            </div>
            <div>
              <p className="text-[10px] text-gray-600">Subscription Tier</p>
              <p className="text-white mt-0.5 capitalize">{client.subscriptionTier}</p>
            </div>
          </div>
        </div>

        {/* Fee Schedule */}
        <div className="mb-6 rounded-xl border border-gray-800 bg-[#0F1923] p-5">
          <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-gray-500 mb-3">
            Fee Schedule — {schedule.tier.charAt(0).toUpperCase() + schedule.tier.slice(1)} Tier
          </p>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {[
              { label: "Monthly Subscription", value: `$${schedule.monthlySubscription}/mo` },
              { label: "Setup Fee", value: `$${schedule.setupFee}` },
              { label: "Payout Fee Rate", value: `${schedule.payoutFeeBps / 100}%` },
              { label: "Payout Fee Min", value: `$${schedule.payoutFeeMin}` },
              { label: "Payout Fee Max", value: `$${schedule.payoutFeeMax}` },
              { label: "Compliance Packet", value: `$${schedule.compliancePacketFee}` },
              { label: "Export Fee", value: `$${schedule.exportFee}` },
              { label: "Adapter Activation", value: `$${schedule.adapterActivationFee}` },
            ].map((item) => (
              <div key={item.label} className="rounded-lg border border-gray-700 px-3 py-2">
                <p className="text-[10px] text-gray-600">{item.label}</p>
                <p className="text-sm font-semibold text-white mt-0.5">{item.value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Fee Ledger */}
        <div className="mb-6 rounded-xl border border-gray-800 bg-[#0F1923] overflow-hidden">
          <div className="border-b border-gray-800 px-5 py-3">
            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-gray-400">Fee Ledger</p>
          </div>
          <div className="divide-y divide-gray-800">
            {ledger.map((entry) => (
              <div key={entry.id} className="flex items-center justify-between gap-4 px-5 py-3">
                <div>
                  <p className="text-[12px] text-gray-300">{entry.description}</p>
                  <p className="text-[10px] text-gray-600 mt-0.5">{entry.feeType} · {new Date(entry.createdAt).toLocaleDateString()}</p>
                </div>
                <div className="shrink-0 text-right">
                  <p className="text-sm font-semibold text-white">${entry.amount.toFixed(2)}</p>
                  <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] uppercase tracking-wide ${
                    entry.status === "paid"
                      ? "border-green-800 text-green-400"
                      : entry.status === "invoiced"
                      ? "border-yellow-800 text-yellow-400"
                      : "border-gray-700 text-gray-500"
                  }`}>
                    {entry.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-gray-800 bg-[#0F1923] p-5">
          <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-gray-500 mb-2">Account Management</p>
          <p className="text-xs text-gray-400 leading-relaxed">
            To upgrade your subscription tier, configure execution adapters, or modify compliance settings,
            contact your TROPTIONS account manager. Configuration changes require verification and may require compliance review.
          </p>
          <Link
            href="/troptions/contact"
            className="mt-3 inline-block text-[11px] text-[#C9A84C] hover:underline"
          >
            Contact TROPTIONS →
          </Link>
        </div>
      </div>
    </div>
  );
}
