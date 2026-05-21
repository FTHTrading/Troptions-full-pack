"use client";

import { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { CreateWalletForm } from "@/components/troptions-wallet/CreateWalletForm";
import "@/styles/troptions-wallet.css";

export default function CreateWalletPage() {
  return (
    <Suspense fallback={<main className="wallet-layout"><div className="mx-auto max-w-md" /></main>}>
      <CreateWalletPageContent />
    </Suspense>
  );
}

function CreateWalletPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const handle = searchParams.get("handle") || "";

  const handleSubmit = (data: { displayName: string; email: string; handle: string }) => {
    // In production, this would create the wallet via API
    router.push(`/join-troptions/success?handle=${data.handle}`);
  };

  return (
    <main className="wallet-layout">
      <div className="mx-auto max-w-md">
        <CreateWalletForm inviteHandle={handle} onSubmit={handleSubmit} />
      </div>
    </main>
  );
}
