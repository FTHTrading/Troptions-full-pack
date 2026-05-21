"use client";
// TROPTIONS Exchange OS — Voice Interface Page (Deepgram TTS/STT)

import { useState, useRef } from "react";

export default function VoicePage() {
  const [text, setText] = useState("");
  const [transcript, setTranscript] = useState("");
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [ttsLoading, setTtsLoading] = useState(false);
  const [sttLoading, setSttLoading] = useState(false);
  const [recording, setRecording] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const mediaRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<BlobPart[]>([]);

  // TTS: text → speech
  async function speak() {
    if (!text.trim()) return;
    setTtsLoading(true);
    setError(null);
    try {
      const res = await fetch("/exchange-os/api/voice/speak", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: text.trim() }),
      });
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        throw new Error(d.error ?? `TTS failed (${res.status})`);
      }
      const blob = await res.blob();
      if (audioUrl) URL.revokeObjectURL(audioUrl);
      setAudioUrl(URL.createObjectURL(blob));
    } catch (e) {
      setError(e instanceof Error ? e.message : "TTS failed");
    } finally {
      setTtsLoading(false);
    }
  }

  // STT: mic → text
  async function startRecording() {
    setError(null);
    chunksRef.current = [];
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const mr = new MediaRecorder(stream, { mimeType: "audio/webm" });
    mr.ondataavailable = (e) => chunksRef.current.push(e.data);
    mr.onstop = async () => {
      setSttLoading(true);
      try {
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        const formData = new FormData();
        formData.append("audio", blob, "recording.webm");
        const res = await fetch("/exchange-os/api/voice/listen", { method: "POST", body: formData });
        if (!res.ok) throw new Error("STT failed");
        const d = await res.json();
        setTranscript(d.transcript ?? "");
      } catch (e) {
        setError(e instanceof Error ? e.message : "STT failed");
      } finally {
        setSttLoading(false);
        stream.getTracks().forEach((t) => t.stop());
      }
    };
    mr.start();
    mediaRef.current = mr;
    setRecording(true);
  }

  function stopRecording() {
    mediaRef.current?.stop();
    setRecording(false);
  }

  return (
    <div style={{ maxWidth: 750, margin: "0 auto", padding: "2rem 1.5rem" }}>
      <div className="xos-gold-line" />
      <h1 className="xos-section-title">Voice Interface</h1>
      <p className="xos-section-subtitle">
        Powered by Deepgram — Text-to-speech and speech-to-text for the TROPTIONS Exchange OS.
      </p>

      {error && <div className="xos-risk-box" style={{ marginBottom: "1.25rem" }}>{error}</div>}

      {/* TTS Section */}
      <div className="xos-card xos-card--gold" style={{ padding: "1.5rem", marginBottom: "1.25rem" }}>
        <div style={{ fontWeight: 700, color: "var(--xos-gold)", marginBottom: "0.875rem" }}>
          ◆ Text to Speech (Deepgram Aura)
        </div>
        <textarea
          className="xos-input"
          style={{ minHeight: 100, resize: "vertical", marginBottom: "0.75rem", width: "100%", boxSizing: "border-box" }}
          placeholder="Enter text to speak…"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <button
          className="xos-btn xos-btn--primary"
          onClick={speak}
          disabled={ttsLoading || !text.trim()}
        >
          {ttsLoading ? "Synthesising…" : "🔊 Speak"}
        </button>

        {audioUrl && (
          <audio controls src={audioUrl} style={{ width: "100%", marginTop: "1rem" }}>
            Your browser does not support audio playback.
          </audio>
        )}
      </div>

      {/* STT Section */}
      <div className="xos-card xos-card--cyan" style={{ padding: "1.5rem" }}>
        <div style={{ fontWeight: 700, color: "var(--xos-cyan)", marginBottom: "0.875rem" }}>
          🎤 Speech to Text (Deepgram Nova-3)
        </div>

        <div style={{ display: "flex", gap: "0.75rem", marginBottom: "0.875rem" }}>
          {!recording ? (
            <button
              className="xos-btn xos-btn--primary"
              onClick={startRecording}
              disabled={sttLoading}
            >
              🎤 Start Recording
            </button>
          ) : (
            <button
              className="xos-btn xos-btn--outline"
              onClick={stopRecording}
              style={{ borderColor: "var(--xos-red)", color: "var(--xos-red)" }}
            >
              ⏹ Stop Recording
            </button>
          )}
          {sttLoading && (
            <span style={{ fontSize: "0.82rem", color: "var(--xos-text-muted)", alignSelf: "center" }}>
              Transcribing…
            </span>
          )}
        </div>

        {transcript && (
          <div style={{ background: "rgba(0,0,0,0.3)", border: "1px solid var(--xos-border)", borderRadius: 8, padding: "1rem", fontSize: "0.88rem", color: "var(--xos-text)", lineHeight: 1.6 }}>
            <div style={{ fontSize: "0.7rem", color: "var(--xos-text-subtle)", marginBottom: "0.375rem" }}>Transcript</div>
            {transcript}
          </div>
        )}

        <div style={{ marginTop: "0.875rem", fontSize: "0.72rem", color: "var(--xos-text-subtle)" }}>
          Audio is processed by Deepgram and is not stored by TROPTIONS Exchange OS.
          Requires DEEPGRAM_KEY to be configured in production.
        </div>
      </div>
    </div>
  );
}
