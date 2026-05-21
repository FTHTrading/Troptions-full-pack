import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { TTN_PODCAST_SHOWS, TTN_PODCAST_EPISODES, getPodcastShow, getEpisodesForShow } from "@/content/ttn/podcastRegistry";

interface Props {
  params: Promise<{ slug: string; episodeSlug: string }>;
}

export async function generateStaticParams() {
  return TTN_PODCAST_SHOWS.flatMap((show) =>
    getEpisodesForShow(show.id).map((ep) => ({ slug: show.slug, episodeSlug: ep.slug }))
  );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { episodeSlug } = await params;
  const ep = TTN_PODCAST_EPISODES.find((e) => e.slug === episodeSlug);
  if (!ep) return { title: "Episode Not Found" };
  return { title: ep.title, description: ep.description };
}

export default async function PodcastEpisodePage({ params }: Props) {
  const { slug, episodeSlug } = await params;
  const show = getPodcastShow(slug);
  if (!show) notFound();

  const episode = TTN_PODCAST_EPISODES.find((e) => e.slug === episodeSlug && e.showId === show.id);
  if (!episode || episode.status !== "published") notFound();

  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      {/* Breadcrumb */}
      <nav className="mb-8 text-[10px] uppercase tracking-[0.2em] text-gray-500">
        <Link href="/ttn/podcasts" className="hover:text-white transition-colors">Podcasts</Link>
        <span className="mx-2">/</span>
        <Link href={`/ttn/podcasts/${show.slug}`} className="hover:text-white transition-colors">
          {show.title}
        </Link>
        <span className="mx-2">/</span>
        <span className="text-white">Ep. {String(episode.episodeNumber).padStart(2, "0")}</span>
      </nav>

      {/* Episode number + show */}
      <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.3em] text-[#C9A84C]">
        {show.title} · Episode {episode.episodeNumber}
      </p>

      <h1 className="mb-4 text-2xl font-bold leading-tight text-white">{episode.title}</h1>
      <p className="mb-6 text-sm text-gray-300 leading-relaxed">{episode.description}</p>

      {/* Meta */}
      <div className="mb-8 flex flex-wrap items-center gap-4 border-b border-gray-800 pb-8 text-[10px] text-gray-500">
        <span>⏱ {episode.duration}</span>
        {episode.guest && (
          <span>
            Guest: <span className="text-gray-300">{episode.guest.name}</span>
            {episode.guest.organization && ` · ${episode.guest.organization}`}
          </span>
        )}
        <time dateTime={episode.publishedAt}>
          {new Date(episode.publishedAt).toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
          })}
        </time>
        {episode.proofCid && (
          <Link
            href={`/ttn/proof/${episode.proofCid}`}
            className="rounded border border-[#C9A84C]/30 bg-[#C9A84C]/5 px-2 py-0.5 text-[9px] uppercase tracking-[0.1em] text-[#C9A84C] hover:bg-[#C9A84C]/10 transition-colors"
          >
            ⬡ IPFS Proof
          </Link>
        )}
      </div>

      {/* Player placeholder */}
      {episode.audioEmbedUrl ? (
        <div className="mb-8 rounded-xl border border-gray-800 bg-[#0D1520] p-4">
          <p className="mb-2 text-[10px] text-gray-500 uppercase tracking-[0.2em]">Audio Player</p>
          <p className="text-xs text-gray-400 break-all">{episode.audioEmbedUrl}</p>
        </div>
      ) : (
        <div className="mb-8 flex items-center justify-center rounded-xl border border-dashed border-gray-700 bg-[#0D1520] py-10 text-sm text-gray-500">
          Audio coming soon
        </div>
      )}

      {/* Show Notes */}
      {episode.showNotes && (
        <div className="mb-8">
          <p className="mb-4 text-[10px] font-semibold uppercase tracking-[0.3em] text-gray-400">Show Notes</p>
          <div className="text-sm text-gray-300 leading-relaxed whitespace-pre-wrap">{episode.showNotes}</div>
        </div>
      )}

      {/* Tags */}
      {episode.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 border-t border-gray-800 pt-6 mt-6">
          {episode.tags.map((tag) => (
            <span key={tag} className="rounded bg-gray-800 px-3 py-1 text-[10px] text-gray-400">
              {tag}
            </span>
          ))}
        </div>
      )}

      <div className="mt-10">
        <Link href={`/ttn/podcasts/${show.slug}`} className="text-xs uppercase tracking-[0.2em] text-gray-500 hover:text-white transition-colors">
          ← Back to {show.title}
        </Link>
      </div>
    </div>
  );
}
