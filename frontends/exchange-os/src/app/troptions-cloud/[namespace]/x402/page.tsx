import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getNamespaceX402Profile } from "@/content/troptions-cloud/namespaceX402Registry";
import NamespaceX402UsagePanel from "@/components/troptions-cloud/NamespaceX402UsagePanel";

interface Props {
  params: Promise<{ namespace: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { namespace } = await params;
  return {
    title: `x402 Readiness — ${namespace} | Troptions Cloud`,
    description: `x402 payment policy, usage metering, and credit ledger for ${namespace}`,
  };
}

export default async function NamespaceX402Page({ params }: Props) {
  const { namespace } = await params;
  const profile = getNamespaceX402Profile(namespace);

  if (!profile) notFound();

  return (
    <div className="min-h-screen bg-[#080C14] px-6 py-8">
      <div className="mx-auto max-w-4xl space-y-6">
        {/* Header */}
        <div className="mb-2">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="rounded-full bg-yellow-900/20 px-2.5 py-1 text-[10px] font-semibold text-yellow-500">
              Simulation Only
            </span>
            <span className="rounded-full bg-[#C9A84C]/10 px-2.5 py-1 text-[10px] font-semibold text-[#C9A84C] uppercase tracking-widest">
              {profile.usageMeteringMode}
            </span>
          </div>
          <h1 className="text-2xl font-bold text-white">x402 Readiness</h1>
          <p className="text-xs text-gray-500 font-mono mt-1">{namespace}</p>
          <p className="mt-2 text-sm text-gray-400">
            x402 payment policy, TROPTIONS credit metering, membership plan access mapping,
            and usage simulation for this namespace.
          </p>
        </div>

        {/* x402 Panel */}
        <NamespaceX402UsagePanel profile={profile} />

        {/* Approval-required */}
        {profile.approvalRequiredActions.length > 0 && (
          <div className="rounded-xl border border-gray-700 bg-[#0F1923] p-5">
            <p className="text-xs text-[#C9A84C] font-semibold uppercase tracking-widest mb-3">
              Approval Required Actions
            </p>
            <div className="flex flex-wrap gap-2">
              {profile.approvalRequiredActions.map((a) => (
                <span
                  key={a}
                  className="rounded-full bg-yellow-900/20 px-2.5 py-0.5 text-[10px] text-yellow-400 font-mono"
                >
                  {a}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Safety note */}
        <div className="rounded-xl border border-gray-800 bg-[#0F1923] px-5 py-4">
          <p className="text-xs text-gray-500">
            x402 payments are simulation-only. No live wallet movements or TROPTIONS credit
            transfers occur. All charges are recorded as simulation events in the Control Hub.
          </p>
        </div>
      </div>
    </div>
  );
}
