$Apostle = if ($env:APOSTLE_CHAIN_PATH) { $env:APOSTLE_CHAIN_PATH } else { "C:\Users\Kevan\apostle-chain" }
if (-not (Test-Path $Apostle)) { Write-Error "Apostle not found at $Apostle"; exit 1 }
Push-Location $Apostle
cargo build --release
Pop-Location
Write-Host "Start Apostle on http://127.0.0.1:7332 per upstream runbook"
