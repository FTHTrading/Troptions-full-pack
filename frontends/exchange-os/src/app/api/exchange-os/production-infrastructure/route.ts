import { NextResponse } from 'next/server';
import { PRODUCTION_INFRASTRUCTURE } from '@/data/productionInfrastructure';

export const runtime = 'nodejs';

export async function GET() {
  const byStatus = {
    active: PRODUCTION_INFRASTRUCTURE.filter(i => i.status === 'active').length,
    required: PRODUCTION_INFRASTRUCTURE.filter(i => i.status === 'required').length,
    planned: PRODUCTION_INFRASTRUCTURE.filter(i => i.status === 'planned').length,
    blocked: PRODUCTION_INFRASTRUCTURE.filter(i => i.status === 'blocked').length,
  };

  return NextResponse.json({
    generatedAt: new Date().toISOString(),
    truthLabel: 'Infrastructure status reflects actual provisioned state, not aspirational claims.',
    summary: { total: PRODUCTION_INFRASTRUCTURE.length, ...byStatus },
    items: PRODUCTION_INFRASTRUCTURE,
    criticalGaps: PRODUCTION_INFRASTRUCTURE.filter(i => i.status === 'required').map(i => ({
      id: i.id,
      title: i.title,
      requiredFor: i.requiredFor,
      clientImpact: i.clientImpact,
    })),
  });
}
