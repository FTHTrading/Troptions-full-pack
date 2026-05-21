import { XRPL_AMM_POOL_REGISTRY } from "@/content/troptions/xrplAmmPoolRegistry";
import { XRPL_DEPENDENCY_SECURITY_REGISTRY } from "@/content/troptions/xrplDependencySecurityRegistry";
import { XRPL_EXTERNAL_LINKS_REGISTRY } from "@/content/troptions/xrplExternalLinksRegistry";
import { XRPL_ISSUED_ASSET_REGISTRY } from "@/content/troptions/xrplIssuedAssetRegistry";
import { XRPL_MARKET_DATA_REGISTRY } from "@/content/troptions/xrplMarketDataRegistry";
import { XRPL_ORDER_BOOK_REGISTRY } from "@/content/troptions/xrplOrderBookRegistry";
import { XRPL_TRADE_READINESS_REGISTRY } from "@/content/troptions/xrplTradeReadinessRegistry";
import { XRPL_TRUSTLINE_REGISTRY } from "@/content/troptions/xrplTrustlineRegistry";

export const XRPL_LIVE_PLATFORM_REGISTRY = {
  positioning: {
    title: "XRPL Market Data, AMM, and DEX Readiness",
    summary:
      "Troptions adds an XRPL market-data and route-simulation layer for order books, AMM pools, issued assets, trustlines, and pathfinding. Mainnet trading remains blocked by default. Testnet labs and unsigned transaction payloads are used for validation until external signer, custody, compliance, and board approvals are complete.",
  },
  allowedReadOnlyMethods: ["book_offers", "gateway_balances", "account_lines", "amm_info", "path_find", "ripple_path_find"] as const,
  blockedByDefault: [
    "mainnet OfferCreate",
    "mainnet Payment submission",
    "mainnet AMMCreate",
    "mainnet AMMDeposit",
    "mainnet AMMWithdraw",
    "mainnet wallet signing",
    "private key import",
    "seed import",
    "family seed import",
    "mnemonic import",
    "automated live trading",
    "market manipulation",
    "wash trading",
    "spoofing",
    "layering",
    "front-running",
  ] as const,
  endpoints: {
    mainnet: "https://s1.ripple.com:51234/",
    testnet: "https://s.altnet.rippletest.net:51234/",
    devnet: "https://s.devnet.rippletest.net:51234/",
  },
  marketData: XRPL_MARKET_DATA_REGISTRY,
  orderBooks: XRPL_ORDER_BOOK_REGISTRY,
  ammPools: XRPL_AMM_POOL_REGISTRY,
  issuedAssets: XRPL_ISSUED_ASSET_REGISTRY,
  trustlines: XRPL_TRUSTLINE_REGISTRY,
  readiness: XRPL_TRADE_READINESS_REGISTRY,
  dependencySecurity: XRPL_DEPENDENCY_SECURITY_REGISTRY,
  links: XRPL_EXTERNAL_LINKS_REGISTRY,
} as const;