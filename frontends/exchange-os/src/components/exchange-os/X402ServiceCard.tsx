"use client";

import { X402_SERVICES } from "@/lib/exchange-os/x402/services";
import { features } from "@/config/exchange-os/features";
import { useState } from "react";

interface X402ServiceCardProps {
  serviceId: string;
  onPurchase?: (serviceId: string) => void;
}

export function X402ServiceCard({ serviceId, onPurchase }: X402ServiceCardProps) {
  const svc = X402_SERVICES.find((s) => s.id === serviceId);
  const [loading, setLoading] = useState(false);
  const [quote, setQuote] = useState<Record<string, unknown> | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (!svc) return null;

  const categoryColor: Record<string, string> = {
    analytics: "cyan",
    launch: "gold",
    ai: "cyan",
    api: "slate",
  };
  const accent = categoryColor[svc.category] ?? "slate";

  async function getQuote() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/exchange-os/api/x402/quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ serviceId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Quote failed");
      setQuote(data);
      onPurchase?.(serviceId);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={`xos-card xos-card--${accent}`} style={{ display: "flex", flexDirection: "column", gap: "0.875rem" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
        <div>
          <div style={{ fontWeight: 700, color: "var(--xos-text)", fontSize: "0.95rem" }}>
            {svc.name}
          </div>
          <span className={`xos-badge xos-badge--${accent}`} style={{ marginTop: 4 }}>
            {svc.category}
          </span>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontWeight: 800, color: "var(--xos-cyan)", fontFamily: "var(--xos-font-mono)", fontSize: "1.1rem" }}>
            ${(svc.priceCents / 100).toFixed(2)}
          </div>
          <div style={{ fontSize: "0.7rem", color: "var(--xos-text-subtle)" }}>per use</div>
        </div>
      </div>

      <p style={{ fontSize: "0.82rem", color: "var(--xos-text-muted)", lineHeight: 1.5 }}>
        {svc.description}
      </p>

      {/* Demo warning */}
      {!features.x402Enabled && (
        <div style={{ fontSize: "0.75rem", color: "var(--xos-amber)" }}>
          ⚠ x402 payments are in demo mode — no real charge
        </div>
      )}

      {/* Error */}
      {error && <div className="xos-risk-box">{error}</div>}

      {/* Quote result */}
      {quote && (
        <div
          style={{
            background: "var(--xos-surface-2)",
            border: "1px solid var(--xos-border)",
            borderRadius: 6,
            padding: "0.625rem",
            fontSize: "0.75rem",
            fontFamily: "var(--xos-font-mono)",
            color: "var(--xos-cyan)",
          }}
        >
          {features.x402Enabled
            ? `Pay to: ${JSON.stringify(quote).slice(0, 80)}…`
            : "Demo access granted — configure X402_ENABLED to enable payments"}
        </div>
      )}

      <button
        className="xos-btn xos-btn--cyan"
        style={{ alignSelf: "flex-start" }}
        onClick={getQuote}
        disabled={loading}
      >
        {loading ? "…" : quote ? "✓ Accessed" : "Access Report"}
      </button>
    </div>
  );
}

export function X402ServiceGrid() {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "1rem" }}>
      {X402_SERVICES.map((svc) => (
        <X402ServiceCard key={svc.id} serviceId={svc.id} />
      ))}
    </div>
  );
}
