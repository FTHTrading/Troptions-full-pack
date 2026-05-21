/**
 * PM2 ecosystem — TROPTIONS full AWS activation (17+ services)
 * Run from repo root: pm2 start ecosystem.config.js
 * All agent/x402 revenue: PIPELINE / PROJECTION until MSB + live exchange.
 */
const path = require('path');

const ROOT = __dirname;
const FIAT = path.join(ROOT, 'fiat-rails');
const AGENTS = path.join(ROOT, 'agents');
const SERVICES = path.join(ROOT, 'services');

function pm2Log(name) {
  return {
    out_file: path.join(ROOT, 'logs', `${name}-out.log`),
    err_file: path.join(ROOT, 'logs', `${name}-err.log`),
    merge_logs: true,
  };
}

function fiatApp(name, scriptPath, port, extraEnv = {}) {
  return {
    name,
    script: scriptPath,
    cwd: FIAT,
    env: {
      PORT: String(port),
      NODE_PATH: path.join(FIAT, 'node_modules'),
      ...extraEnv,
    },
    autorestart: false,
    ...pm2Log(name),
  };
}

module.exports = {
  apps: [
    {
      name: 'troptions-l1-node',
      script: process.env.L1_NODE_BIN || 'C:\\cargo-target-burnzy\\release\\troptions-node.exe',
      args: process.env.L1_PORT || '9944',
      cwd: ROOT,
      autorestart: true,
      restart_delay: 5000,
      env: { RUST_LOG: 'info' },
      ...pm2Log('troptions-l1-node'),
    },
    {
      name: 'donk-ai-tutor',
      script: 'main.py',
      interpreter: 'python',
      cwd: path.join(ROOT, 'ai', 'donk-tutor'),
      env: { DONK_PORT: '8090' },
      autorestart: true,
    },
    {
      name: 'fth-backend',
      script: 'main.py',
      interpreter: 'python',
      cwd: path.join(ROOT, 'backend', 'fth-academy'),
      env: { FTH_PORT: '8091', L1_RPC_URL: 'http://127.0.0.1:9944' },
      autorestart: true,
    },
    {
      name: 'ttn-launcher',
      script: 'main.py',
      interpreter: 'python',
      cwd: path.join(ROOT, 'backend', 'ttn-launcher'),
      env: { TTN_PORT: '8092' },
      autorestart: true,
    },
    {
      name: 'dao-service',
      script: 'main.py',
      interpreter: 'python',
      cwd: path.join(ROOT, 'backend', 'dao-service'),
      env: { DAO_PORT: '8093', L1_RPC_URL: 'http://127.0.0.1:9944', X402_GATEWAY_URL: 'http://127.0.0.1:4020' },
      autorestart: true,
      ...pm2Log('dao-service'),
    },
    {
      name: 'x402-gateway',
      script: 'main.py',
      interpreter: 'python',
      cwd: path.join(ROOT, 'backend', 'x402-gateway'),
      env: { PORT: '4020', X402_MODE: process.env.X402_MODE || 'staged', APOSTLE_URL: 'http://127.0.0.1:7332' },
      autorestart: true,
      ...pm2Log('x402-gateway'),
    },
    {
      name: 'popeye-relay',
      script: 'main.py',
      interpreter: 'python',
      cwd: path.join(ROOT, 'backend', 'popeye-relay'),
      env: { POPEYE_PORT: '4021', L1_RPC_URL: 'http://127.0.0.1:9944' },
      autorestart: true,
    },
    fiatApp('payment-orchestrator', './orchestrator/index.js', 4022),
    fiatApp('fedwire-adapter', './fedwire-adapter/server.js', 4023),
    fiatApp('swift-bridge', './swift-bridge/app.js', 4024),
    fiatApp('compliance-engine', './compliance-engine/main.py', 4025),
    fiatApp('neobank-api', './neobank-api/server.js', 4026),
    fiatApp('iou-reserve-monitor', './iou-reserve-monitor/monitor.js', 4027),
    fiatApp('arbitrage-bot', './arbitrage-bot/index.js', 4028, {
      DRY_RUN: 'true',
      X402_US_URL: 'http://127.0.0.1:4030',
      X402_EU_URL: 'http://127.0.0.1:4034',
      X402_JP_URL: 'http://127.0.0.1:4035',
    }),
    {
      name: 'baas-dashboard',
      script: 'server.js',
      cwd: path.join(FIAT, 'baas-dashboard'),
      env: {
        PORT: '4029',
        BAAS_API_URL: 'http://127.0.0.1:8097',
        NODE_PATH: path.join(FIAT, 'node_modules'),
      },
      autorestart: false,
      ...pm2Log('baas-dashboard'),
    },
    {
      name: 'baas-api',
      script: 'index.js',
      cwd: path.join(FIAT, 'baas-api'),
      env: {
        PORT: '8097',
        NODE_PATH: path.join(FIAT, 'node_modules'),
        X402_GATEWAY_URL: 'http://127.0.0.1:4030',
        ORCHESTRATOR_URL: 'http://127.0.0.1:4022',
      },
      autorestart: false,
      ...pm2Log('baas-api'),
    },
    {
      name: 'x402-us',
      script: 'server.js',
      cwd: path.join(FIAT, 'x402-gateway'),
      env: {
        PORT: '4030',
        REGION: 'us',
        NODE_PATH: path.join(FIAT, 'node_modules'),
        EXCHANGE_OS_URL: 'http://127.0.0.1:8091',
        BAAS_URL: 'http://127.0.0.1:8097',
      },
      autorestart: false,
      ...pm2Log('x402-us'),
    },
    {
      name: 'x402-eu',
      script: 'server.js',
      cwd: path.join(FIAT, 'x402-gateway-eu'),
      env: {
        PORT: '4034',
        REGION: 'eu',
        BASE_CURRENCY: 'EUR',
        NODE_PATH: path.join(FIAT, 'node_modules'),
        EXCHANGE_OS_URL: 'http://127.0.0.1:8091',
      },
      autorestart: false,
      ...pm2Log('x402-eu'),
    },
    {
      name: 'x402-jp',
      script: 'server.js',
      cwd: path.join(FIAT, 'x402-gateway-jp'),
      env: {
        PORT: '4035',
        REGION: 'jp',
        BASE_CURRENCY: 'JPY',
        NODE_PATH: path.join(FIAT, 'node_modules'),
        EXCHANGE_OS_URL: 'http://127.0.0.1:8091',
      },
      autorestart: false,
      ...pm2Log('x402-jp'),
    },
    {
      name: 'agent-orchestrator-legacy',
      script: 'server.js',
      cwd: path.join(FIAT, 'agent-orchestrator'),
      env: {
        PORT: '4031',
        DRY_RUN: 'true',
        MCP_URL: 'http://127.0.0.1:4101',
        ARBITRAGE_URL: 'http://127.0.0.1:4028',
        COMPLIANCE_URL: 'http://127.0.0.1:4025',
        X402_US_URL: 'http://127.0.0.1:4030',
        X402_EU_URL: 'http://127.0.0.1:4034',
        X402_JP_URL: 'http://127.0.0.1:4035',
        BAAS_API_URL: 'http://127.0.0.1:8097',
      },
      autorestart: false,
      ...pm2Log('agent-orchestrator-legacy'),
    },
    {
      name: 'agent-orchestrator',
      script: 'server.js',
      cwd: path.join(AGENTS, 'orchestrator'),
      env: {
        PORT: '4100',
        DRY_RUN: 'true',
        MCP_URL: 'http://127.0.0.1:4101',
        ARBITRAGE_URL: 'http://127.0.0.1:4028',
        COMPLIANCE_URL: 'http://127.0.0.1:4025',
        X402_US_URL: 'http://127.0.0.1:4030',
        BAAS_API_URL: 'http://127.0.0.1:8097',
      },
      autorestart: false,
      ...pm2Log('agent-orchestrator'),
    },
    {
      name: 'mcp-server',
      script: 'server.js',
      cwd: path.join(AGENTS, 'mcp-server'),
      env: { PORT: '4101' },
      autorestart: false,
      ...pm2Log('mcp-server'),
    },
    {
      name: 'usdc-base-relay',
      script: 'index.js',
      cwd: path.join(SERVICES, 'usdc-base-relay'),
      env: { PORT: '4040', BASE_CHAIN_ID: '8453' },
      autorestart: false,
      ...pm2Log('usdc-base-relay'),
    },
    {
      name: 'telegram-bot',
      script: 'bot.js',
      cwd: path.join(SERVICES, 'telegram-bot'),
      env: {
        PORT: '8443',
        BAAS_API_URL: 'http://127.0.0.1:8097',
        AGENT_ORCHESTRATOR_URL: 'http://127.0.0.1:4100',
        USDC_RELAY_URL: 'http://127.0.0.1:4040',
      },
      autorestart: true,
      ...pm2Log('telegram-bot'),
    },
  ],
};
