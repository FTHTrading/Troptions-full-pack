# Activate local AI + x402 backends (PM2) and probe dependencies.
# Usage: .\scripts\activate-ai-stack.ps1 [-SkipPm2] [-StartGoat]
# Never prints secrets from .env.

param(
    [switch]$SkipPm2,
    [switch]$StartGoat
)

$ErrorActionPreference = "Continue"
$Root = Split-Path -Parent $PSScriptRoot
Set-Location $Root

$EnvPath = Join-Path $Root ".env"
function Set-EnvLine([string]$Key, [string]$Value) {
    if (-not (Test-Path $EnvPath)) {
        Copy-Item (Join-Path $Root ".env.example") $EnvPath -ErrorAction SilentlyContinue
    }
    $content = if (Test-Path $EnvPath) { Get-Content $EnvPath -Raw } else { "" }
    if ($content -match "(?m)^${Key}=") {
        $content = [regex]::Replace($content, "(?m)^${Key}=.*", "${Key}=$Value")
    } else {
        $content += "`n${Key}=$Value`n"
    }
    Set-Content -Path $EnvPath -Value $content.TrimEnd() -NoNewline
    Add-Content -Path $EnvPath -Value "`n"
}

Write-Host "== TROPTIONS AI + x402 activation ==" -ForegroundColor Cyan

# x402 upstream alignment (monorepo sidecar -> local UnyKorn gateway on :4020)
Set-EnvLine "X402_UPSTREAM" "http://127.0.0.1:4020"
Set-EnvLine "X402_MODE" "production"
$env:X402_UPSTREAM = "http://127.0.0.1:4020"
$env:X402_MODE = "production"
Write-Host "CONFIRMED  X402_UPSTREAM=http://127.0.0.1:4020 (gitignored .env)"

Write-Host "`n== Ollama (DONK) =="
try {
    $tags = Invoke-RestMethod "http://127.0.0.1:11434/api/tags" -TimeoutSec 5
    $n = @($tags.models).Count
    Write-Host "CONFIRMED  Ollama :11434 ($n models)" -ForegroundColor Green
} catch {
    Write-Host "PENDING    Ollama not reachable on :11434 - start Ollama for DONK" -ForegroundColor Yellow
}

Write-Host "`n== Apostle :7332 =="
try {
    $a = Invoke-WebRequest "http://127.0.0.1:7332/health" -TimeoutSec 5 -UseBasicParsing
    Write-Host "CONFIRMED  Apostle health HTTP $($a.StatusCode)" -ForegroundColor Green
} catch {
    Write-Host "PENDING    Apostle :7332 - run scripts/deploy_apostle.ps1 then start chain" -ForegroundColor Yellow
}

if (-not $SkipPm2) {
    Write-Host "`n== PM2 ecosystem =="
    if (-not (Test-Path (Join-Path $Root "logs"))) { New-Item -ItemType Directory -Path (Join-Path $Root "logs") | Out-Null }
    $eco = Join-Path $Root "ecosystem.config.cjs"
    if (-not (Test-Path $eco)) {
        Copy-Item (Join-Path $Root "ecosystem.config.js") $eco -Force
    }
    pm2 start $eco 2>$null
    pm2 save 2>$null
    pm2 list
}

$services = @(
    @{ Port = 8090; Name = "donk-ai-tutor" },
    @{ Port = 8091; Name = "fth-backend" },
    @{ Port = 8092; Name = "ttn-launcher" },
    @{ Port = 8093; Name = "dao-service" },
    @{ Port = 4020; Name = "x402-gateway" },
    @{ Port = 4021; Name = "popeye-relay" }
)

Write-Host "`n== Service health =="
foreach ($s in $services) {
    try {
        Invoke-RestMethod "http://127.0.0.1:$($s.Port)/health" -TimeoutSec 4 | Out-Null
        Write-Host ("CONFIRMED  {0} :{1}/health" -f $s.Name, $s.Port) -ForegroundColor Green
    } catch {
        Write-Host ("PENDING    {0} :{1}" -f $s.Name, $s.Port) -ForegroundColor Yellow
    }
}

Write-Host "`n== Workers AI (dao-service proxy) =="
try {
    $w = Invoke-RestMethod "http://127.0.0.1:8093/ai/workers/status" -TimeoutSec 8
    if ($w.enabled) {
        Write-Host "CONFIRMED  WORKERS_AI_ENABLED via dao-service" -ForegroundColor Green
    } else {
        Write-Host "PENDING    Set WORKERS_AI_ENABLED=1 in .env and restart dao-service" -ForegroundColor Yellow
    }
} catch {
    Write-Host "PENDING    GET /ai/workers/status - dao-service or Workers AI token" -ForegroundColor Yellow
}

if ($StartGoat) {
    $goatRoot = "C:\Users\Kevan\iCloudDrive\Archives\projects\goat-launch"
    if (Test-Path (Join-Path $goatRoot "server.js")) {
        Write-Host "`n== Goat origin (:8850) =="
        $listen = Get-NetTCPConnection -LocalPort 8850 -State Listen -ErrorAction SilentlyContinue
        if (-not $listen) {
            Start-Process -FilePath "node" -ArgumentList "server.js" -WorkingDirectory $goatRoot -WindowStyle Hidden
            Start-Sleep -Seconds 2
        }
        try {
            $g = Invoke-WebRequest "http://127.0.0.1:8850/" -TimeoutSec 5 -UseBasicParsing
            Write-Host "CONFIRMED  goat-launch :8850 HTTP $($g.StatusCode)" -ForegroundColor Green
        } catch {
            Write-Host "PENDING    goat-launch server" -ForegroundColor Yellow
        }
    }
}

Write-Host "`n== Public x402 =="
try {
    $pub = Invoke-RestMethod "https://x402.unykorn.org/health" -TimeoutSec 20
    if ($pub.ok) { Write-Host "CONFIRMED  x402.unykorn.org/health" -ForegroundColor Green }
    else { Write-Host "PENDING    x402 public health ok!=true" -ForegroundColor Yellow }
} catch {
    Write-Host "PENDING    x402.unykorn.org/health - $($_.Exception.Message)" -ForegroundColor Yellow
}
Write-Host "PENDING    twin.unykorn.org / x402api.unykorn.org - EC2 origin (see CLOUDFLARE_SERVICES.md)"

Write-Host ""
Write-Host "Done. Truth labels: scripts/truth_labels.ps1"
