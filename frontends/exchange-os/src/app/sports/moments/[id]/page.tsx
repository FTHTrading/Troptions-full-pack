import type { Metadata } from "next";
import Link from "next/link";
import fs from "fs";
import path from "path";
import { notFound } from "next/navigation";

interface Moment {
  id: string;
  slug: string;
  type: string;
  title: string;
  description: string;
  reward: string | null;
  supply_total: number;
  supply_claimed: number;
  claim_code: string;
  sponsor_name?: string;
  charity_name?: string;
  mint_enabled: boolean;
  status: string;
  created_at?: string;
}

function getMoments(): Moment[] {
  try {
    return JSON.parse(
      fs.readFileSync(path.join(process.cwd(), "src/data/worldcup/moments.json"), "utf-8"),
    );
  } catch {
    return [];
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const moments = getMoments();
  const moment = moments.find((m) => m.id === id || m.slug === id);
  return {
    title: moment ? `${moment.title} — TROPTIONS Moments` : "TROPTIONS Moments",
    description: moment?.description ?? "TROPTIONS Moments digital collectible",
  };
}

const TYPE_LABEL: Record<string, string> = {
  fan_badge: "Fan Badge",
  restaurant_badge: "Restaurant Reward",
  sponsor_drop: "Sponsor Drop",
  charity_badge: "Charity Badge",
  artist_poster: "Artist Poster",
  tv_drop: "TROPTIONS TV Drop",
  vip_pass: "VIP Pass",
  proof_receipt: "Proof Receipt",
};

export default async function MomentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const moments = getMoments();
  const moment = moments.find((m) => m.id === id || m.slug === id);

  if (!moment) notFound();

  const claimedPct =
    moment.supply_total > 0
      ? Math.round((moment.supply_claimed / moment.supply_total) * 100)
      : 0;
  const remaining = moment.supply_total - moment.supply_claimed;
  const soldOut = remaining <= 0;

  return (
    <div className="min-h-screen bg-[#071426]">
      {/* Top bar */}
      <div className="border-b border-white/5 py-4 px-6 bg-[#050f1e]">
        <div className="max-w-5xl mx-auto flex items-center gap-3">
          <Link href="/sports/moments" className="text-[#c99a3c] text-xs font-semibold uppercase tracking-wider hover:text-white transition-colors">
            Moments
          </Link>
          <span className="text-white/20">/</span>
          <span className="text-[#8a94a6] text-xs">{moment.title}</span>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-20">
        <div className="grid md:grid-cols-2 gap-14 items-start">
          {/* Artwork */}
          <div>
            <div className="aspect-square border border-[#c99a3c]/30 bg-[#0b1f36] relative overflow-hidden">
              <svg className="absolute inset-0 w-full h-full opacity-10" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <pattern id="hatch" width="8" height="8" patternTransform="rotate(45)" patternUnits="userSpaceOnUse">
                    <line x1="0" y1="0" x2="0" y2="8" stroke="#c99a3c" strokeWidth="0.5" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#hatch)" />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center">
                <p className="text-[#c99a3c]/40 text-xs font-semibold uppercase tracking-widest mb-4">
                  TROPTIONS Moments
                </p>
                <p className="text-white text-2xl font-bold leading-tight mb-4">{moment.title}</p>
                <p className="text-[#c99a3c]/60 text-xs uppercase tracking-widest">
                  {TYPE_LABEL[moment.type] ?? moment.type}
                </p>
              </div>
            </div>
            {/* Supply bar */}
            <div className="mt-5">
              <div className="flex justify-between text-xs text-[#8a94a6] mb-2">
                <span>{moment.supply_claimed.toLocaleString()} claimed</span>
                <span>{moment.supply_total.toLocaleString()} total</span>
              </div>
              <div className="h-1.5 bg-white/5 rounded-none overflow-hidden">
                <div
                  className="h-full bg-[#c99a3c] transition-all"
                  style={{ width: `${Math.min(claimedPct, 100)}%` }}
                />
              </div>
            </div>
          </div>

          {/* Details */}
          <div>
            <span className="inline-block border border-[#c99a3c]/40 text-[#c99a3c] text-xs font-semibold uppercase tracking-widest px-3 py-1 mb-5">
              {TYPE_LABEL[moment.type] ?? moment.type}
            </span>
            <h1 className="text-4xl font-bold text-white mb-5 leading-tight">{moment.title}</h1>
            <p className="text-[#8a94a6] leading-relaxed mb-6">{moment.description}</p>

            {moment.reward && (
              <div className="border border-[#c99a3c]/30 bg-[#c99a3c]/5 px-5 py-4 mb-6">
                <p className="text-[#c99a3c] text-xs font-semibold uppercase tracking-widest mb-1">Reward Unlocked</p>
                <p className="text-white font-medium">{moment.reward}</p>
              </div>
            )}

            {moment.charity_name && (
              <div className="border border-green-500/20 bg-green-950/10 px-5 py-4 mb-6">
                <p className="text-green-400 text-xs font-semibold uppercase tracking-widest mb-1">Charity</p>
                <p className="text-white font-medium">{moment.charity_name}</p>
                <p className="text-[#8a94a6] text-xs mt-1">Sponsor donates $1 per claim</p>
              </div>
            )}

            {moment.sponsor_name && (
              <div className="border border-purple-500/20 bg-purple-950/10 px-5 py-4 mb-6">
                <p className="text-purple-400 text-xs font-semibold uppercase tracking-widest mb-1">Presented By</p>
                <p className="text-white font-medium">{moment.sponsor_name}</p>
              </div>
            )}

            <div className="flex items-center gap-3 mb-8">
              <span className={`text-xs font-semibold uppercase ${soldOut ? "text-red-400" : "text-green-400"}`}>
                {soldOut ? "Sold Out" : `${remaining.toLocaleString()} remaining`}
              </span>
              {moment.mint_enabled && (
                <span className="border border-[#c99a3c]/30 text-[#c99a3c] text-xs px-2 py-0.5 uppercase tracking-wider">
                  Solana Mint Available
                </span>
              )}
            </div>

            {!soldOut && moment.status === "active" ? (
              <div className="space-y-3">
                <Link
                  href={`/sports/claim/${moment.claim_code}`}
                  className="block w-full text-center px-6 py-3.5 bg-[#c99a3c] text-[#071426] font-semibold text-sm uppercase tracking-wider hover:bg-[#f0cf82] transition-colors"
                >
                  Claim This Moment
                </Link>
                {moment.mint_enabled && (
                  <Link
                    href="/sports/mint"
                    className="block w-full text-center px-6 py-3.5 border border-[#c99a3c]/40 text-[#c99a3c] font-semibold text-sm uppercase tracking-wider hover:border-[#c99a3c] transition-colors"
                  >
                    Mint to Solana
                  </Link>
                )}
              </div>
            ) : (
              <div className="border border-white/10 px-6 py-4 text-center">
                <p className="text-[#8a94a6] text-sm">{soldOut ? "This drop is sold out." : "This drop is not currently active."}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <section className="border-t border-white/5 py-8 px-6">
        <p className="max-w-4xl mx-auto text-center text-[#8a94a6] text-xs leading-relaxed">
          TROPTIONS Moments are digital collectibles and fan-reward badges. They are not investment products and do not represent financial instruments or securities. Charity badge claims do not constitute tax-deductible contributions by fans.
        </p>
      </section>
    </div>
  );
}
