// TROPTIONS Exchange OS — Feature Flags
// All production features default to DEMO unless env vars are set.

export const features = {
  // Core trading
  liveTrading: process.env.XRPL_MAINNET_ENABLED === "true",
  swapEnabled: true,             // UI always renders; execution requires live trading
  ammEnabled: true,
  orderBookEnabled: true,
  tokenLaunchEnabled: true,      // Wizard UI always; mainnet submit requires live trading

  // x402 services
  x402Enabled: process.env.X402_ENABLED === "true",
  x402AiReports: process.env.X402_ENABLED === "true",
  x402DevApi: process.env.X402_ENABLED === "true",

  // Rewards
  creatorRewardsEnabled: process.env.TROPTIONS_CREATOR_REWARD_WALLET !== undefined && process.env.TROPTIONS_CREATOR_REWARD_WALLET !== "",
  referralRewardsEnabled: process.env.TROPTIONS_REFERRAL_WALLET !== undefined && process.env.TROPTIONS_REFERRAL_WALLET !== "",
  sponsorCampaignsEnabled: true, // UI always; payouts require production config

  // Voice
  voiceEnabled: process.env.DEEPGRAM_API_KEY !== undefined && process.env.DEEPGRAM_API_KEY !== "",
  wwaiVoiceEnabled: process.env.DEEPGRAM_API_KEY !== undefined && process.env.DEEPGRAM_API_KEY !== "",

  // CRM / leads
  crmWebhookEnabled: process.env.TROPTIONS_CRM_WEBHOOK_URL !== undefined && process.env.TROPTIONS_CRM_WEBHOOK_URL !== "",

  // Admin
  adminEnabled: true,
  proofPacketsEnabled: true,

  // Demo mode — disabled; live XRPL data is used throughout
  demoMode: false,
} as const;

export type FeatureKey = keyof typeof features;
