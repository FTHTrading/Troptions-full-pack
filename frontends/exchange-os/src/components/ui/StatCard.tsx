/**
 * Troptions UI — StatCard
 * Single metric display block
 */
import { cn } from "@/lib/cn";

interface StatCardProps {
  value: string;
  label: string;
  className?: string;
}

export function StatCard({ value, label, className }: StatCardProps) {
  return (
    <div
      className={cn(
        "rounded-xl bg-[#C9A84C]/7 border border-[#C9A84C]/18 p-4 text-center",
        className,
      )}
    >
      <p className="text-[1.75rem] font-extrabold text-[#f0cf82] leading-none m-0">{value}</p>
      <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-slate-500 mt-1.5">
        {label}
      </p>
    </div>
  );
}
