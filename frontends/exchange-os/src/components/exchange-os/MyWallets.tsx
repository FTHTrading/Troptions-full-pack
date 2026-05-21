"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { CHAIN_META, type ChainType } from "@/lib/exchange-os/wallet-gen";
import {
  listVaultWallets,
  revealSecret,
  deleteWallet,
  exportWalletBackup,
  getSessionPin,
  verifyPin,
  setSessionPin,
  type VaultWallet,
} from "@/lib/exchange-os/wallet-vault";

// ── Helpers ───────────────────────────────────────────────────────────────────
function truncateAddr(addr: string, chars = 10): string {
  if (addr.length <= chars * 2) return addr;
  return `${addr.slice(0, chars)}…${addr.slice(-6)}`;
}

function copyToClipboard(text: string) {
  navigator.clipboard.writeText(text).catch(() => {});
}

function downloadFile(name: string, content: string) {
  const blob = new Blob([content], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  a.click();
  URL.revokeObjectURL(url);
}

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  } catch {
    return iso;
  }
}

// ── Per-wallet card ───────────────────────────────────────────────────────────
function WalletCard({ wallet, onDelete }: { wallet: VaultWallet; onDelete: () => void }) {
  const meta = CHAIN_META[wallet.chain];
  const [copied, setCopied] = useState(false);
  const [showReveal, setShowReveal] = useState(false);
  const [revealPin, setRevealPin] = useState("");
  const [revealError, setRevealError] = useState("");
  const [secret, setSecret] = useState<string | null>(null);
  const [secretVisible, setSecretVisible] = useState(false);
  const [confirmDel, setConfirmDel] = useState(false);
  const [exporting, setExporting] = useState(false);

  function handleCopy() {
    copyToClipboard(wallet.address);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  }

  async function handleReveal() {
    setRevealError("");
    const pin = getSessionPin() ?? revealPin;
    if (!pin) { setRevealError("Enter your vault password."); return; }
    try {
      const s = await revealSecret(wallet.id, pin);
      setSessionPin(pin);
      setSecret(s);
      setSecretVisible(false);
      setShowReveal(false);
    } catch {
      setRevealError("Incorrect password.");
    }
  }

  async function handleExport() {
    setExporting(true);
    try {
      const pin = getSessionPin() ?? revealPin;
      if (!pin) { setRevealError("Enter your vault password to export."); setExporting(false); return; }
      const json = await exportWalletBackup(wallet.id, pin);
      downloadFile(`troptions-wallet-${wallet.chain}-${Date.now()}.json`, json);
    } catch {
      setRevealError("Export failed — check vault password.");
    } finally {
      setExporting(false);
    }
  }

  const explorerBase: Record<ChainType, string> = {
    xrpl: "https://livenet.xrpl.org/accounts/",
    stellar: "https://stellar.expert/explorer/public/account/",
    solana: "https://explorer.solana.com/address/",
  };

  return (
    <div
      className="xos-card"
      style={{
        padding: "1.25rem",
        border: `1px solid ${meta.color}33`,
        display: "flex",
        flexDirection: "column",
        gap: "0.75rem",
      }}
    >
      {/* Header */}
      <div style={{ display: "flex", alignItems: "flex-start", gap: "0.6rem" }}>
        <span style={{ fontSize: "1.5rem", color: meta.color, lineHeight: 1 }}>{meta.icon}</span>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 700, color: "var(--xos-text)", fontSize: "0.95rem" }}>{wallet.label}</div>
          <div style={{ fontSize: "0.72rem", color: "var(--xos-text-subtle)", marginTop: 1 }}>
            {meta.label} · Created {formatDate(wallet.createdAt)}
          </div>
        </div>
        <span
          style={{
            background: meta.color + "22",
            color: meta.color,
            fontSize: "0.65rem",
            fontWeight: 700,
            padding: "0.15rem 0.5rem",
            borderRadius: 4,
          }}
        >
          {wallet.chain.toUpperCase()}
        </span>
      </div>

      {/* Address */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.5rem",
          background: "var(--xos-surface-2)",
          padding: "0.5rem 0.75rem",
          borderRadius: "var(--xos-radius)",
        }}
      >
        <span
          style={{
            fontFamily: "monospace",
            fontSize: "0.78rem",
            color: "var(--xos-cyan)",
            flex: 1,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
          title={wallet.address}
        >
          {truncateAddr(wallet.address)}
        </span>
        <button
          style={{
            background: "transparent",
            border: "none",
            cursor: "pointer",
            color: copied ? "var(--xos-green)" : "var(--xos-text-muted)",
            fontSize: "0.75rem",
            padding: "0.1rem 0.3rem",
            whiteSpace: "nowrap",
          }}
          onClick={handleCopy}
        >
          {copied ? "✓ Copied" : "Copy"}
        </button>
        <a
          href={`${explorerBase[wallet.chain]}${wallet.address}`}
          target="_blank"
          rel="noreferrer"
          style={{
            color: "var(--xos-text-muted)",
            fontSize: "0.75rem",
            textDecoration: "none",
            padding: "0.1rem 0.3rem",
          }}
        >
          ↗
        </a>
      </div>

      {/* Revealed secret */}
      {secret && (
        <div
          style={{
            background: "rgba(255,200,0,0.06)",
            border: "1px solid var(--xos-gold)",
            borderRadius: "var(--xos-radius)",
            padding: "0.75rem",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.4rem" }}>
            <span style={{ fontSize: "0.75rem", fontWeight: 600, color: "var(--xos-gold)" }}>🔑 Secret Key</span>
            <div style={{ display: "flex", gap: "0.4rem" }}>
              <button
                style={{ background: "transparent", border: "none", cursor: "pointer", color: "var(--xos-text-muted)", fontSize: "0.72rem" }}
                onClick={() => setSecretVisible((v) => !v)}
              >
                {secretVisible ? "Hide" : "Show"}
              </button>
              <button
                style={{ background: "transparent", border: "none", cursor: "pointer", color: "var(--xos-text-muted)", fontSize: "0.72rem" }}
                onClick={() => copyToClipboard(secret)}
              >
                Copy
              </button>
              <button
                style={{ background: "transparent", border: "none", cursor: "pointer", color: "var(--xos-text-subtle)", fontSize: "0.72rem" }}
                onClick={() => setSecret(null)}
              >
                ✕
              </button>
            </div>
          </div>
          <div
            style={{
              fontFamily: "monospace",
              fontSize: "0.72rem",
              color: "var(--xos-gold)",
              wordBreak: "break-all",
              filter: secretVisible ? "none" : "blur(5px)",
              transition: "filter 0.2s",
              userSelect: secretVisible ? "text" : "none",
            }}
          >
            {secret}
          </div>
        </div>
      )}

      {/* Reveal form */}
      {showReveal && !secret && (
        <div style={{ display: "flex", gap: "0.5rem", alignItems: "flex-start", flexDirection: "column" }}>
          <input
            type="password"
            placeholder="Vault password"
            value={revealPin}
            onChange={(e) => { setRevealPin(e.target.value); setRevealError(""); }}
            onKeyDown={(e) => e.key === "Enter" && handleReveal()}
            autoFocus
            style={{
              width: "100%",
              padding: "0.5rem 0.75rem",
              background: "var(--xos-surface-2)",
              border: "1px solid var(--xos-border)",
              borderRadius: "var(--xos-radius)",
              color: "var(--xos-text)",
              fontSize: "0.85rem",
              boxSizing: "border-box",
              outline: "none",
            }}
          />
          {revealError && (
            <div style={{ color: "var(--xos-red)", fontSize: "0.78rem" }}>⚠ {revealError}</div>
          )}
          <div style={{ display: "flex", gap: "0.5rem" }}>
            <button className="xos-btn xos-btn--primary" style={{ fontSize: "0.8rem", padding: "0.35rem 0.85rem" }} onClick={handleReveal}>
              Unlock
            </button>
            <button className="xos-btn xos-btn--outline" style={{ fontSize: "0.8rem", padding: "0.35rem 0.75rem" }} onClick={() => { setShowReveal(false); setRevealError(""); }}>
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Delete confirm */}
      {confirmDel && (
        <div
          style={{
            background: "rgba(255,50,50,0.08)",
            border: "1px solid var(--xos-red)",
            borderRadius: "var(--xos-radius)",
            padding: "0.75rem",
            fontSize: "0.82rem",
            color: "var(--xos-text)",
          }}
        >
          Remove this wallet from the browser? Your keys and funds are NOT deleted — only this entry.
          Make sure you have your backup file or secret before removing.
          <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.6rem" }}>
            <button
              className="xos-btn xos-btn--outline"
              style={{ fontSize: "0.78rem", padding: "0.3rem 0.75rem", borderColor: "var(--xos-red)", color: "var(--xos-red)" }}
              onClick={() => { deleteWallet(wallet.id); onDelete(); }}
            >
              Yes, Remove
            </button>
            <button
              className="xos-btn xos-btn--outline"
              style={{ fontSize: "0.78rem", padding: "0.3rem 0.75rem" }}
              onClick={() => setConfirmDel(false)}
            >
              Keep It
            </button>
          </div>
        </div>
      )}

      {/* Action bar */}
      <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", borderTop: "1px solid var(--xos-border)", paddingTop: "0.75rem" }}>
        {!secret && !showReveal && (
          <button
            className="xos-btn xos-btn--outline"
            style={{ fontSize: "0.78rem", padding: "0.3rem 0.75rem" }}
            onClick={() => {
              const sessionPin = getSessionPin();
              if (sessionPin) {
                revealSecret(wallet.id, sessionPin).then((s) => { setSecret(s); }).catch(() => setShowReveal(true));
              } else {
                setShowReveal(true);
              }
            }}
          >
            🔑 View Secret
          </button>
        )}

        <button
          className="xos-btn xos-btn--outline"
          style={{ fontSize: "0.78rem", padding: "0.3rem 0.75rem" }}
          onClick={handleExport}
          disabled={exporting}
        >
          {exporting ? "…" : "⬇ Backup"}
        </button>

        {wallet.chain === "xrpl" && (
          <Link
            href={`/exchange-os/trade?from=XRP&to=TROPTIONS`}
            className="xos-btn xos-btn--cyan"
            style={{ fontSize: "0.78rem", padding: "0.3rem 0.75rem" }}
          >
            ⟷ Trade
          </Link>
        )}

        {!confirmDel && (
          <button
            style={{
              marginLeft: "auto",
              background: "transparent",
              border: "none",
              cursor: "pointer",
              color: "var(--xos-text-subtle)",
              fontSize: "0.72rem",
              padding: "0.3rem 0.5rem",
            }}
            onClick={() => setConfirmDel(true)}
          >
            Remove
          </button>
        )}
      </div>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export function MyWallets() {
  const [wallets, setWallets] = useState<VaultWallet[]>([]);
  const [loaded, setLoaded] = useState(false);

  const refresh = useCallback(() => {
    setWallets(listVaultWallets());
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- intentional: sync wallet list on mount
    refresh();
    setLoaded(true);
  }, [refresh]);

  if (!loaded) return null;

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.25rem", flexWrap: "wrap", gap: "0.75rem" }}>
        <div>
          <h2 style={{ margin: 0, fontWeight: 900, fontSize: "1.1rem", color: "var(--xos-text)" }}>
            My Wallets
          </h2>
          <div style={{ fontSize: "0.78rem", color: "var(--xos-text-muted)", marginTop: "0.15rem" }}>
            Encrypted in this browser · Keys never leave your device
          </div>
        </div>
        <Link href="/exchange-os/wallet/create" className="xos-btn xos-btn--primary" style={{ fontSize: "0.85rem" }}>
          + Create Wallet
        </Link>
      </div>

      {wallets.length === 0 ? (
        <div
          style={{
            border: "1px dashed var(--xos-border)",
            borderRadius: "var(--xos-radius)",
            padding: "2.5rem 1.5rem",
            textAlign: "center",
          }}
        >
          <div style={{ fontSize: "2.5rem", marginBottom: "0.75rem" }}>⬡</div>
          <div style={{ fontWeight: 700, color: "var(--xos-text)", marginBottom: "0.4rem" }}>No wallets yet</div>
          <div style={{ fontSize: "0.82rem", color: "var(--xos-text-muted)", marginBottom: "1.25rem" }}>
            Create a free XRP, Stellar, or Solana wallet in under 2 minutes — no app download needed.
          </div>
          <Link href="/exchange-os/wallet/create" className="xos-btn xos-btn--primary">
            Create My First Wallet →
          </Link>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "1rem" }}>
          {wallets.map((w) => (
            <WalletCard key={w.id} wallet={w} onDelete={refresh} />
          ))}
        </div>
      )}

      {wallets.length > 0 && (
        <div className="xos-risk-box" style={{ marginTop: "1.25rem" }}>
          🔒 Wallet secrets are encrypted with your vault password and stored only in this browser.
          Clearing browser data will remove them — keep your backup files safe.
        </div>
      )}
    </div>
  );
}
