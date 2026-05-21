/**
 * TROPTIONS NIL Creator Simulation API
 * Route: /api/troptions/nil/creators
 */

import { NextRequest, NextResponse } from 'next/server';
import { NilCreatorEngine } from '@/lib/troptions/nilCreatorEngine';

// Simulation engine (persists per deployment, resets on restart)
const creatorEngine = new NilCreatorEngine();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');

    if (action === 'summary') {
      return NextResponse.json({
        success: true,
        data: creatorEngine.generateSummary(),
      });
    }

    if (action === 'list') {
      const status = searchParams.get('status');
      const creators: Array<{ id: string }> = status
        ? creatorEngine.listByStatus(status as any)
        : Array.from(((creatorEngine as unknown) as { creators?: Map<string, { id: string }> }).creators?.values() || []);

      return NextResponse.json({
        success: true,
        data: {
          count: creators.length,
          creators: creators.map((c) => creatorEngine.generateCreatorMediaKitSummary(c.id)),
        },
      });
    }

    if (action === 'get') {
      const creatorId = searchParams.get('id');
      if (!creatorId) return NextResponse.json({ success: false, error: 'Creator ID required' });

      return NextResponse.json({
        success: true,
        data: creatorEngine.generateCreatorMediaKitSummary(creatorId),
      });
    }

    return NextResponse.json({ success: false, error: 'No action specified' });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: String(error) },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, data } = body;

    if (action === 'create_creator') {
      const creator = creatorEngine.createCreatorProfile(
        data.name,
        data.creatorType,
        data.ageGroup
      );

      return NextResponse.json({
        success: true,
        simulationOnly: true,
        data: creatorEngine.generateCreatorMediaKitSummary(creator.id),
      });
    }

    if (action === 'attach_evidence') {
      const success = creatorEngine.attachCreatorEvidence(
        data.creatorId,
        data.evidenceType,
        data.hash,
        data.source
      );

      return NextResponse.json({
        success,
        simulationOnly: true,
        message: success ? 'Evidence attached' : 'Creator not found',
      });
    }

    if (action === 'record_guardian_consent') {
      const result = creatorEngine.recordGuardianConsent(
        data.creatorId,
        data.guardianName,
        data.relationship,
        data.consentHash
      );

      return NextResponse.json({
        success: result.success,
        simulationOnly: true,
        error: result.error,
        data: result.success
          ? creatorEngine.generateCreatorMediaKitSummary(data.creatorId)
          : undefined,
      });
    }

    if (action === 'update_status') {
      const result = creatorEngine.updateCreatorStatus(data.creatorId, data.newStatus);

      return NextResponse.json({
        success: result.success,
        simulationOnly: true,
        error: result.error,
        data: result.success
          ? creatorEngine.generateCreatorMediaKitSummary(data.creatorId)
          : undefined,
      });
    }

    if (action === 'verify_readiness') {
      const creator = creatorEngine.getCreator(data.creatorId);
      if (!creator) {
        return NextResponse.json({ success: false, error: 'Creator not found' });
      }

      const { ready, blockers } = creatorEngine['verifyCreatorReadiness'](data.creatorId);

      return NextResponse.json({
        success: true,
        data: {
          creatorId: data.creatorId,
          campaignReady: ready,
          readinessBlockers: blockers,
          simulationOnly: true,
        },
      });
    }

    return NextResponse.json({ success: false, error: 'No valid action' });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: String(error) },
      { status: 400 }
    );
  }
}
