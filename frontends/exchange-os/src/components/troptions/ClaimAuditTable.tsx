import type { TroptionsClaim } from "@/content/troptions/claimRegistry";
import { RiskBadge, StatusBadge } from "./StatusBadge";

interface ClaimAuditTableProps {
  claims: TroptionsClaim[];
}

export function ClaimAuditTable({ claims }: ClaimAuditTableProps) {
  return (
    <div className="overflow-x-auto rounded-lg border border-[#C9A84C]/20">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-[#C9A84C]/20 bg-[#0D1B2A]">
            <th className="text-left text-[#C9A84C] font-mono text-xs uppercase tracking-widest px-4 py-3">ID</th>
            <th className="text-left text-[#C9A84C] font-mono text-xs uppercase tracking-widest px-4 py-3">Original Claim</th>
            <th className="text-left text-[#C9A84C] font-mono text-xs uppercase tracking-widest px-4 py-3">Risk</th>
            <th className="text-left text-[#C9A84C] font-mono text-xs uppercase tracking-widest px-4 py-3">Status</th>
            <th className="text-left text-[#C9A84C] font-mono text-xs uppercase tracking-widest px-4 py-3">Missing Evidence</th>
          </tr>
        </thead>
        <tbody>
          {claims.map((claim) => (
            <tr key={claim.id} className="border-b border-slate-800/60 hover:bg-slate-900/40 transition-colors">
              <td className="px-4 py-3 text-slate-400 font-mono text-xs whitespace-nowrap">{claim.id}</td>
              <td className="px-4 py-3 text-slate-300 max-w-xs">
                <p className="line-clamp-2">{claim.originalText}</p>
              </td>
              <td className="px-4 py-3 whitespace-nowrap">
                <RiskBadge level={claim.riskLevel} />
              </td>
              <td className="px-4 py-3 whitespace-nowrap">
                <StatusBadge status={claim.publishStatus} />
              </td>
              <td className="px-4 py-3 text-slate-500 text-xs max-w-xs">
                {claim.missingEvidence.length > 0
                  ? claim.missingEvidence[0] + (claim.missingEvidence.length > 1 ? ` (+${claim.missingEvidence.length - 1})` : "")
                  : <span className="text-green-400">None</span>
                }
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
