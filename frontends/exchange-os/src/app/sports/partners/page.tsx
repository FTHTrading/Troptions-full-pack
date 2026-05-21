import type { Metadata } from "next";
import Link from "next/link";
import { PartnerPackageCard } from "@/components/sports/PartnerPackageCard";

export const metadata: Metadata = {
  title: "Partner Packages — TROPTIONS Sports Network",
  description:
    "Restaurants. Hotels. Sponsors. Charities. TROPTIONS puts your business into the major event matchday network with QR offers, fan rewards, TROPTIONS TV exposure, and proof reporting.",
};

const PACKAGES = [
  {
    name: "Merchant Starter",
    price: "$199",
    monthly: "$99",
    description: "For restaurants and bars entering the matchday network. Get QR offers live fast.",
    features: [
      "Listed in the TROPTIONS Atlanta Matchday Network",
      "One active QR offer with fan-facing page",
      "TROPTIONS Moments venue badge (500 claims)",
      "Basic proof report: scans and redemptions",
      "TROPTIONS TV mention eligibility",
    ],
    href: "/worldcup/join",
    featured: false,
  },
  {
    name: "Verified Venue",
    price: "$499",
    monthly: "$199",
    description: "Full activation for established restaurants, sports bars, and hospitality venues.",
    features: [
      "All Merchant Starter features",
      "Verified venue badge on fan guide",
      "Up to 5 active QR offers",
      "TROPTIONS TV spotlight segment",
      "TROPTIONS Moments branded badge (2,000 claims)",
      "Weekly proof reporting dashboard",
      "Priority placement in fan search",
    ],
    href: "/worldcup/join",
    featured: true,
  },
  {
    name: "Matchday Boost",
    price: "$500",
    monthly: undefined,
    description: "Single-day push during a major matchday. Maximum fan reach for one event.",
    features: [
      "Featured placement for the full matchday",
      "Pushed to all active fan sessions",
      "TROPTIONS TV mention during broadcast",
      "Matchday-specific QR offer",
      "Proof report delivered next day",
    ],
    href: "/worldcup/join",
    featured: false,
  },
  {
    name: "Hotel Screen",
    price: "$1,500+",
    monthly: undefined,
    description: "TROPTIONS Television for hotel lobbies, kiosks, and guest-facing screens.",
    features: [
      "Hotel lobby screen mode content",
      "Fan guide and QR display on your screens",
      "Guest-facing offer distribution",
      "Sponsor activation placement",
      "TROPTIONS Moments drop QR on screen",
      "Guest analytics report",
    ],
    href: "/sports/partners",
    featured: false,
  },
  {
    name: "Sponsor Matchday Campaign",
    price: "$5,000+",
    monthly: undefined,
    description: "Full sponsor activation: QR drops, TROPTIONS TV, fan rewards, proof reporting.",
    features: [
      "Branded TROPTIONS Moments collectible drop",
      "QR campaign across venue network",
      "TROPTIONS TV sponsor segment",
      "Fan reward distribution",
      "Charity donation pledge option",
      "Detailed engagement proof report",
      "Logo placement across fan guide",
    ],
    href: "/sports/partners",
    featured: false,
  },
  {
    name: "Citywide Sponsor Package",
    price: "$25,000+",
    monthly: undefined,
    description: "Own the matchday city experience. Full network sponsorship for the full event window.",
    features: [
      "Presented-by sponsorship of TROPTIONS Sports Network Atlanta",
      "All Sponsor Matchday Campaign features — all matches",
      "Hotel screen sponsorship",
      "TROPTIONS TV primary sponsor credit",
      "TROPTIONS Gives charity campaign",
      "Executive proof dashboard",
      "Custom TROPTIONS Moments VIP collection",
    ],
    href: "/sports/partners",
    featured: false,
  },
];

const TYPES = [
  { label: "Restaurants & Bars", description: "From sports bars to fine dining. Put your matchday offer in front of fans who can not get a ticket but still want to be part of it." },
  { label: "Hotels", description: "Lobby screens, guest fan guides, hotel partner specials, and TROPTIONS TV distribution to your guests." },
  { label: "Sponsors", description: "QR engagement, fan rewards, TROPTIONS TV placement, charity campaigns, and verified proof reporting." },
  { label: "Charities", description: "Sponsor-funded badge drops. Every fan claim triggers a donation pledge. Community impact at event scale." },
  { label: "Local Businesses", description: "Any Atlanta business with a matchday story belongs in the network. We build the offer, you get the traffic." },
];

export default function PartnersPage() {
  return (
    <div className="min-h-screen bg-[#071426]">
      {/* Hero */}
      <section className="relative py-20 px-6 text-center bg-[#050f1e] border-b border-white/5 overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-transparent via-[#c99a3c] to-transparent" />
        <div className="max-w-4xl mx-auto">
          <p className="text-[#c99a3c] text-xs font-semibold uppercase tracking-[0.25em] mb-5">
            TROPTIONS Partner Network
          </p>
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
            The game is sold out.<br />The city is not.
          </h1>
          <p className="text-[#8a94a6] text-lg max-w-2xl mx-auto leading-relaxed mb-10">
            TROPTIONS puts your restaurant, hotel, or brand into the matchday network — QR offers, fan rewards, TROPTIONS TV exposure, and proof-backed campaign reporting.
          </p>
          <Link
            href="/worldcup/join"
            className="inline-block px-8 py-3.5 bg-[#c99a3c] text-[#071426] font-semibold text-sm uppercase tracking-wider hover:bg-[#f0cf82] transition-colors"
          >
            Join the Network — From $199
          </Link>
        </div>
      </section>

      {/* Who it is for */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <p className="text-[#c99a3c] text-xs font-semibold uppercase tracking-widest mb-4">
          Built For
        </p>
        <h2 className="text-3xl font-bold text-white mb-10">Every business with a matchday story.</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {TYPES.map((t) => (
            <div key={t.label} className="border border-white/10 bg-[#0b1f36] p-6">
              <h3 className="text-white font-bold text-lg mb-3">{t.label}</h3>
              <p className="text-[#8a94a6] text-sm leading-relaxed">{t.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Packages */}
      <section className="bg-[#050f1e] border-t border-white/5 py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <p className="text-[#c99a3c] text-xs font-semibold uppercase tracking-widest mb-4 text-center">
            Partner Packages
          </p>
          <h2 className="text-3xl font-bold text-white mb-4 text-center">
            Pick your activation level.
          </h2>
          <p className="text-[#8a94a6] text-center mb-12 max-w-xl mx-auto leading-relaxed">
            All packages include QR activation, fan-facing offer page, and proof reporting. No hidden fees.
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {PACKAGES.map((pkg) => (
              <PartnerPackageCard key={pkg.name} {...pkg} />
            ))}
          </div>
        </div>
      </section>

      {/* Proof pitch */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-[#c99a3c] text-xs font-semibold uppercase tracking-widest mb-4">
              TROPTIONS Proof
            </p>
            <h2 className="text-3xl font-bold text-white mb-5">
              Sponsors see data. Not just logos.
            </h2>
            <p className="text-[#8a94a6] leading-relaxed mb-8">
              Every TROPTIONS campaign delivers verified data: QR scans, offer redemptions, fan claims, charity impact, and local reach — through TROPTIONS Proof, the backend reporting layer for every partner and sponsor.
            </p>
            <Link
              href="/sports/proof"
              className="text-[#c99a3c] text-sm font-semibold uppercase tracking-wider hover:text-white transition-colors"
            >
              View Proof Dashboard
            </Link>
          </div>
          <div className="space-y-4">
            {[
              "Verified QR scan count per campaign",
              "Offer redemption receipts",
              "Fan claim and badge data",
              "TROPTIONS TV mention analytics",
              "Charity donation pledge totals",
              "Local commerce impact estimate",
            ].map((item) => (
              <div key={item} className="flex items-start gap-3">
                <span className="text-[#c99a3c] font-bold mt-0.5 shrink-0">+</span>
                <p className="text-[#8a94a6] text-sm">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#050f1e] border-t border-white/5 py-16 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-5">Ready to activate?</h2>
          <p className="text-[#8a94a6] mb-8 leading-relaxed">
            Get your restaurant, hotel, or brand listed in the TROPTIONS Atlanta Matchday Network. Starter packages activate within 24 hours.
          </p>
          <Link
            href="/worldcup/join"
            className="inline-block px-8 py-3.5 bg-[#c99a3c] text-[#071426] font-semibold text-sm uppercase tracking-wider hover:bg-[#f0cf82] transition-colors"
          >
            Join the Network — From $199
          </Link>
        </div>
      </section>
    </div>
  );
}
