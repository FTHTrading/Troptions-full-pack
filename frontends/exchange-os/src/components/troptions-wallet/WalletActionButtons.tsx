"use client";

import React from "react";
import Link from "next/link";

interface WalletActionButtonsProps {
  canSend: boolean;
  canReceive: boolean;
  canConvert: boolean;
  canRequestFunding: boolean;
}

export function WalletActionButtons({
  canSend,
  canReceive,
  canConvert,
  canRequestFunding,
}: WalletActionButtonsProps) {
  const actions = [
    {
      href: "/portal/troptions/wallet/receive",
      label: "Receive",
      enabled: canReceive,
      className: "button-primary",
    },
    {
      href: "/portal/troptions/wallet/send",
      label: "Send (Simulation)",
      enabled: canSend,
      className: "button-secondary",
    },
    {
      href: "/portal/troptions/wallet/convert",
      label: "Convert (Simulation)",
      enabled: canConvert,
      className: "button-secondary",
    },
    {
      href: "/portal/troptions/wallet/funding-request",
      label: "Request Funding",
      enabled: canRequestFunding,
      className: "button-tertiary",
    },
  ] as const;

  return (
    <div className="wallet-actions">
      {actions.map((action) => (
        <Link
          key={action.href}
          href={action.enabled ? action.href : "#"}
          aria-disabled={!action.enabled}
          className={`wallet-button ${action.enabled ? action.className : "button-disabled"}`}
          tabIndex={action.enabled ? 0 : -1}
        >
          {action.label}
        </Link>
      ))}
    </div>
  );
}
