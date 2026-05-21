/**
 * TROPTIONS Sports Network — PartnerPackageCard
 * Merchant/sponsor package pricing card.
 */
import Link from "next/link";
import { cn } from "@/lib/cn";

interface PartnerPackageCardProps {
  name: string;
  price: string;
  monthly?: string;
  description: string;
  features: string[];
  href?: string;
  featured?: boolean;
  className?: string;
}

export function PartnerPackageCard({
  name,
  price,
  monthly,
  description,
  features,
  href,
  featured,
  className,
}: PartnerPackageCardProps) {
  return (
    <div
      className={cn(
        "border p-8 flex flex-col",
        featured
          ? "border-[#c99a3c] bg-[#0b1f36]"
          : "border-white/10 bg-white/[0.03]",
        className
      )}
    >
      {featured && (
        <p className="text-[#c99a3c] text-xs font-semibold uppercase tracking-widest mb-4">
          Most Popular
        </p>
      )}
      <h3 className="text-white font-bold text-xl mb-2">{name}</h3>
      <p className="text-[#8a94a6] text-sm mb-6 leading-relaxed">{description}</p>

      <div className="mb-6">
        <span className="text-4xl font-bold text-white">{price}</span>
        {monthly && (
          <span className="text-[#8a94a6] text-sm ml-2">setup + {monthly}/mo</span>
        )}
        {!monthly && <span className="text-[#8a94a6] text-sm ml-2"></span>}
      </div>

      <ul className="space-y-3 mb-8 flex-1">
        {features.map((f) => (
          <li key={f} className="flex items-start gap-2 text-sm text-[#8a94a6]">
            <span className="text-[#c99a3c] mt-0.5 shrink-0">+</span>
            <span>{f}</span>
          </li>
        ))}
      </ul>

      {href && (
        <Link
          href={href}
          className={cn(
            "block text-center py-3 text-sm font-semibold uppercase tracking-wider transition-colors",
            featured
              ? "bg-[#c99a3c] text-[#071426] hover:bg-[#f0cf82]"
              : "border border-[#c99a3c]/40 text-[#c99a3c] hover:border-[#c99a3c]"
          )}
        >
          Get Started
        </Link>
      )}
    </div>
  );
}
