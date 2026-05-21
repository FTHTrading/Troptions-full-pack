/**
 * TROPTIONS Sports Network — CharityImpactCard
 */
import { cn } from "@/lib/cn";

interface CharityImpactCardProps {
  name: string;
  category: string;
  description: string;
  impact?: string;
  className?: string;
}

export function CharityImpactCard({ name, category, description, impact, className }: CharityImpactCardProps) {
  return (
    <div className={cn("border border-green-500/20 bg-green-950/10 p-6", className)}>
      <p className="text-green-400 text-xs font-semibold uppercase tracking-widest mb-2">{category}</p>
      <h3 className="text-white font-bold text-lg mb-3">{name}</h3>
      <p className="text-[#8a94a6] text-sm leading-relaxed mb-4">{description}</p>
      {impact && (
        <p className="text-green-400 text-sm font-medium">{impact}</p>
      )}
    </div>
  );
}
