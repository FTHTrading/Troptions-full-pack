/**
 * TROPTIONS Moments — MomentCard
 * Collectible card in the broadcast/agency style.
 */
import Link from "next/link";
import { cn } from "@/lib/cn";

export type MomentType =
  | "fan_badge"
  | "restaurant_badge"
  | "sponsor_drop"
  | "charity_badge"
  | "artist_poster"
  | "tv_drop"
  | "vip_pass"
  | "proof_receipt";

const TYPE_LABELS: Record<MomentType, string> = {
  fan_badge: "Fan Badge",
  restaurant_badge: "Venue Badge",
  sponsor_drop: "Sponsor Drop",
  charity_badge: "Charity Impact",
  artist_poster: "Limited Poster",
  tv_drop: "TROPTIONS TV Drop",
  vip_pass: "VIP Pass",
  proof_receipt: "Proof Receipt",
};

const TYPE_COLORS: Record<MomentType, string> = {
  fan_badge: "text-blue-400 border-blue-400/30 bg-blue-400/10",
  restaurant_badge: "text-amber-400 border-amber-400/30 bg-amber-400/10",
  sponsor_drop: "text-purple-400 border-purple-400/30 bg-purple-400/10",
  charity_badge: "text-green-400 border-green-400/30 bg-green-400/10",
  artist_poster: "text-rose-400 border-rose-400/30 bg-rose-400/10",
  tv_drop: "text-[#c99a3c] border-[#c99a3c]/30 bg-[#c99a3c]/10",
  vip_pass: "text-[#f0cf82] border-[#f0cf82]/30 bg-[#f0cf82]/10",
  proof_receipt: "text-[#8a94a6] border-white/20 bg-white/5",
};

interface MomentCardProps {
  id: string;
  slug: string;
  title: string;
  description: string;
  type: MomentType;
  supply_total: number;
  supply_claimed: number;
  reward_text?: string;
  sponsor_name?: string | null;
  charity_name?: string | null;
  mint_enabled?: boolean;
  className?: string;
}

export function MomentCard({
  id,
  slug,
  title,
  description,
  type,
  supply_total,
  supply_claimed,
  reward_text,
  sponsor_name,
  charity_name,
  mint_enabled,
  className,
}: MomentCardProps) {
  const remaining = supply_total - supply_claimed;
  const pct = Math.round((supply_claimed / supply_total) * 100);
  const typeColor = TYPE_COLORS[type] ?? TYPE_COLORS.fan_badge;
  const typeLabel = TYPE_LABELS[type] ?? type;

  return (
    <Link href={`/sports/moments/${slug}`} className="block group">
      <div
        className={cn(
          "border border-white/10 bg-[#0b1f36] overflow-hidden",
          "hover:border-[#c99a3c]/50 transition-all duration-200",
          className
        )}
      >
        {/* Artwork placeholder */}
        <div className="h-44 bg-gradient-to-br from-[#0c2040] to-[#071426] flex items-center justify-center relative overflow-hidden">
          <div
            className="absolute inset-0 opacity-[0.06]"
            style={{
              backgroundImage:
                "repeating-linear-gradient(-45deg, rgba(201,154,60,0.8) 0, rgba(201,154,60,0.8) 1px, transparent 0, transparent 50%)",
              backgroundSize: "12px 12px",
            }}
          />
          <span className="text-[#c99a3c]/40 text-5xl font-display font-bold z-10 select-none">
            T
          </span>
          {mint_enabled && (
            <span className="absolute top-3 right-3 text-[10px] font-semibold uppercase tracking-wider text-[#c99a3c] border border-[#c99a3c]/40 px-2 py-0.5">
              Mintable
            </span>
          )}
        </div>

        <div className="p-5">
          <div className="flex items-center justify-between mb-3">
            <span className={cn("text-xs font-semibold uppercase tracking-widest border px-2 py-0.5", typeColor)}>
              {typeLabel}
            </span>
            {(sponsor_name || charity_name) && (
              <span className="text-[#8a94a6] text-xs truncate ml-2">
                {charity_name ?? sponsor_name}
              </span>
            )}
          </div>

          <h3 className="text-white font-bold text-base mb-2 leading-snug group-hover:text-[#f0cf82] transition-colors">
            {title}
          </h3>
          <p className="text-[#8a94a6] text-sm leading-relaxed mb-4 line-clamp-2">{description}</p>

          {/* Supply bar */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs text-[#8a94a6]">
              <span>{supply_claimed.toLocaleString()} claimed</span>
              <span>{remaining.toLocaleString()} remaining</span>
            </div>
            <div className="h-1 bg-white/10 rounded-none overflow-hidden">
              <div
                className="h-full bg-[#c99a3c] transition-all"
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>

          {reward_text && (
            <p className="mt-3 text-[#c99a3c] text-xs leading-relaxed line-clamp-1">
              Reward: {reward_text}
            </p>
          )}
        </div>
      </div>
    </Link>
  );
}
