"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { JoinInviteCard } from "@/components/troptions-wallet/JoinInviteCard";
import { getInviteByHandle, type WalletInvite } from "@/content/troptions/walletInviteRegistry";
import "@/styles/troptions-wallet.css";

export default function InviteVerificationPage() {
  const router = useRouter();
  const [inviteHandle, setInviteHandle] = useState("");
  const [verifiedInvite, setVerifiedInvite] = useState<WalletInvite | null>(null);
  const [error, setError] = useState("");

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const invite = getInviteByHandle(inviteHandle.toLowerCase());
    if (!invite) {
      setError("Invite not found. Please check your code and try again.");
      return;
    }

    if (invite.inviteStatus === "redeemed") {
      setError("This invitation has already been used.");
      return;
    }

    if (invite.inviteStatus === "revoked") {
      setError("This invitation has been revoked.");
      return;
    }

    if (new Date(invite.expiresAt) < new Date()) {
      setError("This invitation has expired.");
      return;
    }

    setVerifiedInvite(invite);
  };

  if (verifiedInvite) {
    return (
      <main className="wallet-layout">
        <div className="mx-auto max-w-2xl">
          <JoinInviteCard invite={verifiedInvite} />
          <div style={{ marginTop: "1.5rem", textAlign: "center" }}>
            <button
              onClick={() => router.push(`/join-troptions/create-wallet?handle=${verifiedInvite.inviteHandle}`)}
              className="wallet-button button-primary"
            >
              Continue to Wallet Creation
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="wallet-layout">
      <div className="mx-auto max-w-md">
        <div className="wallet-card">
          <div className="card-body">
            <h1 className="wallet-title">Verify Invite</h1>
            <p className="wallet-subtitle">Enter your invitation handle to proceed with wallet creation.</p>

            <form onSubmit={handleVerify} style={{ marginTop: "2rem" }}>
              <div className="form-group">
                <label htmlFor="handle">Invite Handle</label>
                <input
                  id="handle"
                  type="text"
                  value={inviteHandle}
                  onChange={(e) => setInviteHandle(e.target.value)}
                  placeholder="e.g., kevan.troptions"
                  required
                />
              </div>

              {error && (
                <div style={{ background: "var(--wallet-error)/10%", border: "1px solid var(--wallet-error)/30%", padding: "1rem", borderRadius: "0.5rem", marginBottom: "1rem", color: "var(--wallet-ink)" }}>
                  {error}
                </div>
              )}

              <button type="submit" className="wallet-button button-primary button-full">
                Verify Invite
              </button>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}
