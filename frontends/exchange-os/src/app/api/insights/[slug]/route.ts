import { NextResponse } from 'next/server';
import { getInsightsPost } from '@/data/insightsPosts';

export const runtime = 'nodejs';

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const post = getInsightsPost(slug);
  if (!post) {
    return NextResponse.json({ ok: false, error: 'post_not_found' }, { status: 404 });
  }
  return NextResponse.json({
    ok: true,
    post,
    disclaimer: post.disclaimer,
    draft_note:
      post.status === 'draft'
        ? 'This post is in draft status and has not been reviewed for public distribution.'
        : undefined,
  });
}
