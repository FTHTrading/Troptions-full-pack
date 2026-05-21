# Production deploy — Docker Compose (sovereign stack + nginx)
# Usage:
#   .\scripts\deploy-production.ps1
#   .\scripts\deploy-production.ps1 -Ssl   # prints certbot / Let's Encrypt steps (no auto TLS)
param(
    [switch]$Ssl,
    [switch]$DryRun
)

$ErrorActionPreference = "Stop"
$Root = Split-Path -Parent $PSScriptRoot
Set-Location $Root

$ComposeFile = Join-Path $Root "docker\docker-compose.prod.yml"
if (-not (Test-Path $ComposeFile)) { throw "Missing $ComposeFile" }

function Test-Cmd($name) {
    $cmd = Get-Command $name -ErrorAction SilentlyContinue
    if (-not $cmd) { throw "Missing prerequisite: $name" }
    return $cmd.Source
}

function Get-HttpHealth($url) {
    try {
        $r = Invoke-RestMethod -Uri $url -TimeoutSec 8
        return $r.status
    } catch { return "down" }
}

function Wait-L1Health {
    param([int]$TimeoutSec = 120)
    $body = '{"jsonrpc":"2.0","method":"state_get","params":{},"id":1}'
    $deadline = (Get-Date).AddSeconds($TimeoutSec)
    while ((Get-Date) -lt $deadline) {
        try {
            $r = Invoke-RestMethod -Uri "http://127.0.0.1:9944" -Method Post -Body $body -ContentType "application/json" -TimeoutSec 5
            if ($r.result) { return $true }
        } catch { Start-Sleep -Seconds 3 }
    }
    return $false
}

Write-Host "TROPTIONS Production Deploy (Docker)" -ForegroundColor Magenta

Write-Host "`n==> Checking Docker" -ForegroundColor Cyan
$docker = Test-Cmd "docker"
Write-Host "  docker: $docker"
docker compose version 2>$null | Out-Null
if ($LASTEXITCODE -ne 0) { throw "docker compose plugin required (Docker Desktop or compose v2)" }

if (-not (Test-Path ".env")) {
    if (Test-Path ".env.example") {
        Copy-Item ".env.example" ".env"
        Write-Host "  Created .env from .env.example — fill secrets before exposing publicly." -ForegroundColor Yellow
    } else {
        Write-Host "  Warning: no .env or .env.example at repo root." -ForegroundColor Yellow
    }
} else {
    Write-Host "  Using existing .env (not overwritten)." -ForegroundColor DarkGray
}

if ($Ssl) {
    Write-Host @"

==> SSL / Let's Encrypt (manual)
  1. Point DNS for fthedu.unykorn.org, ai.troptions.org, ttn.troptions.org, dao.troptions.org to this host.
  2. Ensure ports 80/443 are open; nginx config: infrastructure/nginx/sites/troptions.conf
  3. Example (certbot on host):
       certbot certonly --webroot -w /var/www/certbot -d dao.troptions.org -d ai.troptions.org ...
  4. Mount certs into nginx container volumes (adjust docker-compose.prod.yml or host nginx).
  See docs/DEPLOY_PRODUCTION.md for full checklist.

"@ -ForegroundColor Yellow
}

if ($DryRun) {
    Write-Host "[DRY RUN] Would run: docker compose -f docker/docker-compose.prod.yml up -d --build" -ForegroundColor Yellow
    exit 0
}

Write-Host "`n==> Building and starting stack" -ForegroundColor Cyan
docker compose -f $ComposeFile up -d --build
if ($LASTEXITCODE -ne 0) { throw "docker compose up failed" }

Write-Host "`n==> Waiting for L1 (:9944)" -ForegroundColor Cyan
if (Wait-L1Health) {
    Write-Host "  L1 healthy." -ForegroundColor Green
} else {
    Write-Host "  L1 not ready yet — check: docker compose -f docker/docker-compose.prod.yml logs l1" -ForegroundColor Yellow
}

Write-Host "`n==> Post-deploy health checks" -ForegroundColor Cyan
$checks = @(
    @{ Name = "DONK"; Url = "http://127.0.0.1:8090/health" },
    @{ Name = "FTH"; Url = "http://127.0.0.1:8091/health" },
    @{ Name = "TTN"; Url = "http://127.0.0.1:8092/health" },
    @{ Name = "DAO"; Url = "http://127.0.0.1:8093/health" }
)
foreach ($c in $checks) {
    $st = Get-HttpHealth $c.Url
    $color = if ($st -eq "ok") { "Green" } else { "Yellow" }
    Write-Host ("  {0,-6} {1} -> {2}" -f $c.Name, $c.Url, $st) -ForegroundColor $color
}

Write-Host "`n--- Next ---" -ForegroundColor Cyan
Write-Host "  Logs:    docker compose -f docker/docker-compose.prod.yml logs -f"
Write-Host "  Stop:    docker compose -f docker/docker-compose.prod.yml down"
Write-Host "  PM2 dev: .\scripts\quickstart.ps1 (alternative to Docker)"
Write-Host "  Docs:    docs/DEPLOY_PRODUCTION.md"
