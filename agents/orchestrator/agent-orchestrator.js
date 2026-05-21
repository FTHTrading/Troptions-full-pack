// agents/orchestrator/agent-orchestrator.js
// Main orchestrator for AI trading agents
// Coordinates Research, Risk, and Execution agents

const { MCPXrplServer } = require('../mcp-server/server');
const axios = require('axios');

class AgentOrchestrator {
 constructor(config) {
 this.config = config;
 this.mcpServer = null;
 this.agents = new Map();
 this.positions = new Map();
 this.tradeHistory = [];
 }

 async initialize() {
 console.log('[Orchestrator] Initializing...');
 
 // Connect to MCP server
 this.mcpServer = new MCPXrplServer({
 xrplNode: this.config.xrplNode,
 issuerSeed: this.config.issuerSeed,
 complianceUrl: this.config.complianceUrl,
 arbitrageBotUrl: this.config.arbitrageBotUrl
 });
 await this.mcpServer.connect();
 
 console.log('[Orchestrator] MCP server connected');
 
 // Initialize agents
 await this.initializeAgents();
 
 console.log('[Orchestrator] Ready');
 }

 async initializeAgents() {
 // Research Agent
 this.agents.set('research', new ResearchAgent({
 mcpServer: this.mcpServer,
 x402Gateway: this.config.x402Gateway
 }));
 
 // Risk Agent
 this.agents.set('risk', new RiskAgent({
 mcpServer: this.mcpServer,
 maxPositionUsd: this.config.maxPositionUsd || 10000,
 maxDailyLoss: this.config.maxDailyLoss || 1000
 }));
 
 // Execution Agent
 this.agents.set('execution', new ExecutionAgent({
 mcpServer: this.mcpServer,
 x402Gateway: this.config.x402Gateway,
 arbitrageBotUrl: this.config.arbitrageBotUrl
 }));
 
 console.log('[Orchestrator] Agents initialized:', Array.from(this.agents.keys()));
 }

 async executeTradeCycle(symbol) {
 console.log(`\n[Orchestrator] === Trade Cycle: ${symbol} ===`);
 
 try {
 // Step 1: Research — gather market context
 console.log('[Orchestrator] Step 1: Research');
 const marketContext = await this.agents.get('research').analyze(symbol);
 console.log('[Orchestrator] Market context:', marketContext);
 
 // Step 2: Risk Assessment
 console.log('[Orchestrator] Step 2: Risk Assessment');
 const riskAssessment = await this.agents.get('risk').assess({
 symbol,
 marketContext,
 currentPositions: this.positions
 });
 console.log('[Orchestrator] Risk:', riskAssessment);
 
 if (!riskAssessment.approved) {
 console.log('[Orchestrator] Trade REJECTED by risk agent');
 return { status: 'rejected', reason: riskAssessment.reason };
 }
 
 // Step 3: Execution
 console.log('[Orchestrator] Step 3: Execution');
 const tradeResult = await this.agents.get('execution').execute({
 symbol,
 marketContext,
 riskParams: riskAssessment,
 agentId: 'orchestrator-001'
 });
 
 if (tradeResult.success) {
 this.recordTrade(tradeResult);
 console.log('[Orchestrator] Trade EXECUTED:', tradeResult.tx_hash);
 } else {
 console.log('[Orchestrator] Execution FAILED:', tradeResult.error);
 }
 
 return tradeResult;
 
 } catch (err) {
 console.error('[Orchestrator] Trade cycle error:', err);
 return { status: 'error', error: err.message };
 }
 }

 recordTrade(trade) {
 this.tradeHistory.push({
 ...trade,
 timestamp: new Date().toISOString()
 });
 
 // Update positions
 if (!this.positions.has(trade.symbol)) {
 this.positions.set(trade.symbol, {
 size: 0,
 avgEntry: 0,
 unrealizedPnl: 0
 });
 }
 
 const pos = this.positions.get(trade.symbol);
 pos.size += trade.size;
 pos.avgEntry = (pos.avgEntry * (pos.size - trade.size) + trade.price * trade.size) / pos.size;
 }

 getStatus() {
 return {
 agents: Array.from(this.agents.keys()),
 positions: Object.fromEntries(this.positions),
 tradesToday: this.tradeHistory.filter(t => 
 t.timestamp >= new Date().toISOString().split('T')[0]
 ).length,
 totalTrades: this.tradeHistory.length
 };
 }
}

// Research Agent — gathers real-time market context
class ResearchAgent {
 constructor(config) {
 this.mcpServer = config.mcpServer;
 this.x402Gateway = config.x402Gateway;
 }

 async analyze(symbol) {
 console.log(`[Research] Analyzing ${symbol}...`);
 
 try {
 // Get orderbook (paying x402 fee)
 const orderbook = await this.getOrderbookWithPayment(symbol);
 
 // Get AMM info
 const ammInfo = await this.mcpServer.handleRequest('get_amm_info', {
 asset1: { currency: symbol, issuer: process.env.ISSUER_ADDRESS },
 asset2: { currency: 'USD', issuer: process.env.ISSUER_ADDRESS }
 });
 
 // Get token balance
 const balance = await this.mcpServer.handleRequest('get_token_balance', {
 account: process.env.ISSUER_ADDRESS,
 currency: symbol,
 issuer: process.env.ISSUER_ADDRESS
 });
 
 return {
 symbol,
 orderbook,
 ammInfo,
 balance,
 timestamp: new Date().toISOString(),
 recommendation: this.generateRecommendation(orderbook, ammInfo)
 };
 
 } catch (err) {
 console.error('[Research] Analysis failed:', err);
 return { error: err.message };
 }
 }

 async getOrderbookWithPayment(symbol) {
 // Call x402-gated endpoint
 try {
 const response = await axios.get(`${this.x402Gateway}/x402/market-data/orderbook`, {
 params: { base: symbol, counter: 'USD-IOU' },
 headers: { 'X-402-Wallet-Address': process.env.AGENT_WALLET },
 timeout: 5000
 });
 return response.data;
 } catch (err) {
 if (err.response?.status === 402) {
 // Pay invoice and retry
 console.log('[Research] Paying x402 invoice for data...');
 // Implementation would pay invoice here
 return this.getOrderbookWithPayment(symbol); // Retry
 }
 throw err;
 }
 }

 generateRecommendation(orderbook, ammInfo) {
 const bestBid = orderbook.bids?.[0];
 const bestAsk = orderbook.asks?.[0];
 
 if (!bestBid || !bestAsk) return 'HOLD';
 
 const spread = (parseFloat(bestAsk.price) - parseFloat(bestBid.price)) / parseFloat(bestBid.price);
 
 if (spread > 0.001) return 'ARBITRAGE'; // 10 bps spread
 if (spread > 0.0005) return 'SWAP'; // 5 bps
 return 'HOLD';
 }
}

// Risk Agent — evaluates trade safety
class RiskAgent {
 constructor(config) {
 this.mcpServer = config.mcpServer;
 this.maxPositionUsd = config.maxPositionUsd;
 this.maxDailyLoss = config.maxDailyLoss;
 this.dailyPnl = 0;
 }

 async assess(params) {
 const { symbol, marketContext, currentPositions } = params;
 
 console.log(`[Risk] Assessing ${symbol}...`);
 
 // Check position limits
 const currentPos = currentPositions.get(symbol);
 if (currentPos && currentPos.size >= this.maxPositionUsd) {
 return { approved: false, reason: 'Position limit reached' };
 }
 
 // Check daily loss limit
 if (this.dailyPnl <= -this.maxDailyLoss) {
 return { approved: false, reason: 'Daily loss limit reached' };
 }
 
 // Compliance check
 const compliance = await this.mcpServer.handleRequest('screen_transaction', {
 sender: { type: 'ai_agent', symbol },
 amount: marketContext.orderbook?.bids?.[0]?.amount || 0,
 currency: symbol
 });
 
 if (!compliance.approved) {
 return { approved: false, reason: 'Compliance failure' };
 }
 
 // Volatility check
 const volatility = this.calculateVolatility(marketContext.orderbook);
 if (volatility > 0.05) { // 5% volatility
 return { 
 approved: true, 
 caution: true, 
 maxSize: this.maxPositionUsd * 0.5,
 reason: 'High volatility - reducing size'
 };
 }
 
 return { approved: true, maxSize: this.maxPositionUsd };
 }

 calculateVolatility(orderbook) {
 if (!orderbook?.bids?.length) return 0;
 const prices = orderbook.bids.map(b => parseFloat(b.price));
 const avg = prices.reduce((a, b) => a + b, 0) / prices.length;
 const variance = prices.reduce((sum, p) => sum + Math.pow(p - avg, 2), 0) / prices.length;
 return Math.sqrt(variance) / avg;
 }
}

// Execution Agent — builds and executes trades
class ExecutionAgent {
 constructor(config) {
 this.mcpServer = config.mcpServer;
 this.x402Gateway = config.x402Gateway;
 this.arbitrageBotUrl = config.arbitrageBotUrl;
 }

 async execute(params) {
 const { symbol, marketContext, riskParams, agentId } = params;
 
 console.log(`[Execution] Executing trade for ${symbol}...`);
 
 const recommendation = marketContext.recommendation;
 
 if (recommendation === 'ARBITRAGE') {
 return this.executeArbitrage(symbol, marketContext, riskParams, agentId);
 } else if (recommendation === 'SWAP') {
 return this.executeSwap(symbol, marketContext, riskParams, agentId);
 }
 
 return { success: false, reason: 'No action recommended' };
 }

 async executeArbitrage(symbol, marketContext, riskParams, agentId) {
 console.log('[Execution] Executing arbitrage...');
 
 try {
 const result = await this.mcpServer.handleRequest('execute_arbitrage', {
 buy: {
 asset: symbol,
 counter: 'USD-IOU',
 amount: riskParams.maxSize.toString()
 },
 sell: {
 asset: symbol,
 counter: 'EUR-IOU',
 amount: riskParams.maxSize.toString()
 },
 agent_id: agentId
 });
 
 return {
 success: result.success,
 tx_hash: result.tx_hash,
 profit: result.profit,
 symbol,
 strategy: 'arbitrage'
 };
 
 } catch (err) {
 return { success: false, error: err.message };
 }
 }

 async executeSwap(symbol, marketContext, riskParams, agentId) {
 console.log('[Execution] Executing AMM swap...');
 
 try {
 const result = await this.mcpServer.handleRequest('amm_swap', {
 account: process.env.ISSUER_ADDRESS,
 asset_in: { currency: 'USD', issuer: process.env.ISSUER_ADDRESS },
 asset_out: { currency: symbol, issuer: process.env.ISSUER_ADDRESS },
 amount_in: riskParams.maxSize.toString(),
 min_amount_out: (riskParams.maxSize * 0.995).toString() // 0.5% slippage
 });
 
 return {
 success: result.status === 'tesSUCCESS',
 tx_hash: result.tx_hash,
 amount_out: result.amount_out,
 symbol,
 strategy: 'amm_swap'
 };
 
 } catch (err) {
 return { success: false, error: err.message };
 }
 }
}

module.exports = { AgentOrchestrator, ResearchAgent, RiskAgent, ExecutionAgent };
