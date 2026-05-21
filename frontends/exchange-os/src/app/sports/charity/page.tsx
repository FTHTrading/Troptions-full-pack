import type { Metadata } from "next";
import Link from "next/link";
import { CharityImpactCard } from "@/components/sports/CharityImpactCard";

export const metadata: Metadata = {
  title: "TROPTIONS Gives — Community Impact",
  description:
    "TROPTIONS supports local safety, youth sports, hospitality workers, and community nonprofit partners during major event weekends.",
};

const PARTNERS = [
  {
    name: "Youth Sports ATL",
    category: "Youth Programs",
    description: "Local youth sports programs receive sponsor-funded donations through TROPTIONS Gives badge drops. Fans claim free charity badges — sponsors pay per claim.",
    impact: "$1 per badge claim — sponsor funded",
  },
  {
    name: "Hospitality Workers Fund",
    category: "Worker Support",
    description: "A portion of major sponsor campaigns is directed to local hospitality worker support funds during the event window. Hotels and venues opt in during activation.",
    impact: "Campaign-funded contributions",
  },
  {
    name: "Community Safety Partners",
    category: "Community Safety",
    description: "Hotel and venue partners participate in community safety awareness programs. TROPTIONS coordinates with local nonprofits during major event periods.",
    impact: "Awareness + venue activation",
  },
  {
    name: "Local Food Banks",
    category: "Food Security",
    description: "Matchday meal bundles can include a charity round-up donation option. Optional and transparent — no pressure, just the option.",
    impact: "Fan-directed round-up donations",
  },
  {
    name: "Arts & Culture Grants",
    category: "Local Culture",
    description: "A portion of TROPTIONS Moments poster sales can be directed to local arts organizations. Atlanta artist editions benefit local culture programs.",
    impact: "Per-mint artist and charity share",
  },
  {
    name: "Small Business Recovery",
    category: "Economic",
    description: "TROPTIONS prioritizes small and local businesses over chain venues in the matchday network. Small merchant pricing reflects that commitment.",
    impact: "Subsidized access for small merchants",
  },
];

const DONATION_FLOWS = [
  {
    trigger: "Fan scans sponsor QR",
    action: "Sponsor donates $1 to local youth sports",
  },
  {
    trigger: "Fan redeems restaurant offer",
    action: "Optional charity round-up at checkout",
  },
  {
    trigger: "Watch-party sponsor activation",
    action: "Portion of campaign to local sports fund",
  },
  {
    trigger: "Hotel activation partnership",
    action: "Community safety org awareness + donation",
  },
  {
    trigger: "TROPTIONS Moments artist poster mint",
    action: "Portion of mint fee to local arts grant",
  },
];

export default function CharityPage() {
  return (
    <div className="min-h-screen bg-[#071426]">
      {/* Hero */}
      <section className="relative py-20 px-6 text-center bg-[#050f1e] border-b border-white/5 overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-transparent via-green-500/60 to-transparent" />
        <div className="max-w-4xl mx-auto">
          <p className="text-green-400 text-xs font-semibold uppercase tracking-[0.25em] mb-5">
            TROPTIONS Gives
          </p>
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
            Every major event should<br />leave local impact behind.
          </h1>
          <p className="text-[#8a94a6] text-lg max-w-2xl mx-auto leading-relaxed mb-10">
            TROPTIONS supports local safety, youth sports, hospitality workers, and community nonprofit partners during major event weekends — through sponsor-funded badge drops, fan round-ups, and merchant campaign contributions.
          </p>
          <Link
            href="/sports/moments"
            className="inline-block px-8 py-3.5 bg-green-500/80 text-white font-semibold text-sm uppercase tracking-wider hover:bg-green-400 transition-colors"
          >
            Claim a Charity Badge
          </Link>
        </div>
      </section>

      {/* How it works */}
      <section className="max-w-5xl mx-auto px-6 py-20">
        <p className="text-green-400 text-xs font-semibold uppercase tracking-widest mb-4">
          How TROPTIONS Gives Works
        </p>
        <h2 className="text-3xl font-bold text-white mb-10">Every trigger creates impact.</h2>
        <div className="space-y-4">
          {DONATION_FLOWS.map((f) => (
            <div
              key={f.trigger}
              className="grid grid-cols-1 md:grid-cols-2 gap-4 border border-white/5 bg-[#0b1f36] p-6"
            >
              <div>
                <p className="text-[#8a94a6] text-xs font-semibold uppercase tracking-widest mb-2">Trigger</p>
                <p className="text-white font-medium">{f.trigger}</p>
              </div>
              <div>
                <p className="text-green-400 text-xs font-semibold uppercase tracking-widest mb-2">Impact</p>
                <p className="text-white font-medium">{f.action}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Partners */}
      <section className="bg-[#050f1e] border-t border-white/5 py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <p className="text-green-400 text-xs font-semibold uppercase tracking-widest mb-4">
            Community Partners
          </p>
          <h2 className="text-3xl font-bold text-white mb-10">The organizations TROPTIONS Gives supports.</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {PARTNERS.map((p) => (
              <CharityImpactCard key={p.name} {...p} />
            ))}
          </div>
        </div>
      </section>

      {/* Sponsor a charity campaign */}
      <section className="max-w-5xl mx-auto px-6 py-20">
        <div className="border border-green-500/20 bg-green-950/10 p-12 text-center">
          <p className="text-green-400 text-xs font-semibold uppercase tracking-widest mb-4">
            Sponsor a Charity Drop
          </p>
          <h2 className="text-3xl font-bold text-white mb-5">
            Turn fan attention into local impact.
          </h2>
          <p className="text-[#8a94a6] max-w-2xl mx-auto mb-8 leading-relaxed">
            Sponsor a TROPTIONS Gives charity badge drop. Fans claim free badges — your brand sponsors the donation. 5,000 claims = 5,000 pledge dollars. You get a verified proof report.
          </p>
          <div className="grid md:grid-cols-3 gap-5 mb-10 text-left">
            {[
              { label: "Charity Badge Campaign", price: "$2,500", note: "Up to 2,500 fan claims. Sponsor donates $1 per claim." },
              { label: "Event Charity Campaign", price: "$5,000", note: "Up to 5,000 claims. Branded drop with proof report." },
              { label: "Season Charity Sponsor", price: "$25,000", note: "Full season. All matches. Named charity partner." },
            ].map((tier) => (
              <div key={tier.label} className="border border-green-500/20 p-5">
                <p className="text-green-400 text-xs font-semibold uppercase tracking-widest mb-2">{tier.label}</p>
                <p className="text-white text-2xl font-bold mb-2">{tier.price}</p>
                <p className="text-[#8a94a6] text-xs leading-relaxed">{tier.note}</p>
              </div>
            ))}
          </div>
          <Link
            href="/sports/partners"
            className="inline-block px-8 py-3.5 bg-green-500/80 text-white font-semibold text-sm uppercase tracking-wider hover:bg-green-400 transition-colors"
          >
            Contact the Partner Team
          </Link>
        </div>
      </section>

      {/* Legal note */}
      <section className="border-t border-white/5 py-8 px-6">
        <div className="max-w-4xl mx-auto">
          <p className="text-[#8a94a6] text-xs leading-relaxed">
            TROPTIONS handles charity campaigns responsibly. All donation pledge amounts are sponsor-funded commitments subject to campaign terms. TROPTIONS coordinates with nonprofit partners directly. Fan badges are digital collectibles and reward tokens — they are not investment products and do not represent financial instruments. Charity drops do not represent tax-deductible contributions by fans.
          </p>
        </div>
      </section>
    </div>
  );
}
