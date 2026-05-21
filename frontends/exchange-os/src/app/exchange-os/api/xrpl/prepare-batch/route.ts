import { NextResponse } from "next/server";
import {
  buildPrepareBatchResponse,
  type BatchMode,
} from "@/lib/exchange-os/xrpl/prepareBatch";
import {
  buildScenarioInnerTxs,
  type BatchScenarioId,
} from "@/lib/exchange-os/xrpl/batchScenarios";
import { batchSafeToSubmit } from "@/lib/exchange-os/xrpl/ledgerRead";
import { xrplConfig } from "@/config/exchange-os/xrpl";
import { isEnabled } from "@/data/exchangeOsFeatureFlags";

export const runtime = "edge";

type Body = {
  account: string;
  mode?: BatchMode;
  innerTransactions?: Array<Record<string, unknown>>;
  scenario?: BatchScenarioId;
  demo?: boolean;
  destinations?: string[];
};

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as Body;
    if (!body.account) {
      return NextResponse.json({ error: "account required" }, { status: 400 });
    }

    let mode = body.mode;
    let inner = body.innerTransactions;
    if (body.scenario) {
      inner = buildScenarioInnerTxs(body.scenario, body.account, {
        destinations: body.destinations,
      });
      const modes: Record<BatchScenarioId, BatchMode> = {
        "01": "ALLORNOTHING",
        "02": "INDEPENDENT",
        "03": "ALLORNOTHING",
        "04": "ONLYONE",
        "05": "UNTILFAILURE",
        "06": "ALLORNOTHING",
      };
      mode = modes[body.scenario];
    }

    if (!mode || !inner?.length) {
      return NextResponse.json(
        { error: "mode + innerTransactions, or scenario required" },
        { status: 400 }
      );
    }
    if (inner.length > 7) {
      return NextResponse.json(
        { error: "Max 7 user inner txs (+1 platform fee)" },
        { status: 400 }
      );
    }

    const killSwitch = process.env.EXCHANGE_OS_KILL_SWITCH === "true";
    const mainnet = isEnabled("XRPL_MAINNET_ENABLED");
    const safety = await batchSafeToSubmit({
      mainnetEnabled: mainnet,
      killSwitch,
    });

    const result = buildPrepareBatchResponse(
      inner as Parameters<typeof buildPrepareBatchResponse>[0],
      mode,
      body.account
    );

    return NextResponse.json({
      ...result,
      safeToSubmit: body.demo ? false : safety.safeToSubmit,
      issuerBalanceXrp: safety.issuerBalanceXrp,
      blockers: safety.reasons,
      demo: Boolean(body.demo),
      policy: {
        mainnetEnabled: mainnet,
        killSwitchArmed: killSwitch,
        canSubmit: mainnet && !killSwitch && safety.safeToSubmit,
        issuer: xrplConfig.troptionsIssuer,
        feeWallet: xrplConfig.feeWallet,
        network: mainnet ? "mainnet" : "testnet_readonly",
      },
      docs: "https://github.com/FTHTrading/rwa-realestate/blob/main/docs/xrpl/BATCH_REVENUE_MODELS.md",
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "prepare-batch failed";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
