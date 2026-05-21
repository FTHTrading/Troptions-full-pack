/**
 * TROPTIONS Sports Network — BroadcastCard
 * Mimics a broadcast/TV segment card.
 */
import Link from "next/link";
import { cn } from "@/lib/cn";

interface BroadcastCardProps {
  label: string;
  title: string;
  description: string;
  href?: string;
  tag?: string;
  live?: boolean;
  className?: string;
}

export function BroadcastCard({
  label,
  title,
  description,
  href,
  tag,
  live,
  className,
}: BroadcastCardProps) {
  const inner = (
    <div
      className={cn(
        "group border border-[#c99a3c]/20 bg-[#0b1f36] p-6",
        "hover:border-[#c99a3c]/60 transition-all duration-200",
        href && "cursor-pointer",
        className
      )}
    >
      <div className="flex items-center gap-3 mb-4">
        {live && (
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <span className="text-red-400 text-xs font-semibold uppercase tracking-wider">Live</span>
          </span>
        )}
        {tag && !live && (
          <span className="text-[#c99a3c] text-xs font-semibold uppercase tracking-widest">
            {tag}
          </span>
        )}
      </div>
      <p className="text-[#8a94a6] text-xs font-semibold uppercase tracking-widest mb-2">{label}</p>
      <h3 className="text-white font-bold text-lg mb-3 leading-snug group-hover:text-[#f0cf82] transition-colors">
        {title}
      </h3>
      <p className="text-[#8a94a6] text-sm leading-relaxed">{description}</p>
    </div>
  );

  if (href) return <Link href={href}>{inner}</Link>;
  return inner;
}
