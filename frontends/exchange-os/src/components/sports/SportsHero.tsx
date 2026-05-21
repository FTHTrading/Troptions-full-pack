/**
 * TROPTIONS Sports Network — SportsHero
 * Premium broadcast-style hero. No affiliate claims.
 */
import Link from "next/link";
import { cn } from "@/lib/cn";

interface SportsHeroProps {
  headline: string;
  subheadline: string;
  primaryCta?: { label: string; href: string };
  secondaryCta?: { label: string; href: string };
  badge?: string;
  className?: string;
}

export function SportsHero({
  headline,
  subheadline,
  primaryCta,
  secondaryCta,
  badge,
  className,
}: SportsHeroProps) {
  return (
    <section
      className={cn(
        "relative min-h-[72vh] flex flex-col items-center justify-center text-center px-6 py-24",
        "bg-[#071426] overflow-hidden",
        className
      )}
    >
      {/* Grid overlay — broadcast feel */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(201,154,60,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(201,154,60,0.6) 1px, transparent 1px)",
          backgroundSize: "80px 80px",
        }}
      />
      {/* Gold top bar */}
      <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-transparent via-[#c99a3c] to-transparent" />

      <div className="relative z-10 max-w-4xl mx-auto">
        {badge && (
          <p className="text-[#c99a3c] text-xs font-semibold uppercase tracking-[0.25em] mb-6">
            {badge}
          </p>
        )}
        <h1
          className="font-display text-5xl md:text-7xl font-bold text-white leading-tight mb-6"
          style={{ fontFamily: "var(--font-display)" }}
        >
          {headline}
        </h1>
        <p className="text-[#8a94a6] text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
          {subheadline}
        </p>
        {(primaryCta || secondaryCta) && (
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            {primaryCta && (
              <Link
                href={primaryCta.href}
                className="px-8 py-3.5 bg-[#c99a3c] text-[#071426] font-semibold text-sm uppercase tracking-wider rounded-none hover:bg-[#f0cf82] transition-colors"
              >
                {primaryCta.label}
              </Link>
            )}
            {secondaryCta && (
              <Link
                href={secondaryCta.href}
                className="px-8 py-3.5 border border-[#c99a3c]/50 text-[#c99a3c] font-semibold text-sm uppercase tracking-wider rounded-none hover:border-[#c99a3c] hover:text-white transition-colors"
              >
                {secondaryCta.label}
              </Link>
            )}
          </div>
        )}
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#071426] to-transparent" />
    </section>
  );
}
