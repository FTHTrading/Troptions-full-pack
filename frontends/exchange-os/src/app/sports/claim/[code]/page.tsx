"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

interface Moment {
  id: string;
  slug: string;
  type: string;
  title: string;
  description: string;
  reward: string | null;
  supply_claimed: number;
  supply_total: number;
  mint_enabled: boolean;
  charity_name?: string;
  sponsor_name?: string;
}

const TYPE_LABEL: Record<string, string> = {
  fan_badge: "Fan Badge",
  restaurant_badge: "Restaurant Reward",
  sponsor_drop: "Sponsor Drop",
  charity_badge: "Charity Badge",
  artist_poster: "Artist Poster",
  tv_drop: "TROPTIONS TV Drop",
  vip_pass: "VIP Pass",
  proof_receipt: "Proof Receipt",
};

export default function ClaimPage() {
  const params = useParams();
  const router = useRouter();
  const code = typeof params.code === "string" ? params.code.toUpperCase() : "";

  const [moment, setMoment] = useState<Moment | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [identifier, setIdentifier] = useState("");
  const [idType, setIdType] = useState<"phone" | "email">("phone");

  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [claimId, setClaimId] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Load moment list and find by claim code
  useEffect(() => {
    if (!code) return;
    fetch("/api/moments")
      .then((r) => r.json())
      .then((data) => {
        if (!data.ok) { setLoadError("Could not load moments."); return; }
        const found = (data.moments as Array<Moment & { claim_code: string }>).find(
          (m) => m.claim_code.toUpperCase() === code,
        );
        if (!found) setLoadError("This claim code is not valid or the drop has ended.");
        else setMoment(found);
      })
      .catch(() => setLoadError("Network error. Please try again."));
  }, [code]);

  async function handleClaim() {
    if (!identifier.trim()) { setErrorMsg("Please enter your phone or email."); return; }
    setStatus("loading");
    setErrorMsg(null);
    try {
      const body: Record<string, string> = { claim_code: code };
      if (idType === "phone") body.phone = identifier.trim();
      else body.email = identifier.trim();

      const res = await fetch("/api/moments/claim", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (data.ok) {
        setClaimId(data.claim_id);
        setStatus("success");
      } else {
        setErrorMsg(data.error ?? "Claim failed. Please try again.");
        setStatus("error");
      }
    } catch {
      setErrorMsg("Network error. Please try again.");
      setStatus("error");
    }
  }

  if (loadError) {
    return (
      <div className="min-h-screen bg-[#071426] flex items-center justify-center px-6">
        <div className="text-center max-w-md">
          <p className="text-[#c99a3c] text-xs font-semibold uppercase tracking-widest mb-4">Claim Code: {code}</p>
          <p className="text-white text-2xl font-bold mb-4">Drop Not Found</p>
          <p className="text-[#8a94a6] mb-8">{loadError}</p>
          <Link href="/sports/moments" className="text-[#c99a3c] text-sm font-semibold uppercase tracking-wider hover:text-white transition-colors">
            View All Moments
          </Link>
        </div>
      </div>
    );
  }

  if (!moment) {
    return (
      <div className="min-h-screen bg-[#071426] flex items-center justify-center">
        <p className="text-[#8a94a6] text-sm">Loading...</p>
      </div>
    );
  }

  if (status === "success") {
    return (
      <div className="min-h-screen bg-[#071426] flex items-center justify-center px-6">
        <div className="max-w-md w-full text-center">
          <div className="border border-[#c99a3c]/40 bg-[#0b1f36] p-10">
            <p className="text-green-400 text-xs font-semibold uppercase tracking-widest mb-3">Claimed</p>
            <h1 className="text-3xl font-bold text-white mb-3">{moment.title}</h1>
            <p className="text-[#8a94a6] text-sm mb-6">
              {TYPE_LABEL[moment.type] ?? moment.type}
            </p>
            {moment.reward && (
              <div className="border border-[#c99a3c]/30 bg-[#c99a3c]/5 px-5 py-4 mb-6 text-left">
                <p className="text-[#c99a3c] text-xs font-semibold uppercase tracking-widest mb-1">Your Reward</p>
                <p className="text-white font-medium">{moment.reward}</p>
              </div>
            )}
            <p className="text-[#8a94a6] text-xs mb-6">Claim ID: <span className="font-mono text-white">{claimId}</span></p>
            <div className="space-y-3">
              {moment.mint_enabled && (
                <Link
                  href="/sports/mint"
                  className="block w-full text-center px-6 py-3 bg-[#c99a3c] text-[#071426] font-semibold text-sm uppercase tracking-wider hover:bg-[#f0cf82] transition-colors"
                >
                  Mint to Solana (Optional)
                </Link>
              )}
              <Link
                href="/sports/moments"
                className="block w-full text-center px-6 py-3 border border-white/10 text-[#8a94a6] text-sm font-semibold uppercase tracking-wider hover:border-white/30 hover:text-white transition-colors"
              >
                View All Moments
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const soldOut = moment.supply_claimed >= moment.supply_total;

  return (
    <div className="min-h-screen bg-[#071426] flex items-center justify-center px-6 py-16">
      <div className="max-w-md w-full">
        <p className="text-[#c99a3c] text-xs font-semibold uppercase tracking-widest mb-6 text-center">
          Claim Your Moment
        </p>

        <div className="border border-[#c99a3c]/30 bg-[#0b1f36] p-8 mb-6">
          <span className="text-[#c99a3c] text-xs font-semibold uppercase tracking-widest">
            {TYPE_LABEL[moment.type] ?? moment.type}
          </span>
          <h2 className="text-2xl font-bold text-white mt-2 mb-3">{moment.title}</h2>
          <p className="text-[#8a94a6] text-sm leading-relaxed mb-4">{moment.description}</p>
          {moment.reward && (
            <div className="border-t border-white/5 pt-4">
              <p className="text-[#c99a3c] text-xs font-semibold uppercase tracking-widest mb-1">Reward</p>
              <p className="text-white text-sm">{moment.reward}</p>
            </div>
          )}
          {moment.charity_name && (
            <div className="border-t border-white/5 pt-4 mt-4">
              <p className="text-green-400 text-xs font-semibold uppercase tracking-widest mb-1">Charity</p>
              <p className="text-white text-sm">{moment.charity_name}</p>
              <p className="text-[#8a94a6] text-xs mt-0.5">$1 sponsor donation per claim</p>
            </div>
          )}
          <div className="border-t border-white/5 pt-4 mt-4">
            <p className="text-[#8a94a6] text-xs">
              {moment.supply_total - moment.supply_claimed} of {moment.supply_total} remaining
            </p>
          </div>
        </div>

        {soldOut ? (
          <div className="border border-white/10 bg-[#0b1f36] p-6 text-center">
            <p className="text-red-400 font-semibold mb-2">This drop is sold out.</p>
            <Link href="/sports/moments" className="text-[#c99a3c] text-sm font-semibold uppercase tracking-wider hover:text-white transition-colors">
              View Other Drops
            </Link>
          </div>
        ) : (
          <div className="border border-white/10 bg-[#0b1f36] p-8">
            <p className="text-white font-semibold mb-5">No wallet required.</p>

            {/* ID type toggle */}
            <div className="flex border border-white/10 mb-5">
              <button
                onClick={() => setIdType("phone")}
                className={`flex-1 py-2.5 text-xs font-semibold uppercase tracking-wider transition-colors ${
                  idType === "phone"
                    ? "bg-[#c99a3c] text-[#071426]"
                    : "text-[#8a94a6] hover:text-white"
                }`}
              >
                Phone
              </button>
              <button
                onClick={() => setIdType("email")}
                className={`flex-1 py-2.5 text-xs font-semibold uppercase tracking-wider transition-colors ${
                  idType === "email"
                    ? "bg-[#c99a3c] text-[#071426]"
                    : "text-[#8a94a6] hover:text-white"
                }`}
              >
                Email
              </button>
            </div>

            <input
              type={idType === "phone" ? "tel" : "email"}
              placeholder={idType === "phone" ? "+1 (404) 555-0100" : "you@example.com"}
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              className="w-full bg-[#071426] border border-white/10 text-white placeholder-[#8a94a6] px-4 py-3 text-sm focus:outline-none focus:border-[#c99a3c]/60 mb-4"
            />

            {errorMsg && (
              <p className="text-red-400 text-sm mb-4">{errorMsg}</p>
            )}

            <button
              onClick={handleClaim}
              disabled={status === "loading"}
              className="w-full py-3.5 bg-[#c99a3c] text-[#071426] font-semibold text-sm uppercase tracking-wider hover:bg-[#f0cf82] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {status === "loading" ? "Claiming..." : "Claim Moment"}
            </button>

            <p className="text-[#8a94a6] text-xs text-center mt-4">
              No spam. No selling your info. Used only to associate your claim.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
