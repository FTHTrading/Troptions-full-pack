import type { Metadata } from "next";
import Link from "next/link";
import { TROPTIONS_NAMESPACES } from "@/content/troptions-cloud/namespaceRegistry";
import {
  getMockFundingSources,
  getMockFundingVault,
} from "@/lib/troptions/payops/mockData";

interface Props {
  params: Promise<{ namespace: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { namespace } = await params;
  return { title: `Funding — ${namespace} — TROPTIONS PayOps` };
}

export async function generateStaticParams() {
  return TROPTIONS_NAMESPACES.map((n) => ({ namespace: n.slug }));
}

export default async function FundingPage({ params }: Props) {
  const { namespace } = await params;
  const namespaceId = `ns-payops-${namespace}`;
  const sources = getMockFundingSources(namespaceId);
  const vault = getMockFundingVault(namespaceId);

  return (
    <div className="px-6 py-10">
      <div className="mx-auto max-w-5xl">
        <nav className="mb-4 text-[10px] uppercase tracking-[0.2em] text-gray-500">
          <Link href={`/troptions-cloud/${namespace}`} className="hover:text-white transition-colors">Dashboard</Link>
          <span className="mx-2">/</span>
          <Link href={`/troptions-cloud/${namespace}/payops`} className="hover:text-white transition-colors">PayOps</Link>
          <span className="mx-2">/</span>
          <span className="text-white">Funding</span>
        </nav>

        <div className="mb-8">
          <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.4em] text-[#C9A84C]">TROPTIONS PAYOPS</p>
          <h1 className="text-2xl font-bold text-white">Funding Sources &amp; Vault</h1>
          <p className="mt-2 text-sm text-gray-400">
            Record funding sources and proof of funds. A live banking or stablecoin adapter is required before any payout execution.
          </p>
        </div>

        <div className="mb-6 rounded-xl border border-yellow-800/50 bg-yellow-900/10 p-4">
          <p className="text-xs font-semibold text-yellow-400 uppercase tracking-[0.2em] mb-1">Simulation Only</p>
          <p className="text-xs text-yellow-300/80">Funding data shown is demonstration data only.</p>
        </div>

        {/* Vault Status */}
        <div className="mb-8 rounded-xl border border-orange-800/40 bg-orange-950/20 p-5">
          <div className="flex items-start justify-between gap-4 mb-3">
            <div>
              <p className="text-[10px] uppercase tracking-[0.2em] text-gray-500 mb-1">Primary Vault</p>
              <p className="text-lg font-bold text-white">{vault.label}</p>
            </div>
            <span className="shrink-0 rounded-full border border-orange-800/60 bg-orange-950/40 px-2.5 py-0.5 text-[10px] text-orange-400 uppercase tracking-wide">
              Manual Record Only
            </span>
          </div>
          <p className="text-3xl font-bold text-gray-500 mb-2">$0.00 <span className="text-base font-normal text-gray-600">USD</span></p>
          <p className="text-xs text-orange-300/70 leading-relaxed">{vault.warningText}</p>
          <div className="mt-3 flex flex-wrap gap-3 text-[10px] text-gray-600">
            <span>Proof Status: {vault.proofStatus}</span>
            <span>Reserved: ${vault.reservedBalance.toFixed(2)}</span>
            <span>Last Check: {new Date(vault.lastBalanceCheck).toLocaleDateString()}</span>
          </div>
        </div>

        {/* Funding Sources */}
        <div className="rounded-xl border border-gray-800 bg-[#0F1923] overflow-hidden">
          <div className="border-b border-gray-800 px-5 py-3 flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-gray-400">Funding Sources</p>
            <button
              disabled
              className="rounded-lg border border-gray-700 bg-gray-800 px-3 py-1.5 text-[11px] text-gray-500 cursor-not-allowed"
              title="Adapter required"
            >
              + Add Source (Adapter Required)
            </button>
          </div>
          <div className="divide-y divide-gray-800">
            {sources.map((src) => (
              <div key={src.id} className="px-5 py-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold text-white">{src.label}</p>
                    <p className="text-[11px] text-gray-500 mt-0.5">Type: {src.sourceType} · Adapter: {src.adapterCategory}</p>
                  </div>
                  <div className="shrink-0 flex flex-col items-end gap-1">
                    <span
                      className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] uppercase tracking-wide ${
                        src.isConfigured
                          ? "border-green-800 text-green-400"
                          : "border-gray-700 text-gray-500"
                      }`}
                    >
                      {src.isConfigured ? "Configured" : "Not Configured"}
                    </span>
                    <span
                      className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] uppercase tracking-wide ${
                        src.isApproved
                          ? "border-green-800 text-green-400"
                          : "border-orange-800 text-orange-400"
                      }`}
                    >
                      {src.isApproved ? "Approved" : "Not Approved"}
                    </span>
                  </div>
                </div>
                {src.notes && (
                  <p className="mt-2 text-[11px] text-orange-300/70">{src.notes}</p>
                )}
                {src.proofReference && (
                  <p className="mt-1 text-[10px] text-gray-600">Proof Ref: {src.proofReference}</p>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6 rounded-xl border border-gray-800 bg-[#0F1923] p-5">
          <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-gray-500 mb-2">
            Execution Adapter Required
          </p>
          <p className="text-xs text-gray-400 leading-relaxed">
            To connect a live funding source, you must configure an approved bank partner, payroll partner, or stablecoin partner adapter.
            Contact your TROPTIONS account manager to begin adapter configuration.
          </p>
        </div>
      </div>
    </div>
  );
}
