import type { NamespaceAiX402Snapshot } from "@/lib/troptions-cloud/namespaceAiX402Types";
import NamespaceAiInfrastructureCard from "./NamespaceAiInfrastructureCard";
import NamespaceX402UsagePanel from "./NamespaceX402UsagePanel";
import NamespaceModelRoutingPanel from "./NamespaceModelRoutingPanel";
import NamespaceKnowledgeVaultAccessPanel from "./NamespaceKnowledgeVaultAccessPanel";

interface Props {
  snapshot: NamespaceAiX402Snapshot;
}

export default function NamespaceAiX402Panel({ snapshot }: Props) {
  const { aiInfrastructure, x402Profile, safetyStatus } = snapshot;

  return (
    <div className="space-y-6">
      {/* Safety banner */}
      <div className="rounded-xl border border-emerald-800/50 bg-emerald-900/10 px-5 py-3 flex flex-wrap gap-4">
        <SafetyItem label="Live Payments" active={safetyStatus.livePaymentsDisabled} />
        <SafetyItem label="Wallet Movement" active={safetyStatus.liveWalletMovementDisabled} />
        <SafetyItem label="External AI Calls" active={safetyStatus.externalAiCallsDisabled} />
        <SafetyItem label="Control Hub" active={safetyStatus.controlHubApprovalRequired} />
        {safetyStatus.healthcareSafetyEnabled && (
          <SafetyItem label="Healthcare Safety" active variant="warning" />
        )}
        {safetyStatus.phiIntakeBlocked && (
          <SafetyItem label="PHI Blocked" active variant="warning" />
        )}
      </div>

      {/* AI Infrastructure */}
      <NamespaceAiInfrastructureCard profile={aiInfrastructure} />

      {/* Model Routing */}
      <NamespaceModelRoutingPanel profile={aiInfrastructure} />

      {/* Knowledge Vaults */}
      <NamespaceKnowledgeVaultAccessPanel
        vaults={aiInfrastructure.knowledgeVaults}
        namespaceId={snapshot.namespaceId}
      />

      {/* x402 Usage */}
      <NamespaceX402UsagePanel profile={x402Profile} />
    </div>
  );
}

function SafetyItem({
  label,
  active,
  variant = "default",
}: {
  label: string;
  active: boolean;
  variant?: "default" | "warning";
}) {
  const color =
    variant === "warning"
      ? "text-yellow-400"
      : active
        ? "text-emerald-400"
        : "text-gray-500";

  return (
    <div className="flex items-center gap-1.5">
      <span className={`h-1.5 w-1.5 rounded-full ${active ? (variant === "warning" ? "bg-yellow-400" : "bg-emerald-400") : "bg-gray-600"}`} />
      <span className={`text-[11px] font-semibold ${color}`}>{label}: {active ? "Disabled" : "N/A"}</span>
    </div>
  );
}
