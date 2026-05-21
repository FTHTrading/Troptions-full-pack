# TROPTIONS EDU AI — Full Setup & Run
# DONK AI — One-shot deployment
# Requires: Node 18+, PowerShell 7+ (5.1 works with tweaks)

param(
    [switch]$SkipStripe,
    [switch]$SkipBuild,
    [switch]$AuditFix
)

$ErrorActionPreference = "Stop"
$ProjectDir = $PSScriptRoot

function Header([string]$text) {
    Write-Host "`n==============================================" -ForegroundColor Cyan
    Write-Host "  $text" -ForegroundColor White
    Write-Host "==============================================" -ForegroundColor Cyan
}

function Ok([string]$text) { Write-Host "  [OK] $text" -ForegroundColor Green }
function Warn([string]$text) { Write-Host "  [WARN] $text" -ForegroundColor Yellow }
function Fail([string]$text) { Write-Host "  [FAIL] $text" -ForegroundColor Red }

# ── PHASE 0: Environment ─────────────────────────────
Header "PHASE 0: Environment Check"

Set-Location $ProjectDir
Ok "Project dir: $ProjectDir"

# Check Node
$nodeVer = node --version 2>$null
if ($LASTEXITCODE -ne 0) { Fail "Node.js not found. Install from nodejs.org"; exit 1 }
Ok "Node.js $nodeVer"

# Check npm
$npmVer = npm --version 2>$null
Ok "npm $npmVer"

# ── PHASE 1: Dependencies ────────────────────────────
Header "PHASE 1: Dependencies"

if (Test-Path "$ProjectDir\node_modules") {
    Warn "node_modules exists — checking integrity"
    npm ls expo --silent 2>$null
    if ($LASTEXITCODE -ne 0) {
        Warn "Corrupt node_modules — wiping"
        Remove-Item -Recurse -Force "$ProjectDir\node_modules"
        Remove-Item -Force "$ProjectDir\package-lock.json" -ErrorAction SilentlyContinue
    } else {
        Ok "node_modules valid — skipping install"
    }
}

if (-not (Test-Path "$ProjectDir\node_modules")) {
    npm install --legacy-peer-deps 2>&1 | ForEach-Object {
        if ($_ -match "ERR!") { Write-Host "  $_" -ForegroundColor Red }
        elseif ($_ -match "WARN") { Write-Host "  $_" -ForegroundColor Yellow }
        else { Write-Host "  $_" -ForegroundColor Gray }
    }
    if ($LASTEXITCODE -ne 0) { Fail "npm install failed"; exit 1 }
}
Ok "Dependencies ready"

if ($AuditFix) {
    Warn "Running npm audit fix..."
    npm audit fix --legacy-peer-deps 2>&1 | Out-Null
    Ok "Audit fix applied"
}

# ── PHASE 2: Environment Variables ───────────────────
Header "PHASE 2: Environment Setup"

$envFile = "$ProjectDir\.env"
$envExample = "$ProjectDir\.env.example"

if (-not (Test-Path $envFile)) {
    if (Test-Path $envExample) {
        Copy-Item $envExample $envFile
        Warn "Created .env from .env.example — YOU MUST EDIT IT"
    } else {
        @"
# TROPTIONS EDU AI Environment
STRIPE_PUBLISHABLE_KEY=pk_live_YOUR_KEY_HERE
STRIPE_SECRET_KEY=sk_live_YOUR_KEY_HERE
ELEVENLABS_API_KEY=YOUR_KEY_HERE
SOLANA_RPC=https://api.mainnet-beta.solana.com
XRPL_NODE=wss://s1.ripple.com
API_BASE_URL=https://api.troptions.org
"@ | Set-Content $envFile
        Warn "Created blank .env — YOU MUST EDIT IT"
    }
}

$envContent = Get-Content $envFile -Raw
$hasStripePk = $envContent -match "pk_live_[a-zA-Z0-9]{20,}"
$hasStripeSk = $envContent -match "sk_live_[a-zA-Z0-9]{20,}"

if (-not $hasStripePk -or -not $hasStripeSk) {
    Warn "Stripe keys missing or placeholder in .env"
    if (-not $SkipStripe) {
        Write-Host "`n  Stripe Dashboard: https://dashboard.stripe.com/apikeys" -ForegroundColor Cyan
        Write-Host "  1. Copy pk_live_... and sk_live_..." -ForegroundColor White
        Write-Host "  2. Paste into $envFile`n" -ForegroundColor White
        $resp = Read-Host "  Press ENTER when done (or type SKIP to continue without Stripe)"
        if ($resp -eq "SKIP") { $SkipStripe = $true }
    }
}

if ($SkipStripe -or ($hasStripePk -and $hasStripeSk)) {
    Ok "Stripe config: $(if($SkipStripe){'SKIPPED'}else{'OK'})"
} else {
    Fail "Stripe still missing — run again or use -SkipStripe"
    exit 1
}

# ── PHASE 3: Build Check ─────────────────────────────
Header "PHASE 3: Build Verification"

if (-not $SkipBuild) {
    Write-Host "  Running TypeScript check..." -ForegroundColor Gray
    npx tsc --noEmit 2>&1 | ForEach-Object { Write-Host "    $_" -ForegroundColor Gray }
    if ($LASTEXITCODE -ne 0) { Warn "TypeScript errors found — check output above" }
    else { Ok "TypeScript clean" }
}

# ── PHASE 4: Launch ──────────────────────────────────
Header "PHASE 4: Launch Options"

Write-Host "`n  [1] Web Preview    — expo start --web" -ForegroundColor Cyan
Write-Host "  [2] iOS Simulator  — expo start --ios" -ForegroundColor Cyan
Write-Host "  [3] Android        — expo start --android" -ForegroundColor Cyan
Write-Host "  [4] Tunnel (cloudflared) — share via public URL" -ForegroundColor Cyan
Write-Host "  [5] EAS Build      — cloud build for stores" -ForegroundColor Cyan
Write-Host "  [Q] Quit`n" -ForegroundColor Cyan

$choice = Read-Host "  Select 1-5 or Q"

switch ($choice) {
    "1" {
        Ok "Starting web preview..."
        npx expo start --web
    }
    "2" {
        Ok "Starting iOS simulator..."
        npx expo start --ios
    }
    "3" {
        Ok "Starting Android..."
        npx expo start --android
    }
    "4" {
        Ok "Starting with tunnel..."
        npx expo start --tunnel
    }
    "5" {
        Header "EAS Build"
        Write-Host "  [a] Android APK" -ForegroundColor Cyan
        Write-Host "  [i] iOS" -ForegroundColor Cyan
        $plat = Read-Host "  Select a/i"
        if ($plat -eq "a") { eas build --platform android --profile preview }
        elseif ($plat -eq "i") { eas build --platform ios }
    }
    default {
        Write-Host "`n  Later. Run again when ready." -ForegroundColor Yellow
    }
}

Write-Host "`n  1-888-690-DONK — TROPTIONS out." -ForegroundColor Green
