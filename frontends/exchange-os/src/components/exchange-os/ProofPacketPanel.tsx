"use client";
// TROPTIONS Exchange OS — Proof Packet Display Panel

import { useState } from "react";
import type { ProofPacketInput } from "@/lib/exchange-os/proof/types";

interface Props {
  prefill?: Partial<ProofPacketInput>;
}

/** Local form shape — maps to ProofPacketInput at submit time */
interface ProofForm {
  tokenName: string;
  tokenTicker: string;
  issuerAddress: string;
  metadataUrl: string;
}

export function ProofPacketPanel({ prefill }: Props) {
  const [form, setForm] = useState<ProofForm>({
    tokenName: prefill?.tokenName ?? "",
    tokenTicker: prefill?.tokenTicker ?? "",
    issuerAddress: prefill?.issuerAddress ?? "",
    metadataUrl: prefill?.metadataUrl ?? "",
  });
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleGenerate() {
    setLoading(true);
    setError(null);
    setResult(null);
    const payload: ProofPacketInput = {
      tokenName: form.tokenName,
      tokenTicker: form.tokenTicker,
      issuerAddress: form.issuerAddress,
      metadataUrl: form.metadataUrl || undefined,
      trustlineRequired: true,
    };
    try {
      const res = await fetch("/exchange-os/api/proof-packet", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json() as { proofPacket?: unknown; error?: string };
      if (!res.ok) throw new Error(data.error ?? "Failed");
      setResult(JSON.stringify(data.proofPacket, null, 2));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Request failed");
    } finally {
      setLoading(false);
    }
  }

  const fields: [keyof ProofForm, string, string][] = [
    ["tokenName", "Token Name", "e.g. TROPTIONS"],
    ["tokenTicker", "Ticker Symbol", "e.g. TROPTIONS"],
    ["issuerAddress", "Issuer Address (r...)", "rXXXX..."],
    ["metadataUrl", "Metadata URL (optional)", "https://..."],
  ];

  return (
    <div className="xos-card" style={{ padding: "1.5rem" }}>
      <div className="xos-gold-line" />
      <h3 style={{ color: "var(--xos-gold)", fontWeight: 800, marginBottom: "1rem" }}>
        ◆ Generate Proof Packet
      </h3>
      <p style={{ fontSize: "0.82rem", color: "var(--xos-text-muted)", marginBottom: "1.25rem" }}>
        A proof packet is a portable, verifiable record of your token launch parameters.
        It includes an attestation disclaimer — it is informational, not an audit or guarantee.
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem", marginBottom: "1rem" }}>
        {fields.map(([key, label, ph]) => (
          <div key={key}>
            <label className="xos-label">{label}</label>
            <input
              className="xos-input"
              placeholder={ph}
              value={form[key]}
              onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
            />
          </div>
        ))}
      </div>

      <button
        className="xos-btn xos-btn--primary"
        onClick={handleGenerate}
        disabled={loading || !form.tokenTicker || !form.issuerAddress}
      >
        {loading ? "Generating…" : "◆ Generate Proof Packet"}
      </button>

      {error && <div className="xos-risk-box" style={{ marginTop: "1rem" }}>{error}</div>}

      {result && (
        <div style={{ marginTop: "1.25rem" }}>
          <div style={{ fontWeight: 700, color: "var(--xos-green)", marginBottom: "0.5rem" }}>✓ Proof Packet Generated</div>
          <pre style={{
            fontFamily: "var(--xos-font-mono)", fontSize: "0.72rem", background: "rgba(0,0,0,0.5)",
            border: "1px solid var(--xos-border)", borderRadius: 8, padding: "1rem",
            overflowX: "auto", color: "var(--xos-text-muted)", maxHeight: 400,
          }}>
            {result}
          </pre>
        </div>
      )}
    </div>
  );
}
