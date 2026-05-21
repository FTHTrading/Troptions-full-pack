
# TROPTIONS MSB/SWIFT/FedWire Quickstart

## Prerequisites
- MSB License (arriving today)
- SWIFT BIC code (arriving today)
- FedWire routing number (arriving today)
- Bank partner account
- ComplyAdvantage or Chainalysis API key

## Step 1: Configure Environment
```bash
# Add to .env
MSB_LICENSE_NUMBER=MSB-XXXX
MSB_STATE=Delaware
SWIFT_BIC=TROPUSS1XXX
FEDWIRE_ROUTING=021000021
BANK_ACCOUNT=XXXXXX
COMPLY_ADVANTAGE_KEY=ca_live_XXXX
```

## Step 2: Deploy New Services
```bash
# Payment Orchestrator
pm2 start ecosystem.config.cjs --only payment-orchestrator

# MSB Compliance
pm2 start ecosystem.config.cjs --only msb-compliance

# SWIFT Bridge
pm2 start ecosystem.config.cjs --only swift-bridge
```

## Step 3: Test Connectivity
```bash
# Test FedWire
curl -X POST http://localhost:4022/api/banking/deposit   -H "Content-Type: application/json"   -d '{"amount": 10000, "currency": "USD", "rail": "fedwire"}'

# Test SWIFT
curl -X POST http://localhost:4022/api/banking/transfer   -H "Content-Type: application/json"   -d '{"amount": 50000, "currency": "EUR", "rail": "swift", "beneficiary": "DEUTDEFF"}'
```

## Step 4: Integrate with Exchange OS
```javascript
// In Exchange OS frontend
const depositUSD = async (amount) => {
  const response = await fetch('/api/banking/deposit', {
    method: 'POST',
    body: JSON.stringify({
      amount,
      currency: 'USD',
      rail: 'fedwire'
    })
  });
  return response.json();
};
```

## Step 5: Monitor
- Payment Orchestrator logs: `pm2 logs payment-orchestrator`
- Compliance alerts: `pm2 logs msb-compliance`
- SWIFT messages: Check service bureau dashboard

## Support
- BSA Officer: [TBD]
- Technical Lead: DONK AI
- Emergency: 1-888-690-DONK
