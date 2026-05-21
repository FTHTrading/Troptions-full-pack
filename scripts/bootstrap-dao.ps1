# Bootstrap TROPTIONS Full DAO stack (Windows)
$ErrorActionPreference = "Stop"
$Root = Split-Path -Parent $PSScriptRoot
Set-Location $Root

Write-Host "=== TROPTIONS DAO Bootstrap ===" -ForegroundColor Magenta

if (-not (Test-Path ".env")) {
    Copy-Item ".env.example" ".env"
    Write-Host "Created .env from .env.example — fill secrets locally." -ForegroundColor Yellow
}

Write-Host "Installing Python deps..."
pip install -r backend/fth-academy/requirements.txt -q
pip install -r backend/dao-service/requirements.txt -q
pip install -r ai/donk-tutor/requirements.txt -q
pip install -r backend/ttn-launcher/requirements.txt -q

Write-Host "Initializing DAO SQLite..."
python -c "import sys; sys.path.insert(0,'backend/shared'); from dao_db import init_dao_db; init_dao_db(); print('dao_state.db ready')"

Write-Host "Building L1 (release node)..."
Set-Location l1
cargo build -p node --release
Set-Location $Root

Write-Host "Starting PM2 ecosystem..."
pm2 start ecosystem.config.js
pm2 save

Write-Host "Done. Dashboard: http://127.0.0.1:8093" -ForegroundColor Green
Write-Host "L1 RPC: http://127.0.0.1:9944" -ForegroundColor Green
