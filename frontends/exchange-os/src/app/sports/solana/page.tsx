import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Solana Infrastructure — TROPTIONS Sports Network",
  description:
    "TROPTIONS uses Solana to power fan rewards, sponsor activations, merchant offers, charity drops, digital moments, proof-of-attendance, and on-chain event receipts.",
};

// ── data ──────────────────────────────────────────────────────────────────

const WHY_SOLANA = [
  {
    label: "Low-Cost Transactions",
    description: "Sub-cent fees make fan reward distribution viable at event scale — thousands of claims without prohibitive gas.",
  },
  {
    label: "Fast Settlement",
    description: "400ms block time enables real-time QR claims, instant reward crediting, and in-venue proof at the moment of activation.",
  },
  {
    label: "Wallet-Native Fan Rewards",
    description: "Phantom, Solflare, and mobile wallets create zero-friction redemption flows — fans already have the infrastructure.",
  },
  {
    label: "SPL Token Creation",
    description: "Standard, composable token framework for event-specific reward currencies, sponsor offer tokens, and charity drop assets.",
  },
  {
    label: "Metaplex Metadata",
    description: "Permanent, verifiable digital moment metadata — timestamped, transferable, and collectible via Metaplex-compatible tooling.",
  },
  {
    label: "Digital Moments / Collectibles",
    description: "Event-specific digital collectibles: fan badges, sponsor-branded moments, limited-edition drops tied to real match events.",
  },
  {
    label: "On-Chain Receipts",
    description: "Every activation, claim, and mint is verifiable on-chain — auditable proof-of-impact for sponsors, charities, and organizers.",
  },
  {
    label: "Composable DEX / Liquidity",
    description: "Raydium, Meteora, and Jupiter provide secondary discovery pathways for event tokens without requiring custom exchange infrastructure.",
  },
];

const WHAT_SOLANA_POWERS = [
  { label: "Fan Reward Tokens", description: "Event-specific fan reward tokens issued to attendees, claimable via QR or wallet." },
  { label: "Sponsor Activation Tokens", description: "Branded sponsor tokens tied to campaign activations — measurable, on-chain." },
  { label: "Merchant Offer Tokens", description: "Local merchant reward tokens redeemable at event-adjacent businesses." },
  { label: "Charity Campaign Tokens", description: "Charity-branded digital assets tracking fan participation in event charity campaigns." },
  { label: "Proof-of-Attendance", description: "Non-transferable or collectible proof-of-attendance assets for event fans." },
  { label: "Digital Moment Drops", description: "Timestamped, match-specific collectible drops — goal moments, match highlights, fan badges." },
  { label: "QR Claim Receipts", description: "On-chain receipts for every QR claim — verifiable by fan, sponsor, and organizer." },
  { label: "Event Proof Dashboards", description: "Aggregated on-chain data feeds the TROPTIONS proof dashboard — real-time sponsor reporting." },
];

const LAUNCHER_FEATURES = [
  { label: "Non-Custodial Signing", description: "Wallet signing via Phantom, Solflare, and adapter — TROPTIONS never holds user keys." },
  { label: "SPL Token Creation", description: "One-click SPL token deployment with configurable supply, decimals, and mint/freeze authority." },
  { label: "Metadata + IPFS Upload", description: "Automated metadata packaging and IPFS upload via Pinata — permanent, content-addressed." },
  { label: "Authority Management", description: "Mint authority, freeze authority, and update authority — configurable per campaign." },
  { label: "Burn Tools", description: "Token burn flows for limited-edition drops and post-event redemption finalization." },
  { label: "DEX Discovery", description: "Raydium, Meteora, and Jupiter integration pathways for secondary market discovery." },
  { label: "Admin Treasury Dashboard", description: "Operator dashboard for campaign management, token accounting, and proof export." },
  { label: "Legal + Risk Pages", description: "Built-in disclosure pages — no investment promise, no guaranteed liquidity, non-custodial notice." },
];

const EVENT_FLOW = [
  { step: "01", label: "Event Creates Campaign", description: "Organizer or sponsor creates a campaign — defines token type, supply, and reward structure." },
  { step: "02", label: "Sponsor Funds Offer", description: "Sponsor funds the campaign and configures activation — QR distribution, moment drop, or fan reward." },
  { step: "03", label: "Merchant + Charity Join", description: "Local merchants and charity partners join the campaign with their own offer or donation tokens." },
  { step: "04", label: "Fan Scans or Claims", description: "Fan scans QR at venue, visits claim page, or receives push — wallet interaction triggered." },
  { step: "05", label: "Wallet Signs or Receives", description: "Fan wallet signs the claim transaction — non-custodial, no private key exposure, no custody transfer." },
  { step: "06", label: "Solana Records Asset", description: "SPL token or digital moment is minted to fan wallet — immutable, timestamped on Solana." },
  { step: "07", label: "Proof Dashboard Updates", description: "TROPTIONS proof dashboard aggregates on-chain data — real-time sponsor and charity reporting." },
];

const SAFETY_ITEMS = [
  { label: "Non-Custodial Signing", description: "All wallet interactions use adapter-based signing. TROPTIONS never receives, stores, or controls user private keys." },
  { label: "No Custody of User Keys", description: "Fan wallets remain fully user-controlled at all times. Tokens are received, not deposited." },
  { label: "Authority Status Visibility", description: "Mint and freeze authority status is displayed on every token page — holders can see who controls supply." },
  { label: "Metadata Permanence Disclosure", description: "Metadata stored on IPFS is content-addressed and permanent. Changes require new uploads — disclosed to users." },
  { label: "No Investment Promises", description: "No token appreciation, yield, or return is promised. Fan tokens are reward and commerce instruments." },
  { label: "No Guaranteed Liquidity", description: "Secondary market discovery is facilitated, not guaranteed. DEX listings depend on market conditions." },
  { label: "No Fake Affiliations", description: "No official FIFA, Octagon, ESPN, or Solana Foundation affiliation is claimed unless separately contracted." },
  { label: "Proof-First Status Labels", description: "All TROPTIONS pages include live proof links, contract addresses, and on-chain verification — no unverified claims." },
];

const ROADMAP = [
  { label: "Launcher Embedded in TROPTIONS", description: "Solana Launcher SDK integrated directly into TROPTIONS event campaign creation flow." },
  { label: "QR Claim Flow", description: "In-venue QR code scanning routed through Solana claim transaction — production-ready." },
  { label: "Campaign Creation UI", description: "Sponsor and merchant campaign creation with token configuration, supply, and metadata." },
  { label: "Proof-of-Attendance Minting", description: "Fan wallet proof-of-attendance asset minted on check-in or QR scan at event." },
  { label: "Wallet Onboarding", description: "Fan wallet onboarding flow — Phantom mobile, QR connect, Solflare, and adapter support." },
  { label: "DEX Integrations", description: "Raydium, Meteora, and Jupiter liquidity pool creation pathways for campaign tokens." },
  { label: "Solana Pay Compatibility", description: "Solana Pay request format support for in-venue merchant redemption flows." },
  { label: "Proof + Status Dashboard", description: "Real-time on-chain proof dashboard — sponsor reports, claim counts, charity totals." },
];

const GRANT_FIT = [
  {
    label: "Public-Good Templates",
    description:
      "TROPTIONS event templates — disclosure pages, proof dashboards, campaign flows — are open-source artifacts that any event organizer can adopt.",
  },
  {
    label: "Safer Launch Disclosure Components",
    description:
      "Built-in legal disclosure and risk framing components improve token launch transparency across the Solana ecosystem — not just for TROPTIONS.",
  },
  {
    label: "Event Commerce Reference Flow",
    description:
      "A documented, production-tested major-event activation flow that Solana ecosystem builders can reference and build on.",
  },
  {
    label: "Non-Technical Fan Onboarding",
    description:
      "Wallet onboarding flows designed for fans who have never used crypto — expands Solana's addressable consumer audience at mass-market events.",
  },
  {
    label: "Major-Event Consumer Use Case",
    description:
      "FIFA-scale event markets represent hundreds of thousands of potential wallet activations per event — a high-visibility Solana consumer deployment.",
  },
];

// ── page ──────────────────────────────────────────────────────────────────

export default function SolanaPage() {
  return (
    <div className="min-h-screen bg-[#071426]">

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="relative bg-[#050f1e] border-b border-white/5 overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-transparent via-purple-500 to-transparent" />
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "repeating-linear-gradient(0deg,#fff 0,#fff 1px,transparent 1px,transparent 60px),repeating-linear-gradient(90deg,#fff 0,#fff 1px,transparent 1px,transparent 60px)",
          }}
        />
        <div className="relative max-w-6xl mx-auto px-6 py-24 md:py-32">
          <p className="text-purple-400 text-[10px] font-semibold uppercase tracking-[0.3em] mb-6">
            TROPTIONS Sports Network — Solana Infrastructure
          </p>
          <h1 className="text-4xl md:text-6xl font-black text-white leading-[1.05] max-w-4xl mb-6">
            Solana-Powered Event Launch Infrastructure
          </h1>
          <p className="text-[#8a94a6] text-lg max-w-3xl leading-relaxed mb-8">
            TROPTIONS uses Solana to power fan rewards, sponsor activations, merchant offers, charity drops, digital moments, proof-of-attendance, and on-chain event receipts.
          </p>
          <div className="inline-block border border-white/10 bg-[#0b1f36] px-4 py-3 text-xs text-[#8a94a6] max-w-2xl leading-relaxed mb-8">
            TROPTIONS does not claim official FIFA, ESPN, Octagon, or Solana Foundation affiliation unless separately contracted. No token appreciation, investment return, or guaranteed liquidity is promised.
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href="/sports/funding"
              className="inline-block px-8 py-3.5 bg-purple-600 text-white font-semibold text-sm uppercase tracking-wider hover:bg-purple-500 transition-colors"
            >
              View Funding Memo
            </Link>
            <Link
              href="/sports/proof"
              className="inline-block px-8 py-3.5 border border-white/20 text-[#8a94a6] font-semibold text-sm uppercase tracking-wider hover:border-white/40 hover:text-white transition-colors"
            >
              View Event Proof
            </Link>
          </div>
        </div>
      </section>

      {/* ── Why Solana ───────────────────────────────────────────────────── */}
      <section className="border-b border-white/5 py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="mb-12 border-l-2 border-l-purple-400 pl-5">
            <p className="text-purple-400 text-[10px] font-semibold uppercase tracking-[0.25em] mb-1">01 — Infrastructure Choice</p>
            <h2 className="text-2xl font-bold text-white mb-2">Why Solana</h2>
            <p className="text-[#8a94a6] text-sm leading-relaxed max-w-2xl">
              Event commerce requires fast, cheap, mobile-first blockchain infrastructure. Solana is the only chain that meets all requirements at in-venue, fan-facing event scale.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {WHY_SOLANA.map((item) => (
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

      {/* ── What Solana Powers ───────────────────────────────────────────── */}
      <section className="border-b border-white/5 py-20 px-6 bg-[#050f1e]">
        <div className="max-w-6xl mx-auto">
          <div className="mb-12 border-l-2 border-l-[#c99a3c] pl-5">
            <p className="text-[#c99a3c] text-[10px] font-semibold uppercase tracking-[0.25em] mb-1">02 — Use Cases</p>
            <h2 className="text-2xl font-bold text-white mb-2">What Solana Powers in TROPTIONS</h2>
            <p className="text-[#8a94a6] text-sm leading-relaxed max-w-2xl">
              Every fan-facing, sponsor-facing, and merchant-facing commerce action in TROPTIONS runs on Solana infrastructure.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {WHAT_SOLANA_POWERS.map((item) => (
              <div
                key={item.label}
                className="border border-[#c99a3c]/20 bg-[#0b1f36] p-5 hover:border-[#c99a3c]/40 transition-colors duration-200"
              >
                <div className="h-[2px] w-6 bg-[#c99a3c] mb-3" />
                <h3 className="text-white font-semibold text-xs mb-2 leading-snug">{item.label}</h3>
                <p className="text-[#8a94a6] text-[11px] leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Launcher Connection ──────────────────────────────────────────── */}
      <section className="border-b border-white/5 py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="mb-12 border-l-2 border-l-purple-400 pl-5">
            <p className="text-purple-400 text-[10px] font-semibold uppercase tracking-[0.25em] mb-1">03 — Launcher</p>
            <h2 className="text-2xl font-bold text-white mb-2">Solana Event Token Launcher</h2>
            <p className="text-[#8a94a6] text-sm leading-relaxed max-w-2xl">
              The <span className="text-white font-medium">FTHTrading/solana-launcher</span> provides the production token infrastructure TROPTIONS connects to. It handles the full token lifecycle from creation to DEX discovery — with built-in disclosure and authority transparency.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {LAUNCHER_FEATURES.map((item) => (
              <div
                key={item.label}
                className="border border-white/10 bg-[#0b1f36] p-5 hover:border-purple-400/30 transition-colors duration-200"
              >
                <h3 className="text-white font-semibold text-xs mb-2 leading-snug">{item.label}</h3>
                <p className="text-[#8a94a6] text-[11px] leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Event Flow ───────────────────────────────────────────────────── */}
      <section className="border-b border-white/5 py-20 px-6 bg-[#050f1e]">
        <div className="max-w-6xl mx-auto">
          <div className="mb-12 border-l-2 border-l-[#c99a3c] pl-5">
            <p className="text-[#c99a3c] text-[10px] font-semibold uppercase tracking-[0.25em] mb-1">04 — Event Flow</p>
            <h2 className="text-2xl font-bold text-white mb-2">How an Activation Runs on Solana</h2>
            <p className="text-[#8a94a6] text-sm leading-relaxed max-w-2xl">
              From campaign creation to on-chain proof — every step in the event activation flow is visible, verifiable, and Solana-settled.
            </p>
          </div>
          <div className="flex flex-col gap-3 max-w-3xl">
            {EVENT_FLOW.map((item, i) => (
              <div
                key={item.step}
                className="flex gap-5 items-start border border-white/10 bg-[#0b1f36] p-5 hover:border-purple-400/20 transition-colors duration-200"
              >
                <div className="shrink-0 w-8 h-8 border border-purple-400/30 flex items-center justify-center">
                  <span className="text-purple-400 text-[10px] font-bold">{item.step}</span>
                </div>
                <div>
                  <p className="text-white font-semibold text-sm mb-1">{item.label}</p>
                  <p className="text-[#8a94a6] text-xs leading-relaxed">{item.description}</p>
                </div>
                {i < EVENT_FLOW.length - 1 && (
                  <div className="absolute left-[2.35rem] mt-14 w-px h-3 bg-purple-400/20" aria-hidden />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Safety + Disclosure ──────────────────────────────────────────── */}
      <section className="border-b border-white/5 py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="mb-12 border-l-2 border-l-green-400 pl-5">
            <p className="text-green-400 text-[10px] font-semibold uppercase tracking-[0.25em] mb-1">05 — Safety + Disclosure</p>
            <h2 className="text-2xl font-bold text-white mb-2">Built-In Disclosure Layer</h2>
            <p className="text-[#8a94a6] text-sm leading-relaxed max-w-2xl">
              Every TROPTIONS Solana integration includes a built-in disclosure and safety layer — for fans, sponsors, and regulators.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {SAFETY_ITEMS.map((item) => (
              <div
                key={item.label}
                className="border border-green-400/20 bg-[#0b1f36] p-5 hover:border-green-400/30 transition-colors duration-200"
              >
                <div className="h-[2px] w-6 bg-green-400 mb-3" />
                <h3 className="text-white font-semibold text-xs mb-2 leading-snug">{item.label}</h3>
                <p className="text-[#8a94a6] text-[11px] leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Integration Roadmap ──────────────────────────────────────────── */}
      <section className="border-b border-white/5 py-20 px-6 bg-[#050f1e]">
        <div className="max-w-6xl mx-auto">
          <div className="mb-12 border-l-2 border-l-purple-400 pl-5">
            <p className="text-purple-400 text-[10px] font-semibold uppercase tracking-[0.25em] mb-1">06 — Roadmap</p>
            <h2 className="text-2xl font-bold text-white mb-2">Integration Roadmap</h2>
            <p className="text-[#8a94a6] text-sm leading-relaxed max-w-2xl">
              Current status and planned integration milestones connecting Solana infrastructure to TROPTIONS event activations.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {ROADMAP.map((item) => (
              <div
                key={item.label}
                className="border border-white/10 bg-[#0b1f36] p-5 hover:border-purple-400/20 transition-colors duration-200"
              >
                <h3 className="text-white font-semibold text-xs mb-2 leading-snug">{item.label}</h3>
                <p className="text-[#8a94a6] text-[11px] leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Grant Fit ────────────────────────────────────────────────────── */}
      <section className="border-b border-white/5 py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="mb-12 border-l-2 border-l-[#c99a3c] pl-5">
            <p className="text-[#c99a3c] text-[10px] font-semibold uppercase tracking-[0.25em] mb-1">07 — Grant Fit</p>
            <h2 className="text-2xl font-bold text-white mb-2">Why This Fits Solana Ecosystem Grants</h2>
            <p className="text-[#8a94a6] text-sm leading-relaxed max-w-2xl">
              TROPTIONS is not only a commercial product. It produces reusable public-good infrastructure that benefits the broader Solana builder ecosystem.
            </p>
          </div>
          <div className="grid md:grid-cols-1 lg:grid-cols-1 gap-4 max-w-3xl">
            {GRANT_FIT.map((item) => (
              <div
                key={item.label}
                className="flex gap-5 items-start border border-[#c99a3c]/20 bg-[#0b1f36] p-5 hover:border-[#c99a3c]/40 transition-colors duration-200"
              >
                <div className="shrink-0 w-1.5 h-1.5 mt-1.5 rounded-full bg-[#c99a3c]" />
                <div>
                  <p className="text-white font-semibold text-sm mb-1">{item.label}</p>
                  <p className="text-[#8a94a6] text-xs leading-relaxed">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-8 border border-white/10 bg-[#0b1f36] p-6 max-w-3xl">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-[#c99a3c] mb-3">Applicable Programs</p>
            <div className="flex flex-wrap gap-2">
              {["Solana Foundation Grants", "Colosseum Hackathon", "Superteam Grants", "Solana Mobile Ecosystem", "Helius Developer Program", "QuickNode Infrastructure Credits", "Pinata Storage Credits", "Metaplex Builder Grants"].map((tag) => (
                <span key={tag} className="text-[11px] text-[#8a94a6] border border-white/10 px-3 py-1">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────────────── */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-purple-400 text-[10px] font-semibold uppercase tracking-[0.3em] mb-5">
            TROPTIONS Sports Network
          </p>
          <h2 className="text-4xl md:text-5xl font-black text-white mb-6 leading-tight">
            The rail is built.<br />The pilot is next.
          </h2>
          <p className="text-[#8a94a6] text-base max-w-2xl mx-auto leading-relaxed mb-10">
            TROPTIONS connects the event commerce layer to Solana infrastructure. Grants, infrastructure credits, and ecosystem introductions accelerate the first live event activation.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center flex-wrap">
            <Link
              href="/sports/funding"
              className="px-8 py-3.5 bg-purple-600 text-white font-semibold text-sm uppercase tracking-wider hover:bg-purple-500 transition-colors"
            >
              Funding Memo
            </Link>
            <Link
              href="/sports/team"
              className="px-8 py-3.5 border border-[#c99a3c]/40 text-[#c99a3c] font-semibold text-sm uppercase tracking-wider hover:border-[#c99a3c] transition-colors"
            >
              View Team
            </Link>
            <Link
              href="/sports/moments"
              className="px-8 py-3.5 border border-white/20 text-[#8a94a6] font-semibold text-sm uppercase tracking-wider hover:border-white/40 hover:text-white transition-colors"
            >
              View Moments
            </Link>
            <Link
              href="/sports/partners"
              className="px-8 py-3.5 border border-white/20 text-[#8a94a6] font-semibold text-sm uppercase tracking-wider hover:border-white/40 hover:text-white transition-colors"
            >
              Partner With TROPTIONS
            </Link>
          </div>
        </div>
      </section>

      {/* ── Footer disclaimer ────────────────────────────────────────────── */}
      <div className="border-t border-white/5 bg-[#050f1e] py-8 px-6">
        <div className="max-w-6xl mx-auto">
          <p className="text-[#8a94a6] text-xs leading-relaxed max-w-4xl">
            TROPTIONS Sports Network is an independent sports media, event commerce, and fan technology company. It is not affiliated with, endorsed by, or a partner of the Solana Foundation, FIFA, the FIFA World Cup, ESPN, Fox Sports, Telemundo, Octagon, CAA Sports, Metaplex, Raydium, Meteora, Jupiter, or any official tournament broadcaster or sanctioning body unless separately disclosed. Digital moments and fan reward tokens are fan-engagement instruments, not investment products. No token appreciation, yield, or return is promised. Non-custodial wallet interactions are facilitated — TROPTIONS does not hold user private keys.
          </p>
        </div>
      </div>

    </div>
  );
}
