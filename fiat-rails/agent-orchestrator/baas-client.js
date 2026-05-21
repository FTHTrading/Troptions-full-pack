// fiat-rails/agent-orchestrator/baas-client.js
// BaaS Dashboard integration for agent registration and reporting

const axios = require('axios');

class BaaSClient {
 constructor(config) {
 this.url = config.url || 'http://localhost:4029/api/v1';
 }

 async registerAgent(agentData) {
 try {
 const response = await axios.post(`${this.url}/agents`, agentData, {
 timeout: 10000
 });
 console.log(`[BaaS] Agent registered: ${agentData.agent_id}`);
 return response.data;
 } catch (err) {
 console.warn(`[BaaS] Registration failed:`, err.message);
 throw err;
 }
 }

 async reportTrade(agentId, tradeData) {
 try {
 const response = await axios.post(`${this.url}/agents/${agentId}/trades`, tradeData, {
 timeout: 5000
 });
 return response.data;
 } catch (err) {
 console.warn(`[BaaS] Trade report failed:`, err.message);
 // Non-critical — don't throw
 return null;
 }
 }

 async getAgentRevenue(agentId) {
 try {
 const response = await axios.get(`${this.url}/agents/${agentId}/revenue`, {
 timeout: 5000
 });
 return response.data;
 } catch (err) {
 console.warn(`[BaaS] Revenue fetch failed:`, err.message);
 return null;
 }
 }

 async getDashboard() {
 try {
 const response = await axios.get(`${this.url}/dashboard`, {
 timeout: 5000
 });
 return response.data;
 } catch (err) {
 console.warn(`[BaaS] Dashboard fetch failed:`, err.message);
 return null;
 }
 }
}

module.exports = { BaaSClient };
