"use client";

import React, { useState } from "react";
import { simulateConversion } from "@/lib/troptions/walletConversionEngine";

interface WalletConversionPanelProps {
  onSubmit?: (data: { fromCurrency: string; toCurrency: string; amount: string }) => void;
}

export function WalletConversionPanel({ onSubmit }: WalletConversionPanelProps) {
  const [fromCurrency, setFromCurrency] = useState("TROP USD");
  const [toCurrency, setToCurrency] = useState("USDF");
  const [amount, setAmount] = useState("");
  const [preview, setPreview] = useState<ReturnType<typeof simulateConversion> | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit?.({ fromCurrency, toCurrency, amount });
    setPreview(
      simulateConversion({
        walletId: "wallet_kevan_main",
        fromCurrency,
        toCurrency,
        amount,
        sourceChain: "internal-ledger",
        destinationChain: toCurrency === "USDF" ? "stellar" : "internal-ledger",
      })
    );
  };

  return (
    <form onSubmit={handleSubmit} className="wallet-card conversion-form">
      <div className="card-body">
        <h3 className="form-title">Convert Stablecoins (Simulation Only)</h3>
        <div className="form-warning">
          <p>⚠️ This is a simulation. No real conversions will execute.</p>
        </div>

        <div className="form-group">
          <label htmlFor="fromCurrency">From</label>
          <select value={fromCurrency} onChange={(e) => setFromCurrency(e.target.value)}>
            <option>TROP USD</option>
            <option>USDF</option>
            <option>UNY</option>
          </select>
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
          <label htmlFor="toCurrency">To</label>
          <select value={toCurrency} onChange={(e) => setToCurrency(e.target.value)}>
            <option>USDF</option>
            <option>TROP USD</option>
            <option>UNY</option>
          </select>
        </div>

        <button type="submit" className="wallet-button button-primary button-full">
          Preview Conversion
        </button>

        {preview && (
          <div className="form-disclaimer">
            <p>
              <strong>{preview.status.toUpperCase()}:</strong> {preview.message}
            </p>
            {preview.estimatedReceiveAmount && preview.estimatedFee && (
              <p style={{ marginTop: "0.5rem" }}>
                Receive amount: {preview.estimatedReceiveAmount}. Estimated fee: {preview.estimatedFee}.
              </p>
            )}
          </div>
        )}

        <div className="conversion-disclaimer">
          <p>Live conversions require provider liquidity approval and treasury routing verification.</p>
        </div>
      </div>
    </form>
  );
}
