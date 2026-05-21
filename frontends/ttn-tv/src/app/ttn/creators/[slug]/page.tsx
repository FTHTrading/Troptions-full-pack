import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { TTN_CREATORS, getCreator } from "@/content/ttn/creatorRegistry";
import { TTN_CHANNELS } from "@/content/ttn/channelRegistry";
import { getVideosByChannel } from "@/content/ttn/videoRegistry";
import { TTN_BLOG_POSTS } from "@/content/ttn/blogRegistry";
import { TTN_PODCAST_SHOWS } from "@/content/ttn/podcastRegistry";
import { TTN_FILMS } from "@/content/ttn/filmRegistry";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return TTN_CREATORS.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const creator = getCreator(slug);
  if (!creator) return { title: "Creator Not Found" };
  return { title: creator.name, description: creator.bio };
}

export default async function CreatorProfilePage({ params }: Props) {
  const { slug } = await params;
  const creator = getCreator(slug);
  if (!creator) notFound();

  const channels = TTN_CHANNELS.filter((c) => creator.channelIds.includes(c.id));
  const posts = TTN_BLOG_POSTS.filter((p) => creator.blogIds.includes(p.id));
  const podcasts = TTN_PODCAST_SHOWS.filter((s) => creator.podcastIds.includes(s.id));
  const films = TTN_FILMS.filter((f) => creator.filmIds.includes(f.id));

  const allVideos = channels.flatMap((ch) => getVideosByChannel(ch.id));

  const BADGE_MAP = {
    none: null,
    email: { label: "Email Verified", cls: "text-blue-400 border-blue-800 bg-blue-900/30" },
    identity: { label: "Identity Verified", cls: "text-[#C9A84C] border-[#C9A84C]/40 bg-[#C9A84C]/10" },
    legal: { label: "Legal Verified", cls: "text-green-400 border-green-800 bg-green-900/30" },
  } as const;
  const badge = BADGE_MAP[creator.verifiedBadge];

  return (
    <div className="mx-auto max-w-7xl px-6 py-16">
      {/* Breadcrumb */}
      <nav className="mb-8 text-[10px] uppercase tracking-[0.2em] text-gray-500">
        <Link href="/ttn/creators" className="hover:text-white transition-colors">Creators</Link>
        <span className="mx-2">/</span>
        <span className="text-white">{creator.name}</span>
      </nav>

      {/* Header */}
      <div className="mb-10 flex flex-col gap-6 sm:flex-row sm:items-start">
        <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full border border-gray-700 bg-gray-800 text-3xl font-bold text-white">
          {creator.name.charAt(0)}
        </div>
        <div>
          <div className="mb-2 flex flex-wrap items-center gap-2">
            <h1 className="text-2xl font-bold text-white">{creator.name}</h1>
            {badge && (
              <span className={`rounded border px-2 py-0.5 text-[10px] uppercase tracking-[0.1em] ${badge.cls}`}>
                {badge.label}
              </span>
            )}
          </div>
          <p className="mb-3 text-sm italic text-[#C9A84C]/80">{creator.tagline}</p>
          <p className="max-w-2xl text-sm text-gray-300 leading-relaxed">{creator.bio}</p>
          {creator.location && (
            <p className="mt-2 text-xs text-gray-500">📍 {creator.location}</p>
          )}
        </div>
      </div>

      {/* Specialty */}
      {creator.specialty.length > 0 && (
        <div className="mb-10 flex flex-wrap gap-2">
          {creator.specialty.map((s) => (
            <span key={s} className="rounded bg-gray-800 px-3 py-1 text-xs text-gray-300">
              {s}
            </span>
          ))}
        </div>
      )}

      {/* Sections */}
      <div className="grid gap-10">
        {/* Channels */}
        {channels.length > 0 && (
          <section>
            <p className="mb-4 text-[10px] font-semibold uppercase tracking-[0.3em] text-[#C9A84C]">Channels</p>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {channels.map((ch) => (
                <Link
                  key={ch.id}
                  href={`/ttn/channels/${ch.slug}`}
                  className="group flex items-center gap-3 rounded-xl border border-gray-800 bg-[#0F1923] p-4 hover:border-[#C9A84C]/30 transition-all"
                >
                  <span className="text-2xl">{ch.iconEmoji}</span>
                  <div>
                    <p className="text-sm font-medium text-white group-hover:text-[#C9A84C] transition-colors">
                      {ch.title}
                    </p>
                    <p className="text-[10px] text-gray-500 capitalize">{ch.status}</p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Videos */}
        {allVideos.length > 0 && (
          <section>
            <p className="mb-4 text-[10px] font-semibold uppercase tracking-[0.3em] text-gray-400">Videos</p>
            <div className="grid gap-3 sm:grid-cols-2">
              {allVideos.map((v) => (
                <div key={v.id} className="flex items-center gap-3 rounded-lg border border-gray-800 bg-[#0F1923] p-3">
                  <span className="text-lg">▶</span>
                  <div>
                    <p className="text-xs font-medium text-white">{v.title}</p>
                    <p className="text-[10px] text-gray-500">{v.duration}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Blog Posts */}
        {posts.length > 0 && (
          <section>
            <p className="mb-4 text-[10px] font-semibold uppercase tracking-[0.3em] text-gray-400">News & Articles</p>
            <div className="space-y-3">
              {posts.map((post) => (
                <Link
                  key={post.id}
                  href={`/ttn/news/${post.slug}`}
                  className="group flex items-center justify-between rounded-lg border border-gray-800 bg-[#0F1923] px-4 py-3 hover:border-[#C9A84C]/30 transition-colors"
                >
                  <p className="text-xs font-medium text-white group-hover:text-[#C9A84C] transition-colors">
                    {post.title}
                  </p>
                  <span className="ml-3 shrink-0 text-[10px] text-gray-500">
                    {new Date(post.publishedAt).toLocaleDateString("en-US", { month: "short", year: "numeric" })}
                  </span>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Podcasts */}
        {podcasts.length > 0 && (
          <section>
            <p className="mb-4 text-[10px] font-semibold uppercase tracking-[0.3em] text-gray-400">Podcasts</p>
            <div className="grid gap-4 sm:grid-cols-2">
              {podcasts.map((s) => (
                <Link
                  key={s.id}
                  href={`/ttn/podcasts/${s.slug}`}
                  className="group rounded-lg border border-gray-800 bg-[#0F1923] p-4 hover:border-[#C9A84C]/30 transition-colors"
                >
                  <p className="mb-1 text-sm font-medium text-white group-hover:text-[#C9A84C] transition-colors">
                    {s.title}
                  </p>
                  <p className="text-xs text-gray-400 line-clamp-2">{s.description}</p>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Films */}
        {films.length > 0 && (
          <section>
            <p className="mb-4 text-[10px] font-semibold uppercase tracking-[0.3em] text-gray-400">Films</p>
            <div className="grid gap-4 sm:grid-cols-2">
              {films.map((f) => (
                <Link
                  key={f.id}
                  href={`/ttn/films/${f.slug}`}
                  className="group rounded-lg border border-gray-800 bg-[#0F1923] p-4 hover:border-[#C9A84C]/30 transition-colors"
                >
                  <p className="mb-1 text-sm font-medium text-white group-hover:text-[#C9A84C] transition-colors">
                    {f.title}
                  </p>
                  <p className="text-[10px] text-gray-500 capitalize">{f.status.replace(/-/g, " ")} · {f.runtime}</p>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Social Links */}
        {Object.values(creator.socialLinks).some(Boolean) && (
          <section>
            <p className="mb-4 text-[10px] font-semibold uppercase tracking-[0.3em] text-gray-400">Links</p>
            <div className="flex flex-wrap gap-3">
              {creator.socialLinks.website && (
                <a href={creator.socialLinks.website} target="_blank" rel="noopener noreferrer" className="text-xs text-[#C9A84C] hover:underline">
                  Website ↗
                </a>
              )}
              {creator.socialLinks.twitter && (
                <a href={creator.socialLinks.twitter} target="_blank" rel="noopener noreferrer" className="text-xs text-gray-400 hover:text-white transition-colors">
                  Twitter ↗
                </a>
              )}
              {creator.socialLinks.youtube && (
                <a href={creator.socialLinks.youtube} target="_blank" rel="noopener noreferrer" className="text-xs text-gray-400 hover:text-white transition-colors">
                  YouTube ↗
                </a>
              )}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
