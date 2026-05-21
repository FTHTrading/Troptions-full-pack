"use client";

import React, { useState } from "react";

type Chain = "xrpl" | "stellar";
type Tab = "tradeline" | "nft" | "lp-token" | "mpt" | "fund";

interface MintResult {
  ok: boolean;
  mode: string;
  chain: string;
  txHash?: string;
  txType?: string;
  ledgerIndex?: number;
  simulatedData?: Record<string, unknown>;
  error?: string;
  timestamp: string;
}

// ─── Shared UI primitives ─────────────────────────────────────────────────────

function Label({ children }: { children: React.ReactNode }) {
  return <label className="block text-xs font-mono uppercase tracking-widest text-[#C9A84C] mb-1">{children}</label>;
}

function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className="w-full bg-[#111] border border-[#2a2a2a] rounded-md px-3 py-2 text-sm text-white focus:outline-none focus:border-[#C9A84C] placeholder-slate-600"
    />
  );
}

function Select(props: React.SelectHTMLAttributes<HTMLSelectElement> & { children: React.ReactNode }) {
  const { children, ...rest } = props;
  return (
    <select
      {...rest}
      className="w-full bg-[#111] border border-[#2a2a2a] rounded-md px-3 py-2 text-sm text-white focus:outline-none focus:border-[#C9A84C]"
    >
      {children}
    </select>
  );
}

function SubmitButton({ loading, label }: { loading: boolean; label: string }) {
  return (
    <button
      type="submit"
      disabled={loading}
      className="mt-4 px-6 py-2.5 rounded-md bg-[#C9A84C] text-black font-semibold text-sm disabled:opacity-50 hover:bg-yellow-400 transition-colors"
    >
      {loading ? "Submitting…" : label}
    </button>
  );
}

function ResultPanel({ result }: { result: MintResult | null }) {
  if (!result) return null;
  const bg = result.ok ? "border-emerald-600/40 bg-emerald-950/30" : "border-red-600/40 bg-red-950/30";
  return (
    <div className={`mt-6 rounded-lg border p-4 ${bg}`}>
      <p className={`text-sm font-semibold mb-2 ${result.ok ? "text-emerald-400" : "text-red-400"}`}>
        {result.ok ? "✓ Success" : "✗ Failed"} — {result.mode.toUpperCase()} on {result.chain?.toUpperCase()}
      </p>
      {result.txHash && (
        <p className="text-xs text-slate-300 font-mono mb-1">Hash: {result.txHash}</p>
      )}
      {result.txType && (
        <p className="text-xs text-slate-400 mb-1">Tx Type: {result.txType}</p>
      )}
      {result.error && (
        <p className="text-xs text-red-300 mt-1">{result.error}</p>
      )}
      {result.simulatedData && (
        <pre className="mt-2 text-xs text-slate-400 overflow-x-auto">
          {JSON.stringify(result.simulatedData, null, 2)}
        </pre>
      )}
      <p className="text-xs text-slate-600 mt-2">{result.timestamp}</p>
    </div>
  );
}

// ─── Tradeline Tab ────────────────────────────────────────────────────────────

function TradelineForm() {
  const [chain, setChain] = useState<Chain>("xrpl");
  const [assetCode, setAssetCode] = useState("TROPT");
  const [issuerAddress, setIssuerAddress] = useState("");
  const [limitAmount, setLimitAmount] = useState("1000000");
  const [memo, setMemo] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<MintResult | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    try {
      const resp = await fetch("/api/troptions/mint/tradeline", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chain, assetCode, issuerAddress, limitAmount, memo: memo || undefined }),
      });
      setResult(await resp.json());
    } catch (err) {
      setResult({ ok: false, mode: "unknown", chain, error: String(err), timestamp: new Date().toISOString() });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label>Chain</Label>
        <Select value={chain} onChange={(e) => setChain(e.target.value as Chain)}>
          <option value="xrpl">XRPL</option>
          <option value="stellar">Stellar</option>
        </Select>
      </div>
      <div>
        <Label>Asset Code (e.g. TROPT, GOLD, USD)</Label>
        <Input value={assetCode} onChange={(e) => setAssetCode(e.target.value)} placeholder="TROPT" required />
      </div>
      <div>
        <Label>Issuer Address</Label>
        <Input
          value={issuerAddress}
          onChange={(e) => setIssuerAddress(e.target.value)}
          placeholder={chain === "xrpl" ? "r..." : "G..."}
          required
        />
      </div>
      <div>
        <Label>Trust Limit</Label>
        <Input
          type="number"
          value={limitAmount}
          onChange={(e) => setLimitAmount(e.target.value)}
          placeholder="1000000"
          min="1"
          required
        />
      </div>
      <div>
        <Label>Memo (optional)</Label>
        <Input value={memo} onChange={(e) => setMemo(e.target.value)} placeholder="Troptions tradeline — series A" />
      </div>
      <SubmitButton loading={loading} label="Set Trustline (Tradeline)" />
      <ResultPanel result={result} />
    </form>
  );
}

// ─── NFT Tab ──────────────────────────────────────────────────────────────────

function NftForm() {
  const [name, setName] = useState("");
  const [uri, setUri] = useState("");
  const [taxon, setTaxon] = useState(0);
  const [transferFee, setTransferFee] = useState(0);
  const [transferable, setTransferable] = useState(true);
  const [burnable, setBurnable] = useState(false);
  const [memo, setMemo] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<MintResult | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    try {
      const resp = await fetch("/api/troptions/mint/nft", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, uri, taxon, transferFee, transferable, burnable, memo: memo || undefined }),
      });
      setResult(await resp.json());
    } catch (err) {
      setResult({ ok: false, mode: "unknown", chain: "xrpl", error: String(err), timestamp: new Date().toISOString() });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <p className="text-xs text-slate-500 font-mono">XRPL only — NFTokenMint</p>
      <div>
        <Label>NFT Name</Label>
        <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Troptions Gold Certificate #1" required />
      </div>
      <div>
        <Label>Metadata URI (IPFS / HTTPS)</Label>
        <Input value={uri} onChange={(e) => setUri(e.target.value)} placeholder="ipfs://Qm..." required />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Taxon (collection ID)</Label>
          <Input type="number" value={taxon} onChange={(e) => setTaxon(Number(e.target.value))} min="0" required />
        </div>
        <div>
          <Label>Transfer Fee (0–50000 bps)</Label>
          <Input type="number" value={transferFee} onChange={(e) => setTransferFee(Number(e.target.value))} min="0" max="50000" />
        </div>
      </div>
      <div className="flex gap-6">
        <label className="flex items-center gap-2 text-sm text-slate-300 cursor-pointer">
          <input type="checkbox" checked={transferable} onChange={(e) => setTransferable(e.target.checked)} className="accent-yellow-400" />
          Transferable
        </label>
        <label className="flex items-center gap-2 text-sm text-slate-300 cursor-pointer">
          <input type="checkbox" checked={burnable} onChange={(e) => setBurnable(e.target.checked)} className="accent-yellow-400" />
          Burnable by Issuer
        </label>
      </div>
      <div>
        <Label>Memo (optional)</Label>
        <Input value={memo} onChange={(e) => setMemo(e.target.value)} placeholder="Troptions NFT issuance" />
      </div>
      <SubmitButton loading={loading} label="Mint NFT on XRPL" />
      <ResultPanel result={result} />
    </form>
  );
}

// ─── MPT Tab (XLS-33 Multi-Purpose Token) ────────────────────────────────────

function MptForm() {
  const [name, setName] = useState("");
  const [ticker, setTicker] = useState("TROPT");
  const [maxSupply, setMaxSupply] = useState("1000000000000");
  const [assetScale, setAssetScale] = useState(6);
  const [transferFee, setTransferFee] = useState(0);
  const [transferable, setTransferable] = useState(true);
  const [tradeable, setTradeable] = useState(true);
  const [clawback, setClawback] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<MintResult | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    try {
      const resp = await fetch("/api/troptions/mint/mpt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, ticker, maxSupply, assetScale, transferFee, transferable, tradeable, clawback }),
      });
      setResult(await resp.json());
    } catch (err) {
      setResult({ ok: false, mode: "unknown", chain: "xrpl", error: String(err), timestamp: new Date().toISOString() });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <p className="text-xs text-slate-500 font-mono">XRPL only — MPTokenIssuanceCreate (XLS-33)</p>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Token Name</Label>
          <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Troptions Gold MPT" required />
        </div>
        <div>
          <Label>Ticker Symbol</Label>
          <Input value={ticker} onChange={(e) => setTicker(e.target.value)} placeholder="TROPT" required />
        </div>
      </div>
      <div className="grid grid-cols-3 gap-4">
        <div>
          <Label>Max Supply (integer string)</Label>
          <Input value={maxSupply} onChange={(e) => setMaxSupply(e.target.value)} placeholder="1000000000000" required />
        </div>
        <div>
          <Label>Asset Scale (decimals 0–15)</Label>
          <Input type="number" value={assetScale} onChange={(e) => setAssetScale(Number(e.target.value))} min="0" max="15" required />
        </div>
        <div>
          <Label>Transfer Fee (0–50000 bps)</Label>
          <Input type="number" value={transferFee} onChange={(e) => setTransferFee(Number(e.target.value))} min="0" max="50000" />
        </div>
      </div>
      <div className="flex gap-6">
        <label className="flex items-center gap-2 text-sm text-slate-300 cursor-pointer">
          <input type="checkbox" checked={transferable} onChange={(e) => setTransferable(e.target.checked)} className="accent-yellow-400" />
          Transferable (tfMPTCanTransfer)
        </label>
        <label className="flex items-center gap-2 text-sm text-slate-300 cursor-pointer">
          <input type="checkbox" checked={tradeable} onChange={(e) => setTradeable(e.target.checked)} className="accent-yellow-400" />
          DEX Tradeable (tfMPTCanTrade)
        </label>
        <label className="flex items-center gap-2 text-sm text-slate-300 cursor-pointer">
          <input type="checkbox" checked={clawback} onChange={(e) => setClawback(e.target.checked)} className="accent-red-400" />
          Clawback (tfMPTCanClawback)
        </label>
      </div>
      <SubmitButton loading={loading} label="Create MPT Issuance" />
      <ResultPanel result={result} />
    </form>
  );
}

// ─── Fund Tab (Payment + AMMDeposit) ─────────────────────────────────────────

const PRESET_WALLETS = [
  { label: "Minted Wallet 1", address: "r4upY8eDdmQbdAbRTEVfuuz6AywBiitYij" },
  { label: "Minted Wallet 2", address: "rHwhVUciEBBWJxVUeAaagLcdyWtpcath54" },
];

function FundWalletForm() {
  const [toAddress, setToAddress] = useState(PRESET_WALLETS[0].address);
  const [amountXrp, setAmountXrp] = useState("2");
  const [memo, setMemo] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<MintResult | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    try {
      const resp = await fetch("/api/troptions/fund/wallet", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ toAddress, amountXrp, memo: memo || undefined }),
      });
      setResult(await resp.json());
    } catch (err) {
      setResult({ ok: false, mode: "unknown", chain: "xrpl", error: String(err), timestamp: new Date().toISOString() });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <p className="text-xs text-slate-500 font-mono">XRP Payment from treasury to a sub-wallet (activation or top-up)</p>
      <div>
        <Label>Destination Address</Label>
        <Select value={toAddress} onChange={(e) => setToAddress(e.target.value)}>
          {PRESET_WALLETS.map((w) => (
            <option key={w.address} value={w.address}>{w.label} — {w.address}</option>
          ))}
          <option value="custom">Custom address…</option>
        </Select>
        {toAddress === "custom" && (
          <Input className="mt-2" placeholder="r..." onChange={(e) => setToAddress(e.target.value)} required />
        )}
      </div>
      <div>
        <Label>Amount (XRP)</Label>
        <Input type="number" value={amountXrp} onChange={(e) => setAmountXrp(e.target.value)} min="0.000001" step="0.1" required />
        <p className="text-xs text-slate-600 mt-1">Min 2 XRP to activate a new account. Treasury has ~10.99 XRP.</p>
      </div>
      <div>
        <Label>Memo (optional)</Label>
        <Input value={memo} onChange={(e) => setMemo(e.target.value)} placeholder="Troptions wallet seed" />
      </div>
      <SubmitButton loading={loading} label="Send XRP" />
      <ResultPanel result={result} />
    </form>
  );
}

function AmmDepositForm() {
  const [asset1Currency, setAsset1Currency] = useState("XRP");
  const [asset1Issuer, setAsset1Issuer] = useState("");
  const [asset2Currency, setAsset2Currency] = useState("TROPT");
  const [asset2Issuer, setAsset2Issuer] = useState("rHwhVUciEBBWJxVUeAaagLcdyWtpcath54");
  const [amount1, setAmount1] = useState("10");
  const [amount2, setAmount2] = useState("1000");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<MintResult | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    try {
      const resp = await fetch("/api/troptions/fund/amm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          asset1: { currency: asset1Currency, issuer: asset1Issuer || undefined },
          asset2: { currency: asset2Currency, issuer: asset2Issuer || undefined },
          amount1,
          amount2,
        }),
      });
      setResult(await resp.json());
    } catch (err) {
      setResult({ ok: false, mode: "unknown", chain: "xrpl", error: String(err), timestamp: new Date().toISOString() });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <p className="text-xs text-slate-500 font-mono">AMMDeposit — add liquidity to an existing XRPL AMM pool</p>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Asset 1 Currency</Label>
          <Input value={asset1Currency} onChange={(e) => setAsset1Currency(e.target.value)} placeholder="XRP" required />
        </div>
        <div>
          <Label>Asset 1 Issuer (blank for XRP)</Label>
          <Input value={asset1Issuer} onChange={(e) => setAsset1Issuer(e.target.value)} placeholder="r..." />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Asset 2 Currency</Label>
          <Input value={asset2Currency} onChange={(e) => setAsset2Currency(e.target.value)} placeholder="TROPT" required />
        </div>
        <div>
          <Label>Asset 2 Issuer</Label>
          <Input value={asset2Issuer} onChange={(e) => setAsset2Issuer(e.target.value)} placeholder="r..." />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Amount 1</Label>
          <Input type="number" value={amount1} onChange={(e) => setAmount1(e.target.value)} min="0" required />
        </div>
        <div>
          <Label>Amount 2</Label>
          <Input type="number" value={amount2} onChange={(e) => setAmount2(e.target.value)} min="0" required />
        </div>
      </div>
      <SubmitButton loading={loading} label="Deposit into AMM Pool" />
      <ResultPanel result={result} />
    </form>
  );
}

// ─── LP Token Tab ─────────────────────────────────────────────────────────────

function LpTokenForm() {
  const [chain, setChain] = useState<Chain>("xrpl");
  const [asset1Currency, setAsset1Currency] = useState("XRP");
  const [asset1Issuer, setAsset1Issuer] = useState("");
  const [asset2Currency, setAsset2Currency] = useState("TROPT");
  const [asset2Issuer, setAsset2Issuer] = useState("");
  const [amount1, setAmount1] = useState("100");
  const [amount2, setAmount2] = useState("10000");
  const [tradingFee, setTradingFee] = useState(30);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<MintResult | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    try {
      const resp = await fetch("/api/troptions/mint/lp-token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chain,
          asset1: { currency: asset1Currency, issuer: asset1Issuer || undefined },
          asset2: { currency: asset2Currency, issuer: asset2Issuer || undefined },
          amount1,
          amount2,
          tradingFee,
        }),
      });
      setResult(await resp.json());
    } catch (err) {
      setResult({ ok: false, mode: "unknown", chain, error: String(err), timestamp: new Date().toISOString() });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label>Chain</Label>
        <Select value={chain} onChange={(e) => setChain(e.target.value as Chain)}>
          <option value="xrpl">XRPL (AMM)</option>
          <option value="stellar">Stellar (Liquidity Pool)</option>
        </Select>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Asset 1 Currency</Label>
          <Input value={asset1Currency} onChange={(e) => setAsset1Currency(e.target.value)} placeholder="XRP" required />
        </div>
        <div>
          <Label>Asset 1 Issuer (leave blank for XRP/XLM)</Label>
          <Input value={asset1Issuer} onChange={(e) => setAsset1Issuer(e.target.value)} placeholder="r... or G..." />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Asset 2 Currency</Label>
          <Input value={asset2Currency} onChange={(e) => setAsset2Currency(e.target.value)} placeholder="TROPT" required />
        </div>
        <div>
          <Label>Asset 2 Issuer</Label>
          <Input value={asset2Issuer} onChange={(e) => setAsset2Issuer(e.target.value)} placeholder="r... or G..." required={asset2Currency !== "XRP" && asset2Currency !== "native"} />
        </div>
      </div>
      <div className="grid grid-cols-3 gap-4">
        <div>
          <Label>Amount 1</Label>
          <Input type="number" value={amount1} onChange={(e) => setAmount1(e.target.value)} min="0" required />
        </div>
        <div>
          <Label>Amount 2</Label>
          <Input type="number" value={amount2} onChange={(e) => setAmount2(e.target.value)} min="0" required />
        </div>
        <div>
          <Label>Trading Fee (bps 0–1000)</Label>
          <Input type="number" value={tradingFee} onChange={(e) => setTradingFee(Number(e.target.value))} min="0" max="1000" />
        </div>
      </div>
      <SubmitButton loading={loading} label="Create LP Pool" />
      <ResultPanel result={result} />
    </form>
  );
}

// ─── Page ──────────────────────────────────────────────────────────────────────

export default function MintDashboardPage() {
  const [activeTab, setActiveTab] = useState<Tab>("tradeline");
  const [fundSubTab, setFundSubTab] = useState<"wallet" | "amm">("wallet");

  const tabs: { id: Tab; label: string }[] = [
    { id: "tradeline", label: "Tradelines" },
    { id: "nft", label: "NFTs" },
    { id: "lp-token", label: "LP Tokens" },
    { id: "mpt", label: "MPT (XLS-33)" },
    { id: "fund", label: "Fund & Seed" },
  ];

  return (
    <main className="min-h-screen bg-[#0A0A0A] text-white">
      <div className="mx-auto max-w-4xl px-6 py-16 space-y-8">
        {/* Header */}
        <header className="space-y-2">
          <p className="font-mono text-xs uppercase tracking-widest text-[#C9A84C]">
            Admin — Troptions Minting
          </p>
          <h1 className="text-4xl font-bold">Mint Console</h1>
          <p className="text-sm text-slate-400 leading-6 max-w-2xl">
            Issue tradelines (trustlines), mint NFTs, and create AMM / liquidity pools
            on XRPL and Stellar. Controlled by{" "}
            <code className="text-yellow-400 text-xs">TROPTIONS_XRPL_MINT_MODE</code> and{" "}
            <code className="text-yellow-400 text-xs">TROPTIONS_STELLAR_MINT_MODE</code> env flags.
          </p>
        </header>

        {/* Mode badges */}
        <div className="flex gap-3">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#1a1a1a] border border-[#2a2a2a] px-3 py-1 text-xs font-mono">
            <span className="h-2 w-2 rounded-full bg-yellow-400" />
            XRPL: {process.env.NEXT_PUBLIC_XRPL_MODE ?? "simulation"}
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#1a1a1a] border border-[#2a2a2a] px-3 py-1 text-xs font-mono">
            <span className="h-2 w-2 rounded-full bg-blue-400" />
            Stellar: {process.env.NEXT_PUBLIC_STELLAR_MODE ?? "simulation"}
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#1a1a1a] border border-[#2a2a2a] px-3 py-1 text-xs font-mono text-emerald-400">
            XRPL Treasury: 10.99 XRP ✓
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#1a1a1a] border border-[#2a2a2a] px-3 py-1 text-xs font-mono text-amber-400">
            Stellar: needs activation
          </span>
        </div>

        {/* Tabs */}
        <div className="border-b border-[#2a2a2a]">
          <div className="flex gap-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-5 py-2.5 text-sm font-medium rounded-t-md transition-colors ${
                  activeTab === tab.id
                    ? "bg-[#1a1a1a] text-[#C9A84C] border-t border-l border-r border-[#2a2a2a]"
                    : "text-slate-500 hover:text-slate-300"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab content */}
        <div className="bg-[#0f0f0f] border border-[#1e1e1e] rounded-xl p-6">
          {activeTab === "tradeline" && (
            <section>
              <h2 className="text-lg font-semibold mb-1">Set Trustline (Tradeline)</h2>
              <p className="text-xs text-slate-500 mb-6">
                Creates a trust line on XRPL (TrustSet) or Stellar (changeTrust) — establishing
                a tradeline for any issued asset like TROPT, GOLD, or USD.
              </p>
              <TradelineForm />
            </section>
          )}
          {activeTab === "nft" && (
            <section>
              <h2 className="text-lg font-semibold mb-1">Mint NFToken (XRPL)</h2>
              <p className="text-xs text-slate-500 mb-6">
                Issues an NFToken on XRPL via the treasury wallet using NFTokenMint.
                Supports transferable, burnable, and royalty-bearing tokens.
              </p>
              <NftForm />
            </section>
          )}
          {activeTab === "lp-token" && (
            <section>
              <h2 className="text-lg font-semibold mb-1">Create LP Pool</h2>
              <p className="text-xs text-slate-500 mb-6">
                Creates an Automated Market Maker pool (XRPL AMMCreate) or a Stellar
                constant-product liquidity pool. Provide the initial asset pair and amounts.
              </p>
              <LpTokenForm />
            </section>
          )}
          {activeTab === "mpt" && (
            <section>
              <h2 className="text-lg font-semibold mb-1">Create MPT Issuance (XLS-33)</h2>
              <p className="text-xs text-slate-500 mb-6">
                Issues a Multi-Purpose Token on XRPL — a next-gen fungible token standard
                (XLS-33d). More efficient than IOUs. Supports transfer fees, DEX trading,
                clawback, and escrow flags.
              </p>
              <MptForm />
            </section>
          )}
          {activeTab === "fund" && (
            <section>
              <h2 className="text-lg font-semibold mb-1">Fund &amp; Seed</h2>
              <p className="text-xs text-slate-500 mb-4">
                Send XRP from the treasury to sub-wallets, or deposit additional liquidity
                into an existing XRPL AMM pool.
              </p>
              <div className="flex gap-2 mb-6">
                <button
                  onClick={() => setFundSubTab("wallet")}
                  className={`px-4 py-1.5 rounded-md text-xs font-mono transition-colors ${
                    fundSubTab === "wallet" ? "bg-[#C9A84C] text-black" : "bg-[#1a1a1a] text-slate-400 hover:text-white"
                  }`}
                >
                  Wallet Funding
                </button>
                <button
                  onClick={() => setFundSubTab("amm")}
                  className={`px-4 py-1.5 rounded-md text-xs font-mono transition-colors ${
                    fundSubTab === "amm" ? "bg-[#C9A84C] text-black" : "bg-[#1a1a1a] text-slate-400 hover:text-white"
                  }`}
                >
                  AMM Deposit
                </button>
              </div>
              {fundSubTab === "wallet" && <FundWalletForm />}
              {fundSubTab === "amm" && <AmmDepositForm />}
            </section>
          )}
        </div>

        {/* Info box */}
        <div className="rounded-lg border border-[#2a2a2a] bg-[#111] p-5 text-sm text-slate-400 space-y-2">
          <p className="font-semibold text-white text-xs font-mono uppercase tracking-wider">Treasury Addresses</p>
          <p>
            XRPL:{" "}
            <code className="text-yellow-300 text-xs">rPF2M1QjdVh1hkNgmMMTkT9qMU7tA7Wds3</code>
            <span className="text-emerald-400 text-xs ml-2">● 10.99 XRP funded</span>
          </p>
          <p>
            Stellar:{" "}
            <code className="text-blue-300 text-xs">GCOTXN75SHALV4NIV2V4EBACXRMLAMU5J2MYLOGUJOLIA5HOO4DEYCLK</code>
            <span className="text-amber-400 text-xs ml-2">● Send 5+ XLM to activate</span>
          </p>
          <p className="text-xs text-slate-600 pt-1">
            To go live: set <code className="text-slate-400">TROPTIONS_XRPL_MINT_MODE=live</code> in{" "}
            <code className="text-slate-400">.env.local</code>
          </p>
        </div>
      </div>
    </main>
  );
}
