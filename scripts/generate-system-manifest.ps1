# Sync PM2 table + IOU revenue section into SYSTEM_MANIFEST.md
$ErrorActionPreference = "Stop"
$Root = Split-Path -Parent $PSScriptRoot
Set-Location $Root

Write-Host "generate-system-manifest.py" -ForegroundColor Cyan
python (Join-Path $PSScriptRoot "generate-system-manifest.py")
if ($LASTEXITCODE -ne 0) { throw "generate-system-manifest.py failed (exit $LASTEXITCODE)" }

Write-Host "Done." -ForegroundColor Green
