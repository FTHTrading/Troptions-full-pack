"use client";

import React, { useState } from "react";
import { WALLET_ACCOUNT_REGISTRY } from "@/content/troptions/walletAccountRegistry";
import { simulateSend } from "@/lib/troptions/walletSendEngine";

interface WalletSendFormProps {
  onSubmit?: (data: { amount: string; currency: string; destinationAddress: string }) => void;
}

export function WalletSendForm({ onSubmit }: WalletSendFormProps) {
  const [amount, setAmount] = useState("");
  const [currency, setCurrency] = useState("TROP USD");
  const [destination, setDestination] = useState("");
  const [preview, setPreview] = useState<ReturnType<typeof simulateSend> | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit?.({ amount, currency, destinationAddress: destination });

    const account = WALLET_ACCOUNT_REGISTRY[0];
    setPreview(
      simulateSend(account, {
        walletId: account.walletId,
        amount,
        currency,
        sourceChain: "internal-ledger",
        destinationChain: destination.includes("agent:") ? "x402" : "internal-ledger",
        destinationAddress: destination,
      })
    );
  };

  return (
    <form onSubmit={handleSubmit} className="wallet-card send-form">
      <div className="card-body">
        <h3 className="form-title">Send (Simulation Only)</h3>
        <div className="form-warning">
          <p>⚠️ This is a simulation. No real transactions will execute.</p>
        </div>

        <div className="form-group">
          <label htmlFor="amount">Amount</label>
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
            <option>UNY</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="destination">Destination Address/Handle</label>
          <input
            id="destination"
            type="text"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            placeholder="recipient.troptions or wallet address"
            required
          />
        </div>

        <button type="submit" className="wallet-button button-primary button-full">
          Preview Simulation
        </button>

        {preview && (
          <div className="form-disclaimer">
            <p>
              <strong>{preview.status.toUpperCase()}:</strong> {preview.message}
            </p>
            {preview.simulation && (
              <p style={{ marginTop: "0.5rem" }}>
                Estimated fee: {preview.simulation.estimatedFee}. Estimated time: {preview.simulation.estimatedTime}.
              </p>
            )}
          </div>
        )}
      </div>
    </form>
  );
}
