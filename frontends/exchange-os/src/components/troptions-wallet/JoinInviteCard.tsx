"use client";

import React from "react";
import { WalletInvite } from "@/content/troptions/walletInviteRegistry";

interface JoinInviteCardProps {
  invite: WalletInvite;
}

export function JoinInviteCard({ invite }: JoinInviteCardProps) {
  return (
    <div className="wallet-card invite-card">
      <div className="card-header">
        <h3 className="card-title">Wallet Invitation</h3>
        <span className={`invite-status status-${invite.inviteStatus}`}>{invite.inviteStatus}</span>
      </div>
      <div className="card-body">
        <div className="invite-field">
          <label>Handle</label>
          <p className="invite-handle">{invite.inviteHandle}</p>
        </div>
        <div className="invite-field">
          <label>Invited By</label>
          <p>{invite.inviterRole}</p>
        </div>
        <div className="invite-field">
          <label>Required KYC Level</label>
          <p className="kyc-level">{invite.requiredKycLevel}</p>
        </div>
        <div className="invite-field">
          <label>Valid Until</label>
          <p>{new Date(invite.expiresAt).toLocaleDateString()}</p>
        </div>
        <div className="invite-field">
          <label>Available Modules</label>
          <ul className="modules-list">
            {invite.allowedWalletModules.map((mod) => (
              <li key={mod} className="module-item">
                ✓ {mod}
              </li>
            ))}
          </ul>
        </div>
        {invite.riskNote && (
          <div className="invite-note risk-note">
            <strong>Note:</strong> {invite.riskNote}
          </div>
        )}
      </div>
    </div>
  );
}
