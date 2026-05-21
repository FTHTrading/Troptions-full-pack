/**
 * Troptions UI — SectionHeader
 * Eyebrow label + heading + optional body text
 */
import { type ReactNode } from "react";
import { cn } from "@/lib/cn";

type Theme = "dark" | "light";

interface SectionHeaderProps {
  eyebrow?: string;
  heading: ReactNode;
  body?: ReactNode;
  theme?: Theme;
  className?: string;
  headingClassName?: string;
}

export function SectionHeader({
  eyebrow,
  heading,
  body,
  theme = "dark",
  className,
  headingClassName,
}: SectionHeaderProps) {
  const isDark = theme === "dark";
  return (
    <div className={cn("mb-6", className)}>
      {eyebrow && (
        <p
          className={cn(
            "text-[11px] font-bold uppercase tracking-[0.18em] mb-1.5",
            isDark ? "text-[#f0cf82]" : "text-amber-800",
          )}
        >
          {eyebrow}
        </p>
      )}
      <h2
        className={cn(
          "font-display text-[clamp(1.45rem,3vw,2.1rem)] font-bold leading-tight",
          isDark ? "text-slate-50" : "text-slate-900",
          headingClassName,
        )}
      >
        {heading}
      </h2>
      {body && (
        <p
          className={cn(
            "mt-2 text-[0.93rem] leading-relaxed max-w-2xl",
            isDark ? "text-slate-400" : "text-slate-600",
          )}
        >
          {body}
        </p>
      )}
    </div>
  );
}
