import type { Creator } from "@/content/ttn/creatorRegistry";
import Link from "next/link";

interface Props {
  creator: Creator;
}

const BADGE_MAP: Record<Creator["verifiedBadge"], { label: string; cls: string } | null> = {
  none: null,
  email: { label: "Email Verified", cls: "text-blue-400 border-blue-800 bg-blue-900/30" },
  identity: { label: "Identity Verified", cls: "text-[#C9A84C] border-[#C9A84C]/40 bg-[#C9A84C]/10" },
  legal: { label: "Legal Verified", cls: "text-green-400 border-green-800 bg-green-900/30" },
};

export function CreatorCard({ creator }: Props) {
  const badge = BADGE_MAP[creator.verifiedBadge];

  return (
    <Link href={`/ttn/creators/${creator.slug}`} className="group block">
      <div className="rounded-xl border border-gray-800 bg-[#0F1923] p-5 transition-all duration-200 hover:border-[#C9A84C]/30 hover:shadow-lg hover:shadow-[#C9A84C]/5">
        {/* Avatar + name */}
        <div className="mb-4 flex items-center gap-3">
          <div className="h-12 w-12 shrink-0 rounded-full bg-gray-800 border border-gray-700 overflow-hidden flex items-center justify-center text-lg">
            {creator.name.charAt(0)}
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white group-hover:text-[#C9A84C] transition-colors">
              {creator.name}
            </h3>
            {badge && (
              <span
                className={`mt-0.5 inline-block rounded border px-1.5 py-0.5 text-[9px] uppercase tracking-[0.1em] ${badge.cls}`}
              >
                {badge.label}
              </span>
            )}
          </div>
        </div>

        <p className="mb-2 text-[11px] italic text-[#C9A84C]/70">{creator.tagline}</p>
        <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed">{creator.bio}</p>

        {/* Stats */}
        <div className="mt-4 flex gap-4 border-t border-gray-800 pt-4 text-center">
          <div>
            <p className="text-xs font-semibold text-white">{creator.channelIds.length}</p>
            <p className="text-[10px] text-gray-500 uppercase tracking-[0.1em]">Channels</p>
          </div>
          <div>
            <p className="text-xs font-semibold text-white">{creator.videoIds.length}</p>
            <p className="text-[10px] text-gray-500 uppercase tracking-[0.1em]">Videos</p>
          </div>
          <div>
            <p className="text-xs font-semibold text-white">{creator.blogIds.length}</p>
            <p className="text-[10px] text-gray-500 uppercase tracking-[0.1em]">Posts</p>
          </div>
        </div>

        {creator.specialty.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1">
            {creator.specialty.slice(0, 3).map((s) => (
              <span key={s} className="rounded bg-gray-800/80 px-2 py-0.5 text-[10px] text-gray-400">
                {s}
              </span>
            ))}
          </div>
        )}
      </div>
    </Link>
  );
}
