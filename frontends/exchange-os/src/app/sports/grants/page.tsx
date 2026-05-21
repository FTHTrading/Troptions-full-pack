import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Grant Targets | TROPTIONS Sports Network",
  description:
    "Active grant pipeline for the TROPTIONS Sports Network — blockchain sports media, Solana infrastructure, and fan engagement technology.",
};

// ─── Data ────────────────────────────────────────────────────────────────────

const GRANTS: {
  org: string;
  program: string;
  tier: string;
  range: string;
  focus: string;
  fit: string[];
  status: "drafting" | "ready" | "submitted" | "awarded" | "not-started";
  url: string;
  deadline: string;
  category: "solana" | "media" | "consumer" | "infrastructure";
}[] = [
  {
    org: "Solana Foundation",
    program: "Foundation Grant Program",
    tier: "Seed",
    range: "$25K – $75K",
    focus: "Public-good tooling, consumer onboarding, ecosystem growth",
    fit: [
      "SPL event token launcher (open-source templates)",
      "Non-technical fan wallet onboarding flow",
      "Proof-of-attendance infrastructure for major events",
      "QR-to-wallet UX for non-crypto sports audiences",
    ],
    status: "drafting",
    url: "https://solana.org/grants",
    deadline: "Rolling",
    category: "solana",
  },
  {
    org: "Colosseum",
    program: "Colosseum Accelerator",
    tier: "Accelerator",
    range: "$250K – $1M",
    focus: "Consumer crypto, DePIN, high-impact Solana applications",
    fit: [
      "Event token commerce at scale (fan + sponsor + merchant flows)",
      "On-chain proof of real-world event sponsorship",
      "Consumer-facing sports media with Solana settlement layer",
      "Multi-stakeholder event economy (charity, merchant, brand, fan)",
    ],
    status: "drafting",
    url: "https://www.colosseum.org/accelerator",
    deadline: "Cohort-based (check site)",
    category: "solana",
  },
  {
    org: "Superteam",
    program: "Superteam Grants",
    tier: "Micro / Builder",
    range: "$1K – $10K",
    focus: "Builders shipping on Solana, regional and vertical programs",
    fit: [
      "Sports media dApp prototype",
      "Event merchant QR + SPL token pilot",
      "Fan wallet onboarding UX documentation and template",
    ],
    status: "ready",
    url: "https://superteam.fun/grants",
    deadline: "Rolling",
    category: "solana",
  },
  {
    org: "Helius",
    program: "Builder Program",
    tier: "Infrastructure Partner",
    range: "RPC credits + co-marketing",
    focus: "Projects using Helius APIs at scale for consumer applications",
    fit: [
      "High-throughput event token reads (real-time fan leaderboards)",
      "Webhooks for on-chain event confirmation UX",
      "Token metadata enrichment for moment drops",
    ],
    status: "not-started",
    url: "https://www.helius.dev/",
    deadline: "Rolling",
    category: "infrastructure",
  },
  {
    org: "QuickNode",
    program: "QuickNode Grants",
    tier: "Infrastructure Partner",
    range: "Node credits + grant funding",
    focus: "Production Solana applications needing reliable RPC",
    fit: [
      "Event-day QR transaction throughput (1K+ fans concurrently)",
      "Redundant RPC for live-event uptime requirements",
    ],
    status: "not-started",
    url: "https://www.quicknode.com/grants",
    deadline: "Rolling",
    category: "infrastructure",
  },
  {
    org: "Pinata",
    program: "Pinata for Builders",
    tier: "Storage Partner",
    range: "IPFS storage credits",
    focus: "Projects using IPFS for NFT metadata, media, or documents",
    fit: [
      "Moment NFT metadata pinning (match highlights, fan captures)",
      "Proof-of-attendance certificate permanent storage",
      "Sponsor token artwork and campaign metadata",
    ],
    status: "not-started",
    url: "https://www.pinata.cloud/",
    deadline: "Rolling",
    category: "infrastructure",
  },
  {
    org: "Metaplex",
    program: "Metaplex Foundation Grants",
    tier: "Protocol Partner",
    range: "Varies",
    focus: "Applications advancing the Metaplex standard ecosystem",
    fit: [
      "Core NFT standard for proof-of-attendance drops",
      "Compressed NFT (cNFT) for high-volume fan moment minting",
      "Sponsor token collections using Metaplex collections standard",
    ],
    status: "not-started",
    url: "https://www.metaplex.com/",
    deadline: "Rolling",
    category: "solana",
  },
  {
    org: "Solana Mobile",
    program: "dApp Store Grants",
    tier: "Mobile Partner",
    range: "Listing + grant funding",
    focus: "Mobile-first Solana applications for the Saga / Chapter 2 devices",
    fit: [
      "Event QR scan → wallet sign native mobile flow",
      "Fan rewards push notifications via Solana Mobile Stack",
      "Offline-capable moment claim for low-connectivity event venues",
    ],
    status: "not-started",
    url: "https://solanamobile.com/",
    deadline: "Rolling",
    category: "consumer",
  },
  {
    org: "Raydium / Meteora / Jupiter",
    program: "Ecosystem Integration",
    tier: "DEX Partner",
    range: "Liquidity + co-marketing",
    focus: "Token projects with real utility listing on Solana DEXes",
    fit: [
      "Event token post-campaign liquidity bootstrapping",
      "Sponsor token DEX discovery via Jupiter aggregator",
      "Merchant token swaps for local commerce settlement",
    ],
    status: "not-started",
    url: "https://jup.ag/",
    deadline: "Rolling",
    category: "consumer",
  },
  {
    org: "Event Sponsors",
    program: "Direct Sponsorship",
    tier: "Corporate Partner",
    range: "$10K – $100K per event",
    focus: "Brand activation, fan engagement, on-site marketing ROI",
    fit: [
      "Branded sponsor token (fan loyalty + redemption rewards)",
      "On-site QR activation booths",
      "Live dashboard proof of fan engagement metrics",
      "Post-event reporting package (on-chain + analytics)",
    ],
    status: "not-started",
    url: "/sports/partners",
    deadline: "Event-by-event",
    category: "media",
  },
];

const STATUS_CONFIG: Record<
  (typeof GRANTS)[number]["status"],
  { label: string; color: string; dot: string }
> = {
  awarded:     { label: "Awarded",     color: "text-emerald-400", dot: "bg-emerald-400" },
  submitted:   { label: "Submitted",   color: "text-blue-400",    dot: "bg-blue-400"    },
  ready:       { label: "Ready to Send", color: "text-amber-400", dot: "bg-amber-400"   },
  drafting:    { label: "Drafting",    color: "text-purple-400",  dot: "bg-purple-400"  },
  "not-started": { label: "Not Started", color: "text-[#8a94a6]", dot: "bg-[#8a94a6]"  },
};

const CATEGORY_LABEL: Record<(typeof GRANTS)[number]["category"], string> = {
  solana:         "Solana Ecosystem",
  media:          "Media / Sponsor",
  consumer:       "Consumer / Mobile",
  infrastructure: "Infrastructure",
};

const SUMMARY_STATS = [
  { label: "Total Grants Identified", value: "10" },
  { label: "Drafting Now",            value: "2" },
  { label: "Ready to Submit",         value: "1" },
  { label: "Total Pipeline Value",    value: "$500K+" },
];

const PITCH_ELEMENTS = [
  {
    label: "Live Infrastructure",
    detail:
      "Event token launcher deployed, SPL creation tested, IPFS metadata pinning working.",
  },
  {
    label: "Open-Source Components",
    detail:
      "FTHTrading/solana-launcher is public. Templates, authority tools, and burn logic available to any event organizer.",
  },
  {
    label: "Real Event Context",
    detail:
      "Applications scoped to Atlanta-area events first — concrete geography, real fan audiences, measurable outcomes.",
  },
  {
    label: "Non-Custodial Architecture",
    detail:
      "No key custody. All signing is wallet-side. Platform never holds user funds or private keys.",
  },
  {
    label: "Disclosure-First Design",
    detail:
      "Every token page carries legal risk disclosure. No liquidity promises. No investment claims.",
  },
  {
    label: "Multi-Stakeholder Model",
    detail:
      "Fan + Sponsor + Merchant + Charity all participate in one event economy. Broader ecosystem value than fan-only models.",
  },
  {
    label: "Consumer Onboarding Focus",
    detail:
      "Designed for non-crypto sports audiences. QR → wallet → receive token. No prior blockchain experience required.",
  },
  {
    label: "Proof-of-Attendance Standard",
    detail:
      "On-chain PoA minting for live event participants. Verifiable, permanent, composable with other Solana apps.",
  },
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

function StatusBadge({ status }: { status: (typeof GRANTS)[number]["status"] }) {
  const cfg = STATUS_CONFIG[status];
  return (
    <span className={`flex items-center gap-1.5 text-xs font-mono ${cfg.color}`}>
      <span className={`inline-block w-1.5 h-1.5 ${cfg.dot}`} />
      {cfg.label}
    </span>
  );
}

export default function GrantsPage() {
  const byCategory = GRANTS.reduce<Record<string, typeof GRANTS>>((acc, g) => {
    const k = g.category;
    if (!acc[k]) acc[k] = [];
    acc[k].push(g);
    return acc;
  }, {});

  return (
    <main className="min-h-screen bg-[#071426] text-white">
      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="border-b border-white/10">
        <div className="max-w-6xl mx-auto px-6 py-16">
          <div className="w-10 h-0.5 bg-[#c99a3c] mb-6" />
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
            Grant Pipeline
          </h1>
          <p className="text-[#8a94a6] max-w-2xl leading-relaxed mb-8">
            Active and identified funding opportunities for the TROPTIONS Sports Network — 
            blockchain sports media infrastructure, Solana event token tooling, and 
            consumer fan engagement technology.
          </p>
          <p className="text-xs text-[#8a94a6] border border-white/10 px-4 py-3 max-w-2xl leading-relaxed">
            Grant targets are identified based on program fit. No grant awards are confirmed. 
            No affiliation with grant-issuing organizations is claimed. All figures are 
            program ranges, not guarantees.
          </p>
        </div>
      </section>

      {/* ── Summary Stats ────────────────────────────────────── */}
      <section className="border-b border-white/10 bg-[#050f1e]">
        <div className="max-w-6xl mx-auto px-6 py-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {SUMMARY_STATS.map((s) => (
              <div key={s.label} className="border border-white/10 bg-[#0b1f36] px-6 py-5">
                <div className="text-2xl font-bold text-[#c99a3c] mb-1">{s.value}</div>
                <div className="text-xs text-[#8a94a6] leading-snug">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Grant Cards by Category ──────────────────────────── */}
      {(["solana", "infrastructure", "consumer", "media"] as const).map((cat) => {
        const items = byCategory[cat];
        if (!items?.length) return null;
        return (
          <section key={cat} className="border-b border-white/10">
            <div className="max-w-6xl mx-auto px-6 py-14">
              <SectionHeader
                num={cat === "solana" ? "01" : cat === "infrastructure" ? "02" : cat === "consumer" ? "03" : "04"}
                title={CATEGORY_LABEL[cat]}
              />
              <div className="space-y-4">
                {items.map((g) => (
                  <div
                    key={g.org + g.program}
                    className="border border-white/10 bg-[#0b1f36] p-6"
                  >
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-5">
                      <div>
                        <div className="flex flex-wrap items-center gap-3 mb-1">
                          <h3 className="text-white font-semibold text-base">{g.org}</h3>
                          <span className="text-xs font-mono text-[#8a94a6] border border-white/10 px-2 py-0.5">
                            {g.tier}
                          </span>
                        </div>
                        <div className="text-sm text-[#8a94a6]">{g.program}</div>
                      </div>
                      <div className="flex flex-col items-start md:items-end gap-2">
                        <StatusBadge status={g.status} />
                        <span className="text-sm font-mono text-[#c99a3c]">{g.range}</span>
                        <span className="text-xs text-[#8a94a6]">Deadline: {g.deadline}</span>
                      </div>
                    </div>

                    <p className="text-xs text-[#8a94a6] mb-4 leading-relaxed border-l-2 border-white/10 pl-3">
                      Program focus: {g.focus}
                    </p>

                    <div className="mb-4">
                      <div className="text-xs font-mono text-[#c99a3c] tracking-widest mb-2">
                        WHY WE FIT
                      </div>
                      <ul className="space-y-1">
                        {g.fit.map((f) => (
                          <li key={f} className="flex items-start gap-2 text-xs text-[#8a94a6] leading-relaxed">
                            <span className="text-[#c99a3c] mt-0.5">—</span>
                            {f}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <a
                      href={g.url}
                      target={g.url.startsWith("http") ? "_blank" : undefined}
                      rel={g.url.startsWith("http") ? "noopener noreferrer" : undefined}
                      className="inline-block text-xs font-mono text-[#c99a3c] border border-[#c99a3c]/40 px-4 py-2 hover:bg-[#c99a3c]/10 transition-colors"
                    >
                      {g.url.startsWith("http") ? "Visit Program →" : "View Page →"}
                    </a>
                  </div>
                ))}
              </div>
            </div>
          </section>
        );
      })}

      {/* ── Pitch Strength ───────────────────────────────────── */}
      <section className="border-b border-white/10 bg-[#050f1e]">
        <div className="max-w-6xl mx-auto px-6 py-14">
          <SectionHeader num="05" title="Pitch Strength — What We Can Demonstrate Now" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {PITCH_ELEMENTS.map((p) => (
              <div key={p.label} className="border border-white/10 bg-[#0b1f36] px-5 py-4">
                <div className="text-sm font-semibold text-white mb-1">{p.label}</div>
                <p className="text-xs text-[#8a94a6] leading-relaxed">{p.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Application Checklist ────────────────────────────── */}
      <section className="border-b border-white/10">
        <div className="max-w-6xl mx-auto px-6 py-14">
          <SectionHeader num="06" title="Application Asset Checklist" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                category: "Documentation Ready",
                items: [
                  "Project overview (1-page)",
                  "Technical architecture diagram",
                  "Open-source repo links",
                  "Team bios + relevant experience",
                  "Legal disclaimer framework",
                ],
                ready: true,
              },
              {
                category: "In Preparation",
                items: [
                  "Grant narrative per program",
                  "Milestone + deliverable schedule",
                  "Budget breakdown per tier",
                  "KPI tracking framework",
                  "Event pilot proposal (Atlanta)",
                ],
                ready: false,
              },
              {
                category: "Live Proof Available",
                items: [
                  "solana-launcher GitHub repo",
                  "/sports/proof — on-chain links",
                  "SPL token creation demo",
                  "IPFS metadata examples",
                  "Fan onboarding flow screenshots",
                ],
                ready: true,
              },
            ].map((col) => (
              <div key={col.category} className="border border-white/10 bg-[#0b1f36] p-5">
                <div className="flex items-center gap-2 mb-4">
                  <span
                    className={`w-2 h-2 ${col.ready ? "bg-emerald-400" : "bg-amber-400"}`}
                  />
                  <span className="text-sm font-semibold text-white">{col.category}</span>
                </div>
                <ul className="space-y-2">
                  {col.items.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-xs text-[#8a94a6]">
                      <span className={col.ready ? "text-emerald-400" : "text-amber-400"}>
                        {col.ready ? "✓" : "○"}
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>
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
              Supporting the Application
            </h2>
            <p className="text-[#8a94a6] text-sm leading-relaxed mb-8">
              Review the technical infrastructure, team, and live proof before 
              drafting any application narrative.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/sports/solana"
                className="bg-purple-600 text-white text-sm font-semibold px-6 py-3 hover:bg-purple-500 transition-colors"
              >
                Solana Infrastructure
              </Link>
              <Link
                href="/sports/funding"
                className="bg-[#c99a3c] text-[#071426] text-sm font-semibold px-6 py-3 hover:bg-[#f0cf82] transition-colors"
              >
                Funding Memo
              </Link>
              <Link
                href="/sports/proof"
                className="border border-white/20 text-white text-sm font-semibold px-6 py-3 hover:bg-white/5 transition-colors"
              >
                Live Proof
              </Link>
              <Link
                href="/sports/team"
                className="border border-white/20 text-white text-sm font-semibold px-6 py-3 hover:bg-white/5 transition-colors"
              >
                Team
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer Disclaimer ────────────────────────────────── */}
      <section>
        <div className="max-w-6xl mx-auto px-6 py-10">
          <p className="text-xs text-[#8a94a6] leading-relaxed max-w-3xl">
            TROPTIONS Sports Network has no affiliation with or endorsement from the Solana Foundation, 
            Colosseum, Superteam, Helius, QuickNode, Pinata, Metaplex, Solana Mobile, Raydium, Meteora, 
            or Jupiter unless separately and explicitly contracted in writing. Grant program details, 
            ranges, and deadlines are sourced from public program pages and are subject to change. 
            No grant award is confirmed or guaranteed. This page is for internal planning and 
            informational purposes. Nothing on this page constitutes financial advice or a promise 
            of funding.
          </p>
        </div>
      </section>
    </main>
  );
}
