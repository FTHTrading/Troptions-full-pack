import type { Metadata } from "next";
import Link from "next/link";
import fs from "fs";
import path from "path";
import { MomentCard } from "@/components/sports/MomentCard";

function SoccerBall({ size = 40, opacity = 0.12 }: { size?: number; opacity?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none" style={{ opacity }}>
      <circle cx="20" cy="20" r="19" stroke="white" strokeWidth="1.5" />
      <polygon points="20,6 25,13 20,18 15,13" fill="white" />
      <polygon points="20,22 25,27 20,34 15,27" fill="white" />
      <polygon points="6,15 13,15 16,20 13,25 6,25" fill="white" />
      <polygon points="34,15 27,15 24,20 27,25 34,25" fill="white" />
      <polygon points="8,9 14,12 15,13 13,15 6,15" fill="white" />
      <polygon points="32,9 26,12 25,13 27,15 34,15" fill="white" />
      <polygon points="8,31 14,28 15,27 13,25 6,25" fill="white" />
      <polygon points="32,31 26,28 25,27 27,25 34,25" fill="white" />
    </svg>
  );
}

export const metadata: Metadata = {
  title: "TROPTIONS Moments — Scan. Claim. Own.",
  description:
    "Fan rewards, sponsor drops, charity badges, and digital collectibles. Claim free. Mint to Solana only if you want the on-chain record.",
};

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
}

function getMoments(): Moment[] {
  try {
    const raw = fs.readFileSync(
      path.join(process.cwd(), "src/data/worldcup/moments.json"),
      "utf-8",
    );
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

const FEATURED_DROPS = [
  {
    label: "City Badge",
    title: "Atlanta City Badge",
    copy: "Available at TROPTIONS TV partner venues across the Atlanta matchday network. Scan at any participating location.",
    tag: "Fan Collectible",
  },
  {
    label: "Halftime Drop",
    title: "Halftime Reward",
    copy: "Appears on screen at halftime. 20-minute claim window. QR scanned by phone — no wallet required to claim.",
    tag: "Broadcast Drop",
  },
  {
    label: "Charity Impact Badge",
    title: "Community Impact Badge",
    copy: "Claim triggers a sponsor-funded donation to an Atlanta nonprofit. Proof issued on-chain. Optional Solana record.",
    tag: "Charity",
  },
];

export default function MomentsPage() {
  const moments = getMoments();
  const active = moments.filter((m) => m.status === "active");

  return (
    <div className="min-h-screen bg-[#040d1a] text-white overflow-x-hidden">

      {/* ── HERO — Player action video + image ── */}
      <section className="relative min-h-[80vh] flex items-center overflow-hidden bg-black">
        {/* player-action.jpg */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: "url('/assets/sports/player-action.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center 25%",
          }}
        />
        {/* Donk video over it */}
        <video className="absolute inset-0 w-full h-full object-cover opacity-55" autoPlay muted loop playsInline>
          <source src="/assets/sports/donk-panel.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-black/65 via-black/30 to-[#040d1a]" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/55 to-transparent" />

        {/* Floating soccer balls */}
        <div className="absolute top-16 right-16 hidden md:block"><SoccerBall size={140} opacity={0.08} /></div>
        <div className="absolute bottom-20 right-1/4 hidden md:block"><SoccerBall size={60} opacity={0.06} /></div>
        <div className="absolute top-1/3 right-8 hidden md:block"><SoccerBall size={35} opacity={0.10} /></div>

        <div className="relative z-10 max-w-screen-xl mx-auto px-8 md:px-20 py-28 pt-40 w-full">
          <p className="text-[#c99a3c] text-[9px] font-bold uppercase tracking-[0.5em] mb-6">TROPTIONS Moments · Solana NFTs</p>
          <h1 className="text-[clamp(3rem,9vw,7.5rem)] font-black text-white leading-none uppercase mb-6">
            Scan the screen.
            <br />
            <span className="text-[#c99a3c]">Own the moment.</span>
          </h1>
          <p className="text-white/45 text-lg max-w-xl leading-relaxed mb-10">
            Fan rewards, sponsor drops, charity badges, and digital collectibles.
            Claim free. Mint to Solana only if you want the on-chain record.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link href="#drops" className="px-10 py-5 bg-[#c99a3c] text-black font-black text-xs uppercase tracking-[0.25em] hover:bg-[#f0cf82] transition-colors">
              View Active Drops
            </Link>
            <Link href="/sports/claim" className="px-10 py-5 border border-white/25 text-white font-black text-xs uppercase tracking-[0.25em] hover:border-[#c99a3c] hover:text-[#c99a3c] transition-all">
              Enter Claim Code
            </Link>
          </div>
        </div>
      </section>

      {/* ── SOCCER BALL DIVIDER ── */}
      <div className="bg-[#040d1a] py-10 flex items-center justify-center gap-8">
        <div className="h-px flex-1 max-w-xs bg-gradient-to-r from-transparent to-[#c99a3c]/30" />
        <SoccerBall size={36} opacity={0.35} />
        <SoccerBall size={22} opacity={0.18} />
        <SoccerBall size={36} opacity={0.35} />
        <div className="h-px flex-1 max-w-xs bg-gradient-to-l from-transparent to-[#c99a3c]/30" />
      </div>

      {/* ── 5-STEP FLOW ── */}
      <section className="max-w-screen-xl mx-auto px-8 md:px-16 py-20">
        <p className="text-[#c99a3c] text-[9px] font-bold uppercase tracking-[0.5em] mb-5 text-center">How It Works</p>
        <h2 className="text-[clamp(2rem,5vw,4rem)] font-black text-white text-center leading-none uppercase mb-16">
          Five steps. No friction.
        </h2>
        <div className="grid sm:grid-cols-5 gap-px bg-white/5">
          {[
            { n: "1", s: "Watch", d: "TROPTIONS TV or a participating venue." },
            { n: "2", s: "Scan", d: "QR on screen or at location." },
            { n: "3", s: "Claim", d: "Phone or email. No wallet required." },
            { n: "4", s: "Redeem", d: "Unlock the reward, offer, or badge." },
            { n: "5", s: "Mint", d: "Optional — send to Solana wallet for on-chain record." },
          ].map((step) => (
            <div key={step.n} className="bg-[#040d1a] p-8 text-center hover:bg-[#071428] transition-colors">
              <div className="flex justify-center mb-3">
                <SoccerBall size={30} opacity={0.25} />
              </div>
              <p className="text-[#c99a3c] text-3xl font-black mb-3">{step.n}</p>
              <p className="text-white font-bold mb-2">{step.s}</p>
              <p className="text-white/30 text-xs leading-relaxed">{step.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── PLAYER IMAGE SPLIT PANEL ── */}
      <section className="grid md:grid-cols-2 min-h-[55vh]">
        <div className="relative overflow-hidden min-h-[50vw] md:min-h-0 bg-black">
          {/* player-action-2.jpg — second player kicking */}
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: "url('/assets/sports/player-action-2.jpg')",
              backgroundSize: "cover",
              backgroundPosition: "center 20%",
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#040d1a] opacity-55" />
          {/* Soccer ball overlays */}
          <div className="absolute top-8 left-8"><SoccerBall size={55} opacity={0.18} /></div>
          <div className="absolute bottom-12 right-16"><SoccerBall size={35} opacity={0.12} /></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"><SoccerBall size={90} opacity={0.06} /></div>
          <div className="absolute bottom-6 left-6 px-4 py-2 bg-black/60 border border-[#c99a3c]/40">
            <p className="text-[#c99a3c] text-[9px] font-black uppercase tracking-[0.4em]">Scan · Claim · Mint</p>
          </div>
        </div>
        <div className="flex items-center px-10 md:px-16 py-20 bg-[#050f1e]">
          <div className="max-w-md">
            <p className="text-[#c99a3c] text-[9px] font-bold uppercase tracking-[0.45em] mb-7">Every Match. Every Venue.</p>
            <h2 className="text-[clamp(2rem,4vw,3rem)] font-black text-white leading-none uppercase mb-6">
              A goal happens
              <br />every few minutes.
              <br /><span className="text-[#c99a3c]">You can own one.</span>
            </h2>
            <p className="text-white/40 leading-relaxed mb-8 text-sm">
              QR drops appear during the broadcast. You have 20 minutes to scan, claim,
              and lock in your moment. Sub-cent Solana fees. No crypto required at claim time.
            </p>
            <div className="flex items-center gap-4">
              <SoccerBall size={28} opacity={0.4} />
              <p className="text-white/25 text-xs italic">Every goal. Every save. Every moment in the stands.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── FEATURED DROPS ── */}
      <section className="bg-[#050f1e] border-t border-b border-white/5 py-28 px-8 md:px-16">
        <div className="max-w-screen-xl mx-auto">
          <p className="text-[#c99a3c] text-[9px] font-bold uppercase tracking-[0.5em] mb-5 text-center">Featured Drops</p>
          <h2 className="text-[clamp(2rem,5vw,4rem)] font-black text-white text-center leading-none uppercase mb-16">
            Three drops. Every matchday.
          </h2>
          <div className="grid md:grid-cols-3 gap-px bg-white/5">
            {FEATURED_DROPS.map((d) => (
              <div key={d.label} className="bg-[#050f1e] p-10 hover:bg-[#071428] transition-colors">
                <div className="flex items-start justify-between mb-5">
                  <p className="text-[#c99a3c] text-[9px] font-black uppercase tracking-[0.35em]">{d.label}</p>
                  <SoccerBall size={32} opacity={0.15} />
                </div>
                <h3 className="text-white font-bold text-xl mb-4">{d.title}</h3>
                <p className="text-white/35 text-sm leading-relaxed mb-6">{d.copy}</p>
                <span className="border border-white/10 text-white/30 text-[9px] px-3 py-1 font-bold uppercase tracking-wider">
                  {d.tag}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SOLANA STRIP ── */}
      <section className="max-w-4xl mx-auto px-8 py-12 text-center">
        <div className="flex items-center justify-center gap-5">
          <SoccerBall size={20} opacity={0.25} />
          <p className="text-white/25 text-sm leading-relaxed">
            Solana powers optional minting, proof-of-attendance, digital receipts, and sponsor reporting.
            TROPTIONS keeps the fan experience simple.
          </p>
          <SoccerBall size={20} opacity={0.25} />
        </div>
      </section>

      {/* ── ACTIVE DROPS FROM DATA ── */}
      <section id="drops" className="max-w-screen-xl mx-auto px-8 md:px-16 pb-28">
        <p className="text-[#c99a3c] text-[9px] font-bold uppercase tracking-[0.45em] mb-5">Live Drops</p>
        <h2 className="text-[clamp(1.8rem,4vw,3rem)] font-black text-white leading-none uppercase mb-10">
          {active.length > 0 ? `${active.length} moments available now.` : "Drops activate on matchday."}
        </h2>
        {active.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {active.map((m) => (
              <MomentCard
                key={m.id}
                id={m.id}
                slug={m.slug}
                type={m.type as Parameters<typeof MomentCard>[0]["type"]}
                title={m.title}
                description={m.description}
                reward_text={m.reward ?? undefined}
                supply_total={m.supply_total}
                supply_claimed={m.supply_claimed}
                mint_enabled={m.mint_enabled}
                sponsor_name={m.sponsor_name}
                charity_name={m.charity_name}
              />
            ))}
          </div>
        ) : (
          <div className="border border-white/8 bg-[#050f1e] p-16 text-center flex flex-col items-center gap-6">
            <SoccerBall size={60} opacity={0.15} />
            <p className="text-white/35 text-lg">Follow TROPTIONS TV for live QR drops during matchday.</p>
          </div>
        )}
      </section>

      {/* ── DONK CREATIVE ── */}
      <section className="bg-[#050f1e] border-t border-white/5 py-16 px-8">
        <div className="max-w-4xl mx-auto text-center flex flex-col items-center gap-4">
          <SoccerBall size={42} opacity={0.25} />
          <p className="text-[#c99a3c] text-[9px] font-bold uppercase tracking-widest">Creative Division</p>
          <p className="text-[#f0cf82] text-4xl font-black tracking-tight">DONK</p>
          <p className="text-white/30 text-sm max-w-md">
            DONK leads the TROPTIONS Moments creative studio. Every drop is designed, narrated, and styled by the DONK team.
          </p>
        </div>
      </section>

      {/* Footer disclaimer */}
      <section className="border-t border-white/5 py-10 px-8">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-[#c99a3c] text-[9px] font-bold uppercase tracking-widest mb-4">Powered by TROPTIONS. Settled on Solana.</p>
          <p className="text-white/20 text-xs leading-relaxed">
            TROPTIONS is an independent fan-commerce and media activation network. No official FIFA, ESPN,
            Octagon, league, team, stadium, broadcaster, or rights-holder affiliation is claimed unless
            separately contracted. Official match coverage belongs to licensed rights holders.
            TROPTIONS Moments are not investment products or securities.
          </p>
        </div>
      </section>
    </div>
  );
}

