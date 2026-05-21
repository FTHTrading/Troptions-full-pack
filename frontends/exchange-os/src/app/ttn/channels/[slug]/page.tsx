import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { TTN_CHANNELS, getChannel } from "@/content/ttn/channelRegistry";
import { getVideosByChannel } from "@/content/ttn/videoRegistry";
import { TTN_CREATORS } from "@/content/ttn/creatorRegistry";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return TTN_CHANNELS.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const channel = getChannel(slug);
  if (!channel) return { title: "Channel Not Found" };
  return {
    title: channel.title,
    description: channel.description,
  };
}

export default async function ChannelDetailPage({ params }: Props) {
  const { slug } = await params;
  const channel = getChannel(slug);
  if (!channel) notFound();

  const creator = TTN_CREATORS.find((c) => c.id === channel.creatorId);

  const videos = getVideosByChannel(channel.id);
  const availableSponsors = channel.sponsorSlots.filter((s) => s.available);

  return (
    <div className="mx-auto max-w-7xl px-6 py-16">
      {/* Breadcrumb */}
      <nav className="mb-8 text-[10px] uppercase tracking-[0.2em] text-gray-500">
        <Link href="/ttn" className="hover:text-white transition-colors">TTN</Link>
        <span className="mx-2">/</span>
        <Link href="/ttn/channels" className="hover:text-white transition-colors">Channels</Link>
        <span className="mx-2">/</span>
        <span className="text-white">{channel.title}</span>
      </nav>

      {/* Header */}
      <div
        className="mb-10 flex items-center gap-6 rounded-2xl p-8"
        style={{ background: `linear-gradient(135deg, ${channel.thumbnailColor}cc 0%, #0D1520 100%)` }}
      >
        <div className="text-5xl">{channel.iconEmoji}</div>
        <div>
          <div className="mb-2 flex items-center gap-2">
            <span className={`rounded border px-2 py-0.5 text-[9px] font-bold uppercase tracking-[0.15em] ${
              channel.status === "live" ? "bg-green-900/60 text-green-400 border-green-800" :
              channel.status === "scheduled" ? "bg-yellow-900/60 text-yellow-400 border-yellow-800" :
              "bg-gray-800 text-gray-400 border-gray-700"
            }`}>
              {channel.status.toUpperCase()}
            </span>
            <span className="text-[10px] uppercase tracking-[0.1em] text-gray-400">
              {channel.category.replace(/-/g, " ")}
            </span>
          </div>
          <h1 className="text-2xl font-bold text-white">{channel.title}</h1>
          <p className="mt-1 text-sm italic text-[#C9A84C]/80">{channel.tagline}</p>
        </div>
      </div>

      <div className="grid gap-10 lg:grid-cols-3">
        {/* Main */}
        <div className="lg:col-span-2">
          <p className="mb-8 text-sm text-gray-300 leading-relaxed">{channel.description}</p>

          {/* Schedule */}
          {channel.schedule.length > 0 && (
            <div className="mb-8 rounded-xl border border-gray-800 bg-[#0F1923] p-6">
              <p className="mb-4 text-[10px] font-semibold uppercase tracking-[0.3em] text-[#C9A84C]">Schedule</p>
              <div className="space-y-2">
                {channel.schedule.map((slot, i) => (
                  <div key={i} className="flex items-center gap-3 text-xs text-gray-300">
                    <span className="w-16 shrink-0 font-semibold text-white">{slot.day}</span>
                    <span className="w-28 shrink-0 text-[#C9A84C]/70">{slot.time}</span>
                    <span className="text-gray-400">{slot.title}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Videos */}
          {videos.length > 0 && (
            <div>
              <p className="mb-4 text-[10px] font-semibold uppercase tracking-[0.3em] text-gray-400">Videos</p>
              <div className="space-y-3">
                {videos.map((v) => (
                  <Link
                    key={v.id}
                    href={`/ttn/channels/${channel.slug}/videos/${v.slug}`}
                    className="group flex items-center gap-4 rounded-lg border border-gray-800 bg-[#0F1923] p-4 hover:border-[#C9A84C]/30 transition-colors"
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded bg-gray-800 text-lg">▶</div>
                    <div>
                      <p className="text-sm font-medium text-white group-hover:text-[#C9A84C] transition-colors">{v.title}</p>
                      <p className="text-[10px] text-gray-500">{v.duration}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {videos.length === 0 && (
            <div className="rounded-lg border border-dashed border-gray-700 p-8 text-center text-xs text-gray-500">
              No published videos yet on this channel.
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Creator */}
          {creator && (
            <div className="rounded-xl border border-gray-800 bg-[#0F1923] p-5">
              <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.3em] text-gray-400">Creator</p>
              <Link href={`/ttn/creators/${creator.slug}`} className="group flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gray-800 text-sm font-bold text-white">
                  {creator.name.charAt(0)}
                </div>
                <div>
                  <p className="text-sm font-medium text-white group-hover:text-[#C9A84C] transition-colors">
                    {creator.name}
                  </p>
                  <p className="text-[10px] text-gray-500">{creator.tagline}</p>
                </div>
              </Link>
            </div>
          )}

          {/* Proof */}
          {channel.proofCid && (
            <div className="rounded-xl border border-[#C9A84C]/20 bg-[#0D1520] p-5">
              <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.3em] text-[#C9A84C]">Content Proof</p>
              <Link href={`/ttn/proof/${channel.proofCid}`} className="block">
                <p className="font-mono text-[10px] text-gray-400 break-all hover:text-white transition-colors">
                  {channel.proofCid}
                </p>
              </Link>
              <p className="mt-2 text-[10px] text-gray-600">IPFS fingerprint — simulation only</p>
            </div>
          )}

          {/* Sponsor slots */}
          {availableSponsors.length > 0 && (
            <div className="rounded-xl border border-gray-800 bg-[#0F1923] p-5">
              <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.3em] text-gray-400">
                Sponsor Opportunities
              </p>
              {availableSponsors.map((slot, i) => (
                <div key={i} className="mb-2 flex items-center justify-between text-xs">
                  <span className="capitalize text-gray-300">{slot.position.replace(/-/g, " ")}</span>
                  <Link
                    href={slot.inquiryUrl}
                    className="text-[#C9A84C] hover:underline"
                  >
                    Inquire →
                  </Link>
                </div>
              ))}
            </div>
          )}

          {/* Tags */}
          {channel.tags.length > 0 && (
            <div className="rounded-xl border border-gray-800 bg-[#0F1923] p-5">
              <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.3em] text-gray-400">Tags</p>
              <div className="flex flex-wrap gap-1.5">
                {channel.tags.map((tag) => (
                  <span key={tag} className="rounded bg-gray-800 px-2 py-0.5 text-[10px] text-gray-400">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
