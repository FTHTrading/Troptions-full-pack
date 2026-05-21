"use client";

import React from "react";
import { WalletQrCode } from "@/content/troptions/walletQrRegistry";

interface WalletQrCodeProps {
  qrCode: WalletQrCode;
}

export function WalletQrCodeDisplay({ qrCode }: WalletQrCodeProps) {
  return (
    <div className="wallet-card qr-card">
      <div className="card-header">
        <h3 className="card-title">Your Troptions Profile</h3>
        <span className={`qr-status status-${qrCode.status}`}>{qrCode.status}</span>
      </div>
      <div className="card-body">
        <div className="qr-container">
          <div className="qr-placeholder">
            <div className="qr-code-visual">QR Code</div>
            <p className="qr-uri">{qrCode.qrPayloadUri}</p>
          </div>
        </div>
        <div className="qr-details">
          <p className="qr-payload-text">{qrCode.qrPayloadText}</p>
          <div className="qr-disclaimer">
            <p>
              <strong>Security Notice:</strong> {qrCode.disclaimer}
            </p>
          </div>
        </div>
        <button className="wallet-button button-primary button-full">Download QR Code</button>
      </div>
    </div>
  );
}
