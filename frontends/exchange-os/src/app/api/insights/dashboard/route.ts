import { NextResponse } from 'next/server';
import { INSIGHTS_POSTS } from '@/data/insightsPosts';
import { KEYWORD_CLUSTERS, BANNED_KEYWORD_PHRASES } from '@/data/keywordStrategy';
import { X402_PRODUCTS } from '@/data/x402Products';
import { LANGUAGES } from '@/data/languages';
import { AGENT_REGISTRY } from '@/data/agentRegistry';

export const runtime = 'nodejs';

export function GET() {
  const topKeywords = KEYWORD_CLUSTERS
    .filter((c) => c.priority === 'high')
    .flatMap((c) => [c.primaryKeyword, ...c.supportingKeywords.slice(0, 2)]);

  const monetizableReports = X402_PRODUCTS.filter((p) => p.requiresPayment && p.status === 'x402_gated');
  const recentInsights = INSIGHTS_POSTS.slice(0, 5);

  return NextResponse.json({
    ok: true,
    summary: {
      insights_total: INSIGHTS_POSTS.length,
      insights_draft: INSIGHTS_POSTS.filter((p) => p.status === 'draft').length,
      insights_published: INSIGHTS_POSTS.filter((p) => p.status === 'published').length,
      agents_total: AGENT_REGISTRY.length,
      agents_demo: AGENT_REGISTRY.filter((a) => a.status === 'demo').length,
      keyword_clusters: KEYWORD_CLUSTERS.length,
      banned_phrases: BANNED_KEYWORD_PHRASES.length,
      languages_total: LANGUAGES.length,
      languages_live: LANGUAGES.filter((l) => l.status === 'live').length,
      monetizable_reports: monetizableReports.length,
      seo_pages_covered: 16,
    },
    recent_insights: recentInsights.map((p) => ({
      slug: p.slug,
      title: p.title,
      category: p.category,
      status: p.status,
      date: p.date,
    })),
    top_keywords: topKeywords.slice(0, 12),
    monetizable_reports: monetizableReports.map((p) => ({
      id: p.id,
      title: p.title,
      priceUsd: p.priceUsd,
      currency: p.currency,
      status: p.status,
    })),
    blockers: {
      x402_live_payments: 'Wallet infrastructure and Cloudflare bindings not configured',
      rag_search: 'Vectorize index not configured',
      multilingual_content: 'Non-English content pending human review',
      ai_production: 'Cloudflare Workers AI binding not configured',
    },
    agent_finder_cta: '/agents/finder',
    disclaimer:
      'TROPTIONS provides intelligence infrastructure only. Not investment advice, brokerage, or exchange operation.',
    updated: new Date().toISOString(),
  });
}
