"use client";

import React, { useState } from "react";

interface WalletReceivePanelProps {
  receiveAddress?: string;
  currency?: string;
  chain?: string;
}

export function WalletReceivePanel({
  receiveAddress = "troptions_wallet_main",
  currency = "TROP USD",
  chain = "internal-ledger",
}: WalletReceivePanelProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(receiveAddress);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1200);
  };

  return (
    <div className="wallet-card receive-panel">
      <div className="card-body">
        <h3 className="form-title">Receive</h3>
        <p className="form-subtitle">Share your receive address to accept transfers</p>

        <div className="receive-details">
          <div className="detail-field">
            <label>Receive Address</label>
            <div className="address-display">
              <code>{receiveAddress}</code>
              <button type="button" className="copy-button" onClick={handleCopy}>
                {copied ? "Copied" : "Copy"}
              </button>
            </div>
          </div>

          <div className="detail-field">
            <label>Currency</label>
            <p>{currency}</p>
          </div>

          <div className="detail-field">
            <label>Chain</label>
            <p>{chain}</p>
          </div>
        </div>

        <div className="receive-instructions">
          <h4>Instructions</h4>
          <ol>
            <li>Share your receive address with the sender</li>
            <li>Funds will arrive after provider confirmation</li>
            <li>Deposits may take 1-3 business days</li>
            <li>All deposits require AML screening</li>
          </ol>
        </div>

        <div className="receive-disclaimer">
          <p>
            <strong>Note:</strong> In simulation mode, receives are logged but not executed. Live receives require
            provider activation and compliance approval.
          </p>
        </div>
      </div>
    </div>
  );
}
