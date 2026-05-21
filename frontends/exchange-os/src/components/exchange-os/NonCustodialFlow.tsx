import React from "react";
export default function NonCustodialFlow() {
  return (
    <div className="bg-gray-800 rounded p-4 border-l-4 border-cyan-400">
      User connects wallet → TROPTIONS prepares unsigned transaction → user reviews/signs in wallet → transaction routes through approved DEX/chain rail → proof is recorded → monitoring begins.
    </div>
  );
}
