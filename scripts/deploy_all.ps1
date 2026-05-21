# TROPTIONS full deploy — Windows
$ErrorActionPreference = "Continue"
$Root = Split-Path -Parent $PSScriptRoot
Set-Location $Root

Write-Host "== Build L1 =="
Set-Location "$Root\l1"
cargo build --release -p node
Set-Location $Root

Write-Host "== Apostle (optional) =="
& "$Root\scripts\deploy_apostle.ps1"

$env:X402_MODE = if ($env:X402_MODE) { $env:X402_MODE } else { "production" }
Write-Host "== x402 stack =="
$Eco = if (Test-Path "$Root\ecosystem.config.cjs") { "$Root\ecosystem.config.cjs" } else { "$Root\ecosystem.config.js" }
pm2 start $Eco --only x402-gateway,popeye-relay 2>$null

Write-Host "== PM2 full ecosystem =="
pm2 start $Eco 2>$null

Write-Host "== Truth labels =="
& "$Root\scripts\truth_labels.ps1"

Write-Host "Done. See X402_INTEGRATION_REPORT.md"
