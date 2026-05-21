/** Canonical mainnet XRPL wallets — matches Wallet Hub + rwa-realestate registry */
export const TROPTIONS_ISSUER = "rJLMSTy77hTxqgDw9WMxCnYC8m5vhqN3FQ";
export const TROPTIONS_DISTRIBUTION = "rNX4faQ35SdtE4rDoEg8YeVLQKQ57AYyCt";
export const TROPTIONS_AMM_POOL = "rBU6exSQHkrTog6n1F5RX8gzcUrXoniGcp";
export const TROPTIONS_FEE_WALLET =
  process.env.TROPTIONS_XRPL_FEE_WALLET || TROPTIONS_DISTRIBUTION;

export const MIN_ISSUER_XRP_FOR_BATCH = 11;
