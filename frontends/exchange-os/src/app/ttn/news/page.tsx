import type { Metadata } from "next";
import { getPublishedPosts } from "@/content/ttn/blogRegistry";
import { BlogCard } from "@/components/ttn/BlogCard";

export const metadata: Metadata = {
  title: "Newsroom",
  description: "The latest news, press releases, and ecosystem updates from Troptions Television Network.",
};

export default function NewsPage() {
  const posts = getPublishedPosts();

  return (
    <div className="mx-auto max-w-7xl px-6 py-16">
      <div className="mb-12">
        <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.3em] text-[#C9A84C]">TTN Newsroom</p>
        <h1 className="text-3xl font-bold text-white">News & Articles</h1>
        <p className="mt-3 max-w-xl text-sm text-gray-400">
          Press releases, creator updates, ecosystem deep-dives, and educational content from TTN.
        </p>
      </div>

      {posts.length > 0 ? (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <BlogCard key={post.id} post={post} />
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-dashed border-gray-700 p-16 text-center text-sm text-gray-500">
          No published posts yet.
        </div>
      )}
    </div>
  );
}
