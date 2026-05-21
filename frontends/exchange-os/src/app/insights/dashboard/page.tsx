import Link from 'next/link';
import { INSIGHTS_POSTS } from '@/data/insightsPosts';
import { KEYWORD_CLUSTERS } from '@/data/keywordStrategy';
import { X402_PRODUCTS } from '@/data/x402Products';
import { LANGUAGES } from '@/data/languages';
import { AGENT_REGISTRY } from '@/data/agentRegistry';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Intelligence Dashboard | TROPTIONS',
  description: 'Enterprise intelligence overview: keyword coverage, insights, x402 reports, language coverage, and agent availability.',
};

function StatCard({ label, value, sub, color }: { label: string; value: string | number; sub?: string; color?: string }) {
  return (
    <div style={{ background: '#0d1526', border: '1px solid #1e3058', borderRadius: 8, padding: '1.1rem 1.25rem' }}>
      <div style={{ fontSize: '0.62rem', color: '#6b7280', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '0.4rem' }}>{label}</div>
      <div style={{ fontSize: '1.5rem', fontWeight: 700, color: color ?? '#e8e0d0', lineHeight: 1 }}>{value}</div>
      {sub && <div style={{ fontSize: '0.72rem', color: '#6b7280', marginTop: '0.3rem' }}>{sub}</div>}
    </div>
  );
}

export default function InsightsDashboardPage() {
  const draftCount = INSIGHTS_POSTS.filter((p) => p.status === 'draft').length;
  const publishedCount = INSIGHTS_POSTS.filter((p) => p.status === 'published').length;
  const monetizableReports = X402_PRODUCTS.filter((p) => p.requiresPayment && p.status === 'x402_gated');
  const highPriorityKeywords = KEYWORD_CLUSTERS.filter((c) => c.priority === 'high');
  const liveLangs = LANGUAGES.filter((l) => l.status === 'live').length;
  const demoAgents = AGENT_REGISTRY.filter((a) => a.status === 'demo').length;

  const BLOCKERS = [
    { label: 'x402 Live Payments', status: 'gated', note: 'Wallet infrastructure + Cloudflare bindings required' },
    { label: 'RAG Search', status: 'demo', note: 'Vectorize index not configured' },
    { label: 'Multilingual Content', status: 'human_review', note: 'Non-English content pending review' },
    { label: 'AI Production', status: 'demo', note: 'Cloudflare Workers AI binding not configured' },
  ];

  const BLOCKER_COLORS: Record<string, string> = {
    gated: '#f59e0b',
    demo: '#c4a84a',
    human_review: '#6b7280',
  };

  return (
    <div style={{ maxWidth: 1024, margin: '0 auto', padding: '2rem 1.5rem', fontFamily: 'var(--font-geist-sans, sans-serif)' }}>
      <p style={{ fontSize: '0.75rem', color: '#c4a84a', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
        Enterprise Intelligence
      </p>
      <h1 style={{ fontSize: '2rem', fontWeight: 700, color: '#e8e0d0', marginBottom: '0.5rem' }}>
        Intelligence Dashboard
      </h1>
      <p style={{ color: '#9ca3af', marginBottom: '2rem', fontSize: '0.88rem' }}>
        Not investment advice. Infrastructure readiness overview only.
      </p>

      {/* Stats grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '0.75rem', marginBottom: '2.5rem' }}>
        <StatCard label="Insights Total" value={INSIGHTS_POSTS.length} sub={`${draftCount} draft · ${publishedCount} published`} />
        <StatCard label="AI Agents" value={AGENT_REGISTRY.length} sub={`${demoAgents} in demo`} color="#c4a84a" />
        <StatCard label="Keyword Clusters" value={KEYWORD_CLUSTERS.length} sub={`${highPriorityKeywords.length} high priority`} color="#60a5fa" />
        <StatCard label="x402 Reports" value={monetizableReports.length} sub="payment-gated" color="#22c55e" />
        <StatCard label="Languages" value={LANGUAGES.length} sub={`${liveLangs} live`} color="#a78bfa" />
        <StatCard label="SEO Pages" value={16} sub="covered" color="#34d399" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2.5rem' }}>
        {/* Recent insights */}
        <div>
          <h2 style={{ fontSize: '0.82rem', color: '#9ca3af', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>Recent Insights</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {INSIGHTS_POSTS.slice(0, 5).map((post) => (
              <Link key={post.slug} href={`/insights/${post.slug}`} style={{ textDecoration: 'none', display: 'block', background: '#0d1526', border: '1px solid #1e3058', borderRadius: 6, padding: '0.75rem 1rem' }}>
                <div style={{ fontSize: '0.82rem', color: '#e8e0d0', marginBottom: '0.2rem', lineHeight: 1.3 }}>{post.title}</div>
                <div style={{ display: 'flex', gap: '0.75rem', fontSize: '0.68rem', color: '#6b7280' }}>
                  <span>{post.category}</span>
                  <span style={{ color: '#f59e0b' }}>{post.status.toUpperCase()}</span>
                  <span>{post.date}</span>
                </div>
              </Link>
            ))}
          </div>
          <Link href="/insights" style={{ display: 'block', marginTop: '0.5rem', fontSize: '0.78rem', color: '#c4a84a', textDecoration: 'none' }}>
            View all insights →
          </Link>
        </div>

        {/* x402 monetizable */}
        <div>
          <h2 style={{ fontSize: '0.82rem', color: '#9ca3af', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>x402 Monetizable Reports</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {monetizableReports.map((p) => (
              <div key={p.id} style={{ background: '#0d1526', border: '1px solid #1e3058', borderRadius: 6, padding: '0.75rem 1rem' }}>
                <div style={{ fontSize: '0.82rem', color: '#e8e0d0', marginBottom: '0.2rem' }}>{p.title}</div>
                <div style={{ display: 'flex', gap: '0.75rem', fontSize: '0.68rem', color: '#6b7280' }}>
                  <span style={{ color: '#c4a84a', fontWeight: 700 }}>${p.priceUsd} {p.currency}</span>
                  <span>{p.network}</span>
                </div>
              </div>
            ))}
          </div>
          <Link href="/x402/catalog" style={{ display: 'block', marginTop: '0.5rem', fontSize: '0.78rem', color: '#c4a84a', textDecoration: 'none' }}>
            View x402 catalog →
          </Link>
        </div>
      </div>

      {/* Top keywords */}
      <div style={{ marginBottom: '2.5rem' }}>
        <h2 style={{ fontSize: '0.82rem', color: '#9ca3af', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
          SEO Coverage — High Priority Clusters
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '0.75rem' }}>
          {highPriorityKeywords.map((cluster) => (
            <div key={cluster.id} style={{ background: '#0d1526', border: '1px solid #1e3058', borderRadius: 8, padding: '1rem' }}>
              <div style={{ fontSize: '0.78rem', color: '#60a5fa', fontWeight: 600, marginBottom: '0.3rem' }}>{cluster.name}</div>
              <div style={{ fontSize: '0.8rem', color: '#c4a84a', marginBottom: '0.5rem' }}>{cluster.primaryKeyword}</div>
              <div style={{ fontSize: '0.7rem', color: '#6b7280' }}>{cluster.supportingKeywords.slice(0, 3).join(' · ')}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Blockers */}
      <div style={{ marginBottom: '2.5rem' }}>
        <h2 style={{ fontSize: '0.82rem', color: '#9ca3af', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
          Production Blockers
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {BLOCKERS.map((b) => (
            <div key={b.label} style={{ display: 'flex', gap: '1rem', alignItems: 'center', background: '#0d1526', border: '1px solid #1e3058', borderRadius: 6, padding: '0.7rem 1rem' }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: BLOCKER_COLORS[b.status] ?? '#6b7280', flexShrink: 0 }} />
              <div style={{ fontSize: '0.82rem', color: '#e8e0d0', flexShrink: 0, minWidth: 180 }}>{b.label}</div>
              <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>{b.note}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Language coverage */}
      <div style={{ marginBottom: '2.5rem' }}>
        <h2 style={{ fontSize: '0.82rem', color: '#9ca3af', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
          Language Coverage ({LANGUAGES.length} total)
        </h2>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {LANGUAGES.map((l) => (
            <span key={l.code} style={{ fontSize: '0.72rem', padding: '0.25rem 0.6rem', borderRadius: 4, background: '#0d1526', border: `1px solid ${l.status === 'live' ? '#22c55e44' : '#1e3058'}`, color: l.status === 'live' ? '#22c55e' : '#6b7280' }}>
              {l.code.toUpperCase()} · {l.status}
            </span>
          ))}
        </div>
      </div>

      {/* Agent finder CTA */}
      <div style={{ background: 'linear-gradient(135deg, #0d1526 0%, #111a2e 100%)', border: '1px solid #1e3058', borderRadius: 10, padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ fontSize: '1rem', fontWeight: 600, color: '#e8e0d0', marginBottom: '0.3rem' }}>Find the Right AI Agent</div>
          <div style={{ fontSize: '0.82rem', color: '#9ca3af' }}>{AGENT_REGISTRY.length} agents · Demo mode · Read-only</div>
        </div>
        <Link href="/agents/finder" style={{ display: 'inline-block', padding: '0.6rem 1.25rem', background: '#c4a84a', color: '#000', borderRadius: 6, fontWeight: 700, fontSize: '0.85rem', textDecoration: 'none', whiteSpace: 'nowrap' }}>
          Agent Finder →
        </Link>
      </div>
    </div>
  );
}
