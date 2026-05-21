"use client";

import { useState } from "react";
import Link from "next/link";

export default function ClaimEntryPage() {
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [checking, setChecking] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = code.trim().toUpperCase();
    if (!trimmed) { setError("Please enter a claim code."); return; }
    setChecking(true);
    setError(null);
    try {
      const res = await fetch("/api/moments");
      const data = await res.json();
      if (!data.ok) { setError("Could not verify code. Try again."); setChecking(false); return; }
      const found = data.moments.find(
        (m: { claim_code: string }) => m.claim_code.toUpperCase() === trimmed,
      );
      if (!found) { setError("Invalid claim code. Check the QR or ask your venue."); setChecking(false); return; }
      window.location.href = `/sports/claim/${trimmed}`;
    } catch {
      setError("Network error. Please try again.");
      setChecking(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#071426] flex items-center justify-center px-6">
      <div className="max-w-md w-full">
        <div className="text-center mb-10">
          <p className="text-[#c99a3c] text-xs font-semibold uppercase tracking-[0.25em] mb-4">
            TROPTIONS Moments
          </p>
          <h1 className="text-4xl font-bold text-white mb-4">Enter Claim Code</h1>
          <p className="text-[#8a94a6] leading-relaxed">
            Got a code from a QR scan, TROPTIONS TV, or a venue? Enter it below to claim your moment.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="border border-white/10 bg-[#0b1f36] p-8">
          <input
            type="text"
            placeholder="e.g. CITY2026"
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            maxLength={24}
            className="w-full bg-[#071426] border border-white/10 text-white placeholder-[#8a94a6] px-4 py-3 text-lg font-mono tracking-wider focus:outline-none focus:border-[#c99a3c]/60 mb-4 uppercase"
          />
          {error && <p className="text-red-400 text-sm mb-4">{error}</p>}
          <button
            type="submit"
            disabled={checking}
            className="w-full py-3.5 bg-[#c99a3c] text-[#071426] font-semibold text-sm uppercase tracking-wider hover:bg-[#f0cf82] transition-colors disabled:opacity-50"
          >
            {checking ? "Checking..." : "Find My Moment"}
          </button>
        </form>

        <p className="text-center mt-8">
          <Link href="/sports/moments" className="text-[#c99a3c] text-sm font-semibold uppercase tracking-wider hover:text-white transition-colors">
            Browse All Active Drops
          </Link>
        </p>
      </div>
    </div>
  );
}
