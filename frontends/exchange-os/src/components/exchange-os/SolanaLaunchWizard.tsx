"use client";
// TROPTIONS Exchange OS — Solana SPL Token Launch Wizard
// Connects to Phantom/Solflare via window.solana and builds token on Solana

import { useState, useEffect } from "react";
import { Connection, clusterApiUrl } from "@solana/web3.js";

// ─── Types ────────────────────────────────────────────────────────────────────

type Step = 1 | 2 | 3 | 4;
type Network = "mainnet-beta" | "devnet";

interface TokenForm {
  name: string;
  symbol: string;
  decimals: number;
  supply: string; // as string to handle large numbers
  description: string;
  imageUrl: string;
  revokeMint: boolean;
  revokeFreeze: boolean;
  network: Network;
}

interface LaunchResult {
  mintAddress: string;
  txSignature: string;
  explorerUrl: string;
}

const DEFAULT_FORM: TokenForm = {
  name: "",
  symbol: "",
  decimals: 9,
  supply: "1000000000",
  description: "",
  imageUrl: "",
  revokeMint: false,
  revokeFreeze: true,
  network: "devnet",
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getProvider(): { publicKey: { toBase58(): string } } | null {
  if (typeof window === "undefined") return null;
  const w = window as Window & {
    solana?: { isPhantom?: boolean; publicKey?: { toBase58(): string }; connect(): Promise<{ publicKey: { toBase58(): string } }> };
    solflare?: { isSolflare?: boolean; publicKey?: { toBase58(): string }; connect(): Promise<{ publicKey: { toBase58(): string } }> };
  };
  return (w.solana ?? w.solflare ?? null) as ReturnType<typeof getProvider>;
}

function shortenAddress(addr: string): string {
  return `${addr.slice(0, 4)}…${addr.slice(-4)}`;
}

// ─── Main wizard ──────────────────────────────────────────────────────────────

export default function SolanaLaunchWizard() {
  const [step, setStep] = useState<Step>(1);
  const [form, setForm] = useState<TokenForm>(DEFAULT_FORM);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [connecting, setConnecting] = useState(false);
  const [launching, setLaunching] = useState(false);
  const [result, setResult] = useState<LaunchResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [walletDetected, setWalletDetected] = useState(false);

  // Detect wallet on mount
  useEffect(() => {
    const check = () => {
      const p = getProvider();
      setWalletDetected(!!p);
      // Auto-populate if already connected
      if (p?.publicKey) setWalletAddress(p.publicKey.toBase58());
    };
    check();
    window.addEventListener("load", check);
    return () => window.removeEventListener("load", check);
  }, []);

  async function connectWallet() {
    setConnecting(true);
    setError(null);
    try {
      const w = window as Window & {
        solana?: { connect(): Promise<{ publicKey: { toBase58(): string } }> };
        solflare?: { connect(): Promise<{ publicKey: { toBase58(): string } }> };
      };
      const provider = w.solana ?? w.solflare;
      if (!provider) throw new Error("No Solana wallet detected. Please install Phantom or Solflare.");
      const { publicKey } = await provider.connect();
      setWalletAddress(publicKey.toBase58());
    } catch (e) {
      setError(String(e));
    } finally {
      setConnecting(false);
    }
  }

  function update<K extends keyof TokenForm>(key: K, value: TokenForm[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function launchToken() {
    setLaunching(true);
    setError(null);
    try {
      if (!walletAddress) throw new Error("Connect your wallet first.");

      // Dynamically import heavy Solana ops to avoid SSR issues
      const { Keypair, Transaction, SystemProgram, sendAndConfirmTransaction } =
        await import("@solana/web3.js");
      const {
        createInitializeMintInstruction,
        createAssociatedTokenAccountInstruction,
        createMintToInstruction,
        getAssociatedTokenAddressSync,
        MINT_SIZE,
        TOKEN_PROGRAM_ID,
        getMinimumBalanceForRentExemptMint,
      } = await import("@solana/spl-token");

      const { PublicKey } = await import("@solana/web3.js");
      const ownerPk = new PublicKey(walletAddress);
      const rpc = form.network === "mainnet-beta"
        ? clusterApiUrl("mainnet-beta")
        : clusterApiUrl("devnet");
      const connection = new Connection(rpc, "confirmed");

      // Create mint keypair
      const mint = Keypair.generate();
      const lamports = await getMinimumBalanceForRentExemptMint(connection);

      // ATA for the owner
      const ata = getAssociatedTokenAddressSync(mint.publicKey, ownerPk);
      const supplyBn = BigInt(
        Math.floor(parseFloat(form.supply) * 10 ** form.decimals)
      );

      const tx = new Transaction().add(
        // Create mint account
        SystemProgram.createAccount({
          fromPubkey: ownerPk,
          newAccountPubkey: mint.publicKey,
          lamports,
          space: MINT_SIZE,
          programId: TOKEN_PROGRAM_ID,
        }),
        // Init mint
        createInitializeMintInstruction(
          mint.publicKey,
          form.decimals,
          ownerPk,
          form.revokeFreeze ? null : ownerPk,
          TOKEN_PROGRAM_ID
        ),
        // Create ATA
        createAssociatedTokenAccountInstruction(ownerPk, ata, ownerPk, mint.publicKey),
        // Mint supply
        createMintToInstruction(mint.publicKey, ata, ownerPk, supplyBn)
      );

      tx.feePayer = ownerPk;
      const { blockhash } = await connection.getLatestBlockhash();
      tx.recentBlockhash = blockhash;

      // Partial sign with mint keypair (new account)
      tx.partialSign(mint);

      // Ask wallet to sign + send
      const w = window as Window & {
        solana?: { signAndSendTransaction(tx: import("@solana/web3.js").Transaction): Promise<{ signature: string }> };
        solflare?: { signAndSendTransaction(tx: import("@solana/web3.js").Transaction): Promise<{ signature: string }> };
      };
      const provider = w.solana ?? w.solflare;
      if (!provider) throw new Error("Wallet disappeared.");
      const { signature } = await provider.signAndSendTransaction(tx);

      const explorerBase =
        form.network === "devnet"
          ? "https://explorer.solana.com"
          : "https://explorer.solana.com";
      const cluster = form.network === "devnet" ? "?cluster=devnet" : "";

      setResult({
        mintAddress: mint.publicKey.toBase58(),
        txSignature: signature,
        explorerUrl: `${explorerBase}/tx/${signature}${cluster}`,
      });
      setStep(4);
    } catch (e) {
      setError(String(e));
    } finally {
      setLaunching(false);
    }
  }

  // ── Rendering ───────────────────────────────────────────────────────────────

  const stepLabels = ["Token Details", "Settings", "Review", "Launched!"];

  return (
    <div
      style={{
        maxWidth: 680,
        margin: "0 auto",
        display: "flex",
        flexDirection: "column",
        gap: "1.5rem",
      }}
    >
      {/* Step progress */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0",
          marginBottom: "0.5rem",
        }}
      >
        {stepLabels.map((label, i) => {
          const n = (i + 1) as Step;
          const done = step > n;
          const active = step === n;
          return (
            <div
              key={n}
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "0.3rem",
                position: "relative",
              }}
            >
              {/* Connector line */}
              {i < 3 && (
                <div
                  style={{
                    position: "absolute",
                    left: "50%",
                    top: 14,
                    width: "100%",
                    height: 2,
                    background: done
                      ? "var(--xos-gold)"
                      : "var(--xos-border-1)",
                    zIndex: 0,
                  }}
                />
              )}
              {/* Circle */}
              <div
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: "50%",
                  background: done
                    ? "var(--xos-gold)"
                    : active
                    ? "var(--xos-surface-2)"
                    : "var(--xos-surface-1)",
                  border: `2px solid ${
                    done || active ? "var(--xos-gold)" : "var(--xos-border-1)"
                  }`,
                  color: done ? "#000" : active ? "var(--xos-gold)" : "var(--xos-text-muted)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "0.72rem",
                  fontWeight: 800,
                  zIndex: 1,
                  position: "relative",
                  flexShrink: 0,
                }}
              >
                {done ? "✓" : n}
              </div>
              <div
                style={{
                  fontSize: "0.65rem",
                  fontWeight: active ? 700 : 400,
                  color: active ? "var(--xos-gold)" : "var(--xos-text-muted)",
                  whiteSpace: "nowrap",
                }}
              >
                {label}
              </div>
            </div>
          );
        })}
      </div>

      {/* Wallet connect */}
      <div
        className="xos-card"
        style={{ display: "flex", alignItems: "center", gap: "1rem", padding: "0.85rem 1rem" }}
      >
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: "50%",
            background: "linear-gradient(135deg, #9945FF, #14F195)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "1rem",
            flexShrink: 0,
          }}
        >
          ◎
        </div>
        {walletAddress ? (
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: "0.72rem", color: "var(--xos-text-muted)" }}>Connected</div>
            <div style={{ fontFamily: "monospace", fontSize: "0.82rem", color: "var(--xos-text)" }}>
              {shortenAddress(walletAddress)}
            </div>
          </div>
        ) : (
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: "0.72rem", color: "var(--xos-text-muted)" }}>
              {walletDetected ? "Wallet detected — connect to continue" : "Install Phantom or Solflare to continue"}
            </div>
          </div>
        )}
        {!walletAddress && (
          <button
            className="xos-btn xos-btn--primary xos-btn--sm"
            onClick={connectWallet}
            disabled={connecting || !walletDetected}
          >
            {connecting ? "Connecting…" : walletDetected ? "Connect" : "No Wallet"}
          </button>
        )}
      </div>

      {/* Network selector */}
      <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
        <span style={{ fontSize: "0.75rem", color: "var(--xos-text-muted)" }}>Network:</span>
        {(["devnet", "mainnet-beta"] as Network[]).map((n) => (
          <button
            key={n}
            onClick={() => update("network", n)}
            className={`xos-btn xos-btn--sm ${form.network === n ? "xos-btn--primary" : "xos-btn--ghost"}`}
          >
            {n === "devnet" ? "Devnet (Free)" : "Mainnet"}
          </button>
        ))}
      </div>

      {/* ── Step 1: Token Details ── */}
      {step === 1 && (
        <div className="xos-card" style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <h3 style={{ margin: 0, color: "var(--xos-gold)", fontSize: "1rem" }}>Token Details</h3>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            <label style={{ display: "flex", flexDirection: "column", gap: "0.3rem" }}>
              <span style={{ fontSize: "0.72rem", color: "var(--xos-text-muted)", fontWeight: 600 }}>Token Name *</span>
              <input
                className="xos-input"
                placeholder="e.g. My Awesome Token"
                value={form.name}
                onChange={(e) => update("name", e.target.value)}
                maxLength={32}
              />
            </label>
            <label style={{ display: "flex", flexDirection: "column", gap: "0.3rem" }}>
              <span style={{ fontSize: "0.72rem", color: "var(--xos-text-muted)", fontWeight: 600 }}>Symbol *</span>
              <input
                className="xos-input"
                placeholder="e.g. MAT"
                value={form.symbol}
                onChange={(e) => update("symbol", e.target.value.toUpperCase())}
                maxLength={10}
              />
            </label>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            <label style={{ display: "flex", flexDirection: "column", gap: "0.3rem" }}>
              <span style={{ fontSize: "0.72rem", color: "var(--xos-text-muted)", fontWeight: 600 }}>Decimals</span>
              <input
                className="xos-input"
                type="number"
                min={0}
                max={9}
                value={form.decimals}
                onChange={(e) => update("decimals", Number(e.target.value))}
              />
            </label>
            <label style={{ display: "flex", flexDirection: "column", gap: "0.3rem" }}>
              <span style={{ fontSize: "0.72rem", color: "var(--xos-text-muted)", fontWeight: 600 }}>Initial Supply</span>
              <input
                className="xos-input"
                placeholder="1000000000"
                value={form.supply}
                onChange={(e) => update("supply", e.target.value.replace(/[^0-9.]/g, ""))}
              />
            </label>
          </div>

          <label style={{ display: "flex", flexDirection: "column", gap: "0.3rem" }}>
            <span style={{ fontSize: "0.72rem", color: "var(--xos-text-muted)", fontWeight: 600 }}>Description</span>
            <textarea
              className="xos-input"
              placeholder="Describe your token…"
              value={form.description}
              onChange={(e) => update("description", e.target.value)}
              rows={3}
              style={{ resize: "vertical" }}
            />
          </label>

          <label style={{ display: "flex", flexDirection: "column", gap: "0.3rem" }}>
            <span style={{ fontSize: "0.72rem", color: "var(--xos-text-muted)", fontWeight: 600 }}>Logo URL (HTTPS)</span>
            <input
              className="xos-input"
              placeholder="https://yourdomain.com/logo.png"
              value={form.imageUrl}
              onChange={(e) => update("imageUrl", e.target.value)}
              type="url"
            />
          </label>

          <button
            className="xos-btn xos-btn--primary"
            onClick={() => setStep(2)}
            disabled={!form.name || !form.symbol}
          >
            Next: Settings →
          </button>
        </div>
      )}

      {/* ── Step 2: Settings ── */}
      {step === 2 && (
        <div className="xos-card" style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <h3 style={{ margin: 0, color: "var(--xos-gold)", fontSize: "1rem" }}>Token Settings</h3>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "0.75rem",
              padding: "1rem",
              border: "1px solid var(--xos-border-1)",
              borderRadius: "var(--xos-radius)",
              background: "var(--xos-surface-1)",
            }}
          >
            <div style={{ fontSize: "0.8rem", fontWeight: 700, color: "var(--xos-text)" }}>
              Authority Settings
            </div>
            <label style={{ display: "flex", alignItems: "center", gap: "0.75rem", cursor: "pointer" }}>
              <input
                type="checkbox"
                checked={form.revokeFreeze}
                onChange={(e) => update("revokeFreeze", e.target.checked)}
                style={{ width: 16, height: 16, accentColor: "var(--xos-gold)" }}
              />
              <div>
                <div style={{ fontSize: "0.8rem", fontWeight: 600, color: "var(--xos-text)" }}>
                  Revoke Freeze Authority{" "}
                  <span style={{ color: "var(--xos-green)", fontSize: "0.68rem" }}>Recommended</span>
                </div>
                <div style={{ fontSize: "0.7rem", color: "var(--xos-text-muted)" }}>
                  Makes the token immutable — no account can be frozen. Increases investor trust.
                </div>
              </div>
            </label>
            <label style={{ display: "flex", alignItems: "center", gap: "0.75rem", cursor: "pointer" }}>
              <input
                type="checkbox"
                checked={form.revokeMint}
                onChange={(e) => update("revokeMint", e.target.checked)}
                style={{ width: 16, height: 16, accentColor: "var(--xos-gold)" }}
              />
              <div>
                <div style={{ fontSize: "0.8rem", fontWeight: 600, color: "var(--xos-text)" }}>
                  Revoke Mint Authority
                </div>
                <div style={{ fontSize: "0.7rem", color: "var(--xos-text-muted)" }}>
                  Permanently fixes the supply. No additional tokens can ever be minted.
                </div>
              </div>
            </label>
          </div>

          <div
            className="xos-risk-box"
            style={{ fontSize: "0.75rem" }}
          >
            ⚠ Revoking authorities is permanent and irreversible. Review carefully before launching.
          </div>

          <div style={{ display: "flex", gap: "0.75rem" }}>
            <button className="xos-btn xos-btn--ghost" onClick={() => setStep(1)}>
              ← Back
            </button>
            <button className="xos-btn xos-btn--primary" style={{ flex: 1 }} onClick={() => setStep(3)}>
              Review →
            </button>
          </div>
        </div>
      )}

      {/* ── Step 3: Review ── */}
      {step === 3 && (
        <div className="xos-card" style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <h3 style={{ margin: 0, color: "var(--xos-gold)", fontSize: "1rem" }}>Review & Launch</h3>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "0.65rem",
              fontSize: "0.82rem",
            }}
          >
            {[
              ["Name", form.name],
              ["Symbol", `$${form.symbol}`],
              ["Decimals", String(form.decimals)],
              ["Supply", Number(form.supply).toLocaleString()],
              ["Network", form.network],
              ["Freeze Auth", form.revokeFreeze ? "Revoked" : "Retained"],
              ["Mint Auth", form.revokeMint ? "Revoked" : "Retained"],
            ].map(([k, v]) => (
              <div
                key={k}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  padding: "0.55rem 0.75rem",
                  background: "var(--xos-surface-1)",
                  borderRadius: "var(--xos-radius)",
                  gap: "0.5rem",
                }}
              >
                <span style={{ color: "var(--xos-text-muted)", fontWeight: 600, fontSize: "0.72rem" }}>{k}</span>
                <span style={{ color: "var(--xos-text)", fontWeight: 700 }}>{v}</span>
              </div>
            ))}
          </div>

          {error && (
            <div style={{ color: "var(--xos-red)", fontSize: "0.78rem", padding: "0.75rem", background: "rgba(239,68,68,0.08)", borderRadius: "var(--xos-radius)", border: "1px solid rgba(239,68,68,0.2)" }}>
              {error}
            </div>
          )}

          <div style={{ display: "flex", gap: "0.75rem" }}>
            <button className="xos-btn xos-btn--ghost" onClick={() => setStep(2)} disabled={launching}>
              ← Back
            </button>
            <button
              className="xos-btn xos-btn--primary"
              style={{ flex: 1 }}
              onClick={launchToken}
              disabled={launching || !walletAddress}
            >
              {launching ? "Launching…" : "🚀 Launch Token"}
            </button>
          </div>

          {!walletAddress && (
            <div style={{ fontSize: "0.72rem", color: "var(--xos-text-muted)", textAlign: "center" }}>
              Connect your wallet above to launch.
            </div>
          )}
        </div>
      )}

      {/* ── Step 4: Launched ── */}
      {step === 4 && result && (
        <div
          className="xos-card"
          style={{ textAlign: "center", display: "flex", flexDirection: "column", gap: "1.25rem", alignItems: "center" }}
        >
          <div style={{ fontSize: "3rem" }}>🎉</div>
          <h3 style={{ margin: 0, color: "var(--xos-gold)", fontSize: "1.25rem" }}>
            Token Launched!
          </h3>
          <p style={{ color: "var(--xos-text-muted)", margin: 0, fontSize: "0.85rem" }}>
            {form.name} (${form.symbol}) is live on{" "}
            {form.network === "devnet" ? "Solana Devnet" : "Solana Mainnet"}.
          </p>

          <div
            style={{
              width: "100%",
              display: "flex",
              flexDirection: "column",
              gap: "0.65rem",
              fontSize: "0.78rem",
            }}
          >
            <div
              style={{
                padding: "0.65rem 0.85rem",
                background: "var(--xos-surface-1)",
                borderRadius: "var(--xos-radius)",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: "0.5rem",
              }}
            >
              <span style={{ color: "var(--xos-text-muted)", fontWeight: 600 }}>Mint Address</span>
              <span style={{ fontFamily: "monospace", color: "var(--xos-cyan)", fontSize: "0.72rem", wordBreak: "break-all" }}>
                {result.mintAddress}
              </span>
            </div>
            <div
              style={{
                padding: "0.65rem 0.85rem",
                background: "var(--xos-surface-1)",
                borderRadius: "var(--xos-radius)",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: "0.5rem",
              }}
            >
              <span style={{ color: "var(--xos-text-muted)", fontWeight: 600 }}>TX Signature</span>
              <span style={{ fontFamily: "monospace", color: "var(--xos-text-muted)", fontSize: "0.68rem" }}>
                {result.txSignature.slice(0, 16)}…
              </span>
            </div>
          </div>

          <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", justifyContent: "center" }}>
            <a
              href={result.explorerUrl}
              target="_blank"
              rel="noreferrer"
              className="xos-btn xos-btn--primary"
            >
              View on Explorer ↗
            </a>
            <button
              className="xos-btn xos-btn--ghost"
              onClick={() => {
                setStep(1);
                setForm(DEFAULT_FORM);
                setResult(null);
                setError(null);
              }}
            >
              Launch Another
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
