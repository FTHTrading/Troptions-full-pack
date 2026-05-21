/**
 * SystemStatusBadge
 * Shows the operational/readiness status of a TROPTIONS service or page.
 *
 * Do NOT mark anything "Live" unless it has real backend, admin,
 * persistence, and production-ready flow.
 */

export type SystemStatus =
  | "Live"
  | "Client Ready"
  | "Intake Open"
  | "In Development"
  | "Planning"
  | "Demo Only"
  | "Compliance Review Required";

interface SystemStatusBadgeProps {
  status: SystemStatus;
  size?: "sm" | "md";
}

const STATUS_STYLES: Record<SystemStatus, string> = {
  Live: "bg-emerald-900/60 text-emerald-300 border-emerald-700/50",
  "Client Ready": "bg-blue-900/60 text-blue-300 border-blue-700/50",
  "Intake Open": "bg-cyan-900/60 text-cyan-300 border-cyan-700/50",
  "In Development": "bg-yellow-900/60 text-yellow-300 border-yellow-700/50",
  Planning: "bg-slate-800/80 text-slate-400 border-slate-600/50",
  "Demo Only": "bg-purple-900/60 text-purple-300 border-purple-700/50",
  "Compliance Review Required": "bg-orange-900/60 text-orange-300 border-orange-700/50",
};

const STATUS_DOTS: Record<SystemStatus, string> = {
  Live: "bg-emerald-400",
  "Client Ready": "bg-blue-400",
  "Intake Open": "bg-cyan-400",
  "In Development": "bg-yellow-400",
  Planning: "bg-slate-400",
  "Demo Only": "bg-purple-400",
  "Compliance Review Required": "bg-orange-400",
};

export function SystemStatusBadge({ status, size = "md" }: SystemStatusBadgeProps) {
  const sizeClass = size === "sm" ? "text-[10px] px-1.5 py-0.5" : "text-xs px-2.5 py-1";
  const dotSize = size === "sm" ? "h-1.5 w-1.5" : "h-2 w-2";

  return (
    <span
      className={`inline-flex items-center gap-1.5 border rounded font-medium uppercase tracking-wide ${sizeClass} ${STATUS_STYLES[status]}`}
    >
      <span className={`rounded-full shrink-0 ${dotSize} ${STATUS_DOTS[status]}`} />
      {status}
    </span>
  );
}
