"use client";

import { useState } from "react";

interface CopyAddressButtonProps {
  address: string;
}

export default function CopyAddressButton({ address }: CopyAddressButtonProps) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard API not available — silently fail
    }
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-800 transition hover:bg-slate-100"
    >
      {copied ? "Copied ✓" : "Copy Address"}
    </button>
  );
}
