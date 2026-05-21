type BadgeVariant = "approved" | "blocked" | "pending" | "evaluation" | "critical" | "high" | "medium" | "low" | "operational" | "suspended";

interface StatusBadgeProps {
  status: BadgeVariant | string;
  label?: string;
  size?: "sm" | "md";
}

const VARIANT_STYLES: Record<BadgeVariant, string> = {
  approved: "bg-green-900/60 text-green-300 border-green-700/50",
  operational: "bg-green-900/60 text-green-300 border-green-700/50",
  blocked: "bg-red-900/60 text-red-300 border-red-700/50",
  critical: "bg-red-900/60 text-red-300 border-red-700/50",
  suspended: "bg-red-900/60 text-red-300 border-red-700/50",
  pending: "bg-yellow-900/60 text-yellow-300 border-yellow-700/50",
  high: "bg-orange-900/60 text-orange-300 border-orange-700/50",
  evaluation: "bg-slate-800/80 text-slate-300 border-slate-600/50",
  medium: "bg-blue-900/60 text-blue-300 border-blue-700/50",
  low: "bg-slate-800/60 text-slate-400 border-slate-600/50",
};

function resolveVariant(status: string): string {
  return VARIANT_STYLES[status as BadgeVariant] ?? "bg-slate-800/60 text-slate-400 border-slate-600/50";
}

export function StatusBadge({ status, label, size = "md" }: StatusBadgeProps) {
  const sizeClass = size === "sm" ? "text-[10px] px-1.5 py-0.5" : "text-xs px-2.5 py-1";
  return (
    <span className={`inline-flex items-center border rounded font-medium uppercase tracking-wide ${sizeClass} ${resolveVariant(status)}`}>
      {label ?? status}
    </span>
  );
}

export function ProofBadge({ status }: { status: string }) {
  return <StatusBadge status={status} label={`Proof: ${status}`} size="sm" />;
}

export function RiskBadge({ level }: { level: string }) {
  const lower = level.toLowerCase() as BadgeVariant;
  return <StatusBadge status={lower} label={level} size="sm" />;
}
