"use client";

import React from "react";

interface WalletHistoryTableProps {
  transactions?: Array<{
    id: string;
    type: string;
    amount: string;
    currency: string;
    status: "simulation" | "pending" | "completed" | "failed";
    date: string;
  }>;
}

export function WalletHistoryTable({ transactions = [] }: WalletHistoryTableProps) {
  if (transactions.length === 0) {
    return (
      <div className="wallet-card history-empty">
        <p>No transaction history yet. Receive funds or submit a funding request to get started.</p>
      </div>
    );
  }

  return (
    <div className="wallet-card history-table">
      <table>
        <thead>
          <tr>
            <th>Type</th>
            <th>Amount</th>
            <th>Status</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((tx) => (
            <tr key={tx.id} className={`tx-${tx.status}`}>
              <td className="tx-type">{tx.type}</td>
              <td className="tx-amount">
                {tx.amount} {tx.currency}
              </td>
              <td>
                <span className={`status-badge status-${tx.status}`}>
                  {tx.status === "simulation" && "🔄 Simulation"}
                  {tx.status === "pending" && "⏳ Pending"}
                  {tx.status === "completed" && "✓ Completed"}
                  {tx.status === "failed" && "✗ Failed"}
                </span>
              </td>
              <td>{new Date(tx.date).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
