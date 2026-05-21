// Regional EU x402 gateway — :4034 (not :4032; MCP XRPL reserves 4032)
process.env.REGION = process.env.REGION || 'eu';
process.env.PORT = process.env.PORT || '4034';
process.env.BASE_CURRENCY = process.env.BASE_CURRENCY || 'EUR';

const { listenGateway } = require('../x402-gateway/create-app');
const app = listenGateway();

module.exports = app;
