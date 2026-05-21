# Verify public FTH / TROPTIONS ecosystem URLs (HTTP HEAD).
# Outputs markdown table to stdout and optionally updates truth-labels JSON.
param(
    [switch]$UpdateTruthLabels,
    [string]$TruthLabelsPath = ""
)

$ErrorActionPreference = "Continue"
$Root = Split-Path -Parent $PSScriptRoot
if (-not $TruthLabelsPath) {
    $candidates = @(
        (Join-Path $Root "docs\technical\assets\data\truth-labels.json"),
        (Join-Path $Root "docs\data\truth-labels.json"),
        (Join-Path $Root "sites\investor\public\data\truth-labels.json")
    )
    $TruthLabelsPath = ($candidates | Where-Object { Test-Path $_ } | Select-Object -First 1)
    if (-not $TruthLabelsPath) {
        $TruthLabelsPath = Join-Path $Root "sites\investor\public\data\truth-labels.json"
    }
}

$targets = @(
    @{ Name = "Troptions-full-pack Pages"; Url = "https://fthtrading.github.io/Troptions-full-pack/" },
    @{ Name = "T-Lev-8 Pages"; Url = "https://fthtrading.github.io/T-Lev-8-/" },
    @{ Name = "aurora-site Pages"; Url = "https://fthtrading.github.io/aurora-site/" },
    @{ Name = "impact-site Pages"; Url = "https://fthtrading.github.io/impact-site/" },
    @{ Name = "troptions.unykorn.org hub"; Url = "https://troptions.unykorn.org/troptions" },
    @{ Name = "troptionsexchange.unykorn.org"; Url = "https://troptionsexchange.unykorn.org/exchange-os" },
    @{ Name = "troptionslive.unykorn.org sports"; Url = "https://troptionslive.unykorn.org/sports" },
    @{ Name = "launch.unykorn.org"; Url = "https://launch.unykorn.org" },
    @{ Name = "fthedu.unykorn.org"; Url = "https://fthedu.unykorn.org" },
    @{ Name = "x402.unykorn.org health"; Url = "https://x402.unykorn.org/health" },
    @{ Name = "twin.unykorn.org"; Url = "https://twin.unykorn.org" },
    @{ Name = "x402api.unykorn.org"; Url = "https://x402api.unykorn.org" },
    @{ Name = "troptions.vercel.app"; Url = "https://troptions.vercel.app" },
    @{ Name = "portfolio.unykorn.org"; Url = "https://portfolio.unykorn.org" },
    @{ Name = "goat.unykorn.org"; Url = "https://goat.unykorn.org" },
    @{ Name = "whichway.live"; Url = "https://whichway.live" },
    @{ Name = "fifa.unykorn.org"; Url = "https://fifa.unykorn.org" },
    @{ Name = "aurora.unykorn.org"; Url = "https://aurora.unykorn.org" },
    @{ Name = "impact.unykorn.org"; Url = "https://impact.unykorn.org" },
    @{ Name = "ai.troptions.org"; Url = "https://ai.troptions.org" },
    @{ Name = "ttn.troptions.org"; Url = "https://ttn.troptions.org" },
    @{ Name = "dao.troptions.org"; Url = "https://dao.troptions.org" },
    @{ Name = "drunks.app (Genesis GSP)"; Url = "https://drunks.app" },
    @{ Name = "gsp-api health"; Url = "https://gsp-api.kevanbtc.workers.dev/api/health" },
    @{ Name = "genesis-world GitHub"; Url = "https://github.com/FTHTrading/genesis-world" }
)

$rows = @()
$now = (Get-Date).ToUniversalTime().ToString("yyyy-MM-dd")

foreach ($t in $targets) {
    $status = "ERR"
    $note = ""
    try {
        $r = Invoke-WebRequest -Uri $t.Url -Method Head -TimeoutSec 20 -MaximumRedirection 5 -UseBasicParsing
        $status = [string]$r.StatusCode
        $note = if ($r.StatusCode -ge 200 -and $r.StatusCode -lt 400) { "LIVE" } else { "CHECK" }
    } catch {
        if ($_.Exception.Response) {
            $status = [string][int]$_.Exception.Response.StatusCode
            $note = "HTTP $status"
        } else {
            $status = "ERR"
            $note = $_.Exception.Message
        }
    }
    $rows += [PSCustomObject]@{
        Name   = $t.Name
        Url    = $t.Url
        Http   = $status
        Truth  = $note
        Date   = $now
    }
}

Write-Host ""
Write-Host "## Ecosystem URL verification ($now UTC)" -ForegroundColor Cyan
Write-Host ""
Write-Host "| Surface | URL | HTTP | Truth |"
Write-Host "|---------|-----|------|-------|"
foreach ($row in $rows) {
    Write-Host "| $($row.Name) | $($row.Url) | $($row.Http) | $($row.Truth) |"
}

if ($UpdateTruthLabels -and (Test-Path $TruthLabelsPath)) {
    $json = Get-Content $TruthLabelsPath -Raw | ConvertFrom-Json
    $liveRows = $rows | Where-Object { $_.Http -eq "200" }
    $pendingRows = $rows | Where-Object { $_.Http -ne "200" }

    $ecosystemLabels = @()
    foreach ($row in $liveRows) {
        $ecosystemLabels += @{
            label     = $row.Name
            status    = "CONFIRMED"
            lastCheck = $now
            proof     = "$($row.Url) HTTP $($row.Http)"
        }
    }
    foreach ($row in $pendingRows) {
        $ecosystemLabels += @{
            label     = $row.Name
            status    = "PENDING"
            lastCheck = $now
            proof     = "$($row.Url) HTTP $($row.Http) - not live"
        }
    }

    $keep = @($json.labels | Where-Object {
            $_.label -notmatch "unykorn\.org|troptions\.org|vercel\.app|github\.io/T-Lev|github\.io/aurora|github\.io/impact|whichway\.live|portfolio\.unykorn"
        })
    $json.labels = $keep + $ecosystemLabels
    $json.generated = (Get-Date).ToUniversalTime().ToString("o")
    $json.source = "scripts/verify-ecosystem-links.ps1 + scripts/truth_labels.ps1"

    $json | ConvertTo-Json -Depth 6 | Set-Content $TruthLabelsPath -Encoding utf8
    $investorCopy = Join-Path $Root "sites\investor\public\data\truth-labels.json"
    if (Test-Path (Split-Path $investorCopy -Parent)) {
        Copy-Item $TruthLabelsPath $investorCopy -Force
    }
    Write-Host ""
    Write-Host "Updated: $TruthLabelsPath" -ForegroundColor Green
}

Write-Host ""
Write-Host "Done. See docs/technical/ECOSYSTEM_MAP.md for repo matrix." -ForegroundColor DarkGray
