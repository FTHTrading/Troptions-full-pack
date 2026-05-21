import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "TROPTIONS Television Network — Broadcast Infrastructure",
  description:
    "The TROPTIONS Television Network Broadcast OS: open-source stack, channel network, live streaming, video CMS, Web3 rewards, and Solana proof layer.",
};

const STACK = [
  {
    layer: "Broadcast OS",
    name: "TROPTIONS Television Network",
    description:
      "TTN is an owned broadcast operating system — not a platform dependency. Fan commerce, city activations, live streaming, and Solana proof run on infrastructure we control.",
  },
  {
    layer: "Live Streaming",
    name: "Owncast + MistServer",
    description:
      "Owncast provides self-hosted live streaming with real-time chat. MistServer handles professional broadcast, OTT ingest, multi-bitrate adaptive delivery, and RTMP/HLS outputs.",
  },
  {
    layer: "Video CMS & Archive",
    name: "MediaCMS",
    description:
      "MediaCMS is the video content management system. Upload, transcode, organize, and publish VOD content. Full media library for all 8 TTN channels.",
  },
  {
    layer: "Frontend",
    name: "Next.js 15",
    description:
      "Server-rendered, fast, SEO-ready. Channel pages, city guides, sponsor dashboards, fan claim flows, and creator portals all run on Next.js.",
  },
  {
    layer: "Web3 Proof Layer",
    name: "Solana",
    description:
      "Proof-of-view, proof-of-attendance, sponsor claim receipts, charity donation records, digital moments, and on-chain sponsor proof reports. All optional. No wallet required for basic fan experience.",
  },
  {
    layer: "Moments & Drops",
    name: "TROPTIONS Moments Engine",
    description:
      "QR-triggered fan badge drops, halftime reward events, sponsor claim activations, charity impact badges. Claim by phone or email. Mint to Solana if desired.",
  },
  {
    layer: "Sponsor & Advertising Layer",
    name: "TROPTIONS Sponsor OS",
    description:
      "Sponsor packages, QR drop activations, branded segment placements, featured merchant listings, proof reports. Delivered per-event and per-campaign.",
  },
  {
    layer: "Analytics & Proof",
    name: "Proof Dashboard",
    description:
      "Sponsor reach, scan events, redemption rates, on-chain proof records, and audience data — all aggregated and delivered as sponsor proof reports.",
  },
  {
    layer: "Optional Web3 Layer",
    name: "Livepeer",
    description:
      "Optional decentralized video transcoding and delivery layer. Reduces infrastructure cost for high-volume live events. Plug-in — TTN runs without it.",
  },
  {
    layer: "Rewards & Commerce",
    name: "Solana Launcher Integration",
    description:
      "Fan moments, channel passes, creator supporter tokens, and sponsor proof receipts issued on Solana. Rewards are utility-only — no speculation, no investment claims.",
  },
];

export default function TTNInfrastructurePage() {
  return (
    <div className="min-h-screen bg-[#071426]">
      {/* Hero */}
      <section className="relative py-28 px-6 text-center bg-[#050f1e] border-b border-white/5 overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-transparent via-[#c99a3c] to-transparent" />
        <div className="max-w-4xl mx-auto">
          <p className="text-[#c99a3c] text-xs font-semibold uppercase tracking-[0.3em] mb-6">
            TROPTIONS Television Network
          </p>
          <h1 className="text-5xl md:text-7xl font-bold text-white leading-tight mb-6">
            Owned broadcast.
            <br />
            Not rented reach.
          </h1>
          <p className="text-[#8a94a6] text-xl max-w-2xl mx-auto leading-relaxed">
            TTN is a full broadcast operating system — open-source stack, 8 channels, Solana proof layer,
            and city activation infrastructure. Built to own, not license.
          </p>
        </div>
      </section>

      {/* Stack layers */}
      <section className="max-w-6xl mx-auto px-6 py-28">
        <p className="text-[#c99a3c] text-xs font-semibold uppercase tracking-[0.25em] mb-4 text-center">
          Technology Stack
        </p>
        <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-16">
          Ten layers. One broadcast OS.
        </h2>
        <div className="space-y-px bg-white/5">
          {STACK.map((s) => (
            <div
              key={s.layer}
              className="bg-[#071426] p-8 hover:bg-[#0b1f36] transition-colors grid md:grid-cols-[180px_1fr] gap-8"
            >
              <div>
                <p className="text-[#c99a3c] text-xs font-semibold uppercase tracking-[0.2em] mb-1">
                  {s.layer}
                </p>
                <p className="text-white font-bold">{s.name}</p>
              </div>
              <p className="text-[#8a94a6] leading-relaxed">{s.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Channel network */}
      <section className="bg-[#050f1e] border-t border-b border-white/5 py-28 px-6">
        <div className="max-w-6xl mx-auto">
          <p className="text-[#c99a3c] text-xs font-semibold uppercase tracking-[0.25em] mb-4 text-center">
            Channel Network
          </p>
          <h2 className="text-3xl font-bold text-white text-center mb-6">
            8 channels. Sports, Music, Creators, Charity, Local, Business, Events, Web3.
          </h2>
          <p className="text-[#8a94a6] text-center max-w-2xl mx-auto mb-12">
            Each channel is a sovereign broadcast unit with its own content strategy, revenue model, sponsor layer, and Web3 utility.
          </p>
          <div className="text-center">
            <Link
              href="/ttn/channels"
              className="inline-block px-8 py-4 bg-[#c99a3c] text-[#071426] font-bold text-sm uppercase tracking-wider hover:bg-[#f0cf82] transition-colors"
            >
              View All 8 Channels
            </Link>
          </div>
        </div>
      </section>

      {/* Deployment model */}
      <section className="max-w-6xl mx-auto px-6 py-28">
        <div className="grid md:grid-cols-2 gap-16 items-start">
          <div>
            <p className="text-[#c99a3c] text-xs font-semibold uppercase tracking-[0.25em] mb-4">
              Deployment Model
            </p>
            <h2 className="text-4xl font-bold text-white mb-6 leading-tight">
              Self-hosted. Open-source.
              <br />Fully controlled.
            </h2>
            <p className="text-[#8a94a6] leading-relaxed mb-10">
              MediaCMS, Owncast, and MistServer are self-hosted on TROPTIONS infrastructure.
              No platform lock-in. No algorithm dependency. No deplatforming risk.
              TTN is owned broadcast infrastructure.
            </p>
            <Link
              href="/ttn/launch-channel"
              className="inline-block px-8 py-4 border border-[#c99a3c]/40 text-[#c99a3c] font-bold text-sm uppercase tracking-wider hover:border-[#c99a3c] hover:text-white transition-colors"
            >
              Launch Your Channel
            </Link>
          </div>
          <div className="space-y-px bg-white/5">
            {[
              { t: "No Platform Dependency", d: "TTN runs on infrastructure we own — not YouTube, Twitch, or Meta." },
              { t: "Multi-Channel Architecture", d: "8 channel verticals, each with independent content, monetization, and Web3 layer." },
              { t: "Open-Source Core", d: "MediaCMS (AGPLv3), Owncast (MIT), MistServer (LGPL). Auditable. Modifiable." },
              { t: "Solana Proof Layer", d: "Optional on-chain proof for fans, sponsors, and creators. No forced Web3 dependency." },
              { t: "City Activation Model", d: "Sports events, festivals, and city activations run live — TTN covers the city, not just the venue." },
            ].map((item) => (
              <div key={item.t} className="bg-[#071426] p-6">
                <p className="text-white font-semibold mb-1">{item.t}</p>
                <p className="text-[#8a94a6] text-sm">{item.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTAs */}
      <section className="bg-[#050f1e] border-t border-white/5 py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-6">Ready to broadcast on TTN?</h2>
          <p className="text-[#8a94a6] mb-10">
            Creators, businesses, events, charities, and sports brands — launch your own TTN channel.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/ttn/launch-channel"
              className="px-8 py-4 bg-[#c99a3c] text-[#071426] font-bold text-sm uppercase tracking-wider hover:bg-[#f0cf82] transition-colors"
            >
              Launch a Channel
            </Link>
            <Link
              href="/ttn/web3"
              className="px-8 py-4 border border-[#c99a3c]/40 text-[#c99a3c] font-bold text-sm uppercase tracking-wider hover:border-[#c99a3c] hover:text-white transition-colors"
            >
              Web3 Utility Layer
            </Link>
          </div>
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
          </p>
        </div>
      </section>
    </div>
  );
}
