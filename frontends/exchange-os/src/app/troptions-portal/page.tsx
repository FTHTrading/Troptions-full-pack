"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";

// ─── Types ────────────────────────────────────────────────────────────────────

interface ApiResult {
  ok: boolean;
  mode?: string;
  chain?: string;
  txHash?: string;
  txType?: string;
  simulatedData?: Record<string, unknown>;
  error?: string;
  [key: string]: unknown;
}

interface PriceData {
  ok: boolean;
  xrp: number | null;
  xlm: number | null;
  lastUpdated: string;
}

interface WalletData {
  address: string;
  seed: string | null;
  publicKey: string;
  algorithm: string;
  demoMode: boolean;
  note?: string;
  warning?: string;
}

interface VerifyData {
  address: string;
  xrpBalance: string;
  sequence: number;
  ownerCount: number;
  trustLines: Array<{ currency: string; balance: string; limit: string; issuer: string }>;
}

// ─── Shared UI Primitives ────────────────────────────────────────────────────

function Mono({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <span className={`font-mono ${className}`}>{children}</span>;
}

type TagColor = "green" | "gold" | "blue" | "amber" | "red";
function Tag({ color, children }: { color: TagColor; children: React.ReactNode }) {
  const styles: Record<TagColor, string> = {
    green: "border-emerald-400/40 bg-emerald-400/10 text-emerald-300",
    gold: "border-[#C9A84C]/40 bg-[#C9A84C]/10 text-[#f0cf82]",
    blue: "border-sky-400/40 bg-sky-400/10 text-sky-300",
    amber: "border-amber-400/40 bg-amber-400/10 text-amber-300",
    red: "border-red-400/40 bg-red-400/10 text-red-300",
  };
  return (
    <span className={`border rounded px-2 py-0.5 text-[10px] font-mono uppercase tracking-widest ${styles[color]}`}>
      {children}
    </span>
  );
}

function FL({ children }: { children: React.ReactNode }) {
  return <label className="block text-[10px] font-mono uppercase tracking-[0.2em] text-[#C9A84C] mb-1">{children}</label>;
}

function FI(props: React.InputHTMLAttributes<HTMLInputElement>) {
  const { className = "", ...rest } = props;
  return (
    <input
      {...rest}
      className={`w-full bg-[#030c17] border border-[#162030] rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-[#C9A84C]/60 placeholder-slate-700 font-mono ${className}`}
    />
  );
}

function FS({
  value,
  onChange,
  children,
}: {
  value: string;
  onChange: (v: string) => void;
  children: React.ReactNode;
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full bg-[#030c17] border border-[#162030] rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-[#C9A84C]/60 font-mono"
    >
      {children}
    </select>
  );
}

type BtnVariant = "gold" | "outline" | "ghost" | "sky";
function Btn({
  onClick,
  disabled,
  type = "button",
  children,
  variant = "gold",
  className = "",
}: {
  onClick?: () => void;
  disabled?: boolean;
  type?: "button" | "submit";
  children: React.ReactNode;
  variant?: BtnVariant;
  className?: string;
}) {
  const styles: Record<BtnVariant, string> = {
    gold: "bg-[#C9A84C] text-black font-semibold hover:bg-[#f0cf82]",
    outline: "border border-[#C9A84C]/40 text-[#f0cf82] hover:bg-[#C9A84C]/10",
    ghost: "border border-[#162030] text-slate-400 hover:text-white hover:border-slate-500",
    sky: "bg-sky-600 text-white font-semibold hover:bg-sky-500",
  };
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`px-5 py-2.5 rounded text-sm transition-colors disabled:opacity-40 ${styles[variant]} ${className}`}
    >
      {children}
    </button>
  );
}

function ResultBox({ result }: { result: ApiResult | null }) {
  if (!result) return null;
  const ok = result.ok;
  return (
    <div
      className={`mt-4 rounded border p-4 ${ok ? "border-emerald-500/30 bg-emerald-950/20" : "border-red-500/30 bg-red-950/20"}`}
    >
      <p className={`text-xs font-mono font-semibold mb-2 ${ok ? "text-emerald-400" : "text-red-400"}`}>
        {ok ? "▸ SUCCESS" : "▸ ERROR"}
        {result.mode ? ` — ${String(result.mode).toUpperCase()}` : ""}
        {result.chain ? ` / ${String(result.chain).toUpperCase()}` : ""}
      </p>
      {result.txHash && (
        <p className="text-xs font-mono text-slate-300 mb-1">tx: {String(result.txHash)}</p>
      )}
      {result.txType && <p className="text-xs text-slate-400 mb-1">type: {String(result.txType)}</p>}
      {result.error && <p className="text-xs text-red-300">{String(result.error)}</p>}
      {result.simulatedData && (
        <pre className="mt-2 text-[10px] text-slate-400 overflow-x-auto leading-5 max-h-64">
          {JSON.stringify(result.simulatedData, null, 2)}
        </pre>
      )}
    </div>
  );
}

async function postJson(url: string, body: unknown): Promise<ApiResult> {
  const r = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return r.json() as Promise<ApiResult>;
}

// ─── Section wrapper ─────────────────────────────────────────────────────────

function Section({
  id,
  title,
  badge,
  badgeColor = "gold",
  children,
  borderColor = "border-[#1a2535]",
}: {
  id?: string;
  title: string;
  badge?: string;
  badgeColor?: TagColor;
  children: React.ReactNode;
  borderColor?: string;
}) {
  return (
    <section
      id={id}
      className={`rounded-xl border ${borderColor} bg-[#050f1c] p-6 md:p-8 scroll-mt-24`}
    >
      <div
        className={`flex items-start justify-between gap-4 mb-6 pb-4 border-b ${borderColor}`}
      >
        <h2 className="text-sm font-mono uppercase tracking-[0.22em] text-[#f0cf82]">{title}</h2>
        {badge && <Tag color={badgeColor}>{badge}</Tag>}
      </div>
      {children}
    </section>
  );
}

// ─── Price Ticker ─────────────────────────────────────────────────────────────

function PriceTicker({ prices }: { prices: PriceData | null }) {
  if (!prices) {
    return <span className="text-[10px] font-mono text-slate-700">Loading…</span>;
  }
  return (
    <div className="flex items-center gap-3 text-[10px] font-mono">
      <span>
        <span className="text-[#C9A84C]">XRP</span>{" "}
        <span className="text-white">{prices.xrp != null ? `$${prices.xrp.toFixed(4)}` : "—"}</span>
      </span>
      <span className="text-slate-700">·</span>
      <span>
        <span className="text-sky-400">XLM</span>{" "}
        <span className="text-white">{prices.xlm != null ? `$${prices.xlm.toFixed(4)}` : "—"}</span>
      </span>
    </div>
  );
}

// ─── Wallet Generator ─────────────────────────────────────────────────────────

function WalletGenerator() {
  const [loading, setLoading] = useState(false);
  const [wallet, setWallet] = useState<WalletData | null>(null);
  const [copied, setCopied] = useState<string | null>(null);
  const [seedVisible, setSeedVisible] = useState(false);

  const generate = async () => {
    setLoading(true);
    setWallet(null);
    setSeedVisible(false);
    try {
      const r = await fetch("/api/troptions/wallet/generate", { method: "POST" });
      const d = (await r.json()) as WalletData & { ok: boolean };
      if (d.ok) setWallet(d);
    } finally {
      setLoading(false);
    }
  };

  const copy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="space-y-5">
      {/* ── Safety banner ── */}
      <div className="rounded border border-amber-500/30 bg-amber-950/20 px-4 py-3 space-y-1">
        <p className="text-xs font-mono font-semibold text-amber-400 uppercase tracking-widest">
          ⚠ Address Generation — Read Before Proceeding
        </p>
        <p className="text-[11px] text-amber-200/80 leading-5">
          This tool generates an XRPL address and public key for reference purposes. In this public
          portal, <strong>seed phrases are never returned or displayed</strong>. To generate a
          mainnet wallet with full key access, use a local tool: Xaman (XUMM), xrpl.js locally,
          or the XRPL.org account generator — never in a web browser connected to the internet.
        </p>
      </div>

      <p className="text-sm text-slate-400 leading-7">
        Generate a non-custodial XRPL address reference. Use it for trust lines, NFT receipt,
        MPT holdings, and proof-of-funds requests. Seed access requires a local signing tool.
      </p>

      <div className="flex items-center gap-3 flex-wrap">
        <Btn onClick={generate} disabled={loading} variant="gold">
          {loading ? "Generating…" : "GENERATE ADDRESS"}
        </Btn>
        <span className="text-[10px] font-mono text-slate-600">
          Address + public key only · No seed returned
        </span>
      </div>

      {wallet && (
        <div className="rounded border border-[#C9A84C]/20 bg-[#030c17] p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#1a2535]">
            <Tag color="green">Address Generated</Tag>
            {wallet.demoMode ? (
              <Tag color="amber">DEMO MODE</Tag>
            ) : (
              <Tag color="gold">Address Only · Seed Withheld</Tag>
            )}
          </div>

          {/* Demo mode warning */}
          {wallet.demoMode && (
            <div className="rounded bg-red-950/30 border border-red-500/30 px-4 py-3 text-xs text-red-300 font-mono">
              ⛔ DEMO MODE ACTIVE — {wallet.warning ?? "Do not fund this wallet with real assets."}
            </div>
          )}

          <div>
            <FL>Address (Public — safe to share)</FL>
            <div className="flex items-center gap-3 mt-1">
              <Mono className="text-[13px] text-white break-all flex-1">{wallet.address}</Mono>
              <button
                onClick={() => copy(wallet.address, "addr")}
                className="shrink-0 text-[10px] font-mono text-[#C9A84C] hover:text-yellow-300 transition-colors"
              >
                {copied === "addr" ? "✓ Copied" : "Copy"}
              </button>
            </div>
          </div>

          {/* Seed field — only shown in demo mode, hidden by default */}
          {wallet.demoMode && wallet.seed ? (
            <div>
              <FL>Family Seed — DEMO ONLY · DO NOT FUND</FL>
              <div className="rounded bg-red-950/20 border border-red-500/20 px-3 py-2 space-y-2">
                <div className="flex items-center justify-between gap-2">
                  {seedVisible ? (
                    <Mono className="text-[13px] text-red-300 break-all flex-1">{wallet.seed}</Mono>
                  ) : (
                    <span className="text-[13px] font-mono text-slate-600 flex-1 tracking-widest">
                      {"•".repeat(29)}
                    </span>
                  )}
                  <button
                    onClick={() => setSeedVisible(!seedVisible)}
                    className="shrink-0 text-[10px] font-mono text-red-400 hover:text-red-200 transition-colors border border-red-500/30 rounded px-2 py-1"
                  >
                    {seedVisible ? "Hide" : "Reveal (Demo)"}
                  </button>
                  {seedVisible && (
                    <button
                      onClick={() => copy(wallet.seed!, "seed")}
                      className="shrink-0 text-[10px] font-mono text-[#C9A84C] hover:text-yellow-300 transition-colors"
                    >
                      {copied === "seed" ? "✓ Copied" : "Copy"}
                    </button>
                  )}
                </div>
                <p className="text-[10px] text-red-400 font-mono">
                  ⛔ This is a demo seed only. Never use for real funds.
                </p>
              </div>
            </div>
          ) : (
            <div className="rounded bg-[#0a1422] border border-[#1a2535] px-4 py-3 space-y-1">
              <p className="text-[11px] font-mono text-slate-400">
                <span className="text-emerald-400">✓ Seed not returned.</span> This portal never
                transmits seed phrases. To obtain a mainnet wallet with seed access, generate
                locally using Xaman (XUMM) or{" "}
                <a
                  href="https://xrpl.org/xrp-testnet-faucet.html"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#C9A84C] hover:underline"
                >
                  XRPL Testnet Faucet
                </a>
                .
              </p>
            </div>
          )}

          <div className="grid sm:grid-cols-2 gap-3 pt-1">
            <div className="rounded border border-[#162030] p-3">
              <p className="text-[9px] font-mono uppercase tracking-widest text-slate-500 mb-1">Public Key</p>
              <Mono className="text-[10px] text-slate-400 break-all">{wallet.publicKey}</Mono>
            </div>
            <div className="rounded border border-[#162030] p-3">
              <p className="text-[9px] font-mono uppercase tracking-widest text-slate-500 mb-1">Next Steps</p>
              <ul className="text-[10px] text-slate-400 space-y-1">
                <li>› Fund with 2+ XRP using Xaman (XUMM) — not this portal</li>
                <li>› Set up TROPT trust line below</li>
                <li>› Receive TROPT tokens from treasury (admin-approved)</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Trust Line Guide ─────────────────────────────────────────────────────────

const TROPT_ISSUER = "rHwhVUciEBBWJxVUeAaagLcdyWtpcath54";
const STELLAR_TREASURY = "GCOTXN75SHALV4NIV2V4EBACXRMLAMU5J2MYLOGUJOLIA5HOO4DEYCLK";

function TrustLineGuide() {
  const [copied, setCopied] = useState<string | null>(null);

  const xrplJson = JSON.stringify(
    {
      TransactionType: "TrustSet",
      LimitAmount: { currency: "TROPT", issuer: TROPT_ISSUER, value: "1000000000" },
    },
    null,
    2
  );

  const copy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="space-y-5">
      {/* Safety label */}
      <div className="rounded border border-[#1a2535] bg-[#0a1422] px-4 py-3 flex flex-wrap items-center gap-3">
        <Tag color="amber">Template Only — Unsigned</Tag>
        <p className="text-[11px] text-slate-500 font-mono">
          These JSON templates are for reference only. No transaction is submitted from this portal.
          Sign and broadcast using Xaman (XUMM), Stellar Laboratory, or your own signing tool.
          Trust lines create real on-chain obligations — review carefully before signing.
        </p>
      </div>

      <p className="text-sm text-slate-400 leading-7">
        To receive TROPT tokens, establish a trust line from your wallet to the TROPTIONS issuer address.
        Use Xaman (XUMM), XRPL.org, or the raw JSON below.
      </p>

      <div className="grid md:grid-cols-2 gap-5">
        {/* XRPL */}
        <div className="rounded border border-[#1a2535] bg-[#030c17] p-4 space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-xs font-mono uppercase tracking-widest text-[#C9A84C]">XRPL TrustSet</p>
            <Tag color="gold">XRP Ledger</Tag>
          </div>
          <div>
            <FL>Issuer Address</FL>
            <div className="flex items-center gap-2">
              <Mono className="text-[11px] text-white break-all flex-1">{TROPT_ISSUER}</Mono>
              <button
                onClick={() => copy(TROPT_ISSUER, "xrpl-issuer")}
                className="text-[10px] font-mono text-[#C9A84C] hover:text-yellow-300 shrink-0"
              >
                {copied === "xrpl-issuer" ? "✓" : "Copy"}
              </button>
            </div>
          </div>
          <div>
            <FL>Transaction JSON</FL>
            <pre className="text-[10px] text-slate-300 overflow-x-auto leading-5 rounded bg-black/30 p-2">{xrplJson}</pre>
            <button
              onClick={() => copy(xrplJson, "xrpl-json")}
              className="text-[10px] font-mono text-[#C9A84C] hover:text-yellow-300 mt-1"
            >
              {copied === "xrpl-json" ? "✓ Copied JSON" : "Copy JSON"}
            </button>
          </div>
        </div>

        {/* Stellar */}
        <div className="rounded border border-sky-500/20 bg-[#030c17] p-4 space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-xs font-mono uppercase tracking-widest text-sky-400">Stellar changeTrust</p>
            <Tag color="blue">Stellar Mainnet</Tag>
          </div>
          <div>
            <FL>Stellar Treasury</FL>
            <div className="flex items-center gap-2">
              <Mono className="text-[11px] text-sky-200 break-all flex-1">{STELLAR_TREASURY}</Mono>
              <button
                onClick={() => copy(STELLAR_TREASURY, "stellar-addr")}
                className="text-[10px] font-mono text-sky-400 hover:text-sky-200 shrink-0"
              >
                {copied === "stellar-addr" ? "✓" : "Copy"}
              </button>
            </div>
          </div>
          <div className="text-[11px] text-slate-500 leading-5 space-y-1">
            <p>› Funded with <span className="text-sky-300 font-mono">35 XLM</span> (active)</p>
            <p>› Network: mainnet</p>
            <p>› Horizon: horizon.stellar.org</p>
            <p>› Use Stellar Laboratory or Lobstr wallet to set trust</p>
          </div>
          <a
            href="https://laboratory.stellar.org"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block text-[11px] font-mono text-sky-400 hover:text-sky-200 transition-colors"
          >
            Open Stellar Laboratory →
          </a>
        </div>
      </div>

      <div className="grid sm:grid-cols-3 gap-3 pt-1">
        {[
          { label: "Xaman (XUMM)", desc: "Mobile wallet. Scan QR to sign TrustSet.", href: "https://xumm.app" },
          { label: "XRPL.org Tools", desc: "Browser-based transaction signing.", href: "https://xrpl.org/trust-lines-and-issuing.html" },
          { label: "Lobstr (Stellar)", desc: "User-friendly Stellar wallet.", href: "https://lobstr.co" },
        ].map((l) => (
          <a
            key={l.label}
            href={l.href}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded border border-[#1a2535] p-3 hover:border-[#C9A84C]/40 transition-colors block"
          >
            <p className="text-[11px] font-mono text-[#C9A84C]">{l.label}</p>
            <p className="text-[10px] text-slate-500 mt-1">{l.desc}</p>
          </a>
        ))}
      </div>
    </div>
  );
}

// ─── Mint Console ─────────────────────────────────────────────────────────────

type MintTab = "tradeline" | "nft" | "mpt" | "lp";

function MintConsole() {
  const [tab, setTab] = useState<MintTab>("tradeline");
  const mintTabs: { id: MintTab; label: string; desc: string }[] = [
    { id: "tradeline", label: "Tradeline", desc: "TrustSet / changeTrust" },
    { id: "nft", label: "NFT", desc: "NFTokenMint" },
    { id: "mpt", label: "MPT / XLS-33", desc: "MPTokenIssuanceCreate" },
    { id: "lp", label: "LP Pool", desc: "AMMCreate" },
  ];

  return (
    <div>
      <div className="flex gap-1 mb-6 flex-wrap border-b border-[#1a2535] pb-4">
        {mintTabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`px-4 py-2 rounded text-[11px] font-mono uppercase tracking-widest transition-colors ${
              tab === t.id
                ? "bg-[#C9A84C] text-black font-semibold"
                : "border border-[#1a2535] text-slate-500 hover:text-white hover:border-slate-600"
            }`}
          >
            {t.label}
            {tab === t.id && (
              <span className="ml-2 text-[9px] font-normal opacity-70">{t.desc}</span>
            )}
          </button>
        ))}
      </div>
      {tab === "tradeline" && <TradelineForm />}
      {tab === "nft" && <NftForm />}
      {tab === "mpt" && <MptForm />}
      {tab === "lp" && <LpForm />}
    </div>
  );
}

function TradelineForm() {
  const [currency, setCurrency] = useState("TROPT");
  const [limit, setLimit] = useState("1000000000");
  const [chain, setChain] = useState("xrpl");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ApiResult | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult(await postJson("/api/troptions/mint/tradeline", { currency, limit, chain }).catch((err) => ({ ok: false, error: String(err) } as ApiResult)));
    setLoading(false);
  };

  return (
    <form onSubmit={submit} className="space-y-4">
      <div className="rounded border border-amber-500/20 bg-amber-950/10 px-3 py-2 flex items-center gap-2">
        <Tag color="amber">Simulation Only</Tag>
        <p className="text-[10px] font-mono text-amber-200/70">
          Generates an unsigned payload example. No transaction is broadcast. Mainnet execution requires Control Hub approval.
        </p>
      </div>
      <p className="text-xs text-slate-500 font-mono">
        Create a trust line to receive TROPT or any issued asset. XRPL uses TrustSet; Stellar uses
        changeTrust.
      </p>
      <div className="grid sm:grid-cols-3 gap-4">
        <div>
          <FL>Currency Code</FL>
          <FI value={currency} onChange={(e) => setCurrency(e.target.value)} required />
        </div>
        <div>
          <FL>Limit</FL>
          <FI value={limit} onChange={(e) => setLimit(e.target.value)} required />
        </div>
        <div>
          <FL>Chain</FL>
          <FS value={chain} onChange={setChain}>
            <option value="xrpl">XRPL</option>
            <option value="stellar">Stellar (35 XLM)</option>
          </FS>
        </div>
      </div>
      <Btn type="submit" disabled={loading} variant="gold">
        {loading ? "Generating Payload…" : "GENERATE TRADELINE PAYLOAD (SIMULATION)"}
      </Btn>
      <ResultBox result={result} />
    </form>
  );
}

function NftForm() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [taxon, setTaxon] = useState("1");
  const [transferFee, setTransferFee] = useState("0");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ApiResult | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult(
      await postJson("/api/troptions/mint/nft", {
        name,
        description,
        taxon: Number(taxon),
        transferFee: Number(transferFee),
        chain: "xrpl",
      }).catch((err) => ({ ok: false, error: String(err) } as ApiResult))
    );
    setLoading(false);
  };

  return (
    <form onSubmit={submit} className="space-y-4">
      <div className="rounded border border-amber-500/20 bg-amber-950/10 px-3 py-2 flex items-center gap-2">
        <Tag color="amber">Simulation Only</Tag>
        <p className="text-[10px] font-mono text-amber-200/70">
          Unsigned payload example. No NFT is minted on-chain. Mainnet execution requires Control Hub approval.
        </p>
      </div>
      <p className="text-xs text-slate-500 font-mono">
        NFTokenMint on XRPL. Asset receipts, certificates, proof-of-ownership, real estate
        tokenization.
      </p>
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <FL>NFT Name / Title</FL>
          <FI
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="TROPTIONS Asset Receipt #001"
            required
          />
        </div>
        <div>
          <FL>Taxon (Collection ID)</FL>
          <FI
            type="number"
            value={taxon}
            onChange={(e) => setTaxon(e.target.value)}
            min="0"
            required
          />
        </div>
      </div>
      <div>
        <FL>Description</FL>
        <FI
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Digital receipt for real-world asset transaction"
        />
      </div>
      <div>
        <FL>Transfer Fee (0–50000 bps · 0 = non-transferable royalty)</FL>
        <FI
          type="number"
          value={transferFee}
          onChange={(e) => setTransferFee(e.target.value)}
          min="0"
          max="50000"
        />
      </div>
      <Btn type="submit" disabled={loading} variant="gold">
        {loading ? "Building Payload…" : "BUILD NFT PAYLOAD (SIMULATION)"}
      </Btn>
      <ResultBox result={result} />
    </form>
  );
}

function MptForm() {
  const [name, setName] = useState("Troptions Gold MPT");
  const [ticker, setTicker] = useState("TROPT");
  const [maxSupply, setMaxSupply] = useState("9223372036854775807");
  const [assetScale, setAssetScale] = useState("6");
  const [transferFee, setTransferFee] = useState("0");
  const [transferable, setTransferable] = useState(true);
  const [tradeable, setTradeable] = useState(true);
  const [clawback, setClawback] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ApiResult | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult(
      await postJson("/api/troptions/mint/mpt", {
        name,
        ticker,
        maxSupply,
        assetScale: Number(assetScale),
        transferFee: Number(transferFee),
        transferable,
        tradeable,
        clawback,
      }).catch((err) => ({ ok: false, error: String(err) } as ApiResult))
    );
    setLoading(false);
  };

  return (
    <form onSubmit={submit} className="space-y-4">
      <div className="rounded border border-amber-500/20 bg-amber-950/10 px-3 py-2 flex items-center gap-2">
        <Tag color="amber">Simulation Only</Tag>
        <p className="text-[10px] font-mono text-amber-200/70">
          Unsigned MPT issuance payload only. No token is created on-chain. Mainnet execution requires Control Hub approval.
        </p>
      </div>
      <p className="text-xs text-slate-500 font-mono">
        MPTokenIssuanceCreate — XRPL Multi-Purpose Token (XLS-33d). Next-gen fungible token with
        DEX trading, transfer fees, and escrow support built in.
      </p>
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <FL>Token Name</FL>
          <FI value={name} onChange={(e) => setName(e.target.value)} required />
        </div>
        <div>
          <FL>Ticker Symbol</FL>
          <FI value={ticker} onChange={(e) => setTicker(e.target.value)} required />
        </div>
      </div>
      <div className="grid sm:grid-cols-3 gap-4">
        <div>
          <FL>Max Supply (integer string)</FL>
          <FI value={maxSupply} onChange={(e) => setMaxSupply(e.target.value)} required />
        </div>
        <div>
          <FL>Asset Scale (decimals 0–15)</FL>
          <FI
            type="number"
            value={assetScale}
            onChange={(e) => setAssetScale(e.target.value)}
            min="0"
            max="15"
            required
          />
        </div>
        <div>
          <FL>Transfer Fee (0–50000 bps)</FL>
          <FI
            type="number"
            value={transferFee}
            onChange={(e) => setTransferFee(e.target.value)}
            min="0"
            max="50000"
          />
        </div>
      </div>
      <div className="flex gap-6 flex-wrap">
        {(
          [
            { label: "Transferable (peer-to-peer)", key: "transferable", checked: transferable, set: setTransferable },
            { label: "DEX Tradeable", key: "tradeable", checked: tradeable, set: setTradeable },
            { label: "Clawback Authority", key: "clawback", checked: clawback, set: setClawback },
          ] as const
        ).map(({ label, checked, set }) => (
          <label key={label} className="flex items-center gap-2 text-sm text-slate-300 cursor-pointer">
            <input
              type="checkbox"
              checked={checked}
              onChange={(e) => (set as (v: boolean) => void)(e.target.checked)}
              className="accent-yellow-400"
            />
            {label}
          </label>
        ))}
      </div>
      <Btn type="submit" disabled={loading} variant="gold">
        {loading ? "Building Payload…" : "BUILD MPT PAYLOAD (SIMULATION)"}
      </Btn>
      <ResultBox result={result} />
    </form>
  );
}

function LpForm() {
  const [asset1, setAsset1] = useState("XRP");
  const [asset2, setAsset2] = useState("TROPT");
  const [issuer2, setIssuer2] = useState(TROPT_ISSUER);
  const [amount1, setAmount1] = useState("10");
  const [amount2, setAmount2] = useState("10000");
  const [chain, setChain] = useState("xrpl");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ApiResult | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult(
      await postJson("/api/troptions/mint/lp-token", {
        asset1: { currency: asset1 },
        asset2: { currency: asset2, issuer: issuer2 || undefined },
        amount1,
        amount2,
        chain,
      }).catch((err) => ({ ok: false, error: String(err) } as ApiResult))
    );
    setLoading(false);
  };

  return (
    <form onSubmit={submit} className="space-y-4">
      <div className="rounded border border-amber-500/20 bg-amber-950/10 px-3 py-2 flex items-center gap-2">
        <Tag color="amber">Simulation Only</Tag>
        <p className="text-[10px] font-mono text-amber-200/70">
          Unsigned LP pool payload only. No pool is created on-chain. Mainnet execution requires Control Hub approval.
        </p>
      </div>
      <p className="text-xs text-slate-500 font-mono">
        AMMCreate on XRPL or liquidityPoolDeposit on Stellar. Seed the initial liquidity pair. AMM
        pools enable on-chain DEX trading for TROPT.
      </p>
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <FL>Asset 1 Currency</FL>
          <FI value={asset1} onChange={(e) => setAsset1(e.target.value)} required />
        </div>
        <div>
          <FL>Asset 2 Currency</FL>
          <FI value={asset2} onChange={(e) => setAsset2(e.target.value)} required />
        </div>
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <FL>Asset 2 Issuer (blank for XRP)</FL>
          <FI value={issuer2} onChange={(e) => setIssuer2(e.target.value)} placeholder="r…" />
        </div>
        <div>
          <FL>Chain</FL>
          <FS value={chain} onChange={setChain}>
            <option value="xrpl">XRPL</option>
            <option value="stellar">Stellar (35 XLM funded)</option>
          </FS>
        </div>
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <FL>Seed Amount 1</FL>
          <FI
            type="number"
            value={amount1}
            onChange={(e) => setAmount1(e.target.value)}
            min="0"
            required
          />
        </div>
        <div>
          <FL>Seed Amount 2</FL>
          <FI
            type="number"
            value={amount2}
            onChange={(e) => setAmount2(e.target.value)}
            min="0"
            required
          />
        </div>
      </div>
      <Btn type="submit" disabled={loading} variant="gold">
        {loading ? "Building Payload…" : "BUILD LP POOL PAYLOAD (SIMULATION)"}
      </Btn>
      <ResultBox result={result} />
    </form>
  );
}

// ─── Fund & Seed ─────────────────────────────────────────────────────────────

type FundTab = "wallet" | "amm";

function FundSection() {
  const [tab, setTab] = useState<FundTab>("wallet");
  return (
    <div>
      {/* Safety banner — treasury funding is disabled in public portal */}
      <div className="rounded border border-red-500/30 bg-red-950/20 px-4 py-4 mb-6 space-y-2">
        <p className="text-xs font-mono font-semibold text-red-400 uppercase tracking-widest">
          ⛔ Treasury Funding Disabled — Public Portal
        </p>
        <p className="text-[11px] text-red-200/80 leading-5">
          Treasury funding operations are <strong>disabled in this public portal</strong>. This panel
          generates simulation records only — no XRP or XLM is transferred from the treasury.
          Treasury funding requires Control Hub approval and is executed exclusively from the admin
          control plane by authorized operators.
        </p>
        <div className="flex flex-wrap gap-2 pt-1">
          <Tag color="red">Mainnet Execution: Blocked</Tag>
          <Tag color="amber">Simulation Records Only</Tag>
          <Tag color="red">Control Hub Approval Required</Tag>
        </div>
      </div>

      <div className="flex gap-1 mb-6 border-b border-[#1a2535] pb-4">
        {(["wallet", "amm"] as FundTab[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 rounded text-[11px] font-mono uppercase tracking-widest transition-colors ${
              tab === t
                ? "bg-[#C9A84C] text-black font-semibold"
                : "border border-[#1a2535] text-slate-500 hover:text-white"
            }`}
          >
            {t === "wallet" ? "Fund Wallet (Simulation)" : "AMM Deposit (Simulation)"}
          </button>
        ))}
      </div>
      {tab === "wallet" && <FundWalletForm />}
      {tab === "amm" && <AmmDepositForm />}
    </div>
  );
}

const PRESET_WALLETS = [
  { label: "Minted Wallet 1", address: "r4upY8eDdmQbdAbRTEVfuuz6AywBiitYij" },
  { label: "Minted Wallet 2", address: "rHwhVUciEBBWJxVUeAaagLcdyWtpcath54" },
];

function FundWalletForm() {
  const [dest, setDest] = useState(PRESET_WALLETS[0].address);
  const [custom, setCustom] = useState("");
  const [amountXrp, setAmountXrp] = useState("2");
  const [memo, setMemo] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ApiResult | null>(null);

  const effectiveDest = dest === "custom" ? custom : dest;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Public portal always calls simulation endpoint — no live treasury transfer
    setResult(
      await postJson("/api/troptions/fund/wallet", {
        toAddress: effectiveDest,
        amountXrp,
        memo: memo || undefined,
      }).catch((err) => ({ ok: false, error: String(err) } as ApiResult))
    );
    setLoading(false);
  };

  return (
    <form onSubmit={submit} className="space-y-4">
      <p className="text-xs text-slate-500 font-mono">
        Simulation only. This form generates a funding record — no XRP is transferred from treasury.
        Treasury holds 10.99 XRP (XRPL Mainnet). Live operations require Control Hub authorization.
      </p>
      <div>
        <FL>Destination</FL>
        <FS value={dest} onChange={setDest}>
          {PRESET_WALLETS.map((w) => (
            <option key={w.address} value={w.address}>
              {w.label} — {w.address}
            </option>
          ))}
          <option value="custom">Custom address…</option>
        </FS>
        {dest === "custom" && (
          <FI
            className="mt-2"
            placeholder="r…"
            value={custom}
            onChange={(e) => setCustom(e.target.value)}
            required
          />
        )}
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <FL>Amount (XRP)</FL>
          <FI
            type="number"
            value={amountXrp}
            onChange={(e) => setAmountXrp(e.target.value)}
            min="0.000001"
            step="0.1"
            required
          />
        </div>
        <div>
          <FL>Memo (optional)</FL>
          <FI value={memo} onChange={(e) => setMemo(e.target.value)} placeholder="TROPTIONS wallet seed" />
        </div>
      </div>
      <Btn type="submit" disabled={loading} variant="outline">
        {loading ? "Generating Record…" : "GENERATE FUNDING RECORD (SIMULATION ONLY)"}
      </Btn>
      <ResultBox result={result} />
    </form>
  );
}

function AmmDepositForm() {
  const [asset1, setAsset1] = useState("XRP");
  const [asset2, setAsset2] = useState("TROPT");
  const [issuer2, setIssuer2] = useState(TROPT_ISSUER);
  const [amount1, setAmount1] = useState("5");
  const [amount2, setAmount2] = useState("500");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ApiResult | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult(
      await postJson("/api/troptions/fund/amm", {
        asset1: { currency: asset1 },
        asset2: { currency: asset2, issuer: issuer2 || undefined },
        amount1,
        amount2,
      }).catch((err) => ({ ok: false, error: String(err) } as ApiResult))
    );
    setLoading(false);
  };

  return (
    <form onSubmit={submit} className="space-y-4">
      <p className="text-xs text-slate-500 font-mono">
        Simulation only. AMMDeposit — add liquidity to an existing XRPL AMM pool. This generates
        a simulation record; no funds are deposited on-chain from this portal.
      </p>
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <FL>Asset 1</FL>
          <FI value={asset1} onChange={(e) => setAsset1(e.target.value)} required />
        </div>
        <div>
          <FL>Asset 2</FL>
          <FI value={asset2} onChange={(e) => setAsset2(e.target.value)} required />
        </div>
      </div>
      <div>
        <FL>Asset 2 Issuer</FL>
        <FI value={issuer2} onChange={(e) => setIssuer2(e.target.value)} placeholder="r…" />
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <FL>Amount 1</FL>
          <FI
            type="number"
            value={amount1}
            onChange={(e) => setAmount1(e.target.value)}
            min="0"
            required
          />
        </div>
        <div>
          <FL>Amount 2</FL>
          <FI
            type="number"
            value={amount2}
            onChange={(e) => setAmount2(e.target.value)}
            min="0"
            required
          />
        </div>
      </div>
      <Btn type="submit" disabled={loading} variant="outline">
        {loading ? "Generating Record…" : "GENERATE DEPOSIT RECORD (SIMULATION ONLY)"}
      </Btn>
      <ResultBox result={result} />
    </form>
  );
}

// ─── Asset Verifier ───────────────────────────────────────────────────────────

function AssetVerifier() {
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<VerifyData | null>(null);
  const [error, setError] = useState("");

  const verify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!address.trim()) return;
    setLoading(true);
    setResult(null);
    setError("");
    try {
      const r = await fetch("/api/troptions/wallet/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ address: address.trim() }),
      });
      const d = (await r.json()) as VerifyData & { ok: boolean; error?: string };
      if (d.ok) setResult(d);
      else setError(d.error ?? "Verification failed");
    } catch (err) {
      setError(String(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={verify} className="space-y-4">
      <p className="text-sm text-slate-400 leading-7">
        Enter any XRPL address to view its XRP balance, TROPT trust lines, and all held issued
        assets. Live data from XRPL Mainnet.
      </p>
      <div className="flex gap-2">
        <FI
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="r… XRPL address"
          className="flex-1"
        />
        <Btn type="submit" disabled={loading} variant="gold" className="shrink-0">
          {loading ? "…" : "VERIFY"}
        </Btn>
      </div>

      {error && <p className="text-xs text-red-400 font-mono">{error}</p>}

      {result && (
        <div className="rounded border border-[#1a2535] bg-[#030c17] p-5 space-y-4">
          <div className="flex items-center gap-3 flex-wrap pb-3 border-b border-[#1a2535]">
            <Tag color="green">Verified</Tag>
            <Mono className="text-[11px] text-white break-all">{result.address}</Mono>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <p className="text-[9px] font-mono uppercase tracking-widest text-slate-500 mb-1">XRP Balance</p>
              <p className="text-xl font-mono text-[#f0cf82]">
                {result.xrpBalance}{" "}
                <span className="text-xs text-slate-500">XRP</span>
              </p>
            </div>
            <div>
              <p className="text-[9px] font-mono uppercase tracking-widest text-slate-500 mb-1">Sequence</p>
              <p className="text-lg font-mono text-white">{result.sequence}</p>
            </div>
            <div>
              <p className="text-[9px] font-mono uppercase tracking-widest text-slate-500 mb-1">Owner Count</p>
              <p className="text-lg font-mono text-white">{result.ownerCount}</p>
            </div>
          </div>

          {result.trustLines.length > 0 ? (
            <div>
              <p className="text-[9px] font-mono uppercase tracking-widest text-slate-500 mb-2">
                Trust Lines ({result.trustLines.length})
              </p>
              <div className="space-y-1">
                {result.trustLines.map((tl, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between gap-3 text-[11px] font-mono border-b border-[#162030] py-1.5"
                  >
                    <span className="text-[#C9A84C] w-16 shrink-0">{tl.currency}</span>
                    <span className="text-white">{tl.balance}</span>
                    <span className="text-slate-500 truncate max-w-[160px]">{tl.issuer}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <p className="text-[11px] text-slate-600 font-mono">No trust lines established.</p>
          )}
        </div>
      )}
    </form>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

const STAT_CARDS = [
  { label: "Treasury XRP", value: "10.99", unit: "XRP", color: "text-[#f0cf82]" },
  { label: "Stellar Treasury", value: "35", unit: "XLM", color: "text-sky-300" },
  { label: "Minted Wallets", value: "2", unit: "wallets", color: "text-emerald-300" },
  { label: "Mint Mode", value: "Simulation", unit: "safe", color: "text-amber-300" },
] as const;

export default function TroptionsPortalPage() {
  const [prices, setPrices] = useState<PriceData | null>(null);

  const fetchPrices = useCallback(async () => {
    try {
      const r = await fetch("/api/troptions/price");
      const d = (await r.json()) as PriceData;
      setPrices(d);
    } catch {
      // silent
    }
  }, []);

  useEffect(() => {
    fetchPrices();
    const id = setInterval(fetchPrices, 60_000);
    return () => clearInterval(id);
  }, [fetchPrices]);

  return (
    <div className="min-h-screen bg-[#020a14] text-white">
      {/* ── Status Bar ── */}
      <header className="border-b border-[#0c1c2c] bg-[#020a14]/95 backdrop-blur sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3 min-w-0">
            <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)] animate-pulse shrink-0" />
            <span className="text-[10px] font-mono uppercase tracking-[0.28em] text-[#C9A84C] truncate">
              TROPTIONS XRPL + STELLAR SYSTEM
            </span>
            <span className="text-[10px] font-mono text-slate-600 hidden sm:inline">•</span>
            <span className="text-[10px] font-mono text-slate-500 hidden sm:inline">2026-04-27</span>
            <span className="text-[10px] font-mono text-slate-600 hidden md:inline">•</span>
            <span className="text-[10px] font-mono text-slate-500 hidden md:inline truncate">
              ASSET SETTLEMENT INFRASTRUCTURE
            </span>
          </div>
          <div className="flex items-center gap-4 shrink-0">
            <PriceTicker prices={prices} />
            <Link
              href="/portal/troptions/dashboard"
              className="px-3 py-1.5 rounded border border-[#C9A84C]/30 text-[10px] font-mono uppercase tracking-widest text-[#f0cf82] hover:bg-[#C9A84C]/10 transition-colors"
            >
              Enter System →
            </Link>
          </div>
        </div>
      </header>

      {/* ── Control Hub Safety Status ── */}
      <div className="bg-[#020a14] border-b border-[#0c1c2c]">
        <div className="max-w-6xl mx-auto px-4 py-2.5 flex flex-wrap items-center gap-x-4 gap-y-1.5">
          <span className="text-[9px] font-mono uppercase tracking-[0.3em] text-slate-600 shrink-0">
            Portal Status
          </span>
          <div className="flex flex-wrap gap-2">
            <Tag color="amber">Public Portal Mode: Simulation-Only</Tag>
            <Tag color="red">Mainnet Execution: Blocked</Tag>
            <Tag color="red">Treasury Funding: Disabled</Tag>
            <Tag color="amber">Minting: Unsigned Payloads Only</Tag>
            <Tag color="red">Control Hub Approval Required for Live Ops</Tag>
          </div>
        </div>
      </div>

      {/* ── Hero ── */}
      <section className="max-w-6xl mx-auto px-4 pt-20 pb-14 text-center">
        <p className="text-[10px] font-mono uppercase tracking-[0.4em] text-[#C9A84C] mb-5">
          Troptions · XRPL + Stellar Settlement Infrastructure
        </p>
        <h1
          className="text-5xl md:text-7xl font-semibold leading-tight mb-6"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Real-World Asset
          <br />
          <span className="text-[#C9A84C]">Digital Settlement.</span>
        </h1>
        <p className="text-base md:text-lg text-slate-400 max-w-2xl mx-auto leading-8 mb-10">
          Tradeline infrastructure. NFT issuance. MPT tokens (XLS-33). AMM liquidity pools.
          <br />
          Powered by XRPL + Stellar. Cryptographic proof. No price guarantees.
        </p>
        <div className="flex flex-wrap gap-3 justify-center">
          <a
            href="#wallet"
            className="px-7 py-3 rounded bg-[#C9A84C] text-black text-sm font-semibold hover:bg-[#f0cf82] transition-colors"
          >
            MINT WALLET
          </a>
          <a
            href="#mint"
            className="px-7 py-3 rounded border border-[#C9A84C]/50 text-[#f0cf82] text-sm font-semibold hover:bg-[#C9A84C]/10 transition-colors"
          >
            MINT TOKENS
          </a>
          <a
            href="#verify"
            className="px-7 py-3 rounded border border-[#162030] text-slate-300 text-sm hover:border-slate-500 transition-colors"
          >
            VERIFY ASSETS
          </a>
          <Link
            href="/portal/troptions/dashboard"
            className="px-7 py-3 rounded border border-[#162030] text-slate-300 text-sm hover:border-slate-500 transition-colors"
          >
            ENTER SYSTEM
          </Link>
        </div>
      </section>

      {/* ── System Stats ── */}
      <div className="max-w-6xl mx-auto px-4 pb-10">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {STAT_CARDS.map((s) => (
            <div key={s.label} className="rounded border border-[#1a2535] bg-[#050f1c] p-4">
              <p className="text-[9px] font-mono uppercase tracking-widest text-slate-600 mb-2">
                {s.label}
              </p>
              <p className={`text-2xl font-mono font-semibold ${s.color}`}>{s.value}</p>
              <p className="text-[10px] text-slate-600 font-mono mt-0.5">{s.unit}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Main Sections ── */}
      <main className="max-w-6xl mx-auto px-4 pb-24 space-y-5">
        {/* Wallet Generator */}
        <Section id="wallet" title="Mint Your Wallet" badge="Address Only · No Seed" badgeColor="amber">
          <WalletGenerator />
        </Section>

        {/* Trust Lines */}
        <Section id="trustline" title="Establish Trust Line" badge="Template Only · Unsigned" badgeColor="amber">
          <TrustLineGuide />
        </Section>

        {/* Mint Console */}
        <Section id="mint" title="Mint Console" badge="Simulation · Unsigned Payloads Only" badgeColor="amber">
          <MintConsole />
        </Section>

        {/* Fund & Seed */}
        <Section id="fund" title="Funding Simulation" badge="Simulation Only · Treasury Disabled" badgeColor="amber">
          <FundSection />
        </Section>

        {/* Asset Verifier */}
        <Section id="verify" title="Verify Assets" badge="Live · XRPL Mainnet">
          <AssetVerifier />
        </Section>

        {/* Stellar System */}
        <section
          className="rounded-xl border border-sky-500/20 bg-[#03101c] p-6 md:p-8"
        >
          <div className="flex items-center justify-between border-b border-sky-500/15 pb-4 mb-6">
            <h2 className="text-sm font-mono uppercase tracking-[0.22em] text-sky-300">
              Stellar System
            </h2>
            <Tag color="blue">35 XLM Funded · Active</Tag>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div>
                <p className="text-[9px] font-mono uppercase tracking-widest text-slate-600 mb-1">
                  Stellar Treasury Address
                </p>
                <Mono className="text-[11px] text-sky-200 break-all leading-5">
                  {STELLAR_TREASURY}
                </Mono>
              </div>
              <div className="grid grid-cols-2 gap-3 text-[11px]">
                {[
                  { k: "Network", v: "Mainnet" },
                  { k: "Balance", v: "35 XLM" },
                  { k: "Horizon", v: "horizon.stellar.org" },
                  { k: "Mint Mode", v: "Simulation" },
                ].map(({ k, v }) => (
                  <div key={k} className="rounded border border-sky-500/10 bg-sky-950/20 p-2.5">
                    <p className="text-[9px] font-mono uppercase tracking-widest text-slate-600 mb-0.5">
                      {k}
                    </p>
                    <p className="font-mono text-sky-200">{v}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <p className="text-[9px] font-mono uppercase tracking-widest text-slate-600 mb-2">
                Stellar Capabilities
              </p>
              {[
                {
                  label: "changeTrust",
                  desc: "Establish trust line for issued Stellar assets. Required before receiving any non-native asset.",
                },
                {
                  label: "liquidityPoolDeposit",
                  desc: "Seed a Stellar constant-product AMM pool. Generates a simulation record only — no XLM is deposited from treasury. Live operations require Control Hub approval.",
                },
                {
                  label: "USDF Stablecoin Rails",
                  desc: "Connect TROPTIONS to the multi-chain USDF stablecoin settlement layer (XRPL + Stellar + Ethereum).",
                },
                {
                  label: "Payment Operations",
                  desc: "Send TROPT or XLM to any activated Stellar account. Simulation only — no treasury funds are transferred from this portal.",
                },
              ].map((f) => (
                <div key={f.label} className="flex gap-3 items-start">
                  <span className="w-1.5 h-1.5 rounded-full bg-sky-400 mt-1.5 shrink-0" />
                  <div>
                    <p className="text-xs font-mono text-sky-300">{f.label}</p>
                    <p className="text-[11px] text-slate-500 leading-5 mt-0.5">{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Token Ecosystem Overview */}
        <section className="rounded-xl border border-[#1a2535] bg-[#050f1c] p-6 md:p-8">
          <h2 className="text-sm font-mono uppercase tracking-[0.22em] text-[#f0cf82] mb-6 pb-4 border-b border-[#1a2535]">
            TROPTIONS Token Ecosystem
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                token: "TROPT",
                chain: "XRPL",
                type: "IOU / Trust Line",
                desc: "Primary tradeable asset. Requires TrustSet to receive.",
                color: "border-[#C9A84C]/30 bg-[#C9A84C]/5",
                labelColor: "text-[#f0cf82]",
              },
              {
                token: "TROPT MPT",
                chain: "XRPL",
                type: "XLS-33 Multi-Purpose",
                desc: "Next-gen fungible token. DEX-native, fee-enabled, escrow-capable.",
                color: "border-purple-500/30 bg-purple-500/5",
                labelColor: "text-purple-300",
              },
              {
                token: "TROPT NFT",
                chain: "XRPL",
                type: "NFTokenMint",
                desc: "Asset receipts, certificates, proof-of-ownership, real estate.",
                color: "border-emerald-500/30 bg-emerald-500/5",
                labelColor: "text-emerald-300",
              },
              {
                token: "TROPT LP",
                chain: "XRPL + Stellar",
                type: "AMM Liquidity Pool",
                desc: "XRP/TROPT AMM pool. DEX trading, price discovery, yield for LPs.",
                color: "border-sky-500/30 bg-sky-500/5",
                labelColor: "text-sky-300",
              },
            ].map((t) => (
              <div
                key={t.token}
                className={`rounded border ${t.color} p-4 space-y-2`}
              >
                <div className="flex items-start justify-between gap-1">
                  <p className={`text-sm font-mono font-semibold ${t.labelColor}`}>{t.token}</p>
                  <Tag color="gold">{t.chain}</Tag>
                </div>
                <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">
                  {t.type}
                </p>
                <p className="text-[11px] text-slate-400 leading-5">{t.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Scope of Service */}
        <section className="rounded-xl border border-[#1a2535] bg-[#050f1c] p-6 md:p-8">
          <h2 className="text-sm font-mono uppercase tracking-[0.22em] text-[#C9A84C] mb-4 pb-4 border-b border-[#1a2535]">
            Scope of Service
          </h2>
          <p className="text-sm text-slate-400 leading-7 max-w-3xl mb-6">
            TROPTIONS provides issuance, settlement, and verification infrastructure for digital
            assets on the XRP Ledger and Stellar network. TROPTIONS does not provide custody,
            redemption guarantees, price guarantees, or investment advice. Assets represent units
            of trade-based transactional value only. Market data is informational context only.
            Attestations do not include pricing, valuation, or yield.
          </p>
          <div className="grid sm:grid-cols-3 gap-6">
            {[
              {
                title: "XRPL Settlement",
                items: [
                  "Trust lines (TrustSet)",
                  "NFT issuance (NFTokenMint)",
                  "MPT / XLS-33 tokens",
                  "AMM pools (AMMCreate)",
                  "AMM deposits (AMMDeposit)",
                  "Treasury payments",
                ],
              },
              {
                title: "Stellar Settlement",
                items: [
                  "Change trust (changeTrust)",
                  "LP pool deposit",
                  "USDF stablecoin rails",
                  "Horizon API integration",
                  "35 XLM treasury funded",
                ],
              },
              {
                title: "Infrastructure",
                items: [
                  "Non-custodial wallet generation",
                  "On-chain asset verification",
                  "Multi-wallet architecture",
                  "Treasury management",
                  "Admin control plane",
                  "Simulation mode (public portal)",
                ],
              },
            ].map((col) => (
              <div key={col.title}>
                <p className="text-[10px] font-mono uppercase tracking-widest text-[#C9A84C] mb-3">
                  {col.title}
                </p>
                <ul className="space-y-1.5">
                  {col.items.map((item) => (
                    <li key={item} className="text-[11px] text-slate-400 flex gap-2 items-start">
                      <span className="text-[#C9A84C] mt-0.5">›</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* ── Footer ── */}
      <footer className="border-t border-[#0c1c2c] bg-[#01070f]">
        <div className="max-w-6xl mx-auto px-4 py-12 grid sm:grid-cols-3 gap-10">
          <div>
            <p className="text-[10px] font-mono uppercase tracking-[0.3em] text-[#C9A84C] mb-3">
              TROPTIONS
            </p>
            <p className="text-[11px] text-slate-500 leading-6">
              Digital asset settlement infrastructure.
              <br />
              XRPL + Stellar network.
              <br />
              Not a registered investment advisor.
              <br />
              Not FDIC insured.
            </p>
            <p className="text-[11px] text-slate-600 mt-4 leading-6">
              5655 Peachtree Parkway
              <br />
              Norcross, GA 30099
              <br />
              United States
            </p>
          </div>
          <div>
            <p className="text-[10px] font-mono uppercase tracking-widest text-slate-600 mb-3">Legal</p>
            <div className="space-y-2">
              {["Terms of Service", "Privacy Policy", "Risk Disclosure"].map((l) => (
                <p key={l} className="text-[11px] text-slate-600 cursor-pointer hover:text-slate-400 transition-colors">
                  {l}
                </p>
              ))}
            </div>
          </div>
          <div>
            <p className="text-[10px] font-mono uppercase tracking-widest text-slate-600 mb-3">System</p>
            <div className="space-y-2">
              <Link href="/portal/troptions/dashboard" className="block text-[11px] text-slate-600 hover:text-slate-400 transition-colors">
                Enter System Portal →
              </Link>
              <Link href="/admin/troptions/mint" className="block text-[11px] text-slate-600 hover:text-slate-400 transition-colors">
                Admin Mint Console →
              </Link>
              <Link href="/troptions" className="block text-[11px] text-slate-600 hover:text-slate-400 transition-colors">
                Platform Overview →
              </Link>
              <a href="https://xrpl.org" target="_blank" rel="noopener noreferrer" className="block text-[11px] text-slate-600 hover:text-slate-400 transition-colors">
                XRPL.org →
              </a>
              <a href="https://stellar.org" target="_blank" rel="noopener noreferrer" className="block text-[11px] text-slate-600 hover:text-slate-400 transition-colors">
                Stellar.org →
              </a>
            </div>
          </div>
        </div>
        <div className="border-t border-[#0c1c2c] px-4 py-4 max-w-6xl mx-auto">
          <p className="text-[10px] font-mono text-slate-700">
            © 2026 TROPTIONS. Trade-based transactional asset infrastructure. Not a registered
            investment advisor. Not FDIC insured. Assets do not represent ownership of any physical
            commodity or security.
          </p>
        </div>
      </footer>
    </div>
  );
}
