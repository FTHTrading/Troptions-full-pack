"use client";

import { useState, useTransition } from "react";

const DEFAULT_PAYLOAD = {
  productLane: "merchant_rebate",
  rewardTrigger: "transaction_completion",
  payer: "merchant network",
  recipient: "member namespace",
  isStablecoinHolder: false,
  isAffiliateOfIssuer: false,
  isRelatedThirdParty: false,
  isSolelyForHoldingUseOrRetention: false,
  requiresDepositAccount: false,
  isTokenizedDeposit: false,
  isMerchantFunded: true,
  isTransactionSpecific: true,
  hasTimeBasedAccrual: false,
  hasBalanceBasedAccrual: false,
  legalMemoApproved: false,
  regulatorGuidanceMapped: true,
};

export function GeniusYieldOpportunityClient() {
  const [payload, setPayload] = useState(DEFAULT_PAYLOAD);
  const [result, setResult] = useState<Record<string, unknown> | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleBooleanChange(key: keyof typeof DEFAULT_PAYLOAD, value: boolean) {
    setPayload((current) => ({ ...current, [key]: value }));
  }

  function handleSelectChange(key: keyof typeof DEFAULT_PAYLOAD, value: string) {
    setPayload((current) => ({ ...current, [key]: value }));
  }

  function submitClassification() {
    startTransition(async () => {
      const response = await fetch("/api/genius-yield/classify-yield", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      });
      const body = (await response.json()) as Record<string, unknown>;
      setResult(body);
    });
  }

  return (
    <section className="rounded-4xl border border-amber-300/20 bg-slate-950/80 p-6 shadow-[0_24px_80px_rgba(251,191,36,0.12)]">
      <p className="text-xs uppercase tracking-[0.36em] text-amber-200">Yield Classifier</p>
      <div className="mt-5 grid gap-4 md:grid-cols-3">
        <label className="flex flex-col gap-2 text-sm text-slate-200">
          Product lane
          <select className="rounded-2xl border border-slate-700 bg-slate-900 px-4 py-3 text-white" value={payload.productLane} onChange={(event) => handleSelectChange("productLane", event.target.value)}>
            <option value="payment_stablecoin">payment stablecoin</option>
            <option value="tokenized_deposit">tokenized deposit</option>
            <option value="merchant_rebate">merchant rebate</option>
            <option value="loyalty_points">loyalty points</option>
            <option value="reserve_income">reserve income</option>
            <option value="rwa_payment_rail">RWA payment rail</option>
          </select>
        </label>
        <label className="flex flex-col gap-2 text-sm text-slate-200">
          Reward trigger
          <select className="rounded-2xl border border-slate-700 bg-slate-900 px-4 py-3 text-white" value={payload.rewardTrigger} onChange={(event) => handleSelectChange("rewardTrigger", event.target.value)}>
            <option value="transaction_completion">transaction completion</option>
            <option value="holding_balance">holding balance</option>
            <option value="holding_time">holding time</option>
            <option value="merchant_discount">merchant discount</option>
            <option value="tokenized_deposit_interest">tokenized deposit interest</option>
            <option value="loyalty_non_cash">loyalty non-cash</option>
            <option value="rwa_distribution">RWA distribution</option>
          </select>
        </label>
        <div className="flex flex-col justify-end">
          <button type="button" onClick={submitClassification} disabled={isPending} className="rounded-2xl bg-amber-300 px-4 py-3 text-sm font-semibold text-slate-950 disabled:opacity-60">
            {isPending ? "Evaluating..." : "Evaluate structure"}
          </button>
        </div>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {[
          ["isAffiliateOfIssuer", "affiliate relationship"],
          ["hasBalanceBasedAccrual", "balance based"],
          ["hasTimeBasedAccrual", "time based"],
          ["isMerchantFunded", "merchant funded"],
          ["isTransactionSpecific", "transaction specific"],
          ["requiresDepositAccount", "requires deposit account"],
          ["isTokenizedDeposit", "tokenized deposit"],
          ["regulatorGuidanceMapped", "regulator guidance mapped"],
        ].map(([key, label]) => (
          <label key={key} className="flex items-center gap-3 rounded-2xl border border-slate-800 bg-slate-900/70 px-4 py-3 text-sm text-slate-200">
            <input type="checkbox" checked={Boolean(payload[key as keyof typeof DEFAULT_PAYLOAD])} onChange={(event) => handleBooleanChange(key as keyof typeof DEFAULT_PAYLOAD, event.target.checked)} />
            <span>{label}</span>
          </label>
        ))}
      </div>

      <div className="mt-6 rounded-3xl border border-slate-800 bg-slate-900/80 p-5">
        <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Classifier output</p>
        <pre className="mt-4 overflow-x-auto rounded-2xl bg-slate-950 p-4 text-xs text-amber-100">
          {JSON.stringify(result ?? { message: "Awaiting evaluation." }, null, 2)}
        </pre>
      </div>
    </section>
  );
}