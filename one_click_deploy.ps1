# One-click deploy for Windows (Bryan / PM2)
$ErrorActionPreference = "Stop"
$Root = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $Root

Write-Host "=== TROPTIONS one-click deploy (Windows) ==="

Write-Host "[1/4] L1 build + test"
Push-Location l1
cargo build -p node --release
cargo test --workspace
Pop-Location

Write-Host "[2/4] Python tests"
pip install -q -r backend/dao-service/requirements.txt pytest httpx 2>$null
python -m pytest tests/ -q --ignore=tests/integration/full_flow.py

Write-Host "[3/4] PM2 start (ecosystem.config.js)"
if (Get-Command pm2 -ErrorAction SilentlyContinue) {
    New-Item -ItemType Directory -Force -Path logs | Out-Null
    pm2 start ecosystem.config.js
} else {
    Write-Host "PM2 not in PATH — run: cargo run -p node --release -- 9944"
}

Write-Host "[4/4] Health"
try { Invoke-WebRequest -Uri "http://127.0.0.1:9945/metrics" -UseBasicParsing | Select-Object -Expand StatusCode } catch {}
try { Invoke-WebRequest -Uri "http://127.0.0.1:8093/health" -UseBasicParsing | Select-Object -Expand Content } catch {}

Write-Host "=== Done ==="
