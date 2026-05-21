# agents/ecosystem.config.js
# PM2 configuration for agent services

module.exports = {
 apps: [
 {
 name: 'mcp-xrpl-server',
 script: './mcp-server/server.js',
 cwd: __dirname,
 env: {
 NODE_ENV: 'production',
 PORT: 4101,
 XRPL_NODE: 'wss://xrplcluster.com',
 ISSUER_ADDRESS: 'rJLMSTy77hTxqgDw9WMxCnYC8m5vhqN3FQ'
 },
 instances: 1,
 autorestart: true,
 max_memory_restart: '512M'
 },
 {
 name: 'agent-orchestrator',
 script: './orchestrator/server.js',
 cwd: __dirname,
 env: {
 NODE_ENV: 'production',
 PORT: 4100,
 XRPL_NODE: 'wss://xrplcluster.com',
 COMPLIANCE_URL: 'http://localhost:4025',
 ARBITRAGE_BOT_URL: 'http://localhost:4028',
 X402_GATEWAY: 'http://localhost:4030',
 MAX_POSITION_USD: '10000',
 MAX_DAILY_LOSS: '1000'
 },
 instances: 1,
 autorestart: true,
 max_memory_restart: '512M'
 }
 ]
};
