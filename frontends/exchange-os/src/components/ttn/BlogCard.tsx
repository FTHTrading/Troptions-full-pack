import type { BlogPost } from "@/content/ttn/blogRegistry";
import Link from "next/link";

interface Props {
  post: BlogPost;
}

const CATEGORY_COLORS: Record<string, string> = {
  news: "text-blue-400",
  "press-release": "text-[#C9A84C]",
  "creator-update": "text-purple-400",
  ecosystem: "text-teal-400",
  education: "text-green-400",
  "sponsor-story": "text-orange-400",
  research: "text-pink-400",
  opinion: "text-gray-400",
  "event-recap": "text-indigo-400",
};

export function BlogCard({ post }: Props) {
  const catColor = CATEGORY_COLORS[post.category] ?? "text-gray-400";

  return (
    <Link href={`/ttn/news/${post.slug}`} className="group block">
      <article className="rounded-xl border border-gray-800 bg-[#0F1923] p-5 transition-all duration-200 hover:border-[#C9A84C]/30 hover:shadow-lg hover:shadow-[#C9A84C]/5">
        <div className="mb-3 flex items-center justify-between">
          <span className={`text-[10px] font-semibold uppercase tracking-[0.2em] ${catColor}`}>
            {post.category.replace(/-/g, " ")}
          </span>
          {post.proofCid && (
            <span className="rounded border border-[#C9A84C]/30 bg-[#C9A84C]/5 px-1.5 py-0.5 text-[9px] uppercase tracking-[0.1em] text-[#C9A84C]">
              Proof
            </span>
          )}
        </div>

        <h3 className="mb-2 text-sm font-semibold leading-snug text-white group-hover:text-[#C9A84C] transition-colors line-clamp-2">
          {post.title}
        </h3>
        <p className="mb-4 text-xs text-gray-400 line-clamp-2 leading-relaxed">{post.excerpt}</p>

        <div className="flex items-center justify-between text-[10px] text-gray-500">
          <time dateTime={post.publishedAt}>
            {new Date(post.publishedAt).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </time>
          <span>{post.readingTimeMinutes} min read</span>
        </div>
      </article>
    </Link>
  );
}
