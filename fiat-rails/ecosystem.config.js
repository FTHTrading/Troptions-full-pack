// Fiat Rails PM2 Configuration
// Add these to your main ecosystem.config.cjs or run separately

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
 ISSUER_ADDRESS: 'rJLMSTy77hTxqgDw9WMxCnYC8m5vhqN3FQ'
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
 ORCHESTRATOR_URL: 'http://localhost:4022'
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
 ORCHESTRATOR_URL: 'http://localhost:4022'
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
 ISSUER_ADDRESS: 'rJLMSTy77hTxqgDw9WMxCnYC8m5vhqN3FQ'
 },
 instances: 1,
 autorestart: true,
 max_memory_restart: '128M'
 },
 {
 name: 'arbitrage-bot',
 script: './arbitrage-bot/bot.js',
 cwd: __dirname,
 env: {
 PORT: 4028
 },
 instances: 1,
 autorestart: true,
 max_memory_restart: '256M'
 },
 {
 name: 'baas-dashboard',
 script: './baas-dashboard/dashboard.js',
 cwd: __dirname,
 env: {
 PORT: 4029
 },
 instances: 1,
 autorestart: true,
 max_memory_restart: '256M'
 }
 ]
};
