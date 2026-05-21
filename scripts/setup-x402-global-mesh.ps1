# Full x402 global mesh — US :4030, EU :4034, JP :4035, Apostle :4020, orchestrator :4031
param(
    [switch]$SkipNpmInstall,
    [switch]$StartPm2
)

$ErrorActionPreference = "Stop"
$Root = Split-Path -Parent $PSScriptRoot
$Fiat = Join-Path $Root "fiat-rails"

Write-Host "setup-x402-global-mesh — US/EU/JP gateways + agent-orchestrator" -ForegroundColor Cyan

& (Join-Path $PSScriptRoot "setup-second-x402.ps1") -SkipNpmInstall:$SkipNpmInstall

$templates = @(
    @{ Dir = "x402-gateway"; Name = "US :4030" },
    @{ Dir = "agent-orchestrator"; Name = "orchestrator :4031" }
)
foreach ($t in $templates) {
    $tpl = Join-Path $Fiat "$($t.Dir)\.env.template"
    $local = Join-Path $Fiat "$($t.Dir)\.env"
    if ((Test-Path $tpl) -and -not (Test-Path $local)) {
        Copy-Item $tpl $local
        Write-Host "  copied $($t.Dir)/.env.template" -ForegroundColor Yellow
    }
}

$arbTpl = Join-Path $Fiat "arbitrage-bot\.env.arbitrage.template"
$arbLocal = Join-Path $Fiat "arbitrage-bot\.env"
if ((Test-Path $arbTpl) -and -not (Test-Path $arbLocal)) {
    Copy-Item $arbTpl $arbLocal
    Write-Host "  copied arbitrage-bot/.env.arbitrage.template" -ForegroundColor Yellow
}

if (-not $SkipNpmInstall) {
    Push-Location $Fiat
    if (-not (Test-Path "node_modules")) {
        npm install --no-fund --no-audit
    }
    foreach ($svc in @("arbitrage-bot", "agent-orchestrator", "baas-api")) {
        $p = Join-Path $Fiat $svc
        if ((Test-Path $p) -and -not (Test-Path (Join-Path $p "node_modules"))) {
            Push-Location $p
            npm install --no-fund --no-audit
            Pop-Location
        }
    }
    Pop-Location
}

if ($StartPm2) {
    Push-Location $Root
    pm2 start fiat-rails/ecosystem.config.js --only x402-gateway-v2,x402-gateway-eu,x402-gateway-jp,agent-orchestrator,arbitrage-bot --update-env
    pm2 start ecosystem.config.js --only x402-gateway --update-env 2>$null
    Pop-Location
}

Write-Host ""
Write-Host "PM2 (manual):" -ForegroundColor Green
Write-Host "  pm2 start fiat-rails/ecosystem.config.js --only x402-gateway-v2,x402-gateway-eu,x402-gateway-jp,agent-orchestrator,arbitrage-bot"
Write-Host ""
Write-Host "One-liner activation (dry-run):" -ForegroundColor Green
Write-Host '  .\scripts\setup-x402-global-mesh.ps1 -StartPm2; curl http://127.0.0.1:4031/health; curl -X POST http://127.0.0.1:4031/api/v1/arbitrage/multi -H "Content-Type: application/json" -d ''{\"buy\":\"us\",\"sell\":\"eu\",\"dry_run\":true}'''
Write-Host ""
Write-Host "Docs: docs/technical/X402_GLOBAL_MESH.md" -ForegroundColor Cyan
