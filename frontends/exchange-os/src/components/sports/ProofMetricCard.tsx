/**
 * TROPTIONS Sports Network — ProofMetricCard
 */
import { cn } from "@/lib/cn";

interface ProofMetricCardProps {
  label: string;
  value: string | number;
  sub?: string;
  status?: "live" | "demo" | "pending";
  className?: string;
}

export function ProofMetricCard({ label, value, sub, status = "demo", className }: ProofMetricCardProps) {
  const statusColors = {
    live: "text-green-400",
    demo: "text-[#c99a3c]",
    pending: "text-[#8a94a6]",
  };
  return (
    <div className={cn("border border-white/10 bg-[#0b1f36] p-6", className)}>
      <p className="text-[#8a94a6] text-xs font-semibold uppercase tracking-widest mb-3">{label}</p>
      <p className="text-3xl font-bold text-white mb-1">{typeof value === "number" ? value.toLocaleString() : value}</p>
      {sub && <p className="text-[#8a94a6] text-sm">{sub}</p>}
      <p className={cn("text-xs font-semibold uppercase tracking-wider mt-3", statusColors[status])}>
        {status === "live" ? "Live" : status === "demo" ? "Demo Data" : "Pending"}
      </p>
    </div>
  );
}
