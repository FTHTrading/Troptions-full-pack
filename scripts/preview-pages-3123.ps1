# Serve docs/ (GitHub Pages export) locally on port 3123 — same paths as production.
$ErrorActionPreference = "Stop"
$Root = Split-Path -Parent $PSScriptRoot
$Docs = Join-Path $Root "docs"

if (-not (Test-Path (Join-Path $Docs "index.html"))) {
    Write-Host "docs/index.html missing. Run: .\scripts\deploy-investor-site.ps1 -CopyToDocs" -ForegroundColor Yellow
    exit 1
}

Write-Host "Preview GitHub Pages export at http://localhost:3123/Troptions-full-pack/" -ForegroundColor Cyan
Push-Location $Docs
try {
    npx --yes serve . -p 3123
}
finally {
    Pop-Location
}
