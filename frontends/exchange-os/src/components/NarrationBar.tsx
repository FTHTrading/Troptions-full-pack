"use client";

import { useCallback, useRef, useState } from "react";

const VOICES = [
  { value: "aura-2-thalia-en", label: "Thalia (female)" },
  { value: "aura-2-luna-en", label: "Luna (female)" },
  { value: "aura-2-stella-en", label: "Stella (female)" },
  { value: "aura-2-zeus-en", label: "Zeus (male)" },
  { value: "aura-2-orion-en", label: "Orion (male)" },
];

interface NarrationBarProps {
  /** The text to narrate. Keep under ~2500 chars for best latency. */
  text: string;
  /** Label shown in the bar. Defaults to "Narrate this page". */
  label?: string;
  className?: string;
}

type Status = "idle" | "loading" | "playing" | "error";

export function NarrationBar({ text, label = "Narrate this page", className }: NarrationBarProps) {
  const [voice, setVoice] = useState(VOICES[0].value);
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const blobUrlRef = useRef<string | null>(null);

  const stop = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setStatus("idle");
  }, []);

  const play = useCallback(async () => {
    if (status === "playing") {
      stop();
      return;
    }

    setStatus("loading");
    setErrorMsg("");

    try {
      const res = await fetch("/api/troptions/narration/synthesize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: text.slice(0, 3000), voice }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({})) as { error?: string };
        throw new Error(err.error || `HTTP ${res.status}`);
      }

      const blob = await res.blob();

      // Revoke any previous blob URL
      if (blobUrlRef.current) {
        URL.revokeObjectURL(blobUrlRef.current);
      }
      const url = URL.createObjectURL(blob);
      blobUrlRef.current = url;

      const audio = new Audio(url);
      audioRef.current = audio;

      audio.addEventListener("ended", () => setStatus("idle"));
      audio.addEventListener("error", () => {
        setStatus("error");
        setErrorMsg("Playback error");
      });

      await audio.play();
      setStatus("playing");
    } catch (err) {
      setStatus("error");
      setErrorMsg((err as Error).message);
    }
  }, [status, stop, text, voice]);

  return (
    <div
      className={`flex items-center gap-3 rounded-lg border border-[#C9A84C]/30 bg-[#C9A84C]/5 px-4 py-3 ${className ?? ""}`}
    >
      {/* Play / Pause button */}
      <button
        onClick={play}
        disabled={status === "loading"}
        aria-label={status === "playing" ? "Stop narration" : label}
        className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-[#C9A84C] text-[#071426] transition-colors hover:bg-[#f0cf82] disabled:opacity-50"
      >
        {status === "loading" ? (
          <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
          </svg>
        ) : status === "playing" ? (
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
            <rect x="6" y="5" width="4" height="14" />
            <rect x="14" y="5" width="4" height="14" />
          </svg>
        ) : (
          <svg className="h-4 w-4 translate-x-px" viewBox="0 0 24 24" fill="currentColor">
            <polygon points="5,3 19,12 5,21" />
          </svg>
        )}
      </button>

      {/* Label */}
      <span className="text-sm font-medium text-[#f0cf82]">
        {status === "playing" ? "Playing…" : status === "loading" ? "Synthesizing…" : label}
      </span>

      {/* Animated bars when playing */}
      {status === "playing" && (
        <span className="flex items-end gap-0.5 h-4">
          {[0, 1, 2, 3].map((i) => (
            <span
              key={i}
              className="w-0.5 rounded-full bg-[#C9A84C]"
              style={{
                animation: `narration-bar 0.8s ease-in-out ${i * 0.15}s infinite alternate`,
                height: "50%",
              }}
            />
          ))}
        </span>
      )}

      {/* Voice selector */}
      <div className="ml-auto">
        <select
          value={voice}
          onChange={(e) => {
            stop();
            setVoice(e.target.value);
          }}
          className="rounded border border-white/10 bg-[#0c1e35] px-2 py-1 text-xs text-slate-300 focus:outline-none focus:ring-1 focus:ring-[#C9A84C]/50"
        >
          {VOICES.map((v) => (
            <option key={v.value} value={v.value}>
              {v.label}
            </option>
          ))}
        </select>
      </div>

      {/* Error */}
      {status === "error" && (
        <span className="text-xs text-red-400">{errorMsg}</span>
      )}

      <style>{`
        @keyframes narration-bar {
          from { height: 20%; }
          to   { height: 100%; }
        }
      `}</style>
    </div>
  );
}
