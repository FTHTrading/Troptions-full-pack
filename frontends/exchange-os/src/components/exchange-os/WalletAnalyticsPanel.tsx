"use client";
// TROPTIONS Exchange OS — Wallet Analytics Panel

import { useState } from "react";

interface WalletData {
  address: string;
  xrpBalance: string;
  trustLines: string[];
  demoMode: boolean;
}

export function WalletAnalyticsPanel() {
  const [address, setAddress] = useState("");
  const [data, setData] = useState<WalletData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function lookup() {
    if (!address.startsWith("r") || address.length < 25) {
      setError("Enter a valid XRPL address (starts with r)");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/exchange-os/api/xrpl/wallet?address=${encodeURIComponent(address)}`);
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Lookup failed");
      setData(json);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Wallet lookup failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="xos-card" style={{ padding: "1.5rem" }}>
      <div className="xos-gold-line" />
      <h3 style={{ color: "var(--xos-gold)", fontWeight: 800, marginBottom: "1rem" }}>
        ◆ Wallet Analytics
      </h3>

      <div style={{ display: "flex", gap: "0.75rem", marginBottom: "1rem" }}>
        <input
          className="xos-input"
          placeholder="XRPL wallet address (r...)"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          style={{ flex: 1 }}
        />
        <button
          className="xos-btn xos-btn--primary"
          onClick={lookup}
          disabled={loading}
        >
          {loading ? "Looking up…" : "Lookup"}
        </button>
      </div>

      <div style={{ fontSize: "0.72rem", color: "var(--xos-text-subtle)", marginBottom: "1rem" }}>
        Read-only lookup — no wallet connection required. TROPTIONS never requests private keys.
      </div>

      {error && <div className="xos-risk-box">{error}</div>}

      {data && (
        <div style={{ marginTop: "1rem" }}>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
            <div className="xos-stat-label">Address</div>
            <div className="xos-stat-value" style={{ fontSize: "0.75rem", wordBreak: "break-all" }}>{data.address}</div>
            <div className="xos-stat-label">XRP Balance</div>
            <div className="xos-stat-value">{data.xrpBalance} XRP</div>
            <div className="xos-stat-label">Trustlines</div>
            <div className="xos-stat-value">{data.trustLines.length}</div>
          </div>
          {data.trustLines.length > 0 && (
            <div style={{ marginTop: "0.75rem" }}>
              <div style={{ fontSize: "0.72rem", color: "var(--xos-text-subtle)", marginBottom: "0.25rem" }}>Active Trustlines</div>
              {data.trustLines.map((tl, i) => (
                <div key={i} className="xos-badge xos-badge--cyan" style={{ marginRight: 4, marginBottom: 4 }}>
                  {tl}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
