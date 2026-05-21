/**
 * TROPTIONS Sponsor Campaign Simulation API
 * Route: /api/troptions/nil/campaigns
 */

import { NextRequest, NextResponse } from 'next/server';
import { SponsorCampaignEngine } from '@/lib/troptions/sponsorCampaignEngine';

// Simulation engine (persists per deployment, resets on restart)
const campaignEngine = new SponsorCampaignEngine();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');

    if (action === 'summary') {
      return NextResponse.json({
        success: true,
        data: campaignEngine.generateSummary(),
      });
    }

    if (action === 'list') {
      const status = searchParams.get('status');
      const campaigns: Array<{ id: string }> = status
        ? campaignEngine.listByStatus(status as any)
        : Array.from(((campaignEngine as unknown) as { campaigns?: Map<string, { id: string }> }).campaigns?.values() || []);

      return NextResponse.json({
        success: true,
        data: {
          count: campaigns.length,
          campaigns: campaigns.map((c) => campaignEngine.generateSponsorPacketSummary(c.id)),
        },
      });
    }

    if (action === 'get') {
      const campaignId = searchParams.get('id');
      if (!campaignId) return NextResponse.json({ success: false, error: 'Campaign ID required' });

      return NextResponse.json({
        success: true,
        data: campaignEngine.generateSponsorPacketSummary(campaignId),
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

    if (action === 'create_campaign') {
      const campaign = campaignEngine.createSponsorCampaign(
        data.campaignName,
        data.sponsorName,
        data.creatorId,
        data.creatorName,
        data.campaignType,
        data.campaignValue
      );

      return NextResponse.json({
        success: true,
        simulationOnly: true,
        data: campaignEngine.generateSponsorPacketSummary(campaign.id),
      });
    }

    if (action === 'add_deliverable') {
      const result = campaignEngine.addDeliverable(
        data.campaignId,
        data.description,
        new Date(data.dueDate)
      );

      return NextResponse.json({
        success: result.success,
        simulationOnly: true,
        error: result.error,
        deliverableId: result.deliverableId,
      });
    }

    if (action === 'mark_deliverable_completed') {
      const result = campaignEngine.markDeliverableCompleted(
        data.campaignId,
        data.deliverableId,
        data.proofHash
      );

      return NextResponse.json({
        success: result.success,
        simulationOnly: true,
        error: result.error,
        data: result.success
          ? campaignEngine.generateSponsorPacketSummary(data.campaignId)
          : undefined,
      });
    }

    if (action === 'attach_agreement') {
      const result = campaignEngine.attachCampaignAgreement(data.campaignId, data.agreementHash);

      return NextResponse.json({
        success: result.success,
        simulationOnly: true,
        error: result.error,
      });
    }

    if (action === 'attach_proof') {
      const result = campaignEngine.attachProofOfPerformance(data.campaignId, data.proofHash);

      return NextResponse.json({
        success: result.success,
        simulationOnly: true,
        error: result.error,
      });
    }

    if (action === 'update_status') {
      const result = campaignEngine.updateCampaignStatus(data.campaignId, data.newStatus);

      return NextResponse.json({
        success: result.success,
        simulationOnly: true,
        error: result.error,
        data: result.success
          ? campaignEngine.generateSponsorPacketSummary(data.campaignId)
          : undefined,
      });
    }

    if (action === 'evaluate_payment_readiness') {
      const campaign = campaignEngine.getCampaign(data.campaignId);
      if (!campaign) {
        return NextResponse.json({ success: false, error: 'Campaign not found' });
      }

      const { ready, blockers, allDeliverables } = campaignEngine['evaluatePaymentReadiness'](
        data.campaignId
      );

      return NextResponse.json({
        success: true,
        data: {
          campaignId: data.campaignId,
          paymentReady: ready,
          paymentReadinessBlockers: blockers,
          deliverablesStatus: allDeliverables,
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
