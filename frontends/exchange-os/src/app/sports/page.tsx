import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "TROPTIONS — World Cup 2026 Atlanta · AI Fan Commerce Network · Sponsor Now",
  description:
    "TROPTIONS is the AI-powered sports commerce network for 2026 FIFA World Cup Atlanta. Sponsor activations, fan NFTs, watch parties, local business marketing, and Solana-powered digital moments.",
  keywords:
    "TROPTIONS, World Cup 2026 Atlanta, FIFA 2026, sports NFT, fan moments, sponsor drops, Solana sports, DONK AI, Atlanta soccer, sports marketing, event commerce",
  openGraph: {
    title: "TROPTIONS — The AI Event Commerce Network · WC2026 Atlanta",
    description: "Sponsors. Fan NFTs. Local commerce. AI-managed. Solana-settled.",
    type: "website",
  },
};

const NAV = [
  { label: "Home",     href: "/sports" },
  { label: "TV",       href: "/sports/tv" },
  { label: "Atlanta",  href: "/sports/atlanta" },
  { label: "Moments",  href: "/sports/moments" },
  { label: "TTN",      href: "/ttn" },
];

const STATS = [
  { num: "48",   label: "Matches" },
  { num: "16",   label: "Host Cities" },
  { num: "6",    label: "ATL Matches" },
  { num: "5B",   label: "Global Viewers" },
  { num: "2003", label: "Founded" },
];

// Sponsor tiers — the revenue engine
const SPONSOR_TIERS = [
  {
    tier: "City",
    price: "$500",
    period: "/ month",
    color: "border-white/15",
    accent: "text-white/60",
    perks: [
      "QR drops at 1 venue",
      "TTN mention monthly",
      "Fan offer page listing",
      "Basic analytics",
    ],
  },
  {
    tier: "Regional",
    price: "$2,500",
    period: "/ month",
    color: "border-[#c99a3c]",
    accent: "text-[#c99a3c]",
    featured: true,
    perks: [
      "QR drops at 5 venues",
      "Sponsor panel on site",
      "Fan moment brand overlay",
      "TTN channel sponsorship",
      "AI-optimized placement",
      "Geo-targeted campaigns",
    ],
  },
  {
    tier: "Global",
    price: "$10,000",
    period: "/ month",
    color: "border-[#0ea5e9]",
    accent: "text-[#0ea5e9]",
    perks: [
      "Full city network takeover",
      "Hero banner rotation",
      "Custom NFT collection drop",
      "Live TTN broadcast sponsor",
      "Multilingual AI ad copy",
      "Real-time proof dashboard",
      "Dedicated account manager",
    ],
  },
];

const LANGUAGES = [
  { lang: "EN", phrase: "Own the Moment." },
  { lang: "ES", phrase: "Vive el Momento." },
  { lang: "PT", phrase: "Viva o Momento." },
  { lang: "FR", phrase: "Vivez le Moment." },
  { lang: "AR", phrase: "امتلك اللحظة." },
  { lang: "ZH", phrase: "拥有这一刻。" },
  { lang: "DE", phrase: "Erlebe den Moment." },
  { lang: "JP", phrase: "その瞬間を所有する。" },
];

const MODULES = [
  { n: "01", title: "TROPTIONS TV",    body: "Premium broadcast for fan zones, watch parties, and city-wide event coverage." },
  { n: "02", title: "Fan Moments",     body: "Scan at venues. Mint to Solana. Own a piece of every match." },
  { n: "03", title: "Sponsor Drops",   body: "QR campaigns, fan rewards, geo-targeted ads — AI-managed, results-verified." },
  { n: "04", title: "Local Commerce",  body: "Restaurants, hotels, venues, and merchants plugged into the event economy." },
  { n: "05", title: "Charity Layer",   body: "On-chain cause campaigns with clean public proof and automatic allocation." },
  { n: "06", title: "Proof Dashboard", body: "Revenue, mints, sponsors, and campaign performance — live, verifiable, real." },
];

const CHANNELS = [
  { name: "TTN Sports",   live: true  },
  { name: "TTN Events",   live: true  },
  { name: "TTN Charity",  live: true  },
  { name: "TTN Music",    live: false },
  { name: "TTN Local",    live: false },
  { name: "TTN Creators", live: false },
];

export default function SportsNetworkPage() {
  return (
    <div className="bg-[#040d1a] text-white overflow-x-hidden">

      {/* ── NAV ── */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="max-w-screen-2xl mx-auto px-5 md:px-10 h-16 flex items-center justify-between">

          {/* Logo / Home */}
          <Link href="/sports" className="flex items-center gap-2.5 group shrink-0">
            <div className="w-8 h-8 bg-[#c99a3c] flex items-center justify-center">
              <span className="text-black font-black text-sm">T</span>
            </div>
            <span className="text-white font-black text-sm uppercase tracking-[0.18em] group-hover:text-[#c99a3c] transition-colors">
              TROPTIONS
            </span>
          </Link>

          {/* Center links */}
          <div className="hidden md:flex items-center gap-8">
            {NAV.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="text-white/55 text-[11px] font-bold uppercase tracking-[0.18em] hover:text-white transition-colors"
              >
                {l.label}
              </Link>
            ))}
          </div>

          {/* Right CTAs */}
          <div className="flex items-center gap-3">
            <Link
              href="https://launch.unykorn.org/"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden md:block text-[#0ea5e9] text-[11px] font-black uppercase tracking-[0.15em] hover:text-white transition-colors"
            >
              DONK AI
            </Link>
            <Link
              href="#sponsor"
              className="bg-[#c99a3c] text-black text-[11px] font-black uppercase tracking-[0.18em] px-5 py-2.5 hover:bg-[#f0cf82] transition-colors"
            >
              Buy a Spot
            </Link>
          </div>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section className="relative h-screen min-h-[700px] overflow-hidden">
        {/* Video */}
        <video
          className="absolute inset-0 w-full h-full object-cover"
          autoPlay muted loop playsInline
          poster="/assets/sports/stadium-atlanta.jpg"
        >
          <source src="/assets/sports/hero-reel.mp4" type="video/mp4" />
        </video>

        {/* Fallback: stadium-atlanta.jpg as bg-image */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: "url('/assets/sports/stadium-atlanta.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />

        {/* Overlays */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/75 via-black/35 to-[#040d1a]" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-black/30" />
        <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse 70% 45% at 50% 8%, rgba(201,154,60,0.12) 0%, transparent 65%)" }} />

        <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6">
          {/* Live badge */}
          <div className="flex items-center gap-2 mb-7 px-4 py-1.5 border border-[#c99a3c]/40 bg-[#c99a3c]/10">
            <span className="w-1.5 h-1.5 rounded-full bg-[#c99a3c] animate-pulse" />
            <span className="text-[#c99a3c] text-[9px] font-black uppercase tracking-[0.5em]">
              2026 FIFA World Cup · Atlanta · June 10
            </span>
          </div>

          <h1 className="text-[clamp(3.2rem,11vw,9rem)] font-black text-white leading-none uppercase mb-6">
            The City
            <br />
            <span className="text-transparent" style={{ WebkitTextStroke: "2px #c99a3c" }}>
              Is The
            </span>
            <br />
            Stadium.
          </h1>

          <p className="text-white/50 text-base md:text-lg max-w-xl leading-relaxed mb-10">
            AI-powered sponsor drops. Fan NFTs. Watch parties. Local commerce.
            <br />
            One network. Every language. Settled on Solana.
          </p>

          <div className="flex flex-col sm:flex-row gap-3">
            <Link href="#sponsor" className="px-10 py-5 bg-[#c99a3c] text-black font-black text-xs uppercase tracking-[0.25em] hover:bg-[#f0cf82] transition-colors">
              Buy a Marketing Spot
            </Link>
            <Link href="/sports/moments" className="px-10 py-5 border border-white/30 text-white font-black text-xs uppercase tracking-[0.25em] hover:border-[#c99a3c] hover:text-[#c99a3c] transition-all">
              Mint a Fan Moment
            </Link>
            <Link href="https://launch.unykorn.org/" target="_blank" rel="noopener noreferrer" className="px-10 py-5 bg-[#0ea5e9]/15 border border-[#0ea5e9]/40 text-[#0ea5e9] font-black text-xs uppercase tracking-[0.25em] hover:bg-[#0ea5e9]/25 transition-all">
              DONK AI
            </Link>
          </div>
        </div>

        <div className="absolute bottom-7 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5">
          <div className="w-px h-10 bg-gradient-to-b from-white/30 to-transparent" />
          <p className="text-white/20 text-[9px] uppercase tracking-[0.4em]">Scroll</p>
        </div>
      </section>

      {/* ── STAT BAR ── */}
      <section className="bg-[#c99a3c] py-5 px-6">
        <div className="max-w-screen-xl mx-auto flex flex-wrap justify-center md:justify-between items-center gap-8">
          {STATS.map((s) => (
            <div key={s.num} className="text-center">
              <p className="text-3xl font-black text-black leading-none">{s.num}</p>
              <p className="text-black/60 text-[9px] font-bold uppercase tracking-[0.25em] mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── MULTILINGUAL TICKER ── */}
      <section className="bg-[#050f1e] border-b border-white/5 py-5 overflow-hidden">
        <div className="flex gap-16 whitespace-nowrap" style={{ animation: "marquee 30s linear infinite" }}>
          {[...LANGUAGES, ...LANGUAGES].map((l, i) => (
            <span key={i} className="inline-flex items-center gap-3 shrink-0">
              <span className="text-[#c99a3c]/50 text-[9px] font-black uppercase tracking-widest">{l.lang}</span>
              <span className="text-white/60 text-sm font-bold">{l.phrase}</span>
            </span>
          ))}
        </div>
      </section>

      {/* ── PANEL 1 — PLAYER ACTION + MINT ── */}
      <section className="grid md:grid-cols-2 min-h-[85vh]">
        <div className="relative overflow-hidden min-h-[55vw] md:min-h-0 bg-black">
          {/* player-action.jpg — the kicking player with stadium lights */}
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: "url('/assets/sports/player-action.jpg')",
              backgroundSize: "cover",
              backgroundPosition: "center 30%",
            }}
          />
          <video className="absolute inset-0 w-full h-full object-cover opacity-60" autoPlay muted loop playsInline>
            <source src="/assets/sports/donk-panel.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#040d1a] opacity-70" />
          <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, rgba(10,28,58,0.4) 0%, transparent 60%)" }} />
          {/* "SCAN HERE" overlay badge */}
          <div className="absolute bottom-8 left-8 border border-[#c99a3c]/50 px-4 py-2 bg-black/50 backdrop-blur-sm">
            <p className="text-[#c99a3c] text-[9px] font-black uppercase tracking-[0.4em]">Scan · Claim · Mint</p>
          </div>
        </div>
        <div className="flex items-center px-10 md:px-16 py-20 bg-[#040d1a]">
          <div className="max-w-md">
            <p className="text-[#c99a3c] text-[9px] font-bold uppercase tracking-[0.45em] mb-7">Fan Moments · Solana NFTs</p>
            <h2 className="text-[clamp(2.2rem,5.5vw,4.5rem)] font-black text-white leading-none uppercase mb-6">
              Scan the screen.
              <br />
              Own the moment.
              <br />
              <span className="text-[#c99a3c]">Mint it forever.</span>
            </h2>
            <p className="text-white/40 text-base leading-relaxed mb-8">
              Every goal. Every save. Every eruption in the stands.
              Scan at partner venues, claim your moment, mint to Solana in seconds.
              Sub-cent fees. Yours forever.
            </p>
            <div className="flex flex-col gap-3">
              <Link href="/sports/moments" className="inline-flex items-center gap-3 px-8 py-4 bg-[#c99a3c] text-black font-black text-xs uppercase tracking-[0.25em] hover:bg-[#f0cf82] transition-colors">
                Mint a Fan Moment →
              </Link>
              <Link href="https://launch.unykorn.org/launch" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-3 text-[#0ea5e9]/70 font-bold text-xs uppercase tracking-[0.2em] hover:text-[#0ea5e9] transition-colors">
                Launch your own token on Solana →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── PANEL 2 — FANS CROWD + COMMERCE ── */}
      <section className="grid md:grid-cols-2 min-h-[85vh]">
        <div className="flex items-center px-10 md:px-16 py-20 bg-[#050f1e] order-2 md:order-1">
          <div className="max-w-md">
            <p className="text-[#c99a3c] text-[9px] font-bold uppercase tracking-[0.45em] mb-7">Atlanta City Network</p>
            <h2 className="text-[clamp(2.2rem,5.5vw,4.5rem)] font-black text-white leading-none uppercase mb-6">
              Every fan.
              <br />
              Every venue.
              <br />
              <span className="text-[#c99a3c]">Every dollar tracked.</span>
            </h2>
            <p className="text-white/40 text-base leading-relaxed mb-8">
              Hotels. Bars. Restaurants. Rideshare. Merchandise. Charities.
              TROPTIONS plugs every local business into the World Cup economy
              with AI-managed offers and Solana-verified revenue proof.
            </p>
            <div className="grid grid-cols-2 gap-3 mb-8">
              {["QR Offer Drops", "AI-Managed Geo", "Multilingual Ads", "On-chain Proof"].map((f) => (
                <div key={f} className="flex items-center gap-2">
                  <span className="w-1 h-1 bg-[#c99a3c] shrink-0" />
                  <span className="text-white/50 text-xs font-bold uppercase tracking-wide">{f}</span>
                </div>
              ))}
            </div>
            <Link href="/sports/atlanta" className="inline-flex items-center gap-3 text-[#c99a3c] font-black text-xs uppercase tracking-[0.3em] group">
              Explore Atlanta
              <span className="group-hover:translate-x-2 transition-transform inline-block">→</span>
            </Link>
          </div>
        </div>
        <div className="relative overflow-hidden min-h-[55vw] md:min-h-0 order-1 md:order-2 bg-black">
          {/* fans-crowd.jpg — fans outside Mercedes-Benz Stadium */}
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: "url('/assets/sports/fans-crowd.jpg')",
              backgroundSize: "cover",
              backgroundPosition: "center 40%",
            }}
          />
          <video className="absolute inset-0 w-full h-full object-cover opacity-50" autoPlay muted loop playsInline>
            <source src="/assets/sports/donk-loop2.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-gradient-to-l from-transparent to-[#050f1e] opacity-65" />
        </div>
      </section>

      {/* ── FULL BLEED — EVERY NATION ── */}
      <section className="relative min-h-[75vh] flex items-center overflow-hidden bg-black">
        {/* fans-stadium.jpg — celebrating fans in stadium seats */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: "url('/assets/sports/fans-stadium.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <video className="absolute inset-0 w-full h-full object-cover opacity-35" autoPlay muted loop playsInline>
          <source src="/assets/sports/donk-loop3.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at 20% 50%, rgba(192,57,43,0.4) 0%, transparent 45%), radial-gradient(ellipse at 80% 50%, rgba(41,128,185,0.4) 0%, transparent 45%), radial-gradient(ellipse at 50% 90%, rgba(201,154,60,0.25) 0%, transparent 40%)" }} />
        <div className="absolute inset-0 bg-[#040d1a]/65" />
        <div className="relative z-10 max-w-screen-xl mx-auto px-8 md:px-20 py-28 w-full">
          <p className="text-[#c99a3c] text-[9px] font-bold uppercase tracking-[0.5em] mb-7">48 Nations · 5 Billion Viewers</p>
          <h2 className="text-[clamp(2.8rem,9.5vw,7.5rem)] font-black text-white leading-none uppercase">
            Every nation.
            <br />
            <span className="text-transparent" style={{ WebkitTextStroke: "2px rgba(255,255,255,0.18)" }}>
              One city.
            </span>
            <br />
            <span className="text-[#c99a3c]">One network.</span>
          </h2>
          <p className="text-white/45 text-xl max-w-lg leading-relaxed mt-10 mb-12">
            64,000 seats inside the stadium. Millions of fans in the streets.
            Billions watching globally. TROPTIONS connects them all to sponsors, moments, and commerce.
          </p>
          <Link href="#sponsor" className="inline-block px-12 py-5 bg-[#c99a3c] text-black font-black text-xs uppercase tracking-[0.3em] hover:bg-[#f0cf82] transition-colors">
            Claim Your Sponsor Spot
          </Link>
        </div>
      </section>

      {/* ── SPONSOR MARKETPLACE ── */}
      <section id="sponsor" className="py-28 px-8 md:px-16 bg-[#040d1a]">
        <div className="max-w-screen-xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-[#c99a3c] text-[9px] font-bold uppercase tracking-[0.5em] mb-5">Sponsor Network</p>
            <h2 className="text-[clamp(2.5rem,7vw,6rem)] font-black text-white leading-none uppercase mb-6">
              Buy a marketing spot.
              <br />
              <span className="text-[#c99a3c]">The AI handles the rest.</span>
            </h2>
            <p className="text-white/40 text-lg max-w-2xl mx-auto leading-relaxed">
              DONK AI manages placement, geo-targeting, multilingual copy, and performance reporting.
              You pick a tier. The network does the work. Revenue is verified on-chain.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-px bg-white/5">
            {SPONSOR_TIERS.map((t) => (
              <div key={t.tier} className={`bg-[#040d1a] p-10 flex flex-col border-t-2 ${t.color} ${t.featured ? "relative" : ""}`}>
                {t.featured && (
                  <div className="absolute top-0 right-0 bg-[#c99a3c] text-black text-[8px] font-black uppercase tracking-widest px-3 py-1">
                    Most Popular
                  </div>
                )}
                <div className="mb-8">
                  <p className={`text-[9px] font-black uppercase tracking-[0.4em] mb-3 ${t.accent}`}>{t.tier}</p>
                  <div className="flex items-baseline gap-1">
                    <span className="text-5xl font-black text-white">{t.price}</span>
                    <span className="text-white/30 text-sm font-bold">{t.period}</span>
                  </div>
                </div>
                <ul className="flex flex-col gap-3 flex-1 mb-10">
                  {t.perks.map((p) => (
                    <li key={p} className="flex items-start gap-3">
                      <span className={`mt-0.5 text-xs ${t.accent}`}>—</span>
                      <span className="text-white/55 text-sm leading-snug">{p}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  href="/sports/partners"
                  className={`text-center py-4 font-black text-xs uppercase tracking-[0.25em] transition-all ${
                    t.featured
                      ? "bg-[#c99a3c] text-black hover:bg-[#f0cf82]"
                      : t.color === "border-[#0ea5e9]"
                      ? "bg-[#0ea5e9]/15 border border-[#0ea5e9]/40 text-[#0ea5e9] hover:bg-[#0ea5e9]/25"
                      : "border border-white/15 text-white/50 hover:border-white/40 hover:text-white"
                  }`}
                >
                  Claim {t.tier} Spot
                </Link>
              </div>
            ))}
          </div>

          <div className="mt-10 text-center">
            <p className="text-white/25 text-xs">
              Custom enterprise packages available ·{" "}
              <Link href="/sports/partners" className="text-[#c99a3c] hover:text-white transition-colors">
                Contact us
              </Link>
              {" "}for multi-city and global deals
            </p>
          </div>
        </div>
      </section>

      {/* ── DONK AI MODULES ── */}
      <section className="py-28 px-8 md:px-16 bg-[#050f1e] border-y border-white/5">
        <div className="max-w-screen-xl mx-auto grid md:grid-cols-2 gap-20 items-center">
          <div>
            <p className="text-[#0ea5e9] text-[9px] font-bold uppercase tracking-[0.5em] mb-7">DONK AI · Intelligence Layer</p>
            <h2 className="text-[clamp(2.2rem,5.5vw,4.5rem)] font-black text-white leading-none uppercase mb-7">
              AI that runs
              <br />
              <span className="text-[#0ea5e9]">the whole system.</span>
            </h2>
            <p className="text-white/40 text-base leading-relaxed mb-10">
              DONK AI manages SEO, geo-targeting, multilingual copy, sponsor placement,
              fan engagement algos, NFT minting queues, and proof reporting.
              You focus on the city. The AI closes the loop.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link href="https://launch.unykorn.org/" target="_blank" rel="noopener noreferrer" className="inline-block px-8 py-4 bg-[#0ea5e9] text-black font-black text-xs uppercase tracking-[0.25em] hover:bg-[#38bdf8] transition-colors">
                Open DONK AI →
              </Link>
              <Link href="https://launch.unykorn.org/genesis" target="_blank" rel="noopener noreferrer" className="inline-block px-8 py-4 border border-white/20 text-white/60 font-black text-xs uppercase tracking-[0.25em] hover:border-white/40 hover:text-white transition-all">
                Founder Pass (0.5 SOL)
              </Link>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-white/5">
            {MODULES.map((m) => (
              <div key={m.n} className="bg-[#050f1e] p-7 hover:bg-[#071428] transition-colors">
                <p className="text-[#0ea5e9]/40 text-[10px] font-bold uppercase tracking-widest mb-2">{m.n}</p>
                <p className="text-white font-bold text-sm mb-2">{m.title}</p>
                <p className="text-white/30 text-xs leading-relaxed">{m.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TTN BROADCAST ── */}
      <section className="py-28 px-8 md:px-16 bg-[#040d1a]">
        <div className="max-w-screen-xl mx-auto grid md:grid-cols-2 gap-20 items-center">
          <div>
            <p className="text-[#c99a3c] text-[9px] font-bold uppercase tracking-[0.4em] mb-7">TTN Broadcast OS</p>
            <h2 className="text-[clamp(2.2rem,5.5vw,4.5rem)] font-black text-white leading-none uppercase mb-7">
              Your city.
              <br />Your channel.
              <br /><span className="text-[#c99a3c]">Your proof.</span>
            </h2>
            <p className="text-white/40 text-base leading-relaxed mb-10">
              Every venue, creator, and sponsor gets their own broadcast layer —
              live coverage, recap content, verifiable audience proof on IPFS and Solana.
              Sell the ad spots. We handle the tech.
            </p>
            <Link href="/ttn" className="inline-flex items-center gap-3 text-[#c99a3c] font-black text-xs uppercase tracking-[0.3em] group">
              Launch a Channel
              <span className="group-hover:translate-x-2 transition-transform inline-block">→</span>
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-px bg-white/5">
            {CHANNELS.map((ch) => (
              <div key={ch.name} className="bg-[#040d1a] p-8 hover:bg-[#071428] transition-colors">
                <div className={`inline-block px-2 py-0.5 text-[8px] font-bold uppercase tracking-widest mb-3 ${ch.live ? "bg-[#c99a3c] text-black" : "border border-white/10 text-white/25"}`}>
                  {ch.live ? "Live" : "Soon"}
                </div>
                <p className="text-white font-bold text-sm">{ch.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PROOF / SOLANA ── */}
      <section className="relative py-20 px-8 md:px-16 overflow-hidden bg-[#040d1a]">
        {/* player-action-2.jpg subtle bg */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: "url('/assets/sports/player-action-2.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div className="absolute inset-0 opacity-15" style={{ background: "radial-gradient(ellipse at 50% 50%, rgba(14,165,233,0.5) 0%, transparent 65%)" }} />
        <div className="absolute inset-0 opacity-[0.025]" style={{ backgroundImage: "linear-gradient(rgba(14,165,233,1) 1px, transparent 1px), linear-gradient(90deg, rgba(14,165,233,1) 1px, transparent 1px)", backgroundSize: "55px 55px" }} />
        <div className="relative z-10 max-w-screen-xl mx-auto flex flex-col md:flex-row items-center justify-between gap-14">
          <div className="max-w-xl">
            <p className="text-[#0ea5e9] text-[9px] font-bold uppercase tracking-[0.4em] mb-5">Solana · Apostle Chain · IPFS</p>
            <h3 className="text-4xl md:text-5xl font-black text-white leading-tight uppercase mb-5">
              Revenue lives on-chain.
              <br />
              <span className="text-white/35">The fan experience stays simple.</span>
            </h3>
            <p className="text-white/30 leading-relaxed text-sm">
              Every sponsor payment, NFT mint, and fan claim is recorded, verified, and reportable.
              No black boxes. No guessing. Sub-cent Solana fees. Real-time dashboards.
            </p>
          </div>
          <div className="flex gap-10 shrink-0">
            {[
              { sym: "SOL",  label: "Settlement" },
              { sym: "ATP",  label: "Apostle Chain" },
              { sym: "IPFS", label: "Proof Storage" },
              { sym: "NFT",  label: "Fan Moments" },
            ].map((t) => (
              <div key={t.sym} className="text-center">
                <p className="text-[#0ea5e9] text-2xl font-black leading-none mb-1.5">{t.sym}</p>
                <p className="text-white/20 text-[8px] uppercase tracking-[0.3em]">{t.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PARTNER CTA ── */}
      <section className="relative py-36 px-8 text-center bg-[#040d1a] overflow-hidden">
        {/* stadium-atlanta.jpg faint bg */}
        <div
          className="absolute inset-0"
          style={{
            opacity: 0.08,
            backgroundImage: "url('/assets/sports/stadium-atlanta.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "linear-gradient(#c99a3c 1px, transparent 1px), linear-gradient(90deg, #c99a3c 1px, transparent 1px)", backgroundSize: "80px 80px" }} />
        <div className="absolute inset-0 bg-[#040d1a]/92" />
        <div className="relative z-10 max-w-4xl mx-auto">
          <p className="text-[#c99a3c] text-[9px] font-bold uppercase tracking-[0.5em] mb-7">Join the Network</p>
          <h2 className="text-[clamp(2.8rem,9vw,7.5rem)] font-black text-white leading-none uppercase mb-8">
            Your brand
            <br />
            belongs here.
          </h2>
          <p className="text-white/35 text-lg max-w-xl mx-auto leading-relaxed mb-12">
            The 2026 World Cup window closes June 10.
            Marketing spots are limited. The AI is ready. The city is waiting.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/sports/partners" className="px-14 py-5 bg-[#c99a3c] text-black font-black text-xs uppercase tracking-[0.3em] hover:bg-[#f0cf82] transition-colors">
              Partner With TROPTIONS
            </Link>
            <Link href="https://launch.unykorn.org/genesis" target="_blank" rel="noopener noreferrer" className="px-14 py-5 border border-[#0ea5e9]/40 text-[#0ea5e9] font-black text-xs uppercase tracking-[0.3em] hover:bg-[#0ea5e9]/10 transition-all" style={{ borderColor: 'rgba(14,165,233,0.4)' }}>
              Mint Founder Pass
            </Link>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="border-t border-white/5 py-14 px-8 md:px-16">
        <div className="max-w-screen-xl mx-auto">
          <div className="flex flex-col md:flex-row items-start justify-between gap-10 mb-10">
            <div>
              <Link href="/sports" className="flex items-center gap-2.5 mb-3 group">
                <div className="w-8 h-8 bg-[#c99a3c] flex items-center justify-center">
                  <span className="text-black font-black text-sm">T</span>
                </div>
                <span className="text-white font-black text-sm uppercase tracking-[0.18em] group-hover:text-[#c99a3c] transition-colors">TROPTIONS</span>
              </Link>
              <p className="text-white/20 text-xs">Founded 2003 · Settled on Solana · Atlanta, USA</p>
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 mt-4">
                {[
                  { label: "DONK AI", href: "https://launch.unykorn.org/", color: "text-[#0ea5e9]/50 hover:text-[#0ea5e9]" },
                  { label: "UnyKorn", href: "https://unykorn.org/", color: "text-white/25 hover:text-white/60" },
                  { label: "eTrenzik", href: "https://www.etrenzik.com/", color: "text-white/25 hover:text-white/60" },
                  { label: "FTH Co.", href: "https://fthco.com/", color: "text-white/25 hover:text-white/60" },
                ].map((l) => (
                  <Link key={l.href} href={l.href} target="_blank" rel="noopener noreferrer" className={`text-[10px] font-bold uppercase tracking-[0.2em] transition-colors ${l.color}`}>
                    {l.label}
                  </Link>
                ))}
              </div>
            </div>

            {/* Nav links */}
            <div className="flex flex-col gap-2">
              <p className="text-white/20 text-[9px] uppercase tracking-widest mb-2">Navigation</p>
              {[...NAV, { label: "Partners", href: "/sports/partners" }, { label: "Proof", href: "/sports/proof" }].map((l) => (
                <Link key={l.href} href={l.href} className="text-white/30 text-[11px] font-bold uppercase tracking-[0.18em] hover:text-white/70 transition-colors">
                  {l.label}
                </Link>
              ))}
            </div>

            {/* Languages */}
            <div className="flex flex-col gap-2">
              <p className="text-white/20 text-[9px] uppercase tracking-widest mb-2">Own The Moment</p>
              {LANGUAGES.slice(0, 6).map((l) => (
                <div key={l.lang} className="flex items-center gap-2">
                  <span className="text-[#c99a3c]/40 text-[8px] font-black uppercase w-5">{l.lang}</span>
                  <span className="text-white/20 text-[10px]">{l.phrase}</span>
                </div>
              ))}
            </div>

            <p className="text-white/10 text-[9px] max-w-[200px] leading-relaxed">
              TROPTIONS is an independent fan-commerce and media activation network.
              No official FIFA, league, team, stadium, or broadcaster affiliation is claimed unless separately contracted.
              Official match coverage belongs to licensed rights holders.
            </p>
          </div>

          {/* GoatX + UNYKORN Solana Ecosystem */}
          <div className="border-t border-white/5 pt-5 mb-5">
            <p className="text-white/20 text-[9px] uppercase tracking-widest mb-3">UNYKORN Solana Ecosystem</p>
            <div className="flex flex-col gap-1.5">
              <a href="https://goat.unykorn.org" className="text-[#00ff88]/40 text-[9px] underline underline-offset-2 hover:text-[#00ff88]/70 transition-colors font-bold" target="_blank" rel="noreferrer">GoatX — Live on Solana Mainnet →</a>
              <a href="/sports/solana-launcher" className="text-white/30 text-[9px] underline underline-offset-2 hover:text-white/50 transition-colors">TROPTIONS Campaign Launcher →</a>
              <a href="/sports/minted" className="text-white/30 text-[9px] underline underline-offset-2 hover:text-white/50 transition-colors">All Minted Assets →</a>
              <a href="/sports/mint-demo" className="text-white/30 text-[9px] underline underline-offset-2 hover:text-white/50 transition-colors">Mint Demo →</a>
              <a href="https://troptionsexchange.unykorn.org/exchange-os" className="text-[#c99a3c]/50 text-[9px] underline underline-offset-2 hover:text-[#c99a3c]/80 transition-colors font-bold" target="_blank" rel="noreferrer">Exchange OS — Institutional control tower for token launches, proof, and liquidity →</a>
              <a href="https://troptionsexchange.unykorn.org/exchange-os/partner-demo" className="text-[#c99a3c]/40 text-[9px] underline underline-offset-2 hover:text-[#c99a3c]/70 transition-colors" target="_blank" rel="noreferrer">Exchange OS Partner Demo — verify before launch, prove before promote →</a>
              <a href="https://troptions.unykorn.org/troptions" className="text-[#c99a3c]/40 text-[9px] underline underline-offset-2 hover:text-[#c99a3c]/70 transition-colors" target="_blank" rel="noreferrer">TROPTIONS Institutional — est. 2003 →</a>
              <a href="https://portfolio.unykorn.org" className="text-white/30 text-[9px] underline underline-offset-2 hover:text-white/50 transition-colors" target="_blank" rel="noreferrer">UNYKORN Portfolio — system book &amp; proof registry →</a>
            </div>
          </div>

          {/* Co-launch links to WhichWay / FIFA guest OS */}
          <div className="border-t border-white/5 pt-5 mb-5">
            <p className="text-white/20 text-[9px] uppercase tracking-widest mb-3">Experience campaigns in the guest OS</p>
            <div className="flex flex-wrap gap-3">
              <a href="https://fifa.unykorn.org" className="text-white/30 text-[9px] underline underline-offset-2 hover:text-white/50 transition-colors" target="_blank" rel="noreferrer">WhichWay.live →</a>
              <a href="https://fifa.unykorn.org/campaigns" className="text-white/30 text-[9px] underline underline-offset-2 hover:text-white/50 transition-colors" target="_blank" rel="noreferrer">Live Campaigns →</a>
              <a href="https://fifa.unykorn.org/wwai" className="text-white/30 text-[9px] underline underline-offset-2 hover:text-white/50 transition-colors" target="_blank" rel="noreferrer">WWAI Guest AI →</a>
            </div>
          </div>

          <div className="border-t border-white/5 pt-7 flex flex-col md:flex-row items-center justify-between gap-3">
            <p className="text-white/20 text-[9px] uppercase tracking-[0.3em]">© 2026 TROPTIONS · Atlanta, USA</p>
            <div className="flex items-center gap-2 text-white/20 text-[9px] uppercase tracking-[0.2em]">
              <span className="text-[#0ea5e9]/40 font-bold">Solana</span>
              <span>·</span>
              <span className="text-[#c99a3c]/40 font-bold">TROPTIONS</span>
              <span>·</span>
              <span className="text-white/20 font-bold">DONK AI</span>
            </div>
          </div>
        </div>
      </footer>


    </div>
  );
}

