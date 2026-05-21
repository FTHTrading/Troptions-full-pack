"use client";

import React, { useState } from "react";

interface FundingBlocker {
  blockerId: string;
  blockerType: string;
  description: string;
  requiredAction: string;
  estimatedTimeToResolve: string;
}

interface WalletFundingRequestPanelProps {
  blockedUntil?: readonly FundingBlocker[];
  onSubmit?: (data: { amount: string; currency: string; purpose: string }) => void;
}

export function WalletFundingRequestPanel({
  blockedUntil = [],
  onSubmit,
}: WalletFundingRequestPanelProps) {
  const [amount, setAmount] = useState("");
  const [currency, setCurrency] = useState("TROP USD");
  const [purpose, setPurpose] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const hasBlockers = blockedUntil.length > 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!hasBlockers) {
      onSubmit?.({ amount, currency, purpose });
      setSubmitted(true);
    }
  };

  if (submitted) {
    return (
      <div className="wallet-card success-card">
        <p>✓ Funding request submitted. You will receive updates via email as it progresses through approval.</p>
      </div>
    );
  }

  return (
    <div className="wallet-card funding-request-form">
      <div className="card-body">
        <h3 className="form-title">Request Funding</h3>

        {hasBlockers && (
          <div className="blockers-section">
            <h4 className="blockers-title">Approval Gates (Complete before funding can proceed)</h4>
            <div className="blockers-list">
              {blockedUntil.map((blocker) => (
                <div key={blocker.blockerId} className="blocker-item">
                  <div className="blocker-icon">⏳</div>
                  <div className="blocker-content">
                    <p className="blocker-description">{blocker.description}</p>
                    <p className="blocker-action">
                      <strong>Action:</strong> {blocker.requiredAction}
                    </p>
                    <p className="blocker-eta">
                      <strong>Est. time:</strong> {blocker.estimatedTimeToResolve}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {!hasBlockers && (
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="amount">Funding Amount</label>
              <input
                id="amount"
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                step="0.01"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="currency">Currency</label>
              <select value={currency} onChange={(e) => setCurrency(e.target.value)}>
                <option>TROP USD</option>
                <option>USDF</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="purpose">Purpose</label>
              <input
                id="purpose"
                type="text"
                value={purpose}
                onChange={(e) => setPurpose(e.target.value)}
                placeholder="Describe intended use"
                required
              />
            </div>

            <button type="submit" className="wallet-button button-primary button-full">
              Submit Funding Request
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
