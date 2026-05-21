// Fiat Rails PM2 Configuration v2.0
// Updated with arbitrage-bot, baas-dashboard, and x402-gateway

module.exports = {
 apps: [
 {
 name: 'payment-orchestrator',
 script: './orchestrator/index.js',
 cwd: __dirname,
 env: {
 NODE_ENV: 'production',
 PORT: 4022,
 COMPLIANCE_URL: 'http://localhost:4025',
 FEDWIRE_ADAPTER: 'http://localhost:4023',
 SWIFT_BRIDGE: 'http://localhost:4024',
 ISSUER_ADDRESS: 'rJLMSTy77hTxqgDw9WMxCnYC8m5vhqN3FQ',
 EXCHANGE_OS_URL: 'http://localhost:8091'
 },
 instances: 1,
 autorestart: true,
 max_memory_restart: '512M',
 log_file: './logs/orchestrator.log'
 },
 {
 name: 'fedwire-adapter',
 script: './fedwire-adapter/server.js',
 cwd: __dirname,
 env: {
 PORT: 4023,
 ORCHESTRATOR_URL: 'http://localhost:4022',
 BANK_FEDWIRE_ENDPOINT: '${BANK_FEDWIRE_ENDPOINT}',
 BANK_CERT_PATH: '${BANK_CERT_PATH}'
 },
 instances: 1,
 autorestart: true,
 max_memory_restart: '256M'
 },
 {
 name: 'swift-bridge',
 script: './swift-bridge/app.js',
 cwd: __dirname,
 env: {
 PORT: 4024,
 SWIFT_BIC: '${SWIFT_BIC}',
 SWIFT_BUREAU_URL: '${SWIFT_BUREAU_URL}',
 SWIFT_CERT_PATH: '${SWIFT_CERT_PATH}',
 ORCHESTRATOR_URL: 'http://localhost:4022'
 },
 instances: 1,
 autorestart: true,
 max_memory_restart: '256M'
 },
 {
 name: 'compliance-engine',
 script: './compliance-engine/main.py',
 interpreter: 'python',
 cwd: __dirname,
 env: {
 PORT: 4025,
 OFAC_DATA_PATH: './data/sdn.csv',
 PYTHONUNBUFFERED: '1'
 },
 instances: 1,
 autorestart: true,
 max_memory_restart: '256M'
 },
 {
 name: 'neobank-api',
 script: './neobank-api/server.js',
 cwd: __dirname,
 env: {
 PORT: 4026,
 ORCHESTRATOR_URL: 'http://localhost:4022',
 CARD_ISSUER_API_KEY: '${CARD_ISSUER_API_KEY}',
 CARD_PROGRAM_ID: '${CARD_PROGRAM_ID}'
 },
 instances: 1,
 autorestart: true,
 max_memory_restart: '256M'
 },
 {
 name: 'iou-reserve-monitor',
 script: './iou-reserve-monitor/monitor.js',
 cwd: __dirname,
 env: {
 PORT: 4027,
 ISSUER_ADDRESS: 'rJLMSTy77hTxqgDw9WMxCnYC8m5vhqN3FQ',
 ALERT_EMAIL: 'ops@fthtrading.com'
 },
 instances: 1,
 autorestart: true,
 max_memory_restart: '128M'
 },
 {
 name: 'arbitrage-bot',
 script: './arbitrage-bot/index.js',
 cwd: __dirname,
 env: {
 PORT: 4028,
 X402_GATEWAY_URL: 'http://localhost:4030',
 ORCHESTRATOR_URL: 'http://localhost:4022',
 COMPLIANCE_URL: 'http://localhost:4025',
 WATCH_PAIRS: 'ALEX/USD-IOU,ALEX/EUR-IOU,XAU/USD-IOU',
 MIN_SPREAD_BPS: 5,
 MAX_POSITION_USD: 10000,
 PROFIT_REINVEST_RATIO: 0.8
 },
 instances: 1,
 autorestart: true,
 max_memory_restart: '256M'
 },
 {
 name: 'baas-dashboard',
 script: './baas-dashboard/server.js',
 cwd: __dirname,
 env: {
 PORT: 4029,
 ORCHESTRATOR_URL: 'http://localhost:4022',
 EXCHANGE_OS_URL: 'http://localhost:8091'
 },
 instances: 1,
 autorestart: true,
 max_memory_restart: '256M'
 },
 {
 name: 'x402-gateway-v2',
 script: './x402-gateway/server.js',
 cwd: __dirname,
 env: {
 PORT: 4030,
 EXCHANGE_OS_URL: 'http://localhost:8091',
 NEOBANK_URL: 'http://localhost:4026',
 BAAS_URL: 'http://localhost:4029'
 },
 instances: 1,
 autorestart: true,
 max_memory_restart: '256M'
 },
 {
 name: 'baas-api',
 script: './baas-api/index.js',
 cwd: __dirname,
 env: {
 NODE_ENV: 'production',
 PORT: 8097,
 ORCHESTRATOR_URL: 'http://localhost:4022',
 X402_GATEWAY_URL: 'http://localhost:4030'
 },
 instances: 1,
 autorestart: true,
 max_memory_restart: '256M',
 log_file: './logs/baas-api.log'
 },
 {
 name: 'agent-orchestrator',
 script: './agent-orchestrator/index.js',
 cwd: __dirname,
 env: {
 PORT: 4031,
 DRY_RUN: 'true',
 MCP_XRPL_URL: 'http://localhost:4032',
 ARBITRAGE_URL: 'http://localhost:4028',
 COMPLIANCE_URL: 'http://localhost:4025',
 X402_GATEWAY_URL: 'http://localhost:4030',
 ORCHESTRATOR_URL: 'http://localhost:4022',
 BAAS_API_URL: 'http://localhost:8097'
 },
 instances: 1,
 autorestart: true,
 max_memory_restart: '256M',
 log_file: './logs/agent-orchestrator.log'
 }
 ]
};
