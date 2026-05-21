/**
 * TROPTIONS Web3 TV / Media Simulation API
 * Route: /api/troptions/media/episodes
 */

import { NextRequest, NextResponse } from 'next/server';
import { TnnContentEngine } from '@/lib/troptions/tnnContentEngine';

// Simulation engine (persists per deployment, resets on restart)
const mediaEngine = new TnnContentEngine();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');

    if (action === 'summary') {
      return NextResponse.json({
        success: true,
        data: mediaEngine.generateSummary(),
      });
    }

    if (action === 'list') {
      const status = searchParams.get('status');
      const episodes: Array<{ id: string }> = status
        ? mediaEngine.listByStatus(status as any)
        : Array.from(((mediaEngine as unknown) as { episodes?: Map<string, { id: string }> }).episodes?.values() || []);

      return NextResponse.json({
        success: true,
        data: {
          count: episodes.length,
          episodes: episodes.map((ep) => mediaEngine.generateEpisodePacketSummary(ep.id)),
        },
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

    if (action === 'create_episode') {
      const episode = mediaEngine.createEpisodeRecord(
        data.showName,
        data.episodeNumber,
        data.title,
        data.guestType,
        data.guestName
      );

      return NextResponse.json({
        success: true,
        simulationOnly: true,
        data: mediaEngine.generateEpisodePacketSummary(episode.id),
      });
    }

    if (action === 'attach_evidence') {
      const success = mediaEngine.attachEpisodeEvidence(
        data.episodeId,
        data.evidenceType,
        data.hash,
        data.source
      );

      return NextResponse.json({
        success,
        simulationOnly: true,
        message: success ? 'Evidence attached' : 'Episode not found',
      });
    }

    if (action === 'update_status') {
      const result = mediaEngine.updateEpisodeStatus(data.episodeId, data.newStatus);

      return NextResponse.json({
        success: result.success,
        simulationOnly: true,
        error: result.error,
        data: result.success
          ? mediaEngine.generateEpisodePacketSummary(data.episodeId)
          : undefined,
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
