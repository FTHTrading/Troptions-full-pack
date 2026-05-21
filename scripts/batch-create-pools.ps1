# Batch-create BaaS liquidity pools from config/pool-batch.json
# Usage: .\scripts\batch-create-pools.ps1 [-DryRun] [-Config path]
param(
    [switch]$DryRun,
    [string]$Config = ""
)

$ErrorActionPreference = "Stop"
$Root = Split-Path -Parent $PSScriptRoot
Set-Location $Root

if (-not $Config) {
    $Config = Join-Path $Root "config\pool-batch.json"
    if (-not (Test-Path $Config)) {
        $Config = Join-Path $Root "config\pool-batch.example.json"
        Write-Host "Using example config: $Config" -ForegroundColor Yellow
        Write-Host "Copy to config\pool-batch.json to customize." -ForegroundColor Yellow
    }
}

$cfg = Get-Content $Config -Raw | ConvertFrom-Json
$baseUrl = if ($cfg.baas_url) { $cfg.baas_url } else { "http://127.0.0.1:8097" }
$apiKey = $env:BAAS_API_KEY
if (-not $apiKey) {
    Write-Warning "BAAS_API_KEY not set - API may reject requests if server requires a key."
}
$wallet = if ($cfg.x402_wallet) { $cfg.x402_wallet } else { $env:X402_WALLET_ADDRESS }
if (-not $wallet) {
    Write-Warning "Set x402_wallet in config or X402_WALLET_ADDRESS env."
}

$headers = @{
    "Content-Type" = "application/json"
}
if ($apiKey) { $headers["X-API-Key"] = $apiKey }
if ($wallet) { $headers["X-402-Wallet-Address"] = $wallet }

Write-Host "`n=== BaaS batch pool setup ===" -ForegroundColor Cyan
Write-Host "Config: $Config"
Write-Host "Target: $baseUrl"
Write-Host "DryRun: $DryRun`n"

# Health
$healthUrl = "$baseUrl/health"
Write-Host "GET $healthUrl"
if ($DryRun) {
    Write-Host "  [DryRun] curl -s $healthUrl" -ForegroundColor DarkGray
} else {
    try {
        $h = Invoke-RestMethod -Uri $healthUrl -Method Get -TimeoutSec 5
        Write-Host "  status=$($h.status) x402=$($h.x402_gateway_reachable) label=$($h.label)" -ForegroundColor Green
    } catch {
        Write-Host "  health failed: $_" -ForegroundColor Red
        throw "Start baas-api: cd fiat-rails; `$env:PORT=8097; node baas-api/index.js"
    }
}

# Optional token registration
if ($cfg.tokens -and -not $cfg.skip_token_registration) {
    foreach ($t in $cfg.tokens) {
        $body = $t | ConvertTo-Json -Depth 5
        Write-Host "`nPOST $baseUrl/api/v1/tokens" -ForegroundColor Cyan
        Write-Host '  Step: 402 invoice, then retry with X-402-Payment' -ForegroundColor DarkGray
        if ($DryRun) {
            Write-Host "  [DryRun] curl -X POST $baseUrl/api/v1/tokens -H 'X-API-Key: ...' -H 'X-402-Wallet-Address: $wallet' -d '$body'" -ForegroundColor DarkGray
        } else {
            Write-Host "  Skipping live token POST - set skip_token_registration:false and pay x402 to register." -ForegroundColor Yellow
        }
    }
}

$poolItems = @()
foreach ($p in $cfg.pools) {
    $poolItems += @{
        token_id           = $p.token_id
        base               = $p.base
        counter            = $p.counter
        initial_liquidity  = $p.initial_liquidity
        fee_percent        = $p.fee_percent
    }
}
$batchBody = (@{ pools = $poolItems } | ConvertTo-Json -Depth 8 -Compress)
$batchUrl = "$baseUrl/api/v1/pools/batch"

Write-Host "`nPOST $batchUrl"
Write-Host "Pools: $($cfg.pools.Count)"

if ($DryRun) {
    $bodyFile = Join-Path $env:TEMP "baas-pool-batch-body.json"
    $batchBody | Set-Content -Path $bodyFile -Encoding UTF8
    Write-Host ''
    Write-Host '[DryRun] Step 1: quote fees (expect HTTP 402)' -ForegroundColor Yellow
    Write-Host @"
curl -s -X POST "$batchUrl" `
  -H "Content-Type: application/json" `
  -H "X-API-Key: `$env:BAAS_API_KEY" `
  -H "X-402-Wallet-Address: $wallet" `
  -d "@$bodyFile"
"@ -ForegroundColor DarkGray
    Write-Host ''
    Write-Host '[DryRun] Step 2: submit with payment' -ForegroundColor Yellow
    Write-Host @"
curl -s -X POST "$batchUrl" `
  -H "Content-Type: application/json" `
  -H "X-API-Key: `$env:BAAS_API_KEY" `
  -H "X-402-Wallet-Address: $wallet" `
  -H "X-402-Payment: baas_receipt_`$(Get-Date -Format yyyyMMddHHmmss)" `
  -d "@$bodyFile"
"@ -ForegroundColor DarkGray
    Write-Host "`n[DryRun] Check jobs:" -ForegroundColor Yellow
    Write-Host "curl -s `"$baseUrl/api/v1/pools/jobs`" -H `"X-API-Key: `$env:BAAS_API_KEY`"" -ForegroundColor DarkGray
    exit 0
}

# Unpaid - get 402 invoice with total
try {
    $invoice = Invoke-WebRequest -Uri $batchUrl -Method Post -Headers $headers -Body $batchBody -TimeoutSec 30
    if ($invoice.StatusCode -eq 202 -or $invoice.StatusCode -eq 201) {
        $result = $invoice.Content | ConvertFrom-Json
        Write-Host "Batch accepted: $($result.batch_id) pools=$($result.pool_count) fee=`$$($result.total_fee_usd)" -ForegroundColor Green
        exit 0
    }
} catch {
    $resp = $_.Exception.Response
    if ($resp -and [int]$resp.StatusCode -eq 402) {
        $reader = New-Object System.IO.StreamReader($resp.GetResponseStream())
        $json = $reader.ReadToEnd() | ConvertFrom-Json
        Write-Host "402 invoice - total USD: $($json.amount_usd) ATP: $($json.amount_atp)" -ForegroundColor Yellow
        Write-Host "Pay via x402 gateway then re-run with X-402-Payment header." -ForegroundColor Yellow
        $payHeaders = $headers.Clone()
        $payHeaders["X-402-Payment"] = "baas_batch_$(Get-Date -Format 'yyyyMMddHHmmss')"
        $paid = Invoke-RestMethod -Uri $batchUrl -Method Post -Headers $payHeaders -Body $batchBody -TimeoutSec 30
        Write-Host "Batch queued: $($paid.batch_id) jobs=$($paid.jobs.Count) file=$($paid.jobs_file)" -ForegroundColor Green
        exit 0
    }
    throw
}

Write-Host "Unexpected response" -ForegroundColor Red
exit 1
