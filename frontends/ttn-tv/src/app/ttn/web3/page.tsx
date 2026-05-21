import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "TROPTIONS TV — Web3 Utility Layer",
  description:
    "Proof-of-view, proof-of-attendance, sponsor QR claims, digital moments, and on-chain proof for fans, sponsors, and creators. Solana utility — not speculation.",
};

const UTILITIES = [
  {
    category: "For Fans",
    items: [
      {
        name: "Proof-of-View",
        description:
          "On-chain record that a fan watched a TROPTIONS TV broadcast event. Optional. No personal data stored on-chain.",
      },
      {
        name: "Proof-of-Attendance",
        description:
          "QR-triggered badge confirming physical presence at a partner venue during a matchday event. Scanned at location.",
      },
      {
        name: "Digital Moments",
        description:
          "Limited digital collectibles released during live events — halftime drops, city badge launches, post-match specials.",
      },
      {
        name: "Charity Impact Badge",
        description:
          "Claiming triggers a sponsor-funded donation. On-chain receipt issued. Fan holds proof of their charitable act.",
      },
    ],
  },
  {
    category: "For Sponsors",
    items: [
      {
        name: "Sponsor QR Claims",
        description:
          "Fans scan sponsor QR during live events. Each scan is logged and optionally anchored to Solana as a proof record.",
      },
      {
        name: "On-Chain Sponsor Proof",
        description:
          "Verified scan counts, redemption rates, and campaign performance issued as on-chain proof reports. Auditable.",
      },
      {
        name: "Sponsor Moment Drops",
        description:
          "Branded limited drops tied to sponsor activations. Fans claim the moment; sponsors receive verified engagement data.",
      },
    ],
  },
  {
    category: "For Creators",
    items: [
      {
        name: "Creator Supporter Passes",
        description:
          "Channel members hold a Solana token proving their supporter status. Token-gated content access without centralized paywalls.",
      },
      {
        name: "Channel Membership Passes",
        description:
          "TTN channel subscribers can hold on-chain membership passes. Grants access to exclusive drops, content, or events.",
      },
      {
        name: "Content Receipts",
        description:
          "On-chain record of content published, timestamped and anchored. Proof of original broadcast for creator IP tracking.",
      },
    ],
  },
  {
    category: "For Charities",
    items: [
      {
        name: "Proof-of-Donation",
        description:
          "Charity campaign badge claims generate an on-chain receipt. Sponsors fund the donation; chain records the proof.",
      },
      {
        name: "Charity Campaign Receipts",
        description:
          "Full campaign summary anchored to Solana — total donations triggered, badge claims, sponsor match records.",
      },
    ],
  },
];

export default function TTNWeb3Page() {
  return (
    <div className="min-h-screen bg-[#071426]">
      {/* Hero */}
      <section className="relative py-28 px-6 text-center bg-[#050f1e] border-b border-white/5 overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-transparent via-[#c99a3c] to-transparent" />
        <div className="max-w-4xl mx-auto">
          <p className="text-[#c99a3c] text-xs font-semibold uppercase tracking-[0.3em] mb-6">
            TROPTIONS Television — Web3 Layer
          </p>
          <h1 className="text-5xl md:text-7xl font-bold text-white leading-tight mb-6">
            Every moment
            <br />
            gets a receipt.
          </h1>
          <p className="text-[#8a94a6] text-xl max-w-2xl mx-auto leading-relaxed">
            Solana gives fans, sponsors, creators, and charities an optional on-chain record.
            No speculation. No forced wallets. Pure utility.
          </p>
        </div>
      </section>

      {/* Core disclaimer up top */}
      <section className="bg-[#0b1f36] border-b border-white/5 py-6 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-[#8a94a6] text-xs leading-relaxed">
            No token appreciation, investment return, guaranteed liquidity, or official event affiliation is promised.
            Solana utility on TTN is a receipt and proof layer — not a financial instrument.
          </p>
        </div>
      </section>

      {/* Utility sections */}
      <section className="max-w-6xl mx-auto px-6 py-28 space-y-24">
        {UTILITIES.map((group) => (
          <div key={group.category}>
            <p className="text-[#c99a3c] text-xs font-semibold uppercase tracking-[0.25em] mb-12 text-center">
              {group.category}
            </p>
            <div className="grid md:grid-cols-2 gap-px bg-white/5">
              {group.items.map((item) => (
                <div key={item.name} className="bg-[#071426] p-10 hover:bg-[#0b1f36] transition-colors">
                  <p className="text-white font-bold text-lg mb-3">{item.name}</p>
                  <p className="text-[#8a94a6] leading-relaxed">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </section>

      {/* How Solana is used */}
      <section className="bg-[#050f1e] border-t border-b border-white/5 py-28 px-6">
        <div className="max-w-6xl mx-auto">
          <p className="text-[#c99a3c] text-xs font-semibold uppercase tracking-[0.25em] mb-4 text-center">
            Architecture
          </p>
          <h2 className="text-3xl font-bold text-white text-center mb-16">
            Solana as the proof layer — not the product.
          </h2>
          <div className="grid md:grid-cols-3 gap-px bg-white/5">
            {[
              {
                t: "Claim first, chain optional",
                d: "Fans claim any moment by phone or email. Solana minting is a second step, never required.",
              },
              {
                t: "No token speculation",
                d: "Moments, badges, and passes are utility tokens — proof records, access passes, receipts. Not investments.",
              },
              {
                t: "Sponsor-grade proof",
                d: "Sponsor proof reports are on-chain verified, auditable, and exportable. Real data, not impressions estimates.",
              },
              {
                t: "Charity receipts on-chain",
                d: "Donor-triggered receipts anchored to Solana. Transparent. Auditable. Sponsor-matched campaigns recorded.",
              },
              {
                t: "Creator sovereignty",
                d: "Creators hold on-chain proof of their broadcast history. Content receipts, supporter pass issuance, revenue records.",
              },
              {
                t: "Open wallet support",
                d: "Phantom, Solflare, and standard Solana wallets supported. No proprietary custody or wallet lock-in.",
              },
            ].map((item) => (
              <div key={item.t} className="bg-[#050f1e] p-8">
                <p className="text-white font-semibold mb-3">{item.t}</p>
                <p className="text-[#8a94a6] text-sm leading-relaxed">{item.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTAs */}
      <section className="max-w-4xl mx-auto px-6 py-20 text-center">
        <h2 className="text-3xl font-bold text-white mb-6">Ready to claim your first moment?</h2>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/sports/moments"
            className="px-8 py-4 bg-[#c99a3c] text-[#071426] font-bold text-sm uppercase tracking-wider hover:bg-[#f0cf82] transition-colors"
          >
            View Active Drops
          </Link>
          <Link
            href="/ttn/infrastructure"
            className="px-8 py-4 border border-[#c99a3c]/40 text-[#c99a3c] font-bold text-sm uppercase tracking-wider hover:border-[#c99a3c] hover:text-white transition-colors"
          >
            Full Infrastructure
          </Link>
        </div>
      </section>

      {/* Footer disclaimer */}
      <section className="border-t border-white/5 py-10 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-[#c99a3c] text-xs font-semibold uppercase tracking-widest mb-4">
            Powered by TROPTIONS. Settled on Solana.
          </p>
          <p className="text-[#8a94a6] text-xs leading-relaxed">
            TROPTIONS is an independent fan-commerce and media activation network. No official FIFA, ESPN,
            Octagon, league, team, stadium, broadcaster, or rights-holder affiliation is claimed unless
            separately contracted. Official match coverage belongs to licensed rights holders.
            Web3 utility on TTN is a proof and receipt layer. No token appreciation, guaranteed liquidity,
            investment return, or financial instrument of any kind is offered or implied.
          </p>
        </div>
      </section>
    </div>
  );
}
