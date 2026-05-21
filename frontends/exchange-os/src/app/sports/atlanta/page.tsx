import type { Metadata } from "next";
import Link from "next/link";

// Inline soccer ball SVG for decorative accents
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
  title: "Atlanta Matchday Network — TROPTIONS Sports Network",
  description:
    "Tickets are expensive. The city still shows up. TROPTIONS turns Atlanta into a matchday network: venues, hotels, restaurants, watch parties, rewards, and local impact.",
};

const ZONES = [
  {
    name: "Downtown",
    vibe: "Stadium-adjacent. High energy, high foot traffic.",
    bestFor: "Stadium overflow crowds, hotel guests, transit arrivals",
    activation: "QR drops, watch-party sponsors, foot-traffic offers",
  },
  {
    name: "Midtown",
    vibe: "Bar and restaurant row. Fan-friendly all day, every match.",
    bestFor: "Groups, hotel guests, sports bar crowds",
    activation: "Sponsor activations, restaurant spotlights, TROPTIONS TV",
  },
  {
    name: "Buckhead",
    vibe: "Upscale dining and rooftop sports bars.",
    bestFor: "Corporate sponsors, premium watch parties, hospitality brands",
    activation: "Premium sponsor drops, VIP matchday packages",
  },
  {
    name: "BeltLine / Eastside",
    vibe: "Local crowd, breweries, mixed fan culture.",
    bestFor: "Neighborhood originals, youth activations, charity partners",
    activation: "Community badges, TROPTIONS Gives drops, local merchant offers",
  },
];

export default function AtlantaPage() {
  return (
    <div className="min-h-screen bg-[#040d1a] text-white overflow-x-hidden">

      {/* ── HERO — Video + Stadium bg ── */}
      <section className="relative min-h-[75vh] flex items-center overflow-hidden bg-black">
        {/* fans-crowd.jpg or fans-stadium.jpg as bg */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: "url('/assets/sports/fans-crowd.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center 35%",
          }}
        />
        {/* Donk video overlay */}
        <video className="absolute inset-0 w-full h-full object-cover opacity-45" autoPlay muted loop playsInline>
          <source src="/assets/sports/donk-loop2.mp4" type="video/mp4" />
        </video>
        {/* Overlays */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-[#040d1a]" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent" />
        {/* Decorative soccer balls */}
        <div className="absolute top-10 right-12 hidden md:block"><SoccerBall size={120} opacity={0.07} /></div>
        <div className="absolute bottom-14 right-1/3 hidden md:block"><SoccerBall size={64} opacity={0.06} /></div>
        {/* Content */}
        <div className="relative z-10 max-w-screen-xl mx-auto px-8 md:px-20 py-28 pt-36 w-full">
          <p className="text-[#c99a3c] text-[9px] font-bold uppercase tracking-[0.5em] mb-6">
            Atlanta Matchday Network · June–July 2026
          </p>
          <h1 className="text-[clamp(3rem,9vw,7rem)] font-black text-white leading-none uppercase mb-6">
            Tickets are expensive.
            <br />
            <span className="text-[#c99a3c]">The city still</span>
            <br />
            shows up.
          </h1>
          <p className="text-white/45 text-lg max-w-xl leading-relaxed mb-10">
            TROPTIONS turns Atlanta into a matchday network: venues, hotels,
            restaurants, watch parties, rewards, and local impact — all connected.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link href="/sports/moments" className="px-10 py-5 bg-[#c99a3c] text-black font-black text-xs uppercase tracking-[0.25em] hover:bg-[#f0cf82] transition-colors">
              Claim an Atlanta Moment
            </Link>
            <Link href="/sports/partners" className="px-10 py-5 border border-white/25 text-white font-black text-xs uppercase tracking-[0.25em] hover:border-[#c99a3c] hover:text-[#c99a3c] transition-all">
              List Your Venue
            </Link>
          </div>
        </div>
      </section>

      {/* ── STADIUM IMAGE PANEL ── */}
      <section className="grid md:grid-cols-2 min-h-[60vh]">
        {/* Stadium aerial */}
        <div className="relative overflow-hidden min-h-[50vw] md:min-h-0 bg-black">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: "url('/assets/sports/stadium-atlanta.jpg')",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#040d1a] opacity-60" />
          {/* Soccer ball watermark */}
          <div className="absolute bottom-6 left-6"><SoccerBall size={80} opacity={0.2} /></div>
          <div className="absolute top-6 right-20"><SoccerBall size={40} opacity={0.12} /></div>
          <div className="absolute bottom-6 right-6 px-4 py-2 bg-black/60 border border-[#c99a3c]/40">
            <p className="text-[#c99a3c] text-[9px] font-black uppercase tracking-[0.4em]">Mercedes-Benz Stadium · ATL</p>
          </div>
        </div>
        <div className="flex items-center px-10 md:px-16 py-20 bg-[#050f1e]">
          <div className="max-w-md">
            <p className="text-[#c99a3c] text-[9px] font-bold uppercase tracking-[0.45em] mb-7">6 World Cup Matches · Atlanta</p>
            <h2 className="text-[clamp(2rem,4.5vw,3.5rem)] font-black text-white leading-none uppercase mb-6">
              64,000 seats.
              <br />
              Millions of fans
              <br />
              <span className="text-[#c99a3c]">in the streets.</span>
            </h2>
            <p className="text-white/40 text-base leading-relaxed mb-6">
              Mercedes-Benz Stadium hosts 6 FIFA World Cup matches. For every fan inside,
              ten more are in the city. TROPTIONS connects them all to local commerce.
            </p>
            <Link href="#zones" className="inline-flex items-center gap-2 text-[#c99a3c] font-black text-xs uppercase tracking-[0.3em] group">
              See City Zones
              <span className="group-hover:translate-x-2 transition-transform inline-block">→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ── SOCCER BALL DIVIDER ── */}
      <div className="bg-[#040d1a] py-10 flex items-center justify-center gap-8">
        <div className="h-px flex-1 max-w-xs bg-gradient-to-r from-transparent to-[#c99a3c]/30" />
        <SoccerBall size={36} opacity={0.35} />
        <div className="h-px flex-1 max-w-xs bg-gradient-to-l from-transparent to-[#c99a3c]/30" />
      </div>

      {/* ── FOUR ZONES ── */}
      <section id="zones" className="max-w-screen-xl mx-auto px-8 md:px-16 py-20">
        <p className="text-[#c99a3c] text-[9px] font-bold uppercase tracking-[0.5em] mb-5 text-center">City Network</p>
        <h2 className="text-[clamp(2rem,5vw,4rem)] font-black text-white text-center leading-none uppercase mb-16">
          Four zones. One city playbook.
        </h2>
        <div className="grid md:grid-cols-2 gap-px bg-white/5">
          {ZONES.map((z) => (
            <div key={z.name} className="bg-[#040d1a] p-10 hover:bg-[#071428] transition-colors group">
              <div className="flex items-start justify-between mb-4">
                <p className="text-[#c99a3c] text-[9px] font-black uppercase tracking-[0.35em]">{z.name}</p>
                <SoccerBall size={28} opacity={0.08} />
              </div>
              <p className="text-white font-bold text-lg mb-5 leading-snug">{z.vibe}</p>
              <div className="space-y-3">
                <div>
                  <span className="text-white/30 text-[9px] font-bold uppercase tracking-wider">Best For — </span>
                  <span className="text-white/45 text-sm">{z.bestFor}</span>
                </div>
                <div>
                  <span className="text-[#c99a3c]/60 text-[9px] font-bold uppercase tracking-wider">Activation — </span>
                  <span className="text-white/45 text-sm">{z.activation}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-10 text-center">
          <p className="text-white/20 text-xs">Atlanta is the first city playbook. The model scales to every World Cup host city.</p>
        </div>
      </section>

      {/* ── SOLANA STRIP ── */}
      <section className="bg-[#050f1e] border-t border-b border-white/5 py-10 px-8">
        <div className="max-w-4xl mx-auto flex items-center justify-center gap-6 text-center">
          <SoccerBall size={24} opacity={0.3} />
          <p className="text-white/30 text-sm leading-relaxed">
            Solana powers optional minting, proof-of-attendance, digital receipts, and sponsor reporting.
            TROPTIONS keeps the fan experience simple.
          </p>
          <SoccerBall size={24} opacity={0.3} />
        </div>
      </section>

      {/* ── FOR MERCHANTS — image panel ── */}
      <section className="max-w-screen-xl mx-auto px-8 md:px-16 py-28">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div>
            <p className="text-[#c99a3c] text-[9px] font-bold uppercase tracking-[0.45em] mb-7">For Venues and Brands</p>
            <h2 className="text-[clamp(2rem,4.5vw,3.5rem)] font-black text-white leading-none uppercase mb-6">
              Fans priced out of
              <br />the stadium still need
              <br /><span className="text-[#c99a3c]">somewhere to go.</span>
            </h2>
            <p className="text-white/40 leading-relaxed mb-10">
              TROPTIONS puts your business into the matchday network. QR offers,
              featured placement, TROPTIONS TV spotlight, fan reward redemptions,
              and proof reporting — AI-managed, Solana-verified.
            </p>
            <Link href="/sports/partners" className="inline-block px-10 py-5 bg-[#c99a3c] text-black font-black text-xs uppercase tracking-[0.25em] hover:bg-[#f0cf82] transition-colors">
              View Partner Packages
            </Link>
          </div>
          <div className="space-y-px bg-white/5">
            {[
              { t: "Featured Matchday Offers", d: "Your deals pushed to fans searching the Atlanta network." },
              { t: "TROPTIONS TV Spotlight", d: "Restaurant and venue features in local programming." },
              { t: "QR Reward Drops", d: "Fan badges and moments tied to your venue or brand." },
              { t: "Proof Reports", d: "Verified scan, redemption, and reach data for every campaign." },
            ].map((item) => (
              <div key={item.t} className="bg-[#040d1a] p-7 hover:bg-[#071428] transition-colors flex gap-5 items-start">
                <SoccerBall size={22} opacity={0.2} />
                <div>
                  <p className="text-white font-bold mb-1">{item.t}</p>
                  <p className="text-white/35 text-sm">{item.d}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── BOTTOM CTA — full-bleed fans image ── */}
      <section className="relative py-28 px-8 text-center overflow-hidden bg-black">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: "url('/assets/sports/fans-stadium.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center 30%",
          }}
        />
        <div className="absolute inset-0 bg-[#040d1a]/82" />
        {/* Floating soccer balls */}
        <div className="absolute top-8 left-10"><SoccerBall size={90} opacity={0.06} /></div>
        <div className="absolute bottom-8 right-10"><SoccerBall size={130} opacity={0.05} /></div>
        <div className="absolute top-1/2 left-1/4 -translate-y-1/2"><SoccerBall size={50} opacity={0.04} /></div>
        <div className="relative z-10 max-w-3xl mx-auto">
          <p className="text-[#c99a3c] text-[9px] font-bold uppercase tracking-[0.5em] mb-7">Join the Atlanta Network</p>
          <h2 className="text-[clamp(2.5rem,7vw,5.5rem)] font-black text-white leading-none uppercase mb-8">
            Your city.
            <br /><span className="text-[#c99a3c]">Your commerce.</span>
          </h2>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/sports/moments" className="px-10 py-5 bg-[#c99a3c] text-black font-black text-xs uppercase tracking-[0.3em] hover:bg-[#f0cf82] transition-colors">
              Claim a Moment
            </Link>
            <Link href="/sports/partners" className="px-10 py-5 border border-white/25 text-white font-black text-xs uppercase tracking-[0.3em] hover:border-[#c99a3c] hover:text-[#c99a3c] transition-all">
              List Your Venue
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

