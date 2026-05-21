// TROPTIONS Exchange OS — Risk Label Definitions

export type RiskLevel = "none" | "low" | "medium" | "high" | "critical";

export interface RiskLabel {
  id: string;
  label: string;
  level: RiskLevel;
  color: "green" | "cyan" | "gold" | "orange" | "red" | "slate";
  description: string;
  /** Plain-English explanation for beginners */
  plainEnglish: string;
}

export const RISK_LABELS: Record<string, RiskLabel> = {
  DEMO_TOKEN: {
    id: "DEMO_TOKEN",
    label: "Demo Token",
    level: "none",
    color: "slate",
    description: "This is demo/simulated data, not a real token.",
    plainEnglish: "This token is simulated for demonstration only.",
  },
  UNVERIFIED_ISSUER: {
    id: "UNVERIFIED_ISSUER",
    label: "Unverified Issuer",
    level: "high",
    color: "orange",
    description: "Issuer identity has not been verified by TROPTIONS.",
    plainEnglish: "We have not checked who made this token. Be careful.",
  },
  VERIFIED_ISSUER: {
    id: "VERIFIED_ISSUER",
    label: "Verified Issuer",
    level: "none",
    color: "green",
    description: "Issuer identity has been verified through TROPTIONS registry.",
    plainEnglish: "The creator of this token has been verified.",
  },
  LOW_LIQUIDITY: {
    id: "LOW_LIQUIDITY",
    label: "Low Liquidity",
    level: "medium",
    color: "orange",
    description: "This token has limited trading liquidity. Slippage may be high.",
    plainEnglish: "Not many people are trading this token right now. Your price may shift.",
  },
  NEW_LAUNCH: {
    id: "NEW_LAUNCH",
    label: "New Launch",
    level: "medium",
    color: "cyan",
    description: "Token was recently launched. Higher volatility and risk expected.",
    plainEnglish: "This token is brand new. New tokens can be risky.",
  },
  FREEZE_ENABLED: {
    id: "FREEZE_ENABLED",
    label: "Freeze Enabled",
    level: "medium",
    color: "orange",
    description: "Issuer can freeze token transfers for this account.",
    plainEnglish: "The creator can stop you from moving this token.",
  },
  CLAWBACK_ENABLED: {
    id: "CLAWBACK_ENABLED",
    label: "Clawback Enabled",
    level: "high",
    color: "red",
    description: "Issuer can claw back tokens from your wallet.",
    plainEnglish: "The creator can take tokens back from your wallet.",
  },
  TRUSTLINE_REQUIRED: {
    id: "TRUSTLINE_REQUIRED",
    label: "Trustline Required",
    level: "low",
    color: "cyan",
    description: "You must set a trustline before you can hold this token.",
    plainEnglish: "You need to give your wallet permission to hold this token first.",
  },
  HIGH_VOLATILITY: {
    id: "HIGH_VOLATILITY",
    label: "High Volatility",
    level: "high",
    color: "red",
    description: "Price has moved significantly. Risk of rapid loss.",
    plainEnglish: "This token's price moves a lot. You could lose money quickly.",
  },
  SPONSORED_ASSET: {
    id: "SPONSORED_ASSET",
    label: "Sponsored Asset",
    level: "none",
    color: "gold",
    description: "This token is part of an active sponsor campaign.",
    plainEnglish: "A sponsor is promoting this token.",
  },
  PRODUCTION_VERIFIED: {
    id: "PRODUCTION_VERIFIED",
    label: "Production Verified",
    level: "none",
    color: "green",
    description: "Token and issuer have passed TROPTIONS production verification.",
    plainEnglish: "This token passed our full verification check.",
  },
  MAINNET_DISABLED: {
    id: "MAINNET_DISABLED",
    label: "Mainnet Disabled",
    level: "none",
    color: "slate",
    description: "Mainnet execution is disabled. Transactions are prepared but not submitted.",
    plainEnglish: "We can show you what a transaction would look like, but it won't be sent.",
  },
  MAINNET_ENABLED: {
    id: "MAINNET_ENABLED",
    label: "Mainnet Enabled",
    level: "low",
    color: "green",
    description: "Mainnet is enabled. Real transactions can be prepared and signed.",
    plainEnglish: "Real XRPL mainnet is active. Signed transactions will be real.",
  },
};

export type RiskLabelId = keyof typeof RISK_LABELS;
