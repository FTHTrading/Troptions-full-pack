import type { Metadata } from "next";
import Link from "next/link";
import { TTN_PODCAST_SHOWS } from "@/content/ttn/podcastRegistry";
import { getEpisodesForShow } from "@/content/ttn/podcastRegistry";

export const metadata: Metadata = {
  title: "Podcasts",
  description: "TTN audio programming — Sovereignty Talks and more.",
};

export default function PodcastsPage() {
  return (
    <div className="mx-auto max-w-7xl px-6 py-16">
      <div className="mb-12">
        <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.3em] text-[#C9A84C]">TTN Audio</p>
        <h1 className="text-3xl font-bold text-white">Podcasts</h1>
        <p className="mt-3 max-w-xl text-sm text-gray-400">
          Conversations on sovereignty, blockchain, real estate, and creative entrepreneurship.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {TTN_PODCAST_SHOWS.map((show) => {
          const episodes = getEpisodesForShow(show.id);
          return (
            <Link
              key={show.id}
              href={`/ttn/podcasts/${show.slug}`}
              className="group rounded-xl border border-gray-800 bg-[#0F1923] p-6 transition-all hover:border-[#C9A84C]/30 hover:shadow-lg hover:shadow-[#C9A84C]/5"
            >
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-xl bg-gray-800 text-2xl">
                🎙
              </div>
              <p className="mb-1 text-[10px] uppercase tracking-[0.2em] text-[#C9A84C]">
                {show.category.replace(/-/g, " ")}
              </p>
              <h2 className="mb-2 text-base font-semibold text-white group-hover:text-[#C9A84C] transition-colors">
                {show.title}
              </h2>
              <p className="mb-4 text-xs text-gray-400 leading-relaxed line-clamp-2">{show.description}</p>
              <p className="text-[10px] text-gray-500">{episodes.length} episode{episodes.length !== 1 ? "s" : ""}</p>
            </Link>
          );
        })}
      </div>

      {TTN_PODCAST_SHOWS.length === 0 && (
        <div className="rounded-xl border border-dashed border-gray-700 p-16 text-center text-sm text-gray-500">
          No podcast shows yet.
        </div>
      )}
    </div>
  );
}
