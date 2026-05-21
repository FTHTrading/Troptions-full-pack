import React from "react";
export default function MainnetBlockersPanel({ blockers }: { blockers: { id: string; title: string; description: string }[] }) {
  return (
    <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {blockers.map(blocker => (
        <li key={blocker.id} className="bg-gray-800 rounded p-3 border-l-4 border-red-400">{blocker.title}: <span className="text-gray-300">{blocker.description}</span></li>
      ))}
    </ul>
  );
}
