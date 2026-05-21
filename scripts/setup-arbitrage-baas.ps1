# Setup arbitrage-bot (:4028) and baas-api (:8097)
param(
    [switch]$SkipNpmInstall
)

$ErrorActionPreference = "Stop"
$Root = Split-Path -Parent $PSScriptRoot
$Fiat = Join-Path $Root "fiat-rails"

Write-Host "setup-arbitrage-baas — arbitrage :4028, baas-api :8097" -ForegroundColor Cyan

foreach ($dir in @("arbitrage-bot", "baas-api", "orchestrator")) {
    $p = Join-Path $Fiat $dir
    if (-not (Test-Path $p)) {
        throw "Missing $p — run setup-fiat-rails.ps1 first"
    }
}

$arbEnv = Join-Path $Fiat "arbitrage-bot\.env.arbitrage.template"
$arbLocal = Join-Path $Fiat "arbitrage-bot\.env"
if ((Test-Path $arbEnv) -and -not (Test-Path $arbLocal)) {
    Copy-Item $arbEnv $arbLocal
    Write-Host "  copied .env.arbitrage.template -> arbitrage-bot/.env" -ForegroundColor Yellow
}

$baasEnv = Join-Path $Fiat "baas-api\.env.template"
$baasLocal = Join-Path $Fiat "baas-api\.env"
if ((Test-Path $baasEnv) -and -not (Test-Path $baasLocal)) {
    Copy-Item $baasEnv $baasLocal
    Write-Host "  copied baas-api/.env.template -> baas-api/.env (set BAAS_API_KEY locally)" -ForegroundColor Yellow
}

if (-not $SkipNpmInstall) {
    Push-Location $Fiat
    if (-not (Test-Path "node_modules")) {
        npm install --no-fund --no-audit
    }
    Pop-Location
    foreach ($svc in @("arbitrage-bot", "baas-api")) {
        Push-Location (Join-Path $Fiat $svc)
        if (-not (Test-Path "node_modules")) {
            Write-Host "  npm install in $svc/" -ForegroundColor Cyan
            npm install --no-fund --no-audit
        }
        Pop-Location
    }
}

Write-Host ""
Write-Host "PM2 (from repo root):" -ForegroundColor Green
Write-Host "  pm2 start ecosystem.config.js --only payment-orchestrator,arbitrage-bot,baas-api,x402-gateway"
Write-Host ""
Write-Host "Health:" -ForegroundColor Green
Write-Host "  curl http://127.0.0.1:4028/health"
Write-Host "  curl http://127.0.0.1:8097/health"
Write-Host "  curl http://127.0.0.1:4022/health"
Write-Host ""
Write-Host "Arbitrage dry-run:" -ForegroundColor Green
Write-Host '  curl -X POST http://127.0.0.1:4028/start'
Write-Host '  curl -X POST http://127.0.0.1:4022/api/v1/arbitrage -H "Content-Type: application/json" -d "{\"pair\":\"USD-IOU/EUR-IOU\",\"spread_bps\":30,\"amount_usd\":5000,\"dry_run\":true}"'
Write-Host ""
Write-Host "Docs: docs/technical/ARBITRAGE_AND_BAAS.md" -ForegroundColor Cyan
Write-Host "Preview: npx serve docs -l 3123  (see LOCAL_PREVIEW.md)" -ForegroundColor Cyan
