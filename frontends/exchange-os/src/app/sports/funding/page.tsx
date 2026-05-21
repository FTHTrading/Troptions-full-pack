import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Funding Memo — TROPTIONS Sports Network",
  description:
    "TROPTIONS Sports Network funding memo. Sports media, sponsor activation, merchant campaigns, charity impact, and Solana-powered digital moments — built for FIFA-scale event activations.",
};

// ── data ──────────────────────────────────────────────────────────────────

const WHAT_WE_BUILT = [
  {
    label: "TROPTIONS Sports Network",
    description:
      "Sports media brand, matchday activations, editorial content, fan campaigns, and event commerce coordination for major-event markets.",
  },
  {
    label: "TROPTIONS Television Network",
    description:
      "Owned broadcast layer — live matchday coverage, sponsor integrations, highlight programming, and fan-first content distribution.",
  },
  {
    label: "Moments + Claim System",
    description:
      "Digital moment creation, QR-code fan claim flows, on-chain proof, and collector badge infrastructure built on Solana.",
  },
  {
    label: "Sponsor + Merchant Layer",
    description:
      "Fan guide placements, event package tiers, local merchant campaigns, and sponsor activation reporting with on-chain receipts.",
  },
  {
    label: "Charity Impact Layer",
    description:
      "Structured charity campaigns tied to event activations — transparent impact reporting, donation receipts, community integration.",
  },
  {
    label: "Solana Event Token Launcher",
    description:
      "SPL token creation, digital moments minting, fan reward distribution, and wallet-native redemption — production-ready on Solana mainnet.",
  },
];

const SOLANA_REASONS = [
  { label: "Low-Cost Transactions", description: "Sub-cent transaction fees — practical for fan reward distribution at scale." },
  { label: "Fast Settlement", description: "400ms block time enables real-time redemption, claim, and proof at event venues." },
  { label: "Wallet-Native Rewards", description: "Phantom, Solflare, and mobile wallets create zero-friction fan reward flows." },
  { label: "SPL Token Creation", description: "Standard token infrastructure for event-specific reward tokens and fan currencies." },
  { label: "NFT / Digital Moments", description: "Metaplex-compatible digital collectibles — timestamped, verifiable, transferable." },
  { label: "On-Chain Receipts", description: "Every activation, mint, and claim is verifiable on-chain — proof-of-impact for sponsors." },
  { label: "Liquidity Discovery", description: "DEX-ready token infrastructure via Raydium, Meteora, and Jupiter for secondary discovery." },
  { label: "Mobile-First Fan Experience", description: "Solana Mobile Stack and wallet adapters designed for in-venue fan interaction." },
];

const FUNDING_MILESTONES = [
  {
    tier: "Tier 1",
    amount: "$25K Grant",
    label: "Event Launch Kit",
    accent: "border-[#c99a3c]/50",
    accentLabel: "text-[#c99a3c]",
    accentBar: "bg-[#c99a3c]",
    items: [
      "Event activation documentation package",
      "Solana program deployment on devnet",
      "Sponsor demo environment",
      "Disclosure and compliance templates",
      "Moments claim flow QR pilot",
      "Proof dashboard public launch",
    ],
  },
  {
    tier: "Tier 2",
    amount: "$75K–$150K Grant",
    label: "Production Hardening",
    accent: "border-blue-400/50",
    accentLabel: "text-blue-400",
    accentBar: "bg-blue-400",
    items: [
      "Production Solana mainnet integrations",
      "Independent security review",
      "Sponsor and merchant onboarding flows",
      "Stripe + on-chain hybrid checkout",
      "TROPTIONS Television production stack",
      "Analytics and impact reporting dashboards",
    ],
  },
  {
    tier: "Tier 3",
    amount: "$250K Accelerator / Pre-Seed",
    label: "Network Pilot",
    accent: "border-purple-400/50",
    accentLabel: "text-purple-400",
    accentBar: "bg-purple-400",
    items: [
      "Full event pilot — FIFA-scale activation market",
      "Staff core team (7–10 hires)",
      "Live sponsor campaign execution",
      "Local merchant network deployment",
      "Charity impact campaign at event",
      "TROPTIONS Television live broadcast pilot",
    ],
  },
];

const USE_OF_FUNDS = [
  { label: "Engineering", description: "Full-stack development, API hardening, infrastructure scaling, and system reliability." },
  { label: "Solana Integrations", description: "Mainnet program deployment, Metaplex, DEX liquidity setup, wallet adapter work." },
  { label: "Security + Compliance", description: "Independent smart contract review, disclosure framework, legal structuring." },
  { label: "Sponsor Sales", description: "Enterprise sponsor pitch materials, activation ROI frameworks, campaign tooling." },
  { label: "Media Production", description: "TROPTIONS Television content, matchday coverage, fan editorial, and social production." },
  { label: "Merchant Onboarding", description: "Local business campaigns, QR claim logistics, merchant dashboard, and support." },
  { label: "Event Pilot", description: "Live activation at a major-event market — execution, proof, and documentation." },
  { label: "Analytics + Proof", description: "Sponsor reporting, on-chain proof dashboards, impact metrics, and audit logs." },
];

const GRANT_TARGETS = [
  { label: "Solana Foundation", description: "Core ecosystem grants program — infrastructure, tooling, and developer grants." },
  { label: "Colosseum", description: "Hackathon and accelerator program for Solana builders with real traction." },
  { label: "Superteam", description: "Solana ecosystem builder community — grants, connections, and regional chapters." },
  { label: "Solana Mobile", description: "Mobile-first fan experience aligns directly with Solana Mobile's ecosystem mission." },
  { label: "Helius / QuickNode", description: "RPC infrastructure credits and developer program partnerships." },
  { label: "Pinata / IPFS", description: "NFT metadata and digital moment storage infrastructure credits." },
  { label: "Metaplex", description: "Digital moments minting and NFT infrastructure alignment." },
  { label: "Raydium / Meteora / Jupiter", description: "DEX liquidity and token discovery integration ecosystem grants." },
  { label: "Event Sponsors", description: "Brand activation budgets from enterprise sponsors entering major-event markets." },
  { label: "Local Merchant Groups", description: "Merchant cooperative sponsorships from business networks adjacent to major events." },
];

const CURRENT_PROOF = [
  { label: "/sports", href: "/sports", description: "Live sports landing page — network overview and CTA layer." },
  { label: "/sports/team", href: "/sports/team", description: "Professional org page — 5 groups, 30 roles, 6-layer operating model." },
  { label: "/sports/tv", href: "/sports/tv", description: "TROPTIONS Television Network broadcast layer." },
  { label: "/sports/fans", href: "/sports/fans", description: "Fan guide — matchday, moments, rewards, and merchant offers." },
  { label: "/sports/partners", href: "/sports/partners", description: "Sponsor and merchant package tiers with activation spec." },
  { label: "/sports/charity", href: "/sports/charity", description: "TROPTIONS Gives — charity campaign integration." },
  { label: "/sports/proof", href: "/sports/proof", description: "Public proof dashboard — on-chain receipts and impact metrics." },
  { label: "/sports/moments", href: "/sports/moments", description: "Digital moments landing — collector drops and fan badges." },
  { label: "/sports/claim", href: "/sports/claim", description: "QR-code fan claim flow — venue-ready." },
  { label: "/sports/mint", href: "/sports/mint", description: "Solana mint interface — production-ready, demo-safe fallback." },
  { label: "Moments API", href: "/sports/proof", description: "4 production API routes — create, get, claim, proof summary." },
  { label: "FTHTrading/solana-launcher", href: "/sports/mint", description: "Solana Launcher GitHub repo — SPL token creation infrastructure." },
  { label: "Cloudflare + PM2 Infrastructure", href: "/sports/proof", description: "35 hostnames live via fth-hub tunnel, PM2-managed, public-facing." },
];

// ── components ─────────────────────────────────────────────────────────────

function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`border border-white/10 bg-[#0b1f36] p-6 ${className}`}>
      {children}
    </div>
  );
}

function SectionLabel({ text }: { text: string }) {
  return (
    <p className="text-[#c99a3c] text-[10px] font-semibold uppercase tracking-[0.3em] mb-2">
      {text}
    </p>
  );
}

// ── page ───────────────────────────────────────────────────────────────────

export default function FundingPage() {
  return (
    <div className="min-h-screen bg-[#071426]">

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="relative bg-[#050f1e] border-b border-white/5 overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-transparent via-[#c99a3c] to-transparent" />
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "repeating-linear-gradient(0deg,#fff 0,#fff 1px,transparent 1px,transparent 60px),repeating-linear-gradient(90deg,#fff 0,#fff 1px,transparent 1px,transparent 60px)",
          }}
        />
        <div className="relative max-w-6xl mx-auto px-6 py-24 md:py-32">
          <p className="text-[#c99a3c] text-[10px] font-semibold uppercase tracking-[0.3em] mb-6">
            TROPTIONS Sports Network — Funding Memo
          </p>
          <h1 className="text-4xl md:text-6xl font-black text-white leading-[1.05] max-w-4xl mb-6">
            Funding the Event Commerce Network
          </h1>
          <p className="text-[#8a94a6] text-lg max-w-3xl leading-relaxed mb-8">
            TROPTIONS combines sports media, sponsor activation, local merchant campaigns, charity impact, and Solana-powered digital moments into one major-event operating layer.
          </p>
          <div className="inline-block border border-white/10 bg-[#0b1f36] px-4 py-3 text-xs text-[#8a94a6] max-w-2xl leading-relaxed">
            Built for FIFA-scale and World Cup-style event activations. No official FIFA, ESPN, Octagon, or Solana Foundation affiliation is claimed unless separately contracted. No token appreciation, investment return, or guaranteed liquidity is promised.
          </div>
        </div>
      </section>

      {/* ── What We Built ────────────────────────────────────────────────── */}
      <section className="border-b border-white/5 py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="mb-12 border-l-2 border-l-[#c99a3c] pl-5">
            <SectionLabel text="01 — What We Built" />
            <h2 className="text-2xl font-bold text-white mb-2">Six Integrated Systems</h2>
            <p className="text-[#8a94a6] text-sm leading-relaxed max-w-2xl">
              TROPTIONS is not a single product. It is an operating stack — each layer connects to the others and compounds value at events.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {WHAT_WE_BUILT.map((item) => (
              <Card key={item.label} className="hover:border-white/20 transition-colors duration-200">
                <div className="h-[2px] w-8 bg-[#c99a3c] mb-4" />
                <h3 className="text-white font-semibold text-sm mb-2">{item.label}</h3>
                <p className="text-[#8a94a6] text-xs leading-relaxed">{item.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ── Why This Matters ─────────────────────────────────────────────── */}
      <section className="border-b border-white/5 py-20 px-6 bg-[#050f1e]">
        <div className="max-w-6xl mx-auto">
          <div className="mb-12 border-l-2 border-l-[#c99a3c] pl-5">
            <SectionLabel text="02 — The Problem" />
            <h2 className="text-2xl font-bold text-white mb-2">Why This Matters</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-12 items-start">
            <div>
              <p className="text-[#8a94a6] text-sm leading-relaxed mb-6">
                Major events already have fans, sponsors, restaurants, hotels, charities, media, and local traffic. The commercial activity is real and massive. But the commercial infrastructure is fragmented — sponsors cannot measure activation ROI, merchants cannot capture event-adjacent fan spend, charities cannot reach fans in-venue, and media cannot monetize fan culture directly.
              </p>
              <p className="text-[#8a94a6] text-sm leading-relaxed mb-6">
                TROPTIONS connects them. One operating layer across sponsor activation, merchant offers, charity campaigns, fan rewards, digital moments, and broadcast media. Every action is measurable, every result is provable on-chain.
              </p>
              <p className="text-[#8a94a6] text-sm leading-relaxed">
                The same infrastructure runs at every major event market — World Cup, Copa America, Champions League finals, Olympics, Super Bowl. The network compounds as more events run. The tooling, templates, and proof are built.
              </p>
            </div>
            <div className="flex flex-col gap-4">
              {[
                ["Sponsors", "Cannot measure activation ROI beyond impressions"],
                ["Merchants", "Cannot capture event-adjacent fan spend without infrastructure"],
                ["Charities", "Cannot reach event fans without an integration layer"],
                ["Media", "Cannot monetize fan culture directly — no direct commerce layer"],
                ["Fans", "No unified reward, claim, or collectible experience across the event"],
                ["Organizers", "No single proof layer for sponsor, charity, and merchant commitments"],
              ].map(([actor, problem]) => (
                <div key={actor} className="flex gap-4 items-start border border-white/5 bg-[#0b1f36] p-4">
                  <span className="shrink-0 text-[#c99a3c] font-bold text-xs uppercase tracking-wider w-20">{actor}</span>
                  <span className="text-[#8a94a6] text-xs leading-relaxed">{problem}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Why Solana ───────────────────────────────────────────────────── */}
      <section className="border-b border-white/5 py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="mb-12 border-l-2 border-l-purple-400 pl-5">
            <SectionLabel text="03 — Infrastructure Choice" />
            <h2 className="text-2xl font-bold text-white mb-2">Why Solana</h2>
            <p className="text-[#8a94a6] text-sm leading-relaxed max-w-2xl">
              Event commerce requires fast, cheap, mobile-first blockchain infrastructure. Solana is the only chain that meets all four requirements at event scale.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {SOLANA_REASONS.map((item) => (
              <div
                key={item.label}
                className="border border-purple-400/20 bg-[#0b1f36] p-5 hover:border-purple-400/40 transition-colors duration-200"
              >
                <div className="h-[2px] w-6 bg-purple-400 mb-3" />
                <h3 className="text-white font-semibold text-xs mb-2 leading-snug">{item.label}</h3>
                <p className="text-[#8a94a6] text-[11px] leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Funding Milestones ───────────────────────────────────────────── */}
      <section className="border-b border-white/5 py-20 px-6 bg-[#050f1e]">
        <div className="max-w-6xl mx-auto">
          <div className="mb-12 border-l-2 border-l-[#c99a3c] pl-5">
            <SectionLabel text="04 — Funding Milestones" />
            <h2 className="text-2xl font-bold text-white mb-2">Three Tiers</h2>
            <p className="text-[#8a94a6] text-sm leading-relaxed max-w-2xl">
              Each tier represents a complete deliverable set — independently fundable, independently valuable.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {FUNDING_MILESTONES.map((tier) => (
              <div key={tier.tier} className={`border ${tier.accent} bg-[#0b1f36] flex flex-col overflow-hidden`}>
                <div className={`h-[3px] ${tier.accentBar}`} />
                <div className="p-6 flex-1 flex flex-col gap-4">
                  <div>
                    <p className={`text-[10px] font-semibold uppercase tracking-widest mb-1 ${tier.accentLabel}`}>
                      {tier.tier}
                    </p>
                    <p className="text-white font-black text-xl">{tier.amount}</p>
                    <p className="text-[#8a94a6] text-xs mt-1">{tier.label}</p>
                  </div>
                  <ul className="flex flex-col gap-2 flex-1">
                    {tier.items.map((item) => (
                      <li key={item} className="flex items-start gap-2">
                        <span className={`mt-1 shrink-0 w-1.5 h-1.5 rounded-full ${tier.accentBar}`} />
                        <span className="text-[#8a94a6] text-xs leading-relaxed">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Use of Funds ─────────────────────────────────────────────────── */}
      <section className="border-b border-white/5 py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="mb-12 border-l-2 border-l-[#c99a3c] pl-5">
            <SectionLabel text="05 — Allocation" />
            <h2 className="text-2xl font-bold text-white mb-2">Use of Funds</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {USE_OF_FUNDS.map((item) => (
              <Card key={item.label} className="hover:border-white/20 transition-colors duration-200">
                <h3 className="text-white font-semibold text-sm mb-2">{item.label}</h3>
                <p className="text-[#8a94a6] text-xs leading-relaxed">{item.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ── Grant Targets ────────────────────────────────────────────────── */}
      <section className="border-b border-white/5 py-20 px-6 bg-[#050f1e]">
        <div className="max-w-6xl mx-auto">
          <div className="mb-12 border-l-2 border-l-[#c99a3c] pl-5">
            <SectionLabel text="06 — Targets" />
            <h2 className="text-2xl font-bold text-white mb-2">Grant + Partnership Targets</h2>
            <p className="text-[#8a94a6] text-sm leading-relaxed max-w-2xl">
              Outreach is underway or planned for each of the following. All relationships are independent commercial partnerships — no affiliation is implied.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-4">
            {GRANT_TARGETS.map((item) => (
              <div
                key={item.label}
                className="border border-white/10 bg-[#0b1f36] p-5 hover:border-[#c99a3c]/30 transition-colors duration-200"
              >
                <p className="text-white font-semibold text-xs mb-1.5">{item.label}</p>
                <p className="text-[#8a94a6] text-[11px] leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Current Proof ────────────────────────────────────────────────── */}
      <section className="border-b border-white/5 py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="mb-12 border-l-2 border-l-green-400 pl-5">
            <SectionLabel text="07 — Proof of Work" />
            <h2 className="text-2xl font-bold text-white mb-2">Current Build — Live</h2>
            <p className="text-[#8a94a6] text-sm leading-relaxed max-w-2xl">
              This is not a whitepaper. The following routes and systems are live and publicly accessible.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
            {CURRENT_PROOF.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="flex items-start gap-3 border border-white/10 bg-[#0b1f36] p-4 hover:border-green-400/30 transition-colors duration-200 group"
              >
                <span className="mt-1 shrink-0 w-2 h-2 rounded-full bg-green-400" />
                <div>
                  <p className="text-white font-semibold text-xs mb-1 group-hover:text-green-400 transition-colors duration-200">
                    {item.label}
                  </p>
                  <p className="text-[#8a94a6] text-[11px] leading-relaxed">{item.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Strategic Ask ────────────────────────────────────────────────── */}
      <section className="border-b border-white/5 py-20 px-6 bg-[#050f1e]">
        <div className="max-w-6xl mx-auto">
          <div className="mb-10 border-l-2 border-l-[#c99a3c] pl-5">
            <SectionLabel text="08 — Strategic Ask" />
            <h2 className="text-2xl font-bold text-white mb-2">What We Are Looking For</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-12 items-start">
            <p className="text-[#8a94a6] text-sm leading-relaxed">
              We are seeking grant funding, accelerator consideration, infrastructure credits, sponsor pilot funding, technical review, and ecosystem introductions. Specifically, we are looking for partners who see the commercial value of connecting major-event fan traffic to a measurable, on-chain commerce layer — and who want provable proof of impact, not just media impressions.
            </p>
            <div className="grid grid-cols-2 gap-3">
              {[
                "Grant Funding",
                "Accelerator Consideration",
                "Infrastructure Credits",
                "Sponsor Pilot Funding",
                "Technical Review",
                "Ecosystem Introductions",
              ].map((ask) => (
                <div
                  key={ask}
                  className="border border-[#c99a3c]/30 bg-[#0b1f36] px-4 py-3 text-xs text-[#c99a3c] font-medium"
                >
                  {ask}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────────────── */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-[#c99a3c] text-[10px] font-semibold uppercase tracking-[0.3em] mb-5">
            TROPTIONS Sports Network
          </p>
          <h2 className="text-4xl md:text-5xl font-black text-white mb-6 leading-tight">
            The build is done.<br />The pilot is next.
          </h2>
          <p className="text-[#8a94a6] text-base max-w-2xl mx-auto leading-relaxed mb-10">
            Review the team, proof, and partner options. If you are a grant program, sponsor, accelerator, or infrastructure partner aligned with major-event commerce, reach out.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center flex-wrap">
            <Link
              href="/sports/team"
              className="px-8 py-3.5 bg-[#c99a3c] text-[#071426] font-semibold text-sm uppercase tracking-wider hover:bg-[#f0cf82] transition-colors"
            >
              View Team
            </Link>
            <Link
              href="/sports/proof"
              className="px-8 py-3.5 border border-[#c99a3c]/40 text-[#c99a3c] font-semibold text-sm uppercase tracking-wider hover:border-[#c99a3c] transition-colors"
            >
              View Sports Proof
            </Link>
            <Link
              href="/sports/partners"
              className="px-8 py-3.5 border border-white/20 text-[#8a94a6] font-semibold text-sm uppercase tracking-wider hover:border-white/40 hover:text-white transition-colors"
            >
              Partner With TROPTIONS
            </Link>
            <Link
              href="/sports/moments"
              className="px-8 py-3.5 border border-white/20 text-[#8a94a6] font-semibold text-sm uppercase tracking-wider hover:border-white/40 hover:text-white transition-colors"
            >
              View Moments
            </Link>
          </div>
        </div>
      </section>

      {/* ── Footer disclaimer ────────────────────────────────────────────── */}
      <div className="border-t border-white/5 bg-[#050f1e] py-8 px-6">
        <div className="max-w-6xl mx-auto">
          <p className="text-[#8a94a6] text-xs leading-relaxed max-w-4xl">
            TROPTIONS Sports Network is an independent sports media, event commerce, and fan technology company. It is not affiliated with, endorsed by, or a partner of FIFA, the FIFA World Cup, ESPN, Fox Sports, Telemundo, Octagon, CAA Sports, the Solana Foundation, or any official tournament broadcaster or sanctioning body unless separately disclosed. Nothing on this page constitutes an offer of securities, investment advice, or a promise of financial return. Digital moments and fan reward tokens are fan-engagement instruments, not investment products.
          </p>
        </div>
      </div>

    </div>
  );
}
