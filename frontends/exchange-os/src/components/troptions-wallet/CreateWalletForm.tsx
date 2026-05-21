"use client";

import React, { useState } from "react";

interface CreateWalletFormProps {
  inviteHandle: string;
  onSubmit?: (data: { displayName: string; email: string; handle: string }) => void;
}

export function CreateWalletForm({ inviteHandle, onSubmit }: CreateWalletFormProps) {
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (displayName && email && agreedToTerms) {
      onSubmit?.({ displayName, email, handle: inviteHandle });
      setSubmitted(true);
    }
  };

  if (submitted) {
    return (
      <div className="wallet-card success-card">
        <div className="card-body">
          <h3 className="success-title">Wallet Created</h3>
          <p className="success-message">
            Your Troptions Genesis Wallet has been created in simulation mode. Next steps: verify your identity and
            request funding approval.
          </p>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="wallet-card create-wallet-form">
      <div className="card-body">
        <h3 className="form-title">Create Your Wallet</h3>
        <p className="form-subtitle">No private keys are stored. Simulation mode enabled.</p>

        <div className="form-group">
          <label htmlFor="displayName">Display Name</label>
          <input
            id="displayName"
            type="text"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            placeholder="Your full name"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your.email@example.com"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="handle">Wallet Handle</label>
          <input id="handle" type="text" value={inviteHandle} disabled className="form-input-disabled" />
          <small>Set by invitation</small>
        </div>

        <div className="form-group checkbox">
          <input
            id="terms"
            type="checkbox"
            checked={agreedToTerms}
            onChange={(e) => setAgreedToTerms(e.target.checked)}
            required
          />
          <label htmlFor="terms">
            I agree that this wallet is in simulation mode. Live funding and transactions require provider approval,
            compliance review, and custody verification.
          </label>
        </div>

        <button type="submit" className="wallet-button button-primary" disabled={!agreedToTerms}>
          Create Wallet
        </button>

        <div className="form-disclaimer">
          <p>
            <strong>Important:</strong> This wallet is created in simulation mode only. No real funds, no private
            keys, no seed phrases. Live operations require multiple compliance approvals.
          </p>
        </div>
      </div>
    </form>
  );
}
