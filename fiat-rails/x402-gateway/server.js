// fiat-rails/x402-gateway/server.js — US gateway (default :4030)
const { listenGateway } = require('./create-app');

if (!process.env.REGION) process.env.REGION = 'us';
if (!process.env.PORT) process.env.PORT = '4030';

const app = listenGateway();

module.exports = app;
