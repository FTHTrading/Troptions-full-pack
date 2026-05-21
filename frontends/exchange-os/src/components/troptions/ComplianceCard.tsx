import type { TroptionsModule } from "@/content/troptions/troptionsRegistry";
import { StatusBadge } from "./StatusBadge";

interface ComplianceCardProps {
  module: TroptionsModule;
}

export function ComplianceCard({ module }: ComplianceCardProps) {
  return (
    <div className="bg-[#0D1B2A] border border-[#C9A84C]/20 rounded-lg p-5 flex flex-col gap-3">
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-[#C9A84C] text-xs font-mono uppercase tracking-widest">{module.id}</p>
          <h3 className="text-white font-semibold mt-0.5">{module.name}</h3>
        </div>
        <StatusBadge status={module.status} />
      </div>
      <p className="text-gray-400 text-sm leading-relaxed">{module.description}</p>
      <div className="flex flex-wrap gap-1.5">
        {module.requiredApprovals.slice(0, 4).map((approval: string, i: number) => (
          <span key={i} className="text-[10px] bg-slate-800/80 border border-slate-700/50 text-slate-400 rounded px-2 py-0.5 font-mono">
            {approval}
          </span>
        ))}
        {module.requiredApprovals.length > 4 && (
          <span className="text-[10px] text-slate-500">+{module.requiredApprovals.length - 4} more</span>
        )}
      </div>
    </div>
  );
}
