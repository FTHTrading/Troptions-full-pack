# One-click TROPTIONS revenue stack activation (DRY_RUN safe)
param(
    [switch]$DryRun = $true,
    [switch]$SkipPm2,
    [switch]$SkipHealth
)

$ErrorActionPreference = "Stop"
$Root = Split-Path -Parent $PSScriptRoot
$Fiat = Join-Path $Root "fiat-rails"

Write-Host "activate-troptions-revenue — DryRun=$DryRun" -ForegroundColor Cyan

& (Join-Path $Root "scripts\setup-arbitrage-baas.ps1") -SkipNpmInstall:$false
& (Join-Path $Root "scripts\setup-mcp-xrpl.ps1")
& (Join-Path $Root "scripts\setup-second-x402.ps1")

$agentEnv = Join-Path $Fiat "agent-orchestrator\.env"
if (-not (Test-Path $agentEnv)) {
    Copy-Item (Join-Path $Fiat "agent-orchestrator\.env.template") $agentEnv
}

if (-not $SkipPm2) {
    Push-Location $Fiat
    $dryFlag = if ($DryRun) { "true" } else { "false" }
    pm2 start ecosystem.config.js --only arbitrage-bot,baas-api,x402-gateway-v2,x402-eu,x402-jp,agent-orchestrator --update-env 2>$null
    pm2 set agent-orchestrator:DRY_RUN $dryFlag 2>$null
    pm2 set arbitrage-bot:DRY_RUN $dryFlag 2>$null
    Pop-Location
    Write-Host "PM2 started fiat-rails revenue apps (DRY_RUN=$dryFlag)" -ForegroundColor Green
}

if (-not $SkipHealth) {
    Start-Sleep -Seconds 2
    $checks = @(
        @{ Name = "agent-orchestrator"; Url = "http://127.0.0.1:4031/health" },
        @{ Name = "arbitrage-bot"; Url = "http://127.0.0.1:4028/health" },
        @{ Name = "x402-gateway-v2"; Url = "http://127.0.0.1:4030/health" },
        @{ Name = "x402-eu"; Url = "http://127.0.0.1:4032/health" },
        @{ Name = "baas-api"; Url = "http://127.0.0.1:4029/health" },
        @{ Name = "x402-stats"; Url = "http://127.0.0.1:4030/x402/stats" }
    )
    foreach ($c in $checks) {
        try {
            $r = Invoke-RestMethod -Uri $c.Url -TimeoutSec 5
            Write-Host "  OK $($c.Name)" -ForegroundColor Green
        } catch {
            Write-Host "  FAIL $($c.Name) — $($_.Exception.Message)" -ForegroundColor Yellow
        }
    }

    if (-not $DryRun) {
        Write-Host "WARNING: Live mode requested — ensure compliance and bank rails are approved." -ForegroundColor Red
    } else {
        try {
            $body = '{"dry_run":true,"agent_id":"activate-script","wallet":"rActivateDemo000000000000000000","capital_troptions":0}'
            $cycle = Invoke-RestMethod -Method Post -Uri "http://127.0.0.1:4031/run-cycle" -Body $body -ContentType "application/json" -TimeoutSec 15
            Write-Host "  OK agent run-cycle (dry_run)" -ForegroundColor Green
        } catch {
            Write-Host "  SKIP run-cycle — start agent-orchestrator first" -ForegroundColor Yellow
        }
    }
}

Write-Host ""
Write-Host "Ports:" -ForegroundColor Cyan
Write-Host "  4031 agent-orchestrator | 4029 baas-api | 4030 x402-us | 4032 x402-eu | 4033 x402-jp"
Write-Host "  4731 MCP | 4020 backend x402 (Apostle) | 4040 baas-dashboard UI"
Write-Host ""
Write-Host "All exchange/agent revenue: PROJECTION (not $791K fact)" -ForegroundColor Yellow
Write-Host "Docs: docs/technical/TROPTIONS_REVENUE_ENGINE.md, MULTI_X402_MESH.md" -ForegroundColor Cyan
