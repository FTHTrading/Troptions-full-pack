"use client";

import Link from "next/link";
import { useState } from "react";

const CAMPAIGN_TYPES = [
  { id: "fan-passport",   label: "Fan Passport",    emoji: "🪪", desc: "Personal digital identity for fans" },
  { id: "match-memory",   label: "Match Memory",    emoji: "⚽", desc: "Memorable moment captured on-chain" },
  { id: "country-pride",  label: "Country Pride",   emoji: "🏳️", desc: "Support your national team" },
  { id: "merchant-reward",label: "Merchant Reward", emoji: "🏪", desc: "Loyalty NFT for local businesses" },
];

const COUNTRIES = [
  { code: "US", flag: "🇺🇸", name: "United States" },
  { code: "BR", flag: "🇧🇷", name: "Brazil" },
  { code: "AR", flag: "🇦🇷", name: "Argentina" },
  { code: "DE", flag: "🇩🇪", name: "Germany" },
  { code: "FR", flag: "🇫🇷", name: "France" },
  { code: "ES", flag: "🇪🇸", name: "Spain" },
  { code: "PT", flag: "🇵🇹", name: "Portugal" },
  { code: "MX", flag: "🇲🇽", name: "Mexico" },
  { code: "JP", flag: "🇯🇵", name: "Japan" },
  { code: "NG", flag: "🇳🇬", name: "Nigeria" },
  { code: "MA", flag: "🇲🇦", name: "Morocco" },
  { code: "GB", flag: "🇬🇧", name: "England" },
];

const MATCHES = [
  "Group Stage — USA vs Mexico · Jun 22, 2026",
  "Group Stage — Brazil vs Argentina · Jun 25, 2026",
  "Group Stage — Germany vs France · Jun 28, 2026",
  "Round of 16 · Jul 4, 2026",
  "Quarterfinal · Jul 10, 2026",
  "Semifinal — Atlanta · Jul 14, 2026",
  "Final · Jul 19, 2026",
];

const MINT_ADDRESS_GOATX = "9VJQV99t9vaY5vpMkMW3xRyxfhirDfbJXb7ymCpjQMSv";

type Step = 1 | 2 | 3;

export default function MintDemoPage() {
  const [step, setStep] = useState<Step>(1);
  const [campaignType, setCampaignType] = useState<string>("");
  const [name, setName] = useState("");
  const [country, setCountry] = useState("");
  const [match, setMatch] = useState("");
  const [mintState, setMintState] = useState<"idle" | "preview" | "minting" | "done">("idle");

  const selectedType = CAMPAIGN_TYPES.find((t) => t.id === campaignType);
  const selectedCountry = COUNTRIES.find((c) => c.code === country);

  const canAdvanceTo2 = campaignType !== "";
  const canAdvanceTo3 = name.trim().length > 1 && country !== "" && match !== "";

  function handleMint() {
    setMintState("minting");
    setTimeout(() => setMintState("done"), 2200);
  }

  return (
    <div style={{ background: "#050508", minHeight: "100vh", color: "#e8e8f0", fontFamily: "'Space Grotesk', sans-serif" }}>
      {/* Nav */}
      <nav style={{ position: "sticky", top: 0, zIndex: 50, borderBottom: "1px solid rgba(255,255,255,0.07)", background: "rgba(5,5,8,0.92)", backdropFilter: "blur(20px)" }}>
        <div style={{ maxWidth: 760, margin: "0 auto", padding: "14px 24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Link href="/sports" style={{ fontWeight: 700, fontSize: "0.95rem", color: "#e8e8f0", textDecoration: "none" }}>
            ← TROPTIONS
          </Link>
          <Link href="/sports/minted" style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.35)", textDecoration: "none", fontWeight: 600 }}>
            All Minted Assets
          </Link>
        </div>
      </nav>

      <main style={{ maxWidth: 760, margin: "0 auto", padding: "56px 24px 120px" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 56 }}>
          <div style={{ display: "inline-block", padding: "4px 14px", borderRadius: 6, background: "rgba(0,255,136,0.08)", border: "1px solid rgba(0,255,136,0.2)", fontSize: "0.72rem", fontFamily: "monospace", color: "#00ff88", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 20 }}>
            // Mint Demo
          </div>
          <h1 style={{ fontSize: "clamp(1.8rem, 4vw, 2.8rem)", fontWeight: 800, lineHeight: 1.1, letterSpacing: "-0.03em", marginBottom: 16 }}>
            How Easy Is Minting?
          </h1>
          <p style={{ fontSize: "1rem", color: "rgba(255,255,255,0.45)", lineHeight: 1.7, marginBottom: 8 }}>
            Three steps. Takes less than 60 seconds.
          </p>
          <p style={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.2)", lineHeight: 1.6, fontStyle: "italic" }}>
            This is a UI demo. No real transaction is sent. See a real example below.
          </p>
        </div>

        {/* Step indicator */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginBottom: 48 }}>
          {([1, 2, 3] as Step[]).map((s) => (
            <div key={s} style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{
                width: 32,
                height: 32,
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: 700,
                fontSize: "0.82rem",
                background: step === s ? "#00ff88" : step > s ? "rgba(0,255,136,0.2)" : "rgba(255,255,255,0.06)",
                color: step === s ? "#000" : step > s ? "#00ff88" : "rgba(255,255,255,0.3)",
                border: step > s ? "1px solid rgba(0,255,136,0.4)" : "1px solid transparent",
                transition: "all 0.3s",
              }}>
                {step > s ? "✓" : s}
              </div>
              {s < 3 && <div style={{ width: 48, height: 1, background: step > s ? "rgba(0,255,136,0.4)" : "rgba(255,255,255,0.06)" }} />}
            </div>
          ))}
        </div>

        {/* Step 1 */}
        {step === 1 && (
          <div>
            <h2 style={{ fontSize: "1.3rem", fontWeight: 700, marginBottom: 8 }}>Step 1: Choose your campaign type</h2>
            <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.88rem", marginBottom: 28 }}>
              What kind of digital asset are you creating?
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 36 }}>
              {CAMPAIGN_TYPES.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setCampaignType(t.id)}
                  style={{
                    padding: "20px 20px",
                    borderRadius: 12,
                    border: campaignType === t.id ? "2px solid #00ff88" : "1px solid rgba(255,255,255,0.08)",
                    background: campaignType === t.id ? "rgba(0,255,136,0.06)" : "rgba(255,255,255,0.02)",
                    cursor: "pointer",
                    textAlign: "left",
                    transition: "all 0.2s",
                    color: "#e8e8f0",
                  }}
                >
                  <div style={{ fontSize: "1.6rem", marginBottom: 8 }}>{t.emoji}</div>
                  <div style={{ fontWeight: 700, fontSize: "0.92rem", marginBottom: 4 }}>{t.label}</div>
                  <div style={{ fontSize: "0.76rem", color: "rgba(255,255,255,0.35)" }}>{t.desc}</div>
                </button>
              ))}
            </div>
            <button
              onClick={() => canAdvanceTo2 && setStep(2)}
              disabled={!canAdvanceTo2}
              style={{
                width: "100%",
                padding: "14px 28px",
                borderRadius: 10,
                border: "none",
                background: canAdvanceTo2 ? "#00ff88" : "rgba(255,255,255,0.06)",
                color: canAdvanceTo2 ? "#000" : "rgba(255,255,255,0.2)",
                fontWeight: 700,
                fontSize: "0.92rem",
                cursor: canAdvanceTo2 ? "pointer" : "not-allowed",
                transition: "all 0.2s",
              }}
            >
              Continue →
            </button>
          </div>
        )}

        {/* Step 2 */}
        {step === 2 && (
          <div>
            <h2 style={{ fontSize: "1.3rem", fontWeight: 700, marginBottom: 8 }}>Step 2: Enter your details</h2>
            <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.88rem", marginBottom: 28 }}>
              Tell us about your {selectedType?.label} moment.
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: 18, marginBottom: 36 }}>
              <div>
                <label style={{ display: "block", fontSize: "0.76rem", color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 8, fontFamily: "monospace" }}>
                  Your Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Carlos M."
                  style={{
                    width: "100%",
                    padding: "12px 16px",
                    borderRadius: 10,
                    border: "1px solid rgba(255,255,255,0.1)",
                    background: "rgba(255,255,255,0.03)",
                    color: "#e8e8f0",
                    fontSize: "0.92rem",
                    outline: "none",
                    boxSizing: "border-box",
                  }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.76rem", color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 8, fontFamily: "monospace" }}>
                  Country
                </label>
                <select
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "12px 16px",
                    borderRadius: 10,
                    border: "1px solid rgba(255,255,255,0.1)",
                    background: "#0d0d14",
                    color: country ? "#e8e8f0" : "rgba(255,255,255,0.3)",
                    fontSize: "0.92rem",
                    outline: "none",
                    appearance: "none",
                    cursor: "pointer",
                  }}
                >
                  <option value="">Select a country…</option>
                  {COUNTRIES.map((c) => (
                    <option key={c.code} value={c.code}>
                      {c.flag} {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.76rem", color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 8, fontFamily: "monospace" }}>
                  Match
                </label>
                <select
                  value={match}
                  onChange={(e) => setMatch(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "12px 16px",
                    borderRadius: 10,
                    border: "1px solid rgba(255,255,255,0.1)",
                    background: "#0d0d14",
                    color: match ? "#e8e8f0" : "rgba(255,255,255,0.3)",
                    fontSize: "0.92rem",
                    outline: "none",
                    appearance: "none",
                    cursor: "pointer",
                  }}
                >
                  <option value="">Select a match…</option>
                  {MATCHES.map((m) => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
              </div>
            </div>

            <div style={{ display: "flex", gap: 10 }}>
              <button
                onClick={() => setStep(1)}
                style={{ padding: "14px 24px", borderRadius: 10, border: "1px solid rgba(255,255,255,0.1)", background: "transparent", color: "rgba(255,255,255,0.5)", fontWeight: 600, fontSize: "0.88rem", cursor: "pointer" }}
              >
                ← Back
              </button>
              <button
                onClick={() => canAdvanceTo3 && setStep(3)}
                disabled={!canAdvanceTo3}
                style={{
                  flex: 1,
                  padding: "14px 28px",
                  borderRadius: 10,
                  border: "none",
                  background: canAdvanceTo3 ? "#00ff88" : "rgba(255,255,255,0.06)",
                  color: canAdvanceTo3 ? "#000" : "rgba(255,255,255,0.2)",
                  fontWeight: 700,
                  fontSize: "0.92rem",
                  cursor: canAdvanceTo3 ? "pointer" : "not-allowed",
                  transition: "all 0.2s",
                }}
              >
                Preview →
              </button>
            </div>
          </div>
        )}

        {/* Step 3 */}
        {step === 3 && (
          <div>
            <h2 style={{ fontSize: "1.3rem", fontWeight: 700, marginBottom: 8 }}>Step 3: Mint on Solana</h2>
            <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.88rem", marginBottom: 28 }}>
              Review your moment and mint it on-chain.
            </p>

            {/* NFT Preview card */}
            <div style={{
              background: "linear-gradient(135deg, rgba(0,255,136,0.06) 0%, rgba(168,85,247,0.06) 100%)",
              border: "1px solid rgba(0,255,136,0.2)",
              borderRadius: 16,
              padding: "28px 28px",
              marginBottom: 28,
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
                <div style={{ fontSize: "2.5rem" }}>{selectedType?.emoji}</div>
                <div>
                  <div style={{ fontSize: "0.68rem", fontFamily: "monospace", color: "#00ff88", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 4 }}>
                    {selectedType?.label} · {selectedCountry?.flag} {selectedCountry?.name}
                  </div>
                  <div style={{ fontSize: "1.2rem", fontWeight: 800 }}>{name}</div>
                </div>
              </div>
              <div style={{ fontSize: "0.82rem", color: "rgba(255,255,255,0.45)", marginBottom: 16 }}>{match}</div>
              <div style={{ display: "flex", gap: 8 }}>
                <span style={{ padding: "3px 10px", borderRadius: 5, background: "rgba(0,255,136,0.08)", border: "1px solid rgba(0,255,136,0.2)", fontSize: "0.65rem", fontFamily: "monospace", color: "#00ff88" }}>
                  Solana Mainnet
                </span>
                <span style={{ padding: "3px 10px", borderRadius: 5, background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.08)", fontSize: "0.65rem", fontFamily: "monospace", color: "rgba(255,255,255,0.4)" }}>
                  ~&lt;0.001 SOL fee
                </span>
              </div>
            </div>

            {/* Mint flow */}
            {mintState === "idle" && (
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <button
                  onClick={() => setMintState("preview")}
                  style={{ padding: "14px 28px", borderRadius: 10, border: "1px solid rgba(255,255,255,0.12)", background: "rgba(255,255,255,0.03)", color: "#e8e8f0", fontWeight: 600, fontSize: "0.9rem", cursor: "pointer" }}
                >
                  Connect Wallet
                </button>
                <div style={{ display: "flex", gap: 10 }}>
                  <button
                    onClick={() => setStep(2)}
                    style={{ padding: "14px 20px", borderRadius: 10, border: "1px solid rgba(255,255,255,0.08)", background: "transparent", color: "rgba(255,255,255,0.4)", fontWeight: 600, fontSize: "0.88rem", cursor: "pointer" }}
                  >
                    ← Back
                  </button>
                </div>
              </div>
            )}

            {mintState === "preview" && (
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <div style={{ padding: "12px 16px", borderRadius: 10, background: "rgba(0,255,136,0.05)", border: "1px solid rgba(0,255,136,0.15)", fontSize: "0.8rem", color: "#00ff88" }}>
                  ✓ Wallet connected (demo) · Ready to mint
                </div>
                <button
                  onClick={handleMint}
                  style={{ padding: "14px 28px", borderRadius: 10, border: "none", background: "#00ff88", color: "#000", fontWeight: 700, fontSize: "0.92rem", cursor: "pointer" }}
                >
                  Mint Now →
                </button>
              </div>
            )}

            {mintState === "minting" && (
              <div style={{ padding: "20px", borderRadius: 12, border: "1px solid rgba(0,255,136,0.2)", background: "rgba(0,255,136,0.04)", textAlign: "center" }}>
                <div style={{ fontSize: "1.5rem", marginBottom: 10, animation: "spin 1s linear infinite" }}>⚙️</div>
                <div style={{ fontSize: "0.88rem", color: "#00ff88" }}>Submitting to Solana…</div>
                <div style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.3)", marginTop: 6 }}>Confirming on-chain</div>
              </div>
            )}

            {mintState === "done" && (
              <div style={{ padding: "24px", borderRadius: 12, border: "1px solid rgba(0,255,136,0.3)", background: "rgba(0,255,136,0.06)", textAlign: "center" }}>
                <div style={{ fontSize: "2rem", marginBottom: 10 }}>🎉</div>
                <div style={{ fontSize: "1.1rem", fontWeight: 700, color: "#00ff88", marginBottom: 8 }}>
                  Minted! (Demo)
                </div>
                <div style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.4)", lineHeight: 1.6 }}>
                  In a real mint this would take ~5 seconds and cost less than $0.01 in SOL fees.
                </div>
                <div style={{ marginTop: 20, display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
                  <Link
                    href="/sports/solana-launcher"
                    style={{ padding: "10px 22px", background: "#00ff88", color: "#000", borderRadius: 9, fontWeight: 700, fontSize: "0.82rem", textDecoration: "none" }}
                  >
                    Build a Real Campaign →
                  </Link>
                  <a
                    href="https://goat.unykorn.org"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ padding: "10px 22px", background: "transparent", border: "1px solid rgba(255,255,255,0.14)", color: "#e8e8f0", borderRadius: 9, fontWeight: 700, fontSize: "0.82rem", textDecoration: "none" }}
                  >
                    See GoatX (Real Example)
                  </a>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Real example banner */}
        <div style={{ marginTop: 64, borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: 40 }}>
          <p style={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.3)", marginBottom: 20, textAlign: "center", textTransform: "uppercase", letterSpacing: "0.1em", fontFamily: "monospace" }}>
            See a real minted example
          </p>
          <div style={{ background: "#0d0d14", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 14, padding: "20px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
            <div>
              <div style={{ fontWeight: 700, marginBottom: 4 }}>GoatX ($GOATX)</div>
              <code style={{ fontSize: "0.72rem", color: "#00d4ff", fontFamily: "monospace" }}>
                {MINT_ADDRESS_GOATX}
              </code>
            </div>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <a
                href={`https://solscan.io/token/${MINT_ADDRESS_GOATX}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{ padding: "8px 14px", borderRadius: 8, background: "rgba(0,255,136,0.08)", border: "1px solid rgba(0,255,136,0.2)", color: "#00ff88", fontSize: "0.72rem", fontWeight: 700, textDecoration: "none", fontFamily: "monospace" }}
              >
                Solscan ↗
              </a>
              <a
                href="https://goat.unykorn.org"
                target="_blank"
                rel="noopener noreferrer"
                style={{ padding: "8px 14px", borderRadius: 8, background: "rgba(168,85,247,0.08)", border: "1px solid rgba(168,85,247,0.2)", color: "#a855f7", fontSize: "0.72rem", fontWeight: 700, textDecoration: "none", fontFamily: "monospace" }}
              >
                goat.unykorn.org ↗
              </a>
            </div>
          </div>
        </div>

        {/* Links */}
        <div style={{ marginTop: 36, display: "flex", gap: 12, flexWrap: "wrap" }}>
          <Link
            href="/sports/solana-launcher"
            style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.4)", textDecoration: "none", padding: "8px 16px", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 8 }}
          >
            Full Campaign Builder →
          </Link>
          <Link
            href="/sports/minted"
            style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.4)", textDecoration: "none", padding: "8px 16px", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 8 }}
          >
            All Minted Assets →
          </Link>
        </div>
      </main>
    </div>
  );
}
