import { NextResponse } from 'next/server';
import { LANGUAGES } from '@/data/languages';

export const runtime = 'nodejs';

export function GET() {
  return NextResponse.json({
    ok: true,
    translation_status: LANGUAGES.map((l) => ({
      code: l.code,
      name: l.name,
      status: l.status,
      humanReviewRequired: l.status !== 'live',
      disclaimer: l.disclaimer,
    })),
    policy: {
      primaryLanguage: 'en',
      nonEnglishPolicy: 'human_review_required',
      machineTranslation: 'not_used_for_institutional_content',
      legalContent: 'English only — all other languages informational only',
    },
    note: 'Translation infrastructure is in development. All non-English content is pending human review.',
  });
}
