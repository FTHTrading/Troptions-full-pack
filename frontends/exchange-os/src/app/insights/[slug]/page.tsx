import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getInsightsPost, INSIGHTS_POSTS } from '@/data/insightsPosts';
import type { Metadata } from 'next';

export async function generateStaticParams() {
  return INSIGHTS_POSTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getInsightsPost(slug);
  if (!post) return { title: 'Post Not Found | TROPTIONS' };
  return {
    title: `${post.title} | TROPTIONS Insights`,
    description: post.excerpt,
    keywords: post.keywords,
  };
}

export default async function InsightsPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getInsightsPost(slug);
  if (!post) notFound();

  return (
    <div style={{ maxWidth: 780, margin: '0 auto', padding: '2rem 1.5rem', fontFamily: 'var(--font-geist-sans, sans-serif)' }}>
      {/* Breadcrumb */}
      <div style={{ fontSize: '0.78rem', color: '#6b7280', marginBottom: '1.5rem' }}>
        <Link href="/insights" style={{ color: '#9ca3af', textDecoration: 'none' }}>← Insights</Link>
        <span style={{ margin: '0 0.4rem' }}>/</span>
        <span>{post.category}</span>
      </div>

      {/* Draft badge */}
      {post.status === 'draft' && (
        <div style={{ background: '#1a1500', border: '1px solid #f59e0b33', borderRadius: 6, padding: '0.6rem 1rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ fontSize: '0.7rem', color: '#f59e0b', fontWeight: 700, letterSpacing: '0.1em' }}>DRAFT</span>
          <span style={{ fontSize: '0.75rem', color: '#9ca3af' }}>
            This post has not been reviewed for public distribution. Human review required before publishing.
          </span>
        </div>
      )}

      {/* Header */}
      <p style={{ fontSize: '0.72rem', color: '#c4a84a', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
        {post.category}
      </p>
      <h1 style={{ fontSize: '1.85rem', fontWeight: 700, color: '#e8e0d0', marginBottom: '0.75rem', lineHeight: 1.3 }}>
        {post.title}
      </h1>
      <div style={{ display: 'flex', gap: '1.25rem', fontSize: '0.78rem', color: '#6b7280', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        <span>{post.date}</span>
        <span>{post.readingTime} read</span>
        <span>Audience: {post.audience}</span>
      </div>

      {/* Disclaimer */}
      <div style={{ background: '#0d1a0d', border: '1px solid #1a3a1a', borderRadius: 8, padding: '0.85rem 1.1rem', marginBottom: '2rem' }}>
        <p style={{ fontSize: '0.75rem', color: '#6b7280', margin: 0, lineHeight: 1.6 }}>
          <strong style={{ color: '#9ca3af' }}>Disclaimer:</strong> {post.disclaimer}
        </p>
      </div>

      {/* Excerpt / body */}
      <div style={{ color: '#9ca3af', lineHeight: 1.8, fontSize: '0.95rem' }}>
        <p style={{ marginBottom: '1.5rem', color: '#c8bfb0', fontSize: '1.05rem', lineHeight: 1.7 }}>
          {post.excerpt}
        </p>
        {post.body ? (
          <div dangerouslySetInnerHTML={{ __html: post.body }} />
        ) : (
          <div style={{ background: '#0d1526', border: '1px solid #1e3058', borderRadius: 8, padding: '1.5rem', color: '#6b7280', fontSize: '0.85rem' }}>
            Full article body is pending human review and will be published when approved.
          </div>
        )}
      </div>

      {/* Tags */}
      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '2rem' }}>
        {post.tags.map((tag) => (
          <span key={tag} style={{ fontSize: '0.72rem', padding: '0.2rem 0.6rem', background: '#0d1526', border: '1px solid #1e3058', borderRadius: 4, color: '#6b7280' }}>
            #{tag}
          </span>
        ))}
      </div>

      <div style={{ marginTop: '2.5rem', paddingTop: '1.5rem', borderTop: '1px solid #1e3058' }}>
        <Link href="/insights" style={{ color: '#9ca3af', textDecoration: 'none', fontSize: '0.85rem' }}>
          ← Back to Insights
        </Link>
      </div>
    </div>
  );
}
