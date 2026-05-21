import type { Metadata } from "next";
import { getAllNamespaceAiProfiles } from "@/content/troptions-cloud/namespaceAiInfrastructureRegistry";
import { getAllNamespaceX402Profiles } from "@/content/troptions-cloud/namespaceX402Registry";
import AdminNamespaceAiX402ControlPanel from "@/components/troptions-cloud/AdminNamespaceAiX402ControlPanel";

export const metadata: Metadata = {
  title: "Namespace AI + x402 Admin | Troptions Cloud",
  description: "Admin control panel for all namespace AI infrastructure and x402 readiness status",
};

export default function AdminNamespaceAiX402Page() {
  const aiProfiles = getAllNamespaceAiProfiles();
  const x402Profiles = getAllNamespaceX402Profiles();

  return (
    <div className="min-h-screen bg-[#080C14] px-6 py-8">
      <div className="mx-auto max-w-6xl space-y-6">
        {/* Header */}
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="rounded-full bg-yellow-900/20 px-2.5 py-1 text-[10px] font-semibold text-yellow-500">
              Simulation Only
            </span>
            <span className="rounded-full bg-[#C9A84C]/10 px-2.5 py-1 text-[10px] font-semibold text-[#C9A84C]">
              Admin
            </span>
          </div>
          <h1 className="text-2xl font-bold text-white">Namespace AI + x402 Control</h1>
          <p className="mt-2 text-sm text-gray-400">
            Overview of AI infrastructure and x402 payment readiness for all {aiProfiles.length} namespaces.
            All operations are simulation-only with Control Hub governance enforced.
          </p>
        </div>

        <AdminNamespaceAiX402ControlPanel
          aiProfiles={aiProfiles}
          x402Profiles={x402Profiles}
        />
      </div>
    </div>
  );
}
