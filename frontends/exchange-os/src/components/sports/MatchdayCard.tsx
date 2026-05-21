/**
 * TROPTIONS Sports Network — MatchdayCard
 */
import Link from "next/link";
import { cn } from "@/lib/cn";

interface MatchdayCardProps {
  time?: string;
  venue?: string;
  title: string;
  description?: string;
  href?: string;
  highlighted?: boolean;
  className?: string;
}

export function MatchdayCard({
  time,
  venue,
  title,
  description,
  href,
  highlighted,
  className,
}: MatchdayCardProps) {
  const inner = (
    <div
      className={cn(
        "border-l-2 pl-5 py-4",
        highlighted ? "border-[#c99a3c]" : "border-white/10",
        className
      )}
    >
      {(time || venue) && (
        <div className="flex items-center gap-3 mb-2">
          {time && <span className="text-[#c99a3c] text-xs font-mono font-semibold">{time}</span>}
          {venue && <span className="text-[#8a94a6] text-xs">{venue}</span>}
        </div>
      )}
      <h4 className="text-white font-semibold text-base mb-1">{title}</h4>
      {description && <p className="text-[#8a94a6] text-sm leading-relaxed">{description}</p>}
    </div>
  );

  if (href) return <Link href={href}>{inner}</Link>;
  return inner;
}
