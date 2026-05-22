import type { TruthLabel } from "@/lib/command-center";
import {
  AWS_ACTIVATION_RUNBOOK_URL,
  COMMAND_CENTER_URL,
  DAO_PAGE_URL,
  ECOSYSTEM_HUB_URL,
  MSB_FIAT_RAILS_URL,
  OPERATOR_SEED_PARTNER_URL,
  PAGES_URL,
  REVENUE_PAGE_URL,
  SWIFT_PAGE_URL,
  TELEGRAM_PAGE_URL,
  TROPTIONS_REVENUE_ENGINE_URL,
  X402_GLOBAL_MESH_URL,
  X402_HEALTH,
} from "@/lib/constants";

export type CapabilityRow = {
  capability: string;
  label: TruthLabel;
  how: string;
  doc?: string;
};

export const WHAT_YOU_CAN_DO_NOW: CapabilityRow[] = [
  {
    capability: "Clone monorepo + PM2 floor",
    label: "PROVEN",
    how: "git clone → cp config/multi-gateway.env.template .env → scripts/quickstart.ps1",
    doc: `${PAGES_URL}/technical/QUICKSTART.html`,
  },
  {
    capability: "Verify on-chain issuance (~874M IOUs)",
    label: "PROVEN",
    how: "XRPL issuer rJLMST… + Stellar mirror — PolygonScan KENNY/EVL",
    doc: `${PAGES_URL}/technical/ON_CHAIN_PROOF.html`,
  },
  {
    capability: "Academy + launcher commerce",
    label: "PROVEN",
    how: "fthedu.unykorn.org subscriptions · launch.unykorn.org mint fees",
  },
  {
    capability: "x402 agent meter (public health)",
    label: "PROVEN",
    how: "curl https://x402.unykorn.org/health — Apostle ATP settlement path",
    doc: X402_GLOBAL_MESH_URL,
  },
  {
    capability: "Seed wallets in .env (never commit)",
    label: "PROVEN",
    how: "XRPL_SEED, STELLAR_SECRET, POLYGON keys per .env.example — operator host only",
    doc: OPERATOR_SEED_PARTNER_URL,
  },
  {
    capability: "Batch liquidity pools (BaaS API)",
    label: "PIPELINE",
    how: "fiat-rails/baas-api :8097 — batch-create-pools.ps1 after BAAS_API_KEY",
    doc: `${PAGES_URL}/technical/BAAS_BATCH_POOLS.html`,
  },
  {
    capability: "Arbitrage bot + orchestrator dry-run",
    label: "PIPELINE",
    how: "pm2 start fiat-rails apps · POST /api/v1/arbitrage on :4022",
    doc: `${PAGES_URL}/technical/ARBITRAGE_AND_BAAS.html`,
  },
  {
    capability: "x402 regional gateways (US/EU/JP)",
    label: "PIPELINE",
    how: ":4030 US · :4034 EU · :4035 JP — local sidecar; public mesh is AWS",
    doc: X402_GLOBAL_MESH_URL,
  },
  {
    capability: "Agent orchestrator + MCP",
    label: "PIPELINE",
    how: "agents/orchestrator :4100 · mcp-server :4101 — AWS canonical in runbook",
    doc: `${PAGES_URL}/technical/AGENTIC_RAG_AMM.html`,
  },
  {
    capability: "Telegram operator bot",
    label: "PIPELINE",
    how: "TELEGRAM_BOT_TOKEN in .env → pm2 telegram-bot :8443",
    doc: TELEGRAM_PAGE_URL,
  },
  {
    capability: "Fiat: MSB + partner BIC + nostro",
    label: "PIPELINE",
    how: "Requires institutional partner omnibus — FedWire :4023 · SWIFT :4024",
    doc: SWIFT_PAGE_URL,
  },
  {
    capability: "Booked MSB revenue A–E",
    label: "PROJECTION",
    how: "Issuance fees, float, desk, B2B, WC26 — after first wire in GL",
    doc: TROPTIONS_REVENUE_ENGINE_URL,
  },
];

export type OperatorRoute = {
  route: string;
  title: string;
  label: TruthLabel;
};

export const OPERATOR_ROUTES: OperatorRoute[] = [
  { route: "/", title: "Investor home", label: "PROVEN" },
  { route: "/command-center/", title: "Command Center — ports & activation", label: "PROVEN" },
  { route: "/overview/", title: "What you can do NOW", label: "PROVEN" },
  { route: "/swift/", title: "Institutional fiat rails (SWIFT/FedWire)", label: "PROVEN" },
  { route: "/revenue/", title: "Revenue engine summary", label: "PROVEN" },
  { route: "/telegram/", title: "Telegram operator setup", label: "PROVEN" },
  { route: "/dao/", title: "Sovereign DAO (public)", label: "PROVEN" },
  { route: "/ecosystem/", title: "Ecosystem status hub", label: "PROVEN" },
  { route: "/anthem/", title: "Anthem lyrics", label: "PROVEN" },
  { route: "/mint.html", title: "XRPL mint DApp", label: "PROVEN" },
  { route: "/nft/", title: "TANTHEM NFT gallery", label: "PROVEN" },
  { route: "/technical/index.html", title: "Technical docs hub", label: "PROVEN" },
];

export const OVERVIEW_TECH_DOCS = [
  { title: "Operator seed + partner (paths only)", href: OPERATOR_SEED_PARTNER_URL },
  { title: "What you can do NOW (markdown)", href: `${PAGES_URL}/technical/WHAT_YOU_CAN_DO_NOW.html` },
  { title: "AWS activation runbook", href: AWS_ACTIVATION_RUNBOOK_URL },
  { title: "Agentic RAG + AMM", href: `${PAGES_URL}/technical/AGENTIC_RAG_AMM.html` },
  { title: "BaaS batch pools", href: `${PAGES_URL}/technical/BAAS_BATCH_POOLS.html` },
  { title: "MSB fiat rails", href: MSB_FIAT_RAILS_URL },
  { title: "Partner bank mesh", href: `${PAGES_URL}/technical/PARTNER_BANK_MESH.html` },
  { title: "Telegram operator", href: `${PAGES_URL}/technical/TELEGRAM_OPERATOR.html` },
  { title: "TROPTIONS revenue engine", href: TROPTIONS_REVENUE_ENGINE_URL },
];

export const OVERVIEW_HONESTY = [
  "No $825/hour or $874K/month guaranteed — those figures are PROJECTION from operator activation scripts.",
  "Crypto rails and live URLs are PROVEN in repo/docs; fiat settlement is PIPELINE until partner bank is wired.",
  "Telegram /revenue returns modeled JSON — label PROJECTION until general ledger exists.",
];

export const LIVE_NOW_LINKS = [
  { label: "x402 health", url: X402_HEALTH },
  { label: "Command Center", url: COMMAND_CENTER_URL },
  { label: "Ecosystem hub", url: ECOSYSTEM_HUB_URL },
  { label: "DAO page", url: DAO_PAGE_URL },
  { label: "Revenue summary", url: REVENUE_PAGE_URL },
];
