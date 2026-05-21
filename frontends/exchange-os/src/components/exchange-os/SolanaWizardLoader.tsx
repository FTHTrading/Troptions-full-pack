"use client";

import dynamic from "next/dynamic";

const SolanaLaunchWizard = dynamic(
  () => import("@/components/exchange-os/SolanaLaunchWizard"),
  {
    ssr: false,
    loading: () => (
      <div
        style={{
          padding: "3rem",
          textAlign: "center",
          color: "var(--xos-text-muted)",
        }}
      >
        Loading Solana wallet interface…
      </div>
    ),
  }
);

export function SolanaWizardLoader() {
  return <SolanaLaunchWizard />;
}
