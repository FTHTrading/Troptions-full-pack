import type { Channel } from "@/content/ttn/channelRegistry";
import Link from "next/link";

interface Props {
  channel: Channel;
}

const STATUS_BADGE: Record<Channel["status"], { label: string; cls: string }> = {
  live: { label: "LIVE", cls: "bg-green-900/60 text-green-400 border-green-800" },
  scheduled: { label: "COMING SOON", cls: "bg-yellow-900/60 text-yellow-400 border-yellow-800" },
  draft: { label: "DRAFT", cls: "bg-gray-800 text-gray-400 border-gray-700" },
  paused: { label: "PAUSED", cls: "bg-orange-900/60 text-orange-400 border-orange-800" },
  archived: { label: "ARCHIVED", cls: "bg-red-900/60 text-red-400 border-red-800" },
};

export function ChannelCard({ channel }: Props) {
  const badge = STATUS_BADGE[channel.status];

  return (
    <Link href={`/ttn/channels/${channel.slug}`} className="group block">
      <div className="overflow-hidden rounded-xl border border-gray-800 bg-[#0F1923] transition-all duration-200 hover:border-[#C9A84C]/30 hover:shadow-lg hover:shadow-[#C9A84C]/5">
        {/* Colour swatch header */}
        <div
          className="flex h-20 items-center justify-center text-4xl"
          style={{ background: channel.thumbnailColor }}
        >
          {channel.iconEmoji}
        </div>

        <div className="p-5">
          {/* Status + category */}
          <div className="mb-3 flex items-center gap-2">
            <span
              className={`rounded border px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-[0.15em] ${badge.cls}`}
            >
              {badge.label}
            </span>
            <span className="text-[10px] uppercase tracking-[0.1em] text-gray-500">
              {channel.category.replace(/-/g, " ")}
            </span>
          </div>

          <h3 className="mb-1.5 text-sm font-semibold text-white group-hover:text-[#C9A84C] transition-colors">
            {channel.title}
          </h3>
          <p className="mb-3 text-[11px] italic text-[#C9A84C]/70">{channel.tagline}</p>
          <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed">{channel.description}</p>

          {/* Tags */}
          {channel.tags.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-1">
              {channel.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="rounded bg-gray-800/80 px-2 py-0.5 text-[10px] text-gray-400"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
