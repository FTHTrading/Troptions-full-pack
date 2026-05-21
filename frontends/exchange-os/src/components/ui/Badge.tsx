/**
 * Troptions UI — Badge
 * Small pill for statuses, chain labels, risk levels, etc.
 */
import { type ReactNode } from "react";
import { cn } from "@/lib/cn";

type BadgeVariant =
  | "gold"
  | "green"
  | "amber"
  | "blue"
  | "indigo"
  | "red"
  | "slate"
  | "xrpl"
  | "stellar"
  | "mono";

interface BadgeProps {
  children: ReactNode;
  variant?: BadgeVariant;
  className?: string;
}

const VARIANTS: Record<BadgeVariant, string> = {
  gold:    "bg-[#C9A84C]/12 text-[#f0cf82] border-[#C9A84C]/35",
  green:   "bg-green-950/50 text-green-400 border-green-800/40",
  amber:   "bg-amber-950/40 text-amber-400 border-amber-700/40",
  blue:    "bg-blue-950/40 text-blue-300 border-blue-700/35",
  indigo:  "bg-indigo-950/40 text-indigo-300 border-indigo-700/35",
  red:     "bg-red-950/30 text-red-400 border-red-800/40",
  slate:   "bg-white/5 text-slate-300 border-white/10",
  xrpl:    "bg-blue-950/30 text-blue-300 border-blue-700/30",
  stellar: "bg-indigo-950/30 text-indigo-300 border-indigo-700/30",
  mono:    "bg-[#C9A84C]/10 text-[#f0cf82] border-[#C9A84C]/25 font-mono",
};

export function Badge({ children, variant = "slate", className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center border rounded-full px-2 py-0.5 text-[11px] font-bold tracking-widest uppercase leading-none",
        VARIANTS[variant],
        className,
      )}
    >
      {children}
    </span>
  );
}

/** Convenience for entity status values */
export function StatusBadge({ status }: { status: string }) {
  const v =
    status === "Active" || status === "Live" ? "green"
    : status === "Review"                    ? "amber"
    : status === "Draft"                     ? "blue"
    : "slate";
  return <Badge variant={v as BadgeVariant}>{status}</Badge>;
}
