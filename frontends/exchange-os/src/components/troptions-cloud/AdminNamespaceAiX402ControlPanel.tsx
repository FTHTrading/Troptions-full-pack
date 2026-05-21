import { getAllNamespaceAiProfiles } from "@/content/troptions-cloud/namespaceAiInfrastructureRegistry";
import { getAllNamespaceX402Profiles } from "@/content/troptions-cloud/namespaceX402Registry";
import type { NamespaceAiInfrastructureProfile, NamespaceX402Profile } from "@/lib/troptions-cloud/namespaceAiX402Types";

interface Props {
  aiProfiles: NamespaceAiInfrastructureProfile[];
  x402Profiles: NamespaceX402Profile[];
}

export default function AdminNamespaceAiX402ControlPanel({ aiProfiles, x402Profiles }: Props) {
  const totalNamespaces = aiProfiles.length;
  const healthcareCount = aiProfiles.filter((p) => p.healthcareSafetyRequired).length;
  const disabledCount = aiProfiles.filter((p) => !p.aiWorkspaceEnabled).length;
  const livePaymentsCount = x402Profiles.filter((p) => p.livePaymentsEnabled).length;
  const x402Map = new Map(x402Profiles.map((p) => [p.namespaceId, p]));

  return (
    <div className="space-y-6">
      {/* Summary stats */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard label="Namespaces" value={totalNamespaces} />
        <StatCard label="Healthcare Safety" value={healthcareCount} highlight />
        <StatCard label="Disabled Workspaces" value={disabledCount} />
        <StatCard label="Live Payments" value={livePaymentsCount} danger={livePaymentsCount > 0} />
      </div>

      {/* Safety banner */}
      <div className="rounded-xl border border-emerald-800/50 bg-emerald-900/10 px-5 py-3">
        <p className="text-xs font-semibold text-emerald-400">
          SAFETY CONFIRMED — Live Payments: Disabled · External AI Calls: Disabled ·
          Wallet Movement: Disabled · PHI Intake: Blocked · Control Hub Approval: Required
        </p>
      </div>

      {/* Namespace table */}
      <div className="rounded-xl border border-gray-700 bg-[#0F1923] overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-700">
          <h3 className="text-sm font-semibold text-white">Namespace AI + x402 Status</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-gray-800">
                <th className="px-4 py-3 text-left text-[10px] font-semibold text-gray-500 uppercase tracking-widest">Namespace</th>
                <th className="px-4 py-3 text-left text-[10px] font-semibold text-gray-500 uppercase tracking-widest">Workspace</th>
                <th className="px-4 py-3 text-left text-[10px] font-semibold text-gray-500 uppercase tracking-widest">Mode</th>
                <th className="px-4 py-3 text-left text-[10px] font-semibold text-gray-500 uppercase tracking-widest">x402 Metering</th>
                <th className="px-4 py-3 text-left text-[10px] font-semibold text-gray-500 uppercase tracking-widest">Healthcare</th>
                <th className="px-4 py-3 text-left text-[10px] font-semibold text-gray-500 uppercase tracking-widest">Safety</th>
              </tr>
            </thead>
            <tbody>
              {aiProfiles.map((profile) => {
                const x402 = x402Map.get(profile.namespaceId);
                return (
                  <tr
                    key={profile.namespaceId}
                    className="border-b border-gray-800/50 hover:bg-white/[0.02] transition-colors"
                  >
                    <td className="px-4 py-3">
                      <div>
                        <p className="text-white font-semibold">{profile.displayName}</p>
                        <p className="text-gray-500 font-mono text-[10px]">{profile.namespaceId}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={profile.aiWorkspaceEnabled ? "text-emerald-400" : "text-gray-600"}>
                        {profile.aiWorkspaceEnabled ? "Active" : "Disabled"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-300">{profile.executionMode}</td>
                    <td className="px-4 py-3 text-gray-300">
                      {x402?.usageMeteringMode ?? "—"}
                    </td>
                    <td className="px-4 py-3">
                      {profile.healthcareSafetyRequired ? (
                        <span className="text-yellow-400 font-semibold">Required</span>
                      ) : (
                        <span className="text-gray-600">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <span className="rounded-full bg-emerald-900/30 px-2 py-0.5 text-[10px] text-emerald-400">
                        Sim Only
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  highlight,
  danger,
}: {
  label: string;
  value: number;
  highlight?: boolean;
  danger?: boolean;
}) {
  return (
    <div className="rounded-xl border border-gray-700 bg-[#0F1923] px-4 py-4">
      <p className="text-[10px] text-gray-500 uppercase tracking-widest">{label}</p>
      <p
        className={`text-2xl font-bold mt-1 ${
          danger ? "text-red-400" : highlight ? "text-[#C9A84C]" : "text-white"
        }`}
      >
        {value}
      </p>
    </div>
  );
}
