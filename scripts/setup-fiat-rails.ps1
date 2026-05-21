# TROPTIONS Fiat Rails - One-Click Setup Script
# Run from monorepo root: .\scripts\setup-fiat-rails.ps1

$ErrorActionPreference = "Stop"

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "TROPTIONS FIAT RAILS SETUP" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if we're in the right directory
if (-not (Test-Path "fiat-rails")) {
 Write-Host "ERROR: Run this script from the monorepo root (where fiat-rails/ exists)" -ForegroundColor Red
 exit 1
}

$Services = @(
 @{Name="payment-orchestrator"; Port=4022; Script="index.js"; Type="node"},
 @{Name="fedwire-adapter"; Port=4023; Script="server.js"; Type="node"},
 @{Name="swift-bridge"; Port=4024; Script="app.js"; Type="node"},
 @{Name="compliance-engine"; Port=4025; Script="main.py"; Type="python"},
 @{Name="neobank-api"; Port=4026; Script="server.js"; Type="node"},
 @{Name="iou-reserve-monitor"; Port=4027; Script="monitor.js"; Type="node"},
 @{Name="arbitrage-bot"; Port=4028; Script="bot.js"; Type="node"},
 @{Name="baas-dashboard"; Port=4029; Script="dashboard.js"; Type="node"}
)

# Install dependencies
Write-Host "Installing dependencies..." -ForegroundColor Yellow
foreach ($svc in $Services) {
 $svcPath = "fiat-rails/$($svc.Name)"
 if ($svc.Type -eq "node") {
 if (Test-Path "$svcPath/package.json") {
 Write-Host "  Installing Node deps for $($svc.Name)..."
 Push-Location $svcPath
 npm install
 Pop-Location
 }
 } elseif ($svc.Type -eq "python") {
 if (Test-Path "$svcPath/requirements.txt") {
 Write-Host "  Installing Python deps for $($svc.Name)..."
 Push-Location $svcPath
 python -m venv venv 2>$null
 ./venv/Scripts/Activate.ps1
 pip install -r requirements.txt
 deactivate
 Pop-Location
 }
 }
}

# Create logs directory
if (-not (Test-Path "fiat-rails/logs")) {
 New-Item -ItemType Directory -Path "fiat-rails/logs" | Out-Null
}

# Check if .env exists
if (-not (Test-Path "fiat-rails/.env")) {
 Write-Host ""
 Write-Host "WARNING: fiat-rails/.env not found!" -ForegroundColor Red
 Write-Host "Please copy fiat-rails/.env.template to fiat-rails/.env and fill in your credentials." -ForegroundColor Yellow
 Write-Host ""
} else {
 Write-Host "Found fiat-rails/.env" -ForegroundColor Green
}

# Start services with PM2
Write-Host ""
Write-Host "Starting services with PM2..." -ForegroundColor Yellow

# Check if PM2 is installed
$pm2Check = Get-Command pm2 -ErrorAction SilentlyContinue
if (-not $pm2Check) {
 Write-Host "PM2 not found. Installing globally..." -ForegroundColor Yellow
 npm install -g pm2
}

pm2 start fiat-rails/ecosystem.config.js

# Save PM2 config
pm2 save

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "FIAT RAILS DEPLOYED!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Services Status:"
foreach ($svc in $Services) {
 Write-Host "  $($svc.Name): http://localhost:$($svc.Port)" -ForegroundColor Cyan
}
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "  1. Configure fiat-rails/.env with your bank credentials" -ForegroundColor White
Write-Host "  2. Test: POST http://localhost:4022/api/v1/payments/wire" -ForegroundColor White
Write-Host "  3. Monitor: pm2 logs payment-orchestrator" -ForegroundColor White
Write-Host "  4. Dashboard: http://localhost:4029/dashboard" -ForegroundColor White
Write-Host ""
Write-Host "PM2 Dashboard: https://app.pm2.io/#/r/eizgr36ucgz5fpt" -ForegroundColor Cyan
