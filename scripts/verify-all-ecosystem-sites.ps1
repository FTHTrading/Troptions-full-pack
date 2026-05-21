# Full HTTP audit of FTH / TROPTIONS / Unykorn ecosystem URLs.
# Writes a markdown report and prints a summary table.
param(
    [string]$ReportPath = "",
    [int]$TimeoutSec = 25,
    [switch]$UseGetForHealth
)

$ErrorActionPreference = "Continue"
$Root = Split-Path -Parent $PSScriptRoot
if (-not $ReportPath) {
    $ReportPath = Join-Path $Root "docs\ecosystem\last-verification.md"
}

$targets = @(
    @{ Group = "GitHub Pages"; Name = "Investor hub"; Url = "https://fthtrading.github.io/Troptions-full-pack/"; Kind = "Pages" },
    @{ Group = "GitHub Pages"; Name = "Ecosystem status hub"; Url = "https://fthtrading.github.io/Troptions-full-pack/ecosystem/"; Kind = "Pages" },
    @{ Group = "GitHub Pages"; Name = "T-Lev-8 deal room"; Url = "https://fthtrading.github.io/T-Lev-8-/"; Kind = "Pages" },
    @{ Group = "GitHub Pages"; Name = "Aurora RWA site"; Url = "https://fthtrading.github.io/aurora-site/"; Kind = "Pages" },
    @{ Group = "GitHub Pages"; Name = "Impact site"; Url = "https://fthtrading.github.io/impact-site/"; Kind = "Pages" },
    @{ Group = "GitHub Pages"; Name = "DAO public page"; Url = "https://fthtrading.github.io/Troptions-full-pack/dao/"; Kind = "Pages" },
    @{ Group = "GitHub Pages"; Name = "Mint DApp"; Url = "https://fthtrading.github.io/Troptions-full-pack/mint.html"; Kind = "Pages" },
    @{ Group = "GitHub Pages"; Name = "NFT gallery"; Url = "https://fthtrading.github.io/Troptions-full-pack/nft/"; Kind = "Pages" },
    @{ Group = "GitHub Pages"; Name = "Landing ai (Pages)"; Url = "https://fthtrading.github.io/Troptions-full-pack/sites/ai/"; Kind = "Pages" },
    @{ Group = "GitHub Pages"; Name = "Landing ttn (Pages)"; Url = "https://fthtrading.github.io/Troptions-full-pack/sites/ttn/"; Kind = "Pages" },
    @{ Group = "GitHub Pages"; Name = "Landing dao (Pages)"; Url = "https://fthtrading.github.io/Troptions-full-pack/sites/dao/"; Kind = "Pages" },
    @{ Group = "GitHub Pages"; Name = "Landing goat (Pages)"; Url = "https://fthtrading.github.io/Troptions-full-pack/sites/goat/"; Kind = "Pages" },
    @{ Group = "GitHub Pages"; Name = "Landing junior (Pages)"; Url = "https://fthtrading.github.io/Troptions-full-pack/sites/junior/"; Kind = "Pages" },
    @{ Group = "Unykorn LIVE"; Name = "TROPTIONS hub"; Url = "https://troptions.unykorn.org/troptions"; Kind = "Unykorn" },
    @{ Group = "Unykorn LIVE"; Name = "Exchange OS edge"; Url = "https://troptionsexchange.unykorn.org/exchange-os"; Kind = "Unykorn" },
    @{ Group = "Unykorn LIVE"; Name = "TTN sports"; Url = "https://troptionslive.unykorn.org/sports"; Kind = "Unykorn" },
    @{ Group = "Unykorn LIVE"; Name = "Solana launcher"; Url = "https://launch.unykorn.org"; Kind = "Unykorn" },
    @{ Group = "Unykorn LIVE"; Name = "FTH Academy"; Url = "https://fthedu.unykorn.org"; Kind = "Unykorn" },
    @{ Group = "Unykorn LIVE"; Name = "Portfolio registry"; Url = "https://portfolio.unykorn.org"; Kind = "Unykorn" },
    @{ Group = "Unykorn LIVE"; Name = "GoatX surface"; Url = "https://goat.unykorn.org"; Kind = "Unykorn" },
    @{ Group = "Unykorn LIVE"; Name = "Junior / Tilden OS"; Url = "https://junior.unykorn.org"; Kind = "Unykorn" },
    @{ Group = "Unykorn LIVE"; Name = "FIFA router"; Url = "https://fifa.unykorn.org"; Kind = "Unykorn" },
    @{ Group = "Unykorn LIVE"; Name = "WhichWay guest OS"; Url = "https://whichway.live"; Kind = "Unykorn" },
    @{ Group = "x402 mesh"; Name = "x402 health"; Url = "https://x402.unykorn.org/health"; Kind = "x402" },
    @{ Group = "x402 mesh"; Name = "Digital twin"; Url = "https://twin.unykorn.org"; Kind = "x402" },
    @{ Group = "x402 mesh"; Name = "x402 API docs"; Url = "https://x402api.unykorn.org"; Kind = "x402" },
    @{ Group = "External"; Name = "Genesis GSP (drunks.app)"; Url = "https://drunks.app"; Kind = "External" },
    @{ Group = "External"; Name = "GSP API Worker health"; Url = "https://gsp-api.kevanbtc.workers.dev/api/health"; Kind = "Worker" },
    @{ Group = "External"; Name = "Troptions Vercel"; Url = "https://troptions.vercel.app"; Kind = "Vercel" },
    @{ Group = "Future DNS"; Name = "ai.troptions.org"; Url = "https://ai.troptions.org"; Kind = "DNS-pending" },
    @{ Group = "Future DNS"; Name = "ttn.troptions.org"; Url = "https://ttn.troptions.org"; Kind = "DNS-pending" },
    @{ Group = "Future DNS"; Name = "dao.troptions.org"; Url = "https://dao.troptions.org"; Kind = "DNS-pending" },
    @{ Group = "Broken DNS"; Name = "aurora.unykorn.org"; Url = "https://aurora.unykorn.org"; Kind = "DNS-broken" },
    @{ Group = "Broken DNS"; Name = "impact.unykorn.org"; Url = "https://impact.unykorn.org"; Kind = "DNS-broken" }
)

function Get-UrlStatus {
    param([string]$Url, [int]$Timeout, [switch]$PreferGet)
    $method = if ($PreferGet -or $Url -match "/health") { "Get" } else { "Head" }
    try {
        $r = Invoke-WebRequest -Uri $Url -Method $method -TimeoutSec $Timeout -MaximumRedirection 5 -UseBasicParsing
        $code = [int]$r.StatusCode
        $badge = if ($code -ge 200 -and $code -lt 400) { "LIVE" } else { "CHECK" }
        return @{ Http = "$code"; Badge = $badge; Note = "" }
    } catch {
        if ($_.Exception.Response) {
            $code = [int]$_.Exception.Response.StatusCode
            $badge = switch ($code) {
                301 { "LIVE" }; 302 { "LIVE" }; 401 { "GATED" }; 403 { "GATED" }
                404 { "404" }; 502 { "ORIGIN" }; 522 { "ORIGIN" }; 523 { "ORIGIN" }; 524 { "TIMEOUT" }
                default { "CHECK" }
            }
            return @{ Http = "$code"; Badge = $badge; Note = "HTTP $code" }
        }
        $msg = $_.Exception.Message
        if ($msg -match "could not be resolved") {
            return @{ Http = "ERR"; Badge = "DNS"; Note = "NXDOMAIN / not pointed" }
        }
        if ($msg -match "timed out|timeout") {
            return @{ Http = "ERR"; Badge = "TIMEOUT"; Note = $msg }
        }
        return @{ Http = "ERR"; Badge = "ERR"; Note = $msg }
    }
}

$now = (Get-Date).ToUniversalTime().ToString("yyyy-MM-dd HH:mm") + " UTC"
$rows = @()
foreach ($t in $targets) {
    $st = Get-UrlStatus -Url $t.Url -Timeout $TimeoutSec -PreferGet:($UseGetForHealth -and $t.Url -match "health")
    $rows += [PSCustomObject]@{
        Group  = $t.Group
        Name   = $t.Name
        Url    = $t.Url
        Kind   = $t.Kind
        Http   = $st.Http
        Badge  = $st.Badge
        Note   = $st.Note
    }
    Start-Sleep -Milliseconds 150
}

$live = @($rows | Where-Object { $_.Badge -eq "LIVE" }).Count
$broken = @($rows | Where-Object { $_.Badge -in @("ORIGIN", "TIMEOUT", "502", "404", "ERR", "DNS") }).Count

$md = @(
    "# Ecosystem URL verification",
    "",
    "**Generated:** $now",
    "",
    "**Script:** ``scripts/verify-all-ecosystem-sites.ps1``",
    "",
    "Summary: **$live** LIVE · **$broken** need operator attention (of $($rows.Count) probed).",
    "",
    "| Group | Surface | URL | HTTP | Status |",
    "|-------|---------|-----|------|--------|"
)
foreach ($r in $rows) {
    $md += "| $($r.Group) | $($r.Name) | $($r.Url) | $($r.Http) | $($r.Badge) |"
}
$md += ""
$md += "## Operator actions"
$md += ""
$md += "- **twin / x402api / goat / junior (502/522):** restart tunnel + origin per [CLOUDFLARE_ORIGIN_FIX.md](../technical/CLOUDFLARE_ORIGIN_FIX.md)."
$md += "- **troptions.org subdomains:** use Pages landings under ``/sites/*`` until DNS cutover."
$md += "- **impact-site Pages:** fix deploy branch (404 on GitHub Pages project)."
$md += ""

$reportDir = Split-Path $ReportPath -Parent
if (-not (Test-Path $reportDir)) {
    New-Item -ItemType Directory -Path $reportDir -Force | Out-Null
}
$md -join "`n" | Set-Content -Path $ReportPath -Encoding utf8

Write-Host ""
Write-Host "## Ecosystem audit ($now)" -ForegroundColor Cyan
Write-Host ""
Write-Host "| Surface | HTTP | Status |"
Write-Host "|---------|------|--------|"
foreach ($r in $rows) {
    Write-Host "| $($r.Name) | $($r.Http) | $($r.Badge) |"
}
Write-Host ""
Write-Host "Report: $ReportPath" -ForegroundColor Green
Write-Host "LIVE: $live / $($rows.Count)" -ForegroundColor $(if ($broken -eq 0) { "Green" } else { "Yellow" })
