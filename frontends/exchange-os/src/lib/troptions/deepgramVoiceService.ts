import { existsSync, readFileSync } from "node:fs";
import path from "node:path";

const DEFAULT_DEEPGRAM_KEY_FILE = path.join(
  process.env.USERPROFILE || "",
  "OneDrive - FTH Trading",
  "11-Downloads",
  "deepgram.txt",
);

function loadDeepgramKeysFromFile(filePath: string): string[] {
  if (!filePath || !existsSync(filePath)) {
    return [];
  }

  return readFileSync(filePath, "utf8")
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.length > 0)
    .filter((line) => !/^deepgram$/i.test(line));
}

function resolveDeepgramApiKey(): string {
  const configuredKey = process.env.DEEPGRAM_KEY || process.env.DEEPGRAM_KEY_ALT;
  if (configuredKey) {
    return configuredKey;
  }

  const fileCandidates = [
    process.env.DEEPGRAM_KEY_FILE,
    DEFAULT_DEEPGRAM_KEY_FILE,
  ].filter((value): value is string => Boolean(value));

  for (const filePath of fileCandidates) {
    const [primaryKey, secondaryKey] = loadDeepgramKeysFromFile(filePath);
    if (primaryKey) {
      process.env.DEEPGRAM_KEY = primaryKey;
    }
    if (secondaryKey && !process.env.DEEPGRAM_KEY_ALT) {
      process.env.DEEPGRAM_KEY_ALT = secondaryKey;
    }
    if (primaryKey) {
      return primaryKey;
    }
  }

  return "";
}

const DEEPGRAM_TTS_MODEL = "aura-2-thalia-en";

export interface DeepgramTTSRequest {
  text: string;
  model?: string;
  encoding?: "linear16" | "ulaw" | "opus" | "mp3";
}

export interface DeepgramTTSResponse {
  audioData: ArrayBuffer;
  contentType: string;
  duration?: number;
}

export async function deepgramTextToSpeech(request: DeepgramTTSRequest): Promise<DeepgramTTSResponse> {
  const apiKey = resolveDeepgramApiKey();

  if (!apiKey) {
    throw new Error("DEEPGRAM_KEY environment variable is not set");
  }

  const response = await fetch("https://api.deepgram.com/v1/speak?model=" + (request.model || DEEPGRAM_TTS_MODEL), {
    method: "POST",
    headers: {
      Authorization: `Token ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      text: request.text,
    }),
  });

  if (!response.ok) {
    throw new Error(`Deepgram TTS failed: ${response.statusText}`);
  }

  const audioData = await response.arrayBuffer();
  return {
    audioData,
    contentType: response.headers.get("content-type") || "audio/mpeg",
  };
}

export async function batchTextToSpeech(texts: string[]): Promise<{ audioData: ArrayBuffer; text: string }[]> {
  const results: { audioData: ArrayBuffer; text: string }[] = [];

  for (const text of texts) {
    const response = await deepgramTextToSpeech({ text });
    results.push({
      audioData: response.audioData,
      text,
    });
  }

  return results;
}

export function audioBufferToDataUrl(audioData: ArrayBuffer, contentType: string): string {
  const blob = new Blob([audioData], { type: contentType });
  return URL.createObjectURL(blob);
}
