"use client";

import React from "react";

interface WalletComplianceNoticeProps {
  title?: string;
  message?: string;
}

export function WalletComplianceNotice({ title = "Compliance Notice", message }: WalletComplianceNoticeProps) {
  const defaultMessage =
    "This wallet is in simulation mode. Live funding, withdrawals, chain transactions, card activation, stablecoin settlement, and x402 payment settlement require compliance approval, provider routing, custody verification, and release-gate authorization.";

  return (
    <div className="wallet-compliance-notice">
      <div className="notice-header">
        <span className="notice-icon">ℹ️</span>
        <h4 className="notice-title">{title}</h4>
      </div>
      <p className="notice-message">{message || defaultMessage}</p>
    </div>
  );
}
