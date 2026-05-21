"use client";

import React from "react";

interface WalletRiskBannerProps {
  riskLevel: "low" | "medium" | "high" | "critical";
  message?: string;
}

export function WalletRiskBanner({ riskLevel, message }: WalletRiskBannerProps) {
  const bannerClass = `risk-banner risk-${riskLevel}`;
  const defaultMessages: Record<string, string> = {
    low: "Your wallet is in good standing. Standard monitoring applies.",
    medium: "Your wallet has medium risk. Enhanced due diligence recommended.",
    high: "Your wallet has high risk. Restrictions may apply to new transactions.",
    critical: "Your wallet is flagged for critical risk. Contact support immediately.",
  };

  return (
    <div className={bannerClass}>
      <span className="risk-icon">⚠️</span>
      <p className="risk-message">{message || defaultMessages[riskLevel]}</p>
    </div>
  );
}
