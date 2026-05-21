# Start full TROPTIONS sovereign stack in dependency order (Windows).
# Usage: .\scripts\quickstart-all.ps1 [-DryRun]
param(
    [switch]$DryRun
)

$ErrorActionPreference = "Stop"
$Root = Split-Path -Parent $PSScriptRoot
Set-Location $Root

function Write-Step($msg) { Write-Host "`n==> $msg" -ForegroundColor Cyan }
function Test-Cmd($name) {
    $cmd = Get-Command $name -ErrorAction SilentlyContinue
    if (-not $cmd) { throw "Missing prerequisite: $name (install and ensure it is on PATH)" }
    return $cmd.Source
}

function Wait-L1Health {
    param([int]$TimeoutSec = 90)
    $body = '{"jsonrpc":"2.0","method":"state_get","params":{},"id":1}'
    $deadline = (Get-Date).AddSeconds($TimeoutSec)
    while ((Get-Date) -lt $deadline) {
        try {
            $r = Invoke-RestMethod -Uri "http://127.0.0.1:9944" -Method Post -Body $body -ContentType "application/json" -TimeoutSec 3
            if ($r.result) { return $true }
        } catch { Start-Sleep -Seconds 2 }
    }
    return $false
}

function Get-HttpHealth($url) {
    try {
        $r = Invoke-RestMethod -Uri $url -TimeoutSec 5
        return $r.status
    } catch { return "down" }
}

Write-Host "TROPTIONS Full Stack Quickstart" -ForegroundColor Magenta
if ($DryRun) { Write-Host "[DRY RUN] No processes will be started." -ForegroundColor Yellow }

Write-Step "Checking prerequisites"
$pm2Path = Test-Cmd "pm2"
$pythonPath = Test-Cmd "python"
$cargoPath = Test-Cmd "cargo"
Write-Host "  pm2:    $pm2Path"
Write-Host "  python: $pythonPath"
Write-Host "  cargo:  $cargoPath"

$l1Bin = $env:L1_NODE_BIN
if (-not $l1Bin) {
    $releaseBin = Join-Path $Root "l1\target\release\troptions-node.exe"
    if (Test-Path $releaseBin) { $l1Bin = $releaseBin }
    else { $l1Bin = "C:\cargo-target-burnzy\release\troptions-node.exe" }
}
Write-Host "  L1 bin: $l1Bin"

if (-not (Test-Path ".env")) {
    if ($DryRun) {
        Write-Host "  Would copy .env.example -> .env" -ForegroundColor Yellow
    } else {
        Copy-Item ".env.example" ".env"
        Write-Host "  Created .env from .env.example — fill secrets locally." -ForegroundColor Yellow
    }
}

$ecosystem = Join-Path $Root "ecosystem.config.js"
if (-not (Test-Path $ecosystem)) { throw "Missing ecosystem.config.js at repo root" }

if ($DryRun) {
    Write-Step "Would install Python deps (fth, dao, donk, ttn)"
    Write-Step "Would build L1: cargo build -p node --release"
    Write-Step "Would pm2 start troptions-l1-node only, wait for :9944"
    Write-Step "Would pm2 start donk-ai-tutor, fth-backend, ttn-launcher, dao-service"
    Write-Step "Would run health-check-all.ps1"
    exit 0
}

Write-Step "Installing Python dependencies"
pip install -q -r backend/fth-academy/requirements.txt
pip install -q -r backend/dao-service/requirements.txt
pip install -q -r ai/donk-tutor/requirements.txt
pip install -q -r backend/ttn-launcher/requirements.txt

Write-Step "Initializing DAO SQLite"
python -c "import sys; sys.path.insert(0,'backend/shared'); from dao_db import init_dao_db; init_dao_db(); print('dao_state.db ready')"

if (-not (Test-Path $l1Bin)) {
    Write-Step "Building L1 node (release)"
    Push-Location (Join-Path $Root "l1")
    cargo build -p node --release
    Pop-Location
    $built = Join-Path $Root "l1\target\release\troptions-node.exe"
    if (Test-Path $built) { $env:L1_NODE_BIN = $built }
}

New-Item -ItemType Directory -Force -Path (Join-Path $Root "logs") | Out-Null

Write-Step "Starting L1 node (port 9944)"
pm2 delete troptions-l1-node 2>$null | Out-Null
$env:L1_NODE_BIN = if ($env:L1_NODE_BIN) { $env:L1_NODE_BIN } else { $l1Bin }
pm2 start $ecosystem --only troptions-l1-node

Write-Step "Waiting for L1 health on :9944"
if (-not (Wait-L1Health)) {
    Write-Host "L1 did not become healthy in time. Check: pm2 logs troptions-l1-node" -ForegroundColor Red
    exit 1
}
Write-Host "  L1 is healthy." -ForegroundColor Green

Write-Step "Starting backends and DAO (8090-8093)"
foreach ($app in @("donk-ai-tutor", "fth-backend", "ttn-launcher", "dao-service")) {
    pm2 delete $app 2>$null | Out-Null
    pm2 start $ecosystem --only $app
    Start-Sleep -Seconds 1
}

pm2 save | Out-Null

Write-Step "Service status"
& "$PSScriptRoot\health-check-all.ps1"

Write-Host "`n--- URLs ---" -ForegroundColor Cyan
$rows = @(
    @{ Service = "L1 RPC"; Url = "http://127.0.0.1:9944"; Note = "JSON-RPC state_get" },
    @{ Service = "DONK"; Url = "http://127.0.0.1:8090/health"; Note = "AI tutor" },
    @{ Service = "FTH Academy"; Url = "http://127.0.0.1:8091/health"; Note = "Revenue + /dao/*" },
    @{ Service = "TTN"; Url = "http://127.0.0.1:8092/health"; Note = "Namespaces" },
    @{ Service = "DAO"; Url = "http://127.0.0.1:8093"; Note = "API + dashboard" }
)
$rows | Format-Table -AutoSize
Write-Host "PM2: pm2 status | pm2 logs" -ForegroundColor DarkGray
