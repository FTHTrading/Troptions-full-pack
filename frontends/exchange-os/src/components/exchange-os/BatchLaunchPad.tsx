"use client";

import { useCallback, useState } from "react";
import {
  BATCH_SCENARIOS,
  buildScenarioInnerTxs,
  type BatchScenarioId,
} from "@/lib/exchange-os/xrpl/batchScenarios";

type PrepareResponse = {
  batch: unknown;
  meta: {
    mode: string;
    platformFeeXrp: number;
    feeDestination: string;
    innerCount: number;
  };
  safeToSubmit?: boolean;
  issuerBalanceXrp?: number | null;
  blockers?: string[];
  policy?: { mainnetEnabled: boolean; killSwitchArmed: boolean };
};

export function BatchLaunchPad() {
  const [scenario, setScenario] = useState<BatchScenarioId>("01");
  const [account, setAccount] = useState("rEXAMPLE...");
  const [destinations, setDestinations] = useState("rDEST1,rDEST2");
  const [preview, setPreview] = useState<PrepareResponse | null>(null);
  const [loading, setLoading] = useState(false);

  const selected = BATCH_SCENARIOS.find((s) => s.id === scenario)!;

  const runPrepare = useCallback(
    async (demo: boolean) => {
      setLoading(true);
      try {
        const destList = destinations
          .split(",")
          .map((d) => d.trim())
          .filter(Boolean);
        const inner = buildScenarioInnerTxs(scenario, account, {
          destinations: destList.length ? destList : [account],
        });
        const res = await fetch("/exchange-os/api/xrpl/prepare-batch", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            account,
            mode: selected.mode,
            innerTransactions: inner,
            scenario,
            demo,
          }),
        });
        const data = (await res.json()) as PrepareResponse & { error?: string };
        if (!res.ok) throw new Error(data.error ?? "prepare failed");
        setPreview(data);
        if (demo) {
          console.info(
            "DEMO MODE: JSON plan only. Testnet: rGaiC1bw8uND7Z9XzzpcAWyAuH72p82HES. Batch may return temDISABLED on altnet."
          );
        }
      } catch (e) {
        setPreview({
          batch: null,
          meta: { mode: selected.mode, platformFeeXrp: 0, feeDestination: "", innerCount: 0 },
          blockers: [e instanceof Error ? e.message : "Request failed"],
        } as PrepareResponse);
      } finally {
        setLoading(false);
      }
    },
    [account, destinations, scenario, selected.mode]
  );

  return (
    <div className="xos-panel" style={{ maxWidth: 960 }}>
      <h2 style={{ color: "var(--xos-gold)", marginBottom: "0.25rem" }}>XRPL Batch Execution</h2>
      <p style={{ color: "var(--xos-muted)", fontSize: "0.9rem", marginBottom: "1.25rem" }}>
        Six monetized batch scenarios — fees route to distribution wallet{" "}
        <code style={{ fontSize: "0.8rem" }}>rNX4fa…</code>
      </p>

      <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", marginBottom: "1rem" }}>
        <span className="xos-badge xos-badge--gold">{selected.mode}</span>
        <span className="xos-badge">Fee: {selected.feeLabel}</span>
        {preview?.issuerBalanceXrp != null && (
          <span className="xos-badge xos-badge--cyan">
            Issuer XRP: {preview.issuerBalanceXrp.toFixed(2)}
          </span>
        )}
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))",
          gap: "0.5rem",
          marginBottom: "1.25rem",
        }}
      >
        {BATCH_SCENARIOS.map((s) => (
          <button
            key={s.id}
            type="button"
            className={`xos-btn ${scenario === s.id ? "xos-btn--primary" : "xos-btn--ghost"}`}
            onClick={() => setScenario(s.id)}
            style={{ textAlign: "left", padding: "0.65rem" }}
          >
            <strong style={{ display: "block", fontSize: "0.85rem" }}>{s.label}</strong>
            <span style={{ fontSize: "0.7rem", opacity: 0.8 }}>{s.mode}</span>
          </button>
        ))}
      </div>

      <p style={{ fontSize: "0.85rem", marginBottom: "1rem" }}>{selected.description}</p>

      <div style={{ display: "grid", gap: "0.75rem", marginBottom: "1rem" }}>
        <label>
          <span className="xos-label">Batch account (r-address)</span>
          <input
            className="xos-input"
            value={account}
            onChange={(e) => setAccount(e.target.value)}
            placeholder="r..."
          />
        </label>
        {(scenario === "05" || scenario === "03") && (
          <label>
            <span className="xos-label">Destinations (comma-separated)</span>
            <input
              className="xos-input"
              value={destinations}
              onChange={(e) => setDestinations(e.target.value)}
            />
          </label>
        )}
      </div>

      {preview?.meta && (
        <div className="xos-panel xos-panel--inset" style={{ marginBottom: "1rem", fontSize: "0.85rem" }}>
          <div>Inner TXs: {preview.meta.innerCount}</div>
          <div>Platform fee: {preview.meta.platformFeeXrp} XRP → {preview.meta.feeDestination}</div>
          {preview.blockers && preview.blockers.length > 0 && (
            <ul style={{ marginTop: "0.5rem", color: "#f0a050" }}>
              {preview.blockers.map((b) => (
                <li key={b}>{b}</li>
              ))}
            </ul>
          )}
        </div>
      )}

      <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
        <button
          type="button"
          className="xos-btn xos-btn--primary"
          disabled={loading}
          onClick={() => runPrepare(true)}
        >
          {loading ? "…" : "Prepare Batch (Demo JSON)"}
        </button>
        <button
          type="button"
          className="xos-btn"
          disabled={loading || !preview?.safeToSubmit}
          title={preview?.blockers?.join("; ") ?? "Requires mainnet + issuer ≥11 XRP"}
          onClick={() => runPrepare(false)}
        >
          Submit to Mainnet {!preview?.safeToSubmit ? "🔒" : ""}
        </button>
      </div>

      {preview?.batch && (
        <pre
          className="xos-code-block"
          style={{ marginTop: "1.25rem", maxHeight: 360, overflow: "auto", fontSize: "0.75rem" }}
        >
          {JSON.stringify(preview.batch, null, 2)}
        </pre>
      )}
    </div>
  );
}
