"use client";
// TROPTIONS Exchange OS — Top Navigation Bar (Horizon-style)
// Shows: network badge · search · wallet connect status · links

import Link from "next/link";
import { useState } from "react";
import { features } from "@/config/exchange-os/features";
import { xrplConfig } from "@/config/exchange-os/xrpl";

export function TopBar() {
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [showInput, setShowInput] = useState(false);
  const [draft, setDraft] = useState("");

  function handleConnect() {
    if (!showInput) { setShowInput(true); return; }
    const trimmed = draft.trim();
    if (trimmed.startsWith("r") && trimmed.length >= 25) {
      setWalletAddress(trimmed);
      setShowInput(false);
      setDraft("");
    }
  }

  function handleDisconnect() {
    setWalletAddress(null);
    setShowInput(false);
  }

  return (
    <header className="xos-topbar">
      {/* Left: network status */}
      <div className="xos-topbar-left">
        <NetworkBadge />
      </div>

      {/* Center: search shortcut */}
      <div className="xos-topbar-center">
        <Link href="/exchange-os/tokens" className="xos-search-bar" aria-label="Search tokens">
          <span className="xos-search-icon">⌕</span>
          <span className="xos-search-placeholder">Search tokens, addresses…</span>
          <kbd className="xos-kbd">⌘ K</kbd>
        </Link>
      </div>

      {/* Right: wallet + quick links */}
      <div className="xos-topbar-right">
        <Link href="/exchange-os/tokens" className="xos-topbar-pill xos-topbar-pill--outline">
          Markets
        </Link>
        <Link href="/exchange-os/launch" className="xos-topbar-pill xos-topbar-pill--gold">
          Launch Token
        </Link>

        {walletAddress ? (
          <button className="xos-wallet-btn xos-wallet-btn--connected" onClick={handleDisconnect}>
            <span className="xos-wallet-dot xos-wallet-dot--green" />
            {walletAddress.slice(0, 6)}…{walletAddress.slice(-4)}
          </button>
        ) : showInput ? (
          <div className="xos-wallet-input-row">
            <input
              className="xos-input xos-wallet-input"
              placeholder="Paste XRPL address r…"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleConnect()}
              autoFocus
            />
            <button className="xos-wallet-btn xos-wallet-btn--primary" onClick={handleConnect}>
              View
            </button>
            <button className="xos-wallet-btn xos-wallet-btn--ghost" onClick={() => setShowInput(false)}>
              ✕
            </button>
          </div>
        ) : (
          <button className="xos-wallet-btn xos-wallet-btn--connect" onClick={handleConnect}>
            <span className="xos-wallet-dot xos-wallet-dot--amber" />
            Connect Wallet
          </button>
        )}


      </div>
    </header>
  );
}

function NetworkBadge() {
  const isMainnet = xrplConfig.mainnetEnabled;
  return (
    <div className={`xos-network-badge ${isMainnet ? "xos-network-badge--live" : "xos-network-badge--test"}`}>
      <span className={`xos-wallet-dot ${isMainnet ? "xos-wallet-dot--green" : "xos-wallet-dot--amber"}`} />
      <span>XRPL {isMainnet ? "Mainnet" : "Testnet"}</span>
    </div>
  );
}
