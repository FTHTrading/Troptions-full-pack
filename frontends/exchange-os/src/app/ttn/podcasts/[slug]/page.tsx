import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { TTN_PODCAST_SHOWS, getPodcastShow, getEpisodesForShow } from "@/content/ttn/podcastRegistry";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return TTN_PODCAST_SHOWS.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const show = getPodcastShow(slug);
  if (!show) return { title: "Show Not Found" };
  return { title: show.title, description: show.description };
}

export default async function PodcastShowPage({ params }: Props) {
  const { slug } = await params;
  const show = getPodcastShow(slug);
  if (!show) notFound();

  const episodes = getEpisodesForShow(show.id).filter((e) => e.status === "published");

  return (
    <div className="mx-auto max-w-5xl px-6 py-16">
      {/* Breadcrumb */}
      <nav className="mb-8 text-[10px] uppercase tracking-[0.2em] text-gray-500">
        <Link href="/ttn/podcasts" className="hover:text-white transition-colors">Podcasts</Link>
        <span className="mx-2">/</span>
        <span className="text-white">{show.title}</span>
      </nav>

      {/* Header */}
      <div className="mb-12 flex flex-col gap-6 sm:flex-row">
        <div className="flex h-28 w-28 shrink-0 items-center justify-center rounded-2xl bg-gray-800 text-4xl">
          🎙
        </div>
        <div>
          <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#C9A84C]">
            {show.category.replace(/-/g, " ")}
          </p>
          <h1 className="mb-2 text-2xl font-bold text-white">{show.title}</h1>
          <p className="mb-3 text-sm text-gray-300 leading-relaxed">{show.description}</p>
          {show.hostId && (
            <p className="text-xs text-gray-500">
              Host ID: <span className="text-gray-300">{show.hostId}</span>
            </p>
          )}
          <p className="mt-1 text-[10px] text-gray-600">{episodes.length} published episode{episodes.length !== 1 ? "s" : ""}</p>
        </div>
      </div>

      {/* Episodes */}
      <div>
        <p className="mb-5 text-[10px] font-semibold uppercase tracking-[0.3em] text-gray-400">Episodes</p>

        {episodes.length === 0 ? (
          <div className="rounded-xl border border-dashed border-gray-700 p-12 text-center text-sm text-gray-500">
            No published episodes yet.
          </div>
        ) : (
          <div className="space-y-4">
            {episodes.map((ep) => (
              <Link
                key={ep.id}
                href={`/ttn/podcasts/${show.slug}/episodes/${ep.slug}`}
                className="group block rounded-xl border border-gray-800 bg-[#0F1923] p-5 transition-all hover:border-[#C9A84C]/30 hover:shadow-lg hover:shadow-[#C9A84C]/5"
              >
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gray-800 text-xs font-bold text-[#C9A84C]">
                    {String(ep.episodeNumber).padStart(2, "0")}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="mb-1 text-sm font-semibold text-white group-hover:text-[#C9A84C] transition-colors line-clamp-1">
                      {ep.title}
                    </h3>
                    <p className="mb-2 text-xs text-gray-400 line-clamp-2 leading-relaxed">{ep.description}</p>
                    <div className="flex items-center gap-3 text-[10px] text-gray-500">
                      <span>{ep.duration}</span>
                      {ep.guest && <span>· {ep.guest.name}</span>}
                      <span>·</span>
                      <time dateTime={ep.publishedAt}>
                        {new Date(ep.publishedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                      </time>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* RSS / Subscribe note */}
      {show.rssFeedUrl && (
        <div className="mt-10 rounded-xl border border-gray-800 bg-[#0D1520] p-5">
          <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.3em] text-gray-400">Subscribe via RSS</p>
          <p className="font-mono text-[10px] text-gray-500">{show.rssFeedUrl}</p>
        </div>
      )}
    </div>
  );
}
