"use client";

import Link from "next/link";
import { useState } from "react";

// ─── Data ────────────────────────────────────────────────────────────────────

const SCENARIOS = [
  {
    id: "fan",
    label: "Fan Experience",
    description: "Follow a fan from entry to token claim to merchant redemption.",
    accent: "border-[#c99a3c]",
    dot: "bg-[#c99a3c]",
    steps: [
      {
        step: "01",
        title: "Fan Arrives at Event",
        detail:
          "Scans QR code at the venue gate or on their event ticket. No app download required — QR opens a mobile-optimized web flow.",
        status: "Entry",
      },
      {
        step: "02",
        title: "Wallet Detection",
        detail:
          "System detects if fan has a Solana wallet. If yes: connect and proceed. If no: generate a non-custodial wallet in-browser, save to device.",
        status: "Wallet",
      },
      {
        step: "03",
        title: "Event Token Received",
        detail:
          "Fan's wallet receives the event SPL token — minted on Solana, metadata pinned to IPFS. Transaction confirms in ~400ms.",
        status: "Token",
      },
      {
        step: "04",
        title: "Proof-of-Attendance Minted",
        detail:
          "A non-transferable PoA token is minted to the fan's wallet. Permanent record they were at this event. Verifiable forever.",
        status: "PoA",
      },
      {
        step: "05",
        title: "Merchant QR Scan",
        detail:
          "Fan scans a vendor QR code (food, merchandise, partner venue). Token balance is checked. Redemption is executed on-chain.",
        status: "Redeem",
      },
      {
        step: "06",
        title: "Proof Dashboard Updates",
        detail:
          "Fan's participation is reflected in the live event proof dashboard. Sponsors can see aggregated engagement metrics in real time.",
        status: "Proof",
      },
    ],
  },
  {
    id: "sponsor",
    label: "Sponsor Activation",
    description: "See how a brand launches an event token and measures ROI.",
    accent: "border-blue-500",
    dot: "bg-blue-400",
    steps: [
      {
        step: "01",
        title: "Sponsor Onboards",
        detail:
          "Brand submits token name, artwork, redemption rules, and budget. TROPTIONS team provisions the SPL token via the launcher.",
        status: "Setup",
      },
      {
        step: "02",
        title: "Token Deployed",
        detail:
          "Branded SPL token is created on Solana. Metadata (logo, description, social links) pinned to IPFS via Metaplex standard.",
        status: "Deploy",
      },
      {
        step: "03",
        title: "Distribution Rules Set",
        detail:
          "Sponsor defines distribution: per-ticket, per-purchase, per-activity. Rules are encoded in the campaign configuration.",
        status: "Config",
      },
      {
        step: "04",
        title: "Fans Receive Tokens",
        detail:
          "As fans claim event tokens, sponsor tokens are distributed per the defined rules. All on-chain, verifiable, no intermediary.",
        status: "Live",
      },
      {
        step: "05",
        title: "Live Engagement Dashboard",
        detail:
          "Sponsor accesses real-time dashboard: tokens distributed, redemptions, geographic spread, merchant categories. All from on-chain data.",
        status: "Monitor",
      },
      {
        step: "06",
        title: "Post-Event Proof Package",
        detail:
          "After the event: full on-chain proof report with verifiable transaction hashes, fan counts, merchant settlements, charity allocations.",
        status: "Report",
      },
    ],
  },
  {
    id: "charity",
    label: "Charity Flow",
    description: "Transparent donation flow from event token activity to verified charity wallet.",
    accent: "border-emerald-500",
    dot: "bg-emerald-400",
    steps: [
      {
        step: "01",
        title: "Charity Wallet Registered",
        detail:
          "Charity provides a Solana wallet address. It is registered in the event campaign configuration and displayed publicly.",
        status: "Register",
      },
      {
        step: "02",
        title: "Allocation Rule Set",
        detail:
          "A percentage of event token activity (e.g., 5% of every merchant redemption) is allocated to the charity wallet by rule.",
        status: "Config",
      },
      {
        step: "03",
        title: "Real-Time Allocation",
        detail:
          "As transactions occur, the charity allocation routes on-chain in the same transaction. No batch processing. No delay.",
        status: "Live",
      },
      {
        step: "04",
        title: "Public Proof Dashboard",
        detail:
          "The charity wallet address and running balance are publicly displayed on the event proof page. Anyone can verify on Solana Explorer.",
        status: "Visible",
      },
      {
        step: "05",
        title: "Post-Event Summary",
        detail:
          "Final charity total is included in the sponsor and organizer proof package — with transaction hashes for every allocation.",
        status: "Audit",
      },
      {
        step: "06",
        title: "Charity Withdraws Freely",
        detail:
          "The charity holds full custody of their wallet. No intermediary holds or controls the funds. Withdrawal at any time.",
        status: "Control",
      },
    ],
  },
];

const LIVE_METRICS = [
  { label: "Event Token Txns (Demo)", value: "1,247", note: "simulated" },
  { label: "Unique Wallets (Demo)", value: "423", note: "simulated" },
  { label: "PoA Tokens Minted (Demo)", value: "312", note: "simulated" },
  { label: "Merchant Redemptions (Demo)", value: "89", note: "simulated" },
  { label: "Charity Allocation (Demo)", value: "42 USDC", note: "simulated" },
  { label: "Proof Items On-Chain", value: "6", note: "live" },
];

// ─── Component ────────────────────────────────────────────────────────────────

export default function DemoPage() {
  const [activeScenario, setActiveScenario] = useState("fan");
  const scenario = SCENARIOS.find((s) => s.id === activeScenario) ?? SCENARIOS[0];

  return (
    <main className="min-h-screen bg-[#071426] text-white">
      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="border-b border-white/10">
        <div className="max-w-6xl mx-auto px-6 py-16">
          <div className="w-10 h-0.5 bg-[#c99a3c] mb-6" />
          <p className="text-xs font-mono text-[#c99a3c] tracking-widest mb-3">
            INTERACTIVE WALKTHROUGH
          </p>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
            How It Works
          </h1>
          <p className="text-[#8a94a6] max-w-2xl leading-relaxed mb-6">
            Step-by-step walkthroughs of the fan experience, sponsor activation, 
            and charity flow — the three core loops of the TROPTIONS Sports Network 
            event token economy.
          </p>
          <p className="text-xs text-[#8a94a6] border border-white/10 px-4 py-3 max-w-2xl leading-relaxed">
            Metrics shown are simulated for demonstration purposes unless marked "live". 
            No investment return is implied. No token liquidity is guaranteed.
          </p>
        </div>
      </section>

      {/* ── Simulated Metrics ────────────────────────────────── */}
      <section className="border-b border-white/10 bg-[#050f1e]">
        <div className="max-w-6xl mx-auto px-6 py-10">
          <div className="flex items-center gap-3 mb-6">
            <span className="w-2 h-2 bg-emerald-400 animate-pulse" />
            <span className="text-xs font-mono text-[#8a94a6] tracking-widest">EVENT DASHBOARD — DEMO MODE</span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {LIVE_METRICS.map((m) => (
              <div key={m.label} className="border border-white/10 bg-[#0b1f36] px-5 py-4">
                <div className="text-xl font-bold text-[#c99a3c] mb-1">{m.value}</div>
                <div className="text-xs text-[#8a94a6] leading-snug mb-1">{m.label}</div>
                <span
                  className={`text-xs font-mono ${
                    m.note === "live" ? "text-emerald-400" : "text-[#8a94a6]"
                  }`}
                >
                  [{m.note}]
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Scenario Selector ────────────────────────────────── */}
      <section className="border-b border-white/10">
        <div className="max-w-6xl mx-auto px-6 py-14">
          <div className="mb-8 flex items-baseline gap-4">
            <span className="text-xs font-mono text-[#c99a3c] tracking-[0.2em]">01</span>
            <h2 className="text-xl font-semibold text-white tracking-tight">
              Choose a Walkthrough
            </h2>
          </div>

          {/* Tabs */}
          <div className="flex flex-wrap gap-2 mb-8">
            {SCENARIOS.map((s) => (
              <button
                key={s.id}
                onClick={() => setActiveScenario(s.id)}
                className={`px-5 py-2 text-sm font-semibold border transition-colors ${
                  activeScenario === s.id
                    ? "bg-[#c99a3c] text-[#071426] border-[#c99a3c]"
                    : "border-white/20 text-[#8a94a6] hover:text-white hover:bg-white/5"
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>

          {/* Scenario header */}
          <div className={`border-l-2 ${scenario.accent} pl-4 mb-8`}>
            <p className="text-sm text-[#8a94a6] leading-relaxed">{scenario.description}</p>
          </div>

          {/* Steps */}
          <div className="space-y-3">
            {scenario.steps.map((step, idx) => (
              <div
                key={step.step}
                className="border border-white/10 bg-[#0b1f36] flex items-stretch"
              >
                <div className="flex-none w-12 flex items-center justify-center border-r border-white/10 bg-white/5">
                  <span className="text-xs font-mono text-[#c99a3c]">{step.step}</span>
                </div>
                <div className="flex-1 px-5 py-4">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-semibold text-white">{step.title}</span>
                    <span className="text-xs font-mono text-[#8a94a6] border border-white/10 px-2 py-0.5">
                      {step.status}
                    </span>
                  </div>
                  <p className="text-xs text-[#8a94a6] leading-relaxed">{step.detail}</p>
                </div>
                {idx < scenario.steps.length - 1 && (
                  <div className="hidden md:flex flex-none w-6 items-center justify-center">
                    <div className="h-full w-px bg-white/10" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Architecture Overview ────────────────────────────── */}
      <section className="border-b border-white/10 bg-[#050f1e]">
        <div className="max-w-6xl mx-auto px-6 py-14">
          <div className="mb-8 flex items-baseline gap-4">
            <span className="text-xs font-mono text-[#c99a3c] tracking-[0.2em]">02</span>
            <h2 className="text-xl font-semibold text-white tracking-tight">
              Under the Hood
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                label: "Token Creation",
                detail:
                  "SPL token created via FTHTrading/solana-launcher. Non-custodial. Metadata submitted to Metaplex and pinned to IPFS via Pinata.",
              },
              {
                label: "QR → Wallet Flow",
                detail:
                  "QR encodes a campaign URL. Page detects wallet (Phantom, Backpack, or browser wallet). If none: ephemeral wallet generated, exported to user.",
              },
              {
                label: "Transaction Settlement",
                detail:
                  "All token transfers execute on Solana mainnet. Confirmation ~400ms. Fees: sub-$0.01 per transaction. RPC via Helius or QuickNode.",
              },
              {
                label: "Proof Dashboard",
                detail:
                  "Next.js server component reads on-chain state. Transaction hashes are surfaced publicly. Anyone can verify on Solana Explorer.",
              },
              {
                label: "Merchant Redemption",
                detail:
                  "Merchant scans fan wallet QR. Token balance checked via RPC. Redemption tx broadcast. On-chain settlement in ~400ms.",
              },
              {
                label: "Charity Routing",
                detail:
                  "Allocation percentage is a programmatic rule. Charity wallet receives tokens in the same transaction as fan/merchant events.",
              },
            ].map((c) => (
              <div key={c.label} className="border border-white/10 bg-[#0b1f36] px-5 py-4">
                <div className="text-xs font-mono text-[#c99a3c] tracking-widest mb-2">{c.label.toUpperCase()}</div>
                <p className="text-xs text-[#8a94a6] leading-relaxed">{c.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Try It ───────────────────────────────────────────── */}
      <section className="border-b border-white/10">
        <div className="max-w-6xl mx-auto px-6 py-14">
          <div className="mb-8 flex items-baseline gap-4">
            <span className="text-xs font-mono text-[#c99a3c] tracking-[0.2em]">03</span>
            <h2 className="text-xl font-semibold text-white tracking-tight">
              See Live Proof
            </h2>
          </div>
          <p className="text-[#8a94a6] text-sm leading-relaxed max-w-2xl mb-8">
            The infrastructure is not a concept. On-chain transactions, deployed tokens, 
            and IPFS metadata are already live. Review the proof before requesting a 
            full partner demo.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/sports/proof"
              className="bg-[#c99a3c] text-[#071426] text-sm font-semibold px-6 py-3 hover:bg-[#f0cf82] transition-colors"
            >
              Live Proof Dashboard
            </Link>
            <Link
              href="/sports/moments"
              className="border border-white/20 text-white text-sm font-semibold px-6 py-3 hover:bg-white/5 transition-colors"
            >
              Moment Drops
            </Link>
            <Link
              href="/sports/solana"
              className="border border-white/20 text-white text-sm font-semibold px-6 py-3 hover:bg-white/5 transition-colors"
            >
              Solana Infrastructure
            </Link>
            <Link
              href="/sports/partners"
              className="border border-white/20 text-white text-sm font-semibold px-6 py-3 hover:bg-white/5 transition-colors"
            >
              Partner Packages
            </Link>
          </div>
        </div>
      </section>

      {/* ── Disclaimer ───────────────────────────────────────── */}
      <section>
        <div className="max-w-6xl mx-auto px-6 py-10">
          <p className="text-xs text-[#8a94a6] leading-relaxed max-w-3xl">
            All metrics shown in the demo dashboard are simulated unless explicitly marked "live". 
            Simulated figures are illustrative of system capability and are not historical performance 
            data. Token economics, redemption rates, and charity allocations shown are examples only 
            and do not constitute a promise of commercial outcomes. TROPTIONS Sports Network tokens 
            are utility tokens for event participation. No investment return is implied or guaranteed. 
            No liquidity is guaranteed.
          </p>
        </div>
      </section>
    </main>
  );
}
