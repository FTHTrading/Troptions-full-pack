"use client";

import { useState } from "react";
import { features } from "@/config/exchange-os/features";
import type { XrplQuoteResult } from "@/lib/exchange-os/xrpl/types";

interface SwapPanelProps {
  defaultFrom?: string;
  defaultTo?: string;
}

export function SwapPanel({ defaultFrom = "XRP", defaultTo = "TROPTIONS" }: SwapPanelProps) {
  const [fromToken, setFromToken] = useState(defaultFrom);
  const [toToken, setToToken] = useState(defaultTo);
  const [amount, setAmount] = useState("");
  const [slippage, setSlippage] = useState("1.0");
  const [walletAddress, setWalletAddress] = useState("");
  const [quote, setQuote] = useState<XrplQuoteResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [unsignedTx, setUnsignedTx] = useState<Record<string, unknown> | null>(null);
  const [showPro, setShowPro] = useState(false);

  async function fetchQuote() {
    if (!amount || isNaN(Number(amount))) {
      setError("Enter a valid amount.");
      return;
    }
    setLoading(true);
    setError(null);
    setQuote(null);
    setUnsignedTx(null);

    try {
      const res = await fetch("/exchange-os/api/xrpl/quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sourceCurrency: fromToken,
          destinationCurrency: toToken,
          amount: Number(amount),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Quote failed");
      setQuote(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Quote failed");
    } finally {
      setLoading(false);
    }
  }

  async function prepareSwap() {
    if (!quote || !walletAddress) {
      setError("Enter your wallet address to prepare the swap.");
      return;
    }
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/exchange-os/api/xrpl/prepare-swap", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sourceCurrency: fromToken,
          destinationCurrency: toToken,
          amount: Number(amount),
          slippageBps: Math.round(Number(slippage) * 100),
          walletAddress,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Prepare failed");
      setUnsignedTx(data.unsignedTransaction ?? data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Prepare failed");
    } finally {
      setLoading(false);
    }
  }

  function flipTokens() {
    setFromToken(toToken);
    setToToken(fromToken);
    setQuote(null);
    setUnsignedTx(null);
  }

  return (
    <div className="xos-card" style={{ maxWidth: 480 }}>
      {/* Header row */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.25rem" }}>
        <h2 style={{ fontWeight: 700, fontSize: "1.1rem", color: "var(--xos-text)" }}>
          Swap Tokens
        </h2>
        <button
          className="xos-btn xos-btn--ghost xos-btn--sm"
          onClick={() => setShowPro(!showPro)}
        >
          {showPro ? "Beginner" : "Pro"} Mode
        </button>
      </div>

      {/* From row */}
      <div style={{ marginBottom: "0.5rem" }}>
        <label className="xos-label">You Pay</label>
        <div style={{ display: "flex", gap: "0.5rem" }}>
          <input
            className="xos-input"
            type="number"
            min="0"
            placeholder="0.00"
            value={amount}
            onChange={(e) => {
              setAmount(e.target.value);
              setQuote(null);
            }}
            style={{ flex: 1 }}
          />
          <select
            className="xos-input"
            value={fromToken}
            onChange={(e) => {
              setFromToken(e.target.value);
              setQuote(null);
            }}
            style={{ width: 130 }}
          >
            <option>XRP</option>
            <option>TROPTIONS</option>
            <option>USD</option>
            <option>USDC</option>
            <option>USDT</option>
            <option>BTC</option>
            <option>ETH</option>
            <option>EUR</option>
            <option>SOLO</option>
          </select>
        </div>
      </div>

      {/* Flip */}
      <div style={{ textAlign: "center", margin: "0.5rem 0" }}>
        <button
          className="xos-btn xos-btn--ghost"
          onClick={flipTokens}
          style={{ padding: "0.25rem 0.75rem", fontSize: "1.2rem" }}
          title="Flip tokens"
        >
          ⟷
        </button>
      </div>

      {/* To row */}
      <div style={{ marginBottom: "1rem" }}>
        <label className="xos-label">You Receive</label>
        <div style={{ display: "flex", gap: "0.5rem" }}>
          <div
            className="xos-input"
            style={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              color: quote ? "var(--xos-green)" : "var(--xos-text-subtle)",
              fontFamily: "var(--xos-font-mono)",
            }}
          >
            {quote
              ? (typeof quote.toAmount === "string" ? quote.toAmount : JSON.stringify(quote.toAmount))
              : "—"}
          </div>
          <select
            className="xos-input"
            value={toToken}
            onChange={(e) => {
              setToToken(e.target.value);
              setQuote(null);
            }}
            style={{ width: 130 }}
          >
            <option>TROPTIONS</option>
            <option>XRP</option>
            <option>USD</option>
            <option>USDC</option>
            <option>USDT</option>
            <option>BTC</option>
            <option>ETH</option>
            <option>EUR</option>
            <option>SOLO</option>
          </select>
        </div>
      </div>

      {/* Pro settings */}
      {showPro && (
        <div style={{ marginBottom: "1rem" }}>
          <label className="xos-label">
            Slippage Tolerance (%)
            <span
              title="Slippage: how much the final price can move before your trade completes."
              style={{ marginLeft: 6, cursor: "help", opacity: 0.6 }}
            >
              ?
            </span>
          </label>
          <input
            className="xos-input"
            type="number"
            min="0.1"
            max="10"
            step="0.1"
            value={slippage}
            onChange={(e) => setSlippage(e.target.value)}
          />
        </div>
      )}

      {/* Wallet */}
      <div style={{ marginBottom: "1rem" }}>
        <label className="xos-label">Your XRPL Wallet Address (read-only)</label>
        <input
          className="xos-input"
          placeholder="r..."
          value={walletAddress}
          onChange={(e) => setWalletAddress(e.target.value)}
        />
        <p style={{ fontSize: "0.75rem", color: "var(--xos-text-subtle)", marginTop: "0.25rem" }}>
          Used to prepare an unsigned transaction — never sent to a server.
        </p>
      </div>

      {/* Error */}
      {error && (
        <div className="xos-risk-box" style={{ marginBottom: "1rem" }}>
          {error}
        </div>
      )}

      {/* Quote result */}
      {quote && (
        <div
          style={{
            background: "var(--xos-surface-2)",
            border: "1px solid var(--xos-border)",
            borderRadius: "var(--xos-radius)",
            padding: "0.75rem",
            marginBottom: "1rem",
            fontSize: "0.8rem",
            display: "flex",
            flexDirection: "column",
            gap: "0.3rem",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span style={{ color: "var(--xos-text-muted)" }}>You receive</span>
            <span style={{ color: "var(--xos-green)", fontFamily: "var(--xos-font-mono)", fontWeight: 700 }}>
              {typeof quote.toAmount === "object" && quote.toAmount !== null
                ? `${(quote.toAmount as { value?: string }).value ?? "?"} ${toToken}`
                : String(quote.toAmount)}
            </span>
          </div>
          {(quote.estimatedSlippagePct ?? 0) > 0 && (
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ color: "var(--xos-text-muted)" }}>Est. slippage</span>
              <span style={{ color: "var(--xos-text)" }}>{quote.estimatedSlippagePct}%</span>
            </div>
          )}
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span style={{ color: "var(--xos-text-muted)" }}>Network fee</span>
            <span style={{ color: "var(--xos-text)" }}>{quote.estimatedFeesXrp} XRP</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span style={{ color: "var(--xos-text-muted)" }}>Route</span>
            <span style={{ color: "var(--xos-cyan)" }}>{quote.route}</span>
          </div>

        </div>
      )}

      {/* Unsigned tx */}
      {unsignedTx && (
        <div
          style={{
            background: "var(--xos-surface-2)",
            border: "1px solid var(--xos-border-2)",
            borderRadius: "var(--xos-radius)",
            padding: "0.75rem",
            marginBottom: "1rem",
            fontSize: "0.72rem",
            fontFamily: "var(--xos-font-mono)",
            overflowX: "auto",
            maxHeight: 160,
            overflowY: "auto",
          }}
        >
          <div style={{ color: "var(--xos-text-muted)", marginBottom: "0.375rem" }}>
            Unsigned Transaction Blob — sign with your wallet:
          </div>
          <pre style={{ color: "var(--xos-cyan)", margin: 0, whiteSpace: "pre-wrap", wordBreak: "break-all" }}>
            {JSON.stringify(unsignedTx, null, 2)}
          </pre>
        </div>
      )}

      {/* Actions */}
      <div style={{ display: "flex", gap: "0.625rem" }}>
        <button
          className="xos-btn xos-btn--outline"
          style={{ flex: 1 }}
          onClick={fetchQuote}
          disabled={loading || !amount}
        >
          {loading ? "…" : "Get Quote"}
        </button>
        {quote && (
          <button
            className="xos-btn xos-btn--primary"
            style={{ flex: 1 }}
            onClick={prepareSwap}
            disabled={loading || !walletAddress}
          >
            Prepare Swap ↗
          </button>
        )}
      </div>

      {/* Risk disclaimer */}
      <div className="xos-risk-box" style={{ marginTop: "1rem" }}>
        Trading XRPL assets carries risk. This tool prepares unsigned transactions only —
        your wallet app must sign and submit. Past prices do not guarantee future results.
      </div>
    </div>
  );
}
