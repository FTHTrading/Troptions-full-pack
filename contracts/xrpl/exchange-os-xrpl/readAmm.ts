// TROPTIONS Exchange OS — Read AMM Pool data from XRPL

import { xrplReadQuery } from "./client";
import { xrplConfig } from "@/config/exchange-os/xrpl";
import { DEMO_AMM_POOLS } from "@/config/exchange-os/demoData";
import type { XrplAmmPool, XrplAmount } from "./types";

/** Fetch AMM pool info for a given asset pair */
export async function readXrplAmm(
  asset1: { currency: string; issuer?: string },
  asset2: { currency: string; issuer?: string }
): Promise<XrplAmmPool | null> {
  if (xrplConfig.demoMode) {
    const demo = DEMO_AMM_POOLS[0];
    return {
      account: "rAMM_DEMO",
      asset1: { currency: "XRP", value: demo.asset1Balance },
      asset2: {
        currency: "TROPTIONS",
        issuer: xrplConfig.troptionsIssuer,
        value: demo.asset2Balance,
      },
      lpTokenBalance: { currency: "LP", value: "0" },
      tradingFee: 300, // 0.3% = 300/100000
    };
  }

  try {
    const a1: Record<string, string> =
      asset1.currency === "XRP"
        ? { currency: "XRP" }
        : { currency: asset1.currency, issuer: asset1.issuer ?? "" };

    const a2: Record<string, string> =
      asset2.currency === "XRP"
        ? { currency: "XRP" }
        : { currency: asset2.currency, issuer: asset2.issuer ?? "" };

    const result = (await xrplReadQuery("amm_info", {
      asset: a1,
      asset2: a2,
    })) as {
      amm?: {
        account?: string;
        amount?: string | XrplAmount;
        amount2?: string | XrplAmount;
        lp_token?: XrplAmount;
        trading_fee?: number;
        vote_slots?: unknown[];
      };
    };

    if (!result?.amm) return null;
    const { amm } = result;

    return {
      account: amm.account ?? "",
      asset1: toXrplAmount(amm.amount),
      asset2: toXrplAmount(amm.amount2),
      lpTokenBalance: amm.lp_token ?? { currency: "LP", value: "0" },
      tradingFee: amm.trading_fee ?? 0,
      voteSlots: amm.vote_slots,
    };
  } catch {
    return null;
  }
}

function toXrplAmount(raw: string | XrplAmount | undefined): XrplAmount {
  if (!raw) return { currency: "UNKNOWN", value: "0" };
  if (typeof raw === "string") {
    // XRP drops
    return {
      currency: "XRP",
      value: (parseInt(raw) / 1_000_000).toFixed(6),
    };
  }
  return raw;
}

/** Get AMM trading fee as a human-readable percentage */
export function tradingFeeToPercent(fee: number): string {
  return (fee / 1000).toFixed(3) + "%";
}
