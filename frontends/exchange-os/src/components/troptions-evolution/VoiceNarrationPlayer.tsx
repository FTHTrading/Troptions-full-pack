"use client";

import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import { getNarrationScript } from "@/lib/troptions/narrationScripts";

interface VoiceNarrationPlayerProps {
  pageId: string;
  autoPlay?: boolean;
  showTranscript?: boolean;
}

export function VoiceNarrationPlayer({ pageId, autoPlay = false, showTranscript = false }: VoiceNarrationPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentSegmentIndex, setCurrentSegmentIndex] = useState(0);
  const [audioUrls, setAudioUrls] = useState<string[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [playbackMode, setPlaybackMode] = useState<"audio" | "speech">("audio");
  const audioRef = useRef<HTMLAudioElement>(null);

  const script = useMemo(() => getNarrationScript(pageId), [pageId]);
  const segments = useMemo(() => script?.segments ?? [], [script]);

  const handleAudioEnded = useCallback(() => {
    setCurrentSegmentIndex((prevIndex) => {
      if (prevIndex < segments.length - 1) {
        return prevIndex + 1;
      } else {
        setIsPlaying(false);
        return 0;
      }
    });
  }, [segments.length]);

  // Audio ended event listener
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.addEventListener("ended", handleAudioEnded);
    return () => audio.removeEventListener("ended", handleAudioEnded);
  }, [handleAudioEnded]);

  // Play audio when isPlaying changes
  useEffect(() => {
    if (!isPlaying) return;

    if (playbackMode === "speech") {
      const speechSynthesisApi = window.speechSynthesis;
      if (!speechSynthesisApi) {
        return;
      }

      speechSynthesisApi.cancel();

      const utterance = new SpeechSynthesisUtterance(segments[currentSegmentIndex]?.text ?? "");
      utterance.rate = 0.96;
      utterance.onend = handleAudioEnded;
      utterance.onerror = () => {
        setIsPlaying(false);
        setErrorMessage("Browser narration failed. Try again in a moment.");
      };

      speechSynthesisApi.speak(utterance);
      return () => {
        speechSynthesisApi.cancel();
      };
    }

    const audio = audioRef.current;
    if (!audio || audioUrls.length === 0) return;

    audio.src = audioUrls[currentSegmentIndex];
    audio.play().catch((error) => {
      console.error("Failed to play audio:", error);
      setIsPlaying(false);
      setErrorMessage("Narration playback failed. Try again in a moment.");
    });
  }, [isPlaying, currentSegmentIndex, audioUrls, playbackMode, segments, handleAudioEnded]);

  const loadAudio = async (): Promise<{ urls: string[]; fallbackToSpeech: boolean }> => {
    if (audioUrls.length > 0) {
      return { urls: audioUrls, fallbackToSpeech: false };
    }

    setIsLoading(true);
    setErrorMessage(null);
    try {
      const urls: string[] = [];

      for (const segment of segments) {
        const response = await fetch("/api/troptions/narration/synthesize", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            text: segment.text,
            segmentId: segment.id,
            pageId,
          }),
        });

        if (!response.ok) {
          throw new Error(`Narration synthesis failed for ${segment.id}`);
        }

        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        urls.push(url);
      }

      setAudioUrls(urls);
      setPlaybackMode("audio");
      setIsLoading(false);

      if (autoPlay && urls.length > 0) {
        setTimeout(() => setIsPlaying(true), 100);
      }

      return { urls, fallbackToSpeech: false };
    } catch (error) {
      console.error("Failed to load narration audio:", error);
      setIsLoading(false);
      setPlaybackMode("speech");
      setErrorMessage("Cloud narration is unavailable. Using browser voice instead.");
      return { urls: [], fallbackToSpeech: true };
    }
  };

  const playAudio = async () => {
    setErrorMessage(null);
    let shouldUseSpeech = playbackMode === "speech";

    if (audioUrls.length === 0) {
      const { urls, fallbackToSpeech } = await loadAudio();
      shouldUseSpeech = fallbackToSpeech;
      if (urls.length === 0 && !fallbackToSpeech) {
        return;
      }
    }

    if (shouldUseSpeech && (!window.speechSynthesis || typeof SpeechSynthesisUtterance === "undefined")) {
      setErrorMessage("Narration is unavailable in this browser.");
      return;
    }

    setIsPlaying(true);
  };

  const pauseAudio = () => {
    setIsPlaying(false);
    if (audioRef.current) {
      audioRef.current.pause();
    }
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
  };

  if (!script || segments.length === 0) {
    return null;
  }

  return (
    <div style={{ background: "#0f172a", color: "#f6f1e3", padding: "1rem", borderRadius: "0.5rem", marginBottom: "1.5rem" }}>
      <div style={{ marginBottom: "0.75rem", display: "flex", alignItems: "center", gap: "0.75rem" }}>
        <button
          onClick={isPlaying ? pauseAudio : playAudio}
          disabled={isLoading}
          style={{
            background: "#f0cf82",
            color: "#0f172a",
            border: "none",
            borderRadius: "0.375rem",
            padding: "0.5rem 1rem",
            cursor: isLoading ? "not-allowed" : "pointer",
            fontWeight: "bold",
            opacity: isLoading ? 0.6 : 1,
          }}
        >
          {isLoading ? "Loading narration..." : isPlaying ? "⏸ Pause narration" : "▶ Play narration"}
        </button>

        <span style={{ fontSize: "0.875rem", color: "#d1d5db" }}>
          Segment {currentSegmentIndex + 1} of {segments.length}
        </span>
      </div>

      {showTranscript && isPlaying && (
        <div style={{ marginTop: "0.75rem", fontSize: "0.875rem", lineHeight: "1.6", color: "#e5e7eb" }}>
          <p style={{ margin: 0 }}>
            <strong>{segments[currentSegmentIndex].id}:</strong> {segments[currentSegmentIndex].text}
          </p>
        </div>
      )}

      {errorMessage && (
        <p style={{ marginTop: "0.75rem", marginBottom: 0, fontSize: "0.875rem", color: "#fca5a5" }}>
          {errorMessage}
        </p>
      )}

      <audio ref={audioRef} style={{ display: "none" }} />
    </div>
  );
}
