import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "World Cup Activation | TROPTIONS Sports Network",
  description:
    "TROPTIONS Sports Network's major-event activation concept — blockchain-powered fan engagement, sponsor commerce, and proof-of-attendance for global football tournaments.",
};

// ─── Data ────────────────────────────────────────────────────────────────────

const VISION_CARDS = [
  {
    title: "Fan Wallet Activation",
    detail:
      "Every ticket holder receives a QR code at entry. Scan → wallet creation or import → receive event token. No prior crypto knowledge required.",
  },
  {
    title: "Sponsor Token Commerce",
    detail:
      "Official and independent sponsors launch branded SPL tokens redeemable at concessions, merchandise, and partner venues inside and outside the stadium.",
  },
  {
    title: "Merchant Settlement",
    detail:
      "Local merchants near the venue accept event tokens. On-chain settlement removes card processing fees for micro-transactions.",
  },
  {
    title: "Charity Transparency Layer",
    detail:
      "A portion of event token activity routes to a charity wallet. On-chain proof shows every donation — auditable by donors, media, and regulators.",
  },
  {
    title: "Proof-of-Attendance Drops",
    detail:
      "Fans who attend receive a non-transferable PoA token. Verifiable forever. Redeemable for future event perks, exclusive content, or loyalty rewards.",
  },
  {
    title: "Live Broadcast Integration",
    detail:
      "Spanish-language and English broadcast overlays display real-time fan engagement metrics, token claim counts, and charity totals.",
  },
  {
    title: "On-Chain Moment Drops",
    detail:
      "Key match moments — goals, saves, historic plays — are minted as limited digital collectibles claimable by fans who were on-chain during the event.",
  },
  {
    title: "Post-Event Proof Package",
    detail:
      "Sponsors and organizers receive a full on-chain proof report: fan counts, token volume, charity receipts, merchant settlements — all verifiable.",
  },
];

const MARKET_DATA = [
  { label: "FIFA World Cup 2026 Host Cities", value: "16", unit: "cities (US, Mexico, Canada)" },
  { label: "Expected Global Viewership", value: "5B+", unit: "viewers across all matches" },
  { label: "US Match Venues", value: "11", unit: "stadiums confirmed" },
  { label: "Atlanta-Area Events", value: "TBD", unit: "qualifying + fanfest potential" },
  { label: "Spanish-Speaking Fan Base (US)", value: "40M+", unit: "primary target audience" },
  { label: "Solana Transactions/Sec", value: "65K+", unit: "throughput for event-day load" },
];

const STAKEHOLDERS = [
  {
    group: "Fans",
    description: "Receive tokens, PoA drops, moment collectibles, and merchant discounts — with no crypto background required.",
    accent: "border-[#c99a3c]",
  },
  {
    group: "Sponsors",
    description: "Launch branded tokens with redemption mechanics, receive on-chain proof of fan engagement, and access post-event reporting dashboards.",
    accent: "border-blue-500",
  },
  {
    group: "Merchants",
    description: "Accept event tokens at the point of sale, settle on-chain, receive consolidated reports — no card processor required for token payments.",
    accent: "border-amber-500",
  },
  {
    group: "Charities",
    description: "Receive a transparent allocation of event token activity. All flows on-chain and publicly auditable. No intermediary holds funds.",
    accent: "border-emerald-500",
  },
  {
    group: "Broadcasters",
    description: "Access live on-chain data feeds for real-time fan engagement overlays, Spanish and English broadcast graphics, and social integration.",
    accent: "border-purple-500",
  },
  {
    group: "Organizers / Rights Holders",
    description: "Receive full proof packages, fan engagement analytics, sponsor settlement reports, and on-chain audit trails for regulatory disclosure.",
    accent: "border-rose-500",
  },
];

const PHASES = [
  {
    num: "01",
    phase: "Atlanta Pilot",
    timeline: "2025",
    description:
      "Launch event token infrastructure at Atlanta-area sporting events. Validate QR → wallet → token claim flow with real fans. Build proof package for World Cup pitch.",
    milestones: [
      "SPL event token deployed",
      "Merchant QR pilot at 2+ vendors",
      "Fan PoA drop executed",
      "Proof dashboard live",
    ],
  },
  {
    num: "02",
    phase: "Regional Expansion",
    timeline: "2025–2026",
    description:
      "Expand to additional US cities with significant Hispanic fan populations. Establish broadcast integration partnerships. Build sponsor package framework.",
    milestones: [
      "3+ city pilots",
      "Spanish-language onboarding UX",
      "Broadcast overlay integration",
      "First corporate sponsor signed",
    ],
  },
  {
    num: "03",
    phase: "World Cup 2026 Activation",
    timeline: "Summer 2026",
    description:
      "Deploy full multi-stakeholder event economy at World Cup host city events and fanfests. Sponsor tokens, merchant settlement, charity drops, broadcast integration.",
    milestones: [
      "Host city presence (1+ markets)",
      "10+ merchant partners",
      "Charity transparency layer live",
      "Post-event proof packages delivered",
    ],
  },
];

const INFRASTRUCTURE_STACK = [
  { layer: "Token Layer", tech: "Solana SPL", note: "Low-cost, fast settlement" },
  { layer: "Metadata + Storage", tech: "Metaplex + IPFS (Pinata)", note: "Permanent on-chain metadata" },
  { layer: "Wallet Onboarding", tech: "Non-custodial QR flow", note: "No prior crypto knowledge required" },
  { layer: "RPC / Throughput", tech: "Helius / QuickNode", note: "Event-day concurrency support" },
  { layer: "DEX Discovery", tech: "Jupiter / Raydium", note: "Post-event token liquidity" },
  { layer: "Proof Dashboard", tech: "Next.js + On-chain reads", note: "Live and post-event reporting" },
  { layer: "Broadcast Data", tech: "Webhook → graphics layer", note: "Spanish + English overlays" },
  { layer: "Launcher", tech: "FTHTrading/solana-launcher", note: "Open-source, auditable" },
];

// ─── Component ────────────────────────────────────────────────────────────────

function SectionHeader({ num, title }: { num: string; title: string }) {
  return (
    <div className="mb-8 flex items-baseline gap-4">
      <span className="text-xs font-mono text-[#c99a3c] tracking-[0.2em]">{num}</span>
      <h2 className="text-xl font-semibold text-white tracking-tight">{title}</h2>
    </div>
  );
}

export default function WorldCupPage() {
  return (
    <main className="min-h-screen bg-[#071426] text-white">
      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="border-b border-white/10">
        <div className="h-1 w-full bg-gradient-to-r from-[#c99a3c] via-amber-500 to-[#c99a3c]" />
        <div className="max-w-6xl mx-auto px-6 py-16">
          <div className="w-10 h-0.5 bg-[#c99a3c] mb-6" />
          <p className="text-xs font-mono text-[#c99a3c] tracking-widest mb-3">
            MAJOR EVENT ACTIVATION CONCEPT
          </p>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
            World Cup 2026
          </h1>
          <p className="text-[#8a94a6] max-w-2xl leading-relaxed mb-6">
            Blockchain-powered fan engagement, sponsor commerce, and proof-of-attendance 
            infrastructure for the world's largest sporting event. Built on Solana. 
            Designed for fans who have never touched crypto.
          </p>
          <p className="text-xs text-[#8a94a6] border border-white/10 px-4 py-3 max-w-2xl leading-relaxed mb-8">
            TROPTIONS Sports Network has no affiliation with FIFA, the World Cup organizing 
            committees, or any national football federation. This page describes an 
            independent activation concept. No official partnership is confirmed.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/sports/funding"
              className="bg-[#c99a3c] text-[#071426] text-sm font-semibold px-6 py-3 hover:bg-[#f0cf82] transition-colors"
            >
              Funding Memo
            </Link>
            <Link
              href="/sports/solana"
              className="border border-white/20 text-white text-sm font-semibold px-6 py-3 hover:bg-white/5 transition-colors"
            >
              Solana Infrastructure
            </Link>
            <Link
              href="/sports/proof"
              className="border border-white/20 text-white text-sm font-semibold px-6 py-3 hover:bg-white/5 transition-colors"
            >
              Live Proof
            </Link>
          </div>
        </div>
      </section>

      {/* ── Market Scale ─────────────────────────────────────── */}
      <section className="border-b border-white/10 bg-[#050f1e]">
        <div className="max-w-6xl mx-auto px-6 py-14">
          <SectionHeader num="01" title="Market Scale" />
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {MARKET_DATA.map((m) => (
              <div key={m.label} className="border border-white/10 bg-[#0b1f36] px-5 py-4">
                <div className="text-2xl font-bold text-[#c99a3c] mb-1">{m.value}</div>
                <div className="text-xs text-[#8a94a6] leading-snug mb-0.5">{m.label}</div>
                <div className="text-xs font-mono text-white/40">{m.unit}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Vision Cards ─────────────────────────────────────── */}
      <section className="border-b border-white/10">
        <div className="max-w-6xl mx-auto px-6 py-14">
          <SectionHeader num="02" title="What the Activation Delivers" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {VISION_CARDS.map((c) => (
              <div key={c.title} className="border border-[#c99a3c]/30 bg-[#0b1f36] px-5 py-5">
                <div className="text-sm font-semibold text-white mb-2">{c.title}</div>
                <p className="text-xs text-[#8a94a6] leading-relaxed">{c.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Stakeholders ─────────────────────────────────────── */}
      <section className="border-b border-white/10 bg-[#050f1e]">
        <div className="max-w-6xl mx-auto px-6 py-14">
          <SectionHeader num="03" title="Stakeholder Economy" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {STAKEHOLDERS.map((s) => (
              <div
                key={s.group}
                className={`border-l-2 ${s.accent} border-t border-r border-b border-white/10 bg-[#0b1f36] px-5 py-4`}
              >
                <div className="text-sm font-semibold text-white mb-2">{s.group}</div>
                <p className="text-xs text-[#8a94a6] leading-relaxed">{s.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Roadmap ──────────────────────────────────────────── */}
      <section className="border-b border-white/10">
        <div className="max-w-6xl mx-auto px-6 py-14">
          <SectionHeader num="04" title="Activation Roadmap" />
          <div className="space-y-6">
            {PHASES.map((p, i) => (
              <div key={p.num} className="border border-white/10 bg-[#0b1f36]">
                <div className="flex items-center gap-4 border-b border-white/10 px-6 py-4">
                  <span className="text-xs font-mono text-[#c99a3c] tracking-widest">{p.num}</span>
                  <h3 className="text-base font-semibold text-white">{p.phase}</h3>
                  <span className="ml-auto text-xs font-mono text-[#8a94a6]">{p.timeline}</span>
                </div>
                <div className="px-6 py-5 grid md:grid-cols-2 gap-6">
                  <p className="text-xs text-[#8a94a6] leading-relaxed">{p.description}</p>
                  <ul className="space-y-2">
                    {p.milestones.map((m) => (
                      <li key={m} className="flex items-start gap-2 text-xs text-[#8a94a6]">
                        <span className="text-[#c99a3c] mt-0.5">—</span>
                        {m}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Infrastructure Stack ─────────────────────────────── */}
      <section className="border-b border-white/10 bg-[#050f1e]">
        <div className="max-w-6xl mx-auto px-6 py-14">
          <SectionHeader num="05" title="Infrastructure Stack" />
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left text-xs font-mono text-[#c99a3c] tracking-widest py-3 pr-6">LAYER</th>
                  <th className="text-left text-xs font-mono text-[#c99a3c] tracking-widest py-3 pr-6">TECHNOLOGY</th>
                  <th className="text-left text-xs font-mono text-[#c99a3c] tracking-widest py-3">NOTE</th>
                </tr>
              </thead>
              <tbody>
                {INFRASTRUCTURE_STACK.map((row) => (
                  <tr key={row.layer} className="border-b border-white/5">
                    <td className="py-3 pr-6 text-xs font-semibold text-white">{row.layer}</td>
                    <td className="py-3 pr-6 text-xs font-mono text-[#c99a3c]">{row.tech}</td>
                    <td className="py-3 text-xs text-[#8a94a6]">{row.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ── Why Now ──────────────────────────────────────────── */}
      <section className="border-b border-white/10">
        <div className="max-w-6xl mx-auto px-6 py-14">
          <SectionHeader num="06" title="Why Now" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl">
            {[
              {
                title: "Solana Is Event-Ready",
                detail:
                  "65K+ TPS, sub-$0.01 transactions, mobile wallet ecosystem. The throughput exists for stadium-scale fan participation.",
              },
              {
                title: "World Cup 2026 Is 18 Months Away",
                detail:
                  "Infrastructure pilots need to begin now. The window to establish partnerships, run pilots, and build proof is 2025.",
              },
              {
                title: "Fan Expectations Are Shifting",
                detail:
                  "Digital ownership, loyalty tokens, and on-chain rewards are becoming standard. Sports is the largest untapped consumer crypto market.",
              },
            ].map((w) => (
              <div key={w.title} className="border border-white/10 bg-[#0b1f36] px-5 py-5">
                <div className="w-6 h-0.5 bg-[#c99a3c] mb-4" />
                <div className="text-sm font-semibold text-white mb-2">{w.title}</div>
                <p className="text-xs text-[#8a94a6] leading-relaxed">{w.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ─────────────────────────────────────────────── */}
      <section className="border-b border-white/10 bg-[#050f1e]">
        <div className="max-w-6xl mx-auto px-6 py-14">
          <div className="max-w-2xl">
            <div className="w-8 h-0.5 bg-[#c99a3c] mb-5" />
            <h2 className="text-xl font-semibold text-white mb-4">
              From Concept to Pilot
            </h2>
            <p className="text-[#8a94a6] text-sm leading-relaxed mb-8">
              The World Cup activation starts with Atlanta. Review the funding ask, 
              the team behind it, and the live proof already on-chain.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/sports/funding"
                className="bg-[#c99a3c] text-[#071426] text-sm font-semibold px-6 py-3 hover:bg-[#f0cf82] transition-colors"
              >
                Funding Memo
              </Link>
              <Link
                href="/sports/grants"
                className="bg-[#0b1f36] border border-[#c99a3c]/40 text-[#c99a3c] text-sm font-semibold px-6 py-3 hover:bg-[#c99a3c]/10 transition-colors"
              >
                Grant Pipeline
              </Link>
              <Link
                href="/sports/team"
                className="border border-white/20 text-white text-sm font-semibold px-6 py-3 hover:bg-white/5 transition-colors"
              >
                Team
              </Link>
              <Link
                href="/sports/partners"
                className="border border-white/20 text-white text-sm font-semibold px-6 py-3 hover:bg-white/5 transition-colors"
              >
                Partner Packages
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Disclaimer ───────────────────────────────────────── */}
      <section>
        <div className="max-w-6xl mx-auto px-6 py-10">
          <p className="text-xs text-[#8a94a6] leading-relaxed max-w-3xl">
            TROPTIONS Sports Network has no affiliation with FIFA, the 2026 FIFA World Cup 
            organizing committee, any national football federation, the US Soccer Federation, 
            Canadian Soccer Association, Federacion Mexicana de Futbol, or any official World 
            Cup venue operator. World Cup 2026 references describe an independent commercial 
            activation concept targeting public fan zones, local events, and approved merchant 
            areas — not official stadium operations. No broadcasting rights are claimed. 
            Broadcast integration references describe technical capability, not confirmed 
            broadcast partnerships. Nothing on this page constitutes an investment solicitation 
            or a guarantee of commercial outcomes.
          </p>
        </div>
      </section>
    </main>
  );
}
