# Cloudflare zone/DNS/origin status for Unykorn AI + x402 hostnames.
# Usage: .\scripts\cloudflare-status.ps1
# Requires CLOUDFLARE_API_TOKEN in repo-root .env (never commit).

$ErrorActionPreference = "Continue"
$Root = Split-Path -Parent $PSScriptRoot
$EnvPath = Join-Path $Root ".env"

function Get-EnvValue([string]$Name) {
    if (-not (Test-Path $EnvPath)) { return $null }
    $line = Get-Content $EnvPath | Where-Object { $_ -match "^${Name}=" } | Select-Object -First 1
    if (-not $line) { return $null }
    return ($line -split "=", 2)[1].Trim().Trim('"')
}

$token = Get-EnvValue "CLOUDFLARE_API_TOKEN"
if (-not $token) { $token = $env:CLOUDFLARE_API_TOKEN }
if (-not $token) {
    Write-Host "PENDING: CLOUDFLARE_API_TOKEN not set in .env" -ForegroundColor Yellow
    exit 1
}

$suffix = if ($token.Length -ge 4) { $token.Substring($token.Length - 4) } else { "????" }
Write-Host "CF token: ***$suffix" -ForegroundColor DarkGray

$headers = @{ Authorization = "Bearer $token" }
$zoneName = "unykorn.org"
$zoneId = Get-EnvValue "CLOUDFLARE_ZONE_ID"
if (-not $zoneId) { $zoneId = "8aa6916f4c1c7e8e42130455dfd5c029" }

Write-Host "`n== Zones (name filter: unykorn) =="
try {
    $zones = Invoke-RestMethod -Uri "https://api.cloudflare.com/client/v4/zones?name=$zoneName" -Headers $headers
    if ($zones.success) {
        foreach ($z in $zones.result) {
            Write-Host ("  {0} | {1} | {2}" -f $z.name, $z.id, $z.status)
        }
    } else {
        Write-Host "  API error: $($zones.errors | ConvertTo-Json -Compress)" -ForegroundColor Red
    }
} catch {
    Write-Host "  $($_.Exception.Message)" -ForegroundColor Red
}

$hostnames = @(
    "goat.unykorn.org",
    "junior.unykorn.org",
    "jr.unykorn.org",
    "tilden.unykorn.org",
    "twin.unykorn.org",
    "x402api.unykorn.org",
    "x402.unykorn.org",
    "portfolio.unykorn.org",
    "fifa.unykorn.org"
)

Write-Host "`n== DNS (zone $zoneName) =="
foreach ($fq in $hostnames) {
    try {
        $r = Invoke-RestMethod -Uri "https://api.cloudflare.com/client/v4/zones/$zoneId/dns_records?name=$fq" -Headers $headers
        if ($r.result.Count -gt 0) {
            $rec = $r.result[0]
            Write-Host ("  {0,-28} {1,-6} {2,-48} proxied={3}" -f $fq, $rec.type, $rec.content, $rec.proxied)
        } else {
            Write-Host ("  {0,-28} NO RECORD" -f $fq) -ForegroundColor Yellow
        }
    } catch {
        Write-Host ("  {0,-28} ERR: {1}" -f $fq, $_.Exception.Message) -ForegroundColor Red
    }
}

Write-Host "`n== Origin health (HTTPS HEAD, 25s) =="
foreach ($fq in $hostnames) {
    $url = if ($fq -eq "x402.unykorn.org") { "https://$fq/health" } else { "https://$fq" }
    try {
        $resp = Invoke-WebRequest -Uri $url -Method Head -TimeoutSec 25 -UseBasicParsing
        $label = if ($resp.StatusCode -ge 200 -and $resp.StatusCode -lt 400) { "CONFIRMED" } else { "PENDING" }
        $color = if ($label -eq "CONFIRMED") { "Green" } else { "Yellow" }
        Write-Host ("  {0,-12} {1} HTTP {2}" -f $label, $fq, $resp.StatusCode) -ForegroundColor $color
    } catch {
        $code = if ($_.Exception.Response) { [int]$_.Exception.Response.StatusCode } else { "ERR" }
        Write-Host ("  PENDING     {0} HTTP {1}" -f $fq, $code) -ForegroundColor Yellow
    }
}

Write-Host "`n== Local origins (operator host) =="
$localPorts = @(
    @{ Name = "goat site"; Port = 8850 },
    @{ Name = "junior API"; Port = 4099 },
    @{ Name = "tilden UI"; Port = 3000 },
    @{ Name = "tilden-api"; Port = 4001 },
    @{ Name = "x402-gateway"; Port = 4020 },
    @{ Name = "popeye"; Port = 4021 },
    @{ Name = "dao-service"; Port = 8093 },
    @{ Name = "donk"; Port = 8090 }
)
foreach ($lp in $localPorts) {
    try {
        $tcp = Get-NetTCPConnection -LocalPort $lp.Port -State Listen -ErrorAction Stop | Select-Object -First 1
        if ($tcp) { Write-Host ("  LISTEN  :{0} ({1})" -f $lp.Port, $lp.Name) -ForegroundColor Green }
    } catch {
        Write-Host ("  DOWN    :{0} ({1})" -f $lp.Port, $lp.Name) -ForegroundColor DarkYellow
    }
}

Write-Host "`nDocs: docs/technical/CLOUDFLARE_SERVICES.md | CLOUDFLARE_ORIGIN_FIX.md"
