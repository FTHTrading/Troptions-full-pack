/**
 * Troptions UI — Button
 */
import { type ReactNode } from "react";
import { cn } from "@/lib/cn";

type ButtonVariant = "primary" | "secondary" | "ghost" | "outline";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  asChild?: boolean;
}

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  primary:   "bg-[#c99a3c] text-[#111827] hover:bg-[#f0cf82] font-bold",
  secondary: "bg-white/7 text-slate-100 border border-white/15 hover:bg-white/12 font-semibold",
  ghost:     "text-[#f0cf82] border border-[#C9A84C]/45 hover:bg-[#C9A84C]/10 font-semibold",
  outline:   "text-slate-200 border border-white/20 hover:bg-white/8 font-semibold",
};

const SIZE_CLASSES: Record<ButtonSize, string> = {
  sm: "px-3.5 py-1.5 text-xs rounded-lg",
  md: "px-5 py-2.5 text-sm rounded-xl",
  lg: "px-6 py-3 text-base rounded-xl",
};

export function Button({
  children,
  variant = "primary",
  size = "md",
  className,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 transition-colors duration-150 cursor-pointer select-none",
        VARIANT_CLASSES[variant],
        SIZE_CLASSES[size],
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}
