import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Launch Your TROPTIONS TV Channel",
  description:
    "Launch a sovereign broadcast channel on the TROPTIONS Television Network. Sports, music, events, charity, local, business, and creator channels available.",
};

const CHANNEL_TYPES = [
  {
    type: "Sports",
    headline: "Cover the city around the game.",
    description:
      "Matchday guides, fan culture, city activations, watch-party coverage, and sponsor drop integrations.",
    bestFor: "Local sports brands, fan clubs, city experience companies, sports media",
    web3: "Proof-of-view badges, Solana moment drops, sponsor QR claims",
  },
  {
    type: "Events",
    headline: "Own the live coverage.",
    description:
      "Live event broadcast, post-event VOD, behind-the-scenes content, and real-time sponsor activations.",
    bestFor: "Event producers, conference organizers, festival brands, city activation companies",
    web3: "Proof-of-attendance NFTs, event moment drops, sponsor claim badges",
  },
  {
    type: "Charity",
    headline: "Tell the story. Prove the impact.",
    description:
      "Nonprofit storytelling, campaign launches, live fundraisers, and sponsor-matched donation campaigns.",
    bestFor: "Nonprofits, foundations, CSR programs, impact-driven brands",
    web3: "On-chain charity receipts, proof-of-donation, sponsor match records",
  },
  {
    type: "Local",
    headline: "Be the neighborhood network.",
    description:
      "Community events, local business spotlights, neighborhood guides, and city partner features.",
    bestFor: "Local news, community organizations, neighborhood merchants, city brands",
    web3: "Local business badge drops, community proof-of-attendance",
  },
  {
    type: "Creators",
    headline: "Build your sovereign broadcast.",
    description:
      "No algorithm. No platform dependency. Vlogs, shows, tutorials, and community content on infrastructure you own.",
    bestFor: "Independent creators, influencers, content builders, community shows",
    web3: "Creator supporter passes, token-gated content, digital collectibles",
  },
  {
    type: "Business",
    headline: "Broadcast to your market.",
    description:
      "Entrepreneur content, industry education, founder stories, and B2B brand programming.",
    bestFor: "Startups, professional services, entrepreneur brands, industry educators",
    web3: "Sponsor QR claims, on-chain proof reports, professional credentialing",
  },
];

export default function LaunchChannelPage() {
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
            Launch your
            <br />
            own TTN channel.
          </h1>
          <p className="text-[#8a94a6] text-xl max-w-2xl mx-auto leading-relaxed">
            Broadcast on infrastructure you own. Sports, events, charity, local, creator, and business channels.
            Solana proof layer included. No platform dependency.
          </p>
        </div>
      </section>

      {/* Channel types */}
      <section className="max-w-6xl mx-auto px-6 py-28">
        <p className="text-[#c99a3c] text-xs font-semibold uppercase tracking-[0.25em] mb-4 text-center">
          Channel Types
        </p>
        <h2 className="text-3xl font-bold text-white text-center mb-16">
          Choose your broadcast vertical.
        </h2>
        <div className="grid md:grid-cols-2 gap-px bg-white/5">
          {CHANNEL_TYPES.map((ch) => (
            <div key={ch.type} className="bg-[#071426] p-10 hover:bg-[#0b1f36] transition-colors">
              <p className="text-[#c99a3c] text-xs font-semibold uppercase tracking-[0.25em] mb-3">
                {ch.type}
              </p>
              <h3 className="text-white font-bold text-xl mb-3">{ch.headline}</h3>
              <p className="text-[#8a94a6] text-sm leading-relaxed mb-5">{ch.description}</p>
              <div className="space-y-2">
                <div>
                  <span className="text-[#8a94a6] text-xs font-semibold uppercase tracking-wider">Best For — </span>
                  <span className="text-[#8a94a6] text-xs">{ch.bestFor}</span>
                </div>
                <div>
                  <span className="text-[#8a94a6] text-xs font-semibold uppercase tracking-wider">Web3 Layer — </span>
                  <span className="text-[#8a94a6] text-xs">{ch.web3}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* What's included */}
      <section className="bg-[#050f1e] border-t border-b border-white/5 py-28 px-6">
        <div className="max-w-6xl mx-auto">
          <p className="text-[#c99a3c] text-xs font-semibold uppercase tracking-[0.25em] mb-4 text-center">
            What&apos;s Included
          </p>
          <h2 className="text-3xl font-bold text-white text-center mb-16">
            Your channel. Fully equipped.
          </h2>
          <div className="grid md:grid-cols-3 gap-px bg-white/5">
            {[
              { t: "Live Streaming", d: "Owncast + MistServer live broadcast. RTMP ingest, HLS delivery, real-time chat." },
              { t: "Video CMS", d: "MediaCMS archive. Upload, transcode, organize, and publish your VOD library." },
              { t: "Next.js Channel Page", d: "Server-rendered, fast, SEO-ready channel page on the TTN frontend." },
              { t: "Sponsor Integration", d: "QR drops, branded segment placements, featured sponsor activations." },
              { t: "Solana Proof Layer", d: "Proof-of-view, proof-of-attendance, moment drops, and on-chain sponsor proof." },
              { t: "Proof Reports", d: "Verified scan, redemption, and reach data for every campaign and event." },
            ].map((item) => (
              <div key={item.t} className="bg-[#050f1e] p-8">
                <p className="text-white font-semibold mb-3">{item.t}</p>
                <p className="text-[#8a94a6] text-sm leading-relaxed">{item.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Apply CTA */}
      <section className="max-w-4xl mx-auto px-6 py-28 text-center">
        <p className="text-[#c99a3c] text-xs font-semibold uppercase tracking-widest mb-4">
          Get Started
        </p>
        <h2 className="text-4xl font-bold text-white mb-6">
          Ready to own your broadcast?
        </h2>
        <p className="text-[#8a94a6] mb-10 max-w-xl mx-auto">
          Apply to launch your TTN channel. Sports, events, charity, local, creator, and business verticals available.
          Pricing and setup on request.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/sports/partners"
            className="px-8 py-4 bg-[#c99a3c] text-[#071426] font-bold text-sm uppercase tracking-wider hover:bg-[#f0cf82] transition-colors"
          >
            Apply for a Channel
          </Link>
          <Link
            href="/ttn/channels"
            className="px-8 py-4 border border-[#c99a3c]/40 text-[#c99a3c] font-bold text-sm uppercase tracking-wider hover:border-[#c99a3c] hover:text-white transition-colors"
          >
            View All 8 Channels
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
          </p>
        </div>
      </section>
    </div>
  );
}
