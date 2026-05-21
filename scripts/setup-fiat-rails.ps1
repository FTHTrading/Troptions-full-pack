# Scaffold fiat-rails/ tree, install Node deps, copy .env.template
param(
    [switch]$SkipNpmInstall
)

$ErrorActionPreference = "Stop"
$Root = Split-Path -Parent $PSScriptRoot
$Fiat = Join-Path $Root "fiat-rails"

Write-Host "setup-fiat-rails — $Fiat" -ForegroundColor Cyan

$services = @(
    "payment-orchestrator",
    "fedwire-adapter",
    "swift-bridge",
    "compliance-engine",
    "neobank-api",
    "iou-reserve-monitor"
)

foreach ($svc in $services) {
    $dir = Join-Path $Fiat $svc
    if (-not (Test-Path $dir)) {
        New-Item -ItemType Directory -Path $dir -Force | Out-Null
        Write-Host "  created $svc/"
    }
}

$shared = Join-Path $Fiat "shared"
if (-not (Test-Path $shared)) {
    New-Item -ItemType Directory -Path $shared -Force | Out-Null
}

$envTemplate = Join-Path $Fiat ".env.template"
$envLocal = Join-Path $Fiat ".env"
if ((Test-Path $envTemplate) -and -not (Test-Path $envLocal)) {
    Copy-Item $envTemplate $envLocal
    Write-Host "  copied .env.template -> .env (edit locally; never commit .env)" -ForegroundColor Yellow
}

if (-not $SkipNpmInstall) {
    Push-Location $Fiat
    if (-not (Test-Path "node_modules")) {
        Write-Host "  npm install in fiat-rails/" -ForegroundColor Cyan
        npm install --no-fund --no-audit
        if ($LASTEXITCODE -ne 0) { throw "npm install failed" }
    } else {
        Write-Host "  node_modules present — skip npm install (use -SkipNpmInstall to silence)" -ForegroundColor DarkGray
    }
    Pop-Location
}

Write-Host ""
Write-Host "Fiat rails stubs (PIPELINE):" -ForegroundColor Green
Write-Host "  pm2 start ecosystem.config.js --only payment-orchestrator,fedwire-adapter,swift-bridge,compliance-engine,neobank-api,iou-reserve-monitor"
Write-Host "  curl http://127.0.0.1:4022/health"
Write-Host "  See docs/technical/SYSTEM_MANIFEST.md"
