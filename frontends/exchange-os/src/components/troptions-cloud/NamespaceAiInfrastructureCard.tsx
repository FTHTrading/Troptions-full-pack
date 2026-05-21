import type { NamespaceAiInfrastructureProfile } from "@/lib/troptions-cloud/namespaceAiX402Types";

interface Props {
  profile: NamespaceAiInfrastructureProfile;
}

export default function NamespaceAiInfrastructureCard({ profile }: Props) {
  const isEnabled = profile.aiWorkspaceEnabled;
  const statusColor = isEnabled ? "text-emerald-400" : "text-gray-500";

  return (
    <div className="rounded-xl border border-gray-700 bg-[#0F1923] p-6 space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-semibold text-white">{profile.displayName}</h3>
          <p className="text-xs text-gray-500 font-mono mt-0.5">{profile.namespaceId}</p>
        </div>
        <span className={`text-xs font-semibold uppercase tracking-widest ${statusColor}`}>
          {isEnabled ? "active" : "disabled"}
        </span>
      </div>

      {/* Execution mode */}
      <div className="grid grid-cols-2 gap-3">
        <Pill label="Execution Mode" value={profile.executionMode} />
        <Pill label="Default Provider" value={profile.modelRoutingPolicy.defaultProvider ?? "none"} />
        <Pill label="Tool Count" value={`${profile.allowedTools.length} allowed`} />
        <Pill
          label="Healthcare Safety"
          value={profile.healthcareSafetyRequired ? "Enabled" : "Off"}
          highlight={profile.healthcareSafetyRequired}
        />
      </div>

      {/* AI Systems */}
      <div>
        <p className="text-xs text-[#C9A84C] font-semibold uppercase tracking-widest mb-2">AI Systems</p>
        <div className="space-y-1">
          {profile.sovereignAiSystems.map((sys) => (
            <div
              key={sys.systemId}
              className="flex items-center justify-between rounded-lg bg-[#080C14] px-3 py-2"
            >
              <span className="text-xs text-white">{sys.displayName}</span>
              <span
                className={`text-[10px] font-semibold uppercase tracking-widest ${sys.enabled ? "text-emerald-400" : "text-gray-600"}`}
              >
                {sys.enabled ? "active" : "disabled"}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Safety badges */}
      <div className="flex flex-wrap gap-2 pt-1">
        <SafetyBadge label="No Live Execution" />
        <SafetyBadge label="Simulation Only" />
        <SafetyBadge label="Control Hub Required" />
        {profile.healthcareSafetyRequired && <SafetyBadge label="PHI Blocked" variant="warning" />}
      </div>
    </div>
  );
}

function Pill({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="rounded-lg bg-[#080C14] px-3 py-2">
      <p className="text-[10px] text-gray-500 uppercase tracking-wider">{label}</p>
      <p className={`text-xs font-semibold mt-0.5 ${highlight ? "text-[#C9A84C]" : "text-white"}`}>
        {value}
      </p>
    </div>
  );
}

function SafetyBadge({
  label,
  variant = "default",
}: {
  label: string;
  variant?: "default" | "warning";
}) {
  return (
    <span
      className={`rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${
        variant === "warning"
          ? "bg-yellow-900/40 text-yellow-400"
          : "bg-emerald-900/30 text-emerald-400"
      }`}
    >
      {label}
    </span>
  );
}
