# TROPTIONS Agentic RAG AMM Trading System

## Overview

A complete AI-powered trading system built on your existing TROPTIONS infrastructure:
- **MCP Server** exposes XRPL AMM/DEX operations as callable tools
- **Research Agent** gathers real-time market context (paying x402 fees)
- **Risk Agent** evaluates trade safety and compliance
- **Execution Agent** builds and executes atomic trades
- **Orchestrator** coordinates all agents into a single trading cycle

## Architecture

```
User/External Signal
  ↓
Agent Orchestrator (:4100)
  ↓
├─ Research Agent → x402 Market Data → MCP Tools
├─ Risk Agent → Compliance Engine (:4025) → Position Limits
└─ Execution Agent → Arbitrage Bot (:4028) or AMM Swap
  ↓
MCP XRPL Server (:4101) → XRPL Ledger (TROPTIONS IOUs)
```

## Services

| Service | Port | Purpose |
|---------|------|---------|
| Agent Orchestrator | :4100 | Main API, coordinates all agents |
| MCP XRPL Server | :4101 | XRPL tool exposure for AI |

## Quick Start

```bash
# Install dependencies
cd agents
npm install

# Configure environment
cp .env.template .env
# Edit .env with your credentials

# Start services
pm2 start ecosystem.config.js
pm2 save
```

## API Endpoints

### Agent Orchestrator (:4100)

```
POST /trade         → Execute single trade cycle
POST /trade/batch   → Execute multiple trades
GET  /status        → Agent status + positions
GET  /positions     → Current positions + history
POST /config        → Update agent configuration
```

### Example Trade

```bash
# Execute trade cycle for Alexandrite
curl -X POST http://localhost:4100/trade \
  -H "Content-Type: application/json" \
  -d '{"symbol": "ALEX"}'

# Batch trade multiple symbols
curl -X POST http://localhost:4100/trade/batch \
  -H "Content-Type: application/json" \
  -d '{"symbols": ["ALEX", "XAU", "PART"]}'
```

## Integration with Existing Infrastructure

| Existing Service | Agent Usage |
|-----------------|-------------|
| x402 Gateway (:4030) | Research Agent pays for market data |
| Compliance Engine (:4025) | Risk Agent screens every trade |
| Arbitrage Bot (:4028) | Execution Agent calls for cross-pair trades |
| Payment Orchestrator (:4022) | Settlement of multi-leg trades |
| BaaS Dashboard (:4029) | Agent registration and revenue tracking |

## Revenue Streams

| Stream | Source |
|--------|--------|
| Agent Subscription | Partners pay monthly for agent deployment |
| Agent Execution Fees | 0.10% per agent trade |
| Data Marketplace | Agents buy/sell market intel |
| Strategy Royalties | Creators earn from strategy usage |
| x402 Microfees | Every agent API call |

## Status: READY FOR DEPLOYMENT

All components are built and integrated. Start with `pm2 start ecosystem.config.js`.
