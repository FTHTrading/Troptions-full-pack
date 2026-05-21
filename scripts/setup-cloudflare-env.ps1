# Writes Cloudflare zone/API credentials into repo-root .env (gitignored).
# Run from repo root:  .\scripts\setup-cloudflare-env.ps1
# NEVER commit .env or the source credential txt files.

$ErrorActionPreference = "Stop"
$RepoRoot = Split-Path -Parent $PSScriptRoot
$EnvPath = Join-Path $RepoRoot ".env"
$ExamplePath = Join-Path $RepoRoot ".env.example"

$DefaultSource = Join-Path $env:USERPROFILE "OneDrive - FTH Trading\11-Downloads\Read all resources API token was su.txt"
$SourcePath = if ($args.Count -ge 1) { $args[0] } else { $DefaultSource }

function Read-TextFile([string]$Path) {
    if (-not (Test-Path -LiteralPath $Path)) {
        Write-Warning "Missing file: $Path"
        return $null
    }
    return Get-Content -LiteralPath $Path -Raw
}

function Get-CfutToken([string]$Text) {
    if (-not $Text) { return $null }
    $matches = [regex]::Matches($Text, 'cfut_[A-Za-z0-9]+')
    if ($matches.Count -ge 1) { return $matches[0].Value }
    return $null
}

function Get-AccountId([string]$Text) {
    if (-not $Text) { return $null }
    $m = [regex]::Match($Text, '(?i)(?:account[_\s-]?id|accountid)\s*[:=]\s*([a-f0-9]{32})')
    if ($m.Success) { return $m.Groups[1].Value }
    return $null
}

if (-not (Test-Path -LiteralPath $EnvPath)) {
    if (Test-Path -LiteralPath $ExamplePath) {
        Copy-Item -LiteralPath $ExamplePath -Destination $EnvPath -Force
    } else {
        New-Item -ItemType File -Path $EnvPath -Force | Out-Null
    }
}

$text = Read-TextFile $SourcePath
$apiToken = Get-CfutToken $text
$accountId = Get-AccountId $text
if (-not $accountId -and $env:CLOUDFLARE_ACCOUNT_ID) {
    $accountId = $env:CLOUDFLARE_ACCOUNT_ID
}

$content = Get-Content -LiteralPath $EnvPath -Raw

function Set-EnvLine([string]$Name, [string]$Value) {
    if (-not $Value) { return $script:content }
    $pattern = "(?m)^$([regex]::Escape($Name))=.*$"
    $line = "$Name=$Value"
    if ($script:content -match $pattern) {
        $script:content = $script:content -replace $pattern, $line
    } else {
        $script:content = $script:content.TrimEnd() + "`n$line`n"
    }
    return $script:content
}

if ($apiToken) {
    $content = Set-EnvLine "CLOUDFLARE_API_TOKEN" $apiToken
    $suffix = if ($apiToken.Length -ge 4) { $apiToken.Substring($apiToken.Length - 4) } else { "????" }
    Write-Host "Set CLOUDFLARE_API_TOKEN (…$suffix) in $EnvPath" -ForegroundColor Green
} else {
    Write-Warning "No cfut_ token found in $SourcePath"
}

if ($accountId) {
    $content = Set-EnvLine "CLOUDFLARE_ACCOUNT_ID" $accountId
    Write-Host "Set CLOUDFLARE_ACCOUNT_ID in $EnvPath" -ForegroundColor Green
} else {
    Write-Host "CLOUDFLARE_ACCOUNT_ID not in source file - add manually (Cloudflare dashboard, Overview)." -ForegroundColor Yellow
}

Set-Content -LiteralPath $EnvPath -Value $content -NoNewline
Write-Host "Wrote $EnvPath (gitignored). Use docs/technical/CLOUDFLARE_ORIGIN_FIX.md for twin/x402api." -ForegroundColor Cyan
