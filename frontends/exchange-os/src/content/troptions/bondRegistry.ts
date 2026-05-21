/**
 * Troptions Bond Registry
 * Institutional bond programs with issuer, trustee, agent, and coupon details.
 */

export type BondStatus = "evaluation" | "structure-pending" | "counsel-review" | "board-approved" | "filed" | "offered" | "issued" | "suspended";

export interface BondProgram {
  bondId: string;
  name: string;
  description: string;
  issuer: string;
  trustee: string | null;
  transferAgent: string | null;
  payingAgent: string | null;
  indentureCounsel: string | null;
  faceValue: string | null;
  couponRate: string | null;
  maturityProfile: string | null;
  redemptionReserve: string | null;
  investorReportingCadence: string;
  eligibleInvestors: string;
  jurisdictions: string[];
  status: BondStatus;
  nextAction: string;
}

export const BOND_REGISTRY: BondProgram[] = [
  {
    bondId: "BOND-TROP-001",
    name: "Troptions Institutional Bond Program",
    description: "Institutional fixed-income bond program backed by Troptions ecosystem revenue streams. Structure TBD pending legal and accounting analysis.",
    issuer: "TBD — Troptions operating entity or SPV",
    trustee: null,
    transferAgent: null,
    payingAgent: null,
    indentureCounsel: null,
    faceValue: null,
    couponRate: null,
    maturityProfile: null,
    redemptionReserve: null,
    investorReportingCadence: "Quarterly financial reporting to investors (once program operational)",
    eligibleInvestors: "Accredited investors only, subject to jurisdictional restrictions",
    jurisdictions: ["US", "EU", "GB", "SG", "AE", "KY"],
    status: "evaluation",
    nextAction: "Engage bond counsel and trustee. Define issuer entity and SPV structure.",
  },
];

export function assertBondReadyForOffering(bond: BondProgram): void {
  if (bond.status !== "offered" && bond.status !== "issued") {
    throw new Error(
      `[BondGuard] Bond program "${bond.name}" is not ready for offering. Current status: "${bond.status}". Complete legal, trustee, and board-approval requirements.`,
    );
  }
}
