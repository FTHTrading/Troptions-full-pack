import type { Metadata } from "next";
import Link from "next/link";
import { TROPTIONS_NAMESPACES } from "@/content/troptions-cloud/namespaceRegistry";
import { getMockReceipts } from "@/lib/troptions/payops/mockData";
import { PAYOUT_TYPE_LABELS, PAYOUT_STATUS_LABELS } from "@/lib/troptions/payops/types";

interface Props {
  params: Promise<{ namespace: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { namespace } = await params;
  return { title: `Receipts — ${namespace} — TROPTIONS PayOps` };
}

export async function generateStaticParams() {
  return TROPTIONS_NAMESPACES.map((n) => ({ namespace: n.slug }));
}

export default async function ReceiptsPage({ params }: Props) {
  const { namespace } = await params;
  const receipts = getMockReceipts(`ns-payops-${namespace}`);

  return (
    <div className="px-6 py-10">
      <div className="mx-auto max-w-5xl">
        <nav className="mb-4 text-[10px] uppercase tracking-[0.2em] text-gray-500">
          <Link href={`/troptions-cloud/${namespace}`} className="hover:text-white transition-colors">Dashboard</Link>
          <span className="mx-2">/</span>
          <Link href={`/troptions-cloud/${namespace}/payops`} className="hover:text-white transition-colors">PayOps</Link>
          <span className="mx-2">/</span>
          <span className="text-white">Receipts</span>
        </nav>

        <div className="mb-8">
          <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.4em] text-[#C9A84C]">TROPTIONS PAYOPS</p>
          <h1 className="text-2xl font-bold text-white">Receipts</h1>
          <p className="mt-2 text-sm text-gray-400">
            Payout receipts and proof records. Receipts in &quot;Approved / Not Executed&quot; status confirm operator approval only — not fund transfer.
          </p>
        </div>

        <div className="mb-6 rounded-xl border border-yellow-800/50 bg-yellow-900/10 p-4">
          <p className="text-xs font-semibold text-yellow-400 uppercase tracking-[0.2em] mb-1">Simulation Only</p>
          <p className="text-xs text-yellow-300/80">Receipts shown are demonstration data. No actual payments have been made.</p>
        </div>

        <div className="mb-6 rounded-xl border border-orange-800/40 bg-orange-950/20 p-4">
          <p className="text-xs font-semibold text-orange-400 uppercase tracking-[0.2em] mb-1">
            Receipt Disclaimer
          </p>
          <p className="text-xs text-orange-300/80 leading-relaxed">
            A TROPTIONS PayOps receipt reflects the payout operation record within the TROPTIONS namespace system.
            It is not a bank transaction confirmation. A live adapter confirmation is required before a receipt
            reflects a completed payment.
          </p>
        </div>

        {receipts.length === 0 ? (
          <div className="rounded-xl border border-gray-800 bg-[#0F1923] p-8 text-center">
            <p className="text-sm text-gray-500">No receipts generated yet.</p>
            <p className="text-[11px] text-gray-600 mt-1">Receipts are created when payout batches are approved.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {receipts.map((r) => (
              <div key={r.id} className="rounded-xl border border-gray-800 bg-[#0F1923] p-5">
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div>
                    <p className="text-sm font-semibold text-white">{r.payeeName}</p>
                    <p className="text-[11px] text-gray-500 mt-0.5">{r.payeeEmail}</p>
                    <p className="text-[10px] text-gray-600 font-mono mt-0.5">{r.id}</p>
                  </div>
                  <div className="shrink-0 flex flex-col items-end gap-1">
                    <span className="inline-flex items-center rounded-full border border-blue-800 px-2.5 py-0.5 text-[10px] text-blue-400 uppercase tracking-wide">
                      {PAYOUT_STATUS_LABELS[r.status]}
                    </span>
                    <span className="inline-flex items-center rounded-full border border-gray-700 px-2 py-0.5 text-[10px] text-gray-500 uppercase tracking-wide">
                      {r.receiptPacketStatus}
                    </span>
                  </div>
                </div>
                <div className="flex flex-wrap gap-x-5 gap-y-1 text-[11px] text-gray-500 mb-2">
                  <span>Amount: ${r.amount.toLocaleString()} {r.currency}</span>
                  <span>Type: {PAYOUT_TYPE_LABELS[r.payoutType]}</span>
                  <span>Issued: {new Date(r.issuedAt).toLocaleDateString()}</span>
                  {r.proofReference && <span>Proof Ref: {r.proofReference}</span>}
                </div>
                {r.notes && (
                  <p className="text-[11px] text-blue-300/70">{r.notes}</p>
                )}
              </div>
            ))}
          </div>
        )}

        <div className="mt-6 flex justify-end">
          <button
            disabled
            className="rounded-lg border border-gray-700 bg-gray-800 px-4 py-2 text-[11px] text-gray-500 cursor-not-allowed"
          >
            Export Receipts (Adapter Required)
          </button>
        </div>
      </div>
    </div>
  );
}
