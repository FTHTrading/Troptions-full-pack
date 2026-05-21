// fiat-rails/agent-orchestrator/agent-runner.js
// Core agent trading loop — Research → Risk → Execute

const axios = require('axios');

class AgentRunner {
 constructor(config) {
 this.agent = config.agent;
 this.x402Client = config.x402Client;
 this.orchestratorUrl = config.orchestratorUrl;
 this.complianceUrl = config.complianceUrl;
 this.arbitrageBotUrl = config.arbitrageBotUrl;
 this.baasUrl = config.baasUrl;
 
 this.isRunning = false;
 this.tradeCount = 0;
 this.totalProfit = 0;
 this.lastTrade = null;
 this.dailyLoss = 0;
 }

 async start() {
 this.isRunning = true;
 console.log(`[Agent ${this.agent.agent_id}] Starting trading loop...`);
 console.log(`[Agent ${this.agent.agent_id}] Strategy: ${this.agent.strategy}`);
 console.log(`[Agent ${this.agent.agent_id}] Pairs: ${this.agent.pairs.join(', ')}`);
 
 while (this.isRunning) {
 try {
 await this.tradeCycle();
 } catch (err) {
 console.error(`[Agent ${this.agent.agent_id}] Cycle error:`, err.message);
 }
 
 // Sleep between cycles
 await this.sleep(this.agent.scan_interval || 5000);
 }
 }

 stop() {
 this.isRunning = false;
 console.log(`[Agent ${this.agent.agent_id}] Stopped`);
 }

 async tradeCycle() {
 for (const pair of this.agent.pairs) {
 console.log(`\n[Agent ${this.agent.agent_id}] === Trade Cycle: ${pair} ===`);
 
 // Step 1: Research — gather market context from all gateways
 const marketContext = await this.researchPhase(pair);
 if (!marketContext) continue;
 
 // Step 2: Risk Assessment
 const riskDecision = await this.riskPhase(pair, marketContext);
 if (!riskDecision.approved) {
 console.log(`[Agent ${this.agent.agent_id}] Trade rejected: ${riskDecision.reason}`);
 continue;
 }
 
 // Step 3: Execute
 const tradeResult = await this.executePhase(pair, marketContext, riskDecision);
 if (tradeResult.success) {
 this.tradeCount++;
 this.totalProfit += tradeResult.profit || 0;
 this.lastTrade = tradeResult;
 
 // Report to BaaS
 await this.reportTrade(tradeResult);
 
 console.log(`[Agent ${this.agent.agent_id}] PROFIT: +${tradeResult.profit} TROPTIONS`);
 }
 }
 }

 async researchPhase(pair) {
 console.log(`[Agent ${this.agent.agent_id}] Researching ${pair}...`);
 
 try {
 // Get orderbook data from all gateways via x402
 const orderbooks = {};
 
 for (const gateway of this.x402Client.gateways) {
 try {
 const orderbook = await this.x402Client.getOrderbook(pair, gateway.region);
 orderbooks[gateway.region] = orderbook;
 } catch (err) {
 console.warn(`[Agent ${this.agent.agent_id}] Failed to get ${gateway.region} orderbook:`, err.message);
 }
 }
 
 if (Object.keys(orderbooks).length < 2) {
 console.log(`[Agent ${this.agent.agent_id}] Insufficient data for ${pair}`);
 return null;
 }
 
 // Calculate cross-market spreads
 const opportunities = this.findArbitrageOpportunities(orderbooks, pair);
 
 return {
 pair,
 orderbooks,
 opportunities,
 timestamp: new Date().toISOString()
 };
 
 } catch (err) {
 console.error(`[Agent ${this.agent.agent_id}] Research failed:`, err.message);
 return null;
 }
 }

 async riskPhase(pair, marketContext) {
 console.log(`[Agent ${this.agent.agent_id}] Assessing risk...`);
 
 // Check daily loss limit
 if (this.dailyLoss >= this.agent.risk_limits.max_daily_loss) {
 return { approved: false, reason: 'Daily loss limit reached' };
 }
 
 // Check position limit
 // In production, query actual position from ledger
 const estimatedPosition = this.totalProfit * 0.5; // Simplified
 if (estimatedPosition >= this.agent.risk_limits.max_position) {
 return { approved: false, reason: 'Position limit reached' };
 }
 
 // Check compliance
 try {
 const compliance = await axios.post(`${this.complianceUrl}/screen`, {
 payment_id: `agent_${this.agent.agent_id}_${Date.now()}`,
 sender: { type: 'ai_agent', agent_id: this.agent.agent_id },
 amount: this.agent.risk_limits.max_position,
 currency: 'TROPTIONS'
 }, { timeout: 5000 });
 
 if (!compliance.data.approved) {
 return { approved: false, reason: 'Compliance check failed' };
 }
 } catch (err) {
 console.warn(`[Agent ${this.agent.agent_id}] Compliance check failed:`, err.message);
 return { approved: false, reason: 'Compliance service unavailable' };
 }
 
 return {
 approved: true,
 max_size: this.agent.risk_limits.max_position,
 reinvest_ratio: this.agent.risk_limits.reinvest_ratio
 };
 }

 async executePhase(pair, marketContext, riskDecision) {
 console.log(`[Agent ${this.agent.agent_id}] Executing trade...`);
 
 const bestOpportunity = marketContext.opportunities[0];
 if (!bestOpportunity) {
 return { success: false, reason: 'No opportunities found' };
 }
 
 try {
 // Execute via Payment Orchestrator
 const tradePayload = {
 agent_id: this.agent.agent_id,
 strategy: 'cross_gateway_arbitrage',
 pair: pair,
 buy: {
 gateway: bestOpportunity.buyGateway,
 asset: pair.split('/')[0],
 counter: pair.split('/')[1],
 amount: Math.min(bestOpportunity.size, riskDecision.max_size).toString(),
 price: bestOpportunity.buyPrice.toString()
 },
 sell: {
 gateway: bestOpportunity.sellGateway,
 asset: pair.split('/')[0],
 counter: pair.split('/')[1],
 amount: Math.min(bestOpportunity.size, riskDecision.max_size).toString(),
 price: bestOpportunity.sellPrice.toString()
 }
 };
 
 const result = await axios.post(`${this.orchestratorUrl}/arbitrage`, tradePayload, {
 headers: { 'X-Agent-ID': this.agent.agent_id },
 timeout: 15000
 });
 
 if (result.data.success) {
 // Calculate profit
 const profit = parseFloat(result.data.profit || 0);
 
 // Reinvest
 const reinvestAmount = profit * riskDecision.reinvest_ratio;
 console.log(`[Agent ${this.agent.agent_id}] Reinvesting ${reinvestAmount} TROPTIONS (${riskDecision.reinvest_ratio * 100}%)`);
 
 return {
 success: true,
 profit,
 tx_hash: result.data.tx_hash,
 strategy: 'cross_gateway_arbitrage',
 pair,
 timestamp: new Date().toISOString()
 };
 } else {
 return { success: false, reason: result.data.error || 'Execution failed' };
 }
 
 } catch (err) {
 console.error(`[Agent ${this.agent.agent_id}] Execution failed:`, err.message);
 return { success: false, error: err.message };
 }
 }

 findArbitrageOpportunities(orderbooks, pair) {
 const opportunities = [];
 const regions = Object.keys(orderbooks);
 
 for (let i = 0; i < regions.length; i++) {
 for (let j = i + 1; j < regions.length; j++) {
 const region1 = regions[i];
 const region2 = regions[j];
 
 const book1 = orderbooks[region1];
 const book2 = orderbooks[region2];
 
 if (!book1?.asks?.[0] || !book2?.bids?.[0]) continue;
 
 const buyPrice = parseFloat(book1.asks[0].price);
 const sellPrice = parseFloat(book2.bids[0].price);
 
 // Convert to common base (simplified — use FX rates in production)
 const fxRate = 1.0; // Placeholder
 const sellPriceUSD = sellPrice * fxRate;
 
 const spread = sellPriceUSD - buyPrice;
 const spreadBps = (spread / buyPrice) * 10000;
 
 if (spread > 0) {
 opportunities.push({
 buyGateway: region1,
 sellGateway: region2,
 buyPrice,
 sellPrice: sellPriceUSD,
 spread,
 spreadBps,
 size: Math.min(
 parseFloat(book1.asks[0].amount || 0),
 parseFloat(book2.bids[0].amount || 0)
 )
 });
 }
 }
 }
 
 // Sort by spread descending
 opportunities.sort((a, b) => b.spread - a.spread);
 
 return opportunities;
 }

 async reportTrade(tradeResult) {
 try {
 await axios.post(`${this.baasUrl}/api/v1/agents/${this.agent.agent_id}/trades`, {
 ...tradeResult,
 agent_id: this.agent.agent_id
 }, { timeout: 5000 });
 } catch (err) {
 console.warn(`[Agent ${this.agent.agent_id}] Failed to report trade:`, err.message);
 }
 }

 sleep(ms) {
 return new Promise(resolve => setTimeout(resolve, ms));
 }
}

module.exports = { AgentRunner };
