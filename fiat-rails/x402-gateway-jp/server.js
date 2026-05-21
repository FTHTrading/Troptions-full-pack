// Regional JP x402 gateway — :4033
process.env.REGION = process.env.REGION || 'jp';
process.env.PORT = process.env.PORT || '4033';
process.env.BASE_CURRENCY = process.env.BASE_CURRENCY || 'JPY';

const { listenGateway } = require('../x402-gateway/create-app');
const app = listenGateway();

module.exports = app;
