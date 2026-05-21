import { NextResponse } from 'next/server';
import { INSIGHTS_POSTS } from '@/data/insightsPosts';

export const runtime = 'nodejs';

export function GET() {
  return NextResponse.json({
    ok: true,
    posts: INSIGHTS_POSTS,
    count: INSIGHTS_POSTS.length,
    draft_count: INSIGHTS_POSTS.filter((p) => p.status === 'draft').length,
    published_count: INSIGHTS_POSTS.filter((p) => p.status === 'published').length,
    note: 'All posts are currently in draft status. Human review required before publishing.',
    disclaimer:
      'All TROPTIONS insights are for informational purposes only. Not investment advice.',
  });
}
