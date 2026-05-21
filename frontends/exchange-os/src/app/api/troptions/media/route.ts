/**
 * GET /api/troptions/media/shows
 * GET /api/troptions/media/episodes
 * POST /api/troptions/media/episodes
 * GET /api/troptions/media/episodes/[id]
 * POST /api/troptions/media/episodes/[id]/publish
 */

import { getActiveTnnShows, getTnnShow, TNN_DISCLAIMER, type TnnShowId } from "@/lib/troptions/tnnShowRegistry";
import { TnnContentEngine } from "@/lib/troptions/tnnContentEngine";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const action = url.searchParams.get("action");

  // GET /api/troptions/media/shows
  if (action === "shows" || url.pathname.includes("/shows")) {
    return Response.json({
      shows: getActiveTnnShows(),
      totalShows: getActiveTnnShows().length,
      disclaimer: TNN_DISCLAIMER,
      simulationOnly: true,
    });
  }

  // GET /api/troptions/media/episodes
  if (action === "episodes" || url.pathname.includes("/episodes")) {
    const showId = url.searchParams.get("showId");
    const status = url.searchParams.get("status");

    // Return mock episodes (would query database in production)
    const mockEpisodes = [
      {
        id: "ep-001",
        showId: "troptions-founder-files",
        showName: "TROPTIONS Founder Files",
        episodeNumber: 1,
        episodeTitle: "The TROPTIONS Story",
        guestType: "FOUNDER",
        guestName: "Bryan/Garland",
        status: "DRAFT",
        guestReleaseHash: undefined,
        sponsorAgreementHash: undefined,
        evidence: [],
        riskFlags: [],
        createdAt: new Date().toISOString(),
        publishedStatus: "NEEDS_RELEASE",
      },
      {
        id: "ep-002",
        showId: "web3-made-simple",
        showName: "Web3 Made Simple",
        episodeNumber: 1,
        episodeTitle: "What is a Wallet?",
        guestType: "EDUCATOR",
        guestName: "TROPTIONS Team",
        status: "DRAFT",
        guestReleaseHash: "hash_012345",
        evidence: [
          {
            type: "guest_release",
            hash: "hash_012345",
            attachedAt: new Date().toISOString(),
          },
        ],
        riskFlags: [],
        createdAt: new Date().toISOString(),
        publishedStatus: "READY_TO_PUBLISH",
      },
    ];

    let episodes = mockEpisodes;
    if (showId) episodes = episodes.filter((e) => e.showId === showId);
    if (status) episodes = episodes.filter((e) => e.status === status);

    return Response.json({
      episodes,
      totalCount: episodes.length,
      disclaimer: TNN_DISCLAIMER,
      simulationOnly: true,
    });
  }

  // GET /api/troptions/media/summary
  if (action === "summary") {
    return Response.json({
      totalShows: getActiveTnnShows().length,
      shows: getActiveTnnShows().map((s) => ({
        id: s.showId,
        name: s.displayName,
        status: s.status,
      })),
      disclaimer:
        "TROPTIONS Media is simulation-only. All guest releases and sponsor agreements are collected for planning purposes.",
      simulationOnly: true,
    });
  }

  return Response.json({ error: "Invalid action" }, { status: 400 });
}

export async function POST(request: Request) {
  const body = await request.json();
  const { action, showId, title, guestType, guestName, episodeNumber } = body;
  const tnnEngine = new TnnContentEngine();

  // POST /api/troptions/media/episodes
  if (action === "create-episode") {
    if (!showId || !title || !guestType || !guestName || !episodeNumber) {
      return Response.json(
        { error: "Missing required fields: showId, title, guestType, guestName, episodeNumber" },
        { status: 400 }
      );
    }

    const show = getTnnShow(showId as TnnShowId);
    if (!show) {
      return Response.json({ error: `Show not found: ${showId}` }, { status: 404 });
    }

    const episode = tnnEngine.createEpisodeRecord(show.displayName, episodeNumber, title, guestType, guestName);

    return Response.json({
      episode,
      disclaimer: TNN_DISCLAIMER,
      nextStep: "Attach guest release and sponsor agreement before publishing",
      simulationOnly: true,
    });
  }

  // POST /api/troptions/media/episodes/[id]/attach-release
  if (action === "attach-release") {
    const { episodeId, releaseHash, releaseUrl } = body;
    if (!episodeId || !releaseHash) {
      return Response.json({ error: "Missing episodeId or releaseHash" }, { status: 400 });
    }

    const success = tnnEngine.attachEpisodeEvidence(episodeId, "guest_release", releaseHash, releaseUrl);

    return Response.json({
      success,
      message: success ? "Guest release attached successfully" : "Failed to attach release",
      nextStep: success ? "Episode is now ready to publish" : "Check episode ID",
      simulationOnly: true,
    });
  }

  // POST /api/troptions/media/episodes/[id]/publish
  if (action === "publish") {
    const { episodeId } = body;
    if (!episodeId) {
      return Response.json({ error: "Missing episodeId" }, { status: 400 });
    }

    const result = tnnEngine.updateEpisodeStatus(episodeId, "PUBLISHED");

    return Response.json({
      success: result.success,
      error: result.error,
      message: result.success
        ? "Episode published successfully (simulation only)"
        : `Cannot publish: ${result.error}`,
      simulationOnly: true,
    });
  }

  return Response.json({ error: "Invalid action" }, { status: 400 });
}
