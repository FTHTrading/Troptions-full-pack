import type { NamespaceKnowledgeVaultProfile } from "@/lib/troptions-cloud/namespaceAiX402Types";

interface Props {
  vaults: NamespaceKnowledgeVaultProfile[];
  namespaceId: string;
}

const ACCESS_LEVEL_COLORS: Record<string, string> = {
  open: "text-emerald-400",
  membership_required: "text-[#C9A84C]",
  approval_required: "text-yellow-400",
  restricted: "text-red-400",
};

const ACCESS_LEVEL_BG: Record<string, string> = {
  open: "bg-emerald-900/30",
  membership_required: "bg-[#C9A84C]/10",
  approval_required: "bg-yellow-900/30",
  restricted: "bg-red-900/30",
};

export default function NamespaceKnowledgeVaultAccessPanel({ vaults, namespaceId }: Props) {
  if (vaults.length === 0) {
    return (
      <div className="rounded-xl border border-gray-700 bg-[#0F1923] p-6">
        <h3 className="text-base font-semibold text-white mb-2">Knowledge Vault Access</h3>
        <p className="text-sm text-gray-500">No knowledge vaults configured for {namespaceId}.</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-gray-700 bg-[#0F1923] p-6 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-base font-semibold text-white">Knowledge Vault Access</h3>
        <span className="text-xs text-gray-500">{vaults.length} vault{vaults.length !== 1 ? "s" : ""}</span>
      </div>

      {/* Vault list */}
      <div className="space-y-2">
        {vaults.map((vault) => (
          <div
            key={vault.vaultId}
            className="rounded-lg bg-[#080C14] px-4 py-3 flex items-start justify-between gap-3"
          >
            <div className="min-w-0">
              <p className="text-xs font-semibold text-white">{vault.displayName}</p>
              <p className="text-[10px] text-gray-500 font-mono mt-0.5">{vault.vaultId}</p>
              <p className="text-[11px] text-gray-400 mt-1">{vault.category}</p>
            </div>
            <div className="shrink-0 text-right space-y-1">
              <span
                className={`inline-block rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${ACCESS_LEVEL_BG[vault.accessLevel] ?? "bg-gray-800"} ${ACCESS_LEVEL_COLORS[vault.accessLevel] ?? "text-gray-400"}`}
              >
                {vault.accessLevel.replace(/_/g, " ")}
              </span>
              <p className="text-[10px] text-gray-500">
                {vault.queryEnabled ? "queryable" : "read-only"}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
