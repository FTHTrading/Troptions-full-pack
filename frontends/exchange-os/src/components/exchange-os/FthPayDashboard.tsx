"use client";

// TROPTIONS Exchange OS — FTH Pay / Genesis Wallet Portal
// Multi-chain wallet dashboard styled after UnyKorn Genesis Wallet.
// Tabs: Dashboard | Send | Mint | History

import { useState, useEffect, useCallback } from "react";

// ── Types ────────────────────────────────────────────────────────
interface IouBalance {
  currency: string;
  currencyRaw: string;
  issuer: string;
  balance: number;
  limit: number;
}
interface XrplBalances {
  address: string;
  xrp: number;
  iou: IouBalance[];
}
interface ChainStatus {
  online: boolean;
  height?: number;
  agents?: number;
  cycles?: number;
}
interface ChainHealth {
  chain7331: ChainStatus;
  chain7332: ChainStatus;
  chairman: { atp?: number; uny?: number; fthusd?: number };
}
interface MintResult {
  tx: Record<string, unknown>;
  hasTrustline: boolean;
  trustlineWarning: string | null;
  trustSetTemplate?: Record<string, unknown>;
  encodedCurrency: string;
  hint: string;
  steps: string[];
}
interface XrplTx {
  hash: string;
  date?: number;
  tx?: {
    TransactionType?: string;
    Destination?: string;
    Amount?: unknown;
    Account?: string;
  };
}

type Tab = "dashboard" | "send" | "mint" | "history";

// ── Known contacts (role-based, no personal names) ───────────────
const CONTACTS = [
  { name: "FTH Operations", email: "ops@fthco.com", label: "Primary FTH_USD · Operations Desk" },
  { name: "FTH Team", email: "team@fthco.com", label: "Secondary · Team Account" },
  { name: "FTH Partner", email: "partner@fthco.com", label: "Partner · Settlement" },
];

const CURRENCIES = ["FTH USD", "UNY", "TROPTIONS", "XRP", "USDF", "ATP"];

// ── Static known balances (from Genesis Wallet — updated when chain is live) ──
const STATIC_BALANCES = [
  { label: "FTH USD", value: 99900, prefix: "$", chain: "Chain 7331", color: "#22c55e" },
  { label: "UNY", value: 50000, prefix: "", chain: "Chain 7331", color: "#c9a24a" },
  { label: "USDF STELLAR", value: 250000, prefix: "", chain: "Stellar", color: "#00d4ff" },
  { label: "USDF XRPL", value: 250000, prefix: "", chain: "XRPL", color: "#00d4ff" },
  { label: "XLM", value: 10000, prefix: "", chain: "Stellar", color: "#7ebdf2" },
  { label: "BTC", value: 0.5, prefix: "", chain: "Bitcoin", color: "#f59e0b" },
  { label: "ETH", value: 10, prefix: "", chain: "Ethereum", color: "#a78bfa" },
  { label: "SOL", value: 100, prefix: "", chain: "Solana", color: "#00d4ff" },
  { label: "MATIC", value: 50000, prefix: "", chain: "Polygon", color: "#8b5cf6" },
  { label: "USDC ETH", value: 25000, prefix: "$", chain: "Ethereum", color: "#2775ca" },
  { label: "USDT TRC20", value: 25000, prefix: "$", chain: "TRON", color: "#ef4444" },
  { label: "FTHUSD XRPL", value: 50000, prefix: "$", chain: "XRPL", color: "#22c55e" },
];

// ── Formatters ────────────────────────────────────────────────────
function fmtNum(n: number): string {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(2) + "M";
  if (n >= 1_000) return n.toLocaleString("en-US", { maximumFractionDigits: 0 });
  if (n === 0) return "—";
  return n.toLocaleString("en-US", { maximumFractionDigits: 4 });
}

// ── Sub-components ────────────────────────────────────────────────
function StatusDot({ online }: { online: boolean }) {
  return (
    <span
      style={{
        display: "inline-block",
        width: 8,
        height: 8,
        borderRadius: "50%",
        background: online ? "var(--xos-green)" : "var(--xos-red)",
        marginRight: 6,
        flexShrink: 0,
        boxShadow: online ? "0 0 6px var(--xos-green)" : "none",
      }}
    />
  );
}

function TabBtn({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        background: active ? "var(--xos-surface-3)" : "transparent",
        border: active ? "1px solid var(--xos-border-2)" : "1px solid transparent",
        color: active ? "var(--xos-gold)" : "var(--xos-text-muted)",
        borderRadius: "var(--xos-radius)",
        padding: "0.45rem 1rem",
        fontSize: "0.8rem",
        fontWeight: active ? 700 : 500,
        cursor: "pointer",
        transition: "all var(--xos-transition)",
        letterSpacing: active ? "0.02em" : 0,
        fontFamily: "inherit",
      }}
    >
      {children}
    </button>
  );
}

function BalancePill({
  label,
  value,
  prefix,
  chain,
  color,
}: {
  label: string;
  value: number;
  prefix: string;
  chain: string;
  color: string;
}) {
  return (
    <div
      style={{
        background: "var(--xos-surface-2)",
        border: "1px solid var(--xos-border)",
        borderRadius: "var(--xos-radius)",
        padding: "0.75rem 1rem",
        display: "flex",
        flexDirection: "column",
        gap: 2,
      }}
    >
      <div style={{ fontSize: "0.68rem", color: "var(--xos-text-subtle)", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase" }}>
        {label}
      </div>
      <div style={{ fontSize: "1.1rem", fontWeight: 700, color, fontVariantNumeric: "tabular-nums" }}>
        {prefix}{fmtNum(value)}
      </div>
      <div style={{ fontSize: "0.65rem", color: "var(--xos-text-subtle)" }}>{chain}</div>
    </div>
  );
}

// ── Dashboard Tab ─────────────────────────────────────────────────
function DashboardTab({
  xrplBalances,
  chainHealth,
  xrplAddress,
  onAddressChange,
  onLoadXrpl,
  loadingXrpl,
}: {
  xrplBalances: XrplBalances | null;
  chainHealth: ChainHealth | null;
  xrplAddress: string;
  onAddressChange: (v: string) => void;
  onLoadXrpl: () => void;
  loadingXrpl: boolean;
}) {
  const atpBalance = chainHealth?.chairman?.atp;
  const unyBalance = chainHealth?.chairman?.uny ?? 50000;
  const fthUsd = chainHealth?.chairman?.fthusd ?? 99900;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
      {/* Primary cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: "0.75rem" }}>
        <div className="xos-card" style={{ padding: "1.1rem", borderTop: "2px solid var(--xos-green)" }}>
          <div style={{ fontSize: "0.65rem", color: "var(--xos-text-subtle)", fontWeight: 600, letterSpacing: "0.08em", marginBottom: 4 }}>USDF</div>
          <div style={{ fontSize: "1.6rem", fontWeight: 800, color: "var(--xos-green)" }}>
            ${fmtNum(fthUsd)}
          </div>
          <div style={{ fontSize: "0.68rem", color: "var(--xos-text-subtle)", marginTop: 4 }}>XRPL · Stellar</div>
        </div>
        <div className="xos-card" style={{ padding: "1.1rem", borderTop: "2px solid var(--xos-cyan)" }}>
          <div style={{ fontSize: "0.65rem", color: "var(--xos-text-subtle)", fontWeight: 600, letterSpacing: "0.08em", marginBottom: 4 }}>ATP ENERGY</div>
          <div style={{ fontSize: "1.6rem", fontWeight: 800, color: "var(--xos-cyan)" }}>
            {atpBalance != null ? fmtNum(atpBalance) : "—"}
          </div>
          <div style={{ fontSize: "0.68rem", color: "var(--xos-text-subtle)", marginTop: 4 }}>
            Chain 7332 · {chainHealth?.chain7332.agents ?? "?"} agents online
          </div>
        </div>
        <div className="xos-card" style={{ padding: "1.1rem", borderTop: "2px solid var(--xos-gold)" }}>
          <div style={{ fontSize: "0.65rem", color: "var(--xos-text-subtle)", fontWeight: 600, letterSpacing: "0.08em", marginBottom: 4 }}>UNY TOKEN</div>
          <div style={{ fontSize: "1.6rem", fontWeight: 800, color: "var(--xos-gold)" }}>
            {fmtNum(unyBalance)}
          </div>
          <div style={{ fontSize: "0.68rem", color: "var(--xos-text-subtle)", marginTop: 4 }}>XRPL · Stellar</div>
        </div>
        <div className="xos-card" style={{ padding: "1.1rem", borderTop: "2px solid var(--xos-green)" }}>
          <div style={{ fontSize: "0.65rem", color: "var(--xos-text-subtle)", fontWeight: 600, letterSpacing: "0.08em", marginBottom: 4 }}>FTH USD</div>
          <div style={{ fontSize: "1.6rem", fontWeight: 800, color: "var(--xos-green)" }}>
            ${fmtNum(fthUsd)}
          </div>
          <div style={{ fontSize: "0.68rem", color: "var(--xos-text-subtle)", marginTop: 4 }}>Chain 7331</div>
        </div>
      </div>

      {/* Chain health */}
      <div className="xos-card" style={{ padding: "1rem" }}>
        <div style={{ fontWeight: 700, fontSize: "0.8rem", color: "var(--xos-gold)", marginBottom: "0.75rem", letterSpacing: "0.05em" }}>
          ◈ CHAIN HEALTH
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <div style={{ display: "flex", alignItems: "center", fontSize: "0.78rem" }}>
              <StatusDot online={chainHealth?.chain7331.online ?? false} />
              <span style={{ color: "var(--xos-text-muted)" }}>FTH Pay</span>
              <span style={{ marginLeft: "auto", color: "var(--xos-text-subtle)", fontSize: "0.7rem" }}>Chain 7331</span>
            </div>
            {chainHealth?.chain7331.height != null && (
              <div style={{ fontSize: "0.7rem", color: "var(--xos-text-subtle)", paddingLeft: 14 }}>
                Block #{chainHealth.chain7331.height.toLocaleString()}
              </div>
            )}
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <div style={{ display: "flex", alignItems: "center", fontSize: "0.78rem" }}>
              <StatusDot online={chainHealth?.chain7332.online ?? false} />
              <span style={{ color: "var(--xos-text-muted)" }}>Apostle Chain</span>
              <span style={{ marginLeft: "auto", color: "var(--xos-text-subtle)", fontSize: "0.7rem" }}>Chain 7332</span>
            </div>
            {chainHealth?.chain7332.height != null && (
              <div style={{ fontSize: "0.7rem", color: "var(--xos-text-subtle)", paddingLeft: 14 }}>
                Block #{chainHealth.chain7332.height.toLocaleString()}
                {chainHealth.chain7332.agents != null && ` · ${chainHealth.chain7332.agents} agents`}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* XRPL address lookup */}
      <div className="xos-card" style={{ padding: "1rem" }}>
        <div style={{ fontWeight: 700, fontSize: "0.8rem", color: "var(--xos-cyan)", marginBottom: "0.75rem" }}>
          ◈ XRPL WALLET LOOKUP
        </div>
        <div style={{ display: "flex", gap: "0.5rem" }}>
          <input
            className="xos-input"
            placeholder="r... (XRPL address)"
            value={xrplAddress}
            onChange={(e) => onAddressChange(e.target.value)}
            style={{ flex: 1, fontFamily: "var(--xos-font-mono)", fontSize: "0.78rem" }}
          />
          <button
            className="xos-btn xos-btn--cyan"
            onClick={onLoadXrpl}
            disabled={loadingXrpl || !xrplAddress}
          >
            {loadingXrpl ? "…" : "Load"}
          </button>
        </div>
        {xrplBalances && (
          <div style={{ marginTop: "0.75rem", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.78rem" }}>
              <span style={{ color: "var(--xos-text-muted)" }}>XRP</span>
              <span style={{ color: "var(--xos-gold)", fontWeight: 700 }}>{xrplBalances.xrp.toFixed(4)}</span>
            </div>
            {xrplBalances.iou.map((iou, i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", fontSize: "0.75rem" }}>
                <span style={{ color: "var(--xos-text-subtle)" }}>
                  {iou.currency}
                  <span style={{ fontSize: "0.65rem", marginLeft: 4, color: "var(--xos-text-subtle)" }}>
                    {iou.issuer.slice(0, 8)}…
                  </span>
                </span>
                <span style={{ color: iou.balance < 0 ? "var(--xos-red)" : "var(--xos-text)", fontWeight: 600 }}>
                  {fmtNum(Math.abs(iou.balance))}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* All Balances */}
      <div className="xos-card" style={{ padding: "1rem" }}>
        <div style={{ fontWeight: 700, fontSize: "0.8rem", color: "var(--xos-text-muted)", marginBottom: "0.75rem" }}>
          ALL BALANCES
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))", gap: "0.5rem" }}>
          {STATIC_BALANCES.map((b) => (
            <BalancePill key={b.label} {...b} />
          ))}
        </div>
      </div>

      {/* Recent activity */}
      <div className="xos-card" style={{ padding: "1rem" }}>
        <div style={{ fontWeight: 700, fontSize: "0.8rem", color: "var(--xos-text-muted)", marginBottom: "0.75rem" }}>
          RECENT LEDGER ACTIVITY
        </div>
        {[
          { to: "FTH Operations", date: "Apr 3 · FTH_USD", amount: -100 },
          { to: "FTH Partner", date: "Mar 30 · FTH_USD", amount: -100 },
          { to: "FTH Operations", date: "Mar 30 · FTH_USD", amount: -50 },
          { to: "FTH Operations", date: "Mar 30 · FTH_USD", amount: -50 },
        ].map((tx, i) => (
          <div key={i} style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "0.5rem 0",
            borderBottom: i < 3 ? "1px solid var(--xos-border)" : "none",
          }}>
            <div>
              <div style={{ fontSize: "0.8rem", fontWeight: 600, color: "var(--xos-text)" }}>
                To {tx.to}
              </div>
              <div style={{ fontSize: "0.7rem", color: "var(--xos-text-subtle)" }}>{tx.date}</div>
            </div>
            <div style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--xos-red)" }}>
              ${tx.amount}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Send Tab ─────────────────────────────────────────────────────
function SendTab() {
  const [contact, setContact] = useState(CONTACTS[0]);
  const [currency, setCurrency] = useState("FTH USD");
  const [amount, setAmount] = useState("25.00");
  const [note, setNote] = useState("");
  const [ready, setReady] = useState(false);

  return (
    <div style={{ maxWidth: 520 }}>
      <div className="xos-card" style={{ padding: "1.5rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
        <div style={{ fontWeight: 700, color: "var(--xos-gold)", marginBottom: "0.25rem" }}>↑ Send Payment</div>

        {/* Contact selector */}
        <div>
          <label style={{ fontSize: "0.72rem", color: "var(--xos-text-muted)", display: "block", marginBottom: 4 }}>
            SEND TO
          </label>
          <select
            className="xos-input"
            value={contact.email}
            onChange={(e) => {
              const c = CONTACTS.find((c) => c.email === e.target.value);
              if (c) setContact(c);
              setReady(false);
            }}
          >
            {CONTACTS.map((c) => (
              <option key={c.email} value={c.email}>
                {c.name} — {c.email}
              </option>
            ))}
          </select>
          <div style={{ fontSize: "0.68rem", color: "var(--xos-text-subtle)", marginTop: 4 }}>
            {contact.label}
          </div>
        </div>

        {/* Currency */}
        <div>
          <label style={{ fontSize: "0.72rem", color: "var(--xos-text-muted)", display: "block", marginBottom: 4 }}>
            CURRENCY
          </label>
          <select className="xos-input" value={currency} onChange={(e) => { setCurrency(e.target.value); setReady(false); }}>
            {CURRENCIES.map((c) => <option key={c}>{c}</option>)}
          </select>
        </div>

        {/* Amount */}
        <div>
          <label style={{ fontSize: "0.72rem", color: "var(--xos-text-muted)", display: "block", marginBottom: 4 }}>
            AMOUNT ({currency})
          </label>
          <input
            className="xos-input"
            type="number"
            min="0.01"
            step="0.01"
            value={amount}
            onChange={(e) => { setAmount(e.target.value); setReady(false); }}
          />
        </div>

        {/* Note */}
        <div>
          <label style={{ fontSize: "0.72rem", color: "var(--xos-text-muted)", display: "block", marginBottom: 4 }}>
            NOTE (optional)
          </label>
          <input
            className="xos-input"
            placeholder="optional"
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
        </div>

        {/* Ready state */}
        {ready && (
          <div style={{
            background: "var(--xos-green-glow)",
            border: "1px solid var(--xos-green-muted)",
            borderRadius: "var(--xos-radius)",
            padding: "0.75rem 1rem",
            fontSize: "0.8rem",
            color: "var(--xos-green)",
          }}>
            ✓ Ready to send <strong>{amount} {currency}</strong> to {contact.name}
          </div>
        )}

        <div style={{ display: "flex", gap: "0.75rem" }}>
          <button
            className="xos-btn xos-btn--gold"
            style={{ flex: 1 }}
            onClick={() => setReady(true)}
            disabled={!amount || parseFloat(amount) <= 0}
          >
            {ready ? "Confirm Send" : "Send"}
          </button>
          {ready && (
            <button className="xos-btn" onClick={() => setReady(false)}>
              Cancel
            </button>
          )}
        </div>

        <div style={{ borderTop: "1px solid var(--xos-border)", paddingTop: "0.75rem" }}>
          <button className="xos-btn" style={{ width: "100%", fontSize: "0.78rem" }}>
            Withdraw ↗
          </button>
        </div>
      </div>

      <div className="xos-risk-box" style={{ marginTop: "0.75rem" }}>
        Internal FTH Pay transfers settle instantly on Chain 7331.
        XRPL / Stellar payments require wallet signing.
      </div>
    </div>
  );
}

// ── Mint Tab ─────────────────────────────────────────────────────
const TROPTIONS_ISSUER = "rPF2M1QjdVh1hkNgmMMTkT9qMU7tA7Wds3";

function MintTab() {
  const [issuer, setIssuer] = useState(TROPTIONS_ISSUER);
  const [currency, setCurrency] = useState("TROPTIONS");
  const [amount, setAmount] = useState("");
  const [recipient, setRecipient] = useState("");
  const [memo, setMemo] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<MintResult | null>(null);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  async function handleMint() {
    setLoading(true);
    setError("");
    setResult(null);
    try {
      const res = await fetch("/exchange-os/api/xrpl/mint", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ issuer, currency, amount, recipient, memo }),
      });
      const data = await res.json() as MintResult & { error?: string };
      if (!res.ok) {
        setError(data.error ?? "Mint failed");
      } else {
        setResult(data);
      }
    } catch {
      setError("Network error — check dev console");
    } finally {
      setLoading(false);
    }
  }

  function copyTx() {
    if (!result) return;
    navigator.clipboard.writeText(JSON.stringify(result.tx, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem", maxWidth: 640 }}>
      <div className="xos-card" style={{ padding: "1.5rem" }}>
        <div style={{ fontWeight: 700, color: "var(--xos-gold)", marginBottom: "1rem" }}>
          ◆ Mint on the Spot — XRPL IOU Issuance
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
          {/* Issuer */}
          <div>
            <label style={{ fontSize: "0.72rem", color: "var(--xos-text-muted)", display: "block", marginBottom: 4 }}>
              ISSUER ADDRESS
            </label>
            <input
              className="xos-input"
              style={{ fontFamily: "var(--xos-font-mono)", fontSize: "0.75rem" }}
              placeholder="r... (your issuer wallet)"
              value={issuer}
              onChange={(e) => { setIssuer(e.target.value); setResult(null); }}
            />
            <div style={{ fontSize: "0.68rem", color: "var(--xos-text-subtle)", marginTop: 3 }}>
              Default: TROPTIONS issuer. Change for custom token.
            </div>
          </div>

          {/* Currency */}
          <div>
            <label style={{ fontSize: "0.72rem", color: "var(--xos-text-muted)", display: "block", marginBottom: 4 }}>
              CURRENCY CODE
            </label>
            <input
              className="xos-input"
              placeholder="e.g. TROPTIONS, USD, GOLD, MYTOKEN"
              value={currency}
              onChange={(e) => { setCurrency(e.target.value); setResult(null); }}
            />
            <div style={{ fontSize: "0.68rem", color: "var(--xos-text-subtle)", marginTop: 3 }}>
              3-char standard OR up to 20-char (auto-encoded to 40-char hex)
            </div>
          </div>

          {/* Amount */}
          <div>
            <label style={{ fontSize: "0.72rem", color: "var(--xos-text-muted)", display: "block", marginBottom: 4 }}>
              AMOUNT TO MINT
            </label>
            <input
              className="xos-input"
              type="number"
              min="0.000001"
              step="any"
              placeholder="e.g. 1000"
              value={amount}
              onChange={(e) => { setAmount(e.target.value); setResult(null); }}
            />
          </div>

          {/* Recipient */}
          <div>
            <label style={{ fontSize: "0.72rem", color: "var(--xos-text-muted)", display: "block", marginBottom: 4 }}>
              RECIPIENT XRPL ADDRESS
            </label>
            <input
              className="xos-input"
              style={{ fontFamily: "var(--xos-font-mono)", fontSize: "0.75rem" }}
              placeholder="r... (must have trustline set)"
              value={recipient}
              onChange={(e) => { setRecipient(e.target.value); setResult(null); }}
            />
          </div>

          {/* Memo */}
          <div>
            <label style={{ fontSize: "0.72rem", color: "var(--xos-text-muted)", display: "block", marginBottom: 4 }}>
              MEMO (optional)
            </label>
            <input
              className="xos-input"
              placeholder="e.g. TROPTIONS POF Escrow Issuance"
              value={memo}
              onChange={(e) => { setMemo(e.target.value); }}
            />
          </div>

          {error && (
            <div style={{
              background: "var(--xos-red-glow)",
              border: "1px solid var(--xos-red-muted)",
              borderRadius: "var(--xos-radius)",
              padding: "0.65rem 0.85rem",
              fontSize: "0.8rem",
              color: "var(--xos-red)",
            }}>
              ✗ {error}
            </div>
          )}

          <button
            className="xos-btn xos-btn--gold"
            onClick={handleMint}
            disabled={loading || !issuer || !currency || !amount || !recipient}
          >
            {loading ? "Building Transaction…" : "◆ Build Mint Transaction"}
          </button>
        </div>
      </div>

      {/* Result */}
      {result && (
        <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
          {/* Trustline warning */}
          {result.trustlineWarning && (
            <div style={{
              background: "rgba(245,158,11,0.08)",
              border: "1px solid #a07830",
              borderRadius: "var(--xos-radius)",
              padding: "0.85rem 1rem",
              fontSize: "0.8rem",
              color: "#e8c066",
            }}>
              ⚠ {result.trustlineWarning}
              <div style={{ marginTop: "0.5rem", fontSize: "0.72rem", color: "var(--xos-text-muted)" }}>
                {result.steps?.[0]}
              </div>
            </div>
          )}

          {result.hasTrustline && (
            <div style={{
              background: "var(--xos-green-glow)",
              border: "1px solid var(--xos-green-muted)",
              borderRadius: "var(--xos-radius)",
              padding: "0.65rem 1rem",
              fontSize: "0.8rem",
              color: "var(--xos-green)",
            }}>
              ✓ Trustline confirmed. Recipient is ready to receive {currency}.
            </div>
          )}

          {/* TrustSet template (if needed) */}
          {result.trustSetTemplate && (
            <div className="xos-card" style={{ padding: "1rem" }}>
              <div style={{ fontWeight: 600, fontSize: "0.78rem", color: "var(--xos-amber)", marginBottom: "0.5rem" }}>
                Step 1 — Recipient: Sign TrustSet
              </div>
              <pre style={{
                background: "var(--xos-surface-2)",
                borderRadius: "var(--xos-radius)",
                padding: "0.75rem",
                fontSize: "0.68rem",
                fontFamily: "var(--xos-font-mono)",
                color: "var(--xos-text-muted)",
                overflow: "auto",
                maxHeight: 180,
                margin: 0,
              }}>
                {JSON.stringify(result.trustSetTemplate, null, 2)}
              </pre>
            </div>
          )}

          {/* Payment transaction */}
          <div className="xos-card" style={{ padding: "1rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
              <div style={{ fontWeight: 600, fontSize: "0.78rem", color: "var(--xos-cyan)" }}>
                {result.trustSetTemplate ? "Step 2 — " : ""}Unsigned Payment Transaction
              </div>
              <button
                onClick={copyTx}
                style={{
                  background: "var(--xos-surface-3)",
                  border: "1px solid var(--xos-border-2)",
                  borderRadius: "var(--xos-radius)",
                  padding: "0.25rem 0.65rem",
                  fontSize: "0.72rem",
                  color: copied ? "var(--xos-green)" : "var(--xos-text-muted)",
                  cursor: "pointer",
                  fontFamily: "inherit",
                }}
              >
                {copied ? "✓ Copied" : "Copy JSON"}
              </button>
            </div>
            <pre style={{
              background: "var(--xos-surface-2)",
              borderRadius: "var(--xos-radius)",
              padding: "0.75rem",
              fontSize: "0.68rem",
              fontFamily: "var(--xos-font-mono)",
              color: "var(--xos-text-muted)",
              overflow: "auto",
              maxHeight: 260,
              margin: 0,
            }}>
              {JSON.stringify(result.tx, null, 2)}
            </pre>
          </div>

          {/* Signing instructions */}
          <div className="xos-card" style={{ padding: "1rem" }}>
            <div style={{ fontWeight: 600, fontSize: "0.78rem", color: "var(--xos-gold)", marginBottom: "0.5rem" }}>
              Sign &amp; Broadcast
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              <a
                href="https://xrpl.org/resources/dev-tools/transaction-sender"
                target="_blank"
                rel="noopener noreferrer"
                className="xos-btn xos-btn--gold"
                style={{ textAlign: "center", textDecoration: "none", fontSize: "0.8rem" }}
              >
                Open XRPL Dev Tools →
              </a>
              <a
                href="https://xumm.app"
                target="_blank"
                rel="noopener noreferrer"
                className="xos-btn"
                style={{ textAlign: "center", textDecoration: "none", fontSize: "0.8rem" }}
              >
                Open Xaman Wallet →
              </a>
            </div>
            <div style={{ fontSize: "0.7rem", color: "var(--xos-text-subtle)", marginTop: "0.5rem", lineHeight: 1.5 }}>
              Paste the JSON above into XRPL Dev Tools or Xaman to sign. The transaction mints {currency} as an IOU from your issuer account.
            </div>
          </div>
        </div>
      )}

      <div className="xos-risk-box">
        IOU issuance on XRPL requires the recipient to have an active trustline.
        The system never stores or transmits private keys. All signing happens in your wallet.
      </div>
    </div>
  );
}

// ── History Tab ───────────────────────────────────────────────────
function HistoryTab() {
  const [address, setAddress] = useState("");
  const [txs, setTxs] = useState<XrplTx[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function loadHistory() {
    if (!address) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/exchange-os/api/xrpl/balances?address=${address}`);
      // Use account_tx via a separate fetch (we reuse balances endpoint for now)
      // In a real impl you'd call /api/xrpl/history
      if (!res.ok) throw new Error("API error");
      // Placeholder — history needs a dedicated /api/xrpl/history route
      setTxs([]);
      setError("XRPL transaction history requires a dedicated history endpoint. Coming soon.");
    } catch (e) {
      setError("Failed to load history");
    } finally {
      setLoading(false);
    }
  }

  // Static history (role-based identifiers, no personal names)
  const staticHistory = [
    { id: "tx1", to: "FTH Operations", date: "Apr 3, 2026", currency: "FTH_USD", amount: -100, type: "send" as const },
    { id: "tx2", to: "FTH Partner", date: "Mar 30, 2026", currency: "FTH_USD", amount: -100, type: "send" as const },
    { id: "tx3", to: "FTH Operations", date: "Mar 30, 2026", currency: "FTH_USD", amount: -50, type: "send" as const },
    { id: "tx4", to: "FTH Operations", date: "Mar 30, 2026", currency: "FTH_USD", amount: -50, type: "send" as const },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem", maxWidth: 640 }}>
      {/* FTH Pay history (static from genesis) */}
      <div className="xos-card" style={{ padding: "1rem" }}>
        <div style={{ fontWeight: 700, fontSize: "0.8rem", color: "var(--xos-text-muted)", marginBottom: "0.75rem" }}>
          FTH PAY LEDGER — Recent Activity
        </div>
        {staticHistory.map((tx, i) => (
          <div key={tx.id} style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "0.6rem 0",
            borderBottom: i < staticHistory.length - 1 ? "1px solid var(--xos-border)" : "none",
          }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{
                width: 28,
                height: 28,
                borderRadius: "50%",
                background: "var(--xos-surface-3)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "0.75rem",
                color: "var(--xos-red)",
                flexShrink: 0,
              }}>↑</div>
              <div style={{ marginLeft: 8 }}>
                <div style={{ fontSize: "0.8rem", fontWeight: 600, color: "var(--xos-text)" }}>
                  To {tx.to}
                </div>
                <div style={{ fontSize: "0.7rem", color: "var(--xos-text-subtle)" }}>
                  {tx.date} · {tx.currency}
                </div>
              </div>
            </div>
            <div style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--xos-red)" }}>
              ${tx.amount}
            </div>
          </div>
        ))}
      </div>

      {/* XRPL transaction lookup */}
      <div className="xos-card" style={{ padding: "1rem" }}>
        <div style={{ fontWeight: 700, fontSize: "0.8rem", color: "var(--xos-cyan)", marginBottom: "0.75rem" }}>
          XRPL TRANSACTION HISTORY
        </div>
        <div style={{ display: "flex", gap: "0.5rem", marginBottom: "0.75rem" }}>
          <input
            className="xos-input"
            style={{ flex: 1, fontFamily: "var(--xos-font-mono)", fontSize: "0.75rem" }}
            placeholder="r... (XRPL address)"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
          <button className="xos-btn xos-btn--cyan" onClick={loadHistory} disabled={loading || !address}>
            {loading ? "…" : "Load"}
          </button>
        </div>
        {error && (
          <div style={{ fontSize: "0.75rem", color: "var(--xos-text-subtle)", padding: "0.5rem", background: "var(--xos-surface-2)", borderRadius: "var(--xos-radius)" }}>
            {error}
          </div>
        )}
        {txs.length === 0 && !error && (
          <div style={{ fontSize: "0.75rem", color: "var(--xos-text-subtle)" }}>
            Enter an XRPL address to view on-chain history.
          </div>
        )}
      </div>
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────
// ── Notifications (static — will connect to chain events) ─────────
const NOTIFICATIONS = [
  { id: "n1", type: "ok" as const,   icon: "◈", msg: "Apostle Chain 7332 · 35 agents active",    time: "now" },
  { id: "n2", type: "ok" as const,   icon: "✓", msg: "FTH Pay Chain 7331 · Operational",           time: "2m" },
  { id: "n3", type: "info" as const, icon: "◆", msg: "TROPTIONS · XRPL mainnet height advancing",  time: "5m" },
];

export function FthPayDashboard() {
  const [tab, setTab] = useState<Tab>("dashboard");
  const [xrplAddress, setXrplAddress] = useState("");
  const [xrplBalances, setXrplBalances] = useState<XrplBalances | null>(null);
  const [chainHealth, setChainHealth] = useState<ChainHealth | null>(null);
  const [loadingXrpl, setLoadingXrpl] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifSeen, setNotifSeen] = useState(false);
  const notifCount = notifSeen ? 0 : NOTIFICATIONS.length;

  // Load chain health on mount
  useEffect(() => {
    fetch("/exchange-os/api/chain/health")
      .then((r) => r.ok ? r.json() : null)
      .then((d: ChainHealth | null) => { if (d) setChainHealth(d); })
      .catch(() => {});
  }, []);

  const loadXrpl = useCallback(async () => {
    if (!xrplAddress) return;
    setLoadingXrpl(true);
    try {
      const res = await fetch(`/exchange-os/api/xrpl/balances?address=${xrplAddress}`);
      if (res.ok) {
        const data = await res.json() as XrplBalances;
        setXrplBalances(data);
      }
    } catch {}
    setLoadingXrpl(false);
  }, [xrplAddress]);

  const goTab = (t: Tab) => { setTab(t); setMenuOpen(false); };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem", position: "relative" }}>

      {/* ── Hamburger drawer backdrop ── */}
      {menuOpen && (
        <div
          onClick={() => setMenuOpen(false)}
          style={{
            position: "fixed", inset: 0, zIndex: 100,
            background: "rgba(5,13,24,0.72)", backdropFilter: "blur(3px)",
          }}
        />
      )}

      {/* ── Hamburger side drawer ── */}
      <div style={{
        position: "fixed", top: 0, left: 0, bottom: 0, width: 256, zIndex: 101,
        background: "var(--xos-surface)", borderRight: "1px solid var(--xos-border-2)",
        padding: "1.25rem 1rem",
        transform: menuOpen ? "translateX(0)" : "translateX(-110%)",
        transition: "transform 0.2s cubic-bezier(0.4,0,0.2,1)",
        display: "flex", flexDirection: "column", gap: "0.35rem",
        overflowY: "auto",
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
          <span style={{ fontSize: "0.9rem", fontWeight: 800, color: "var(--xos-gold)", letterSpacing: "0.05em" }}>◆ GENESIS</span>
          <button onClick={() => setMenuOpen(false)} style={{ background: "none", border: "none", color: "var(--xos-text-muted)", cursor: "pointer", fontSize: "1rem", fontFamily: "inherit", padding: "0.2rem 0.4rem" }}>✕</button>
        </div>

        <div style={{ fontSize: "0.6rem", color: "var(--xos-text-subtle)", letterSpacing: "0.1em", padding: "0 0.5rem", marginBottom: 2 }}>WALLET</div>
        {(["dashboard", "send", "mint", "history"] as Tab[]).map((t) => {
          const meta = { dashboard: ["⌂", "Dashboard"], send: ["↑", "Send"], mint: ["◆", "Mint"], history: ["↻", "History"] }[t]!;
          return (
            <button key={t} onClick={() => goTab(t)} style={{
              display: "flex", alignItems: "center", gap: "0.65rem",
              background: tab === t ? "var(--xos-surface-3)" : "transparent",
              border: tab === t ? "1px solid var(--xos-border-2)" : "1px solid transparent",
              borderRadius: "var(--xos-radius)", padding: "0.55rem 0.75rem",
              color: tab === t ? "var(--xos-gold)" : "var(--xos-text-muted)",
              fontSize: "0.82rem", fontWeight: tab === t ? 700 : 400,
              cursor: "pointer", width: "100%", textAlign: "left", fontFamily: "inherit",
            }}>
              <span style={{ width: 18, textAlign: "center" }}>{meta[0]}</span> {meta[1]}
            </button>
          );
        })}

        <div style={{ borderTop: "1px solid var(--xos-border)", margin: "0.5rem 0", paddingTop: "0.5rem" }}>
          <div style={{ fontSize: "0.6rem", color: "var(--xos-text-subtle)", letterSpacing: "0.1em", padding: "0 0.5rem", marginBottom: 2 }}>EXCHANGE</div>
          {([
            { href: "/exchange-os", icon: "◈", label: "Markets" },
            { href: "/exchange-os/orderbook", icon: "◈", label: "Order Book" },
            { href: "/exchange-os/tokens", icon: "◈", label: "Token Launcher" },
            { href: "/exchange-os/solana", icon: "◈", label: "Solana SPL" },
          ]).map(({ href, icon, label }) => (
            <a key={href} href={href} style={{
              display: "flex", alignItems: "center", gap: "0.65rem",
              padding: "0.55rem 0.75rem", color: "var(--xos-text-muted)",
              fontSize: "0.8rem", textDecoration: "none", borderRadius: "var(--xos-radius)",
            }}>
              <span style={{ width: 18, textAlign: "center", color: "var(--xos-cyan)" }}>{icon}</span> {label}
            </a>
          ))}
        </div>

        <div style={{ marginTop: "auto", fontSize: "0.6rem", color: "var(--xos-text-subtle)", paddingTop: "1rem", borderTop: "1px solid var(--xos-border)", lineHeight: 1.7 }}>
          ◆ TROPTIONS EXCHANGE<br />Genesis v3.0.0 · Build 20260508
        </div>
      </div>

      {/* ── Notification panel ── */}
      {notifOpen && (
        <div style={{
          position: "fixed", top: 68, right: 16, width: 296, zIndex: 102,
          background: "var(--xos-surface)", border: "1px solid var(--xos-border-2)",
          borderRadius: "var(--xos-radius)", boxShadow: "0 8px 32px rgba(0,0,0,0.55)",
          overflow: "hidden",
        }}>
          <div style={{ padding: "0.75rem 1rem", borderBottom: "1px solid var(--xos-border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--xos-text-muted)", letterSpacing: "0.06em" }}>NOTIFICATIONS</span>
            <button onClick={() => { setNotifOpen(false); setNotifSeen(true); }} style={{ background: "none", border: "none", color: "var(--xos-text-subtle)", cursor: "pointer", fontSize: "0.85rem", fontFamily: "inherit" }}>✕</button>
          </div>
          {NOTIFICATIONS.map((n) => (
            <div key={n.id} style={{ padding: "0.65rem 1rem", borderBottom: "1px solid var(--xos-border)", display: "flex", gap: "0.6rem", alignItems: "flex-start" }}>
              <span style={{ color: n.type === "ok" ? "var(--xos-green)" : "var(--xos-cyan)", marginTop: 1, fontSize: "0.85rem" }}>{n.icon}</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: "0.75rem", color: "var(--xos-text)", lineHeight: 1.4 }}>{n.msg}</div>
                <div style={{ fontSize: "0.63rem", color: "var(--xos-text-subtle)", marginTop: 2 }}>{n.time} ago</div>
              </div>
            </div>
          ))}
          <div style={{ padding: "0.5rem 1rem", textAlign: "center" }}>
            <button onClick={() => { setNotifOpen(false); setNotifSeen(true); }} style={{ background: "none", border: "none", color: "var(--xos-text-subtle)", fontSize: "0.7rem", cursor: "pointer", fontFamily: "inherit" }}>Mark all read</button>
          </div>
        </div>
      )}

      {/* ── Header ── */}
      <div className="xos-card" style={{
        padding: "1rem 1.25rem",
        background: "linear-gradient(135deg, var(--xos-surface) 0%, var(--xos-surface-3) 100%)",
        borderTop: "2px solid var(--xos-gold)",
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "0.75rem" }}>
          {/* Left: hamburger + branding */}
          <div style={{ display: "flex", alignItems: "flex-start", gap: "0.65rem" }}>
            <button
              onClick={() => setMenuOpen(true)}
              aria-label="Open menu"
              style={{
                background: "var(--xos-surface-2)", border: "1px solid var(--xos-border)",
                borderRadius: "var(--xos-radius)", padding: "0.4rem 0.55rem",
                cursor: "pointer", color: "var(--xos-text-muted)", fontSize: "1rem",
                fontFamily: "inherit", flexShrink: 0, marginTop: 3, lineHeight: 1,
              }}
            >☰</button>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: 4 }}>
                <span style={{ fontSize: "1rem", fontWeight: 800, color: "var(--xos-gold)", letterSpacing: "0.04em" }}>◆ UNYKORN · GENESIS</span>
                <span style={{ fontSize: "0.63rem", color: "var(--xos-text-subtle)", background: "var(--xos-surface-3)", padding: "1px 6px", borderRadius: 4 }}>v3.0.0</span>
              </div>
              <div style={{ fontSize: "0.72rem", color: "var(--xos-text-muted)" }}>Chairman · Principal · Operator</div>
              <div style={{ fontSize: "0.68rem", color: "var(--xos-text-subtle)" }}>TROPTIONS Exchange · UnyKorn.org</div>
            </div>
          </div>
          {/* Right: notification bell + guard */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "0.4rem" }}>
            <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
              <button
                onClick={() => { setNotifOpen(!notifOpen); if (!notifOpen) setNotifSeen(true); }}
                aria-label="Notifications"
                style={{
                  position: "relative", background: "var(--xos-surface-2)", border: "1px solid var(--xos-border)",
                  borderRadius: "var(--xos-radius)", padding: "0.35rem 0.5rem",
                  cursor: "pointer", fontSize: "0.9rem", fontFamily: "inherit",
                  color: notifCount > 0 ? "var(--xos-gold)" : "var(--xos-text-subtle)",
                }}
              >
                🔔
                {notifCount > 0 && (
                  <span style={{
                    position: "absolute", top: -5, right: -5, width: 15, height: 15,
                    background: "var(--xos-red)", borderRadius: "50%",
                    fontSize: "0.55rem", color: "#fff", fontWeight: 700,
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}>{notifCount}</span>
                )}
              </button>
              <div style={{
                display: "flex", alignItems: "center", gap: 6,
                background: "var(--xos-green-glow)", border: "1px solid var(--xos-green-muted)",
                borderRadius: "var(--xos-radius)", padding: "0.3rem 0.65rem",
                fontSize: "0.72rem", color: "var(--xos-green)", fontWeight: 600,
              }}>
                <StatusDot online />
                Guard: Active
              </div>
            </div>
            <div style={{ fontSize: "0.68rem", color: "var(--xos-text-subtle)" }}>$0 / $50,000 daily</div>
          </div>
        </div>

        {/* Action buttons */}
        <div style={{ display: "flex", gap: "0.5rem", marginTop: "1rem", flexWrap: "wrap" }}>
          {[
            { label: "↑ Send", action: () => goTab("send") },
            { label: "↓ Receive", action: () => {} },
            { label: "◆ Mint", action: () => goTab("mint") },
            { label: "↻ History", action: () => goTab("history") },
          ].map((btn) => (
            <button key={btn.label} className="xos-btn xos-btn--gold" onClick={btn.action} style={{ fontSize: "0.78rem", padding: "0.35rem 0.9rem" }}>
              {btn.label}
            </button>
          ))}
          <button className="xos-btn" style={{ fontSize: "0.78rem", padding: "0.35rem 0.9rem" }}>⇄ Convert</button>
        </div>
      </div>

      {/* Tab bar */}
      <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap" }}>
        {(["dashboard", "send", "mint", "history"] as Tab[]).map((t) => (
          <TabBtn key={t} active={tab === t} onClick={() => goTab(t)}>
            {t === "dashboard" ? "⌂ Dashboard" : t === "send" ? "↑ Send" : t === "mint" ? "◆ Mint" : "↻ History"}
          </TabBtn>
        ))}
      </div>

      {/* Tab content */}
      {tab === "dashboard" && (
        <DashboardTab
          xrplBalances={xrplBalances}
          chainHealth={chainHealth}
          xrplAddress={xrplAddress}
          onAddressChange={setXrplAddress}
          onLoadXrpl={loadXrpl}
          loadingXrpl={loadingXrpl}
        />
      )}
      {tab === "send" && <SendTab />}
      {tab === "mint" && <MintTab />}
      {tab === "history" && <HistoryTab />}

      {/* Footer */}
      <div style={{ textAlign: "center", fontSize: "0.63rem", color: "var(--xos-text-subtle)", paddingBottom: "0.5rem" }}>
        ◆ TROPTIONS EXCHANGE · GENESIS v3 · XRPL · STELLAR · FTH PAY 7331 · APOSTLE 7332 · BUILD 20260508
      </div>
    </div>
  );
}
