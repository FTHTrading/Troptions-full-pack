import React from "react";
export default function ReadinessCard({ title, description, color }: { title: string; description: string; color: string }) {
  return (
    <div className={`bg-gray-800 rounded p-3 border-l-4 ${color} mb-2`}>
      <div className="font-bold">{title}</div>
      <div className="text-gray-300">{description}</div>
    </div>
  );
}
