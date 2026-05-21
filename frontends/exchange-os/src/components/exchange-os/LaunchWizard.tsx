"use client";

import { useState } from "react";
import { features } from "@/config/exchange-os/features";

interface LaunchStep {
  id: string;
  label: string;
  description: string;
}

const STEPS: LaunchStep[] = [
  { id: "token", label: "1. Token Details", description: "Name, ticker, total supply, description" },
  { id: "issuer", label: "2. Verify Issuer", description: "Connect your XRPL issuer address" },
  { id: "liquidity", label: "3. Add Liquidity", description: "Set up AMM pool (optional but recommended)" },
  { id: "x402", label: "4. Activate Reports", description: "Enable x402 risk report and AI page" },
  { id: "rewards", label: "5. Reward Routing", description: "Creator, referral, and sponsor splits" },
  { id: "proof", label: "6. Proof Packet", description: "Generate your on-chain proof document" },
];

export function LaunchWizard() {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    tokenName: "",
    ticker: "",
    totalSupply: "",
    description: "",
    issuerAddress: "",
    metadataUrl: "",
    addLiquidity: false,
    xrpLiquidityAmount: "",
    enableX402: false,
    enableRewards: false,
  });
  const [result, setResult] = useState<{
    launchPacket?: Record<string, unknown>;
    proofPacket?: Record<string, unknown>;
    error?: string;
  } | null>(null);
  const [loading, setLoading] = useState(false);

  function patch(update: Partial<typeof formData>) {
    setFormData((p) => ({ ...p, ...update }));
  }

  async function handleFinish() {
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch("/exchange-os/api/xrpl/prepare-launch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tokenName: formData.tokenName,
          ticker: formData.ticker,
          totalSupply: Number(formData.totalSupply),
          description: formData.description,
          issuerAddress: formData.issuerAddress,
          metadataUrl: formData.metadataUrl,
          addLiquidity: formData.addLiquidity,
          xrpLiquidityAmount: Number(formData.xrpLiquidityAmount),
          enableAmmCreate: formData.addLiquidity,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Launch preparation failed");
      setResult({ launchPacket: data });
    } catch (e) {
      setResult({ error: e instanceof Error ? e.message : "Failed" });
    } finally {
      setLoading(false);
    }
  }

  const step = STEPS[currentStep];

  return (
    <div className="xos-card" style={{ maxWidth: 600 }}>
      {/* Step header */}
      <div style={{ marginBottom: "1.5rem" }}>
        <div className="xos-gold-line" />
        <h2 style={{ fontWeight: 800, color: "var(--xos-text)", fontSize: "1.2rem" }}>
          Launch Your Token
        </h2>
        <p style={{ color: "var(--xos-text-muted)", fontSize: "0.85rem" }}>
          Prepare unsigned XRPL transactions — sign with your own wallet.
        </p>
      </div>

      {/* Step indicators */}
      <div style={{ display: "flex", gap: "0.25rem", marginBottom: "1.75rem", flexWrap: "wrap" }}>
        {STEPS.map((s, i) => (
          <div
            key={s.id}
            style={{
              padding: "0.3rem 0.625rem",
              borderRadius: 6,
              fontSize: "0.72rem",
              fontWeight: i === currentStep ? 700 : 400,
              background: i === currentStep ? "var(--xos-gold-glow)" : "transparent",
              color: i < currentStep ? "var(--xos-green)" : i === currentStep ? "var(--xos-gold)" : "var(--xos-text-subtle)",
              border: `1px solid ${i === currentStep ? "var(--xos-gold-muted)" : "transparent"}`,
              cursor: i < currentStep ? "pointer" : "default",
            }}
            onClick={() => { if (i < currentStep) setCurrentStep(i); }}
          >
            {i < currentStep ? "✓ " : ""}{s.label}
          </div>
        ))}
      </div>

      {/* Step content */}
      <div style={{ minHeight: 240 }}>
        {step.id === "token" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <div>
              <label className="xos-label">Token Name</label>
              <input className="xos-input" placeholder="My Community Token" value={formData.tokenName}
                onChange={(e) => patch({ tokenName: e.target.value })} />
            </div>
            <div>
              <label className="xos-label">Ticker (up to 9 characters)</label>
              <input className="xos-input" placeholder="MYTKN" maxLength={9} value={formData.ticker}
                onChange={(e) => patch({ ticker: e.target.value.toUpperCase() })} />
            </div>
            <div>
              <label className="xos-label">Total Supply</label>
              <input className="xos-input" type="number" placeholder="1000000" value={formData.totalSupply}
                onChange={(e) => patch({ totalSupply: e.target.value })} />
            </div>
            <div>
              <label className="xos-label">Description</label>
              <textarea className="xos-input" rows={2} placeholder="What is this token for?"
                value={formData.description}
                onChange={(e) => patch({ description: e.target.value })}
                style={{ resize: "vertical" }} />
            </div>
          </div>
        )}

        {step.id === "issuer" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <div>
              <label className="xos-label">
                XRPL Issuer Address
                <span title="Issuer: the wallet that created this token." style={{ marginLeft: 6, cursor: "help", opacity: 0.6 }}>?</span>
              </label>
              <input className="xos-input" placeholder="r..." value={formData.issuerAddress}
                onChange={(e) => patch({ issuerAddress: e.target.value })} />
              <p style={{ fontSize: "0.75rem", color: "var(--xos-text-subtle)", marginTop: 4 }}>
                Your wallet address. You will sign the AccountSet transaction.
              </p>
            </div>
            <div>
              <label className="xos-label">Metadata URL (optional)</label>
              <input className="xos-input" placeholder="https://..." value={formData.metadataUrl}
                onChange={(e) => patch({ metadataUrl: e.target.value })} />
            </div>
          </div>
        )}

        {step.id === "liquidity" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <p style={{ color: "var(--xos-text-muted)", fontSize: "0.85rem" }}>
              Adding liquidity creates an AMM pool on XRPL, enabling instant swaps.{" "}
              <em>AMM: a pool that lets people swap between two assets.</em>
            </p>
            <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", cursor: "pointer" }}>
              <input type="checkbox" checked={formData.addLiquidity}
                onChange={(e) => patch({ addLiquidity: e.target.checked })} />
              <span style={{ color: "var(--xos-text)", fontSize: "0.9rem" }}>Create AMM pool with XRP</span>
            </label>
            {formData.addLiquidity && (
              <div>
                <label className="xos-label">XRP Amount for Pool</label>
                <input className="xos-input" type="number" placeholder="100" value={formData.xrpLiquidityAmount}
                  onChange={(e) => patch({ xrpLiquidityAmount: e.target.value })} />
                <div className="xos-risk-box" style={{ marginTop: "0.625rem" }}>
                  Providing liquidity carries impermanent loss risk. You may receive less value than you deposited.
                </div>
              </div>
            )}
          </div>
        )}

        {step.id === "x402" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <p style={{ color: "var(--xos-text-muted)", fontSize: "0.85rem" }}>
              x402 reports let buyers pay per-use for your token&apos;s AI-generated page and risk analysis.{" "}
              <em>x402: pay-per-use access for premium reports and AI tools.</em>
            </p>
            <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", cursor: "pointer" }}>
              <input type="checkbox" checked={formData.enableX402}
                onChange={(e) => patch({ enableX402: e.target.checked })} />
              <span style={{ color: "var(--xos-text)", fontSize: "0.9rem" }}>Enable x402 reports for this token</span>
            </label>
          </div>
        )}

        {step.id === "rewards" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <p style={{ color: "var(--xos-text-muted)", fontSize: "0.85rem" }}>
              Route a share of eligible platform fees to creators, referrers, and sponsors.
              Estimated rewards — not guaranteed income.
            </p>
            <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", cursor: "pointer" }}>
              <input type="checkbox" checked={formData.enableRewards}
                onChange={(e) => patch({ enableRewards: e.target.checked })} />
              <span style={{ color: "var(--xos-text)", fontSize: "0.9rem" }}>Enable creator reward routing</span>
            </label>
            <div className="xos-risk-box">
              Reward eligibility depends on real usage, program rules, and market activity. Not financial advice.
            </div>
          </div>
        )}

        {step.id === "proof" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <p style={{ color: "var(--xos-text-muted)", fontSize: "0.85rem" }}>
              A Proof Packet bundles your token metadata, issuer address, risk labels, AMM details,
              and x402 service list into a verifiable document.
            </p>
            {!result && (
              <button
                className="xos-btn xos-btn--primary"
                style={{ alignSelf: "flex-start" }}
                onClick={handleFinish}
                disabled={loading}
              >
                {loading ? "Preparing…" : "Generate Launch Packet ◆"}
              </button>
            )}
            {result?.error && (
              <div className="xos-risk-box">{result.error}</div>
            )}
            {result?.launchPacket && (
              <div
                style={{
                  background: "var(--xos-surface-2)",
                  border: "1px solid var(--xos-border)",
                  borderRadius: 8,
                  padding: "0.875rem",
                  fontSize: "0.72rem",
                  fontFamily: "var(--xos-font-mono)",
                  overflowX: "auto",
                  maxHeight: 200,
                  overflowY: "auto",
                }}
              >
                <div style={{ color: "var(--xos-gold)", marginBottom: "0.375rem" }}>
                  ✓ Launch packet ready — sign each transaction with your wallet
                </div>
                <pre style={{ color: "var(--xos-cyan)", margin: 0, whiteSpace: "pre-wrap", wordBreak: "break-all" }}>
                  {JSON.stringify(result.launchPacket, null, 2)}
                </pre>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Nav buttons */}
      <div style={{ display: "flex", gap: "0.625rem", marginTop: "1.5rem", justifyContent: "space-between" }}>
        <button
          className="xos-btn xos-btn--outline"
          onClick={() => setCurrentStep((p) => Math.max(0, p - 1))}
          disabled={currentStep === 0}
        >
          ← Back
        </button>
        {currentStep < STEPS.length - 1 && (
          <button
            className="xos-btn xos-btn--primary"
            onClick={() => setCurrentStep((p) => Math.min(STEPS.length - 1, p + 1))}
          >
            Next →
          </button>
        )}
      </div>
    </div>
  );
}
