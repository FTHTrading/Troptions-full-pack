# activate-full-stack.ps1 — Windows full AWS mesh activation (DRY_RUN safe)
param(
    [switch]$DryRun = $true,
    [switch]$SkipPm2,
    [switch]$SkipPools,
    [string]$TelegramToken = ""
)

$ErrorActionPreference = "Stop"
$Root = Split-Path -Parent $PSScriptRoot
Set-Location $Root

Write-Host "=== TROPTIONS full-stack activation (PIPELINE) ===" -ForegroundColor Cyan
Write-Host "PROJECTION: 10/10 score and `$874K/mo are models — not realized revenue." -ForegroundColor Yellow

# Agents
Push-Location (Join-Path $Root "agents")
npm install
Pop-Location

Push-Location (Join-Path $Root "services\usdc-base-relay")
npm install
Pop-Location

if ($TelegramToken) { $env:TELEGRAM_BOT_TOKEN = $TelegramToken }
if ($env:TELEGRAM_BOT_TOKEN) {
    Push-Location (Join-Path $Root "services\telegram-bot")
    npm install
    Pop-Location
} else {
    Write-Host "SKIP telegram-bot (set TELEGRAM_BOT_TOKEN or -TelegramToken)" -ForegroundColor Yellow
}

Push-Location (Join-Path $Root "fiat-rails")
npm install
Pop-Location

if (-not $SkipPm2) {
    $only = @(
        "payment-orchestrator", "compliance-engine", "arbitrage-bot",
        "baas-api", "baas-dashboard", "x402-us", "x402-eu", "x402-jp",
        "agent-orchestrator", "mcp-server", "usdc-base-relay"
    )
    pm2 start ecosystem.config.js --only ($only -join ",") --update-env 2>$null
    if ($env:TELEGRAM_BOT_TOKEN) {
        pm2 start ecosystem.config.js --only telegram-bot --update-env 2>$null
    }
    $dryFlag = if ($DryRun) { "true" } else { "false" }
    pm2 set arbitrage-bot:DRY_RUN $dryFlag 2>$null
    pm2 set agent-orchestrator:DRY_RUN $dryFlag 2>$null
    Write-Host "PM2 started revenue mesh (DRY_RUN=$dryFlag)" -ForegroundColor Green
}

Start-Sleep -Seconds 2

$checks = @(
    @{ Name = "baas-api"; Url = "http://127.0.0.1:8097/health" },
    @{ Name = "agent-orchestrator"; Url = "http://127.0.0.1:4100/health" },
    @{ Name = "mcp-server"; Url = "http://127.0.0.1:4101/health" },
    @{ Name = "usdc-relay"; Url = "http://127.0.0.1:4040/health" },
    @{ Name = "x402-us"; Url = "http://127.0.0.1:4030/health" },
    @{ Name = "x402-eu"; Url = "http://127.0.0.1:4034/health" },
    @{ Name = "x402-jp"; Url = "http://127.0.0.1:4035/health" },
    @{ Name = "arbitrage-bot"; Url = "http://127.0.0.1:4028/health" },
    @{ Name = "billing-revenue"; Url = "http://127.0.0.1:8097/api/v1/billing/revenue" }
)

foreach ($c in $checks) {
    try {
        $null = Invoke-RestMethod -Uri $c.Url -TimeoutSec 5
        Write-Host "  OK $($c.Name)" -ForegroundColor Green
    } catch {
        Write-Host "  FAIL $($c.Name)" -ForegroundColor Yellow
    }
}

# Register agent + trade batch
try {
    $regBody = '{"agent_id":"win-activate","wallet":"rWinActivate0000000000000000000","capital_troptions":0}'
    $null = Invoke-RestMethod -Method Post -Uri "http://127.0.0.1:8097/api/v1/agents" -Body $regBody -ContentType "application/json" -TimeoutSec 10
    Write-Host "  OK register agent" -ForegroundColor Green
} catch {
    Write-Host "  SKIP register agent" -ForegroundColor Yellow
}

try {
    $batchBody = '{"symbols":["USD-IOU/EUR-IOU","USD-IOU/JPY-IOU"],"dry_run":true}'
    $batch = Invoke-RestMethod -Method Post -Uri "http://127.0.0.1:4100/trade/batch" -Body $batchBody -ContentType "application/json" -TimeoutSec 20
    Write-Host "  OK trade/batch count=$($batch.count)" -ForegroundColor Green
} catch {
    Write-Host "  SKIP trade/batch" -ForegroundColor Yellow
}

if (-not $SkipPools) {
    & (Join-Path $Root "scripts\batch-create-pools.ps1") -DryRun:$DryRun
}

Write-Host ""
Write-Host "Port map: 4020 x402 | 4022-4028 rails | 4029 dashboard | 4030/4034/4035 x402 | 4040 USDC | 4100 agent | 4101 MCP | 8097 baas | 8443 telegram" -ForegroundColor Cyan
Write-Host "Docs: docs/technical/AWS_ACTIVATION_RUNBOOK.md" -ForegroundColor Cyan
