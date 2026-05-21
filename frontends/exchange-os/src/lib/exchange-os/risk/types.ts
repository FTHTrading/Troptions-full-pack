// TROPTIONS Exchange OS — Risk Assessment Types

import type { RiskLabelId, RiskLevel } from "@/config/exchange-os/riskLabels";

export interface IssuerRisk {
  verified: boolean;
  freezeEnabled: boolean;
  clawbackEnabled: boolean;
  knownIssuer: boolean;
  labelIds: RiskLabelId[];
}

export interface LiquidityRisk {
  hasAmmPool: boolean;
  hasOrderBook: boolean;
  estimatedDepthXrp?: number;
  lowLiquidity: boolean;
  labelIds: RiskLabelId[];
}

export interface LaunchRisk {
  isNewLaunch: boolean;
  ageHours?: number;
  holdersCount?: number;
  labelIds: RiskLabelId[];
}

export interface RiskAssessment {
  tokenId: string;
  ticker: string;
  issuer: IssuerRisk;
  liquidity: LiquidityRisk;
  launch: LaunchRisk;
  /** Aggregated deduplicated label IDs */
  allLabelIds: RiskLabelId[];
  /** Highest single risk level across all categories */
  overallLevel: RiskLevel;
  demoMode: boolean;
  assessedAt: string;
}
