import React from "react";
export default function PartnerControlsPanel({ controls }: { controls: { id: string; title: string; description: string }[] }) {
  return (
    <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {controls.map(ctrl => (
        <li key={ctrl.id} className="bg-gray-800 rounded p-3 border-l-4 border-gold-400">{ctrl.title}: <span className="text-gray-300">{ctrl.description}</span></li>
      ))}
    </ul>
  );
}
