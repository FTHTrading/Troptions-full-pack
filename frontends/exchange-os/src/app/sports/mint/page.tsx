"use client";

import { useState } from "react";
import Link from "next/link";

const SOLANA_ENABLED =
  typeof process !== "undefined" &&
  !!(
    process.env.NEXT_PUBLIC_SOLANA_NETWORK
  );

export default function MintPage() {
  const [claimId, setClaimId] = useState("");
  const [wallet, setWallet] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [result, setResult] = useState<{ tx?: string; mint?: string } | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleMint(e: React.FormEvent) {
    e.preventDefault();
    if (!claimId.trim() || !wallet.trim()) {
      setError("Please enter your claim ID and wallet address.");
      return;
    }
    setStatus("loading");
    setError(null);

    // Demo mode: no SOLANA env
    if (!SOLANA_ENABLED) {
      setTimeout(() => {
        setResult({ tx: "demo_tx_" + Date.now(), mint: "demo_mint_" + Date.now() });
        setStatus("success");
      }, 1500);
      return;
    }

    try {
      const res = await fetch("/api/moments/mint", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ claim_id: claimId.trim(), wallet_address: wallet.trim() }),
      });
      const data = await res.json();
      if (data.ok) {
        setResult({ tx: data.tx_signature, mint: data.mint_address });
        setStatus("success");
      } else {
        setError(data.error ?? "Mint failed.");
        setStatus("error");
      }
    } catch {
      setError("Network error. Please try again.");
      setStatus("error");
    }
  }

  return (
    <div className="min-h-screen bg-[#071426] flex items-center justify-center px-6 py-16">
      <div className="max-w-md w-full">
        <div className="text-center mb-10">
          <p className="text-[#c99a3c] text-xs font-semibold uppercase tracking-[0.25em] mb-4">
            TROPTIONS Moments — Solana Mint
          </p>
          <h1 className="text-4xl font-bold text-white mb-4">Mint to Solana</h1>
          <p className="text-[#8a94a6] leading-relaxed">
            Connect your claim to the blockchain. Optional — your Moment is already yours after claiming.
          </p>
        </div>

        {!SOLANA_ENABLED && (
          <div className="border border-[#c99a3c]/30 bg-[#c99a3c]/5 px-5 py-4 mb-6 text-center">
            <p className="text-[#c99a3c] text-xs font-semibold uppercase tracking-widest mb-1">Demo Mode</p>
            <p className="text-[#8a94a6] text-sm">Solana mainnet not configured. Mints are simulated for demo purposes.</p>
          </div>
        )}

        {status === "success" ? (
          <div className="border border-[#c99a3c]/40 bg-[#0b1f36] p-8 text-center">
            <p className="text-green-400 text-xs font-semibold uppercase tracking-widest mb-3">
              {SOLANA_ENABLED ? "Minted" : "Demo Mint Recorded"}
            </p>
            <h2 className="text-2xl font-bold text-white mb-5">Your Moment is on-chain.</h2>
            {result?.tx && (
              <div className="bg-[#071426] px-4 py-3 mb-3 text-left">
                <p className="text-[#8a94a6] text-xs mb-1">Transaction</p>
                <p className="text-white text-xs font-mono break-all">{result.tx}</p>
              </div>
            )}
            {result?.mint && (
              <div className="bg-[#071426] px-4 py-3 mb-5 text-left">
                <p className="text-[#8a94a6] text-xs mb-1">Mint Address</p>
                <p className="text-white text-xs font-mono break-all">{result.mint}</p>
              </div>
            )}
            <Link
              href="/sports/moments"
              className="inline-block px-6 py-3 border border-[#c99a3c]/40 text-[#c99a3c] font-semibold text-sm uppercase tracking-wider hover:border-[#c99a3c] transition-colors"
            >
              View All Moments
            </Link>
          </div>
        ) : (
          <form onSubmit={handleMint} className="border border-white/10 bg-[#0b1f36] p-8">
            <div className="mb-4">
              <label className="text-[#8a94a6] text-xs font-semibold uppercase tracking-wider block mb-2">
                Claim ID
              </label>
              <input
                type="text"
                placeholder="From your claim confirmation"
                value={claimId}
                onChange={(e) => setClaimId(e.target.value)}
                className="w-full bg-[#071426] border border-white/10 text-white placeholder-[#8a94a6] px-4 py-3 text-sm focus:outline-none focus:border-[#c99a3c]/60"
              />
            </div>
            <div className="mb-5">
              <label className="text-[#8a94a6] text-xs font-semibold uppercase tracking-wider block mb-2">
                Solana Wallet Address
              </label>
              <input
                type="text"
                placeholder="Your Solana public key"
                value={wallet}
                onChange={(e) => setWallet(e.target.value)}
                className="w-full bg-[#071426] border border-white/10 text-white placeholder-[#8a94a6] px-4 py-3 text-sm font-mono focus:outline-none focus:border-[#c99a3c]/60"
              />
            </div>
            {error && <p className="text-red-400 text-sm mb-4">{error}</p>}
            <button
              type="submit"
              disabled={status === "loading"}
              className="w-full py-3.5 bg-[#c99a3c] text-[#071426] font-semibold text-sm uppercase tracking-wider hover:bg-[#f0cf82] transition-colors disabled:opacity-50"
            >
              {status === "loading" ? "Minting..." : "Mint My Moment"}
            </button>
            <p className="text-[#8a94a6] text-xs text-center mt-4">
              Standard Solana network fees apply. TROPTIONS does not charge additional mint fees.
            </p>
          </form>
        )}

        <div className="mt-8 border border-white/5 bg-[#0b1f36] p-5">
          <p className="text-[#8a94a6] text-xs leading-relaxed">
            <strong className="text-white">TROPTIONS Moments</strong> are digital collectibles and fan-reward badges. They are not investment products and do not represent financial instruments or securities. Solana minting is a digital record feature, not an investment offer.
          </p>
        </div>
      </div>
    </div>
  );
}
