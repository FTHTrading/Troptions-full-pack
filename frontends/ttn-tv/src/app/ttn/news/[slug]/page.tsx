import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { TTN_BLOG_POSTS, getBlogPost } from "@/content/ttn/blogRegistry";
import { TTN_CREATORS } from "@/content/ttn/creatorRegistry";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return TTN_BLOG_POSTS.filter((p) => p.status === "published").map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) return { title: "Post Not Found" };
  return { title: post.seoTitle, description: post.seoDescription };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post || post.status !== "published") notFound();

  const author = TTN_CREATORS.find((c) => c.id === post.authorId);

  return (
    <article className="mx-auto max-w-3xl px-6 py-16">
      {/* Breadcrumb */}
      <nav className="mb-8 text-[10px] uppercase tracking-[0.2em] text-gray-500">
        <Link href="/ttn/news" className="hover:text-white transition-colors">Newsroom</Link>
        <span className="mx-2">/</span>
        <span className="text-white line-clamp-1">{post.title}</span>
      </nav>

      {/* Category + proof */}
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#C9A84C]">
          {post.category.replace(/-/g, " ")}
        </span>
        {post.proofCid && (
          <Link
            href={`/ttn/proof/${post.proofCid}`}
            className="rounded border border-[#C9A84C]/30 bg-[#C9A84C]/5 px-2 py-0.5 text-[9px] uppercase tracking-[0.1em] text-[#C9A84C] hover:bg-[#C9A84C]/10 transition-colors"
          >
            ⬡ IPFS Proof
          </Link>
        )}
      </div>

      <h1 className="mb-4 text-2xl font-bold leading-tight text-white sm:text-3xl">{post.title}</h1>
      <p className="mb-6 text-sm italic text-gray-300">{post.excerpt}</p>

      {/* Author + meta */}
      <div className="mb-10 flex items-center gap-3 border-b border-gray-800 pb-8">
        {author && (
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gray-800 text-sm font-bold text-white">
            {author.name.charAt(0)}
          </div>
        )}
        <div>
          {author && (
            <Link href={`/ttn/creators/${author.slug}`} className="text-xs font-medium text-white hover:text-[#C9A84C] transition-colors">
              {author.name}
            </Link>
          )}
          <p className="text-[10px] text-gray-500">
            <time dateTime={post.publishedAt}>
              {new Date(post.publishedAt).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </time>
            {" · "}
            {post.readingTimeMinutes} min read
          </p>
        </div>
      </div>

      {/* Body */}
      <div className="prose prose-invert prose-sm max-w-none">
        {post.content.split("\n\n").map((para, i) => (
          <p key={i} className="mb-4 text-sm leading-relaxed text-gray-300">
            {para}
          </p>
        ))}
      </div>

      {/* Tags */}
      {post.tags.length > 0 && (
        <div className="mt-10 flex flex-wrap gap-2 border-t border-gray-800 pt-8">
          {post.tags.map((tag) => (
            <span key={tag} className="rounded bg-gray-800 px-3 py-1 text-[10px] text-gray-400">
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Proof record */}
      {post.proofCid && (
        <div className="mt-8 rounded-xl border border-[#C9A84C]/20 bg-[#0D1520] p-5">
          <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.3em] text-[#C9A84C]">Content Fingerprint</p>
          <p className="font-mono text-[10px] text-gray-400 break-all">{post.proofCid}</p>
          <p className="mt-2 text-[10px] text-gray-600">
            IPFS CID — simulation only. Not a legal copyright registration.
          </p>
        </div>
      )}

      <div className="mt-10">
        <Link href="/ttn/news" className="text-xs uppercase tracking-[0.2em] text-gray-500 hover:text-white transition-colors">
          ← Back to Newsroom
        </Link>
      </div>
    </article>
  );
}
