// TROPTIONS Exchange OS — API: STT (Speech to Text)
// POST /exchange-os/api/voice/listen  (multipart/form-data, field: audio)

import { NextResponse } from "next/server";
import { transcribeAudio } from "@/lib/exchange-os/voice/deepgram";

export async function POST(request: Request) {
  try {
    if (!process.env.DEEPGRAM_KEY && !process.env.DEEPGRAM_API_KEY) {
      return NextResponse.json(
        { error: "Deepgram not configured — set DEEPGRAM_KEY in .env.local" },
        { status: 503 }
      );
    }

    const formData = await request.formData();
    const audioFile = formData.get("audio");

    if (!audioFile || !(audioFile instanceof Blob)) {
      return NextResponse.json({ error: "audio field (Blob) required" }, { status: 400 });
    }

    const mimeType = audioFile.type || "audio/webm";
    const arrayBuf = await audioFile.arrayBuffer();
    const buffer = Buffer.from(arrayBuf);

    const transcript = await transcribeAudio(buffer, mimeType);

    return NextResponse.json({ transcript, demoMode: false });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "STT failed";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
