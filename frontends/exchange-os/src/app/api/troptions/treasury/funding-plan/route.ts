import { NextResponse } from "next/server";
import {
  TREASURY_FUNDING_PLAN,
  STABLECOIN_ISSUERS,
  summariseFundingPlan,
} from "@/content/troptions/treasuryFundingPlanRegistry";
import { getXrplAccountLive, getXrplTrustlinesLive } from "@/lib/troptions/xrplLedgerEngine";
import { getStellarAccountLive } from "@/lib/troptions/stellarLedgerEngine";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * GET /api/troptions/treasury/funding-plan
 *
 * Returns the consolidated 3+3 funding plan with live mainnet status for
 * each wallet. Read-only. No seeds emitted.
 *
 * Query params:
 *   ?live=false   — skip live queries (returns plan only, much faster)
 */
export async function GET(req: Request) {
  const url = new URL(req.url);
  const live = url.searchParams.get("live") !== "false";

  const liveResults = live
    ? await Promise.all(
        TREASURY_FUNDING_PLAN.map(async (plan) => {
          try {
            if (plan.chain === "xrpl") {
              const acc = await getXrplAccountLive(plan.address);
              if (acc.error) {
                const notFunded = /actNotFound|Account not found/i.test(acc.error);
                return {
                  walletId: plan.walletId,
                  status: notFunded ? "not-funded" : "error",
                  error: acc.error,
                };
              }
              let trustlineCount = 0;
              try {
                const tls = await getXrplTrustlinesLive(plan.address);
                trustlineCount = tls.length;
              } catch {
                /* optional */
              }
              return {
                walletId: plan.walletId,
                status: "live",
                nativeBalance: acc.xrpBalance,
                trustlineCount,
              };
            }
            const acc = await getStellarAccountLive(plan.address);
            if (acc.error) {
              const notFunded = /not_found|404/i.test(acc.error);
              return {
                walletId: plan.walletId,
                status: notFunded ? "not-funded" : "error",
                error: acc.error,
              };
            }
            return {
              walletId: plan.walletId,
              status: "live",
              nativeBalance: acc.xlmBalance,
              trustlineCount: acc.balances.filter((b) => b.assetType !== "native").length,
            };
          } catch (err) {
            return {
              walletId: plan.walletId,
              status: "error",
              error: err instanceof Error ? err.message : String(err),
            };
          }
        }),
      )
    : null;

  return NextResponse.json(
    {
      generatedAt: new Date().toISOString(),
      summary: summariseFundingPlan(),
      stablecoinIssuers: Object.values(STABLECOIN_ISSUERS),
      plan: TREASURY_FUNDING_PLAN,
      live: liveResults,
    },
    { status: 200 },
  );
}
