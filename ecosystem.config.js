/**
 * PM2 ecosystem — TROPTIONS Sovereign Stack
 * Run from repo root: pm2 start ecosystem.config.js
 */
const path = require("path");
const ROOT = __dirname;
const FIAT = path.join(ROOT, "fiat-rails");

function fiatApp(name, port, script = "server.js") {
  return {
    name,
    script,
    cwd: path.join(FIAT, name),
    env: { PORT: String(port), NODE_PATH: path.join(FIAT, "node_modules") },
    autorestart: false,
    out_file: path.join(ROOT, "logs", `${name}-out.log`),
    err_file: path.join(ROOT, "logs", `${name}-err.log`),
    merge_logs: true,
  };
}

module.exports = {
  apps: [
    {
      name: "troptions-l1-node",
      script: process.env.L1_NODE_BIN || "C:\\cargo-target-burnzy\\release\\troptions-node.exe",
      args: process.env.L1_PORT || "9944",
      cwd: ROOT,
      exec_mode: "fork",
      autorestart: true,
      restart_delay: 5000,
      max_restarts: 10,
      min_uptime: "10s",
      env: { RUST_LOG: "info" },
      out_file: path.join(ROOT, "logs", "troptions-l1-node-out.log"),
      err_file: path.join(ROOT, "logs", "troptions-l1-node-err.log"),
      merge_logs: true,
    },
    {
      name: "donk-ai-tutor",
      script: "main.py",
      interpreter: "python",
      cwd: path.join(ROOT, "ai", "donk-tutor"),
      env: { DONK_PORT: "8090" },
      autorestart: true,
    },
    {
      name: "fth-backend",
      script: "main.py",
      interpreter: "python",
      cwd: path.join(ROOT, "backend", "fth-academy"),
      env: { FTH_PORT: "8091", L1_RPC_URL: "http://127.0.0.1:9944" },
      autorestart: true,
    },
    {
      name: "ttn-launcher",
      script: "main.py",
      interpreter: "python",
      cwd: path.join(ROOT, "backend", "ttn-launcher"),
      env: { TTN_PORT: "8092" },
      autorestart: true,
    },
    {
      name: "dao-service",
      script: "main.py",
      interpreter: "python",
      cwd: path.join(ROOT, "backend", "dao-service"),
      env: { DAO_PORT: "8093", L1_RPC_URL: "http://127.0.0.1:9944", X402_GATEWAY_URL: "http://127.0.0.1:4020" },
      autorestart: true,
      out_file: path.join(ROOT, "logs", "dao-service-out.log"),
      err_file: path.join(ROOT, "logs", "dao-service-err.log"),
    },
    {
      name: "x402-gateway",
      script: "main.py",
      interpreter: "python",
      cwd: path.join(ROOT, "backend", "x402-gateway"),
      env: { PORT: "4020", X402_MODE: process.env.X402_MODE || "staged", APOSTLE_URL: "http://127.0.0.1:7332" },
      autorestart: true,
    },
    {
      name: "popeye-relay",
      script: "main.py",
      interpreter: "python",
      cwd: path.join(ROOT, "backend", "popeye-relay"),
      env: { POPEYE_PORT: "4021", L1_RPC_URL: "http://127.0.0.1:9944" },
      autorestart: true,
    },
    // PIPELINE — post-MSB fiat rails (fiat-rails/); autorestart false until bank credentials wired
    fiatApp("payment-orchestrator", 4022),
    fiatApp("fedwire-adapter", 4023),
    fiatApp("swift-bridge", 4024),
    fiatApp("compliance-engine", 4025),
    fiatApp("neobank-api", 4026),
    fiatApp("iou-reserve-monitor", 4027),
  ],
};
