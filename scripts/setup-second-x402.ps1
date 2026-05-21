# Clone EU + JP regional x402 gateways from US template (:4032, :4033)
param(
    [switch]$SkipNpmInstall,
    [switch]$StartPm2
)

$ErrorActionPreference = "Stop"
$Root = Split-Path -Parent $PSScriptRoot
$Fiat = Join-Path $Root "fiat-rails"

Write-Host "setup-second-x402 — EU :4032, JP :4033 (MCP on :4731)" -ForegroundColor Cyan

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
    Push-Location $Fiat
    pm2 start ecosystem.config.js --only x402-gateway-eu,x402-gateway-jp --update-env
    Pop-Location
}

Write-Host ""
Write-Host "Health checks:" -ForegroundColor Green
Write-Host "  curl http://127.0.0.1:4032/health"
Write-Host "  curl http://127.0.0.1:4033/health"
Write-Host "  curl http://127.0.0.1:4032/x402/stats"
Write-Host ""
Write-Host "Docs: docs/technical/MULTI_X402_MESH.md" -ForegroundColor Cyan
