/**
 * Troptions Treasury Registry
 * T-bills, money market, and short-duration treasury instruments.
 */

export type TreasuryInstrumentType = "t-bill" | "money-market" | "short-duration-bond" | "treasury-note" | "treasury-fund";
export type TreasuryStatus = "evaluation" | "advisor-approved" | "custody-configured" | "operational" | "suspended";

export interface TreasuryInstrument {
  instrumentId: string;
  name: string;
  type: TreasuryInstrumentType;
  description: string;
  custodian: string | null;
  advisorApproval: boolean;
  minimumDuration: string | null;
  maximumDuration: string | null;
  yieldProfile: string;
  linkedAssets: string[];
  status: TreasuryStatus;
  nextAction: string;
}

export const TREASURY_REGISTRY: TreasuryInstrument[] = [
  {
    instrumentId: "TREAS-TBILL-001",
    name: "US Treasury Bill Program",
    type: "t-bill",
    description: "Short-duration US government T-bills for reserve and collateral management. Duration 4–52 weeks.",
    custodian: null,
    advisorApproval: false,
    minimumDuration: "4 weeks",
    maximumDuration: "52 weeks",
    yieldProfile: "Tracks prevailing US government discount rate. No yield guarantee.",
    linkedAssets: ["ASSET-TPAY-001", "ASSET-TGOLD-001"],
    status: "evaluation",
    nextAction: "Engage investment advisor. Select custodian. Configure custody account.",
  },
  {
    instrumentId: "TREAS-MMF-001",
    name: "Money Market Reserve Fund",
    type: "money-market",
    description: "Institutional money market instruments for liquidity management and reserve backing.",
    custodian: null,
    advisorApproval: false,
    minimumDuration: null,
    maximumDuration: "90 days",
    yieldProfile: "Tracks overnight/short-term rates. Not guaranteed.",
    linkedAssets: ["SU-TROP-USD-001"],
    status: "evaluation",
    nextAction: "Engage investment advisor. Open institutional money market account.",
  },
];

export function assertTreasuryOperational(instrument: TreasuryInstrument): void {
  if (instrument.status !== "operational") {
    throw new Error(
      `[TreasuryGuard] Treasury instrument "${instrument.name}" is not operational. Status: "${instrument.status}". Obtain advisor approval and configure custody.`,
    );
  }
}
