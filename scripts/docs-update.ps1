# Regenerate system manifest PM2 table + technical HTML for GitHub Pages.
$ErrorActionPreference = "Stop"
$Root = Split-Path -Parent $PSScriptRoot
Set-Location $Root

Write-Host "docs:update — generate-system-manifest.py" -ForegroundColor Cyan
python (Join-Path $PSScriptRoot "generate-system-manifest.py")
if ($LASTEXITCODE -ne 0) { throw "generate-system-manifest.py failed" }

Write-Host "docs:update — sync-technical-html.ps1" -ForegroundColor Cyan
& (Join-Path $PSScriptRoot "sync-technical-html.ps1")
if ($LASTEXITCODE -ne 0) { throw "sync-technical-html.ps1 failed" }

Write-Host "docs:update complete." -ForegroundColor Green
