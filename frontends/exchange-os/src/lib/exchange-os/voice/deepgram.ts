// TROPTIONS Exchange OS — Deepgram TTS/STT Voice Wrappers
// Uses DEEPGRAM_KEY / DEEPGRAM_KEY_ALT with dual-key failover.
// TTS model: aura-2-thalia-en | STT model: nova-3

const TTS_BASE = "https://api.deepgram.com/v1/speak";
const STT_BASE = "https://api.deepgram.com/v1/listen";
const TTS_MODEL = process.env.ADA_TTS_VOICE ?? "aura-2-thalia-en";

/** Pick a Deepgram API key — tries primary then alternate */
function getKey(): string {
  const key = process.env.DEEPGRAM_KEY ?? process.env.DEEPGRAM_API_KEY;
  if (key) return key;
  throw new Error("No Deepgram API key configured (DEEPGRAM_KEY or DEEPGRAM_API_KEY)");
}

function getKeyAlt(): string {
  const key = process.env.DEEPGRAM_KEY_ALT;
  if (key) return key;
  return getKey(); // fall back to primary
}

/** Synthesise text → MP3 audio Buffer */
export async function synthesizeSpeech(text: string): Promise<Buffer> {
  const url = `${TTS_BASE}?model=${TTS_MODEL}`;
  const body = JSON.stringify({ text });

  async function attempt(apiKey: string): Promise<Buffer> {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Token ${apiKey}`,
        "Content-Type": "application/json",
        Accept: "audio/mpeg",
      },
      body,
    });
    if (!res.ok) {
      const msg = await res.text().catch(() => res.statusText);
      throw new Error(`Deepgram TTS ${res.status}: ${msg}`);
    }
    const arrayBuf = await res.arrayBuffer();
    return Buffer.from(arrayBuf);
  }

  try {
    return await attempt(getKey());
  } catch (err) {
    // Failover to alternate key
    try {
      return await attempt(getKeyAlt());
    } catch {
      throw err;
    }
  }
}

/** Transcribe audio Buffer (webm/mp3/wav) → transcript string */
export async function transcribeAudio(
  audioBuffer: Buffer,
  mimeType = "audio/webm"
): Promise<string> {
  const url = `${STT_BASE}?model=nova-3&smart_format=true&language=en`;

  async function attempt(apiKey: string): Promise<string> {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Token ${apiKey}`,
        "Content-Type": mimeType,
      },
      body: audioBuffer as unknown as BodyInit,
    });
    if (!res.ok) {
      const msg = await res.text().catch(() => res.statusText);
      throw new Error(`Deepgram STT ${res.status}: ${msg}`);
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const data = (await res.json()) as any;
    return data?.results?.channels?.[0]?.alternatives?.[0]?.transcript ?? "";
  }

  try {
    return await attempt(getKey());
  } catch (err) {
    try {
      return await attempt(getKeyAlt());
    } catch {
      throw err;
    }
  }
}
