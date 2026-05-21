# Clone EU + JP regional x402 gateways from US template (:4034, :4035)
param(
    [switch]$SkipNpmInstall,
    [switch]$StartPm2
)

$ErrorActionPreference = "Stop"
$Root = Split-Path -Parent $PSScriptRoot
$Fiat = Join-Path $Root "fiat-rails"

Write-Host "setup-second-x402 — EU :4034, JP :4035 (MCP XRPL stays :4032)" -ForegroundColor Cyan

foreach ($region in @("eu", "jp")) {
    $dir = Join-Path $Fiat "x402-gateway-$region"
    $tpl = Join-Path $dir ".env.template"
    $local = Join-Path $dir ".env"
    if (-not (Test-Path $dir)) {
        throw "Missing $dir — run full pack sync"
    }
    if ((Test-Path $tpl) -and -not (Test-Path $local)) {
        Copy-Item $tpl $local
        Write-Host "  copied .env.template -> x402-gateway-$region/.env" -ForegroundColor Yellow
    }
}

if (-not $SkipNpmInstall) {
    Push-Location $Fiat
    if (-not (Test-Path "node_modules")) {
        npm install --no-fund --no-audit
    }
    Pop-Location
}

if ($StartPm2) {
    Push-Location $Root
    pm2 start fiat-rails/ecosystem.config.js --only x402-gateway-eu,x402-gateway-jp --update-env
    Pop-Location
}

Write-Host ""
Write-Host "Health checks:" -ForegroundColor Green
Write-Host "  curl http://127.0.0.1:4034/health"
Write-Host "  curl http://127.0.0.1:4035/health"
Write-Host "  curl http://127.0.0.1:4034/x402/stats"
Write-Host ""
Write-Host "Docs: docs/technical/X402_GLOBAL_MESH.md" -ForegroundColor Cyan
