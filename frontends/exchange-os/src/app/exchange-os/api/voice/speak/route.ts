// TROPTIONS Exchange OS — API: TTS (Text to Speech)
// POST /exchange-os/api/voice/speak

import { NextResponse } from "next/server";
import { synthesizeSpeech } from "@/lib/exchange-os/voice/deepgram";

export async function POST(request: Request) {
  try {
    const body = await request.json() as { text?: string };
    const text = body?.text?.trim();

    if (!text) {
      return NextResponse.json({ error: "text is required" }, { status: 400 });
    }

    if (text.length > 2000) {
      return NextResponse.json({ error: "text too long (max 2000 chars)" }, { status: 400 });
    }

    if (!process.env.DEEPGRAM_KEY && !process.env.DEEPGRAM_API_KEY) {
      return NextResponse.json(
        { error: "Deepgram not configured — set DEEPGRAM_KEY in .env.local" },
        { status: 503 }
      );
    }

    const audioBuffer = await synthesizeSpeech(text);

    return new NextResponse(audioBuffer as unknown as BodyInit, {
      status: 200,
      headers: {
        "Content-Type": "audio/mpeg",
        "Content-Length": audioBuffer.length.toString(),
        "Cache-Control": "no-store",
      },
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "TTS failed";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
