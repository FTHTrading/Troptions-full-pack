import type { Metadata } from "next";
import Link from "next/link";

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
  title: "TROPTIONS TV — Where the City Watches",
  description:
    "Original local programming, sponsor drops, watch-party coverage, and Solana-powered moments around the world's biggest matchdays.",
};

const BLOCKS = [
  {
    label: "Pre-Match",
    title: "City Guide",
    copy: "Venues, neighborhood picks, watch-party routes, restaurant offers, and local intel — curated for every matchday.",
    accent: "text-[#c99a3c]",
    border: "border-[#c99a3c]/30",
  },
  {
    label: "Live Window",
    title: "Sponsor Drops",
    copy: "QR moments appear on screen. Fans scan, claim, and unlock rewards. Sponsors get live engagement with on-chain proof.",
    accent: "text-purple-400",
    border: "border-purple-400/30",
  },
  {
    label: "Post-Match",
    title: "Recap + Nightlife",
    copy: "Top city moments, celebration venues, after-hours offers, and charity impact summary. The broadcast keeps going after the whistle.",
    accent: "text-emerald-400",
    border: "border-emerald-400/30",
  },
];

export default function TroptionsTVPage() {
  return (
    <div className="min-h-screen bg-[#040d1a] text-white overflow-x-hidden">

      {/* ── HERO — fans-stadium + hero-reel video ── */}
      <section className="relative min-h-[80vh] flex items-center overflow-hidden bg-black">
        {/* fans-stadium.jpg */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: "url('/assets/sports/fans-stadium.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center 35%",
          }}
        />
        {/* Hero reel video */}
        <video className="absolute inset-0 w-full h-full object-cover opacity-40" autoPlay muted loop playsInline>
          <source src="/assets/sports/hero-reel.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/30 to-[#040d1a]" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/55 to-transparent" />
        {/* Soccer ball floaters */}
        <div className="absolute top-12 right-14 hidden md:block"><SoccerBall size={110} opacity={0.07} /></div>
        <div className="absolute bottom-16 right-1/3 hidden md:block"><SoccerBall size={55} opacity={0.06} /></div>
        {/* Content */}
        <div className="relative z-10 max-w-screen-xl mx-auto px-8 md:px-20 py-28 pt-40 w-full">
          <p className="text-[#c99a3c] text-[9px] font-bold uppercase tracking-[0.5em] mb-6">TROPTIONS Television Network</p>
          <h1 className="text-[clamp(3rem,9vw,7.5rem)] font-black text-white leading-none uppercase mb-6">
            Where the
            <br />
            <span className="text-[#c99a3c]">city watches.</span>
          </h1>
          <p className="text-white/45 text-lg max-w-xl leading-relaxed mb-4">
            Original local programming, sponsor drops, watch-party coverage,
            and Solana-powered moments around the world's biggest matchdays.
          </p>
          <p className="text-white/25 text-sm max-w-xl mb-10">
            Official matches belong to official broadcasters.
            TROPTIONS TV covers the city around the game.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link href="/sports/moments" className="px-10 py-5 bg-[#c99a3c] text-black font-black text-xs uppercase tracking-[0.25em] hover:bg-[#f0cf82] transition-colors">
              Claim a TV Moment
            </Link>
            <Link href="/sports/partners" className="px-10 py-5 border border-white/25 text-white font-black text-xs uppercase tracking-[0.25em] hover:border-[#c99a3c] hover:text-[#c99a3c] transition-all">
              Sponsor a Segment
            </Link>
          </div>
        </div>
      </section>

      {/* ── THREE BROADCAST BLOCKS ── */}
      <section className="max-w-screen-xl mx-auto px-8 md:px-16 py-28">
        <p className="text-[#c99a3c] text-[9px] font-bold uppercase tracking-[0.5em] mb-5 text-center">Programming</p>
        <h2 className="text-[clamp(2rem,5vw,4rem)] font-black text-white text-center leading-none uppercase mb-16">
          Every matchday. Three windows.
        </h2>
        <div className="grid md:grid-cols-3 gap-px bg-white/5">
          {BLOCKS.map((b) => (
            <div key={b.label} className={`bg-[#040d1a] p-10 hover:bg-[#071428] transition-colors border-t-2 ${b.border}`}>
              <div className="flex items-start justify-between mb-5">
                <p className={`${b.accent} text-[9px] font-black uppercase tracking-[0.35em]`}>{b.label}</p>
                <SoccerBall size={28} opacity={0.15} />
              </div>
              <h3 className="text-white text-2xl font-black mb-4 uppercase">{b.title}</h3>
              <p className="text-white/35 leading-relaxed text-sm">{b.copy}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── STADIUM IMAGE + TEXT PANEL ── */}
      <section className="grid md:grid-cols-2 min-h-[60vh]">
        <div className="flex items-center px-10 md:px-16 py-20 bg-[#050f1e]">
          <div className="max-w-md">
            <p className="text-[#c99a3c] text-[9px] font-bold uppercase tracking-[0.45em] mb-7">The Network</p>
            <h2 className="text-[clamp(2rem,4.5vw,3.5rem)] font-black text-white leading-none uppercase mb-6">
              TROPTIONS powers
              <br />the city around
              <br /><span className="text-[#c99a3c]">the game.</span>
            </h2>
            <p className="text-white/40 leading-relaxed mb-8 text-sm">
              TROPTIONS Television is the local broadcast layer — original programming, fan rewards,
              sponsor activations, and merchant commerce running across every screen in the city,
              every matchday.
            </p>
            <div className="grid grid-cols-3 gap-3 mb-8">
              {[
                { v: "2019", l: "Founded" },
                { v: "ATL",  l: "Home" },
                { v: "2026", l: "Target" },
              ].map((s) => (
                <div key={s.l} className="border border-white/10 bg-[#040d1a] p-4 text-center">
                  <p className="text-[#c99a3c] text-2xl font-black">{s.v}</p>
                  <p className="text-white/25 text-[9px] font-bold uppercase tracking-widest mt-1">{s.l}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
        {/* Stadium aerial image with video overlay */}
        <div className="relative overflow-hidden min-h-[50vw] md:min-h-0 bg-black">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: "url('/assets/sports/stadium-atlanta.jpg')",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />
          <video className="absolute inset-0 w-full h-full object-cover opacity-40" autoPlay muted loop playsInline>
            <source src="/assets/sports/donk-loop3.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-gradient-to-l from-transparent to-[#050f1e] opacity-50" />
          {/* Soccer ball art */}
          <div className="absolute bottom-6 right-6"><SoccerBall size={90} opacity={0.18} /></div>
          <div className="absolute top-8 right-20"><SoccerBall size={45} opacity={0.12} /></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"><SoccerBall size={120} opacity={0.06} /></div>
        </div>
      </section>

      {/* ── SOCCER BALL DIVIDER ── */}
      <div className="bg-[#040d1a] py-10 flex items-center justify-center gap-8">
        <div className="h-px flex-1 max-w-xs bg-gradient-to-r from-transparent to-[#c99a3c]/30" />
        <SoccerBall size={36} opacity={0.35} />
        <div className="h-px flex-1 max-w-xs bg-gradient-to-l from-transparent to-[#c99a3c]/30" />
      </div>

      {/* ── TTN BROADCAST OS ── */}
      <section className="max-w-screen-xl mx-auto px-8 md:px-16 py-20">
        <div className="grid md:grid-cols-2 gap-16 items-start">
          <div>
            <p className="text-[#c99a3c] text-[9px] font-bold uppercase tracking-[0.45em] mb-7">TTN Broadcast OS</p>
            <h2 className="text-[clamp(2rem,4vw,3rem)] font-black text-white leading-none uppercase mb-6">
              The tech behind
              <br /><span className="text-[#c99a3c]">every drop.</span>
            </h2>
            <ul className="space-y-4">
              {[
                "MediaCMS — video library, channels, VOD archive",
                "Owncast — creator live channels and chat",
                "MistServer — professional broadcast streaming",
                "Next.js — premium public frontend",
                "Solana — rewards, moments, proof",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <SoccerBall size={18} opacity={0.4} />
                  <span className="text-white/40 text-sm leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
            <Link href="/ttn/infrastructure" className="inline-block mt-8 text-[#c99a3c] text-xs font-black uppercase tracking-wider hover:text-[#f0cf82] transition-colors">
              View TTN Infrastructure →
            </Link>
          </div>
          {/* Player action image */}
          <div className="relative overflow-hidden min-h-[45vw] md:min-h-[400px] bg-black">
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: "url('/assets/sports/player-action.jpg')",
                backgroundSize: "cover",
                backgroundPosition: "center 30%",
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#040d1a] opacity-60" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#050f1e]/60 to-transparent" />
            <div className="absolute bottom-6 left-6"><SoccerBall size={60} opacity={0.2} /></div>
            <div className="absolute top-6 right-6"><SoccerBall size={35} opacity={0.14} /></div>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="relative py-28 px-8 text-center overflow-hidden bg-black">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: "url('/assets/sports/fans-crowd.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div className="absolute inset-0 bg-[#040d1a]/88" />
        {/* Scattered soccer balls */}
        <div className="absolute top-10 left-10"><SoccerBall size={100} opacity={0.06} /></div>
        <div className="absolute bottom-10 right-10"><SoccerBall size={80} opacity={0.05} /></div>
        <div className="absolute top-1/3 right-16"><SoccerBall size={45} opacity={0.07} /></div>
        <div className="relative z-10 max-w-3xl mx-auto">
          <p className="text-[#c99a3c] text-[9px] font-bold uppercase tracking-[0.5em] mb-7">Partner Up</p>
          <h2 className="text-[clamp(2.5rem,6vw,5rem)] font-black text-white leading-none uppercase mb-8">
            Ready to sponsor
            <br />or launch a channel?
          </h2>
          <p className="text-white/35 text-lg max-w-xl mx-auto leading-relaxed mb-12">
            Brands, venues, and creators can activate inside the TROPTIONS broadcast layer.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/sports/partners" className="px-10 py-5 bg-[#c99a3c] text-black font-black text-xs uppercase tracking-[0.3em] hover:bg-[#f0cf82] transition-colors">
              Sponsor a Segment
            </Link>
            <Link href="/ttn/launch-channel" className="px-10 py-5 border border-white/25 text-white font-black text-xs uppercase tracking-[0.3em] hover:border-[#c99a3c] hover:text-[#c99a3c] transition-all">
              Launch Your Channel
            </Link>
          </div>
        </div>
      </section>

      {/* Footer disclaimer */}
      <section className="border-t border-white/5 py-10 px-8">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-[#c99a3c] text-[9px] font-bold uppercase tracking-widest mb-4">Powered by TROPTIONS. Settled on Solana.</p>
          <p className="text-white/20 text-xs leading-relaxed">
            TROPTIONS is an independent fan-commerce and media activation network. No official FIFA, ESPN,
            league, team, stadium, broadcaster, or rights-holder affiliation is claimed unless separately contracted.
          </p>
        </div>
      </section>
    </div>
  );
}

