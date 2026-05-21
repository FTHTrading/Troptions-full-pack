// Regional JP x402 gateway — :4035 (agent-orchestrator :4031)
process.env.REGION = process.env.REGION || 'jp';
process.env.PORT = process.env.PORT || '4035';
process.env.BASE_CURRENCY = process.env.BASE_CURRENCY || 'JPY';

const { listenGateway } = require('../x402-gateway/create-app');
const app = listenGateway();

module.exports = app;
