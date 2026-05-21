/**
 * Troptions UI — Card
 * Usage: <Card>, <Card variant="ivory">, <Card variant="glass">
 */
import { type ReactNode } from "react";
import { cn } from "@/lib/cn";

type CardVariant = "default" | "glass" | "ivory" | "navy" | "warning";

interface CardProps {
  children: ReactNode;
  variant?: CardVariant;
  className?: string;
  padding?: "sm" | "md" | "lg";
}

const VARIANT_CLASSES: Record<CardVariant, string> = {
  default: "bg-white/[0.04] border border-white/10",
  glass:   "bg-white/[0.04] border border-white/10 backdrop-blur-sm",
  ivory:   "bg-[#f5f0e4]/97 border border-[#C9A84C]/40",
  navy:    "bg-[#0c1e35] border border-[#C9A84C]/35",
  warning: "bg-amber-950/20 border border-amber-700/40",
};

const PAD_CLASSES = {
  sm: "p-4",
  md: "p-6 md:p-8",
  lg: "p-8 md:p-10",
};

export function Card({ children, variant = "default", className, padding = "md" }: CardProps) {
  return (
    <div className={cn("rounded-xl", VARIANT_CLASSES[variant], PAD_CLASSES[padding], className)}>
      {children}
    </div>
  );
}
