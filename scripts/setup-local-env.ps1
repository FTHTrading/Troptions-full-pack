# Copies operator Desktop credential files into repo-root .env (gitignored).
# Run once locally:  .\scripts\setup-local-env.ps1
# NEVER commit .env or the Desktop source txt files.

$ErrorActionPreference = "Stop"
$RepoRoot = Split-Path -Parent $PSScriptRoot
$EnvPath = Join-Path $RepoRoot ".env"
$ExamplePath = Join-Path $RepoRoot ".env.example"

$Sources = @{
    Cloudflare = "$env:USERPROFILE\OneDrive - FTH Trading\Desktop\Workers AI API token was successful - Copy - Copy.txt"
    Telnyx     = "$env:USERPROFILE\OneDrive - FTH Trading\Desktop\tele2 api.txt"
    ElevenLabs = "$env:USERPROFILE\OneDrive - FTH Trading\Desktop\eleven labs.txt"
}

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
    if ($matches.Count -ge 3) { return $matches[2].Value }
    if ($matches.Count -ge 1) { return $matches[0].Value }
    return $null
}

function Get-TelnyxKey([string]$Text) {
    if (-not $Text) { return $null }
    $m = [regex]::Match($Text, 'KEY[0-9A-Fa-f_]+')
    if ($m.Success) { return $m.Value }
    return $null
}

function Get-ElevenKey([string]$Text) {
    if (-not $Text) { return $null }
    $m = [regex]::Match($Text, 'sk_[A-Za-z0-9]+')
    if ($m.Success) { return $m.Value }
    return $null
}

# Start from .env.example template
if (Test-Path -LiteralPath $ExamplePath) {
    Copy-Item -LiteralPath $ExamplePath -Destination $EnvPath -Force
} else {
    New-Item -ItemType File -Path $EnvPath -Force | Out-Null
}

$cfText = Read-TextFile $Sources.Cloudflare
$txText = Read-TextFile $Sources.Telnyx
$elText = Read-TextFile $Sources.ElevenLabs

$cfToken = Get-CfutToken $cfText
$telnyxKey = Get-TelnyxKey $txText
$elevenKey = Get-ElevenKey $elText

$content = Get-Content -LiteralPath $EnvPath -Raw
$accountId = $env:CLOUDFLARE_ACCOUNT_ID
if (-not $accountId) {
    Write-Host "CLOUDFLARE_ACCOUNT_ID not in environment — add it to .env manually after this script." -ForegroundColor Yellow
}

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

if ($cfToken) {
    $content = Set-EnvLine "CLOUDFLARE_WORKERS_AI_TOKEN" $cfToken
    $content = Set-EnvLine "WORKERS_AI_API_TOKEN" $cfToken
}
if ($accountId) {
    $content = Set-EnvLine "CLOUDFLARE_ACCOUNT_ID" $accountId
}
if ($telnyxKey) {
    $content = Set-EnvLine "TELNYX_API_KEY" $telnyxKey
}
if ($elevenKey) {
    $content = Set-EnvLine "ELEVENLABS_API_KEY" $elevenKey
}

$content = Set-EnvLine "TELECOM_DRY_RUN" "true"
$content = Set-EnvLine "WORKERS_AI_ENABLED" "0"

Set-Content -LiteralPath $EnvPath -Value $content -NoNewline
Write-Host "Wrote $EnvPath (gitignored). Review TELECOM_DRY_RUN and WORKERS_AI_ENABLED before production." -ForegroundColor Green
Write-Host "Live Glass Q&A: start donk-tutor, then open site with ?api=http://127.0.0.1:8090" -ForegroundColor Cyan
