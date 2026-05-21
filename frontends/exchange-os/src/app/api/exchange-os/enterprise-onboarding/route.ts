import { NextResponse } from 'next/server';
import { ENTERPRISE_ONBOARDING_STAGES } from '@/data/enterpriseClientOnboarding';

export const runtime = 'nodejs';

export async function GET() {
  const completed = ENTERPRISE_ONBOARDING_STAGES.filter(s => s.status === 'complete').length;
  const blocked = ENTERPRISE_ONBOARDING_STAGES.filter(s => s.status === 'blocked').length;
  const required = ENTERPRISE_ONBOARDING_STAGES.filter(s => s.status === 'required').length;

  return NextResponse.json({
    generatedAt: new Date().toISOString(),
    truthLabel: 'TROPTIONS Exchange OS is a partner readiness platform. It is not an exchange, broker-dealer, custodian, or investment adviser.',
    noCustodyDisclaimer: 'TROPTIONS does not hold, manage, or control client funds, tokens, or wallet keys.',
    summary: {
      total: ENTERPRISE_ONBOARDING_STAGES.length,
      completed,
      blocked,
      required,
      pending: ENTERPRISE_ONBOARDING_STAGES.filter(s => s.status === 'pending').length,
    },
    stages: ENTERPRISE_ONBOARDING_STAGES,
  });
}
