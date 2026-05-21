import React from "react";
export default function LaunchGateChecklist({ gates }: { gates: { id: string; title: string; description: string }[] }) {
  return (
    <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {gates.map(gate => (
        <li key={gate.id} className="bg-gray-800 rounded p-3 border-l-4 border-gold-400">{gate.title}: <span className="text-gray-300">{gate.description}</span></li>
      ))}
    </ul>
  );
}
