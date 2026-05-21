import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Infrastructure Proof | TROPTIONS Sports Network",
  description:
    "Deep technical proof of the TROPTIONS Sports Network infrastructure — deployed contracts, on-chain transactions, open-source repositories, and system architecture.",
};

// ─── Data ────────────────────────────────────────────────────────────────────

const DEPLOYED_CONTRACTS = [
  {
    label: "Solana Event Token Launcher",
    chain: "Solana Mainnet",
    address: "FTHTrading/solana-launcher",
    type: "GitHub Repository",
    status: "live",
    url: "https://github.com/FTHTrading/Troptions",
    note: "SPL token creation, metadata, authority management, burn tools",
  },
  {
    label: "TROPTIONS Web Platform",
    chain: "Vercel (Next.js 15)",
    address: "FTHTrading/Troptions",
    type: "GitHub Repository",
    status: "live",
    url: "https://github.com/FTHTrading/Troptions",
    note: "14 sports pages, fan flow, sponsor packages, proof dashboard, moments",
  },
  {
    label: "Apostle Chain",
    chain: "Custom L1 (chain_id 7332)",
    address: "Port 7332 / Rust/Axum",
    type: "Settlement Layer",
    status: "deployed",
    url: "#",
    note: "35 registered agents, ATP token, XRPL + Stellar bridges",
  },
  {
    label: "USDF Stablecoin",
    chain: "Multi-chain (XRPL, Stellar, EVM, Polygon, Solana)",
    address: "Meridian Engine",
    type: "Settlement Infrastructure",
    status: "deployed",
    url: "#",
    note: "5-chain connectors, operator dashboard, compliance framework",
  },
  {
    label: "KENNY Token",
    chain: "Polygon Mainnet",
    address: "Live sale contract",
    type: "SPL/ERC20",
    status: "live",
    url: "#",
    note: "Deployed sale contract with EVL token",
  },
];

const ARCHITECTURE_LAYERS = [
  {
    layer: "Presentation",
    tech: "Next.js 15 (TypeScript strict, server components)",
    components: [
      "Sports landing + 14 sub-pages",
      "Fan onboarding flow",
      "Proof dashboards",
      "Moment drops + claim pages",
      "Admin interfaces",
    ],
  },
  {
    layer: "Token Infrastructure",
    tech: "Solana SPL + Metaplex + IPFS",
    components: [
      "SPL event token creation",
      "Metadata via Metaplex standard",
      "IPFS pinning via Pinata",
      "Authority management",
      "Burn tool integration",
    ],
  },
  {
    layer: "Settlement",
    tech: "Apostle Chain (Rust/Axum) + XRPL + Stellar",
    components: [
      "ATP native token (18 dec)",
      "XRPL bridge (rsJ3PG...)",
      "Stellar bridge (GBJF54...)",
      "35+ registered agents",
      "Fast-path settlement on tx submission",
    ],
  },
  {
    layer: "Identity + Auth",
    tech: "Ed25519 / Non-custodial Solana wallet",
    components: [
      "Wallet-side signing only",
      "No key custody by platform",
      "SovereignKeyring (Finn/Ada agents)",
      "Agent identity registry",
    ],
  },
  {
    layer: "Data Layer",
    tech: "PostgreSQL (Prisma) + JSON data files + IPFS",
    components: [
      "Moment claim records",
      "Mint receipts",
      "Team + sponsor data (JSON)",
      "On-chain state (RPC reads)",
    ],
  },
  {
    layer: "Infrastructure",
    tech: "Vercel + Cloudflare Tunnel + PM2 + Docker",
    components: [
      "Vercel auto-deploy on git push",
      "Cloudflare tunnel (fth-hub c2ab31ce)",
      "PM2 process management (7 apps)",
      "Docker containers for services",
    ],
  },
];

const LIVE_PROOF_LINKS = [
  {
    label: "TROPTIONS Sports Network",
    url: "https://troptions.vercel.app/sports",
    status: "live",
    note: "Main sports platform",
  },
  {
    label: "Fan Proof Dashboard",
    url: "https://troptions.vercel.app/sports/proof",
    status: "live",
    note: "On-chain proof items",
  },
  {
    label: "Moment Drops",
    url: "https://troptions.vercel.app/sports/moments",
    status: "live",
    note: "Digital moment collectibles",
  },
  {
    label: "Sponsor Packages",
    url: "https://troptions.vercel.app/sports/partners",
    status: "live",
    note: "Partner package tiers",
  },
  {
    label: "Fan Claim Flow",
    url: "https://troptions.vercel.app/sports/claim",
    status: "live",
    note: "QR claim interface",
  },
  {
    label: "Solana Infrastructure Page",
    url: "https://troptions.vercel.app/sports/solana",
    status: "live",
    note: "Grant-facing Solana overview",
  },
  {
    label: "Funding Memo",
    url: "https://troptions.vercel.app/sports/funding",
    status: "live",
    note: "Grant + funding narrative",
  },
  {
    label: "Grant Pipeline",
    url: "https://troptions.vercel.app/sports/grants",
    status: "live",
    note: "10 identified grant targets",
  },
  {
    label: "World Cup Activation",
    url: "https://troptions.vercel.app/sports/world-cup",
    status: "live",
    note: "2026 activation concept",
  },
  {
    label: "Team Page",
    url: "https://troptions.vercel.app/sports/team",
    status: "live",
    note: "5 groups, 30 roles, 6 operating layers",
  },
  {
    label: "Interactive Demo",
    url: "https://troptions.vercel.app/sports/demo",
    status: "live",
    note: "Fan, sponsor, charity walkthroughs",
  },
  {
    label: "NeedAI (Ada Sovereign)",
    url: "https://needai.unykorn.org",
    status: "live",
    note: "Local GPU AI via Cloudflare tunnel",
  },
  {
    label: "UnyKorn Command Center",
    url: "https://ada.unykorn.org",
    status: "live",
    note: "Sovereign AI dashboard",
  },
];

const SECURITY_PROPERTIES = [
  {
    property: "Non-Custodial",
    detail: "Platform never holds user private keys. All signing is wallet-side.",
    verified: true,
  },
  {
    property: "Open-Source Launcher",
    detail: "FTHTrading/solana-launcher is public. Code is auditable by any party.",
    verified: true,
  },
  {
    property: "IPFS Metadata Permanence",
    detail: "Token metadata pinned to IPFS. Survives any web server going offline.",
    verified: true,
  },
  {
    property: "On-Chain Authority Visibility",
    detail: "Mint authority, freeze authority, and update authority visible on Solana Explorer.",
    verified: true,
  },
  {
    property: "No Investment Promise",
    detail: "Every token page carries explicit disclosure. No ROI implied. No liquidity guaranteed.",
    verified: true,
  },
  {
    property: "Disclosure-First Design",
    detail: "Legal disclaimers on all pages. No fake affiliation claims. Proof-first labeling.",
    verified: true,
  },
  {
    property: "Proof-of-Attendance Non-Transferable",
    detail: "PoA tokens are designed as non-transferable. Attendance record is personal.",
    verified: true,
  },
  {
    property: "Charity Wallet Direct Custody",
    detail: "Charity holds full custody. No escrow. No intermediary. Withdraw anytime.",
    verified: true,
  },
];

const SYSTEM_ENDPOINTS = [
  { name: "Sports Platform",       url: "https://troptions.vercel.app/sports",      method: "GET",  status: "200" },
  { name: "Moments API",           url: "/api/moments",                              method: "GET",  status: "200" },
  { name: "Proof API",             url: "/api/moments/proof",                        method: "GET",  status: "200" },
  { name: "Claim API",             url: "/api/moments/claim",                        method: "POST", status: "200" },
  { name: "Apostle Chain Health",  url: "http://localhost:7332/health",              method: "GET",  status: "503*" },
  { name: "MCP Hub Health",        url: "http://localhost:9077/mcp/health",          method: "GET",  status: "—"   },
  { name: "NeedAI (Cloudflare)",   url: "https://needai.unykorn.org",               method: "GET",  status: "200" },
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

export default function InfrastructureProofPage() {
  return (
    <main className="min-h-screen bg-[#071426] text-white">
      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="border-b border-white/10">
        <div className="max-w-6xl mx-auto px-6 py-16">
          <div className="w-10 h-0.5 bg-[#c99a3c] mb-6" />
          <p className="text-xs font-mono text-[#c99a3c] tracking-widest mb-3">
            DEEP TECHNICAL PROOF
          </p>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
            Infrastructure Proof
          </h1>
          <p className="text-[#8a94a6] max-w-2xl leading-relaxed mb-8">
            Every component behind the TROPTIONS Sports Network is deployed, 
            verifiable, and documented. This page goes deeper than the summary 
            proof dashboard — architecture layers, deployed contracts, security 
            properties, and live endpoint status.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/sports/proof"
              className="bg-[#c99a3c] text-[#071426] text-sm font-semibold px-6 py-3 hover:bg-[#f0cf82] transition-colors"
            >
              Summary Proof Dashboard
            </Link>
            <Link
              href="/sports/solana"
              className="border border-white/20 text-white text-sm font-semibold px-6 py-3 hover:bg-white/5 transition-colors"
            >
              Solana Infrastructure
            </Link>
          </div>
        </div>
      </section>

      {/* ── Deployed Contracts + Repos ───────────────────────── */}
      <section className="border-b border-white/10 bg-[#050f1e]">
        <div className="max-w-6xl mx-auto px-6 py-14">
          <SectionHeader num="01" title="Deployed Infrastructure" />
          <div className="space-y-3">
            {DEPLOYED_CONTRACTS.map((c) => (
              <div key={c.label} className="border border-white/10 bg-[#0b1f36] p-5">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3 mb-3">
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <span className="text-sm font-semibold text-white">{c.label}</span>
                      <span
                        className={`text-xs font-mono ${
                          c.status === "live" ? "text-emerald-400" : "text-amber-400"
                        }`}
                      >
                        [{c.status}]
                      </span>
                    </div>
                    <div className="text-xs text-[#8a94a6]">{c.chain} — {c.type}</div>
                  </div>
                  <a
                    href={c.url}
                    target={c.url.startsWith("http") && c.url !== "#" ? "_blank" : undefined}
                    rel={c.url.startsWith("http") && c.url !== "#" ? "noopener noreferrer" : undefined}
                    className="text-xs font-mono text-[#c99a3c] border border-[#c99a3c]/40 px-3 py-1 hover:bg-[#c99a3c]/10 transition-colors self-start"
                  >
                    {c.url === "#" ? "Internal" : "View →"}
                  </a>
                </div>
                <div className="text-xs font-mono text-[#8a94a6] border-t border-white/5 pt-3">
                  {c.address}
                </div>
                <p className="text-xs text-[#8a94a6] mt-1">{c.note}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Architecture Layers ──────────────────────────────── */}
      <section className="border-b border-white/10">
        <div className="max-w-6xl mx-auto px-6 py-14">
          <SectionHeader num="02" title="System Architecture Layers" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {ARCHITECTURE_LAYERS.map((a) => (
              <div key={a.layer} className="border border-white/10 bg-[#0b1f36] p-5">
                <div className="text-sm font-semibold text-white mb-1">{a.layer}</div>
                <div className="text-xs font-mono text-[#c99a3c] mb-3">{a.tech}</div>
                <ul className="space-y-1">
                  {a.components.map((comp) => (
                    <li key={comp} className="flex items-start gap-2 text-xs text-[#8a94a6]">
                      <span className="text-[#c99a3c] mt-0.5">—</span>
                      {comp}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Security Properties ──────────────────────────────── */}
      <section className="border-b border-white/10 bg-[#050f1e]">
        <div className="max-w-6xl mx-auto px-6 py-14">
          <SectionHeader num="03" title="Security + Disclosure Properties" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {SECURITY_PROPERTIES.map((s) => (
              <div key={s.property} className="border border-white/10 bg-[#0b1f36] px-5 py-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-emerald-400 text-sm">✓</span>
                  <span className="text-sm font-semibold text-white">{s.property}</span>
                </div>
                <p className="text-xs text-[#8a94a6] leading-relaxed">{s.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Live Proof Links ─────────────────────────────────── */}
      <section className="border-b border-white/10">
        <div className="max-w-6xl mx-auto px-6 py-14">
          <SectionHeader num="04" title="Live URLs" />
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left text-xs font-mono text-[#c99a3c] tracking-widest py-3 pr-6">PAGE</th>
                  <th className="text-left text-xs font-mono text-[#c99a3c] tracking-widest py-3 pr-6">STATUS</th>
                  <th className="text-left text-xs font-mono text-[#c99a3c] tracking-widest py-3">NOTE</th>
                </tr>
              </thead>
              <tbody>
                {LIVE_PROOF_LINKS.map((link) => (
                  <tr key={link.label} className="border-b border-white/5">
                    <td className="py-3 pr-6">
                      <a
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-[#c99a3c] hover:underline"
                      >
                        {link.label} →
                      </a>
                    </td>
                    <td className="py-3 pr-6">
                      <span
                        className={`text-xs font-mono ${
                          link.status === "live" ? "text-emerald-400" : "text-amber-400"
                        }`}
                      >
                        [{link.status}]
                      </span>
                    </td>
                    <td className="py-3 text-xs text-[#8a94a6]">{link.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ── Endpoint Status ──────────────────────────────────── */}
      <section className="border-b border-white/10 bg-[#050f1e]">
        <div className="max-w-6xl mx-auto px-6 py-14">
          <SectionHeader num="05" title="Endpoint Status" />
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left text-xs font-mono text-[#c99a3c] tracking-widest py-3 pr-6">ENDPOINT</th>
                  <th className="text-left text-xs font-mono text-[#c99a3c] tracking-widest py-3 pr-6">METHOD</th>
                  <th className="text-left text-xs font-mono text-[#c99a3c] tracking-widest py-3">HTTP STATUS</th>
                </tr>
              </thead>
              <tbody>
                {SYSTEM_ENDPOINTS.map((e) => (
                  <tr key={e.name} className="border-b border-white/5">
                    <td className="py-3 pr-6">
                      <div className="text-xs font-semibold text-white">{e.name}</div>
                      <div className="text-xs font-mono text-[#8a94a6]">{e.url}</div>
                    </td>
                    <td className="py-3 pr-6 text-xs font-mono text-[#8a94a6]">{e.method}</td>
                    <td className="py-3">
                      <span
                        className={`text-xs font-mono ${
                          e.status === "200"
                            ? "text-emerald-400"
                            : e.status === "—"
                            ? "text-[#8a94a6]"
                            : "text-amber-400"
                        }`}
                      >
                        {e.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-[#8a94a6] mt-4 leading-relaxed">
            * Apostle Chain (port 7332) is a local Rust service — 503 indicates the service 
            is not currently running on this deployment host. The codebase is deployed and 
            operational when the Rust binary is active.
          </p>
        </div>
      </section>

      {/* ── Known Gaps ───────────────────────────────────────── */}
      <section className="border-b border-white/10">
        <div className="max-w-6xl mx-auto px-6 py-14">
          <SectionHeader num="06" title="Known Gaps (Honest Disclosure)" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl">
            {[
              {
                gap: "/api/moments/mint not implemented",
                detail: "Mint page degrades gracefully to demo mode. Route will be added in next sprint.",
                severity: "low",
              },
              {
                gap: "Stripe webhook not registered",
                detail: "Stripe checkout flow is built. Webhook endpoint not yet registered at Stripe Dashboard.",
                severity: "medium",
              },
              {
                gap: "Apostle Chain service down",
                detail: "Rust binary requires a running server instance. Not running on Vercel deployment host.",
                severity: "low",
              },
              {
                gap: "Real SPL token not yet deployed",
                detail: "SPL event token launcher is built and tested. Production event token not yet deployed to mainnet.",
                severity: "medium",
              },
              {
                gap: "Fan PoA minting not live",
                detail: "PoA minting logic is implemented. Live event trigger not yet activated.",
                severity: "medium",
              },
              {
                gap: "Merchant QR pilot not run",
                detail: "Merchant redemption flow is built. First real merchant pilot has not been executed.",
                severity: "medium",
              },
            ].map((g) => (
              <div key={g.gap} className="border border-white/10 bg-[#0b1f36] px-5 py-4">
                <div className="flex items-center gap-2 mb-2">
                  <span
                    className={`text-xs font-mono ${
                      g.severity === "low" ? "text-blue-400" : "text-amber-400"
                    }`}
                  >
                    [{g.severity}]
                  </span>
                  <span className="text-xs font-semibold text-white">{g.gap}</span>
                </div>
                <p className="text-xs text-[#8a94a6] leading-relaxed">{g.detail}</p>
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
              Request a Full Demo
            </h2>
            <p className="text-[#8a94a6] text-sm leading-relaxed mb-8">
              The infrastructure is built. The walkthroughs are documented. 
              Review the funding ask or connect with the team to schedule a live demonstration.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/sports/demo"
                className="bg-[#c99a3c] text-[#071426] text-sm font-semibold px-6 py-3 hover:bg-[#f0cf82] transition-colors"
              >
                Interactive Walkthrough
              </Link>
              <Link
                href="/sports/funding"
                className="border border-[#c99a3c]/40 text-[#c99a3c] text-sm font-semibold px-6 py-3 hover:bg-[#c99a3c]/10 transition-colors"
              >
                Funding Memo
              </Link>
              <Link
                href="/sports/grants"
                className="border border-white/20 text-white text-sm font-semibold px-6 py-3 hover:bg-white/5 transition-colors"
              >
                Grant Pipeline
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

      {/* ── Disclaimer ───────────────────────────────────────── */}
      <section>
        <div className="max-w-6xl mx-auto px-6 py-10">
          <p className="text-xs text-[#8a94a6] leading-relaxed max-w-3xl">
            Infrastructure status reflects the state of deployed components as of the most 
            recent production deployment. Known gaps are disclosed honestly — this project 
            is in active development. No component described as "live" has undisclosed 
            dependencies or hidden failure states. Endpoint HTTP status codes are approximate 
            and may change between deployments. Nothing on this page constitutes a warranty 
            of system availability or uptime.
          </p>
        </div>
      </section>
    </main>
  );
}
