import React from "react";
export default function SolanaCompetitorMatrix({ competitors }: { competitors: { id: string; name: string; notes: string }[] }) {
  return (
    <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {competitors.map(lp => (
        <li key={lp.id} className="bg-gray-800 rounded p-3 border-l-4 border-red-400">
          <div className="font-bold text-red-200">{lp.name}</div>
          <div className="text-xs text-gray-400">{lp.notes}</div>
        </li>
      ))}
    </ul>
  );
}
