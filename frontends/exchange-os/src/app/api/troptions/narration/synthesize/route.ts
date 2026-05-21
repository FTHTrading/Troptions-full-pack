import { NextRequest, NextResponse } from "next/server";
import { deepgramTextToSpeech } from "@/lib/troptions/deepgramVoiceService";

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as {
      text: string;
      voice?: string;
      segmentId?: string;
      pageId?: string;
    };

    const { text, voice, segmentId, pageId } = body;

    if (!text || text.trim().length === 0) {
      return NextResponse.json({ ok: false, error: "Empty text" }, { status: 400 });
    }

    const ttsResponse = await deepgramTextToSpeech({
      text,
      model: voice,
    });

    return new NextResponse(ttsResponse.audioData, {
      headers: {
        "Content-Type": ttsResponse.contentType,
        "Cache-Control": "public, max-age=86400",
        "X-Segment-Id": segmentId || "unknown",
        "X-Page-Id": pageId || "unknown",
      },
    });
  } catch (error) {
    console.error("Narration synthesis error:", error);
    return NextResponse.json({ ok: false, error: (error as Error).message }, { status: 500 });
  }
}
