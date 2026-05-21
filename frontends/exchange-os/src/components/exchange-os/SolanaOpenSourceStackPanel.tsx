import React from "react";
export default function SolanaOpenSourceStackPanel({ stack }: { stack: { id: string; name: string; purpose: string; useCaseInTroptions: string; licenseNotes: string; securityNotes: string }[] }) {
  return (
    <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {stack.map(item => (
        <li key={item.id} className="bg-gray-800 rounded p-3 border-l-4 border-gold-400">
          <div className="font-bold text-gold-200">{item.name}</div>
          <div className="text-gray-300">{item.purpose}</div>
          <div className="text-xs text-gray-400">{item.useCaseInTroptions}</div>
          <div className="text-xs text-gray-500">{item.licenseNotes} | {item.securityNotes}</div>
        </li>
      ))}
    </ul>
  );
}
