"use client";

import React from "react";

interface X402WalletPanelProps {
  walletId: string;
  status: string;
  operatorRole: string;
  monthlyLimit: string;
  monthlyUsage: string;
  disclaimers?: readonly string[];
}

export function X402WalletPanel({
  walletId,
  status,
  operatorRole,
  monthlyLimit,
  monthlyUsage,
  disclaimers = [],
}: X402WalletPanelProps) {
  const [previewMessage, setPreviewMessage] = React.useState<string | null>(null);

  return (
    <div className="wallet-card x402-panel">
      <div className="card-body">
        <h3 className="form-title">x402 Payment Network</h3>

        <div className="x402-status">
          <span className={`status-badge status-${status}`}>{status.toUpperCase()}</span>
          <span className="operator-role">Role: {operatorRole}</span>
        </div>

        <div className="x402-limits">
          <div className="limit-display">
            <small>Monthly Limit</small>
            <p>${monthlyLimit}</p>
          </div>
          <div className="limit-display">
            <small>Monthly Usage</small>
            <p>${monthlyUsage}</p>
          </div>
        </div>

        <div className="x402-disclaimers">
          <h4>⚠️ Important Disclaimers</h4>
          <ul>
            {disclaimers.map((disclaimer, idx) => (
              <li key={idx}>{disclaimer}</li>
            ))}
          </ul>
        </div>

        <button
          type="button"
          className="wallet-button button-secondary button-full"
          disabled={status === "disabled"}
          onClick={() => setPreviewMessage(`Dry-run payment intent prepared for ${walletId}. No ATP settlement will execute in ${status} mode.`)}
        >
          Create Payment Intent (Dry-Run)
        </button>

        {previewMessage && (
          <div className="form-disclaimer">
            <p>{previewMessage}</p>
          </div>
        )}
      </div>
    </div>
  );
}
