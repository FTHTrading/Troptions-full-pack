"use client";

import React from "react";
import { WalletBalance } from "@/content/troptions/walletBalanceRegistry";

interface WalletBalanceCardProps {
  balance: WalletBalance;
}

export function WalletBalanceCard({ balance }: WalletBalanceCardProps) {
  const statusClass = `status-${balance.status}`;
  const showDemoWarning = balance.status === "demo" || balance.status === "pending";

  return (
    <div className={`wallet-card balance-card ${statusClass}`}>
      <div className="card-header">
        <div className="balance-label">
          <h4 className="balance-currency">{balance.currency}</h4>
          <span className={`balance-status status-badge status-${balance.status}`}>{balance.status}</span>
        </div>
        <span className="balance-chain">{balance.chain}</span>
      </div>
      <div className="card-body">
        <div className="balance-amount">${balance.amount}</div>
        <p className="balance-last-updated">Updated: {new Date(balance.lastUpdated).toLocaleDateString()}</p>
        {showDemoWarning && (
          <div className="balance-warning">
            <p className="warning-icon">⚠️</p>
            <p className="warning-text">{balance.disclaimer}</p>
          </div>
        )}
      </div>
    </div>
  );
}
