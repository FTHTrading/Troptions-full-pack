import type { Metadata } from "next";
import Link from "next/link";
import { TTN_CHANNELS, getLiveChannels } from "@/content/ttn/channelRegistry";
import { getActiveCreators } from "@/content/ttn/creatorRegistry";
import { getPublishedPosts } from "@/content/ttn/blogRegistry";
import { TTN_PODCAST_SHOWS } from "@/content/ttn/podcastRegistry";
import { TTN_FILMS } from "@/content/ttn/filmRegistry";
import { getApprovedProofRecords } from "@/content/ttn/proofRegistry";
import { ChannelCard } from "@/components/ttn/ChannelCard";
import { BlogCard } from "@/components/ttn/BlogCard";

export const metadata: Metadata = {
  title: "Troptions Television Network — TTN CreatorOS",
  description:
    "Creator-first, media-first, proof-backed channels, blogs, podcasts, films, and Web3-enhanced publishing on Troptions Television Network.",
};

export default function TtnHomePage() {
  const liveChannels = getLiveChannels().slice(0, 3);
  const recentPosts = getPublishedPosts().slice(0, 3);
  const activeCreators = getActiveCreators();
  const approvedProofs = getApprovedProofRecords();

  const stats = [
    { label: "Channels", value: TTN_CHANNELS.length },
    { label: "Creators", value: activeCreators.length },
    { label: "Podcasts", value: TTN_PODCAST_SHOWS.length },
    { label: "Films", value: TTN_FILMS.length },
    { label: "Proof Records", value: approvedProofs.length },
  ];

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-gray-800 bg-gradient-to-br from-[#080C14] via-[#0D1520] to-[#080C14] px-6 pb-20 pt-24 text-center">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_#C9A84C08_0%,_transparent_70%)]" />
        <div className="relative mx-auto max-w-3xl">
          <p className="mb-4 text-[10px] font-semibold uppercase tracking-[0.4em] text-[#C9A84C]">
            Troptions Television Network
          </p>
          <h1 className="mb-6 text-4xl font-bold leading-tight text-white md:text-5xl">
            Creator-Powered Media.
            <br />
            <span className="text-[#C9A84C]">Proof-Backed Publishing.</span>
          </h1>
          <p className="mx-auto mb-8 max-w-xl text-sm leading-relaxed text-gray-300">
            TTN CreatorOS is the publishing and distribution platform for Troptions Television Network
            — channels, blogs, podcasts, short films, and IPFS proof registry in one place.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/ttn/channels"
              className="rounded-lg bg-[#C9A84C] px-6 py-2.5 text-xs font-bold uppercase tracking-[0.2em] text-black transition-colors hover:bg-[#d4b86a]"
            >
              Watch Channels
            </Link>
            <Link
              href="/ttn/studio"
              className="rounded-lg border border-[#C9A84C]/40 px-6 py-2.5 text-xs font-bold uppercase tracking-[0.2em] text-[#C9A84C] transition-colors hover:bg-[#C9A84C]/10"
            >
              Creator Studio
            </Link>
          </div>
        </div>

        {/* Stats bar */}
        <div className="relative mx-auto mt-16 flex max-w-2xl flex-wrap items-center justify-center gap-8 border-t border-gray-800 pt-10">
          {stats.map((s) => (
            <div key={s.label} className="text-center">
              <p className="text-2xl font-bold text-[#C9A84C]">{s.value}</p>
              <p className="text-[10px] uppercase tracking-[0.2em] text-gray-500">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Live Channels */}
      {liveChannels.length > 0 && (
        <section className="border-b border-gray-800 px-6 py-16">
          <div className="mx-auto max-w-7xl">
            <div className="mb-8 flex items-end justify-between">
              <div>
                <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.3em] text-[#C9A84C]">Live Now</p>
                <h2 className="text-xl font-bold text-white">Featured Channels</h2>
              </div>
              <Link href="/ttn/channels" className="text-xs uppercase tracking-[0.15em] text-gray-400 hover:text-white transition-colors">
                All Channels →
              </Link>
            </div>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {liveChannels.map((ch) => (
                <ChannelCard key={ch.id} channel={ch} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Quick access grid */}
      <section className="border-b border-gray-800 px-6 py-16">
        <div className="mx-auto max-w-7xl">
          <p className="mb-8 text-[10px] font-semibold uppercase tracking-[0.3em] text-[#C9A84C]">Explore TTN</p>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { href: "/ttn/news", icon: "📰", title: "Newsroom", desc: "Latest articles, press releases, and ecosystem updates." },
              { href: "/ttn/podcasts", icon: "🎙", title: "Podcasts", desc: "Sovereignty Talks and TTN audio programming." },
              { href: "/ttn/films", icon: "🎬", title: "Films", desc: "Documentaries, shorts, and TTN Originals." },
              { href: "/ttn/proof", icon: "⬡", title: "Proof Registry", desc: "IPFS-backed content fingerprints and evidence records." },
            ].map((item) => (
              <Link key={item.href} href={item.href} className="group rounded-xl border border-gray-800 bg-[#0F1923] p-5 transition-all hover:border-[#C9A84C]/30 hover:shadow-lg hover:shadow-[#C9A84C]/5">
                <div className="mb-3 text-2xl">{item.icon}</div>
                <h3 className="mb-1 text-sm font-semibold text-white group-hover:text-[#C9A84C] transition-colors">
                  {item.title}
                </h3>
                <p className="text-xs text-gray-400 leading-relaxed">{item.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Recent News */}
      {recentPosts.length > 0 && (
        <section className="border-b border-gray-800 px-6 py-16">
          <div className="mx-auto max-w-7xl">
            <div className="mb-8 flex items-end justify-between">
              <div>
                <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.3em] text-[#C9A84C]">Newsroom</p>
                <h2 className="text-xl font-bold text-white">Latest From TTN</h2>
              </div>
              <Link href="/ttn/news" className="text-xs uppercase tracking-[0.15em] text-gray-400 hover:text-white transition-colors">
                All Posts →
              </Link>
            </div>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {recentPosts.map((post) => (
                <BlogCard key={post.id} post={post} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Disclaimer */}
      <section className="px-6 py-12">
        <div className="mx-auto max-w-3xl rounded-xl border border-gray-800 bg-[#0D1520] p-6 text-center">
          <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-gray-500 mb-3">Important Notice</p>
          <p className="text-xs text-gray-500 leading-relaxed">
            TTN CreatorOS is a content publishing and media infrastructure platform. It is not a financial institution,
            investment advisor, broker-dealer, or securities issuer. All content is informational and educational only.
            Proof records are IPFS content fingerprints — not legal copyright registration, royalty guarantees,
            or investment certificates. Creator earnings, channel monetization, and sponsor arrangements are
            subject to separate signed agreements. All Web3 features are proof and identity tooling only.
          </p>
        </div>
      </section>
    </div>
  );
}
