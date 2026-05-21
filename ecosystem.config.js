/**
 * PM2 ecosystem — TROPTIONS Sovereign Stack
 * Run from repo root: pm2 start ecosystem.config.js
 */
const path = require("path");
const ROOT = __dirname;

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
      env: { DAO_PORT: "8093", L1_RPC_URL: "http://127.0.0.1:9944" },
      autorestart: true,
      out_file: path.join(ROOT, "logs", "dao-service-out.log"),
      err_file: path.join(ROOT, "logs", "dao-service-err.log"),
    },
  ],
};
