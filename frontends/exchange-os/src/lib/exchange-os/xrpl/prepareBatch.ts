/**
 * Prepare monetized XRPL Batch transactions for Exchange OS (unsigned).
 * Signing happens in user wallet; submission gated by XRPL_MAINNET_ENABLED.
 */

export type BatchMode = "ALLORNOTHING" | "ONLYONE" | "UNTILFAILURE" | "INDEPENDENT";

export const BATCH_FEE_SCHEDULE: Record<
  BatchMode,
  { platformPct: number; minFeeXrp: number }
> = {
  ALLORNOTHING: { platformPct: 0.015, minFeeXrp: 0.001 },
  ONLYONE: { platformPct: 0.005, minFeeXrp: 0.001 },
  UNTILFAILURE: { platformPct: 0.0025, minFeeXrp: 0.0005 },
  INDEPENDENT: { platformPct: 0.01, minFeeXrp: 0.001 },
};

const TF_INNER_BATCH_TXN = 0x40000000;

const BATCH_FLAGS: Record<BatchMode, number> = {
  ALLORNOTHING: 0x00010000,
  ONLYONE: 0x00020000,
  UNTILFAILURE: 0x00040000,
  INDEPENDENT: 0x00080000,
};

import { TROPTIONS_FEE_WALLET } from "./walletRegistry";

const FEE_WALLET = TROPTIONS_FEE_WALLET;

export interface InnerTxInput {
  TransactionType: string;
  Account: string;
  [key: string]: unknown;
}

function prepareInner(tx: InnerTxInput): InnerTxInput {
  return {
    ...tx,
    Fee: "0",
    SigningPubKey: "",
    Flags: ((tx.Flags as number) || 0) | TF_INNER_BATCH_TXN,
  };
}

function grossXrpFromPayments(txs: InnerTxInput[]): number {
  let t = 0;
  for (const tx of txs) {
    if (tx.TransactionType === "Payment" && typeof tx.Amount === "string") {
      t += parseInt(tx.Amount, 10) / 1_000_000;
    }
  }
  return t;
}

export function buildPrepareBatchResponse(
  innerTxs: InnerTxInput[],
  mode: BatchMode,
  account: string
): {
  batch: {
    TransactionType: "Batch";
    Account: string;
    Flags: number;
    RawTransactions: Array<{ RawTransaction: InnerTxInput }>;
  };
  meta: {
    mode: BatchMode;
    platformFeeXrp: number;
    feeDestination: string;
    innerCount: number;
    schedule: (typeof BATCH_FEE_SCHEDULE)[BatchMode];
  };
} {
  const prepared = innerTxs.map(prepareInner);
  const sched = BATCH_FEE_SCHEDULE[mode];
  const feeXrp = Math.max(sched.minFeeXrp, grossXrpFromPayments(prepared) * sched.platformPct);

  const feeTx = prepareInner({
    TransactionType: "Payment",
    Account: account,
    Destination: FEE_WALLET,
    Amount: String(Math.round(feeXrp * 1_000_000)),
  });

  const all = [...prepared, feeTx];

  return {
    batch: {
      TransactionType: "Batch",
      Account: account,
      Flags: BATCH_FLAGS[mode],
      RawTransactions: all.map((RawTransaction) => ({ RawTransaction })),
    },
    meta: {
      mode,
      platformFeeXrp: feeXrp,
      feeDestination: FEE_WALLET,
      innerCount: all.length,
      schedule: sched,
    },
  };
}

export function isBatchTradingAllowed(opts: {
  xrplMainnetEnabled: boolean;
  killSwitchArmed?: boolean;
}): boolean {
  if (opts.killSwitchArmed) return false;
  return opts.xrplMainnetEnabled;
}
