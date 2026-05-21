import { REPO_URL } from "@/lib/constants";

export type TelegramCommand = {
  command: string;
  action: string;
  label: "PROVEN" | "PIPELINE" | "PROJECTION";
  upstream?: string;
};

export const TELEGRAM_COMMANDS: TelegramCommand[] = [
  {
    command: "/start",
    action: "Welcome + command list",
    label: "PIPELINE",
  },
  {
    command: "/trade [SYMBOL]",
    action: "Dry-run agent trade cycle via orchestrator :4100",
    label: "PROJECTION",
    upstream: "agents/orchestrator",
  },
  {
    command: "/revenue",
    action: "Billing revenue stub from baas-api :8097",
    label: "PROJECTION",
    upstream: "fiat-rails/baas-api",
  },
  {
    command: "/pools",
    action: "Batch pool job status",
    label: "PIPELINE",
    upstream: "fiat-rails/baas-api",
  },
  {
    command: "/agent [id]",
    action: "Register agent stub on BaaS",
    label: "PIPELINE",
    upstream: "fiat-rails/baas-api",
  },
  {
    command: "/deposit [amt]",
    action: "USDC relay deposit stub :4040",
    label: "PIPELINE",
    upstream: "services/usdc-base-relay",
  },
  {
    command: "/withdraw [amt]",
    action: "USDC relay withdraw stub",
    label: "PIPELINE",
    upstream: "services/usdc-base-relay",
  },
  {
    command: "/setprice SYM PRICE",
    action: "BaaS global price stub (admin)",
    label: "PIPELINE",
    upstream: "fiat-rails/baas-api",
  },
];

export const TELEGRAM_ENV_VARS = [
  {
    name: "TELEGRAM_BOT_TOKEN",
    required: true,
    where: "Host .env only — never commit",
    source: "@BotFather → /newbot",
  },
  {
    name: "PORT",
    required: false,
    where: "Default 8443",
    source: "ecosystem.config.js",
  },
  {
    name: "BAAS_API_URL",
    required: false,
    where: "Default http://127.0.0.1:8097",
    source: "fiat-rails/baas-api",
  },
  {
    name: "AGENT_ORCHESTRATOR_URL",
    required: false,
    where: "Default http://127.0.0.1:4100",
    source: "agents/orchestrator",
  },
  {
    name: "USDC_RELAY_URL",
    required: false,
    where: "Default http://127.0.0.1:4040",
    source: "services/usdc-base-relay",
  },
  {
    name: "NEXT_PUBLIC_TELEGRAM_BOT_USERNAME",
    required: false,
    where: "Investor site build only (public deep link)",
    source: "BotFather username without @",
  },
];

export const TELEGRAM_CONNECT_CHECKLIST = [
  {
    id: "botfather",
    text: "Create bot with @BotFather; copy token into host .env as TELEGRAM_BOT_TOKEN",
    done: false,
  },
  {
    id: "baas",
    text: "Start baas-api on :8097 (not :4029 dashboard)",
    done: false,
  },
  {
    id: "pm2",
    text: "pm2 start ecosystem.config.js --only telegram-bot --update-env",
    done: false,
  },
  {
    id: "test",
    text: "In Telegram: /start then /pools — expect PIPELINE/PROJECTION labeled replies",
    done: false,
  },
  {
    id: "pages",
    text: "Set NEXT_PUBLIC_TELEGRAM_BOT_USERNAME at build for Open Telegram CTA",
    done: false,
  },
];

export const TELEGRAM_REPO_PATH = `${REPO_URL}/tree/main/services/telegram-bot`;
