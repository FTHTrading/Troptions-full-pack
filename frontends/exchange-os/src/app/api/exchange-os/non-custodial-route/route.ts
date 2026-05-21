import { NextResponse } from "next/server";
import {
  NON_CUSTODIAL_ROUTE_FLOW,
  CHAIN_ROUTE_MODELS,
  NON_CUSTODIAL_GUARANTEES,
} from "@/data/nonCustodialRouteModel";


export async function GET() {
  return NextResponse.json({
    data: {
      routeFlow: NON_CUSTODIAL_ROUTE_FLOW,
      chainModels: CHAIN_ROUTE_MODELS,
      guarantees: NON_CUSTODIAL_GUARANTEES,
    },
    generatedAt: new Date().toISOString(),
    truthLabel:
      "static_config_no_live_data — non-custodial route architecture schema, no live trade data",
    version: "1.0",
  });
}
