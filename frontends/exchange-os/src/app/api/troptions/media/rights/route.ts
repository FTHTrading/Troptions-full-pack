/**
 * TROPTIONS Media Rights & Signatures Simulation API
 * Route: /api/troptions/media/rights
 */

import { NextRequest, NextResponse } from 'next/server';
import { MediaRightsSignatureEngine } from '@/lib/troptions/mediaRightsSignatureEngine';

// Simulation engine (persists per deployment, resets on restart)
const rightsEngine = new MediaRightsSignatureEngine();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');

    if (action === 'summary') {
      return NextResponse.json({
        success: true,
        data: rightsEngine.generateSummary(),
      });
    }

    if (action === 'list') {
      const status = searchParams.get('status');
      const type = searchParams.get('type');

      let agreements: Array<{ id: string }> = Array.from(
        ((rightsEngine as unknown) as { agreements?: Map<string, { id: string }> }).agreements?.values() || [],
      );

      if (type) {
        agreements = rightsEngine.listByType(type as any);
      }
      if (status) {
        agreements = rightsEngine.listByStatus(status as any);
      }

      return NextResponse.json({
        success: true,
        data: {
          count: agreements.length,
          agreements: agreements.map((a) => rightsEngine.generateMediaReleasePacket(a.id)),
        },
      });
    }

    if (action === 'get') {
      const agreementId = searchParams.get('id');
      if (!agreementId) return NextResponse.json({ success: false, error: 'Agreement ID required' });

      return NextResponse.json({
        success: true,
        data: rightsEngine.generateMediaReleasePacket(agreementId),
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

    if (action === 'create_agreement') {
      const agreement = rightsEngine.createRightsAgreement(
        data.agreementType,
        data.agreementTitle,
        data.relatedEntityId,
        data.relatedEntityName,
        data.requiredSignatures,
        data.governorConsentRequired || false
      );

      return NextResponse.json({
        success: true,
        simulationOnly: true,
        data: rightsEngine.generateMediaReleasePacket(agreement.id),
      });
    }

    if (action === 'collect_signature') {
      const result = rightsEngine.collectSignature(
        data.agreementId,
        data.signatoryId,
        data.signatoryName,
        data.signatoryRole,
        data.signatureHash,
        data.publicKey
      );

      return NextResponse.json({
        success: result.success,
        simulationOnly: true,
        error: result.error,
        data: result.success
          ? rightsEngine.generateMediaReleasePacket(data.agreementId)
          : undefined,
      });
    }

    if (action === 'record_guardian_consent') {
      const result = rightsEngine.recordGuardianConsent(
        data.agreementId,
        data.guardianName,
        data.consentHash
      );

      return NextResponse.json({
        success: result.success,
        simulationOnly: true,
        error: result.error,
      });
    }

    if (action === 'execute_agreement') {
      const result = rightsEngine.executeAgreement(data.agreementId);

      return NextResponse.json({
        success: result.success,
        simulationOnly: true,
        error: result.error,
        data: result.success
          ? rightsEngine.generateMediaReleasePacket(data.agreementId)
          : undefined,
      });
    }

    if (action === 'revoke_agreement') {
      const result = rightsEngine.revokeAgreement(data.agreementId, data.reason);

      return NextResponse.json({
        success: result.success,
        simulationOnly: true,
        error: result.error,
      });
    }

    if (action === 'block_agreement') {
      const result = rightsEngine.blockAgreement(data.agreementId, data.reason);

      return NextResponse.json({
        success: result.success,
        simulationOnly: true,
        error: result.error,
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
