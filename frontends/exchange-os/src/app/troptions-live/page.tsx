"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";

// ─── TROPTIONS on XRPL ────────────────────────────────────────────────────────
// Non-standard 9-char code encoded as 20-byte uppercase hex (XLS-20 compatible)
const TROPTIONS_HEX = "54524F5054494F4E530000000000000000000000";
const TROPTIONS_ISSUER = "rPF2M1QjdVh1hkNgmMMTkT9qMU7tA7Wds3";
const TRUST_LIMIT = "1000000000"; // 1 billion max trust line
const XRP_RESERVE_BASE = 1; // base account reserve in XRP (mainnet)

// ─── Types ────────────────────────────────────────────────────────────────────
interface PriceData {
  xrp: number | null;
  xlm: number | null;
  lastUpdated: string;
}

interface OrderBookData {
  ok: boolean;
  bestBidXrpPerTroptions: number | null;
  bestAskXrpPerTroptions: number | null;
  bidCount: number;
  askCount: number;
  timestamp: string;
}

interface WalletData {
  address: string;
  publicKey: string;
  seed: string | null;
  demoMode: boolean;
}

interface TrustLine {
  currency: string;
  balance: string;
  limit: string;
  issuer: string;
}

interface AccountData {
  address: string;
  xrpBalance: string;
  sequence: number;
  ownerCount: number;
  trustLines: TrustLine[];
}

type ActiveTab = "wallet" | "trust" | "buy" | "sell" | "verify";

// ─── Helpers ──────────────────────────────────────────────────────────────────
function hexCurrencyToLabel(hex: string): string {
  if (hex.length !== 40) return hex; // 3-char ISO code — return as-is
  let str = "";
  for (let i = 0; i < hex.length; i += 2) {
    const code = parseInt(hex.slice(i, i + 2), 16);
    if (code > 0x20 && code < 0x7f) str += String.fromCharCode(code);
  }
  return str || hex.slice(0, 8) + "…";
}

function fmt(n: number, decimals = 6): string {
  return n.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: decimals,
  });
}

// ─── Sub-components ───────────────────────────────────────────────────────────
function GoldDivider() {
  return (
    <div
      className="w-full h-px my-8"
      style={{ background: "var(--line)" }}
    />
  );
}

function SectionBadge({ children }: { children: React.ReactNode }) {
  return (
    <span
      className="inline-block text-xs font-mono px-3 py-1 rounded-full tracking-widest uppercase mb-4"
      style={{
        border: "1px solid var(--line)",
        color: "var(--gold)",
        background: "rgba(201,154,60,0.07)",
      }}
    >
      {children}
    </span>
  );
}

function CopyButton({
  text,
  label,
  copied,
  onCopy,
}: {
  text: string;
  label: string;
  copied: string | null;
  onCopy: (t: string, l: string) => void;
}) {
  const isCopied = copied === label;
  return (
    <button
      onClick={() => onCopy(text, label)}
      className="px-4 py-2 text-xs font-mono uppercase tracking-widest rounded border transition-all"
      style={{
        borderColor: isCopied ? "#22c55e" : "var(--gold)",
        color: isCopied ? "#22c55e" : "var(--gold)",
        background: isCopied ? "rgba(34,197,94,0.08)" : "none",
        cursor: "pointer",
      }}
    >
      {isCopied ? "✓ Copied" : "Copy Transaction JSON"}
    </button>
  );
}

function TxPreview({ json }: { json: string }) {
  return (
    <pre
      className="text-xs rounded-lg p-4 overflow-auto"
      style={{
        background: "#050e1a",
        border: "1px solid var(--line)",
        color: "#94a3b8",
        maxHeight: "260px",
        lineHeight: 1.6,
      }}
    >
      {json}
    </pre>
  );
}

function SigningInstructions() {
  return (
    <div
      className="mt-4 p-4 rounded-lg text-sm"
      style={{ background: "rgba(201,154,60,0.07)", border: "1px solid var(--line)" }}
    >
      <p className="font-mono text-xs uppercase tracking-widest mb-2" style={{ color: "var(--gold)" }}>
        How to submit
      </p>
      <ol className="list-decimal list-inside space-y-1.5" style={{ color: "var(--muted)" }}>
        <li>Copy the transaction JSON above</li>
        <li>
          Open{" "}
          <a
            href="https://xaman.app"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "var(--gold-light)" }}
          >
            Xaman (XUMM)
          </a>{" "}
          or{" "}
          <a
            href="https://xrpl.services"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "var(--gold-light)" }}
          >
            XRPL.services ↗
          </a>
        </li>
        <li>Select &quot;Advanced / Raw transaction&quot; and paste the JSON</li>
        <li>Review all fields, then sign and submit to mainnet</li>
      </ol>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function TroptionsLivePage() {
  const [activeTab, setActiveTab] = useState<ActiveTab>("wallet");
  const [prices, setPrices] = useState<PriceData | null>(null);
  const [orderBook, setOrderBook] = useState<OrderBookData | null>(null);
  const [priceLoading, setPriceLoading] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);

  // Wallet generation
  const [wallet, setWallet] = useState<WalletData | null>(null);
  const [walletLoading, setWalletLoading] = useState(false);
  const [walletError, setWalletError] = useState<string | null>(null);

  // Address verify
  const [verifyAddress, setVerifyAddress] = useState("");
  const [accountData, setAccountData] = useState<AccountData | null>(null);
  const [verifyLoading, setVerifyLoading] = useState(false);
  const [verifyError, setVerifyError] = useState<string | null>(null);

  // Buy / Sell inputs
  const [buyXrp, setBuyXrp] = useState("100");
  const [sellTroptions, setSellTroptions] = useState("1000");

  // ─── Price polling ──────────────────────────────────────────────────────────
  const fetchPrices = useCallback(async () => {
    setPriceLoading(true);
    try {
      const [priceRes, obRes] = await Promise.all([
        fetch("/api/troptions/price"),
        fetch("/api/troptions/xrpl/orderbook"),
      ]);
      if (priceRes.ok) setPrices(await priceRes.json());
      if (obRes.ok) setOrderBook(await obRes.json());
    } catch {
      // non-fatal — ticker stays stale
    } finally {
      setPriceLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPrices();
    const timer = setInterval(fetchPrices, 30_000);
    return () => clearInterval(timer);
  }, [fetchPrices]);

  // ─── Clipboard ──────────────────────────────────────────────────────────────
  const copyToClipboard = useCallback(async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(label);
      setTimeout(() => setCopied(null), 2500);
    } catch {
      // Clipboard API may be blocked — silent fail
    }
  }, []);

  // ─── Generate wallet ────────────────────────────────────────────────────────
  const generateWallet = async () => {
    setWalletLoading(true);
    setWalletError(null);
    try {
      const res = await fetch("/api/troptions/wallet/generate", { method: "POST" });
      const data = await res.json();
      if (data.ok) {
        setWallet({
          address: data.address,
          publicKey: data.publicKey,
          seed: data.seed ?? null,
          demoMode: data.demoMode ?? false,
        });
      } else {
        setWalletError(data.error ?? "Failed to generate wallet");
      }
    } catch {
      setWalletError("Network error — please retry");
    } finally {
      setWalletLoading(false);
    }
  };

  // ─── Verify wallet ──────────────────────────────────────────────────────────
  const verifyWallet = async () => {
    const addr = verifyAddress.trim();
    if (!addr) return;
    setVerifyLoading(true);
    setVerifyError(null);
    setAccountData(null);
    try {
      const res = await fetch("/api/troptions/wallet/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ address: addr }),
      });
      const data = await res.json();
      if (data.ok) {
        setAccountData(data);
      } else {
        setVerifyError(
          res.status === 404
            ? "Address not found on XRPL mainnet (unfunded or invalid)"
            : (data.error ?? "Verification failed")
        );
      }
    } catch {
      setVerifyError("Network error — please retry");
    } finally {
      setVerifyLoading(false);
    }
  };

  // ─── TROPTIONS trust line status ────────────────────────────────────────────
  const troptionsTrustLine = accountData?.trustLines.find(
    (tl) => tl.currency === TROPTIONS_HEX && tl.issuer === TROPTIONS_ISSUER
  );
  const hasTrustLine = Boolean(troptionsTrustLine);
  const troptionsBalance = troptionsTrustLine?.balance ?? "0";

  // ─── Transaction JSON builders ──────────────────────────────────────────────
  const buildTrustSetJson = () =>
    JSON.stringify(
      {
        TransactionType: "TrustSet",
        Account: wallet?.address ?? "<YOUR_XRPL_ADDRESS>",
        LimitAmount: {
          currency: TROPTIONS_HEX,
          issuer: TROPTIONS_ISSUER,
          value: TRUST_LIMIT,
        },
        Flags: 131072, // tfSetNoRipple
        Fee: "12",
      },
      null,
      2
    );

  const buildBuyOfferJson = () => {
    const xrpDrops = String(
      Math.max(1, Math.round(parseFloat(buyXrp || "0") * 1_000_000))
    );
    return JSON.stringify(
      {
        TransactionType: "OfferCreate",
        Account: wallet?.address ?? "<YOUR_XRPL_ADDRESS>",
        // Market buy: offer XRP drops, receive maximum available TROPTIONS
        TakerGets: xrpDrops,
        TakerPays: {
          currency: TROPTIONS_HEX,
          issuer: TROPTIONS_ISSUER,
          value: "999999999",
        },
        Flags: 131072, // tfImmediateOrCancel — cancel unfilled portion
        Fee: "12",
      },
      null,
      2
    );
  };

  const buildSellOfferJson = () =>
    JSON.stringify(
      {
        TransactionType: "OfferCreate",
        Account: wallet?.address ?? "<YOUR_XRPL_ADDRESS>",
        // Market sell: offer TROPTIONS, receive maximum available XRP
        TakerGets: {
          currency: TROPTIONS_HEX,
          issuer: TROPTIONS_ISSUER,
          value: sellTroptions || "0",
        },
        TakerPays: "1", // 1 drop minimum — tfSell fills all TakerGets regardless
        Flags: 131072 | 524288, // tfImmediateOrCancel | tfSell
        Fee: "12",
      },
      null,
      2
    );

  // ─── Computed price estimates ────────────────────────────────────────────────
  const buyXrpNum = parseFloat(buyXrp) || 0;
  const estTroptions =
    orderBook?.bestAskXrpPerTroptions && orderBook.bestAskXrpPerTroptions > 0
      ? buyXrpNum / orderBook.bestAskXrpPerTroptions
      : null;

  const sellTroptionsNum = parseFloat(sellTroptions) || 0;
  const estXrp =
    orderBook?.bestBidXrpPerTroptions && orderBook.bestBidXrpPerTroptions > 0
      ? sellTroptionsNum * orderBook.bestBidXrpPerTroptions
      : null;

  // ─── Tab config ──────────────────────────────────────────────────────────────
  const tabs: { key: ActiveTab; label: string }[] = [
    { key: "wallet", label: "01 / WALLET" },
    { key: "trust", label: "02 / TRUST LINE" },
    { key: "buy", label: "03 / BUY" },
    { key: "sell", label: "04 / SELL" },
    { key: "verify", label: "05 / VERIFY" },
  ];

  // ─── Render ───────────────────────────────────────────────────────────────────
  return (
    <main
      className="min-h-screen flex flex-col"
      style={{ background: "var(--navy)", color: "var(--foreground)" }}
    >
      {/* ══ INSTITUTIONAL NAV ═══════════════════════════════════════════════════ */}
      <nav
        style={{
          borderBottom: "1px solid var(--line)",
          background: "rgba(7,20,38,0.97)",
          position: "sticky",
          top: 0,
          zIndex: 50,
          backdropFilter: "blur(12px)",
        }}
      >
        <div
          className="max-w-5xl mx-auto px-6 flex items-center justify-between"
          style={{ height: 60 }}
        >
          {/* Left: logo + wordmark */}
          <Link href="/troptions" style={{ display: "flex", alignItems: "center", gap: "0.65rem", textDecoration: "none" }}>
            <Image
              src="/assets/troptions/logos/troptions-tt-on-black.jpg"
              alt="TROPTIONS"
              width={36}
              height={36}
              style={{ borderRadius: 5, objectFit: "cover" }}
              priority
            />
            <span
              style={{
                fontFamily: "'Palatino Linotype','Book Antiqua',Georgia,serif",
                fontSize: "0.95rem",
                letterSpacing: "0.22em",
                color: "var(--gold-light)",
                fontWeight: 600,
                textTransform: "uppercase",
              }}
            >
              TROPTIONS
            </span>
            <span
              style={{
                fontSize: "0.62rem",
                letterSpacing: "0.2em",
                color: "var(--muted)",
                textTransform: "uppercase",
                borderLeft: "1px solid var(--line)",
                paddingLeft: "0.65rem",
                marginLeft: "0.1rem",
              }}
            >
              LIVE
            </span>
          </Link>

          {/* Center: nav links */}
          <div className="hidden md:flex items-center gap-5">
            {[
              { label: "Wallet",     onClick: () => setActiveTab("wallet") },
              { label: "Trust Line", onClick: () => setActiveTab("trust") },
              { label: "Buy",        onClick: () => setActiveTab("buy") },
              { label: "Sell",       onClick: () => setActiveTab("sell") },
              { label: "Verify",     onClick: () => setActiveTab("verify") },
            ].map((item) => (
              <button
                key={item.label}
                onClick={item.onClick}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  fontSize: "0.72rem",
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  color: "var(--muted)",
                  fontFamily: "inherit",
                  padding: "0",
                  transition: "color 0.15s",
                }}
                onMouseOver={(e) => (e.currentTarget.style.color = "var(--gold-light)")}
                onMouseOut={(e) => (e.currentTarget.style.color = "var(--muted)")}
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Right: live indicator + back link */}
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-xs font-mono" style={{ color: "#22c55e" }}>
              <span
                style={{
                  display: "inline-block",
                  width: 7,
                  height: 7,
                  borderRadius: "50%",
                  background: "#22c55e",
                  boxShadow: "0 0 6px #22c55e",
                }}
              />
              MAINNET
            </span>
            <Link
              href="/troptions"
              style={{
                fontSize: "0.7rem",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "var(--muted)",
                textDecoration: "none",
                border: "1px solid var(--line)",
                padding: "0.3rem 0.75rem",
                borderRadius: 5,
              }}
            >
              ← Portal
            </Link>
          </div>
        </div>

        {/* Live price ticker bar */}
        {(prices?.xrp != null || orderBook?.bestAskXrpPerTroptions != null) && (
          <div
            style={{
              borderTop: "1px solid var(--line)",
              background: "rgba(0,0,0,0.3)",
              padding: "0.3rem 0",
            }}
          >
            <div className="max-w-5xl mx-auto px-6 flex flex-wrap items-center gap-x-6 gap-y-1 text-xs font-mono">
              {prices?.xrp != null && (
                <span>
                  <span style={{ color: "var(--muted)" }}>XRP/USD </span>
                  <strong style={{ color: "var(--gold-light)" }}>${prices.xrp.toFixed(4)}</strong>
                  {priceLoading && <span style={{ color: "var(--muted)" }}> ↻</span>}
                </span>
              )}
              {orderBook?.bestAskXrpPerTroptions != null && (
                <span>
                  <span style={{ color: "var(--muted)" }}>TROPTIONS Ask </span>
                  <strong style={{ color: "var(--gold)" }}>{fmt(orderBook.bestAskXrpPerTroptions, 6)} XRP</strong>
                  {prices?.xrp != null && (
                    <span style={{ color: "var(--muted)" }}>
                      {" "}(${fmt(orderBook.bestAskXrpPerTroptions * prices.xrp, 4)})
                    </span>
                  )}
                </span>
              )}
              {orderBook?.bestBidXrpPerTroptions != null && (
                <span>
                  <span style={{ color: "var(--muted)" }}>Bid </span>
                  <strong style={{ color: "var(--gold-light)" }}>{fmt(orderBook.bestBidXrpPerTroptions, 6)} XRP</strong>
                </span>
              )}
              <span>
                <span style={{ color: "var(--muted)" }}>Issuer </span>
                <span
                  className="cursor-pointer"
                  style={{ color: "var(--gold)" }}
                  onClick={() => copyToClipboard(TROPTIONS_ISSUER, "issuer-ticker")}
                  title="Click to copy"
                >
                  {TROPTIONS_ISSUER.slice(0, 8)}…
                  {copied === "issuer-ticker" && <span style={{ color: "#22c55e" }}> ✓</span>}
                </span>
              </span>
            </div>
          </div>
        )}
      </nav>

      {/* ══ HERO ════════════════════════════════════════════════════════════════ */}
      <section className="max-w-5xl mx-auto w-full px-6 pt-12 pb-8 text-center">
        <SectionBadge>⬤ XRPL MAINNET — LIVE</SectionBadge>

        <h1
          className="text-5xl font-bold mb-3 tracking-tight"
          style={{
            fontFamily: "var(--font-display)",
            color: "var(--gold-light)",
            lineHeight: 1.1,
          }}
        >
          Trade TROPTIONS
        </h1>
        <p className="text-xl" style={{ color: "var(--muted)" }}>
          on the XRP Ledger
        </p>
        <p
          className="mt-3 text-sm max-w-xl mx-auto"
          style={{ color: "var(--muted)", lineHeight: 1.75 }}
        >
          Non-custodial &nbsp;·&nbsp; Self-sovereign &nbsp;·&nbsp; Cryptographic
          ownership &nbsp;·&nbsp; XRPL protocol
        </p>
      </section>

      {/* ══ TAB NAV ═════════════════════════════════════════════════════════════ */}
      <div className="max-w-5xl mx-auto w-full px-6 pt-2 pb-4">
        <div
          className="inline-flex flex-wrap gap-1.5 p-1 rounded-lg"
          style={{ background: "var(--navy-2)", border: "1px solid var(--line)" }}
        >
          {tabs.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className="px-4 py-2 text-xs uppercase tracking-widest font-mono transition-all rounded-md"
              style={{
                color: activeTab === key ? "#071426" : "var(--muted)",
                background: activeTab === key ? "var(--gold)" : "transparent",
                border: "none",
                cursor: "pointer",
                fontWeight: activeTab === key ? 700 : 400,
              }}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* ══ TAB CONTENT ═════════════════════════════════════════════════════════ */}
      <div className="max-w-5xl mx-auto w-full px-6 py-10 flex-1">

        {/* ── 01 WALLET ─────────────────────────────────────────────────────── */}
        {activeTab === "wallet" && (
          <div className="max-w-2xl space-y-6">
            <div>
              <SectionBadge>Mint Your Wallet</SectionBadge>
              <h2
                className="text-2xl font-bold mb-2"
                style={{
                  fontFamily: "var(--font-display)",
                  color: "var(--gold-light)",
                }}
              >
                Generate a Non-Custodial XRPL Wallet
              </h2>
              <p className="text-sm" style={{ color: "var(--muted)", lineHeight: 1.75 }}>
                Your XRPL address and public key are returned. The seed is{" "}
                <strong style={{ color: "var(--gold)" }}>
                  never stored or transmitted
                </strong>{" "}
                in production — use{" "}
                <a
                  href="https://xaman.app"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: "var(--gold-light)" }}
                >
                  Xaman
                </a>{" "}
                or a hardware wallet for full seed control.
              </p>
            </div>

            <button
              onClick={generateWallet}
              disabled={walletLoading}
              className="px-6 py-3 text-sm font-mono uppercase tracking-widest rounded transition-all"
              style={{
                background: walletLoading ? "var(--navy-2)" : "var(--gold)",
                color: walletLoading ? "var(--muted)" : "#071426",
                border: "1px solid var(--gold)",
                cursor: walletLoading ? "not-allowed" : "pointer",
                fontWeight: 700,
              }}
            >
              {walletLoading ? "Generating…" : "Generate New Wallet"}
            </button>

            {walletError && (
              <div
                className="px-4 py-3 rounded text-sm"
                style={{
                  color: "#ef4444",
                  background: "rgba(239,68,68,0.08)",
                  border: "1px solid rgba(239,68,68,0.3)",
                }}
              >
                {walletError}
              </div>
            )}

            {wallet && (
              <div
                className="rounded-lg p-6 space-y-5"
                style={{ background: "var(--navy-2)", border: "1px solid var(--line)" }}
              >
                {/* Address */}
                <div>
                  <div
                    className="text-xs font-mono uppercase tracking-widest mb-1.5"
                    style={{ color: "var(--gold)" }}
                  >
                    XRPL Address
                  </div>
                  <div
                    className="font-mono text-sm flex items-center gap-2 cursor-pointer group"
                    style={{ color: "var(--gold-light)" }}
                    onClick={() => copyToClipboard(wallet.address, "wallet-addr")}
                  >
                    <span>{wallet.address}</span>
                    <span
                      className="text-xs"
                      style={{
                        color:
                          copied === "wallet-addr" ? "#22c55e" : "var(--muted)",
                      }}
                    >
                      {copied === "wallet-addr" ? "✓ Copied" : "copy"}
                    </span>
                  </div>
                </div>

                {/* Public key */}
                <div>
                  <div
                    className="text-xs font-mono uppercase tracking-widest mb-1.5"
                    style={{ color: "var(--gold)" }}
                  >
                    Public Key
                  </div>
                  <div
                    className="font-mono text-xs break-all cursor-pointer flex items-start gap-2"
                    style={{ color: "var(--muted)" }}
                    onClick={() => copyToClipboard(wallet.publicKey, "wallet-pk")}
                  >
                    <span className="flex-1">{wallet.publicKey}</span>
                    <span
                      className="shrink-0 text-xs"
                      style={{
                        color: copied === "wallet-pk" ? "#22c55e" : "var(--muted)",
                      }}
                    >
                      {copied === "wallet-pk" ? "✓" : "↗"}
                    </span>
                  </div>
                </div>

                {/* Seed (demo mode only) */}
                {wallet.seed && wallet.demoMode && (
                  <div>
                    <div
                      className="text-xs font-mono uppercase tracking-widest mb-1.5"
                      style={{ color: "#ef4444" }}
                    >
                      Seed (DEMO MODE — do not fund)
                    </div>
                    <div
                      className="font-mono text-xs"
                      style={{ color: "#ef4444" }}
                    >
                      {wallet.seed}
                    </div>
                  </div>
                )}

                {/* Reserve notice */}
                <div
                  className="text-xs px-3 py-2 rounded"
                  style={{
                    background: "rgba(201,154,60,0.08)",
                    border: "1px solid var(--line)",
                    color: "var(--muted)",
                    lineHeight: 1.6,
                  }}
                >
                  ⚠ To activate this address, send at least{" "}
                  <strong style={{ color: "var(--gold-light)" }}>
                    {XRP_RESERVE_BASE} XRP
                  </strong>{" "}
                  (base reserve). Additional{" "}
                  <strong style={{ color: "var(--gold-light)" }}>0.2 XRP</strong>{" "}
                  required per trust line.
                </div>

                {/* Next step */}
                <button
                  onClick={() => setActiveTab("trust")}
                  className="w-full py-2.5 text-sm font-mono uppercase tracking-widest rounded border transition-all"
                  style={{
                    borderColor: "var(--gold)",
                    color: "var(--gold)",
                    background: "none",
                    cursor: "pointer",
                  }}
                >
                  Next: Set TROPTIONS Trust Line →
                </button>
              </div>
            )}

            {/* Already have a wallet */}
            <GoldDivider />
            <div>
              <p
                className="text-sm mb-4"
                style={{ color: "var(--muted)", lineHeight: 1.75 }}
              >
                Already have an XRPL wallet? Use the{" "}
                <button
                  onClick={() => setActiveTab("verify")}
                  style={{
                    color: "var(--gold)",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    textDecoration: "underline",
                  }}
                >
                  Verify tab
                </button>{" "}
                to check your XRP balance, TROPTIONS holdings, and trust line
                status.
              </p>
            </div>
          </div>
        )}

        {/* ── 02 TRUST LINE ─────────────────────────────────────────────────── */}
        {activeTab === "trust" && (
          <div className="max-w-2xl space-y-6">
            <div>
              <SectionBadge>Step 2 of 4</SectionBadge>
              <h2
                className="text-2xl font-bold mb-2"
                style={{
                  fontFamily: "var(--font-display)",
                  color: "var(--gold-light)",
                }}
              >
                Set TROPTIONS Trust Line
              </h2>
              <p className="text-sm" style={{ color: "var(--muted)", lineHeight: 1.75 }}>
                Before your wallet can hold TROPTIONS, you must authorize a trust
                line to the issuer. This is a one-time on-chain transaction that
                uses 0.2 XRP in reserve (recoverable if you remove the trust line
                later).
              </p>
            </div>

            {/* Token details */}
            <div
              className="rounded-lg p-5 text-sm"
              style={{ background: "var(--navy-2)", border: "1px solid var(--line)" }}
            >
              <div className="grid gap-3">
                {[
                  { label: "Currency Name", value: "TROPTIONS" },
                  {
                    label: "Currency Hex Code",
                    value: TROPTIONS_HEX,
                    mono: true,
                    small: true,
                  },
                  {
                    label: "Issuer Address",
                    value: TROPTIONS_ISSUER,
                    mono: true,
                    copyLabel: "trust-issuer",
                  },
                  { label: "Trust Limit", value: "1,000,000,000 TROPTIONS" },
                  { label: "Reserve Required", value: "0.2 XRP" },
                  { label: "Standard", value: "XRP Ledger IOU (XLS-20 compatible)" },
                ].map(({ label, value, mono, small, copyLabel }) => (
                  <div
                    key={label}
                    className="flex justify-between items-start gap-4"
                    style={{ borderBottom: "1px solid rgba(201,154,60,0.1)", paddingBottom: "0.5rem" }}
                  >
                    <span style={{ color: "var(--muted)" }}>{label}</span>
                    <span
                      className={[
                        mono ? "font-mono" : "",
                        small ? "text-xs" : "",
                        "text-right break-all",
                        copyLabel ? "cursor-pointer hover:opacity-80" : "",
                      ]
                        .filter(Boolean)
                        .join(" ")}
                      style={{ color: "var(--gold-light)" }}
                      onClick={
                        copyLabel
                          ? () => copyToClipboard(value, copyLabel)
                          : undefined
                      }
                    >
                      {value}
                      {copyLabel && (
                        <span
                          style={{
                            color:
                              copied === copyLabel ? "#22c55e" : "var(--muted)",
                            marginLeft: "0.25rem",
                          }}
                        >
                          {copied === copyLabel ? " ✓" : " ↗"}
                        </span>
                      )}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* TX preview */}
            <div>
              <div
                className="text-xs font-mono uppercase tracking-widest mb-2"
                style={{ color: "var(--gold)" }}
              >
                TrustSet Transaction JSON
              </div>
              <TxPreview json={buildTrustSetJson()} />
              <div className="mt-2">
                <CopyButton
                  text={buildTrustSetJson()}
                  label="trustset"
                  copied={copied}
                  onCopy={copyToClipboard}
                />
              </div>
            </div>

            <SigningInstructions />

            <button
              onClick={() => setActiveTab("buy")}
              className="w-full py-2.5 text-sm font-mono uppercase tracking-widest rounded border transition-all"
              style={{
                borderColor: "var(--gold)",
                color: "var(--gold)",
                background: "none",
                cursor: "pointer",
              }}
            >
              Next: Buy TROPTIONS →
            </button>
          </div>
        )}

        {/* ── 03 BUY ────────────────────────────────────────────────────────── */}
        {activeTab === "buy" && (
          <div className="max-w-2xl space-y-6">
            <div>
              <SectionBadge>Step 3 of 4</SectionBadge>
              <h2
                className="text-2xl font-bold mb-2"
                style={{
                  fontFamily: "var(--font-display)",
                  color: "var(--gold-light)",
                }}
              >
                Buy TROPTIONS
              </h2>
              <p className="text-sm" style={{ color: "var(--muted)", lineHeight: 1.75 }}>
                Place a market order on the XRPL DEX. Enter the XRP amount you
                want to spend — the ledger will fill available TROPTIONS offers at
                current market rates. Any unfilled portion is cancelled
                immediately (tfImmediateOrCancel).
              </p>
            </div>

            {/* Input */}
            <div
              className="rounded-lg p-5"
              style={{ background: "var(--navy-2)", border: "1px solid var(--line)" }}
            >
              <label
                className="block text-xs font-mono uppercase tracking-widest mb-2"
                style={{ color: "var(--gold)" }}
              >
                XRP Amount to Spend
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  value={buyXrp}
                  onChange={(e) => setBuyXrp(e.target.value)}
                  min="1"
                  step="1"
                  className="flex-1 px-4 py-2.5 rounded font-mono text-sm focus:outline-none"
                  style={{
                    background: "#050e1a",
                    border: "1px solid var(--line)",
                    color: "var(--foreground)",
                  }}
                  placeholder="100"
                />
                <span className="font-mono text-sm" style={{ color: "var(--muted)" }}>
                  XRP
                </span>
              </div>

              {/* Estimates */}
              <div className="mt-3 space-y-1 text-xs font-mono">
                {prices?.xrp && (
                  <p style={{ color: "var(--muted)" }}>
                    ≈{" "}
                    <strong style={{ color: "var(--gold-light)" }}>
                      ${((parseFloat(buyXrp) || 0) * prices.xrp).toFixed(2)} USD
                    </strong>
                  </p>
                )}
                {estTroptions != null ? (
                  <p style={{ color: "var(--muted)" }}>
                    Estimated TROPTIONS received:{" "}
                    <strong style={{ color: "var(--gold-light)" }}>
                      {fmt(estTroptions, 2)}
                    </strong>{" "}
                    (at best ask — market may vary)
                  </p>
                ) : (
                  <p style={{ color: "var(--muted)" }}>
                    No live ask orders — check order book before transacting
                  </p>
                )}
              </div>
            </div>

            {/* TX */}
            <div>
              <div
                className="text-xs font-mono uppercase tracking-widest mb-2"
                style={{ color: "var(--gold)" }}
              >
                OfferCreate Transaction JSON
              </div>
              <TxPreview json={buildBuyOfferJson()} />
              <div className="mt-2">
                <CopyButton
                  text={buildBuyOfferJson()}
                  label="buyoffer"
                  copied={copied}
                  onCopy={copyToClipboard}
                />
              </div>
            </div>

            {/* Requirements */}
            <div
              className="p-4 rounded-lg text-sm"
              style={{ background: "rgba(201,154,60,0.07)", border: "1px solid var(--line)" }}
            >
              <p
                className="font-mono text-xs uppercase tracking-widest mb-2"
                style={{ color: "var(--gold)" }}
              >
                Pre-flight checklist
              </p>
              <ul className="list-disc list-inside space-y-1" style={{ color: "var(--muted)" }}>
                <li>Wallet funded with at least {parseFloat(buyXrp) + 4} XRP</li>
                <li>
                  TROPTIONS trust line active{" "}
                  <button
                    onClick={() => setActiveTab("trust")}
                    style={{ color: "var(--gold)", background: "none", border: "none", cursor: "pointer" }}
                  >
                    (set it →)
                  </button>
                </li>
                <li>Submit via Xaman, Ledger, or XRPL signing tool</li>
              </ul>
            </div>

            <SigningInstructions />
          </div>
        )}

        {/* ── 04 SELL ───────────────────────────────────────────────────────── */}
        {activeTab === "sell" && (
          <div className="max-w-2xl space-y-6">
            <div>
              <SectionBadge>Step 4 of 4</SectionBadge>
              <h2
                className="text-2xl font-bold mb-2"
                style={{
                  fontFamily: "var(--font-display)",
                  color: "var(--gold-light)",
                }}
              >
                Sell TROPTIONS
              </h2>
              <p className="text-sm" style={{ color: "var(--muted)", lineHeight: 1.75 }}>
                Place a market sell order on the XRPL DEX. Enter the quantity of
                TROPTIONS to sell — the ledger will fill available XRP bids at
                current market rates. The{" "}
                <strong style={{ color: "var(--gold)" }}>tfSell</strong> flag
                ensures all TROPTIONS are offered even at better-than-expected
                rates.
              </p>
            </div>

            {/* Input */}
            <div
              className="rounded-lg p-5"
              style={{ background: "var(--navy-2)", border: "1px solid var(--line)" }}
            >
              <label
                className="block text-xs font-mono uppercase tracking-widest mb-2"
                style={{ color: "var(--gold)" }}
              >
                TROPTIONS Amount to Sell
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  value={sellTroptions}
                  onChange={(e) => setSellTroptions(e.target.value)}
                  min="1"
                  step="1"
                  className="flex-1 px-4 py-2.5 rounded font-mono text-sm focus:outline-none"
                  style={{
                    background: "#050e1a",
                    border: "1px solid var(--line)",
                    color: "var(--foreground)",
                  }}
                  placeholder="1000"
                />
                <span className="font-mono text-sm" style={{ color: "var(--muted)" }}>
                  TROPTIONS
                </span>
              </div>

              {/* Estimates */}
              <div className="mt-3 space-y-1 text-xs font-mono">
                {accountData && hasTrustLine && (
                  <p style={{ color: "var(--muted)" }}>
                    Your balance:{" "}
                    <strong style={{ color: "var(--gold-light)" }}>
                      {troptionsBalance} TROPTIONS
                    </strong>
                  </p>
                )}
                {estXrp != null ? (
                  <p style={{ color: "var(--muted)" }}>
                    Estimated XRP received:{" "}
                    <strong style={{ color: "var(--gold-light)" }}>
                      {fmt(estXrp, 4)} XRP
                    </strong>
                    {prices?.xrp && (
                      <span>
                        {" "}
                        ≈{" "}
                        <strong style={{ color: "var(--gold)" }}>
                          ${fmt(estXrp * prices.xrp, 2)} USD
                        </strong>
                      </span>
                    )}{" "}
                    (at best bid — market may vary)
                  </p>
                ) : (
                  <p style={{ color: "var(--muted)" }}>
                    No live bid orders — check order book before transacting
                  </p>
                )}
              </div>
            </div>

            {/* TX */}
            <div>
              <div
                className="text-xs font-mono uppercase tracking-widest mb-2"
                style={{ color: "var(--gold)" }}
              >
                OfferCreate Transaction JSON
              </div>
              <TxPreview json={buildSellOfferJson()} />
              <div className="mt-2">
                <CopyButton
                  text={buildSellOfferJson()}
                  label="selloffer"
                  copied={copied}
                  onCopy={copyToClipboard}
                />
              </div>
            </div>

            <SigningInstructions />
          </div>
        )}

        {/* ── 05 VERIFY ─────────────────────────────────────────────────────── */}
        {activeTab === "verify" && (
          <div className="max-w-2xl space-y-6">
            <div>
              <SectionBadge>Verify Assets</SectionBadge>
              <h2
                className="text-2xl font-bold mb-2"
                style={{
                  fontFamily: "var(--font-display)",
                  color: "var(--gold-light)",
                }}
              >
                Verify Your Wallet
              </h2>
              <p className="text-sm" style={{ color: "var(--muted)", lineHeight: 1.75 }}>
                Enter any XRPL address to verify its XRP balance, TROPTIONS trust
                line status, and all associated IOU holdings. Read-only — no
                signing required.
              </p>
            </div>

            {/* Input row */}
            <div className="flex gap-3">
              <input
                type="text"
                value={verifyAddress}
                onChange={(e) => setVerifyAddress(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") verifyWallet();
                }}
                placeholder="rXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
                className="flex-1 px-4 py-2.5 rounded font-mono text-sm focus:outline-none"
                style={{
                  background: "#050e1a",
                  border: "1px solid var(--line)",
                  color: "var(--foreground)",
                }}
              />
              <button
                onClick={verifyWallet}
                disabled={verifyLoading || !verifyAddress.trim()}
                className="px-6 py-2.5 text-sm font-mono uppercase tracking-widest rounded transition-all"
                style={{
                  background: "var(--gold)",
                  color: "#071426",
                  fontWeight: 700,
                  cursor:
                    verifyLoading || !verifyAddress.trim()
                      ? "not-allowed"
                      : "pointer",
                  opacity:
                    verifyLoading || !verifyAddress.trim() ? 0.5 : 1,
                }}
              >
                {verifyLoading ? "…" : "Verify →"}
              </button>
            </div>

            {verifyError && (
              <div
                className="px-4 py-3 rounded text-sm"
                style={{
                  color: "#ef4444",
                  background: "rgba(239,68,68,0.08)",
                  border: "1px solid rgba(239,68,68,0.3)",
                }}
              >
                {verifyError}
              </div>
            )}

            {accountData && (
              <div
                className="rounded-lg p-6 space-y-6"
                style={{ background: "var(--navy-2)", border: "1px solid var(--line)" }}
              >
                {/* Address */}
                <div>
                  <div
                    className="text-xs font-mono uppercase tracking-widest mb-1"
                    style={{ color: "var(--gold)" }}
                  >
                    Address
                  </div>
                  <div
                    className="font-mono text-sm cursor-pointer"
                    style={{ color: "var(--foreground)" }}
                    onClick={() =>
                      copyToClipboard(accountData.address, "verified-addr")
                    }
                  >
                    {accountData.address}
                    {copied === "verified-addr" && (
                      <span style={{ color: "#22c55e" }}> ✓</span>
                    )}
                  </div>
                </div>

                {/* Balances grid */}
                <div className="grid grid-cols-3 gap-4">
                  {[
                    {
                      label: "XRP Balance",
                      value: `${accountData.xrpBalance} XRP`,
                      gold: true,
                    },
                    {
                      label: "Sequence",
                      value: String(accountData.sequence),
                      gold: false,
                    },
                    {
                      label: "Owner Objects",
                      value: String(accountData.ownerCount),
                      gold: false,
                    },
                  ].map(({ label, value, gold }) => (
                    <div key={label}>
                      <div
                        className="text-xs font-mono uppercase tracking-widest mb-1"
                        style={{ color: "var(--muted)" }}
                      >
                        {label}
                      </div>
                      <div
                        className="text-lg font-bold font-mono"
                        style={{
                          color: gold ? "var(--gold-light)" : "var(--foreground)",
                        }}
                      >
                        {value}
                      </div>
                    </div>
                  ))}
                </div>

                {/* TROPTIONS status */}
                <div>
                  <div
                    className="text-xs font-mono uppercase tracking-widest mb-2"
                    style={{ color: "var(--gold)" }}
                  >
                    TROPTIONS Status
                  </div>
                  {hasTrustLine ? (
                    <div
                      className="flex items-center justify-between px-4 py-3 rounded"
                      style={{
                        background: "rgba(34,197,94,0.08)",
                        border: "1px solid rgba(34,197,94,0.3)",
                      }}
                    >
                      <span style={{ color: "#22c55e" }}>
                        ✓ Trust Line Active
                      </span>
                      <span
                        className="font-mono font-bold"
                        style={{ color: "var(--gold-light)" }}
                      >
                        {troptionsBalance} TROPTIONS
                      </span>
                    </div>
                  ) : (
                    <div
                      className="flex items-center justify-between px-4 py-3 rounded"
                      style={{
                        background: "rgba(239,68,68,0.08)",
                        border: "1px solid rgba(239,68,68,0.3)",
                      }}
                    >
                      <span style={{ color: "#ef4444" }}>
                        ✗ No TROPTIONS Trust Line
                      </span>
                      <button
                        onClick={() => setActiveTab("trust")}
                        className="text-xs font-mono uppercase"
                        style={{
                          color: "var(--gold)",
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                        }}
                      >
                        Set up →
                      </button>
                    </div>
                  )}
                </div>

                {/* All trust lines */}
                {accountData.trustLines.length > 0 && (
                  <div>
                    <div
                      className="text-xs font-mono uppercase tracking-widest mb-2"
                      style={{ color: "var(--gold)" }}
                    >
                      All Trust Lines ({accountData.trustLines.length})
                    </div>
                    <div className="space-y-1.5">
                      {accountData.trustLines.map((tl, i) => (
                        <div
                          key={i}
                          className="flex items-center justify-between px-3 py-2 rounded text-xs font-mono"
                          style={{
                            background: "#050e1a",
                            border: "1px solid var(--line)",
                          }}
                        >
                          <span style={{ color: "var(--muted)" }}>
                            {hexCurrencyToLabel(tl.currency as string)}
                          </span>
                          <span
                            className="font-bold"
                            style={{ color: "var(--gold-light)" }}
                          >
                            {tl.balance}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* ══ SCOPE OF SERVICE ════════════════════════════════════════════════════ */}
      <section style={{ borderTop: "1px solid var(--line)" }}>
        <div
          className="max-w-5xl mx-auto px-6 py-8"
          style={{ background: "var(--navy-2)" }}
        >
          <div
            className="text-xs font-mono uppercase tracking-widest mb-4"
            style={{ color: "var(--gold)" }}
          >
            SCOPE OF SERVICE
          </div>
          <div
            className="text-xs max-w-3xl space-y-3"
            style={{ color: "var(--muted)", lineHeight: 1.75 }}
          >
            <p>
              TROPTIONS LIVE is a non-custodial XRPL interface operated by UnyKorn.
              This platform does not hold, manage, or have access to any user funds
              or private keys. All transactions are constructed locally and must be
              signed and submitted solely by the end user via their own
              XRPL-compatible wallet (e.g. Xaman, Ledger, or XRPL Toolkit).
            </p>
            <p>
              TROPTIONS is a digital asset issued on the XRP Ledger. It is not a
              registered security, investment product, or financial instrument under
              US or international law. No investment advice is provided on this
              platform. Trading digital assets involves significant risk including
              the potential loss of all capital. Past performance does not guarantee
              future results.
            </p>
            <p>
              XRP Ledger transactions — including trust line authorizations, DEX
              offers, and payments — are immutable once validated by the network.
              Always verify all transaction fields before signing. UnyKorn bears no
              liability for transactions submitted by users.
            </p>
            <p>
              Not FDIC insured. Not a registered investment advisor. Not affiliated
              with Ripple Labs, Inc. Market data is provided for informational
              purposes only and may be delayed or inaccurate.
            </p>
          </div>
        </div>
      </section>

      {/* ══ FOOTER ══════════════════════════════════════════════════════════════ */}
      <footer
        style={{
          borderTop: "1px solid var(--line)",
          background: "var(--navy)",
        }}
      >
        {/* Nav row */}
        <div
          className="max-w-5xl mx-auto px-6 py-4 flex flex-wrap items-center justify-between gap-3"
          style={{ borderBottom: "1px solid var(--line)" }}
        >
          <Link href="/troptions" style={{ display: "flex", alignItems: "center", gap: "0.55rem", textDecoration: "none" }}>
            <Image
              src="/assets/troptions/logos/troptions-tt-on-black.jpg"
              alt="TROPTIONS"
              width={28}
              height={28}
              style={{ borderRadius: 4, objectFit: "cover" }}
            />
            <span
              style={{
                fontFamily: "'Palatino Linotype',Georgia,serif",
                fontSize: "0.8rem",
                letterSpacing: "0.2em",
                color: "var(--muted)",
                textTransform: "uppercase",
              }}
            >
              TROPTIONS
            </span>
          </Link>
          <div className="flex flex-wrap gap-4 text-xs font-mono" style={{ color: "var(--muted)" }}>
            <Link href="/troptions" style={{ color: "var(--muted)", textDecoration: "none" }}>Institutional Portal</Link>
            <Link href="/troptions/verification" style={{ color: "var(--muted)", textDecoration: "none" }}>Proof Room</Link>
            <Link href="/troptions/stablecoins" style={{ color: "var(--muted)", textDecoration: "none" }}>Stablecoins</Link>
            <Link href="/troptions/layer1" style={{ color: "var(--muted)", textDecoration: "none" }}>Layer 1</Link>
            <Link href="/troptions/wallets" style={{ color: "var(--muted)", textDecoration: "none" }}>Wallets</Link>
            <a href="https://xrpl.org" target="_blank" rel="noopener noreferrer" style={{ color: "var(--muted)", textDecoration: "none" }}>XRPL.org ↗</a>
            <a href="https://xaman.app" target="_blank" rel="noopener noreferrer" style={{ color: "var(--muted)", textDecoration: "none" }}>Xaman ↗</a>
          </div>
        </div>
        {/* Copyright */}
        <div className="max-w-5xl mx-auto px-6 py-3 flex items-center justify-between text-xs font-mono" style={{ color: "#3a3530" }}>
          <span>© 2003–2026 TROPTIONS / UNYKORN. All rights reserved.</span>
          <span style={{ color: "var(--gold)", letterSpacing: "0.15em" }}>TROPTIONS LIVE</span>
        </div>
      </footer>
    </main>
  );
}
