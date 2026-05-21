# PATE-COAL-001 — Public Route Verification Report

**Date:** 2026-04-28  
**Deployment target:** `https://troptionslive.unykorn.org`  
**Commit:** `3c8a111`  
**Branch:** `main`

---

## Overview

This document lists all public routes introduced by the PATE-COAL-001 RWA module, their expected content, and verification commands. Run these checks after deployment to confirm the module is live and returning expected content.

---

## Route Inventory

| Route | Type | Description |
|---|---|---|
| `/troptions/rwa/pate-coal` | Page | Overview: asset summary, readiness score, quick links |
| `/troptions/rwa/pate-coal/readiness` | Page | Full 22-document readiness checklist with score breakdown |
| `/troptions/rwa/pate-coal/funding` | Page | 7 funding route assessments (CONDITIONAL / BLOCKED) |
| `/troptions/rwa/pate-coal/documents` | Page | Evidence detail, uploaded docs, coal seam table |
| `/api/troptions/pate-coal` | API (GET) | Full JSON: record, score, missing docs, routes, lender packet, disclosure |
| `/api/troptions/pate-coal` | API (POST) | Actions: `readiness`, `missing`, `funding`, `lender-packet`, `disclosure`, `block` |

---

## Page Route Verification

### 1. Overview page

```powershell
curl -s https://troptionslive.unykorn.org/troptions/rwa/pate-coal | Select-String "PATE-COAL-001|40|Morgan County"
```

**Expected matches:**
- `PATE-COAL-001` (asset ID heading)
- `40` (readiness score)
- `Morgan County` (location)

---

### 2. Readiness page

```powershell
curl -s https://troptionslive.unykorn.org/troptions/rwa/pate-coal/readiness | Select-String "ENGINEERING_APPRAISAL|DEED|Title.*Opinion|40.*100"
```

**Expected matches:**
- `ENGINEERING_APPRAISAL` (uploaded doc — should show as received)
- `DEED` (missing hard-blocker)
- `Title Opinion` or similar (missing hard-blocker)

---

### 3. Funding routes page

```powershell
curl -s https://troptionslive.unykorn.org/troptions/rwa/pate-coal/funding | Select-String "Aave|BLOCKED|Private Mineral Lender|CONDITIONAL"
```

**Expected matches:**
- `Aave` (Aave route — hard blocked)
- `BLOCKED` (at least one route status)
- `Private Mineral Lender` (blocked route name)
- `CONDITIONAL` (diligence bridge / operator JV / royalty streaming)

---

### 4. Documents page

```powershell
curl -s https://troptionslive.unykorn.org/troptions/rwa/pate-coal/documents | Select-String "Engineering Appraisal|Mineral Rights Deed|Title Opinion"
```

**Expected matches:**
- `Engineering Appraisal` (uploaded — should show ✓ received)
- `Mineral Rights Deed` (missing — should show × not submitted)
- `Title Opinion` (missing hard-blocker)

---

## API Route Verification

### 5. GET default response

```powershell
curl -s https://troptionslive.unykorn.org/api/troptions/pate-coal | ConvertFrom-Json | Select-Object assetId, readinessScore, simulationOnly
```

**Expected output:**
```json
{
  "assetId": "PATE-COAL-001",
  "readinessScore": 40,
  "simulationOnly": true
}
```

---

### 6. POST readiness action

```powershell
$body = '{"action":"readiness"}' ; Invoke-RestMethod -Method POST -Uri https://troptionslive.unykorn.org/api/troptions/pate-coal -ContentType "application/json" -Body $body | Select-Object score, isFinancingReady, simulationOnly
```

**Expected output:**
```json
{
  "score": 40,
  "isFinancingReady": false,
  "simulationOnly": true
}
```

---

### 7. POST missing documents action

```powershell
$body = '{"action":"missing"}' ; Invoke-RestMethod -Method POST -Uri https://troptionslive.unykorn.org/api/troptions/pate-coal -ContentType "application/json" -Body $body | Select-Object -ExpandProperty missing | Measure-Object
```

**Expected:** Count = 16 (22 total − 6 uploaded)

---

### 8. POST funding routes action

```powershell
$body = '{"action":"funding"}' ; Invoke-RestMethod -Method POST -Uri https://troptionslive.unykorn.org/api/troptions/pate-coal -ContentType "application/json" -Body $body | Select-Object -ExpandProperty routes | Select-Object route, eligibility
```

**Expected routes and eligibilities:**

| Route | Eligibility |
|---|---|
| DILIGENCE_BRIDGE | CONDITIONAL |
| OPERATOR_JV | CONDITIONAL |
| ROYALTY_STREAMING | CONDITIONAL |
| PRIVATE_MINERAL_LENDER | BLOCKED |
| AAVE_ACCEPTED_COLLATERAL_ONLY | BLOCKED |
| XRPL_PERMISSIONED_RECEIPT | BLOCKED |
| OFFTAKE_PREPAYMENT | CONDITIONAL or BLOCKED |

---

### 9. POST disclosure action

```powershell
$body = '{"action":"disclosure"}' ; Invoke-RestMethod -Method POST -Uri https://troptionslive.unykorn.org/api/troptions/pate-coal -ContentType "application/json" -Body $body | Select-Object assetId, simulationOnly
```

**Expected:**
```json
{
  "assetId": "PATE-COAL-001",
  "simulationOnly": true
}
```

---

## Curl Equivalents (Unix/macOS/WSL)

```bash
# Overview page
curl -s https://troptionslive.unykorn.org/troptions/rwa/pate-coal | grep -i "PATE-COAL-001\|40\|Morgan County"

# Funding page
curl -s https://troptionslive.unykorn.org/troptions/rwa/pate-coal/funding | grep -i "Aave\|BLOCKED\|Private Mineral Lender"

# Documents page
curl -s https://troptionslive.unykorn.org/troptions/rwa/pate-coal/documents | grep -i "Engineering Appraisal\|Mineral Rights Deed\|Title Opinion"

# API GET
curl -s https://troptionslive.unykorn.org/api/troptions/pate-coal | python3 -m json.tool | grep -E '"assetId"|"readinessScore"|"simulationOnly"'

# API POST readiness
curl -s -X POST https://troptionslive.unykorn.org/api/troptions/pate-coal \
  -H "Content-Type: application/json" \
  -d '{"action":"readiness"}' | python3 -m json.tool | grep -E '"score"|"isFinancingReady"|"simulationOnly"'

# API POST missing
curl -s -X POST https://troptionslive.unykorn.org/api/troptions/pate-coal \
  -H "Content-Type: application/json" \
  -d '{"action":"missing"}' | python3 -c "import json,sys; r=json.load(sys.stdin); print(f'Missing: {len(r[\"missing\"])} docs')"
```

---

## Pre-Deployment Verification Checklist

Before running the curl commands above, confirm:

- [ ] `git log --oneline -1` shows `3c8a111` or later on `main`
- [ ] `npm run build` exits 0
- [ ] `npx tsc --noEmit` shows no pate-coal errors
- [ ] `npm test` shows 58/58 tests passing for `pateCoalRwaEngine.test.ts`
- [ ] Deployment platform (Vercel / Cloudflare / Netlify) shows successful build
- [ ] DNS for `troptionslive.unykorn.org` resolves correctly

---

## What to Confirm in Responses

When all routes are live, confirm:

| Check | Expected |
|---|---|
| Asset ID in page HTML | `PATE-COAL-001` |
| Score in page HTML | `40` |
| Location in page HTML | `Morgan County` |
| Aave status in funding page | `BLOCKED` |
| `simulationOnly` in API | `true` |
| `isFinancingReady` in API | `false` |
| Missing doc count in API | `16` |
| Readiness score in API | `40` |

---

## Not Expected in Responses

The following strings should **NOT** appear in any live API response for PATE-COAL-001:

| String | Reason |
|---|---|
| `"isFinancingReady": true` | Not true at 40/100 with 0/8 hard-blockers met |
| `"isXrplReceiptReady": true` | Not ready until Phase 3 |
| `"eligibility": "ELIGIBLE"` on Aave route | Hard-blocked permanently |
| Any IOU issuance confirmation | No IOU issued |
| Any stablecoin issuance | No stablecoin issued |
| Any custody confirmation | No custody enabled |
| `"simulationOnly": false` | All outputs are simulation only |

---

*TROPTIONS RWA System · PATE-COAL-001 · 2026-04-28 · simulationOnly: true*
