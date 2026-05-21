import React from "react";
export default function SolanaDexCard({ name, category, priority, notes }: { name: string; category: string; priority: string; notes: string }) {
  return (
    <div className="bg-gray-800 rounded p-3 border-l-4 border-cyan-400 mb-2">
      <div className="font-bold text-cyan-200">{name}</div>
      <div className="text-gray-300">{category} | Priority: {priority}</div>
      <div className="text-xs text-gray-400">{notes}</div>
    </div>
  );
}
