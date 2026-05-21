import {
  AWS_ACTIVATION_RUNBOOK_URL,
  ECOSYSTEM_HUB_URL,
  PAGES_URL,
  REPO_URL,
  TELEGRAM_OPERATOR_URL,
  TELEGRAM_PAGE_URL,
  X402_HEALTH,
  X402_GLOBAL_MESH_URL,
} from "@/lib/constants";

export type TruthLabel = "PROVEN" | "PIPELINE" | "PROJECTION";

export type CommandService = {
  name: string;
  port: string;
  path: string;
  health?: string;
  label: TruthLabel;
  note: string;
};

export const COMMAND_SERVICES: CommandService[] = [
  {
    name: "troptions-l1-node",
    port: "9944",
    path: "l1-node/",
    label: "PROVEN",
    note: "Rust L1 RPC — local/operator",
  },
  {
    name: "donk-ai-tutor",
    port: "8090",
    path: "backends/donk/",
    label: "PROVEN",
    note: "Academy AI backend",
  },
  {
    name: "fth-backend",
    port: "8091",
    path: "backends/fth/",
    label: "PROVEN",
    note: "Exchange OS extract backend",
  },
  {
    name: "ttn-launcher",
    port: "8092",
    path: "backends/ttn/",
    label: "PROVEN",
    note: "Sports / TTN",
  },
  {
    name: "dao-service",
    port: "8093",
    path: "dao/",
    label: "PROVEN",
    note: "Governance API",
  },
  {
    name: "x402-gateway (monorepo)",
    port: "4020",
    path: "x402/",
    label: "PIPELINE",
    note: "Local sidecar — public mesh is AWS/UnyKorn",
  },
  {
    name: "baas-api",
    port: "8097",
    path: "fiat-rails/baas-api/",
    health: "http://127.0.0.1:8097/health",
    label: "PIPELINE",
    note: "Agents, pools, billing stubs until MSB live",
  },
  {
    name: "x402-us",
    port: "4030",
    path: "fiat-rails/x402-gateway/",
    label: "PIPELINE",
    note: "Regional US gateway",
  },
  {
    name: "x402-eu",
    port: "4034",
    path: "fiat-rails/x402-gateway-eu/",
    label: "PIPELINE",
    note: "EU gateway — not :4031",
  },
  {
    name: "x402-jp",
    port: "4035",
    path: "fiat-rails/x402-gateway-jp/",
    label: "PIPELINE",
    note: "JP gateway",
  },
  {
    name: "agent-orchestrator",
    port: "4100",
    path: "agents/orchestrator/",
    label: "PIPELINE",
    note: "AWS canonical orchestrator",
  },
  {
    name: "mcp-server",
    port: "4101",
    path: "agents/mcp-server/",
    label: "PIPELINE",
    note: "MCP stub — not EU x402",
  },
  {
    name: "usdc-base-relay",
    port: "4040",
    path: "services/usdc-base-relay/",
    health: "http://127.0.0.1:4040/health",
    label: "PIPELINE",
    note: "Base → XRPL bridge stub",
  },
  {
    name: "telegram-bot",
    port: "8443",
    path: "services/telegram-bot/",
    label: "PIPELINE",
    note: "Operator bot — token required",
  },
];

export const COMMAND_EXTERNAL = [
  {
    label: "x402 public health",
    url: X402_HEALTH,
    status: "PROVEN" as const,
  },
  {
    label: "Investor site (Pages)",
    url: PAGES_URL,
    status: "PROVEN" as const,
  },
  {
    label: "Ecosystem status hub",
    url: ECOSYSTEM_HUB_URL,
    status: "PROVEN" as const,
  },
  {
    label: "GitHub monorepo",
    url: REPO_URL,
    status: "PROVEN" as const,
  },
];

export const COMMAND_ACTIVATION = [
  {
    step: "Clone & env",
    cmd: "git clone https://github.com/FTHTrading/Troptions-full-pack.git && cd Troptions-full-pack && cp config/multi-gateway.env.template .env",
    label: "PROVEN" as TruthLabel,
  },
  {
    step: "PM2 floor (no secrets in repo)",
    cmd: "pm2 start ecosystem.config.js --only payment-orchestrator,compliance-engine,baas-api,x402-us,agent-orchestrator,usdc-base-relay",
    label: "PIPELINE" as TruthLabel,
  },
  {
    step: "Revenue activation script",
    cmd: "./scripts/activate-revenue.sh",
    label: "PIPELINE" as TruthLabel,
  },
  {
    step: "Telegram bot (after TELEGRAM_BOT_TOKEN in .env)",
    cmd: "pm2 start ecosystem.config.js --only telegram-bot --update-env",
    label: "PIPELINE" as TruthLabel,
  },
];

export const COMMAND_DOC_LINKS = [
  { title: "AWS activation runbook", href: AWS_ACTIVATION_RUNBOOK_URL },
  { title: "x402 global mesh", href: X402_GLOBAL_MESH_URL },
  { title: "Telegram setup", href: TELEGRAM_PAGE_URL },
  { title: "Telegram operator (token security)", href: TELEGRAM_OPERATOR_URL },
  { title: "ACTIVATE_NOW.md", href: `${REPO_URL}/blob/main/ACTIVATE_NOW.md` },
];
