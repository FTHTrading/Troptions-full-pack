"use client";

import React from "react";
import { WalletCard } from "@/content/troptions/walletCardRegistry";

interface WalletCardPreviewProps {
  card: WalletCard;
}

export function WalletCardPreview({ card }: WalletCardPreviewProps) {
  const isActive = card.status === "active";

  return (
    <div className={`wallet-card card-preview card-status-${card.status}`}>
      <div className="virtual-card">
        <div className="card-front">
          <div className="card-logo">Troptions</div>
          <div className="card-number">{card.maskedNumber}</div>
          <div className="card-details">
            <div className="card-holder">
              <small>Card Holder</small>
              <p>{card.cardholderName}</p>
            </div>
            <div className="card-expiry">
              <small>Expires</small>
              <p>
                {card.expiryMonth}/{card.expiryYear}
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="card-actions">
        <span className={`card-status status-${card.status}`}>{card.status.toUpperCase()}</span>
        {isActive && (
          <>
            <button className="wallet-button button-small button-secondary">Freeze</button>
            <button className="wallet-button button-small button-secondary">Reveal</button>
          </>
        )}
      </div>
      <div className="card-limits">
        <div className="limit-item">
          <small>Daily Limit</small>
          <p>${card.dailyLimit}</p>
        </div>
        <div className="limit-item">
          <small>Monthly Limit</small>
          <p>${card.monthlyLimit}</p>
        </div>
      </div>
    </div>
  );
}
