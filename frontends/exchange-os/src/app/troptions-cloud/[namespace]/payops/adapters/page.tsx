import type { Metadata } from "next";
import Link from "next/link";
import { TROPTIONS_NAMESPACES } from "@/content/troptions-cloud/namespaceRegistry";
import { getMockAdapters } from "@/lib/troptions/payops/mockData";
import { canAdapterExecutePayouts } from "@/lib/troptions/payops/adapters";
import { ADAPTER_STATUS_COLORS } from "@/lib/troptions/payops/adapters";
import { ADAPTER_CATEGORY_LABELS } from "@/lib/troptions/payops/types";

interface Props {
  params: Promise<{ namespace: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { namespace } = await params;
  return { title: `Adapters — ${namespace} — TROPTIONS PayOps` };
}

export async function generateStaticParams() {
  return TROPTIONS_NAMESPACES.map((n) => ({ namespace: n.slug }));
}

export default async function AdaptersPage({ params }: Props) {
  const { namespace } = await params;
  const adapters = getMockAdapters(`ns-payops-${namespace}`);
  const configured = adapters.filter((a) => a.isConfigured);
  const executionCapable = adapters.filter((a) => canAdapterExecutePayouts(a));

  return (
    <div className="px-6 py-10">
      <div className="mx-auto max-w-5xl">
        <nav className="mb-4 text-[10px] uppercase tracking-[0.2em] text-gray-500">
          <Link href={`/troptions-cloud/${namespace}`} className="hover:text-white transition-colors">Dashboard</Link>
          <span className="mx-2">/</span>
          <Link href={`/troptions-cloud/${namespace}/payops`} className="hover:text-white transition-colors">PayOps</Link>
          <span className="mx-2">/</span>
          <span className="text-white">Adapters</span>
        </nav>

        <div className="mb-8">
          <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.4em] text-[#C9A84C]">TROPTIONS PAYOPS</p>
          <h1 className="text-2xl font-bold text-white">Execution Adapters</h1>
          <p className="mt-2 text-sm text-gray-400">
            Adapters connect TROPTIONS PayOps to external payment execution providers. At least one approved, production-configured execution adapter is required before live payout movement.
          </p>
        </div>

        <div className="mb-6 rounded-xl border border-yellow-800/50 bg-yellow-900/10 p-4">
          <p className="text-xs font-semibold text-yellow-400 uppercase tracking-[0.2em] mb-1">Simulation Only</p>
          <p className="text-xs text-yellow-300/80">All adapters shown are in simulation/not-configured state. No live execution adapters are active.</p>
        </div>

        {executionCapable.length === 0 && (
          <div className="mb-6 rounded-xl border border-orange-800/40 bg-orange-950/20 p-4">
            <p className="text-xs font-semibold text-orange-400 uppercase tracking-[0.2em] mb-1">
              No Execution-Capable Adapters Configured
            </p>
            <p className="text-xs text-orange-300/80">
              Payout batches can be approved but will remain in &quot;Approved / Not Executed&quot; status until a live adapter is configured and approved.
              Contact your TROPTIONS account manager to configure an execution adapter.
            </p>
          </div>
        )}

        {/* Summary */}
        <div className="mb-6 flex flex-wrap gap-4">
          {[
            { label: "Total Adapters", value: adapters.length },
            { label: "Configured", value: configured.length },
            { label: "Execution Capable", value: executionCapable.length },
            { label: "Not Configured", value: adapters.length - configured.length },
          ].map((s) => (
            <div key={s.label} className="rounded-lg border border-gray-800 bg-[#0F1923] px-4 py-2">
              <p className="text-[10px] text-gray-500 uppercase tracking-wide">{s.label}</p>
              <p className="text-xl font-bold text-white">{s.value}</p>
            </div>
          ))}
        </div>

        {/* Adapter Cards Grid */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {adapters.map((adapter) => {
            const canExec = canAdapterExecutePayouts(adapter);
            const statusColors = ADAPTER_STATUS_COLORS[adapter.status];
            return (
              <div
                key={adapter.category}
                className={`rounded-xl border bg-[#0F1923] p-5 ${
                  adapter.isConfigured ? "border-gray-700" : "border-gray-800"
                }`}
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div>
                    <p className="text-sm font-semibold text-white">{adapter.name}</p>
                    <p className="text-[10px] text-gray-600 font-mono mt-0.5">{adapter.category}</p>
                  </div>
                  <div className="shrink-0 flex flex-col items-end gap-1">
                    <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] uppercase tracking-wide ${statusColors}`}>
                      {adapter.status}
                    </span>
                    {canExec && (
                      <span className="inline-flex items-center rounded-full border border-green-800 bg-green-950/30 px-2 py-0.5 text-[10px] text-green-400 uppercase tracking-wide">
                        Execution Capable
                      </span>
                    )}
                  </div>
                </div>

                <p className="text-[11px] text-gray-500 leading-relaxed mb-3">{adapter.description}</p>

                <div className="flex flex-wrap gap-2 text-[10px] text-gray-600 mb-3">
                  <span>Category: {ADAPTER_CATEGORY_LABELS[adapter.category]}</span>
                  <span>Env: {adapter.environment}</span>
                  {adapter.supportsExecution && (
                    <span className="text-blue-400">Supports Execution</span>
                  )}
                </div>

                <button
                  disabled={!adapter.supportsExecution || adapter.isConfigured}
                  className="w-full rounded-lg border border-gray-700 bg-gray-800 px-3 py-1.5 text-[11px] text-gray-500 cursor-not-allowed"
                  title={
                    !adapter.supportsExecution
                      ? "This adapter type does not support execution"
                      : adapter.isConfigured
                      ? "Already configured"
                      : "Contact TROPTIONS to configure this adapter"
                  }
                >
                  {adapter.isConfigured ? "Active (Simulation)" : "Configure (Contact TROPTIONS)"}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
