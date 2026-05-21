import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Fan Guide — TROPTIONS Sports Network",
  description:
    "Find where to watch, what deals are live, and claim TROPTIONS Moments — all in 3 taps. Your Atlanta matchday fan guide.",
};

const FAN_SECTIONS = [
  {
    step: "01",
    title: "Today's Matches",
    description: "Official match schedule. Kickoff times. Find an official viewing option or a TROPTIONS partner watch party near you.",
    cta: "Find Where to Watch",
    href: "/sports/atlanta",
    note: "Official matches broadcast by licensed rights holders. TROPTIONS connects you to watch parties and local guides.",
  },
  {
    step: "02",
    title: "Food & Drink Deals",
    description: "Partner restaurant and bar offers active right now. Matchday specials, pre-match deals, and reserved watch-party tables.",
    cta: "Browse Offers",
    href: "/sports/atlanta",
    note: "Featured Matchday Offers — not coupons. Quality venues and partner specials.",
  },
  {
    step: "03",
    title: "TROPTIONS TV",
    description: "Local matchday programming. Original guides, sponsor activations, restaurant spotlights, and fan reward drops.",
    cta: "Watch TROPTIONS TV",
    href: "/sports/tv",
    note: "Not an official broadcaster. Original local content only.",
  },
  {
    step: "04",
    title: "Claim a Moment",
    description: "Scan a QR, enter your phone or email, and claim a digital fan badge. Collect the memory. Mint to Solana later if you want.",
    cta: "View Moments",
    href: "/sports/moments",
    note: "No wallet required to claim. Optional Solana minting available.",
  },
  {
    step: "05",
    title: "Charity Spotlight",
    description: "TROPTIONS Gives. Sponsor-funded charity badge drops. Every scan can create local youth sports impact.",
    cta: "TROPTIONS Gives",
    href: "/sports/charity",
    note: "$1 sponsor donation per badge claim.",
  },
  {
    step: "06",
    title: "Ask WWAI",
    description: "WWAI is the TROPTIONS fan assistant. Ask for restaurant recommendations, deal alerts, watch party directions, and matchday guides.",
    cta: "Ask WWAI",
    href: "/troptions-ai",
    note: "AI-powered fan guide. Atlanta matchday specialist.",
  },
];

const OFFER_EXAMPLES = [
  { name: "Reserved Watch Party Table", venue: "Partner Venue", type: "Hospitality" },
  { name: "Free Appetizer with Matchday Check-In", venue: "Featured Bar", type: "Dining" },
  { name: "10% Off Lunch Before Kickoff", venue: "Partner Restaurant", type: "Dining" },
  { name: "Sponsor-Paid First Drink", venue: "Sponsor Activation", type: "Sponsor" },
  { name: "Family Meal Bundle", venue: "Family Venue", type: "Family" },
  { name: "Hotel Guest Special", venue: "Hotel Partner", type: "Hotel" },
];

export default function FansPage() {
  return (
    <div className="min-h-screen bg-[#071426]">
      {/* Hero */}
      <section className="relative py-20 px-6 text-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0b1f36] to-[#071426]" />
        <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-transparent via-[#c99a3c] to-transparent" />
        <div className="relative max-w-4xl mx-auto">
          <p className="text-[#c99a3c] text-xs font-semibold uppercase tracking-[0.25em] mb-5">
            Fan Experience
          </p>
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
            Open. Pick. Go.
          </h1>
          <p className="text-[#8a94a6] text-lg max-w-2xl mx-auto leading-relaxed mb-10">
            The TROPTIONS Fan Guide puts where to watch, what to eat, and how to collect your matchday moment in under 3 taps. No wallet required. No login needed to browse.
          </p>
          <Link
            href="/sports/atlanta"
            className="inline-block px-8 py-3.5 bg-[#c99a3c] text-[#071426] font-semibold text-sm uppercase tracking-wider hover:bg-[#f0cf82] transition-colors"
          >
            Explore Atlanta Today
          </Link>
        </div>
      </section>

      {/* Fan app flow — 6 steps */}
      <section className="max-w-5xl mx-auto px-6 py-20">
        <p className="text-[#c99a3c] text-xs font-semibold uppercase tracking-widest mb-4">
          The Fan Flow
        </p>
        <h2 className="text-3xl font-bold text-white mb-12">Everything in one place.</h2>
        <div className="grid md:grid-cols-2 gap-6">
          {FAN_SECTIONS.map((s) => (
            <div key={s.step} className="border border-white/10 bg-[#0b1f36] p-7">
              <div className="flex items-start gap-5 mb-4">
                <span className="text-[#c99a3c]/30 text-4xl font-bold font-display leading-none shrink-0">
                  {s.step}
                </span>
                <h3 className="text-white font-bold text-xl pt-1">{s.title}</h3>
              </div>
              <p className="text-[#8a94a6] text-sm leading-relaxed mb-5">{s.description}</p>
              <p className="text-[#8a94a6]/60 text-xs mb-5 italic">{s.note}</p>
              <Link
                href={s.href}
                className="text-[#c99a3c] text-sm font-semibold uppercase tracking-wider hover:text-white transition-colors"
              >
                {s.cta}
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Offer examples */}
      <section className="bg-[#050f1e] border-t border-white/5 py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <p className="text-[#c99a3c] text-xs font-semibold uppercase tracking-widest mb-4">
            Featured Matchday Offers
          </p>
          <h2 className="text-3xl font-bold text-white mb-4">
            Not coupons. Partner specials.
          </h2>
          <p className="text-[#8a94a6] mb-10 max-w-xl leading-relaxed">
            TROPTIONS partner venues offer quality experiences — reserved tables, matchday meals, hotel specials, and sponsor-backed rewards. Not a discount dump.
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {OFFER_EXAMPLES.map((o) => (
              <div key={o.name} className="border border-white/10 bg-[#0b1f36] p-5">
                <p className="text-[#c99a3c] text-xs font-semibold uppercase tracking-wider mb-2">{o.type}</p>
                <p className="text-white font-semibold text-base mb-1">{o.name}</p>
                <p className="text-[#8a94a6] text-sm">{o.venue}</p>
              </div>
            ))}
          </div>
          <p className="text-[#8a94a6] text-xs mt-6">
            Actual offers from partner merchants. Add your venue at{" "}
            <Link href="/worldcup/join" className="text-[#c99a3c] underline underline-offset-2">
              troptions.com/worldcup/join
            </Link>
          </p>
        </div>
      </section>

      {/* QR Moments preview */}
      <section className="max-w-5xl mx-auto px-6 py-20">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-[#c99a3c] text-xs font-semibold uppercase tracking-widest mb-4">
              TROPTIONS Moments
            </p>
            <h2 className="text-3xl font-bold text-white mb-5">Scan. Claim. Remember.</h2>
            <p className="text-[#8a94a6] leading-relaxed mb-6">
              Scan a QR at your venue, on TROPTIONS TV, or during a sponsor activation. Claim your digital fan badge. Unlock a reward. Optional Solana mint later.
            </p>
            <p className="text-[#8a94a6] text-sm leading-relaxed mb-8">
              No wallet required. Enter your phone or email to claim. Crypto users can connect a Solana wallet to mint on-chain.
            </p>
            <Link
              href="/sports/moments"
              className="inline-block px-6 py-3 bg-[#c99a3c] text-[#071426] font-semibold text-sm uppercase tracking-wider hover:bg-[#f0cf82] transition-colors"
            >
              View Active Drops
            </Link>
          </div>
          <div className="space-y-4">
            {["The City Is the Stadium — Fan Badge", "TROPTIONS TV Halftime Drop", "TROPTIONS Gives: Youth Sports Badge", "Atlanta Matchday Poster 001"].map((m) => (
              <div key={m} className="border border-[#c99a3c]/20 bg-[#0b1f36] px-5 py-4 flex items-center gap-4">
                <div className="w-10 h-10 bg-[#c99a3c]/10 border border-[#c99a3c]/30 flex items-center justify-center shrink-0">
                  <span className="text-[#c99a3c] text-sm font-bold">T</span>
                </div>
                <p className="text-white text-sm font-medium">{m}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
