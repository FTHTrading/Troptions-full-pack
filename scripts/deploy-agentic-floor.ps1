# Deploy agent orchestration floor (PM2 + demo agent registration)
param(
    [switch]$DryRun = $true,
    [string]$AgentId = "agent-demo",
    [string]$Wallet = "rAgentDemo0000000000000000000000"
)

$ErrorActionPreference = "Stop"
$Root = Split-Path -Parent $PSScriptRoot
$Fiat = Join-Path $Root "fiat-rails"

Write-Host "deploy-agentic-floor — DryRun=$DryRun" -ForegroundColor Cyan

$envPath = Join-Path $Fiat "agent-orchestrator\.env"
if (-not (Test-Path $envPath)) {
    Copy-Item (Join-Path $Fiat "agent-orchestrator\.env.template") $envPath
}

Push-Location $Fiat
$dryFlag = if ($DryRun) { "true" } else { "false" }
pm2 start ecosystem.config.js --only agent-orchestrator,x402-gateway-v2,x402-eu,x402-jp,baas-api,arbitrage-bot --update-env 2>$null
pm2 set agent-orchestrator:DRY_RUN $dryFlag 2>$null
Pop-Location

Start-Sleep -Seconds 2

try {
    $regBody = @{
        agent_id = $AgentId
        wallet = $Wallet
        capital_troptions = 100000
    } | ConvertTo-Json
    $reg = Invoke-RestMethod -Method Post -Uri "http://127.0.0.1:4029/api/v1/agents" -Body $regBody -ContentType "application/json" -TimeoutSec 10
    Write-Host "  OK registered $AgentId on baas-api :4029" -ForegroundColor Green
} catch {
    Write-Host "  WARN baas register — $($_.Exception.Message)" -ForegroundColor Yellow
}

try {
    $startBody = @{ agent_id = $AgentId } | ConvertTo-Json
    Invoke-RestMethod -Method Post -Uri "http://127.0.0.1:4031/agents/start" -Body $startBody -ContentType "application/json" -TimeoutSec 10 | Out-Null
    Write-Host "  OK agent-orchestrator /agents/start" -ForegroundColor Green
} catch {
    Write-Host "  WARN agents/start — $($_.Exception.Message)" -ForegroundColor Yellow
}

if ($DryRun) {
    try {
        $cycleBody = @{
            agent_id = $AgentId
            wallet = $Wallet
            capital_troptions = 100000
            dry_run = $true
        } | ConvertTo-Json
        Invoke-RestMethod -Method Post -Uri "http://127.0.0.1:4031/run-cycle" -Body $cycleBody -ContentType "application/json" -TimeoutSec 20 | Out-Null
        Write-Host "  OK run-cycle (dry_run)" -ForegroundColor Green
    } catch {
        Write-Host "  WARN run-cycle — $($_.Exception.Message)" -ForegroundColor Yellow
    }
}

Write-Host ""
Write-Host "Agentic floor ports:" -ForegroundColor Cyan
Write-Host "  4031 orchestrator | 4029 baas-api | 4030 x402-us | 4032 x402-eu | 4033 x402-jp | 4731 MCP"
Write-Host "All agent revenue: PROJECTION" -ForegroundColor Yellow
