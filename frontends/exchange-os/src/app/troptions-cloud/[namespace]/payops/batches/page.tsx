import type { Metadata } from "next";
import Link from "next/link";
import { TROPTIONS_NAMESPACES } from "@/content/troptions-cloud/namespaceRegistry";
import { getMockPayoutBatches } from "@/lib/troptions/payops/mockData";
import { PAYOUT_STATUS_COLORS } from "@/lib/troptions/payops/status";
import { PAYOUT_TYPE_LABELS, PAYOUT_STATUS_LABELS } from "@/lib/troptions/payops/types";

interface Props {
  params: Promise<{ namespace: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { namespace } = await params;
  return { title: `Payout Batches — ${namespace} — TROPTIONS PayOps` };
}

export async function generateStaticParams() {
  return TROPTIONS_NAMESPACES.map((n) => ({ namespace: n.slug }));
}

export default async function BatchesPage({ params }: Props) {
  const { namespace } = await params;
  const batches = getMockPayoutBatches(`ns-payops-${namespace}`);

  return (
    <div className="px-6 py-10">
      <div className="mx-auto max-w-5xl">
        <nav className="mb-4 text-[10px] uppercase tracking-[0.2em] text-gray-500">
          <Link href={`/troptions-cloud/${namespace}`} className="hover:text-white transition-colors">Dashboard</Link>
          <span className="mx-2">/</span>
          <Link href={`/troptions-cloud/${namespace}/payops`} className="hover:text-white transition-colors">PayOps</Link>
          <span className="mx-2">/</span>
          <span className="text-white">Batches</span>
        </nav>

        <div className="mb-8">
          <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.4em] text-[#C9A84C]">TROPTIONS PAYOPS</p>
          <h1 className="text-2xl font-bold text-white">Payout Batches</h1>
          <p className="mt-2 text-sm text-gray-400">
            Review, approve, and track payout batches. Approved batches remain in &quot;Approved / Not Executed&quot; status until a live adapter is configured.
          </p>
        </div>

        <div className="mb-6 rounded-xl border border-yellow-800/50 bg-yellow-900/10 p-4">
          <p className="text-xs font-semibold text-yellow-400 uppercase tracking-[0.2em] mb-1">Simulation Only</p>
          <p className="text-xs text-yellow-300/80">Batch data shown is demonstration data. No real payouts are scheduled or executed.</p>
        </div>

        {/* Approved/Not Executed Banner */}
        {batches.some((b) => b.status === "approved_not_executed") && (
          <div className="mb-6 rounded-xl border border-blue-800/40 bg-blue-950/20 p-4">
            <p className="text-xs font-semibold text-blue-400 uppercase tracking-[0.2em] mb-1">
              Execution Adapter Required Before Live Payout Movement
            </p>
            <p className="text-xs text-blue-300/80">
              One or more batches are approved but not executed. These batches are waiting for a configured live adapter (bank partner, payroll partner, or stablecoin partner) before funds can be moved.
            </p>
          </div>
        )}

        {/* Summary Strip */}
        <div className="mb-6 flex flex-wrap gap-3">
          {(["draft", "pending_approval", "approved_not_executed", "blocked_by_compliance"] as const).map((s) => {
            const count = batches.filter((b) => b.status === s).length;
            const colors = PAYOUT_STATUS_COLORS[s];
            return (
              <div key={s} className={`rounded-lg border ${colors} px-3 py-2`}>
                <p className="text-[10px] uppercase tracking-wide">{PAYOUT_STATUS_LABELS[s]}</p>
                <p className="text-lg font-bold">{count}</p>
              </div>
            );
          })}
        </div>

        {/* Batch Cards */}
        <div className="space-y-4">
          {batches.map((batch) => {
            const colors = PAYOUT_STATUS_COLORS[batch.status];
            return (
              <div key={batch.id} className="rounded-xl border border-gray-800 bg-[#0F1923] p-5">
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div>
                    <p className="text-sm font-semibold text-white">{batch.name}</p>
                    <p className="text-[11px] text-gray-500 mt-0.5 font-mono">{batch.id}</p>
                  </div>
                  <span className={`shrink-0 inline-flex items-center rounded-full border px-2.5 py-0.5 text-[10px] uppercase tracking-wide font-medium ${colors}`}>
                    {PAYOUT_STATUS_LABELS[batch.status]}
                  </span>
                </div>

                <div className="flex flex-wrap gap-x-5 gap-y-1 text-[11px] text-gray-500 mb-3">
                  <span>Type: {PAYOUT_TYPE_LABELS[batch.payoutType]}</span>
                  <span>Amount: ${batch.totalAmount.toLocaleString()} {batch.currency}</span>
                  <span>Payees: {batch.payeeIds.length}</span>
                  {batch.scheduledDate && <span>Scheduled: {batch.scheduledDate}</span>}
                  <span>Adapter: {batch.adapterCategory}</span>
                </div>

                {batch.complianceBlockReason && (
                  <div className="rounded-lg border border-red-800/40 bg-red-950/20 px-3 py-2 mt-2">
                    <p className="text-[11px] text-red-400">
                      <span className="font-semibold">Compliance Block:</span> {batch.complianceBlockReason}
                    </p>
                  </div>
                )}

                {batch.status === "approved_not_executed" && (
                  <div className="rounded-lg border border-blue-800/30 bg-blue-950/10 px-3 py-2 mt-2">
                    <p className="text-[11px] text-blue-400">
                      Batch approved by {batch.approvedBy} on {batch.approvedAt ? new Date(batch.approvedAt).toLocaleDateString() : "—"}. Awaiting live execution adapter.
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-6 flex justify-end">
          <button
            disabled
            className="rounded-lg border border-gray-700 bg-gray-800 px-4 py-2 text-[11px] text-gray-500 cursor-not-allowed"
          >
            + Create New Batch (Adapter Required for Execution)
          </button>
        </div>
      </div>
    </div>
  );
}
