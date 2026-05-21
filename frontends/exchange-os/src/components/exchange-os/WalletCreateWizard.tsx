"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { generateWallet, CHAIN_META, type ChainType, type GeneratedWallet } from "@/lib/exchange-os/wallet-gen";
import {
  vaultExists,
  initVault,
  verifyPin,
  addWallet,
  getSessionPin,
  setSessionPin,
  exportWalletBackup,
} from "@/lib/exchange-os/wallet-vault";

// ── Step types ─────────────────────────────────────────────────────────────────
type Step = "chain" | "pin" | "generate" | "done";

// ── Small helpers ──────────────────────────────────────────────────────────────
function uid(): string {
  return crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).slice(2);
}

function truncateAddr(addr: string): string {
  if (addr.length <= 16) return addr;
  return `${addr.slice(0, 10)}…${addr.slice(-6)}`;
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

// ── Styles ────────────────────────────────────────────────────────────────────
const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "0.65rem 0.875rem",
  background: "var(--xos-surface-2)",
  border: "1px solid var(--xos-border)",
  borderRadius: "var(--xos-radius)",
  color: "var(--xos-text)",
  fontSize: "0.9rem",
  outline: "none",
  boxSizing: "border-box",
};

// ── Step indicator ─────────────────────────────────────────────────────────────
const STEPS: { key: Step; label: string }[] = [
  { key: "chain", label: "Choose Chain" },
  { key: "pin", label: "Secure It" },
  { key: "generate", label: "Create Wallet" },
  { key: "done", label: "All Done" },
];

function StepBar({ current }: { current: Step }) {
  const idx = STEPS.findIndex((s) => s.key === current);
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 0,
        marginBottom: "2rem",
        overflowX: "auto",
      }}
    >
      {STEPS.map((s, i) => {
        const done = i < idx;
        const active = i === idx;
        return (
          <div key={s.key} style={{ display: "flex", alignItems: "center", flex: i < STEPS.length - 1 ? 1 : "none" }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", minWidth: 70 }}>
              <div
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: 700,
                  fontSize: "0.8rem",
                  background: done
                    ? "var(--xos-green)"
                    : active
                      ? "var(--xos-gold)"
                      : "var(--xos-surface-2)",
                  color: done || active ? "#000" : "var(--xos-text-muted)",
                  border: active ? "2px solid var(--xos-gold)" : "2px solid transparent",
                }}
              >
                {done ? "✓" : i + 1}
              </div>
              <div
                style={{
                  fontSize: "0.65rem",
                  marginTop: "0.2rem",
                  color: active ? "var(--xos-gold)" : done ? "var(--xos-green)" : "var(--xos-text-muted)",
                  textAlign: "center",
                  whiteSpace: "nowrap",
                }}
              >
                {s.label}
              </div>
            </div>
            {i < STEPS.length - 1 && (
              <div
                style={{
                  flex: 1,
                  height: 2,
                  background: done ? "var(--xos-green)" : "var(--xos-border)",
                  margin: "0 4px",
                  marginBottom: 18,
                }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

// ── Chain selector card ────────────────────────────────────────────────────────
function ChainCard({
  chain,
  selected,
  onSelect,
}: {
  chain: ChainType;
  selected: boolean;
  onSelect: () => void;
}) {
  const meta = CHAIN_META[chain];
  return (
    <button
      onClick={onSelect}
      style={{
        background: selected ? "var(--xos-surface-2)" : "var(--xos-surface-1)",
        border: selected ? `2px solid ${meta.color}` : "2px solid var(--xos-border)",
        borderRadius: "var(--xos-radius)",
        padding: "1.25rem 1rem",
        cursor: "pointer",
        textAlign: "left",
        display: "flex",
        flexDirection: "column",
        gap: "0.4rem",
        transition: "border-color 0.15s",
        width: "100%",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
        <span style={{ fontSize: "1.5rem", color: meta.color }}>{meta.icon}</span>
        <span style={{ fontWeight: 700, fontSize: "1rem", color: "var(--xos-text)" }}>{meta.label}</span>
        {selected && (
          <span
            style={{
              marginLeft: "auto",
              background: meta.color,
              color: "#000",
              fontSize: "0.65rem",
              fontWeight: 700,
              padding: "0.1rem 0.4rem",
              borderRadius: 4,
            }}
          >
            Selected
          </span>
        )}
      </div>
      <div style={{ fontSize: "0.8rem", color: "var(--xos-text-muted)", lineHeight: 1.4 }}>
        {meta.description}
      </div>
    </button>
  );
}

// ── Main wizard ────────────────────────────────────────────────────────────────
export function WalletCreateWizard() {
  const [step, setStep] = useState<Step>("chain");
  const [label, setLabel] = useState("");
  const [chain, setChain] = useState<ChainType>("xrpl");
  const [pin, setPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [pinError, setPinError] = useState("");
  const [generating, setGenerating] = useState(false);
  const [genError, setGenError] = useState("");
  const [wallet, setWallet] = useState<GeneratedWallet | null>(null);
  const [walletId] = useState(() => uid());
  const [secretVisible, setSecretVisible] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [saveError, setSaveError] = useState("");

  const isNewVault = !vaultExists();

  function handleCopy(text: string, key: string) {
    copyToClipboard(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 1800);
  }

  // Step 1 → Step 2
  function handleChainNext() {
    if (!label.trim()) return;
    setStep("pin");
  }

  // Step 2 → Step 3 (validate PIN, then generate)
  async function handlePinNext() {
    setPinError("");

    if (isNewVault) {
      if (pin.length < 4) { setPinError("Password must be at least 4 characters."); return; }
      if (pin !== confirmPin) { setPinError("Passwords don't match."); return; }
      initVault(pin);
      setSessionPin(pin);
    } else {
      const existingPin = getSessionPin() ?? pin;
      if (!existingPin) { setPinError("Enter your vault password."); return; }
      const ok = await verifyPin(existingPin);
      if (!ok) { setPinError("Incorrect vault password."); return; }
      setSessionPin(existingPin);
    }

    setStep("generate");
    setGenerating(true);
    setGenError("");
    try {
      const result = await generateWallet(chain);
      setWallet(result);
    } catch (e) {
      setGenError(String(e));
    } finally {
      setGenerating(false);
    }
  }

  // Save wallet to vault then → done
  const handleSave = useCallback(async () => {
    if (!wallet) return;
    setSaveError("");
    const vaultPin = getSessionPin()!;
    try {
      await addWallet(vaultPin, {
        id: walletId,
        chain: wallet.chain,
        label: label.trim(),
        address: wallet.address,
        secret: wallet.secret,
      });
      setSaved(true);
      setStep("done");
    } catch (e) {
      setSaveError(`Could not save: ${e}`);
    }
  }, [wallet, walletId, label]);

  async function handleDownload() {
    if (!wallet) return;
    const vaultPin = getSessionPin()!;
    await addWallet(vaultPin, {
      id: walletId,
      chain: wallet.chain,
      label: label.trim(),
      address: wallet.address,
      secret: wallet.secret,
    });
    setSaved(true);
    const json = await exportWalletBackup(walletId, vaultPin);
    downloadFile(`troptions-wallet-${chain}-${Date.now()}.json`, json);
  }

  const chainMeta = CHAIN_META[chain];

  return (
    <div style={{ maxWidth: 560, margin: "0 auto" }}>
      <StepBar current={step} />

      {/* ── Step 1: Chain + Label ── */}
      {step === "chain" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
          <div>
            <div className="xos-label" style={{ marginBottom: "0.4rem" }}>
              Your name or wallet label <span style={{ color: "var(--xos-red)" }}>*</span>
            </div>
            <input
              style={inputStyle}
              placeholder="e.g. Bryan Stone — Main"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              maxLength={60}
              autoFocus
            />
            <div style={{ fontSize: "0.75rem", color: "var(--xos-text-subtle)", marginTop: "0.3rem" }}>
              This label is only visible to you in this browser.
            </div>
          </div>

          <div>
            <div className="xos-label" style={{ marginBottom: "0.6rem" }}>Choose your blockchain</div>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              {(["xrpl", "stellar", "solana"] as ChainType[]).map((c) => (
                <ChainCard key={c} chain={c} selected={chain === c} onSelect={() => setChain(c)} />
              ))}
            </div>
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end", paddingTop: "0.5rem" }}>
            <button
              className="xos-btn xos-btn--primary"
              onClick={handleChainNext}
              disabled={!label.trim()}
              style={{ minWidth: 160 }}
            >
              Next: Secure It →
            </button>
          </div>
        </div>
      )}

      {/* ── Step 2: PIN / Password ── */}
      {step === "pin" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
          <div className="xos-card" style={{ padding: "1rem 1.25rem", display: "flex", gap: "0.75rem" }}>
            <span style={{ fontSize: "1.5rem" }}>🔒</span>
            <div>
              <div style={{ fontWeight: 700, color: "var(--xos-text)", marginBottom: "0.25rem" }}>
                {isNewVault ? "Create your vault password" : "Enter your vault password"}
              </div>
              <div style={{ fontSize: "0.8rem", color: "var(--xos-text-muted)", lineHeight: 1.5 }}>
                {isNewVault
                  ? "This password protects all wallets you create in this browser. Choose something you will remember — if you forget it, your wallet secrets cannot be recovered (but your backup file still works)."
                  : "Enter the vault password you set when you created your first wallet."}
              </div>
            </div>
          </div>

          {isNewVault ? (
            <>
              <div>
                <div className="xos-label" style={{ marginBottom: "0.4rem" }}>Vault password</div>
                <input
                  type="password"
                  style={inputStyle}
                  placeholder="At least 4 characters"
                  value={pin}
                  onChange={(e) => { setPin(e.target.value); setPinError(""); }}
                  autoFocus
                />
              </div>
              <div>
                <div className="xos-label" style={{ marginBottom: "0.4rem" }}>Confirm password</div>
                <input
                  type="password"
                  style={inputStyle}
                  placeholder="Type it again"
                  value={confirmPin}
                  onChange={(e) => { setConfirmPin(e.target.value); setPinError(""); }}
                  onKeyDown={(e) => e.key === "Enter" && handlePinNext()}
                />
              </div>
            </>
          ) : (
            <div>
              <div className="xos-label" style={{ marginBottom: "0.4rem" }}>Vault password</div>
              <input
                type="password"
                style={inputStyle}
                placeholder="Your vault password"
                value={pin}
                onChange={(e) => { setPin(e.target.value); setPinError(""); }}
                onKeyDown={(e) => e.key === "Enter" && handlePinNext()}
                autoFocus
              />
            </div>
          )}

          {pinError && (
            <div style={{ color: "var(--xos-red)", fontSize: "0.82rem", fontWeight: 600 }}>
              ⚠ {pinError}
            </div>
          )}

          <div style={{ display: "flex", gap: "0.75rem", justifyContent: "space-between", paddingTop: "0.5rem" }}>
            <button className="xos-btn xos-btn--outline" onClick={() => setStep("chain")}>
              ← Back
            </button>
            <button
              className="xos-btn xos-btn--primary"
              onClick={handlePinNext}
              style={{ minWidth: 160 }}
            >
              Generate Wallet →
            </button>
          </div>
        </div>
      )}

      {/* ── Step 3: Generated wallet ── */}
      {step === "generate" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
          {generating && (
            <div
              style={{
                textAlign: "center",
                padding: "3rem 1rem",
                color: "var(--xos-text-muted)",
                fontSize: "0.9rem",
              }}
            >
              <div style={{ fontSize: "2rem", marginBottom: "1rem" }}>⚙️</div>
              Generating your {chainMeta.label} wallet…
            </div>
          )}

          {genError && (
            <div className="xos-risk-box" style={{ borderColor: "var(--xos-red)" }}>
              Failed to generate wallet: {genError}
              <br />
              <button
                className="xos-btn xos-btn--outline"
                style={{ marginTop: "0.75rem", fontSize: "0.8rem" }}
                onClick={async () => {
                  setGenError("");
                  setGenerating(true);
                  try {
                    const result = await generateWallet(chain);
                    setWallet(result);
                  } catch (e) {
                    setGenError(String(e));
                  } finally {
                    setGenerating(false);
                  }
                }}
              >
                Try again
              </button>
            </div>
          )}

          {wallet && !generating && (
            <>
              {/* Address */}
              <div className="xos-card" style={{ padding: "1.25rem" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
                  <span style={{ fontSize: "1.25rem", color: chainMeta.color }}>{chainMeta.icon}</span>
                  <span style={{ fontWeight: 700, color: "var(--xos-text)" }}>{label}</span>
                  <span
                    style={{
                      marginLeft: "auto",
                      background: chainMeta.color,
                      color: "#000",
                      fontSize: "0.65rem",
                      fontWeight: 700,
                      padding: "0.1rem 0.5rem",
                      borderRadius: 4,
                    }}
                  >
                    {chainMeta.label}
                  </span>
                </div>

                <div className="xos-label" style={{ marginBottom: "0.35rem" }}>Your Public Address</div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    background: "var(--xos-surface-2)",
                    borderRadius: "var(--xos-radius)",
                    padding: "0.6rem 0.75rem",
                  }}
                >
                  <span
                    style={{
                      fontFamily: "monospace",
                      fontSize: "0.78rem",
                      color: "var(--xos-cyan)",
                      flex: 1,
                      wordBreak: "break-all",
                    }}
                  >
                    {wallet.address}
                  </span>
                  <button
                    className="xos-btn xos-btn--outline"
                    style={{ fontSize: "0.7rem", padding: "0.2rem 0.5rem", whiteSpace: "nowrap" }}
                    onClick={() => handleCopy(wallet.address, "addr")}
                  >
                    {copied === "addr" ? "✓ Copied" : "Copy"}
                  </button>
                </div>
                <div style={{ fontSize: "0.75rem", color: "var(--xos-text-subtle)", marginTop: "0.5rem" }}>
                  This is safe to share — it is your public address. Share it to receive funds.
                </div>
              </div>

              {/* Secret */}
              <div
                className="xos-card"
                style={{ padding: "1.25rem", border: "1px solid var(--xos-gold)" }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.6rem" }}>
                  <span>🔑</span>
                  <span style={{ fontWeight: 700, color: "var(--xos-gold)" }}>
                    {wallet.secretLabel}
                  </span>
                </div>

                <div style={{ fontSize: "0.8rem", color: "var(--xos-text-muted)", marginBottom: "0.75rem", lineHeight: 1.5 }}>
                  {wallet.secretFormat}
                </div>

                <div
                  style={{
                    display: "flex",
                    alignItems: secretVisible ? "flex-start" : "center",
                    gap: "0.5rem",
                    background: "var(--xos-surface-2)",
                    borderRadius: "var(--xos-radius)",
                    padding: "0.6rem 0.75rem",
                  }}
                >
                  <span
                    style={{
                      fontFamily: "monospace",
                      fontSize: "0.75rem",
                      color: secretVisible ? "var(--xos-gold)" : "var(--xos-text-subtle)",
                      flex: 1,
                      wordBreak: "break-all",
                      filter: secretVisible ? "none" : "blur(5px)",
                      userSelect: secretVisible ? "text" : "none",
                      transition: "filter 0.2s",
                    }}
                  >
                    {wallet.secret}
                  </span>
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.3rem", minWidth: 60 }}>
                    <button
                      className="xos-btn xos-btn--outline"
                      style={{ fontSize: "0.7rem", padding: "0.2rem 0.5rem" }}
                      onClick={() => setSecretVisible((v) => !v)}
                    >
                      {secretVisible ? "Hide" : "Reveal"}
                    </button>
                    {secretVisible && (
                      <button
                        className="xos-btn xos-btn--outline"
                        style={{ fontSize: "0.7rem", padding: "0.2rem 0.5rem" }}
                        onClick={() => handleCopy(wallet.secret, "secret")}
                      >
                        {copied === "secret" ? "✓ Copied" : "Copy"}
                      </button>
                    )}
                  </div>
                </div>

                <div
                  style={{
                    marginTop: "0.75rem",
                    padding: "0.6rem 0.75rem",
                    background: "rgba(255,200,0,0.08)",
                    borderRadius: "var(--xos-radius)",
                    fontSize: "0.78rem",
                    color: "var(--xos-gold)",
                    lineHeight: 1.5,
                  }}
                >
                  ⚠ Your secret is saved in this browser. Download the backup file below as an extra
                  copy. Never share your secret with anyone.
                </div>
              </div>

              {/* Fund note */}
              <div className="xos-card" style={{ padding: "1rem 1.25rem" }}>
                <div style={{ fontWeight: 600, color: "var(--xos-text)", marginBottom: "0.3rem" }}>
                  💡 How to activate this wallet
                </div>
                <div style={{ fontSize: "0.82rem", color: "var(--xos-text-muted)", lineHeight: 1.6 }}>
                  {wallet.fundNote}
                </div>
              </div>

              {/* Actions */}
              {saveError && (
                <div style={{ color: "var(--xos-red)", fontSize: "0.82rem" }}>⚠ {saveError}</div>
              )}

              <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
                <button
                  className="xos-btn xos-btn--cyan"
                  onClick={handleDownload}
                  style={{ flex: 1 }}
                >
                  ⬇ Download Backup
                </button>
                {!saved ? (
                  <button
                    className="xos-btn xos-btn--primary"
                    onClick={handleSave}
                    style={{ flex: 1 }}
                  >
                    ✓ Save & Finish
                  </button>
                ) : (
                  <button
                    className="xos-btn xos-btn--primary"
                    onClick={() => setStep("done")}
                    style={{ flex: 1 }}
                  >
                    → View My Wallets
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      )}

      {/* ── Step 4: Done ── */}
      {step === "done" && wallet && (
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem", textAlign: "center" }}>
          <div>
            <div style={{ fontSize: "3rem", marginBottom: "0.5rem" }}>🎉</div>
            <h2 style={{ color: "var(--xos-text)", fontWeight: 900, margin: 0 }}>Wallet Created!</h2>
            <div style={{ color: "var(--xos-text-muted)", marginTop: "0.5rem", fontSize: "0.9rem" }}>
              <strong style={{ color: chainMeta.color }}>{chainMeta.icon} {label}</strong> is ready to use.
            </div>
          </div>

          <div
            className="xos-card"
            style={{ padding: "1rem 1.25rem", textAlign: "left" }}
          >
            <div className="xos-label" style={{ marginBottom: "0.4rem" }}>Your Address</div>
            <div
              style={{
                fontFamily: "monospace",
                fontSize: "0.8rem",
                color: "var(--xos-cyan)",
                wordBreak: "break-all",
                marginBottom: "0.75rem",
              }}
            >
              {wallet.address}
            </div>
            <button
              className="xos-btn xos-btn--outline"
              style={{ fontSize: "0.8rem" }}
              onClick={() => handleCopy(wallet.address, "done-addr")}
            >
              {copied === "done-addr" ? "✓ Copied!" : "Copy Address"}
            </button>
          </div>

          <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
            <Link href="/exchange-os/wallet" className="xos-btn xos-btn--primary" style={{ flex: 1 }}>
              ⬢ View My Wallets
            </Link>
            {chain === "xrpl" && (
              <Link href="/exchange-os/trade" className="xos-btn xos-btn--cyan" style={{ flex: 1 }}>
                ⟷ Start Trading
              </Link>
            )}
            <a
              href={wallet.explorerUrl}
              target="_blank"
              rel="noreferrer"
              className="xos-btn xos-btn--outline"
              style={{ flex: 1 }}
            >
              ↗ Explorer
            </a>
          </div>

          <div style={{ borderTop: "1px solid var(--xos-border)", paddingTop: "1rem" }}>
            <button
              className="xos-btn xos-btn--outline"
              style={{ fontSize: "0.82rem" }}
              onClick={() => {
                setStep("chain");
                setLabel("");
                setChain("xrpl");
                setPin("");
                setConfirmPin("");
                setWallet(null);
                setSaved(false);
              }}
            >
              + Create Another Wallet
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
